import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

// 데이터베이스 연결 테스트 API
export async function GET(request: NextRequest) {
    try {
        // MongoDB 연결 테스트
        const db = await getDatabase();
        
        // 컬렉션 존재 여부 확인
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        // 테스트 데이터 삽입 및 삭제
        const testCollection = db.collection('test_connection');
        const testResult = await testCollection.insertOne({
            test: true,
            timestamp: new Date(),
        });
        
        await testCollection.deleteOne({ _id: testResult.insertedId });
        
        return NextResponse.json({
            success: true,
            message: 'MongoDB 연결 성공!',
            database: db.databaseName,
            collections: collectionNames,
            test: '연결 테스트 완료'
        });
    } catch (error: any) {
        console.error('MongoDB 연결 테스트 실패:', error);
        
        // 에러 타입별 메시지
        let errorMessage = 'MongoDB 연결에 실패했습니다.';
        
        if (error.message?.includes('ENOTFOUND') || error.message?.includes('getaddrinfo')) {
            errorMessage = 'MongoDB 서버를 찾을 수 없습니다. 연결 문자열을 확인해주세요.';
        } else if (error.message?.includes('authentication failed') || error.message?.includes('bad auth')) {
            errorMessage = '인증에 실패했습니다. 사용자 이름과 비밀번호를 확인해주세요.';
        } else if (error.message?.includes('MONGODB_URI')) {
            errorMessage = 'MONGODB_URI 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.';
        } else if (error.message?.includes('IP')) {
            errorMessage = 'IP 주소가 허용되지 않았습니다. MongoDB Atlas의 Network Access에서 IP를 추가해주세요.';
        }
        
        return NextResponse.json({
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
