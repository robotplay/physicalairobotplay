import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

// 공지사항 API 테스트 엔드포인트
export async function GET(request: NextRequest) {
    try {
        // MongoDB 연결 확인
        const hasMongoUri = !!process.env.MONGODB_URI;
        
        if (!hasMongoUri) {
            return NextResponse.json({
                success: false,
                error: 'MongoDB URI가 설정되지 않았습니다.',
                hasMongoUri: false,
                message: 'Vercel 환경 변수에 MONGODB_URI를 설정해주세요.',
            });
        }

        // 데이터베이스 연결 테스트
        try {
            const db = await getDatabase();
            const collection = db.collection(COLLECTIONS.NEWS);
            
            // 컬렉션 존재 확인 및 카운트
            const count = await collection.countDocuments();
            
            return NextResponse.json({
                success: true,
                hasMongoUri: true,
                dbConnected: true,
                collectionExists: true,
                newsCount: count,
                message: 'MongoDB 연결이 정상입니다.',
            });
        } catch (dbError: any) {
            return NextResponse.json({
                success: false,
                hasMongoUri: true,
                dbConnected: false,
                error: 'MongoDB 연결 실패',
                details: dbError.message,
            }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: '테스트 중 오류 발생',
            details: error.message,
        }, { status: 500 });
    }
}
