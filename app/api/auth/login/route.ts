import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyPassword, createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: '아이디와 비밀번호를 입력해주세요.' },
                { status: 400 }
            );
        }

        // MongoDB에서 사용자 조회
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.USERS);
        
        const user = await collection.findOne({ username });

        if (!user) {
            return NextResponse.json(
                { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
                { status: 401 }
            );
        }

        // 계정 상태 확인
        if (user.status !== 'active') {
            return NextResponse.json(
                { success: false, error: '비활성화된 계정입니다. 관리자에게 문의하세요.' },
                { status: 403 }
            );
        }

        // 비밀번호 검증
        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
                { status: 401 }
            );
        }

        // JWT 토큰 생성
        const token = await createToken({
            userId: user._id.toString(),
            username: user.username,
            role: user.role,
            name: user.name,
        });

        // 쿠키에 토큰 저장
        const cookieStore = await cookies();
        cookieStore.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24시간
            path: '/',
        });
        
        console.log('Auth token set in cookie:', {
            hasToken: !!token,
            tokenLength: token.length,
            environment: process.env.NODE_ENV,
        });

        // 사용자 정보 반환 (비밀번호 제외)
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            user: {
                ...userWithoutPassword,
                _id: user._id.toString(),
            },
            message: '로그인 성공',
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: '로그인 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

