import { MetadataRoute } from 'next';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://parplay.co.kr';

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
            const db = await getDatabase();

            // 뉴스 항목들 가져오기
            try {
                const newsCollection = db.collection(COLLECTIONS.NEWS);
                const newsItems = await newsCollection
                    .find({})
                    .sort({ createdAt: -1 })
                    .toArray();

                const newsPages = newsItems.map((item: { _id: { toString: () => string }; updatedAt?: Date; createdAt?: Date }) => ({
                    url: `${siteUrl}/news/${item._id.toString()}`,
                    lastModified: item.updatedAt 
                        ? new Date(item.updatedAt) 
                        : item.createdAt 
                        ? new Date(item.createdAt) 
                        : new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                }));

                dynamicPages = [...dynamicPages, ...newsPages];
            } catch (newsError) {
                console.error('Failed to fetch news for sitemap:', newsError);
                // 뉴스 로드 실패해도 계속 진행
            }

            // 온라인 강좌들 가져오기
            try {
                const coursesCollection = db.collection(COLLECTIONS.ONLINE_COURSES);
                const courses = await coursesCollection
                    .find({})
                    .sort({ createdAt: -1 })
                    .toArray();

                const coursePages = courses.map((item: { _id: { toString: () => string }; updatedAt?: Date; createdAt?: Date }) => ({
                    url: `${siteUrl}/online-courses/${item._id.toString()}`,
                    lastModified: item.updatedAt 
                        ? new Date(item.updatedAt) 
                        : item.createdAt 
                        ? new Date(item.createdAt) 
                        : new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.7,
                }));

                dynamicPages = [...dynamicPages, ...coursePages];
            } catch (courseError) {
                console.error('Failed to fetch courses for sitemap:', courseError);
                // 강좌 로드 실패해도 계속 진행
            }
        } catch (error) {
            console.error('Error connecting to MongoDB for sitemap:', error);
            // MongoDB 연결 실패해도 정적 페이지는 반환
        }
    }

    return [...staticPages, ...dynamicPages];
}

