import { NextResponse } from 'next/server';

// 결제 시스템 환경 변수 확인 및 전달 API
// NEXT_PUBLIC_ 접두사가 있는 변수는 클라이언트에 노출되어도 안전하므로 실제 값을 반환합니다
export async function GET() {
    try {
        const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID?.trim();
        const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY?.trim();
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

        const missingVars = [];
        if (!storeId) missingVars.push('NEXT_PUBLIC_PORTONE_STORE_ID');
        if (!channelKey) missingVars.push('NEXT_PUBLIC_PORTONE_CHANNEL_KEY');
        // siteUrl은 선택사항 (동적으로 생성 가능)
        // if (!siteUrl) missingVars.push('NEXT_PUBLIC_SITE_URL');

        return NextResponse.json({
            success: missingVars.length === 0,
            storeIdExists: !!storeId,
            channelKeyExists: !!channelKey,
            siteUrlExists: !!siteUrl,
            missingVars: missingVars,
            // 실제 값을 반환 (NEXT_PUBLIC_ 접두사가 있어서 클라이언트에 노출되어도 안전)
            storeId: storeId || null,
            channelKey: channelKey || null,
            siteUrl: siteUrl || null,
            storeIdPrefix: storeId ? storeId.substring(0, 10) + '...' : null,
            channelKeyPrefix: channelKey ? channelKey.substring(0, 10) + '...' : null,
            nodeEnv: process.env.NODE_ENV,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}




