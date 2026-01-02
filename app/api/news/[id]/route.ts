import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { NewsItem } from '@/types/news';

// 캐싱 설정: 삭제 후 즉시 반영을 위해 캐싱 비활성화
// export const revalidate = 3600; // 삭제 작업 시 캐시 무효화 필요

// GET - 특정 공지사항 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.NEWS);

        // Next.js 16에서는 params가 Promise일 수 있음
        const resolvedParams = params instanceof Promise ? await params : params;
        const { id } = resolvedParams;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: '유효하지 않은 ID입니다.',
                },
                { status: 400 }
            );
        }

        const news = await collection.findOne({ _id: new ObjectId(id) });

        if (!news) {
            return NextResponse.json(
                {
                    success: false,
                    error: '공지사항을 찾을 수 없습니다.',
                },
                { status: 404 }
            );
        }

        const response = NextResponse.json({
            success: true,
            data: {
                ...news,
                id: news._id.toString(),
                _id: news._id.toString(),
            },
        });

        // Cache-Control 헤더: 삭제 후 즉시 반영을 위해 캐시 비활성화
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

// PUT - 공지사항 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
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

        // Next.js 16에서는 params가 Promise일 수 있음
        const resolvedParams = params instanceof Promise ? await params : params;
        const { id } = resolvedParams;
        const body = await request.json();

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: '유효하지 않은 ID입니다.',
                },
                { status: 400 }
            );
        }

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

        // 업데이트 데이터 구성
        const updateData: Partial<NewsItem> & { updatedAt: Date } = {
            category,
            title,
            content,
            updatedAt: new Date(),
        };

        if (excerpt) updateData.excerpt = excerpt;
        if (image) updateData.image = image;

        // authorId가 있으면 작성자 정보 조회 및 업데이트
        if (authorId) {
            const authorIdObj = typeof authorId === 'string' ? new ObjectId(authorId) : authorId;
            const author = await usersCollection.findOne({ _id: authorIdObj });
            if (author && author.name) {
                updateData.authorId = authorId;
                updateData.authorRole = (authorRole || 'admin') as 'admin' | 'teacher';
                updateData.authorName = typeof author.name === 'string' ? author.name : String(author.name);
            }
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: '공지사항을 찾을 수 없습니다.',
                },
                { status: 404 }
            );
        }

        // 업데이트된 문서 가져오기
        const updatedNews = await collection.findOne({ _id: new ObjectId(id) });

        if (!updatedNews) {
            return NextResponse.json(
                {
                    success: false,
                    error: '공지사항을 찾을 수 없습니다.',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                ...updatedNews,
                id: typeof updatedNews._id === 'object' ? updatedNews._id.toString() : updatedNews._id,
                _id: typeof updatedNews._id === 'object' ? updatedNews._id.toString() : updatedNews._id,
            },
            message: '공지사항이 수정되었습니다.',
        });
    } catch (error) {
        console.error('Failed to update news:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        return NextResponse.json(
            {
                success: false,
                error: '공지사항 수정에 실패했습니다.',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}

// DELETE - 공지사항 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.NEWS);

        // Next.js 16에서는 params가 Promise일 수 있음
        const resolvedParams = params instanceof Promise ? await params : params;
        const { id } = resolvedParams;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: '유효하지 않은 ID입니다.',
                },
                { status: 400 }
            );
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: '공지사항을 찾을 수 없습니다.',
                },
                { status: 404 }
            );
        }

        const response = NextResponse.json({
            success: true,
            message: '공지사항이 삭제되었습니다.',
        });

        // 삭제 후 캐시 무효화를 위한 헤더 설정
        response.headers.set(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
        );

        return response;
    } catch (error) {
        console.error('Failed to delete news:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        return NextResponse.json(
            {
                success: false,
                error: '공지사항 삭제에 실패했습니다.',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}







