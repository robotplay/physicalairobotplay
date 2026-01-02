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
        const { name, email, phone, status, password, image, title, specialty, experience } = body;

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

        // 강사 전용 필드 업데이트
        if (user.role === 'teacher') {
            if (image !== undefined) updateData.image = image;
            if (title !== undefined) updateData.title = title;
            if (specialty !== undefined) updateData.specialty = specialty;
            if (experience !== undefined) updateData.experience = experience;
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

        console.log('Delete user - Received ID:', id);
        console.log('Delete user - ID type:', typeof id);
        console.log('Delete user - Is valid ObjectId:', ObjectId.isValid(id));

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'ID가 제공되지 않았습니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.USERS);

        // ObjectId로 변환 가능한지 확인하고 시도
        let user;
        if (ObjectId.isValid(id)) {
            try {
                const objectId = new ObjectId(id);
                console.log('Attempting to find user with ObjectId:', objectId);
                user = await collection.findOne({ _id: objectId });
            } catch (err) {
                console.error('ObjectId conversion error:', err);
            }
        }

        // ObjectId로 찾지 못하면 문자열 id 필드로도 시도
        if (!user) {
            console.log('Attempting to find user with string id field:', id);
            user = await collection.findOne({ id: id });
        }

        if (!user) {
            console.error('User not found with ID:', id);
            // 디버깅을 위해 모든 사용자의 _id와 id 출력
            const allUsers = await collection.find({}).project({ _id: 1, id: 1, username: 1 }).toArray();
            console.log('All users in DB:', JSON.stringify(allUsers, null, 2));
            
            return NextResponse.json(
                { success: false, error: '사용자를 찾을 수 없습니다. ID를 확인해주세요.' },
                { status: 404 }
            );
        }

        console.log('Found user:', user._id, user.username);

        // 자기 자신은 삭제 불가
        const userIdToCheck = user._id.toString();
        if (auth.user && auth.user.userId === userIdToCheck) {
            return NextResponse.json(
                { success: false, error: '자기 자신은 삭제할 수 없습니다.' },
                { status: 400 }
            );
        }

        // 삭제 실행
        const deleteResult = await collection.deleteOne({ _id: user._id });
        console.log('Delete result:', deleteResult);

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

