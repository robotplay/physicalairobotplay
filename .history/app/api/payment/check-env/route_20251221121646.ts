import { NextResponse } from 'next/server';

// 결제 시스템 환경 변수 확인 API
export async function GET() {
    try {
        const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID?.trim();
        const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY?.trim();
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

        const missingVars = [];
        if (!storeId) missingVars.push('NEXT_PUBLIC_PORTONE_STORE_ID');
        if (!channelKey) missingVars.push('NEXT_PUBLIC_PORTONE_CHANNEL_KEY');
        if (!siteUrl) missingVars.push('NEXT_PUBLIC_SITE_URL');

        return NextResponse.json({
            success: missingVars.length === 0,
            storeIdExists: !!storeId,
            channelKeyExists: !!channelKey,
            siteUrlExists: !!siteUrl,
            missingVars: missingVars,
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
