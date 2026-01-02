import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import {
    successResponse,
    unauthorizedResponse,
    badRequestResponse,
    notFoundResponse,
    handleMongoError,
} from '@/lib/api-response';

// GET - 학생 ID로 학생 정보 조회 (parent도 자신의 자녀만 조회 가능)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ studentId: string }> | { studentId: string } }
) {
    try {
        const resolvedParams = await Promise.resolve(params);
        const { studentId } = resolvedParams;

        if (!studentId) {
            return badRequestResponse('학생 ID가 필요합니다.');
        }

        // 인증 확인
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;
        
        if (!token) {
            return unauthorizedResponse('인증되지 않았습니다.');
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return unauthorizedResponse('유효하지 않은 토큰입니다.');
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.STUDENTS);

        // 학생 조회
        const student = await collection.findOne({ studentId });

        if (!student) {
            return notFoundResponse('학생을 찾을 수 없습니다.');
        }

        // parent 역할인 경우 자신의 자녀만 조회 가능
        if (payload.role === 'parent') {
            if (payload.studentId !== studentId) {
                return unauthorizedResponse('권한이 없습니다.');
            }
        } else if (payload.role !== 'admin' && payload.role !== 'teacher') {
            return unauthorizedResponse('권한이 없습니다.');
        }

        // 학생 데이터 반환 (image 필드 포함)
        const studentData = {
            ...student,
            _id: student._id.toString(),
            image: student.image || undefined, // image 필드 명시적으로 포함
        };

        return successResponse(studentData);
    } catch (error) {
        return handleMongoError(error);
    }
}

