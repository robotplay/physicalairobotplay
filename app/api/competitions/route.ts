/**
 * 대회 관리 API
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
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

// GET: 대회 목록 조회
export async function GET(request: NextRequest) {
    try {
        const authResult = await checkAuth(request);
        if (!authResult.authenticated || (authResult.user?.role !== 'admin' && authResult.user?.role !== 'teacher')) {
            return NextResponse.json(
                { success: false, error: '권한이 없습니다' },
                { status: 403 }
            );
        }

        const db = await getDatabase();
        const competitions = await db
            .collection(COLLECTIONS.COMPETITIONS)
            .find({})
            .sort({ startDate: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: { competitions },
        });
    } catch (error) {
        console.error('대회 목록 조회 실패:', error);
        return NextResponse.json(
            { success: false, error: '대회 목록 조회 실패' },
            { status: 500 }
        );
    }
}

// POST: 새 대회 등록
export async function POST(request: NextRequest) {
    try {
        const authResult = await checkAuth(request);
        if (!authResult.authenticated || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: '권한이 없습니다' },
                { status: 403 }
            );
        }

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
        } = body;

        // 유효성 검사
        if (!name || !type || !startDate || !endDate) {
            return NextResponse.json(
                { success: false, error: '필수 정보를 입력해주세요' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        
        // 고유 ID 생성
        const competitionId = `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const newCompetition: Omit<CompetitionData, '_id'> = {
            competitionId,
            name,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            registrationDeadline: new Date(registrationDeadline),
            description,
            requirements: requirements || '',
            location: location || '',
            teams: [],
            maxTeams: maxTeams || 0,
            status: 'upcoming',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection(COLLECTIONS.COMPETITIONS).insertOne(newCompetition);

        return NextResponse.json({
            success: true,
            data: { _id: result.insertedId, ...newCompetition },
        });
    } catch (error) {
        console.error('대회 등록 실패:', error);
        return NextResponse.json(
            { success: false, error: '대회 등록 실패' },
            { status: 500 }
        );
    }
}
