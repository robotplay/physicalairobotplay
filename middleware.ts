import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // API 경로는 미들웨어에서 제외 (API 자체에서 인증 처리)
    if (path.startsWith('/api/')) {
        return NextResponse.next();
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
    ],
};

