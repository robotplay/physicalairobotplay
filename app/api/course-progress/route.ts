/**
 * 강좌 진도 저장/조회 API
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

// 인증 헬퍼
async function checkAuth(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return { authenticated: false };
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return { authenticated: false };
    }

    return { authenticated: true, user: payload };
}

// GET: 특정 강좌의 진도 조회
export async function GET(request: NextRequest) {
    try {
        const authResult = await checkAuth(request);
        if (!authResult.authenticated) {
            return NextResponse.json(
                { success: false, error: '로그인이 필요합니다' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');

        if (!courseId) {
            return NextResponse.json(
                { success: false, error: 'courseId가 필요합니다' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const progress = await db
            .collection(COLLECTIONS.COURSE_PROGRESS)
            .findOne({
                userId: authResult.user?.userId,
                courseId,
            });

        return NextResponse.json({
            success: true,
            data: progress || {
                userId: authResult.user?.userId,
                courseId,
                completedLessons: [],
                currentLesson: null,
                progress: 0,
                lastAccessedAt: new Date(),
            },
        });
    } catch (error) {
        console.error('진도 조회 실패:', error);
        return NextResponse.json(
            { success: false, error: '진도 조회 실패' },
            { status: 500 }
        );
    }
}

// POST: 진도 저장/업데이트
export async function POST(request: NextRequest) {
    try {
        const authResult = await checkAuth(request);
        if (!authResult.authenticated) {
            return NextResponse.json(
                { success: false, error: '로그인이 필요합니다' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { courseId, lessonId, progress, completed } = body;

        if (!courseId || !lessonId) {
            return NextResponse.json(
                { success: false, error: 'courseId와 lessonId가 필요합니다' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const userId = authResult.user?.userId;

        // 기존 진도 확인
        const existing = await db
            .collection(COLLECTIONS.COURSE_PROGRESS)
            .findOne({ userId, courseId });

        const completedLessons = existing?.completedLessons || [];

        // 완료 처리
        if (completed && !completedLessons.includes(lessonId)) {
            completedLessons.push(lessonId);
        }

        const updateData = {
            userId,
            courseId,
            currentLesson: lessonId,
            completedLessons,
            progress: progress || 0,
            lastAccessedAt: new Date(),
            updatedAt: new Date(),
        };

        await db.collection(COLLECTIONS.COURSE_PROGRESS).updateOne(
            { userId, courseId },
            { $set: updateData },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            data: updateData,
            message: '진도가 저장되었습니다',
        });
    } catch (error) {
        console.error('진도 저장 실패:', error);
        return NextResponse.json(
            { success: false, error: '진도 저장 실패' },
            { status: 500 }
        );
    }
}
