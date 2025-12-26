import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

// GET - 공지사항 목록 조회
export async function GET(request: NextRequest) {
    try {
        // MongoDB 연결 확인
        if (!process.env.MONGODB_URI) {
            return NextResponse.json({
                success: true,
                data: [],
                count: 0,
                message: 'MongoDB가 설정되지 않았습니다. 환경 변수를 확인해주세요.',
            });
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.NEWS);

        // 쿼리 파라미터에서 필터링 옵션 가져오기
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '0');
        const sort = searchParams.get('sort') || 'desc'; // desc 또는 asc

        // 필터 조건 구성
        const filter: any = {};
        if (category && category !== 'all') {
            filter.category = category;
        }

        // 정렬 옵션
        const sortOption: any = { createdAt: sort === 'asc' ? 1 : -1 };

        // 쿼리 실행
        let query = collection.find(filter).sort(sortOption);
        if (limit > 0) {
            query = query.limit(limit);
        }

        const news = await query.toArray();

        // 날짜 포맷팅
        const formattedNews = news.map((item: any) => ({
            ...item,
            id: item._id.toString(),
            _id: item._id.toString(),
            createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
        }));

        return NextResponse.json({
            success: true,
            data: formattedNews,
            count: formattedNews.length,
        });
    } catch (error: any) {
        console.error('Failed to fetch news:', error);
        return NextResponse.json(
            {
                success: false,
                error: '공지사항을 불러오는데 실패했습니다.',
                details: error.message,
            },
            { status: 500 }
        );
    }
}

// POST - 공지사항 작성
export async function POST(request: NextRequest) {
    try {
        // MongoDB 연결 확인
        if (!process.env.MONGODB_URI) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'MongoDB가 설정되지 않았습니다. 환경 변수 MONGODB_URI를 확인해주세요.',
                },
                { status: 500 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.NEWS);

        const body = await request.json();
        const { category, title, content, excerpt, image } = body;

        // 필수 필드 검증
        if (!category || !title || !content) {
            return NextResponse.json(
                {
                    success: false,
                    error: '카테고리, 제목, 내용은 필수 항목입니다.',
                },
                { status: 400 }
            );
        }

        // 새 공지사항 생성
        const newNews = {
            category,
            title,
            content,
            excerpt: excerpt || content.substring(0, 150) + '...',
            image: image || '/img/01.jpeg',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(newNews);

        return NextResponse.json({
            success: true,
            data: {
                ...newNews,
                _id: result.insertedId.toString(),
                id: result.insertedId.toString(),
            },
            message: '공지사항이 작성되었습니다.',
        });
    } catch (error: any) {
        console.error('Failed to create news:', error);
        return NextResponse.json(
            {
                success: false,
                error: '공지사항 작성에 실패했습니다.',
                details: error.message,
            },
            { status: 500 }
        );
    }
}


