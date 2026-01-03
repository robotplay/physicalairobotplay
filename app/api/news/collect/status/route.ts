/**
 * 뉴스 수집 상태 조회 API
 */
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 1분 캐시

/**
 * GET /api/news/collect/status
 * 최근 수집 상태 조회
 */
export async function GET(request: NextRequest) {
    try {
        const db = await getDatabase();
        const logsCollection = db.collection(COLLECTIONS.COLLECTION_LOGS);
        const newsCollection = db.collection(COLLECTIONS.COLLECTED_NEWS);

        // 최근 수집 로그
        const lastLog = await logsCollection
            .findOne(
                { status: 'completed' },
                { sort: { completedAt: -1 } }
            );

        // 전체 수집 기사 수
        const totalCollected = await newsCollection.countDocuments();

        // 최근 24시간 수집 기사 수
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        const last24Hours = await newsCollection.countDocuments({
            collectedAt: { $gte: twentyFourHoursAgo },
        });

        // 다음 수집 예정 시간 (6시간 후)
        const nextRun = lastLog?.completedAt
            ? new Date(
                typeof lastLog.completedAt === 'string'
                    ? new Date(lastLog.completedAt).getTime()
                    : lastLog.completedAt.getTime() + 6 * 60 * 60 * 1000
            )
            : new Date(Date.now() + 6 * 60 * 60 * 1000);

        return NextResponse.json({
            success: true,
            data: {
                lastRun: lastLog?.completedAt || null,
                nextRun: nextRun.toISOString(),
                totalCollected,
                last24Hours,
            },
        });
    } catch (error) {
        logger.error('수집 상태 조회 오류', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '수집 상태 조회 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

