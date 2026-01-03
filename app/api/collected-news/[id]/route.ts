/**
 * 수집된 기사 상세 조회 API
 * 공개 API (인증 불필요)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';
import type { CollectedNewsArticle } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5분 캐시

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

