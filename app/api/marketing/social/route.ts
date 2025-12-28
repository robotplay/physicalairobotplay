import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/auth-middleware';

// 소셜 미디어 포스트 생성 및 기록
export async function POST(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const authResult = await verifyAdminAuth(request);
        if (!authResult.success) {
            return NextResponse.json(
                { success: false, error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { 
            contentType, // 'news' | 'course' | 'custom'
            contentId, 
            title, 
            description, 
            imageUrl, 
            linkUrl,
            platforms, // ['facebook', 'twitter', 'instagram'] 등
            autoPost = false, // 자동 포스팅 여부
        } = body;

        if (!contentType || !title || !description) {
            return NextResponse.json(
                { success: false, error: '필수 필드가 누락되었습니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.SOCIAL_POSTS);

        const postData = {
            contentType,
            contentId: contentId || null,
            title,
            description,
            imageUrl: imageUrl || null,
            linkUrl: linkUrl || null,
            platforms: platforms || [],
            status: 'pending', // pending, posted, failed
            autoPost,
            createdAt: new Date(),
            postedAt: null as Date | null,
            postResults: {} as Record<string, { success: boolean; postId?: string; error?: string; timestamp: Date }>,
        };

        // 실제 소셜 미디어 API 연동은 추후 구현
        // 현재는 데이터베이스에 기록만 함
        if (autoPost) {
            // TODO: 실제 소셜 미디어 API 연동
            // - Facebook Graph API
            // - Twitter API v2
            // - Instagram Basic Display API
            // 등등...
            
            // 일단 시뮬레이션
            postData.status = 'posted';
            postData.postedAt = new Date();
            postData.platforms.forEach((platform: string) => {
                postData.postResults[platform] = {
                    success: true,
                    postId: `simulated_${Date.now()}`,
                    timestamp: new Date(),
                };
            });
        }

        const result = await collection.insertOne(postData);

        return NextResponse.json({
            success: true,
            message: autoPost ? '소셜 미디어에 포스팅되었습니다.' : '소셜 미디어 포스트가 생성되었습니다.',
            data: {
                postId: result.insertedId.toString(),
                status: postData.status,
                postResults: postData.postResults,
            },
        });
    } catch (error: any) {
        console.error('소셜 미디어 포스트 생성 오류:', error);
        return NextResponse.json(
            { success: false, error: '소셜 미디어 포스트 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 소셜 미디어 포스트 목록 조회
export async function GET(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const authResult = await verifyAdminAuth(request);
        if (!authResult.success) {
            return NextResponse.json(
                { success: false, error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const contentType = searchParams.get('contentType');
        const status = searchParams.get('status');

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.SOCIAL_POSTS);

        // 쿼리 조건
        const query: any = {};
        if (contentType) {
            query.contentType = contentType;
        }
        if (status) {
            query.status = status;
        }

        // 총 개수
        const total = await collection.countDocuments(query);

        // 목록 조회
        const posts = await collection
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        return NextResponse.json({
            success: true,
            data: {
                posts: posts.map((post) => ({
                    _id: post._id.toString(),
                    contentType: post.contentType,
                    contentId: post.contentId,
                    title: post.title,
                    description: post.description,
                    imageUrl: post.imageUrl,
                    linkUrl: post.linkUrl,
                    platforms: post.platforms,
                    status: post.status,
                    autoPost: post.autoPost,
                    postResults: post.postResults,
                    createdAt: post.createdAt,
                    postedAt: post.postedAt,
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error: any) {
        console.error('소셜 미디어 포스트 목록 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '소셜 미디어 포스트 목록 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

