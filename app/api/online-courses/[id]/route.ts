import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// 캐싱 설정: 1시간 (3600초)
export const revalidate = 3600;

// GET - 특정 온라인 강좌 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const resolvedParams = params instanceof Promise ? await params : params;
        const { id } = resolvedParams;

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 강좌 ID입니다.' },
                { status: 400 }
            );
        }

        if (!process.env.MONGODB_URI) {
            return NextResponse.json({
                success: false,
                error: 'MongoDB가 설정되지 않았습니다.',
            }, { status: 500 });
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

        const formattedCourse = {
            ...course,
            id: course._id.toString(),
            _id: course._id.toString(),
        };

        const response = NextResponse.json({
            success: true,
            data: formattedCourse,
        });

        // Cache-Control 헤더 추가
        response.headers.set(
            'Cache-Control',
            'public, s-maxage=3600, stale-while-revalidate=86400'
        );

        return response;
    } catch (error) {
        console.error('Failed to fetch online course:', error);
        return NextResponse.json(
            { success: false, error: '강좌를 불러오는데 실패했습니다.' },
            { status: 500 }
        );
    }
}






