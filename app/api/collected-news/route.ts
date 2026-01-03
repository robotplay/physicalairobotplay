/**
 * 수집된 기사 조회 API
 * 공개 API (인증 불필요)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { logger } from '@/lib/logger';
import type { CollectedNewsArticle } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5분 캐시

/**
 * GET /api/collected-news
 * 수집된 기사 목록 조회
 * 
 * 쿼리 파라미터:
 * - page: 페이지 번호 (기본값: 1)
 * - limit: 페이지당 항목 수 (기본값: 12)
 * - category: 카테고리 필터 (education, technology, competition, general)
 * - keyword: 검색 키워드
 * - sort: 정렬 방식 (newest, relevance) (기본값: newest)
 * - from: 시작 날짜 (YYYY-MM-DD)
 * - to: 종료 날짜 (YYYY-MM-DD)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const category = searchParams.get('category');
        const keyword = searchParams.get('keyword');
        const sort = searchParams.get('sort') || 'newest';
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const isAdmin = searchParams.get('admin') === 'true'; // 관리자 모드

        const skip = (page - 1) * limit;

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.COLLECTED_NEWS);

        // 쿼리 조건 구성
        const query: Record<string, unknown> = {};
        
        // 관리자 모드가 아니면 활성화된 기사만 조회
        if (!isAdmin) {
            query.isActive = true;
        }

        // 카테고리 필터
        if (category && ['education', 'technology', 'competition', 'general'].includes(category)) {
            query.category = category;
        }

        // 날짜 범위 필터
        if (from || to) {
            query.publishedAt = {};
            if (from) {
                query.publishedAt = {
                    ...(query.publishedAt as Record<string, unknown>),
                    $gte: new Date(from),
                };
            }
            if (to) {
                query.publishedAt = {
                    ...(query.publishedAt as Record<string, unknown>),
                    $lte: new Date(to + 'T23:59:59.999Z'),
                };
            }
        }

        // 키워드 검색 (제목, 요약, 본문에서 검색)
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { excerpt: { $regex: keyword, $options: 'i' } },
                { content: { $regex: keyword, $options: 'i' } },
                { keywords: { $in: [new RegExp(keyword, 'i')] } },
            ];
        }

        // 정렬 옵션
        const sortOption: Record<string, 1 | -1> = {};
        if (sort === 'relevance') {
            sortOption.relevanceScore = -1;
            sortOption.publishedAt = -1; // 관련성 같으면 최신순
        } else {
            sortOption.publishedAt = -1; // 기본값: 최신순
        }

        // 전체 개수 조회
        const total = await collection.countDocuments(query);

        // 기사 목록 조회
        const articles = await collection
            .find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .toArray();

        // MongoDB ObjectId를 문자열로 변환
        const formattedArticles: CollectedNewsArticle[] = articles.map((article) => ({
            ...article,
            _id: article._id.toString(),
            imageUrl: (article.imageUrl && article.imageUrl.trim() !== '') ? article.imageUrl : undefined, // imageUrl 명시적으로 포함 (빈 문자열 처리)
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
        })) as CollectedNewsArticle[];

        const totalPages = Math.ceil(total / limit);

        const response = NextResponse.json({
            success: true,
            data: {
                articles: formattedArticles,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            },
        });

        // 관리자 모드일 때는 캐시 무시
        if (isAdmin) {
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        }

        return response;
    } catch (error) {
        logger.error('수집된 기사 조회 오류', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '기사 조회 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

