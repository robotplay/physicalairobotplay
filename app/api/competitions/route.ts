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

// GET - 대회 목록 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const type = searchParams.get('type');

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.COMPETITIONS);

        const query: any = {};
        if (year) {
            query.year = parseInt(year);
        }
        if (type) {
            query.type = type;
        }

        const competitions = await collection
            .find(query)
            .sort({ startDate: -1 })
            .toArray();

        const formattedCompetitions = competitions.map((comp) => ({
            ...comp,
            _id: comp._id.toString(),
        }));

        return successResponse({
            competitions: formattedCompetitions,
            count: formattedCompetitions.length,
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// POST - 대회 생성
export async function POST(request: NextRequest) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const body = await request.json();
        const { name, type, startDate, endDate, registrationDeadline, description, requirements } = body;

        if (!name || !type || !startDate) {
            return badRequestResponse(
                '필수 항목을 입력해주세요.',
                '대회명, 유형, 시작일은 필수입니다.'
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.COMPETITIONS);

        const competitionId = `competition-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const competitionData = {
            competitionId,
            name,
            type,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined,
            registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
            description: description || '',
            requirements: requirements || '',
            teams: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(competitionData);

        return successResponse(
            {
                ...competitionData,
                _id: result.insertedId.toString(),
            },
            '대회가 생성되었습니다.',
            201
        );
    } catch (error) {
        return handleMongoError(error);
    }
}

