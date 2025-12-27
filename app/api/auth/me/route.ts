import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: '인증되지 않았습니다.' },
                { status: 401 }
            );
        }

        // 토큰 검증
        const payload = await verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 토큰입니다.' },
                { status: 401 }
            );
        }

        // 사용자 정보 조회
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.USERS);
        
        const user = await collection.findOne({ _id: new ObjectId(payload.userId) });

        if (!user) {
            return NextResponse.json(
                { success: false, error: '사용자를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 계정 상태 확인
        if (user.status !== 'active') {
            return NextResponse.json(
                { success: false, error: '비활성화된 계정입니다.' },
                { status: 403 }
            );
        }

        // 사용자 정보 반환 (비밀번호 제외)
        const { password, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            user: {
                ...userWithoutPassword,
                _id: user._id.toString(),
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { success: false, error: '사용자 정보 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

