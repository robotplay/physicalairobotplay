import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { hashPassword, verifyToken, hasPermission } from '@/lib/auth';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';

// 권한 체크 헬퍼 함수
async function checkAuth(requiredRole: 'admin' | 'teacher' = 'admin') {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return { authorized: false, error: '인증되지 않았습니다.' };
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return { authorized: false, error: '유효하지 않은 토큰입니다.' };
    }

    if (!hasPermission(payload.role, requiredRole)) {
        return { authorized: false, error: '권한이 없습니다.' };
    }

    return { authorized: true, user: payload };
}

// PUT - 사용자 수정 (관리자만)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: 401 }
            );
        }

        const resolvedParams = params instanceof Promise ? await params : params;
        const { id } = resolvedParams;

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 사용자 ID입니다.' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { name, email, phone, status, password } = body;

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.USERS);

        // 사용자 존재 확인
        const user = await collection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return NextResponse.json(
                { success: false, error: '사용자를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 업데이트 데이터 준비
        const updateData: Record<string, unknown> = {
            updatedAt: new Date(),
        };

        if (name) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (status) updateData.status = status;

        // 비밀번호 변경 (선택적)
        if (password) {
            updateData.password = await hashPassword(password);
        }

        await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        // 업데이트된 사용자 정보 조회
        const updatedUser = await collection.findOne(
            { _id: new ObjectId(id) },
            { projection: { password: 0 } }
        );

        return NextResponse.json({
            success: true,
            data: {
                ...updatedUser,
                _id: updatedUser?._id.toString(),
            },
            message: '사용자 정보가 수정되었습니다.',
        });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { success: false, error: '사용자 수정 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE - 사용자 삭제 (관리자만)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return NextResponse.json(
                { success: false, error: auth.error },
                { status: 401 }
            );
        }

        const resolvedParams = params instanceof Promise ? await params : params;
        const { id } = resolvedParams;

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 사용자 ID입니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.USERS);

        // 사용자 존재 확인
        const user = await collection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return NextResponse.json(
                { success: false, error: '사용자를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 자기 자신은 삭제 불가
        if (auth.user && auth.user.userId === id) {
            return NextResponse.json(
                { success: false, error: '자기 자신은 삭제할 수 없습니다.' },
                { status: 400 }
            );
        }

        await collection.deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({
            success: true,
            message: '사용자가 삭제되었습니다.',
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { success: false, error: '사용자 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

