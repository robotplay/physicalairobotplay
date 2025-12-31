import { NextRequest } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken, hasPermission } from '@/lib/auth';
import { cookies } from 'next/headers';
import {
    successResponse,
    unauthorizedResponse,
    badRequestResponse,
    handleMongoError,
} from '@/lib/api-response';

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

// GET - 갤러리 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId'); // 과목별 필터
        const visibility = searchParams.get('visibility'); // 공개 범위 필터
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.CLASS_GALLERY);

        // 쿼리 구성
        const query: any = {};
        if (courseId) {
            query.courseId = courseId;
        }
        if (visibility) {
            query.visibility = visibility;
        }

        // 전체 개수 조회
        const total = await collection.countDocuments(query);

        // 갤러리 목록 조회 (최신순)
        const galleries = await collection
            .find(query)
            .sort({ classDate: -1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        const formattedGalleries = galleries.map((gallery) => ({
            ...gallery,
            _id: gallery._id.toString(),
        }));

        return successResponse({
            galleries: formattedGalleries,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// POST - 갤러리 항목 추가
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const body = await request.json();
        const { courseId, classDate, title, description, images, videos, tags, visibility } = body;

        // 필수 필드 검증
        if (!courseId || !classDate || !title) {
            return badRequestResponse(
                '필수 항목을 입력해주세요.',
                '과목, 수업일, 제목은 필수입니다.'
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.CLASS_GALLERY);

        // 갤러리 ID 생성
        const galleryId = `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 갤러리 데이터 생성
        const galleryData = {
            galleryId,
            courseId,
            classDate: new Date(classDate),
            title,
            description: description || '',
            images: images || [],
            videos: videos || [],
            tags: tags || [],
            visibility: visibility || 'public', // public, parents-only, private
            createdAt: new Date(),
        };

        const result = await collection.insertOne(galleryData);

        return successResponse(
            {
                ...galleryData,
                _id: result.insertedId.toString(),
            },
            '갤러리 항목이 추가되었습니다.',
            201
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

