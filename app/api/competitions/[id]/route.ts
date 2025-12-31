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

// PUT - 대회 수정
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
            return badRequestResponse('유효하지 않은 대회 ID입니다.');
        }

        const body = await request.json();
        const { name, type, startDate, endDate, registrationDeadline, description, requirements, teams } = body;

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.COMPETITIONS);

        const existingCompetition = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingCompetition) {
            return notFoundResponse('대회를 찾을 수 없습니다.');
        }

        const updateData: any = {
            updatedAt: new Date(),
        };

        if (name !== undefined) updateData.name = name;
        if (type !== undefined) updateData.type = type;
        if (startDate !== undefined) updateData.startDate = new Date(startDate);
        if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
        if (registrationDeadline !== undefined) updateData.registrationDeadline = registrationDeadline ? new Date(registrationDeadline) : null;
        if (description !== undefined) updateData.description = description;
        if (requirements !== undefined) updateData.requirements = requirements;
        if (teams !== undefined) updateData.teams = teams;

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return notFoundResponse('대회를 찾을 수 없습니다.');
        }

        const updatedCompetition = await collection.findOne({ _id: new ObjectId(id) });

        return successResponse(
            {
                ...updatedCompetition,
                _id: updatedCompetition!._id.toString(),
            },
            '대회 정보가 수정되었습니다.'
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

// DELETE - 대회 삭제
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
            return badRequestResponse('유효하지 않은 대회 ID입니다.');
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.COMPETITIONS);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return notFoundResponse('대회를 찾을 수 없습니다.');
        }

        return successResponse(null, '대회가 삭제되었습니다.');
    } catch (error) {
        return handleMongoError(error);
    }
}

