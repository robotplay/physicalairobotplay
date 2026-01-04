/**
 * 커리큘럼 관리 API
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import type { Curriculum } from '@/types';

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

// GET: 커리큘럼 목록 조회
export async function GET(request: NextRequest) {
    try {
        const authResult = await checkAuth(request);
        if (!authResult.authenticated) {
            return NextResponse.json(
                { success: false, error: '권한이 없습니다' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');
        const year = searchParams.get('year');
        const month = searchParams.get('month');

        const db = await getDatabase();
        const filter: any = {};

        if (courseId) filter.courseId = courseId;
        if (year) filter.year = parseInt(year);
        if (month) filter.month = parseInt(month);

        const curriculums = await db
            .collection(COLLECTIONS.CURRICULUM)
            .find(filter)
            .sort({ year: -1, month: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: { curriculums },
        });
    } catch (error) {
        console.error('커리큘럼 목록 조회 실패:', error);
        return NextResponse.json(
            { success: false, error: '커리큘럼 목록 조회 실패' },
            { status: 500 }
        );
    }
}

// POST: 새 커리큘럼 등록
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
        const { courseId, month, year, weeks } = body;

        // 유효성 검사
        if (!courseId || !month || !year || !weeks) {
            return NextResponse.json(
                { success: false, error: '필수 정보를 입력해주세요' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // 중복 확인
        const existing = await db
            .collection(COLLECTIONS.CURRICULUM)
            .findOne({ courseId, year, month });

        if (existing) {
            return NextResponse.json(
                { success: false, error: '해당 과목의 커리큘럼이 이미 존재합니다' },
                { status: 400 }
            );
        }

        const curriculumId = `curr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const newCurriculum: Omit<Curriculum, '_id'> = {
            curriculumId,
            courseId,
            month,
            year,
            weeks,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection(COLLECTIONS.CURRICULUM).insertOne(newCurriculum);

        return NextResponse.json({
            success: true,
            data: { _id: result.insertedId, ...newCurriculum },
        });
    } catch (error) {
        console.error('커리큘럼 등록 실패:', error);
        return NextResponse.json(
            { success: false, error: '커리큘럼 등록 실패' },
            { status: 500 }
        );
    }
}
