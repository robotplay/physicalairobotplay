import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

// 포트원 웹훅 API (결제 완료 알림)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // 포트원에서 전송하는 웹훅 데이터 처리
        const {
            paymentId,
            orderId,
            amount,
            status,
            // 기타 포트원 웹훅 데이터
        } = body;

        console.log('📥 포트원 웹훅 수신:', { paymentId, orderId, amount, status });

        // 결제 상태 업데이트
        if (process.env.MONGODB_URI && paymentId) {
            try {
                const db = await getDatabase();
                const collection = db.collection(COLLECTIONS.PAYMENTS || 'payments');
                
                // 결제 내역 업데이트
                await collection.updateOne(
                    { paymentId: paymentId },
                    {
                        $set: {
                            status: status,
                            webhookReceived: true,
                            webhookData: body,
                            updatedAt: new Date(),
                        },
                    }
                );
                
                console.log('✅ 웹훅 데이터 MongoDB 저장 완료');
            } catch (dbError) {
                console.error('❌ 웹훅 데이터 MongoDB 저장 실패:', dbError);
            }
        }

        // 포트원에 성공 응답 반환
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('웹훅 처리 오류:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}















