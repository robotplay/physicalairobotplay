import { MongoClient, Db } from 'mongodb';

// 개발 환경에서는 환경 변수가 없어도 에러를 던지지 않음 (로컬 스토리지 사용)
if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ MONGODB_URI가 설정되지 않았습니다. 로컬 스토리지를 사용합니다.');
}

const uri: string = process.env.MONGODB_URI || '';
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
    if (process.env.NODE_ENV === 'development') {
        // 개발 환경에서는 전역 변수에 저장하여 재사용
        let globalWithMongo = global as typeof globalThis & {
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
    AIRPLANE_REGISTRATIONS: 'airplane_registrations',
    CONSULTATIONS: 'consultations',
    PAYMENTS: 'payments',
} as const;











