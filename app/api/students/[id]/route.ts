import { NextRequest } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken, hasPermission } from '@/lib/auth';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import {
    successResponse,
    unauthorizedResponse,
    badRequestResponse,
    notFoundResponse,
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

// GET - 학생 상세 정보
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;

        if (!ObjectId.isValid(id)) {
            return badRequestResponse('유효하지 않은 학생 ID입니다.');
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.STUDENTS);

        const student = await collection.findOne({ _id: new ObjectId(id) });

        if (!student) {
            return notFoundResponse('학생을 찾을 수 없습니다.');
        }

        return successResponse({
            ...student,
            _id: student._id.toString(),
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// PUT - 학생 정보 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;

        if (!ObjectId.isValid(id)) {
            return badRequestResponse('유효하지 않은 학생 ID입니다.');
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
            attendance,
            projects,
            competitions,
            learningNotes,
            portfolio,
            image,
        } = body;

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.STUDENTS);

        // 학생 존재 확인
        const existingStudent = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingStudent) {
            return notFoundResponse('학생을 찾을 수 없습니다.');
        }

        // 업데이트할 데이터 구성
        const updateData: Record<string, unknown> = {
            updatedAt: new Date(),
        };

        if (name !== undefined) updateData.name = name;
        if (grade !== undefined) updateData.grade = grade;
        if (studentClass !== undefined) updateData.class = studentClass;
        if (level !== undefined) updateData.level = level;
        if (parentName !== undefined) updateData.parentName = parentName;
        if (parentPhone !== undefined) updateData.parentPhone = parentPhone;
        if (parentEmail !== undefined) updateData.parentEmail = parentEmail;
        if (enrolledCourses !== undefined) updateData.enrolledCourses = enrolledCourses;
        if (attendance !== undefined) updateData.attendance = attendance;
        if (projects !== undefined) updateData.projects = projects;
        if (competitions !== undefined) updateData.competitions = competitions;
        if (learningNotes !== undefined) updateData.learningNotes = learningNotes;
        if (portfolio !== undefined) updateData.portfolio = portfolio;
        if (image !== undefined) updateData.image = image;

        // 출석률 자동 계산
        if (updateData.attendance) {
            const { totalClasses, attendedClasses } = updateData.attendance;
            if (totalClasses > 0) {
                updateData.attendance.rate = Math.round((attendedClasses / totalClasses) * 100);
            } else {
                updateData.attendance.rate = 0;
            }
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return notFoundResponse('학생을 찾을 수 없습니다.');
        }

        // 업데이트된 학생 정보 조회
        const updatedStudent = await collection.findOne({ _id: new ObjectId(id) });

        return successResponse(
            {
                ...updatedStudent,
                _id: updatedStudent!._id.toString(),
            },
            '학생 정보가 수정되었습니다.'
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

// DELETE - 학생 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;

        if (!ObjectId.isValid(id)) {
            return badRequestResponse('유효하지 않은 학생 ID입니다.');
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.STUDENTS);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return notFoundResponse('학생을 찾을 수 없습니다.');
        }

        return successResponse(null, '학생이 삭제되었습니다.');
    } catch (error) {
        return handleMongoError(error);
    }
}

