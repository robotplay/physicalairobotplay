import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/auth-middleware';

// 소셜 미디어 통계 조회
export async function GET(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const authResult = await verifyAdminAuth(request);
        if (!authResult.success) {
            return NextResponse.json(
                { success: false, error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.SOCIAL_POSTS);

        // 쿼리 조건
        const query: any = {};
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
            }
        }

        // 모든 포스트 가져오기
        const posts = await collection.find(query).toArray();

        // 통계 계산
        const stats = {
            total: posts.length,
            byStatus: {
                pending: 0,
                posted: 0,
                failed: 0,
            },
            byContentType: {} as Record<string, number>,
            byPlatform: {} as Record<string, { total: number; success: number; failed: number }>,
            byDate: {} as Record<string, number>,
        };

        posts.forEach((post) => {
            // 상태별 통계
            stats.byStatus[post.status as keyof typeof stats.byStatus]++;

            // 컨텐츠 타입별 통계
            const contentType = post.contentType || 'unknown';
            stats.byContentType[contentType] = (stats.byContentType[contentType] || 0) + 1;

            // 플랫폼별 통계
            post.platforms?.forEach((platform: string) => {
                if (!stats.byPlatform[platform]) {
                    stats.byPlatform[platform] = { total: 0, success: 0, failed: 0 };
                }
                stats.byPlatform[platform].total++;
                
                const result = post.postResults?.[platform];
                if (result) {
                    if (result.success) {
                        stats.byPlatform[platform].success++;
                    } else {
                        stats.byPlatform[platform].failed++;
                    }
                }
            });

            // 날짜별 통계
            if (post.createdAt) {
                const date = new Date(post.createdAt).toISOString().split('T')[0];
                stats.byDate[date] = (stats.byDate[date] || 0) + 1;
            }
        });

        return NextResponse.json({
            success: true,
            data: stats,
        });
    } catch (error: any) {
        console.error('소셜 미디어 통계 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '소셜 미디어 통계 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

