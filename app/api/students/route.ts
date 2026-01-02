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

// GET - 학생 목록 조회 (필터링, 검색 지원)
export async function GET(request: NextRequest) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const { searchParams } = new URL(request.url);
        const grade = searchParams.get('grade'); // 학년 필터
        const search = searchParams.get('search'); // 검색어 (이름, 학부모명)
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.STUDENTS);

        // 쿼리 구성
        const query: Record<string, unknown> = {};
        if (grade) {
            query.grade = grade;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { parentName: { $regex: search, $options: 'i' } },
                { parentPhone: { $regex: search, $options: 'i' } },
            ];
        }

        // 전체 개수 조회
        const total = await collection.countDocuments(query);

        // 학생 목록 조회
        const students = await collection
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        const formattedStudents = students.map((student) => ({
            ...student,
            _id: student._id.toString(),
        }));

        return successResponse({
            students: formattedStudents,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// POST - 학생 등록
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const body = await request.json();
        const {
            name,
            grade,
            class: studentClass,
            level,
            parentName,
            parentPhone,
            parentEmail,
            enrolledCourses,
            learningNotes,
        } = body;

        // 필수 필드 검증
        if (!name || !grade || !studentClass || !level || !parentName || !parentPhone) {
            return badRequestResponse(
                '필수 항목을 입력해주세요.',
                '학생명, 학년, 반, 교육수준, 학부모명, 학부모 연락처는 필수입니다.'
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.STUDENTS);

        // 학생 ID 생성
        const studentId = `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 학생 데이터 생성
        const studentData = {
            studentId,
            name,
            grade,
            class: studentClass,
            level,
            parentName,
            parentPhone,
            parentEmail: parentEmail || '',
            enrolledCourses: enrolledCourses || [],
            attendance: {
                totalClasses: 0,
                attendedClasses: 0,
                rate: 0,
            },
            projects: [],
            competitions: [],
            learningNotes: learningNotes || '',
            portfolio: {
                images: [],
                videos: [],
                description: '',
            },
            image: studentImage || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(studentData);

        return successResponse(
            {
                ...studentData,
                _id: result.insertedId.toString(),
            },
            '학생이 등록되었습니다.',
            201
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

