import { NextResponse } from 'next/server';
import { validateEnvVars } from '@/lib/env-validation';

/**
 * 환경 변수 검증 API
 * GET /api/env/validate
 * 
 * 현재 설정된 환경 변수를 검증하고 결과를 반환합니다.
 */
export async function GET() {
    try {
        const result = validateEnvVars();

        return NextResponse.json({
            success: result.isValid,
            isValid: result.isValid,
            missing: result.missing,
            warnings: result.warnings,
            environment: process.env.NODE_ENV || 'development',
            message: result.isValid
                ? '환경 변수 검증 통과'
                : '필수 환경 변수가 누락되었습니다',
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: '환경 변수 검증 중 오류 발생',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}

