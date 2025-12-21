'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentButtonProps {
    amount: number;
    orderName: string;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    onSuccess?: (paymentId: string) => void;
    onError?: (error: string) => void;
    registrationData?: any; // 신청서 데이터
}

export default function PaymentButton({
    amount,
    orderName,
    customerName,
    customerEmail,
    customerPhone,
    onSuccess,
    onError,
    registrationData
}: PaymentButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [portone, setPortone] = useState<any>(null);

    useEffect(() => {
        // 포트원 SDK 동적 로드
        const loadPortone = async () => {
            try {
                // 포트원 SDK v2 로드
                // import * as PortOne from '@portone/browser-sdk/v2' 방식
                const PortOneModule = await import('@portone/browser-sdk/v2');
                
                // SDK가 준비되었음을 표시
                // PortOne 모듈 전체를 저장하여 requestPayment 함수에 접근
                setPortone(PortOneModule);
            } catch (error) {
                console.error('포트원 SDK 로드 실패:', error);
                onError?.('결제 시스템을 불러올 수 없습니다.');
            }
        };

        loadPortone();
    }, [onError]);

    const handlePayment = async () => {
        if (!portone) {
            onError?.('결제 시스템이 준비되지 않았습니다.');
            return;
        }

        setIsLoading(true);

        try {
            const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID?.trim();
            const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY?.trim();

            if (!storeId || !channelKey) {
                throw new Error('결제 시스템 설정이 완료되지 않았습니다.');
            }

            // 디버깅용 로그 (개발 환경에서만)
            if (process.env.NODE_ENV === 'development') {
                console.log('포트원 결제 요청:', {
                    storeId: storeId,
                    channelKeyLength: channelKey.length,
                    channelKeyPrefix: channelKey.substring(0, 10) + '...',
                });
            }

            // 결제 ID 생성
            const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // 포트원 SDK v2 requestPayment 호출
            // KSNET PG 사용 (macOS 호환, HTML5_INICIS 문제 해결)
            const response = await portone.requestPayment({
                storeId: storeId,
                channelKey: channelKey,
                paymentId: paymentId,
                orderName: orderName,
                totalAmount: amount,
                currency: 'CURRENCY_KRW',
                payMethod: 'CARD', // 필수 파라미터
                pgProvider: 'KSNET', // KSNET PG 사용 (macOS 호환)
                customer: {
                    fullName: customerName,
                    email: customerEmail,
                    phoneNumber: customerPhone,
                },
                customData: registrationData ? JSON.stringify(registrationData) : undefined,
                noticeUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/payment/webhook`,
                confirmUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/payment/confirm`,
            });

            // 결제 성공 처리
            if (response.code === 'SUCCESS') {
                // 결제 정보를 서버로 전송
                const paymentResponse = await fetch('/api/payment/confirm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        paymentId: response.paymentId,
                        orderId: response.orderId,
                        amount: amount,
                        orderName: orderName,
                        customerName: customerName,
                        customerEmail: customerEmail,
                        customerPhone: customerPhone,
                        registrationData: registrationData,
                    }),
                });

                const paymentData = await paymentResponse.json();

                if (paymentData.success) {
                    onSuccess?.(response.paymentId);
                    // 결제 성공 페이지로 리다이렉트
                    window.location.href = `/program/airplane/success?paymentId=${response.paymentId}`;
                } else {
                    throw new Error(paymentData.error || '결제 확인 중 오류가 발생했습니다.');
                }
            } else {
                throw new Error(response.message || '결제에 실패했습니다.');
            }
        } catch (error: any) {
            console.error('결제 오류:', error);
            onError?.(error.message || '결제 중 오류가 발생했습니다.');
            // 결제 실패 페이지로 리다이렉트
            window.location.href = `/program/airplane/fail?error=${encodeURIComponent(error.message || '결제 실패')}`;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={isLoading || !portone}
            className="w-full px-8 py-4 bg-gradient-to-r from-[#00A3FF] to-[#FF4D4D] hover:from-[#0088DD] hover:to-[#FF3333] text-white font-bold rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,163,255,0.5)] hover:shadow-[0_0_40px_rgba(0,163,255,0.7)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    결제 진행 중...
                </>
            ) : (
                <>
                    <CreditCard className="w-5 h-5" />
                    {amount.toLocaleString()}원 결제하기
                </>
            )}
        </button>
    );
}





