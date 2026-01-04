/**
 * Leads (잠재 고객) 관리 API
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import type { Lead } from '@/types';

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

// GET: Leads 목록 조회 (관리자만)
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
        const status = searchParams.get('status');
        const source = searchParams.get('source');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        const db = await getDatabase();
        const filter: any = {};

        if (status) filter.status = status;
        if (source) filter.source = source;

        const leads = await db
            .collection(COLLECTIONS.LEADS)
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        const total = await db.collection(COLLECTIONS.LEADS).countDocuments(filter);

        return NextResponse.json({
            success: true,
            data: {
                leads,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error('Leads 목록 조회 실패:', error);
        return NextResponse.json(
            { success: false, error: 'Leads 목록 조회 실패' },
            { status: 500 }
        );
    }
}

// POST: 새 Lead 등록 (공개 API - 랜딩 페이지에서 사용)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, source, sourceDetail, interests, metadata } = body;

        // 유효성 검사
        if (!name || !email) {
            return NextResponse.json(
                { success: false, error: '이름과 이메일은 필수입니다' },
                { status: 400 }
            );
        }

        const db = await getDatabase();

        // 중복 확인 (같은 이메일)
        const existing = await db
            .collection(COLLECTIONS.LEADS)
            .findOne({ email });

        if (existing) {
            // 중복이면 업데이트
            await db
                .collection(COLLECTIONS.LEADS)
                .updateOne(
                    { email },
                    {
                        $set: {
                            name,
                            phone: phone || existing.phone,
                            source: source || existing.source,
                            sourceDetail: sourceDetail || existing.sourceDetail,
                            interests: interests || existing.interests,
                            metadata: { ...(existing.metadata || {}), ...(metadata || {}) },
                            updatedAt: new Date(),
                        },
                    }
                );

            return NextResponse.json({
                success: true,
                data: { message: '정보가 업데이트되었습니다' },
            });
        }

        // 새로 등록
        const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const newLead: Omit<Lead, '_id'> = {
            leadId,
            name,
            email,
            phone: phone || '',
            source: source || 'other',
            sourceDetail: sourceDetail || '',
            status: 'new',
            interests: interests || [],
            metadata: metadata || {},
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db.collection(COLLECTIONS.LEADS).insertOne(newLead);

        // 관리자에게 알림 이메일 발송 (TODO: 이메일 서비스 연동)
        // await sendAdminNotification(newLead);

        return NextResponse.json({
            success: true,
            data: { _id: result.insertedId, ...newLead },
            message: '신청이 완료되었습니다',
        });
    } catch (error) {
        console.error('Lead 등록 실패:', error);
        return NextResponse.json(
            { success: false, error: 'Lead 등록 실패' },
            { status: 500 }
        );
    }
}

