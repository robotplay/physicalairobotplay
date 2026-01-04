import { MongoClient, Db } from 'mongodb';
import { validateEnvOrThrow } from './env-validation';

// 프로덕션 환경에서 필수 환경 변수 검증
if (process.env.NODE_ENV === 'production') {
    try {
        validateEnvOrThrow();
    } catch (error) {
        // 프로덕션에서는 에러를 던져서 앱 시작을 막음
        console.error(error instanceof Error ? error.message : String(error));
        throw error;
    }
}

const uri: string = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
    if (process.env.NODE_ENV === 'development') {
        // 개발 환경에서는 전역 변수에 저장하여 재사용
        const globalWithMongo = global as typeof globalThis & {
            _mongoClientPromise?: Promise<MongoClient>;
        };

        if (!globalWithMongo._mongoClientPromise) {
            client = new MongoClient(uri, options);
            globalWithMongo._mongoClientPromise = client.connect();
        }
        clientPromise = globalWithMongo._mongoClientPromise;
    } else {
        // 프로덕션 환경
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
    }
}

export default clientPromise;

// 데이터베이스 연결 헬퍼 함수
export async function getDatabase(): Promise<Db> {
    if (!clientPromise) {
        throw new Error('MongoDB URI가 설정되지 않았습니다. .env.local 파일에 MONGODB_URI를 추가해주세요.');
    }
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB_NAME || 'academy-site');
}

// 컬렉션 이름 상수
export const COLLECTIONS = {
    USERS: 'users',
    AIRPLANE_REGISTRATIONS: 'airplane_registrations',
    CONSULTATIONS: 'consultations',
    PAYMENTS: 'payments',
    NEWS: 'news',
    ONLINE_COURSES: 'online_courses',
    ONLINE_ENROLLMENTS: 'online_enrollments',
    NEWSLETTER_SUBSCRIBERS: 'newsletter_subscribers',
    EMAIL_CAMPAIGNS: 'email_campaigns',
    SOCIAL_POSTS: 'social_posts',
    STUDENTS: 'students',
    FAQ: 'faq',
    CLASS_GALLERY: 'class_gallery',
    MONTHLY_NEWSLETTERS: 'monthly_newsletters',
    COMPETITIONS: 'competitions',
    CURRICULUM: 'curriculum',
    STUDENT_FEEDBACK: 'student_feedback',
    ANALYTICS: 'analytics',
    IMPROVEMENT_IDEAS: 'improvement_ideas',
    ATTENDANCE: 'attendance',
    CONSULTATION_SCHEDULES: 'consultation_schedules',
    COLLECTED_NEWS: 'collected_news',
    COLLECTION_LOGS: 'collection_logs',
    RSS_FEED_SOURCES: 'rss_feed_sources',
    POPUPS: 'popups',
    LEAD_MAGNETS: 'lead_magnets',
    LEADS: 'leads',
    CONVERSION_EVENTS: 'conversion_events',
} as const;
