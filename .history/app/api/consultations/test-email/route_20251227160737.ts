import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

// 이메일 발송 테스트용 API 엔드포인트
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to } = body;

        if (!to) {
            return NextResponse.json(
                { error: '이메일 주소가 필요합니다.' },
                { status: 400 }
            );
        }

        // 환경 변수 확인
        const envCheck = {
            SMTP_HOST: process.env.SMTP_HOST || '❌ 설정되지 않음',
            SMTP_PORT: process.env.SMTP_PORT || '❌ 설정되지 않음',
            SMTP_USER: process.env.SMTP_USER ? '✅ 설정됨' : '❌ 설정되지 않음',
            SMTP_PASSWORD: process.env.SMTP_PASSWORD ? '✅ 설정됨' : '❌ 설정되지 않음',
            SMTP_FROM: process.env.SMTP_FROM || process.env.SMTP_USER || '❌ 설정되지 않음',
            SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || '기본값 사용',
        };

        // 테스트 이메일 전송
        const result = await sendEmail({
            to: to,
            subject: '[테스트] 피지컬 AI 교육 이메일 발송 테스트',
            html: `
                <h1>이메일 발송 테스트</h1>
                <p>이 이메일이 정상적으로 도착했다면 이메일 발송 기능이 정상 작동하는 것입니다.</p>
                <hr>
                <h2>환경 변수 상태:</h2>
                <ul>
                    <li>SMTP_HOST: ${envCheck.SMTP_HOST}</li>
                    <li>SMTP_PORT: ${envCheck.SMTP_PORT}</li>
                    <li>SMTP_USER: ${envCheck.SMTP_USER}</li>
                    <li>SMTP_PASSWORD: ${envCheck.SMTP_PASSWORD}</li>
                    <li>SMTP_FROM: ${envCheck.SMTP_FROM}</li>
                    <li>SMTP_FROM_NAME: ${envCheck.SMTP_FROM_NAME}</li>
                </ul>
            `,
        });

        return NextResponse.json({
            success: result.success,
            simulated: result.simulated,
            messageId: result.messageId,
            envCheck,
            message: result.simulated 
                ? '환경 변수가 설정되지 않아 시뮬레이션 모드로 동작했습니다.' 
                : '이메일이 성공적으로 전송되었습니다.',
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        const errorStack = error instanceof Error && process.env.NODE_ENV === 'development' ? error.stack : undefined;
        console.error('이메일 테스트 오류:', error);
        return NextResponse.json(
            { 
                error: '이메일 테스트 중 오류가 발생했습니다.',
                details: errorMessage,
                stack: errorStack,
            },
            { status: 500 }
        );
    }
}

// GET 요청으로 환경 변수만 확인
export async function GET(_request: NextRequest) {
    const envCheck = {
        SMTP_HOST: process.env.SMTP_HOST || '❌ 설정되지 않음',
        SMTP_PORT: process.env.SMTP_PORT || '❌ 설정되지 않음',
        SMTP_USER: process.env.SMTP_USER ? '✅ 설정됨 (값은 숨김)' : '❌ 설정되지 않음',
        SMTP_PASSWORD: process.env.SMTP_PASSWORD ? '✅ 설정됨 (값은 숨김)' : '❌ 설정되지 않음',
        SMTP_FROM: process.env.SMTP_FROM || process.env.SMTP_USER || '❌ 설정되지 않음',
        SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || '기본값 사용',
    };

    return NextResponse.json({
        envCheck,
        message: '환경 변수 상태를 확인하세요.',
    });
}
