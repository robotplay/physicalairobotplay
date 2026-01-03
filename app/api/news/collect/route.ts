/**
 * 뉴스 수집 API
 * 관리자만 접근 가능
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, hasPermission } from '@/lib/auth';
import { collectNewsArticles } from '@/lib/news-collector';
import { logger } from '@/lib/logger';
import type { CollectionLog } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
 * POST /api/news/collect
 * 수동으로 뉴스 수집 실행
 */
export async function POST(request: NextRequest) {
    try {
        // 인증 확인 (관리자만)
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return NextResponse.json(
                { success: false, error: auth.error || '권한이 없습니다.' },
                { status: 403 }
            );
        }

        const body = await request.json().catch(() => ({}));
        const { sources, force } = body;

        logger.log('뉴스 수집 요청 받음', { sources, force });

        try {
            // 뉴스 수집 실행
            const result: CollectionLog = await collectNewsArticles(sources);

            logger.log('뉴스 수집 완료', {
                collected: result.collected,
                duplicates: result.duplicates,
                failed: result.failed,
                duration: result.duration,
            });

            return NextResponse.json({
                success: true,
                data: {
                    collected: result.collected,
                    duplicates: result.duplicates,
                    failed: result.failed,
                    duration: result.duration,
                    errors: result.errors || [],
                },
            });
        } catch (collectError) {
            logger.error('뉴스 수집 실행 중 오류', collectError);
            throw collectError;
        }
    } catch (error) {
        logger.error('뉴스 수집 API 오류', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '뉴스 수집 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

