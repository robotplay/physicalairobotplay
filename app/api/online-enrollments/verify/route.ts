import { NextRequest } from 'next/server';
import { verifyEnrollmentToken } from '@/lib/enrollment-token';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { successResponse, badRequestResponse, notFoundResponse, handleMongoError } from '@/lib/api-response';

/**
 * GET: 토큰으로 수강 신청 검증
 * Query: ?token=xxx
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return badRequestResponse('토큰이 필요합니다.');
        }

        // 토큰 검증
        const payload = await verifyEnrollmentToken(token);
        if (!payload) {
            return badRequestResponse('유효하지 않거나 만료된 토큰입니다.');
        }

        // DB에서 수강 신청 정보 확인
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.ONLINE_ENROLLMENTS);
        
        const enrollment = await collection.findOne({
            id: payload.enrollmentId,
            courseId: payload.courseId,
        });

        if (!enrollment) {
            return notFoundResponse('수강 신청 정보를 찾을 수 없습니다.');
        }

        return successResponse({
            verified: true,
            enrollment: {
                id: enrollment.id,
                courseId: enrollment.courseId,
                courseTitle: enrollment.courseTitle,
                studentName: enrollment.studentName,
                status: enrollment.status,
                paymentStatus: enrollment.paymentStatus,
            },
            student: {
                name: payload.studentName,
                email: payload.studentEmail,
            },
        }, '수강 신청이 확인되었습니다.');
    } catch (error) {
        return handleMongoError(error);
    }
}

/**
 * POST: 접근 코드로 수강 신청 검증
 * Body: { code: string, courseId?: string }
 */
export async function POST(request: NextRequest) {
    try {
        const { code, courseId } = await request.json();

        if (!code) {
            return badRequestResponse('접근 코드가 필요합니다.');
        }

        // DB에서 접근 코드로 수강 신청 찾기
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.ONLINE_ENROLLMENTS);
        
        const query: { accessCode: string; courseId?: string } = { accessCode: code.toUpperCase() };
        if (courseId) {
            query.courseId = courseId;
        }

        const enrollment = await collection.findOne(query);

        if (!enrollment) {
            return notFoundResponse('유효하지 않은 접근 코드입니다.');
        }

        return successResponse({
            verified: true,
            enrollment: {
                id: enrollment.id,
                courseId: enrollment.courseId,
                courseTitle: enrollment.courseTitle,
                studentName: enrollment.studentName,
                status: enrollment.status,
                paymentStatus: enrollment.paymentStatus,
            },
            accessToken: enrollment.accessToken, // 검증 성공 시 토큰 제공
        }, '수강 신청이 확인되었습니다.');
    } catch (error) {
        return handleMongoError(error);
    }
}





