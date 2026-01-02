import { NextRequest } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken, hasPermission } from '@/lib/auth';
import { cookies } from 'next/headers';
import {
    successResponse,
    unauthorizedResponse,
    badRequestResponse,
    handleMongoError,
} from '@/lib/api-response';
import type { AttendanceRecord, AttendanceQuery, Student } from '@/types';

// 권한 체크 헬퍼 함수
async function checkAuth(requiredRole: 'admin' | 'teacher' = 'admin') {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return { authorized: false, error: '인증되지 않았습니다.' };
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return { authorized: false, error: '유효하지 않은 토큰입니다.' };
    }

    if (!hasPermission(payload.role, requiredRole)) {
        return { authorized: false, error: '권한이 없습니다.' };
    }

    return { authorized: true, user: payload };
}

// GET - 출석 기록 조회 (admin, teacher, parent 모두 가능)
export async function GET(request: NextRequest) {
    try {
        // 인증 확인 (parent도 조회 가능)
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        let payload = null;
        
        if (token) {
            payload = await verifyToken(token);
        }

        const { searchParams } = new URL(request.url);
        let studentId = searchParams.get('studentId');
        const classDate = searchParams.get('classDate'); // YYYY-MM-DD 형식
        const studentClass = searchParams.get('class'); // 반 필터
        const month = searchParams.get('month'); // YYYY-MM 형식

        // parent 역할인 경우 자신의 자녀만 조회 가능
        if (payload && payload.role === 'parent' && payload.studentId) {
            studentId = payload.studentId;
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.ATTENDANCE);
        const studentsCollection = db.collection(COLLECTIONS.STUDENTS);

        const query: AttendanceQuery = {};
        if (studentId) {
            query.studentId = studentId;
        }
        if (classDate) {
            const startOfDay = new Date(classDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(classDate);
            endOfDay.setHours(23, 59, 59, 999);
            query.classDate = { $gte: startOfDay, $lte: endOfDay };
        }
        if (month) {
            const [year, monthNum] = month.split('-');
            const startOfMonth = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
            const endOfMonth = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59, 999);
            query.classDate = { $gte: startOfMonth, $lte: endOfMonth };
        }
        if (studentClass) {
            query.studentClass = studentClass;
        }

        const attendanceRecords = await collection
            .find(query)
            .sort({ classDate: -1 })
            .toArray() as unknown as AttendanceRecord[];

        // 학생 정보 조회
        const studentIds = [...new Set(attendanceRecords.map((r: AttendanceRecord) => r.studentId))];
        const students = await studentsCollection
            .find({ studentId: { $in: studentIds } })
            .toArray() as unknown as Student[];
        const studentMap = new Map(students.map((s: Student) => [s.studentId, s]));

        const formattedRecords = attendanceRecords.map((record: AttendanceRecord) => {
            const idString = record._id 
                ? (typeof record._id === 'string' 
                    ? record._id 
                    : (typeof record._id === 'object' && 'toString' in record._id
                        ? record._id.toString()
                        : String(record._id)))
                : '';
            return {
                ...record,
                _id: idString,
                studentName: studentMap.get(record.studentId)?.name || '',
                studentGrade: studentMap.get(record.studentId)?.grade || '',
            };
        });

        return successResponse({
            records: formattedRecords,
            count: formattedRecords.length,
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// POST - 출석 기록 생성/수정 (반별 일괄 처리 가능)
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const body = await request.json();
        const { classDate, studentClass, records } = body; // records: [{ studentId, status, notes }]

        if (!classDate || !studentClass || !records || !Array.isArray(records)) {
            return badRequestResponse(
                '필수 항목을 입력해주세요.',
                '수업일, 반, 출석 기록은 필수입니다.'
            );
        }

        const db = await getDatabase();
        const attendanceCollection = db.collection(COLLECTIONS.ATTENDANCE);
        const studentsCollection = db.collection(COLLECTIONS.STUDENTS);

        const classDateObj = new Date(classDate);
        classDateObj.setHours(0, 0, 0, 0);

        const results: Array<AttendanceRecord & { _id: string }> = [];
        const studentUpdates: Array<{ studentId: string; status: string }> = [];

        // 각 학생의 출석 기록 처리
        for (const record of records) {
            const { studentId, status, notes } = record; // status: 'present' | 'absent' | 'late' | 'excused'

            if (!studentId || !status) {
                continue;
            }

            // 기존 출석 기록 확인
            const existingRecord = await attendanceCollection.findOne({
                studentId,
                classDate: classDateObj,
                studentClass,
            });

            const attendanceData = {
                studentId,
                studentClass,
                classDate: classDateObj,
                status,
                notes: notes || '',
                recordedBy: auth.user!.userId,
                recordedAt: new Date(),
                updatedAt: new Date(),
            };

            if (existingRecord) {
                // 수정
                await attendanceCollection.updateOne(
                    { _id: existingRecord._id },
                    { $set: attendanceData }
                );
                results.push({ ...attendanceData, _id: existingRecord._id.toString() });
            } else {
                // 신규 생성
                const attendanceId = `attendance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const newRecord = {
                    attendanceId,
                    ...attendanceData,
                };
                const insertResult = await attendanceCollection.insertOne(newRecord);
                results.push({ ...newRecord, _id: insertResult.insertedId.toString() });
            }

            // 학생의 출석 통계 업데이트를 위한 정보 수집
            studentUpdates.push({ studentId, status });
        }

        // 학생별 출석 통계 업데이트 (전체 출석 기록 기반)
        const uniqueStudentIds = [...new Set(studentUpdates.map(u => u.studentId))];
        
        for (const studentId of uniqueStudentIds) {
            const student = await studentsCollection.findOne({ studentId });
            if (!student) {
                console.log(`Student not found: ${studentId}`);
                continue;
            }

            // 전체 출석 기록 조회 (월별 제한 없이)
            const allRecords = await attendanceCollection.find({
                studentId: studentId,
            }).toArray();

            const totalClasses = allRecords.length;
            const attendedClasses = (allRecords as unknown as AttendanceRecord[]).filter(
                (r: AttendanceRecord) => r.status === 'present' || r.status === 'late'
            ).length;
            const attendanceRate = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

            console.log(`Updating attendance for ${studentId}:`, {
                name: student.name,
                totalClasses,
                attendedClasses,
                attendanceRate,
            });

            // 학생 출석 통계 업데이트
            const updateResult = await studentsCollection.updateOne(
                { studentId: studentId },
                {
                    $set: {
                        'attendance.totalClasses': totalClasses,
                        'attendance.attendedClasses': attendedClasses,
                        'attendance.rate': attendanceRate,
                        updatedAt: new Date(),
                    },
                }
            );

            console.log(`Update result for ${studentId}:`, {
                matchedCount: updateResult.matchedCount,
                modifiedCount: updateResult.modifiedCount,
            });
        }

        return successResponse(
            {
                records: results,
                count: results.length,
            },
            '출석 기록이 저장되었습니다.',
            201
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

