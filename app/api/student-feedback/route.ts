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

// GET - 피드백 목록 조회 (teacher 또는 parent)
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return unauthorizedResponse('인증되지 않았습니다.');
        }

        const payload = await verifyToken(token);
        if (!payload) {
            return unauthorizedResponse('유효하지 않은 토큰입니다.');
        }

        // teacher 또는 parent 권한 확인
        if (payload.role !== 'teacher' && payload.role !== 'parent' && payload.role !== 'admin') {
            return unauthorizedResponse('권한이 없습니다.');
        }

        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');
        const teacherId = searchParams.get('teacherId');
        const courseId = searchParams.get('courseId');

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.STUDENT_FEEDBACK);

        const query: any = {};
        
        // parent 역할인 경우 자신의 자녀만 조회 가능
        if (payload.role === 'parent' && payload.studentId) {
            query.studentId = payload.studentId;
        } else {
            if (studentId) {
                query.studentId = studentId;
            }
        }
        
        if (teacherId) {
            query.teacherId = teacherId;
        }
        if (courseId) {
            query.courseId = courseId;
        }

        const feedbacks = await collection
            .find(query)
            .sort({ date: -1 })
            .toArray();

        const formattedFeedbacks = feedbacks.map((feedback) => ({
            ...feedback,
            _id: feedback._id.toString(),
        }));

        return successResponse({
            feedbacks: formattedFeedbacks,
            count: formattedFeedbacks.length,
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// POST - 피드백 작성
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAuth('teacher');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const body = await request.json();
        const { studentId, courseId, content, strengths, improvements, nextSteps } = body;

        if (!studentId || !courseId || !content) {
            return badRequestResponse(
                '필수 항목을 입력해주세요.',
                '학생, 과목, 내용은 필수입니다.'
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.STUDENT_FEEDBACK);

        const feedbackId = `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const feedbackData = {
            feedbackId,
            studentId,
            teacherId: auth.user!.userId,
            courseId,
            date: new Date(),
            content,
            strengths: strengths || [],
            improvements: improvements || [],
            nextSteps: nextSteps || '',
            createdAt: new Date(),
        };

        const result = await collection.insertOne(feedbackData);

        return successResponse(
            {
                ...feedbackData,
                _id: result.insertedId.toString(),
            },
            '피드백이 작성되었습니다.',
            201
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

