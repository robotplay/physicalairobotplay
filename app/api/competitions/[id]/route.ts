/**
 * 개별 대회 관리 API
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import type { CompetitionData } from '@/types';

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

// GET: 특정 대회 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await checkAuth(request);
        if (!authResult.authenticated) {
            return NextResponse.json(
                { success: false, error: '인증이 필요합니다' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const db = await getDatabase();
        const competition = await db
            .collection(COLLECTIONS.COMPETITIONS)
            .findOne({ _id: new ObjectId(id) });

        if (!competition) {
            return NextResponse.json(
                { success: false, error: '대회를 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: competition,
        });
    } catch (error) {
        console.error('대회 조회 실패:', error);
        return NextResponse.json(
            { success: false, error: '대회 조회 실패' },
            { status: 500 }
        );
    }
}

// PUT: 대회 정보 수정
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
        
        const {
            name,
            type,
            startDate,
            endDate,
            registrationDeadline,
            description,
            requirements,
            location,
            maxTeams,
            status,
            teams,
        } = body;

        const db = await getDatabase();

        const updateData: Partial<CompetitionData> = {
            updatedAt: new Date(),
        };

        if (name) updateData.name = name;
        if (type) updateData.type = type;
        if (startDate) updateData.startDate = new Date(startDate);
        if (endDate) updateData.endDate = new Date(endDate);
        if (registrationDeadline) updateData.registrationDeadline = new Date(registrationDeadline);
        if (description !== undefined) updateData.description = description;
        if (requirements !== undefined) updateData.requirements = requirements;
        if (location !== undefined) updateData.location = location;
        if (maxTeams !== undefined) updateData.maxTeams = maxTeams;
        if (status) updateData.status = status;
        if (teams !== undefined) updateData.teams = teams;

        const result = await db
            .collection(COLLECTIONS.COMPETITIONS)
            .findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnDocument: 'after' }
            );

        if (!result) {
            return NextResponse.json(
                { success: false, error: '대회를 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error('대회 수정 실패:', error);
        return NextResponse.json(
            { success: false, error: '대회 수정 실패' },
            { status: 500 }
        );
    }
}

// DELETE: 대회 삭제
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
            .collection(COLLECTIONS.COMPETITIONS)
            .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: '대회를 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '대회가 삭제되었습니다',
        });
    } catch (error) {
        console.error('대회 삭제 실패:', error);
        return NextResponse.json(
            { success: false, error: '대회 삭제 실패' },
            { status: 500 }
        );
    }
}
