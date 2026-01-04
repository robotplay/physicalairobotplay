/**
 * 전환 이벤트 추적 API
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import type { ConversionEvent } from '@/types';

// 인증 헬퍼 함수 (선택적 - 익명 사용자도 이벤트 추적 가능)
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

// 세션 ID 생성 또는 가져오기
async function getSessionId(request: NextRequest): Promise<string> {
    const cookieStore = await cookies();
    let sessionId = cookieStore.get('session-id')?.value;
    
    if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    
    return sessionId;
}

// GET: 전환 이벤트 목록 조회 (관리자만)
export async function GET(request: NextRequest) {
    try {
        const authResult = await checkAuth(request);
        if (!authResult.authenticated || authResult.user?.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: '권한이 없습니다' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const eventType = searchParams.get('eventType');
        const source = searchParams.get('source');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');
        const skip = (page - 1) * limit;

        const db = await getDatabase();
        const filter: any = {};

        if (eventType) filter.eventType = eventType;
        if (source) filter.source = source;
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        const events = await db
            .collection(COLLECTIONS.CONVERSION_EVENTS)
            .find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        const total = await db.collection(COLLECTIONS.CONVERSION_EVENTS).countDocuments(filter);

        // 통계 계산
        const stats = await db
            .collection(COLLECTIONS.CONVERSION_EVENTS)
            .aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: '$eventType',
                        count: { $sum: 1 },
                    },
                },
            ])
            .toArray();

        return NextResponse.json({
            success: true,
            data: {
                events,
                stats,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('전환 이벤트 조회 실패:', error);
        return NextResponse.json(
            { success: false, error: '전환 이벤트 조회 실패' },
            { status: 500 }
        );
    }
}

// POST: 전환 이벤트 기록 (공개 API)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { eventType, eventName, source, metadata } = body;

        // 유효성 검사
        if (!eventType || !eventName || !source) {
            return NextResponse.json(
                { success: false, error: '필수 필드가 누락되었습니다' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // 세션 ID 가져오기
        const sessionId = await getSessionId(request);

        // 사용자 ID (로그인한 경우)
        const authResult = await checkAuth(request);
        const userId = authResult.authenticated ? authResult.user?.userId : undefined;

        const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const newEvent: Omit<ConversionEvent, '_id'> = {
            eventId,
            eventType,
            eventName,
            userId,
            sessionId,
            source,
            metadata: metadata || {},
            timestamp: new Date(),
        };

        await db.collection(COLLECTIONS.CONVERSION_EVENTS).insertOne(newEvent);

        // 응답에 세션 ID 쿠키 설정
        const response = NextResponse.json({
            success: true,
            data: { eventId },
        });

        response.cookies.set('session-id', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30일
        });

        return response;
    } catch (error) {
        console.error('전환 이벤트 기록 실패:', error);
        return NextResponse.json(
            { success: false, error: '전환 이벤트 기록 실패' },
            { status: 500 }
        );
    }
}

