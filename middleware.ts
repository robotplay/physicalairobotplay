import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit, addRateLimitHeaders, RateLimitType } from '@/lib/rate-limit';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // API 경로에 Rate Limiting 적용
    if (path.startsWith('/api/')) {
        // 엄격한 Rate Limiting이 필요한 엔드포인트
        const strictEndpoints = [
            '/api/auth/login',
            '/api/auth/parent-login',
            '/api/auth/register',
        ];
        
        // 중간 Rate Limiting이 필요한 엔드포인트
        const moderateEndpoints = [
            '/api/consultations',
            '/api/payment',
            '/api/news/upload',
        ];

        let rateLimitType: RateLimitType = 'default';
        
        if (strictEndpoints.some(endpoint => path.startsWith(endpoint))) {
            rateLimitType = 'strict';
        } else if (moderateEndpoints.some(endpoint => path.startsWith(endpoint))) {
            rateLimitType = 'moderate';
        }

        // Rate Limit 체크
        const result = rateLimit(request as unknown as Request, rateLimitType);
        
        // Rate Limit 헤더 추가
        const response = NextResponse.next();
        addRateLimitHeaders(response.headers, result);

        // Rate Limit 초과 시
        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
                    retryAfter: result.retryAfter,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': String(result.retryAfter || 60),
                    },
                }
            );
        }

        return response;
    }

    // 관리자 페이지 보호
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
        // 클라이언트 측 인증은 페이지 컴포넌트에서 처리
        // 여기서는 쿠키 기반 서버 측 인증만 체크
        const token = request.cookies.get('auth-token');
        
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // 강사 페이지 보호
    if (path.startsWith('/teacher') && !path.startsWith('/teacher/login')) {
        const token = request.cookies.get('auth-token');
        
        if (!token) {
            return NextResponse.redirect(new URL('/teacher/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/teacher/:path*',
        '/api/:path*', // API 경로에 Rate Limiting 적용
    ],
};

