import { MetadataRoute } from 'next';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://parplay.co.kr';

// MongoDB 연결 타임아웃 (초)
const MONGODB_TIMEOUT = 5000;

// 타임아웃 처리 헬퍼 함수
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => 
            setTimeout(() => reject(new Error('MongoDB 연결 타임아웃')), timeoutMs)
        ),
    ]);
}

interface NewsItem {
    _id: { toString: () => string };
    updatedAt?: Date | string;
    createdAt?: Date | string;
}

interface CourseItem {
    _id: { toString: () => string };
    updatedAt?: Date | string;
    createdAt?: Date | string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 정적 페이지들
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${siteUrl}/basic-course`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/advanced-course`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${siteUrl}/airrobot-course`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/curriculum`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${siteUrl}/news`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${siteUrl}/program/airplane`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${siteUrl}/program/airplane/success`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${siteUrl}/program/airplane/fail`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${siteUrl}/my-classroom`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // 동적 페이지들 (MongoDB에서 가져오기)
    let dynamicPages: MetadataRoute.Sitemap = [];

    // MongoDB 연결이 있는 경우에만 동적 페이지 추가
    if (process.env.MONGODB_URI) {
        try {
            // 타임아웃과 함께 MongoDB 연결 시도
            const db = await withTimeout(getDatabase(), MONGODB_TIMEOUT);

            // 뉴스 항목들 가져오기
            try {
                const newsCollection = db.collection(COLLECTIONS.NEWS);
                const newsItems = await withTimeout(
                    newsCollection.find({}).sort({ createdAt: -1 }).toArray(),
                    MONGODB_TIMEOUT
                ) as NewsItem[];

                const newsPages = newsItems.map((item) => {
                    let lastModified = new Date();
                    if (item.updatedAt) {
                        lastModified = new Date(item.updatedAt);
                    } else if (item.createdAt) {
                        lastModified = new Date(item.createdAt);
                    }

                    return {
                        url: `${siteUrl}/news/${item._id.toString()}`,
                        lastModified,
                        changeFrequency: 'weekly' as const,
                        priority: 0.7,
                    };
                });

                dynamicPages = [...dynamicPages, ...newsPages];
                console.log(`✅ 사이트맵에 ${newsPages.length}개의 뉴스 페이지 추가됨`);
            } catch (newsError) {
                console.error('❌ 뉴스 데이터 로드 실패 (사이트맵):', newsError);
                // 뉴스 로드 실패해도 계속 진행
            }

            // 온라인 강좌들 가져오기
            try {
                const coursesCollection = db.collection(COLLECTIONS.ONLINE_COURSES);
                const courses = await withTimeout(
                    coursesCollection.find({}).sort({ createdAt: -1 }).toArray(),
                    MONGODB_TIMEOUT
                ) as CourseItem[];

                const coursePages = courses.map((item) => {
                    let lastModified = new Date();
                    if (item.updatedAt) {
                        lastModified = new Date(item.updatedAt);
                    } else if (item.createdAt) {
                        lastModified = new Date(item.createdAt);
                    }

                    return {
                        url: `${siteUrl}/online-courses/${item._id.toString()}`,
                        lastModified,
                        changeFrequency: 'monthly' as const,
                        priority: 0.7,
                    };
                });

                dynamicPages = [...dynamicPages, ...coursePages];
                console.log(`✅ 사이트맵에 ${coursePages.length}개의 온라인 강좌 페이지 추가됨`);
            } catch (courseError) {
                console.error('❌ 온라인 강좌 데이터 로드 실패 (사이트맵):', courseError);
                // 강좌 로드 실패해도 계속 진행
            }
        } catch (error) {
            console.error('❌ MongoDB 연결 실패 (사이트맵):', error);
            // MongoDB 연결 실패해도 정적 페이지는 반환
        }
    } else {
        console.log('ℹ️ MongoDB URI가 설정되지 않아 정적 페이지만 사이트맵에 포함됩니다.');
    }

    console.log(`✅ 사이트맵 생성 완료: 총 ${staticPages.length + dynamicPages.length}개 페이지`);

    return [...staticPages, ...dynamicPages];
}
