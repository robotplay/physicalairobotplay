import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/auth-middleware';

// 구독자 목록 조회 (관리자 전용)
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
        const status = searchParams.get('status') || 'active'; // active, unsubscribed, all
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS);

        // 쿼리 조건
        const query: any = {};
        if (status !== 'all') {
            query.status = status;
        }

        // 총 개수
        const total = await collection.countDocuments(query);

        // 목록 조회
        const subscribers = await collection
            .find(query)
            .sort({ subscribedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        return NextResponse.json({
            success: true,
            data: {
                subscribers: subscribers.map((sub) => ({
                    _id: sub._id.toString(),
                    email: sub.email,
                    name: sub.name,
                    status: sub.status,
                    subscribedAt: sub.subscribedAt,
                    unsubscribedAt: sub.unsubscribedAt,
                    createdAt: sub.createdAt,
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error: any) {
        console.error('구독자 목록 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '구독자 목록 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

