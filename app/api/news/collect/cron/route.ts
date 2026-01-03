/**
 * 뉴스 수집 Cron 작업 API
 * Vercel Cron에서 자동으로 호출됩니다.
 * 인증 없이 실행되지만, 내부적으로 검증합니다.
 */
import { NextRequest, NextResponse } from 'next/server';
import { collectNewsArticles } from '@/lib/news-collector';
import { logger } from '@/lib/logger';
import type { CollectionLog } from '@/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5분

/**
 * GET /api/news/collect/cron
 * Vercel Cron에서 자동 호출
 * Authorization 헤더로 보안 검증
 */
export async function GET(request: NextRequest) {
    try {
        // Vercel Cron 인증 헤더 확인
        const authHeader = request.headers.get('authorization');
        const cronSecret = process.env.CRON_SECRET || 'default-cron-secret-change-in-production';

        // 간단한 보안 검증 (프로덕션에서는 더 강력한 인증 사용 권장)
        if (authHeader !== `Bearer ${cronSecret}`) {
            logger.warn('Cron 작업 인증 실패: 잘못된 Authorization 헤더');
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        logger.log('Cron 작업 시작: 뉴스 수집');

        // 뉴스 수집 실행
        const result: CollectionLog = await collectNewsArticles();

        logger.log(
            `Cron 작업 완료: 수집 ${result.collected}개, 중복 ${result.duplicates}개, 실패 ${result.failed}개`
        );

        return NextResponse.json({
            success: true,
            data: {
                collected: result.collected,
                duplicates: result.duplicates,
                failed: result.failed,
                duration: result.duration,
                status: result.status,
            },
            message: '뉴스 수집이 완료되었습니다.',
        });
    } catch (error) {
        logger.error('Cron 작업 오류', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '뉴스 수집 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

