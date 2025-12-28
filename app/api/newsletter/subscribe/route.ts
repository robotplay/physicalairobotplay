import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// 뉴스레터 구독
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name } = body;

        // 이메일 유효성 검사
        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { success: false, error: '유효한 이메일 주소를 입력해주세요.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS);

        // 이미 구독 중인지 확인
        const existing = await collection.findOne({ email: email.toLowerCase() });

        if (existing) {
            if (existing.status === 'active') {
                return NextResponse.json(
                    { success: false, error: '이미 구독 중인 이메일입니다.' },
                    { status: 400 }
                );
            } else {
                // 재구독
                await collection.updateOne(
                    { email: email.toLowerCase() },
                    {
                        $set: {
                            status: 'active',
                            name: name || existing.name,
                            subscribedAt: new Date(),
                            updatedAt: new Date(),
                        },
                    }
                );
                return NextResponse.json({
                    success: true,
                    message: '뉴스레터 구독이 완료되었습니다.',
                });
            }
        }

        // 새 구독자 추가
        const subscriber = {
            email: email.toLowerCase(),
            name: name || '',
            status: 'active',
            subscribedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await collection.insertOne(subscriber);

        return NextResponse.json({
            success: true,
            message: '뉴스레터 구독이 완료되었습니다.',
        });
    } catch (error: any) {
        console.error('뉴스레터 구독 오류:', error);
        return NextResponse.json(
            { success: false, error: '구독 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 구독 취소
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const token = searchParams.get('token'); // 보안을 위한 토큰 (선택적)

        if (!email) {
            return NextResponse.json(
                { success: false, error: '이메일 주소가 필요합니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS);

        const result = await collection.updateOne(
            { email: email.toLowerCase() },
            {
                $set: {
                    status: 'unsubscribed',
                    unsubscribedAt: new Date(),
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: '구독 정보를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '뉴스레터 구독이 취소되었습니다.',
        });
    } catch (error: any) {
        console.error('구독 취소 오류:', error);
        return NextResponse.json(
            { success: false, error: '구독 취소 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 구독 상태 확인
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { success: false, error: '이메일 주소가 필요합니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS);

        const subscriber = await collection.findOne({ email: email.toLowerCase() });

        return NextResponse.json({
            success: true,
            subscribed: subscriber?.status === 'active',
            data: subscriber ? {
                email: subscriber.email,
                name: subscriber.name,
                status: subscriber.status,
                subscribedAt: subscriber.subscribedAt,
            } : null,
        });
    } catch (error: any) {
        console.error('구독 상태 확인 오류:', error);
        return NextResponse.json(
            { success: false, error: '구독 상태 확인 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

