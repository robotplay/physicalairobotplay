/**
 * 개별 팝업 관리 API
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import type { Popup } from '@/types';

// 인증 헬퍼 함수
async function checkAuth(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return { authenticated: false, error: '인증되지 않았습니다.' };
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return { authenticated: false, error: '유효하지 않은 토큰입니다.' };
    }

    return { authenticated: true, user: payload };
}

// PUT: 팝업 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await checkAuth(request);
        if (!authResult.authenticated || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: '권한이 없습니다' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();

        const db = await getDatabase();

        const updateData: Partial<Popup> = {
            ...body,
            updatedAt: new Date(),
        };

        if (body.startDate) updateData.startDate = new Date(body.startDate);
        if (body.endDate) updateData.endDate = new Date(body.endDate);

        const result = await db
            .collection(COLLECTIONS.POPUPS)
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnDocument: 'after' }
            );

        if (!result) {
            return NextResponse.json(
                { success: false, error: '팝업을 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('팝업 수정 실패:', error);
        return NextResponse.json(
            { success: false, error: '팝업 수정 실패' },
            { status: 500 }
        );
    }
}

// DELETE: 팝업 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await checkAuth(request);
        if (!authResult.authenticated || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: '권한이 없습니다' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const db = await getDatabase();

        const result = await db
            .collection(COLLECTIONS.POPUPS)
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: '팝업을 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '팝업이 삭제되었습니다',
        });
    } catch (error) {
        console.error('팝업 삭제 실패:', error);
        return NextResponse.json(
            { success: false, error: '팝업 삭제 실패' },
            { status: 500 }
        );
    }
}

