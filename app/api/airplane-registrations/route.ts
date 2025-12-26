import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

// 신청서 조회 API
export async function GET(request: NextRequest) {
    try {
        // MongoDB 연결 확인
        if (!process.env.MONGODB_URI) {
            return NextResponse.json(
                { error: 'MongoDB가 설정되지 않았습니다.' },
                { status: 500 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.AIRPLANE_REGISTRATIONS);

        // 쿼리 파라미터 확인
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '100');
        const skip = parseInt(searchParams.get('skip') || '0');
        const status = searchParams.get('status'); // pending, paid, completed, cancelled
        const paymentStatus = searchParams.get('paymentStatus'); // unpaid, paid, refunded

        // 쿼리 조건 생성
        const query: any = {};
        if (status) {
            query.status = status;
        }
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        // 신청서 조회 (최신순)
        const registrations = await collection
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .toArray();

        // 총 개수 조회
        const totalCount = await collection.countDocuments(query);

        // ObjectId를 문자열로 변환
        const formattedRegistrations = registrations.map((registration) => ({
            ...registration,
            _id: registration._id.toString(),
        }));

        return NextResponse.json({
            success: true,
            data: formattedRegistrations,
            total: totalCount,
            limit,
            skip,
        });
    } catch (error: any) {
        console.error('신청서 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: '신청서를 불러오는 중 오류가 발생했습니다.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            },
            { status: 500 }
        );
    }
}





