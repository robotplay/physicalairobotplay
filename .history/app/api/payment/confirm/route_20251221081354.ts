import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

// 결제 확인 및 저장 API
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            paymentId,
            orderId,
            amount,
            orderName,
            customerName,
            customerEmail,
            customerPhone,
            registrationData,
        } = body;

        // 필수 필드 검증
        if (!paymentId || !orderId || !amount || !customerName || !customerPhone) {
            return NextResponse.json(
                { success: false, error: '필수 정보가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // 결제 내역 데이터 생성
        const paymentData = {
            id: `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            paymentId,
            orderId,
            amount,
            orderName,
            customerName,
            customerEmail: customerEmail || '',
            customerPhone,
            status: 'completed',
            paymentMethod: 'portone',
            registrationData: registrationData || null,
            timestamp: new Date().toISOString(),
            createdAt: new Date(),
        };

        // MongoDB에 저장
        if (process.env.MONGODB_URI) {
            try {
                const db = await getDatabase();
                const collection = db.collection(COLLECTIONS.PAYMENTS || 'payments');
                const result = await collection.insertOne(paymentData);
                console.log('✅ 결제 내역 MongoDB 저장 성공:', result.insertedId);
            } catch (dbError) {
                console.error('❌ 결제 내역 MongoDB 저장 실패:', dbError);
                // MongoDB 저장 실패해도 결제는 성공으로 처리
            }
        }

        return NextResponse.json({
            success: true,
            data: paymentData,
            message: '결제가 완료되었습니다.',
        });
    } catch (error: any) {
        console.error('결제 확인 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '결제 확인 중 오류가 발생했습니다.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
            { status: 500 }
        );
    }
}
