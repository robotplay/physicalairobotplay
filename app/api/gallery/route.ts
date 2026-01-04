/**
 * 갤러리 관리 API
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import type { ClassGallery } from '@/types';

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

// GET: 갤러리 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const visibility = searchParams.get('visibility');
        const courseId = searchParams.get('courseId');

        const db = await getDatabase();
        const filter: any = {};

        // Public이면 인증 없이, 그 외는 인증 필요
        if (visibility !== 'public') {
            const authResult = await checkAuth(request);
            if (!authResult.authenticated) {
                return NextResponse.json(
                    { success: false, error: '권한이 없습니다' },
                    { status: 403 }
                );
            }
        }

        if (visibility) filter.visibility = visibility;
        if (courseId) filter.courseId = courseId;

        const galleries = await db
            .collection(COLLECTIONS.CLASS_GALLERY)
            .find(filter)
            .sort({ classDate: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: { galleries },
        });
    } catch (error) {
        console.error('갤러리 목록 조회 실패:', error);
        return NextResponse.json(
            { success: false, error: '갤러리 목록 조회 실패' },
            { status: 500 }
        );
    }
}

// POST: 새 갤러리 등록
export async function POST(request: NextRequest) {
    try {
        const authResult = await checkAuth(request);
        if (!authResult.authenticated || (authResult.user?.role !== 'admin' && authResult.user?.role !== 'teacher')) {
            return NextResponse.json(
                { success: false, error: '권한이 없습니다' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { courseId, classDate, title, description, images, videos, tags, visibility } = body;

        // 유효성 검사
        if (!courseId || !classDate || !title) {
            return NextResponse.json(
                { success: false, error: '필수 정보를 입력해주세요' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const galleryId = `gallery_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const newGallery: Omit<ClassGallery, '_id'> = {
            galleryId,
            courseId,
            classDate: new Date(classDate),
            title,
            description: description || '',
            images: images || [],
            videos: videos || [],
            tags: tags || [],
            visibility: visibility || 'public',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection(COLLECTIONS.CLASS_GALLERY).insertOne(newGallery);

        return NextResponse.json({
            success: true,
            data: { _id: result.insertedId, ...newGallery },
        });
    } catch (error) {
        console.error('갤러리 등록 실패:', error);
        return NextResponse.json(
            { success: false, error: '갤러리 등록 실패' },
            { status: 500 }
        );
    }
}
