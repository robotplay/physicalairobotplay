import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

const uri: string = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

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

export default clientPromise;

// 데이터베이스 연결 헬퍼 함수
export async function getDatabase(): Promise<Db> {
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB_NAME || 'academy-site');
}

// 컬렉션 이름 상수
export const COLLECTIONS = {
    AIRPLANE_REGISTRATIONS: 'airplane_registrations',
    CONSULTATIONS: 'consultations',
} as const;
