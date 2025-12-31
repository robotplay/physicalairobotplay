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

// GET - 상담 일정 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const studentId = searchParams.get('studentId');
        const date = searchParams.get('date'); // YYYY-MM-DD
        const status = searchParams.get('status'); // pending, completed, cancelled

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.CONSULTATION_SCHEDULES);

        const query: any = {};
        if (studentId) {
            query.studentId = studentId;
        }
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.scheduledDate = { $gte: startOfDay, $lte: endOfDay };
        }
        if (status) {
            query.status = status;
        }

        const schedules = await collection
            .find(query)
            .sort({ scheduledDate: 1 })
            .toArray();

        const formattedSchedules = schedules.map((schedule) => ({
            ...schedule,
            _id: schedule._id.toString(),
        }));

        return successResponse({
            schedules: formattedSchedules,
            count: formattedSchedules.length,
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// POST - 상담 일정 생성
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const body = await request.json();
        const { studentId, scheduledDate, duration, type, notes, parentPhone } = body;

        if (!studentId || !scheduledDate) {
            return badRequestResponse(
                '필수 항목을 입력해주세요.',
                '학생, 상담 일시는 필수입니다.'
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.CONSULTATION_SCHEDULES);

        const scheduleId = `consultation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const scheduleData = {
            scheduleId,
            studentId,
            scheduledDate: new Date(scheduledDate),
            duration: duration || 30, // 분 단위
            type: type || 'general', // general, enrollment, progress, issue
            notes: notes || '',
            parentPhone: parentPhone || '',
            status: 'pending', // pending, completed, cancelled, no-show
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(scheduleData);

        // TODO: 학부모에게 문자 발송 (상담 일정 안내)

        return successResponse(
            {
                ...scheduleData,
                _id: result.insertedId.toString(),
            },
            '상담 일정이 등록되었습니다.',
            201
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

