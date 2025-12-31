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

// GET - 뉴스레터 아카이브 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const month = searchParams.get('month');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const skip = (page - 1) * limit;

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.MONTHLY_NEWSLETTERS);

        // 쿼리 구성
        const query: any = {};
        if (year) {
            query.year = parseInt(year);
        }
        if (month) {
            query.month = parseInt(month);
        }

        // 전체 개수 조회
        const total = await collection.countDocuments(query);

        // 뉴스레터 목록 조회 (최신순)
        const newsletters = await collection
            .find(query)
            .sort({ year: -1, month: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        const formattedNewsletters = newsletters.map((newsletter) => ({
            ...newsletter,
            _id: newsletter._id.toString(),
        }));

        return successResponse({
            newsletters: formattedNewsletters,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// POST - 뉴스레터 생성 및 발송
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const body = await request.json();
        const { month, year, title, content, highlights, studentSpotlights, competitionResults, photos } = body;

        // 필수 필드 검증
        if (!month || !year || !title || !content) {
            return badRequestResponse(
                '필수 항목을 입력해주세요.',
                '월, 연도, 제목, 내용은 필수입니다.'
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.MONTHLY_NEWSLETTERS);

        // 뉴스레터 ID 생성
        const newsletterId = `newsletter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 뉴스레터 데이터 생성
        const newsletterData = {
            newsletterId,
            month: parseInt(month),
            year: parseInt(year),
            title,
            content,
            highlights: highlights || [],
            studentSpotlights: studentSpotlights || [],
            competitionResults: competitionResults || [],
            photos: photos || [],
            sentAt: new Date(),
            createdAt: new Date(),
        };

        const result = await collection.insertOne(newsletterData);

        // TODO: 실제 이메일 발송 로직 추가 (newsletter_subscribers 컬렉션 활용)

        return successResponse(
            {
                ...newsletterData,
                _id: result.insertedId.toString(),
            },
            '뉴스레터가 생성되었습니다.',
            201
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

