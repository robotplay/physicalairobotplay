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

// GET - 커리큘럼 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.CURRICULUM);

        const query: any = {};
        if (courseId) {
            query.courseId = courseId;
        }
        if (month) {
            query.month = parseInt(month);
        }
        if (year) {
            query.year = parseInt(year);
        }

        const curricula = await collection
            .find(query)
            .sort({ year: -1, month: -1 })
            .toArray();

        const formattedCurricula = curricula.map((curriculum) => ({
            ...curriculum,
            _id: curriculum._id.toString(),
        }));

        return successResponse({
            curricula: formattedCurricula,
            count: formattedCurricula.length,
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// POST - 커리큘럼 생성
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const body = await request.json();
        const { courseId, month, year, weeks } = body;

        if (!courseId || !month || !year) {
            return badRequestResponse(
                '필수 항목을 입력해주세요.',
                '과목, 월, 연도는 필수입니다.'
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.CURRICULUM);

        const curriculumId = `curriculum-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const curriculumData = {
            curriculumId,
            courseId,
            month: parseInt(month),
            year: parseInt(year),
            weeks: weeks || [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(curriculumData);

        return successResponse(
            {
                ...curriculumData,
                _id: result.insertedId.toString(),
            },
            '커리큘럼이 생성되었습니다.',
            201
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

