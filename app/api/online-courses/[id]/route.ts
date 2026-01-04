import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - 개별 온라인 강좌 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 ID입니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.ONLINE_COURSES);

        const course = await collection.findOne({ _id: new ObjectId(id) });

        if (!course) {
            return NextResponse.json(
                { success: false, error: '강좌를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // _id를 문자열로 변환
        const formattedCourse = {
            ...course,
            _id: course._id.toString(),
            id: course._id.toString(),
        };

        const response = NextResponse.json({
            success: true,
            data: formattedCourse,
        });

        // 캐시 설정
        response.headers.set(
            'Cache-Control',
            'public, s-maxage=1800, stale-while-revalidate=3600'
        );

        return response;
    } catch (error) {
        console.error('Failed to fetch course:', error);
        return NextResponse.json(
            { success: false, error: '강좌를 불러오는데 실패했습니다.' },
            { status: 500 }
        );
    }
}
