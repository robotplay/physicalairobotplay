import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        
        // 쿠키 삭제 (모든 옵션 명시)
        cookieStore.delete('auth-token');
        
        // 추가로 명시적으로 삭제 (path와 domain 포함)
        cookieStore.set('auth-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        });

        return NextResponse.json({
            success: true,
            message: '로그아웃 되었습니다.',
        });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, error: '로그아웃 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

