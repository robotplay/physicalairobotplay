import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB 연결 직접 테스트 API (진단용)
export async function GET(request: NextRequest) {
    try {
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            return NextResponse.json({
                success: false,
                error: 'MONGODB_URI 환경 변수가 설정되지 않았습니다.',
                check: '.env.local 파일을 확인하세요.'
            }, { status: 500 });
        }

        // 연결 문자열 정보 추출 (디버깅용)
        const uriMatch = mongoUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)/);
        const connectionInfo = uriMatch ? {
            username: uriMatch[1],
            passwordLength: uriMatch[2].length,
            host: uriMatch[3],
            database: uriMatch[4] || '없음'
        } : null;

        // 실제 연결 테스트
        let client: MongoClient | null = null;
        try {
            client = new MongoClient(mongoUri, {
                serverSelectionTimeoutMS: 5000, // 5초 타임아웃
            });
            
            await client.connect();
            
            // 연결 성공
            const adminDb = client.db().admin();
            const serverStatus = await adminDb.serverStatus();
            
            await client.close();
            
            return NextResponse.json({
                success: true,
                message: 'MongoDB 연결 성공!',
                connectionInfo: connectionInfo,
                serverVersion: serverStatus.version,
                check: '연결이 정상적으로 작동합니다.'
            });
        } catch (connectError: any) {
            if (client) {
                await client.close().catch(() => {});
            }
            
            // 에러 타입별 상세 정보
            let errorDetails = {
                type: '알 수 없는 오류',
                message: connectError.message,
                suggestions: []
            };
            
            if (connectError.message?.includes('authentication failed') || connectError.message?.includes('bad auth')) {
                errorDetails.type = '인증 실패';
                errorDetails.suggestions = [
                    'MongoDB Atlas에서 사용자 이름과 비밀번호를 확인하세요.',
                    '비밀번호에 특수문자가 있으면 URL 인코딩이 필요할 수 있습니다.',
                    'MongoDB Atlas → Database & Network Access → Database Users에서 사용자를 확인하세요.',
                    '사용자 비밀번호를 재설정해보세요.'
                ];
            } else if (connectError.message?.includes('ENOTFOUND') || connectError.message?.includes('getaddrinfo')) {
                errorDetails.type = '서버를 찾을 수 없음';
                errorDetails.suggestions = [
                    '연결 문자열의 호스트 주소를 확인하세요.',
                    '인터넷 연결을 확인하세요.'
                ];
            } else if (connectError.message?.includes('IP')) {
                errorDetails.type = 'IP 주소가 허용되지 않음';
                errorDetails.suggestions = [
                    'MongoDB Atlas → Database & Network Access → Network Access에서 IP를 추가하세요.',
                    '0.0.0.0/0을 추가하여 모든 IP를 허용할 수 있습니다.'
                ];
            }
            
            return NextResponse.json({
                success: false,
                error: errorDetails.type,
                message: errorDetails.message,
                connectionInfo: connectionInfo,
                suggestions: errorDetails.suggestions,
                details: process.env.NODE_ENV === 'development' ? connectError.message : undefined
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('MongoDB 검증 오류:', error);
        return NextResponse.json({
            success: false,
            error: '예상치 못한 오류가 발생했습니다.',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}







