import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import type { NewsFilter, NewsSortOption, NewsItem } from '@/types/news';
import { ObjectId } from 'mongodb';

// 캐싱 설정: 10분 (600초)
export const revalidate = 600;

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
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '6'); // 기본값 6개
        const sort = searchParams.get('sort') || 'desc'; // desc 또는 asc

        // 필터 조건 구성
        const filter: NewsFilter = {};
        if (category && category !== 'all') {
            filter.category = category;
        }

        // 정렬 옵션
        const sortOption: Record<string, 1 | -1> = { createdAt: sort === 'asc' ? 1 : -1 };

        // 전체 개수 조회 (페이지네이션용)
        const totalCount = await collection.countDocuments(filter);

        // 페이지네이션 계산
        const skip = (page - 1) * limit;
        const totalPages = Math.ceil(totalCount / limit);

        // 쿼리 실행
        let query = collection.find(filter).sort(sortOption).skip(skip);
        if (limit > 0) {
            query = query.limit(limit);
        }

        const news = await query.toArray();

        // 날짜 포맷팅
        const formattedNews = (news as unknown as NewsItem[]).map((item: NewsItem) => ({
            ...item,
            id: typeof item._id === 'object' ? item._id.toString() : item._id,
            _id: typeof item._id === 'object' ? item._id.toString() : item._id,
            createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
        }));

        const response = NextResponse.json({
            success: true,
            data: formattedNews,
            count: formattedNews.length,
            totalCount,
            page,
            totalPages,
            limit,
        });

        // Cache-Control 헤더: 관리자 페이지에서 삭제 후 즉시 반영을 위해 캐시 비활성화
        // 클라이언트에서 cache: 'no-store'를 사용하므로 여기서도 일관성 유지
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );

        return response;
    } catch (error) {
        console.error('Failed to fetch news:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        return NextResponse.json(
            {
                success: false,
                error: '공지사항을 불러오는데 실패했습니다.',
                details: errorMessage,
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
        const usersCollection = db.collection(COLLECTIONS.USERS);

        const body = await request.json();
        const { category, title, content, excerpt, image, authorId, authorRole } = body;

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

        // authorId가 있으면 작성자 정보 조회
        let authorName: string | undefined = undefined;
        if (authorId) {
            const authorIdObj = typeof authorId === 'string' ? new ObjectId(authorId) : authorId;
            const author = await usersCollection.findOne({ _id: authorIdObj });
            if (author && author.name) {
                authorName = typeof author.name === 'string' ? author.name : String(author.name);
            }
        }

        // 새 공지사항 생성
        const newNews = {
            category,
            title,
            content,
            excerpt: excerpt || content.substring(0, 150) + '...',
            image: image || '/img/01.jpeg',
            authorId: authorId || undefined, // 작성자 ID
            authorRole: authorRole || 'admin', // 작성자 역할 (admin, teacher)
            authorName: authorName || undefined, // 작성자 이름
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
    } catch (error) {
        console.error('Failed to create news:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        return NextResponse.json(
            {
                success: false,
                error: '공지사항 작성에 실패했습니다.',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}







