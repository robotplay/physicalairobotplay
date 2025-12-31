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

// PUT - FAQ 수정
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
            return badRequestResponse('유효하지 않은 FAQ ID입니다.');
        }

        const body = await request.json();
        const { category, question, answer, order, isActive } = body;

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.FAQ);

        // FAQ 존재 확인
        const existingFaq = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingFaq) {
            return notFoundResponse('FAQ를 찾을 수 없습니다.');
        }

        // 업데이트할 데이터 구성
        const updateData: any = {
            updatedAt: new Date(),
        };

        if (category !== undefined) updateData.category = category;
        if (question !== undefined) updateData.question = question;
        if (answer !== undefined) updateData.answer = answer;
        if (order !== undefined) updateData.order = order;
        if (isActive !== undefined) updateData.isActive = isActive;

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return notFoundResponse('FAQ를 찾을 수 없습니다.');
        }

        // 업데이트된 FAQ 조회
        const updatedFaq = await collection.findOne({ _id: new ObjectId(id) });

        return successResponse(
            {
                ...updatedFaq,
                _id: updatedFaq!._id.toString(),
            },
            'FAQ가 수정되었습니다.'
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

// DELETE - FAQ 삭제
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
            return badRequestResponse('유효하지 않은 FAQ ID입니다.');
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.FAQ);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return notFoundResponse('FAQ를 찾을 수 없습니다.');
        }

        return successResponse(null, 'FAQ가 삭제되었습니다.');
    } catch (error) {
        return handleMongoError(error);
    }
}

