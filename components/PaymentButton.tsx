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
    const [envChecked, setEnvChecked] = useState(false);
    const [envVars, setEnvVars] = useState<{
        storeId: string | null;
        channelKey: string | null;
        siteUrl: string | null;
    } | null>(null);

    useEffect(() => {
        // 환경 변수 확인 및 가져오기
        const checkEnv = async () => {
            try {
                const response = await fetch('/api/payment/check-env');
                const data = await response.json();
                
                if (!data.success) {
                    console.error('환경 변수 확인 실패:', data);
                    const missingVars: string[] = Array.isArray(data.missingVars) ? data.missingVars : [];
                    let errorMessage = '결제 시스템 설정이 완료되지 않았습니다.\n\n';
                    
                    if (missingVars.length > 0) {
                        errorMessage += `누락된 환경 변수:\n${missingVars.map((v: string) => `- ${v}`).join('\n')}\n\n`;
                    }
                    
                    errorMessage += 'Vercel 대시보드에서 환경 변수를 설정해주세요:\n';
                    errorMessage += '1. https://vercel.com 접속\n';
                    errorMessage += '2. 프로젝트 선택 → Settings → Environment Variables\n';
                    errorMessage += '3. 다음 변수 추가:\n';
                    
                    if (missingVars.includes('NEXT_PUBLIC_PORTONE_CHANNEL_KEY')) {
                        errorMessage += '   - Key: NEXT_PUBLIC_PORTONE_CHANNEL_KEY\n';
                        errorMessage += '   - Value: channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3\n';
                        errorMessage += '   - Environment: ✅ Production (체크 필수!)\n';
                    }
                    
                    if (missingVars.includes('NEXT_PUBLIC_SITE_URL')) {
                        errorMessage += '   - Key: NEXT_PUBLIC_SITE_URL\n';
                        errorMessage += '   - Value: https://parplay.co.kr\n';
                        errorMessage += '   - Environment: ✅ Production (체크 필수!)\n';
                    }
                    
                    errorMessage += '\n4. 저장 후 배포가 자동으로 재시작됩니다.';
                    
                    onError?.(errorMessage);
                    setEnvChecked(true); // SDK 로드는 시도하지만 결제는 실패할 것
                    return;
                }
                
                console.log('환경 변수 확인 성공:', {
                    storeIdExists: data.storeIdExists,
                    channelKeyExists: data.channelKeyExists,
                    siteUrlExists: data.siteUrlExists,
                });

                // 서버에서 받은 환경 변수 저장
                setEnvVars({
                    storeId: data.storeId || null,
                    channelKey: data.channelKey || null,
                    siteUrl: data.siteUrl || null,
                });
                
                setEnvChecked(true);
            } catch (error) {
                console.error('환경 변수 확인 중 오류:', error);
                onError?.('환경 변수를 확인하는 중 오류가 발생했습니다. 페이지를 새로고침해주세요.');
                setEnvChecked(true);
            }
        };

        checkEnv();
    }, [onError]);

    useEffect(() => {
        // 환경 변수 확인 후 포트원 SDK 로드
        if (!envChecked) return;

        // 포트원 SDK 동적 로드
        const loadPortone = async () => {
            try {
                console.log('포트원 SDK 로드 시작...');
                // 포트원 SDK v2 로드
                // import * as PortOne from '@portone/browser-sdk/v2' 방식
                const PortOneModule = await import('@portone/browser-sdk/v2');
                
                console.log('포트원 SDK 로드 성공:', PortOneModule);
                
                // SDK가 준비되었음을 표시
                // PortOne 모듈 전체를 저장하여 requestPayment 함수에 접근
                setPortone(PortOneModule);
            } catch (error) {
                console.error('포트원 SDK 로드 실패:', error);
                onError?.('결제 시스템을 불러올 수 없습니다. 페이지를 새로고침해주세요.');
            }
        };

        loadPortone();
    }, [envChecked, onError]);

    const handlePayment = async () => {
        // 버튼이 disabled 상태인지 확인
        if (isLoading) {
            console.log('결제가 이미 진행 중입니다.');
            return;
        }

        if (!envChecked) {
            console.log('환경 변수 확인 중...');
            onError?.('환경 변수를 확인하는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        if (!portone) {
            console.log('포트원 SDK가 로드되지 않았습니다. 재시도 중...');
            // SDK 재로드 시도
            try {
                const PortOneModule = await import('@portone/browser-sdk/v2');
                setPortone(PortOneModule);
                console.log('포트원 SDK 재로드 성공');
            } catch (error) {
                console.error('포트원 SDK 재로드 실패:', error);
                onError?.('결제 시스템이 준비되지 않았습니다. 페이지를 새로고침해주세요.');
                return;
            }
        }

        setIsLoading(true);

        try {
            // 환경 변수 확인 (서버에서 받은 값 우선 사용)
            let storeId: string | null = null;
            let channelKey: string | null = null;
            let siteUrl: string | null = null;

            // 1. 서버에서 받은 환경 변수 사용 (런타임 값)
            if (envVars?.storeId && envVars?.channelKey) {
                storeId = envVars.storeId;
                channelKey = envVars.channelKey;
                siteUrl = envVars.siteUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
                console.log('서버에서 받은 환경 변수 사용:', {
                    storeIdPrefix: storeId.substring(0, 10) + '...',
                    channelKeyPrefix: channelKey.substring(0, 10) + '...',
                });
            } else {
                // 2. 클라이언트 빌드 타임 환경 변수 확인 (fallback)
                storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID?.trim() || null;
                channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY?.trim() || null;
                siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
                
                // 클라이언트에도 없으면 서버 API 재확인
                if (!storeId || !channelKey) {
                    const envCheckResponse = await fetch('/api/payment/check-env');
                    const envData = await envCheckResponse.json();
                    
                    if (envData.storeId && envData.channelKey) {
                        storeId = envData.storeId;
                        channelKey = envData.channelKey;
                        siteUrl = envData.siteUrl || siteUrl;
                        console.log('서버 API 재확인으로 환경 변수 획득');
                    } else {
                        const missingVars = envData.missingVars || [];
                        let errorMsg = '결제 시스템 설정이 완료되지 않았습니다.\n\n';
                        errorMsg += `누락된 환경 변수: ${missingVars.join(', ')}\n\n`;
                        errorMsg += 'Vercel 대시보드에서 환경 변수를 설정해주세요.';
                        throw new Error(errorMsg);
                    }
                }
            }

            // 최종 확인
            if (!storeId || !channelKey) {
                throw new Error(
                    '결제 시스템 설정이 완료되지 않았습니다. 환경 변수를 확인할 수 없습니다.'
                );
            }

            // 디버깅용 로그 (프로덕션에서도 확인 가능하도록)
            console.log('포트원 결제 요청:', {
                storeId: storeId ? `${storeId.substring(0, 10)}...` : '없음',
                channelKeyLength: channelKey?.length || 0,
                channelKeyPrefix: channelKey ? channelKey.substring(0, 10) + '...' : '없음',
                siteUrl: siteUrl,
                nodeEnv: process.env.NODE_ENV,
            });

            // 결제 ID 생성
            const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // 포트원 SDK v2 requestPayment 호출
            // pgProvider를 제거하여 Channel 설정에 맡김 (Toss Payments Channel이 올바르게 설정되어 있다면 자동으로 사용됨)
            const response = await portone.requestPayment({
                storeId: storeId,
                channelKey: channelKey,
                paymentId: paymentId,
                orderName: orderName,
                totalAmount: amount,
                currency: 'CURRENCY_KRW',
                payMethod: 'CARD', // 필수 파라미터
                // pgProvider 제거 - Channel 설정에 따라 자동으로 PG 선택
                customer: {
                    fullName: customerName,
                    email: customerEmail,
                    phoneNumber: customerPhone,
                },
                customData: registrationData ? JSON.stringify(registrationData) : undefined,
                noticeUrl: `${siteUrl}/api/payment/webhook`,
                confirmUrl: `${siteUrl}/api/payment/confirm`,
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

    // 버튼 상태 확인
    // envVars가 없거나 channelKey가 없으면 버튼 비활성화
    const hasRequiredEnvVars = envVars?.storeId && envVars?.channelKey;
    const isButtonDisabled = isLoading || (!portone && envChecked) || (envChecked && !hasRequiredEnvVars);
    const isReady = portone && envChecked && hasRequiredEnvVars;

    return (
        <button
            onClick={handlePayment}
            disabled={isButtonDisabled}
            className="w-full px-8 py-4 bg-gradient-to-r from-[#00A3FF] to-[#FF4D4D] hover:from-[#0088DD] hover:to-[#FF3333] text-white font-bold rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,163,255,0.5)] hover:shadow-[0_0_40px_rgba(0,163,255,0.7)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isReady ? '결제 시스템을 준비하는 중입니다...' : undefined}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    결제 진행 중...
                </>
            ) : !isReady ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {envChecked && !hasRequiredEnvVars ? '환경 변수 설정 필요' : '결제 시스템 준비 중...'}
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















