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

// GET - FAQ 목록 조회 (공개 API, 인증 불필요)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category'); // 카테고리 필터
        const isActive = searchParams.get('isActive'); // 활성화된 것만

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.FAQ);

        // 쿼리 구성
        const query: any = {};
        if (category) {
            query.category = category;
        }
        if (isActive === 'true') {
            query.isActive = true;
        }

        // FAQ 목록 조회 (order 순서대로 정렬)
        const faqs = await collection
            .find(query)
            .sort({ order: 1, createdAt: -1 })
            .toArray();

        const formattedFaqs = faqs.map((faq) => ({
            ...faq,
            _id: faq._id.toString(),
        }));

        return successResponse({
            faqs: formattedFaqs,
            count: formattedFaqs.length,
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// POST - FAQ 추가 (관리자만)
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const body = await request.json();
        const { category, question, answer, order, isActive } = body;

        // 필수 필드 검증
        if (!category || !question || !answer) {
            return badRequestResponse(
                '필수 항목을 입력해주세요.',
                '카테고리, 질문, 답변은 필수입니다.'
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.FAQ);

        // FAQ ID 생성
        const faqId = `faq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // order가 없으면 마지막 순서 + 1
        let finalOrder = order;
        if (!finalOrder) {
            const lastFaq = await collection
                .findOne({}, { sort: { order: -1 } });
            finalOrder = lastFaq ? (lastFaq.order as number) + 1 : 1;
        }

        // FAQ 데이터 생성
        const faqData = {
            faqId,
            category,
            question,
            answer,
            order: finalOrder,
            isActive: isActive !== undefined ? isActive : true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(faqData);

        return successResponse(
            {
                ...faqData,
                _id: result.insertedId.toString(),
            },
            'FAQ가 추가되었습니다.',
            201
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

