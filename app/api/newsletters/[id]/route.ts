import { NextRequest } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
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
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return { authorized: false, error: '인증되지 않았습니다.' };
    }

    const { verifyToken, hasPermission } = await import('@/lib/auth');
    const payload = await verifyToken(token);
    if (!payload) {
        return { authorized: false, error: '유효하지 않은 토큰입니다.' };
    }

    if (!hasPermission(payload.role, requiredRole)) {
        return { authorized: false, error: '권한이 없습니다.' };
    }

    return { authorized: true, user: payload };
}

// GET - 뉴스레터 단일 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;

        if (!ObjectId.isValid(id)) {
            return badRequestResponse('유효하지 않은 뉴스레터 ID입니다.');
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.MONTHLY_NEWSLETTERS);

        const newsletter = await collection.findOne({ _id: new ObjectId(id) });

        if (!newsletter) {
            return notFoundResponse('뉴스레터를 찾을 수 없습니다.');
        }

        return successResponse({
            ...newsletter,
            _id: newsletter._id.toString(),
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// PUT - 뉴스레터 수정
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
            return badRequestResponse('유효하지 않은 뉴스레터 ID입니다.');
        }

        const body = await request.json();
        const { month, year, title, content, highlights, studentSpotlights, competitionResults, photos } = body;

        // 필수 필드 검증
        if (!month || !year || !title || !content) {
            return badRequestResponse(
                '필수 항목을 입력해주세요.',
                '월, 연도, 제목, 내용은 필수입니다.'
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.MONTHLY_NEWSLETTERS);

        // 뉴스레터 존재 확인
        const existingNewsletter = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingNewsletter) {
            return notFoundResponse('뉴스레터를 찾을 수 없습니다.');
        }

        // 업데이트할 데이터 구성
        const updateData: any = {
            month: parseInt(month),
            year: parseInt(year),
            title,
            content,
            highlights: highlights || [],
            studentSpotlights: studentSpotlights || [],
            competitionResults: competitionResults || [],
            photos: photos || [],
            updatedAt: new Date(),
        };

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return notFoundResponse('뉴스레터를 찾을 수 없습니다.');
        }

        // 업데이트된 뉴스레터 조회
        const updatedNewsletter = await collection.findOne({ _id: new ObjectId(id) });

        return successResponse(
            {
                ...updatedNewsletter,
                _id: updatedNewsletter!._id.toString(),
            },
            '뉴스레터가 수정되었습니다.'
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

// DELETE - 뉴스레터 삭제
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
            return badRequestResponse('유효하지 않은 뉴스레터 ID입니다.');
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.MONTHLY_NEWSLETTERS);

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return notFoundResponse('뉴스레터를 찾을 수 없습니다.');
        }

        return successResponse(null, '뉴스레터가 삭제되었습니다.');
    } catch (error) {
        return handleMongoError(error);
    }
}

