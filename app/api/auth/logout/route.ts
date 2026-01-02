import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        
        // 쿠키 삭제 (모든 옵션 명시)
        cookieStore.delete('auth-token');
        
        // 응답 생성
        const response = NextResponse.json({
            success: true,
            message: '로그아웃 되었습니다.',
        });
        
        // 응답 헤더에 쿠키 삭제 명시 (여러 방법으로 시도)
        response.cookies.set('auth-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
            expires: new Date(0), // 과거 날짜로 설정하여 즉시 만료
        });
        
        // 추가 헤더로 캐시 방지
        response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, error: '로그아웃 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

