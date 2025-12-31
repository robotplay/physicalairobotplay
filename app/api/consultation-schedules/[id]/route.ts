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

// PUT - 상담 일정 수정
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
            return badRequestResponse('유효하지 않은 상담 일정 ID입니다.');
        }

        const body = await request.json();
        const { scheduledDate, duration, type, notes, status } = body;

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.CONSULTATION_SCHEDULES);

        const existingSchedule = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingSchedule) {
            return notFoundResponse('상담 일정을 찾을 수 없습니다.');
        }

        const updateData: any = {
            updatedAt: new Date(),
        };

        if (scheduledDate !== undefined) updateData.scheduledDate = new Date(scheduledDate);
        if (duration !== undefined) updateData.duration = duration;
        if (type !== undefined) updateData.type = type;
        if (notes !== undefined) updateData.notes = notes;
        if (status !== undefined) updateData.status = status;

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return notFoundResponse('상담 일정을 찾을 수 없습니다.');
        }

        const updatedSchedule = await collection.findOne({ _id: new ObjectId(id) });

        return successResponse(
            {
                ...updatedSchedule,
                _id: updatedSchedule!._id.toString(),
            },
            '상담 일정이 수정되었습니다.'
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

// DELETE - 상담 일정 삭제
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
            return badRequestResponse('유효하지 않은 상담 일정 ID입니다.');
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.CONSULTATION_SCHEDULES);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return notFoundResponse('상담 일정을 찾을 수 없습니다.');
        }

        return successResponse(null, '상담 일정이 삭제되었습니다.');
    } catch (error) {
        return handleMongoError(error);
    }
}

