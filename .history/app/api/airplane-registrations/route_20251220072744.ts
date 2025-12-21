import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

// 관리자 페이지에서 신청 목록 조회
export async function GET(request: NextRequest) {
    try {
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.AIRPLANE_REGISTRATIONS);
        
        // 최신순으로 정렬하여 조회
        const registrations = await collection
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: registrations,
            count: registrations.length
        });
    } catch (error) {
        console.error('신청 목록 조회 오류:', error);
        return NextResponse.json(
            { error: '신청 목록 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
