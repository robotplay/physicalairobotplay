/**
 * 수집된 기사 상세 조회 및 관리 API
 * GET: 공개 API (인증 불필요)
 * PUT/DELETE: 관리자 전용
 */
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import { verifyToken, hasPermission } from '@/lib/auth';
import { logger } from '@/lib/logger';
import type { CollectedNewsArticle } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5분 캐시

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

/**
 * GET /api/collected-news/[id]
 * 특정 기사 상세 조회 및 조회수 증가
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: '기사 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.COLLECTED_NEWS);

        // ObjectId 검증
        let objectId: ObjectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 기사 ID입니다.' },
                { status: 400 }
            );
        }

        // 기사 조회
        const article = await collection.findOne({
            _id: objectId,
            isActive: true, // 활성화된 기사만
        });

        if (!article) {
            return NextResponse.json(
                { success: false, error: '기사를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 조회수 증가 (비동기, 실패해도 기사는 반환)
        collection.updateOne(
            { _id: objectId },
            { $inc: { viewCount: 1 } }
        ).catch((error) => {
            logger.error('조회수 증가 실패', error);
        });

        // 관련 기사 추천 (같은 카테고리, 최신순, 최대 3개)
        const relatedArticles = await collection
            .find({
                _id: { $ne: objectId },
                category: article.category,
                isActive: true,
            })
            .sort({ publishedAt: -1 })
            .limit(3)
            .toArray();

        // MongoDB ObjectId를 문자열로 변환
        const formattedArticle: CollectedNewsArticle = {
            ...article,
            _id: article._id.toString(),
            publishedAt: article.publishedAt instanceof Date 
                ? article.publishedAt.toISOString() 
                : article.publishedAt,
            collectedAt: article.collectedAt instanceof Date 
                ? article.collectedAt.toISOString() 
                : article.collectedAt,
            createdAt: article.createdAt instanceof Date 
                ? article.createdAt.toISOString() 
                : article.createdAt,
            updatedAt: article.updatedAt instanceof Date 
                ? article.updatedAt.toISOString() 
                : article.updatedAt,
        } as CollectedNewsArticle;

        const formattedRelatedArticles: CollectedNewsArticle[] = relatedArticles.map((item) => ({
            ...item,
            _id: item._id.toString(),
            publishedAt: item.publishedAt instanceof Date 
                ? item.publishedAt.toISOString() 
                : item.publishedAt,
            collectedAt: item.collectedAt instanceof Date 
                ? item.collectedAt.toISOString() 
                : item.collectedAt,
            createdAt: item.createdAt instanceof Date 
                ? item.createdAt.toISOString() 
                : item.createdAt,
            updatedAt: item.updatedAt instanceof Date 
                ? item.updatedAt.toISOString() 
                : item.updatedAt,
        })) as CollectedNewsArticle[];

        return NextResponse.json({
            success: true,
            data: {
                article: formattedArticle,
                relatedArticles: formattedRelatedArticles,
            },
        });
    } catch (error) {
        logger.error('기사 상세 조회 오류', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '기사 조회 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/collected-news/[id]
 * 기사 상태 업데이트 (활성화/비활성화)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return NextResponse.json(
                { success: false, error: auth.error || '권한이 없습니다.' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, error: '기사 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.COLLECTED_NEWS);

        // ObjectId 검증
        let objectId: ObjectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 기사 ID입니다.' },
                { status: 400 }
            );
        }

        // 업데이트 데이터 구성
        const updateData: Record<string, unknown> = {
            updatedAt: new Date(),
        };

        if (typeof body.isActive === 'boolean') {
            updateData.isActive = body.isActive;
        }

        if (body.category) {
            updateData.category = body.category;
        }

        // 기사 업데이트
        const result = await collection.updateOne(
            { _id: objectId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: '기사를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '기사가 업데이트되었습니다.',
        });
    } catch (error) {
        logger.error('기사 업데이트 오류', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '기사 업데이트 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/collected-news/[id]
 * 기사 삭제
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return NextResponse.json(
                { success: false, error: auth.error || '권한이 없습니다.' },
                { status: 403 }
            );
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: '기사 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.COLLECTED_NEWS);

        // ObjectId 검증
        let objectId: ObjectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 기사 ID입니다.' },
                { status: 400 }
            );
        }

        // 기사 삭제
        const result = await collection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: '기사를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '기사가 삭제되었습니다.',
        });
    } catch (error) {
        logger.error('기사 삭제 오류', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '기사 삭제 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}
