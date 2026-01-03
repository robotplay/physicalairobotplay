/**
 * collected_news 컬렉션 인덱스 생성 스크립트
 * MongoDB Shell 또는 Node.js로 실행 가능
 */

// MongoDB 연결 정보는 환경 변수에서 가져옵니다.
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'academy-site';

if (!MONGODB_URI) {
    console.error('MONGODB_URI 환경 변수가 설정되지 않았습니다.');
    process.exit(1);
}

async function createIndexes() {
    try {
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(MONGODB_URI);
        
        await client.connect();
        console.log('MongoDB 연결 성공');
        
        const db = client.db(DB_NAME);
        const collection = db.collection('collected_news');
        
        console.log('인덱스 생성 시작...');
        
        // 1. sourceUrl (unique) - 중복 체크용
        try {
            await collection.createIndex(
                { sourceUrl: 1 },
                { unique: true, name: 'sourceUrl_unique' }
            );
            console.log('✓ sourceUrl 인덱스 생성 완료 (unique)');
        } catch (error) {
            if (error.code === 85) {
                console.log('⚠ sourceUrl 인덱스가 이미 존재합니다 (unique 제약 조건 충돌 가능)');
            } else {
                console.error('✗ sourceUrl 인덱스 생성 실패:', error.message);
            }
        }
        
        // 2. publishedAt (descending) - 최신순 정렬
        try {
            await collection.createIndex(
                { publishedAt: -1 },
                { name: 'publishedAt_desc' }
            );
            console.log('✓ publishedAt 인덱스 생성 완료');
        } catch (error) {
            console.error('✗ publishedAt 인덱스 생성 실패:', error.message);
        }
        
        // 3. isActive + publishedAt - 활성 기사 최신순
        try {
            await collection.createIndex(
                { isActive: 1, publishedAt: -1 },
                { name: 'isActive_publishedAt' }
            );
            console.log('✓ isActive + publishedAt 복합 인덱스 생성 완료');
        } catch (error) {
            console.error('✗ isActive + publishedAt 인덱스 생성 실패:', error.message);
        }
        
        // 4. collectedAt - 수집일 기준 조회
        try {
            await collection.createIndex(
                { collectedAt: -1 },
                { name: 'collectedAt_desc' }
            );
            console.log('✓ collectedAt 인덱스 생성 완료');
        } catch (error) {
            console.error('✗ collectedAt 인덱스 생성 실패:', error.message);
        }
        
        // 5. keywords - 키워드 검색
        try {
            await collection.createIndex(
                { keywords: 1 },
                { name: 'keywords' }
            );
            console.log('✓ keywords 인덱스 생성 완료');
        } catch (error) {
            console.error('✗ keywords 인덱스 생성 실패:', error.message);
        }
        
        // 6. category + publishedAt - 카테고리별 최신순
        try {
            await collection.createIndex(
                { category: 1, publishedAt: -1 },
                { name: 'category_publishedAt' }
            );
            console.log('✓ category + publishedAt 복합 인덱스 생성 완료');
        } catch (error) {
            console.error('✗ category + publishedAt 인덱스 생성 실패:', error.message);
        }
        
        // 7. relevanceScore - 관련성 순 정렬
        try {
            await collection.createIndex(
                { relevanceScore: -1 },
                { name: 'relevanceScore_desc' }
            );
            console.log('✓ relevanceScore 인덱스 생성 완료');
        } catch (error) {
            console.error('✗ relevanceScore 인덱스 생성 실패:', error.message);
        }
        
        // 인덱스 목록 확인
        const indexes = await collection.indexes();
        console.log('\n생성된 인덱스 목록:');
        indexes.forEach((index) => {
            console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
        });
        
        await client.close();
        console.log('\n인덱스 생성 완료!');
    } catch (error) {
        console.error('인덱스 생성 중 오류 발생:', error);
        process.exit(1);
    }
}

// 스크립트 실행
if (require.main === module) {
    createIndexes();
}

module.exports = { createIndexes };

