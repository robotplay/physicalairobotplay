/**
 * 팝업 관리 API
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import type { Popup } from '@/types';

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

// GET: 팝업 목록 조회 (공개 - 활성화된 팝업만, 관리자 - 전체)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '/';
        const admin = searchParams.get('admin') === 'true';

        const db = await getDatabase();
        const filter: any = {};

        if (!admin) {
            // 공개 조회: 활성화되고 현재 날짜에 해당하는 것만
            filter.isActive = true;
            filter.$or = [
                { targetPages: { $in: [page, '*'] } },
                { targetPages: { $size: 0 } },
            ];

            const now = new Date();
            filter.$and = [
                { $or: [{ startDate: { $exists: false } }, { startDate: { $lte: now } }] },
                { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: now } }] },
            ];
        } else {
            // 관리자 조회: 인증 확인
            const authResult = await checkAuth(request);
            if (!authResult.authenticated || authResult.user?.role !== 'admin') {
                return NextResponse.json(
                    { success: false, error: '권한이 없습니다' },
                    { status: 403 }
                );
            }
        }

        const popups = await db
            .collection(COLLECTIONS.POPUPS)
            .find(filter)
            .sort({ priority: -1, createdAt: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: { popups },
        });
    } catch (error) {
        console.error('팝업 목록 조회 실패:', error);
        return NextResponse.json(
            { success: false, error: '팝업 목록 조회 실패' },
            { status: 500 }
        );
    }
}

// POST: 새 팝업 등록
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
            title,
            content,
            type,
            trigger,
            triggerValue,
            targetPages,
            ctaText,
            ctaUrl,
            imageUrl,
            position,
            showFrequency,
            priority,
            startDate,
            endDate,
        } = body;

        // 유효성 검사
        if (!title || !content || !type || !trigger) {
            return NextResponse.json(
                { success: false, error: '필수 정보를 입력해주세요' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const popupId = `popup_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const newPopup: Omit<Popup, '_id'> = {
            popupId,
            title,
            content,
            type,
            trigger,
            triggerValue: triggerValue || 0,
            targetPages: targetPages || [],
            ctaText,
            ctaUrl,
            imageUrl,
            position: position || 'center',
            showFrequency: showFrequency || 'once-per-session',
            isActive: true,
            priority: priority || 1,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection(COLLECTIONS.POPUPS).insertOne(newPopup);

        return NextResponse.json({
            success: true,
            data: { _id: result.insertedId, ...newPopup },
        });
    } catch (error) {
        console.error('팝업 등록 실패:', error);
        return NextResponse.json(
            { success: false, error: '팝업 등록 실패' },
            { status: 500 }
        );
    }
}

