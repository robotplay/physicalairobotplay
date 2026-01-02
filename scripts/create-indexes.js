/**
 * MongoDB 인덱스 생성 스크립트
 * 
 * 자주 조회되는 필드에 인덱스를 추가하여 쿼리 성능을 향상시킵니다.
 * 
 * 실행 방법:
 * 1. MongoDB Atlas에서 직접 실행
 * 2. 또는 MongoDB Compass에서 실행
 * 3. 또는 Node.js 스크립트로 실행: node scripts/create-indexes.js
 */

const indexes = {
    // users 컬렉션
    users: [
        { username: 1 }, // 로그인 시 사용
        { email: 1 }, // 이메일 검색
        { role: 1 }, // 역할별 필터링
        { username: 1, role: 1 }, // 복합 인덱스
    ],

    // students 컬렉션
    students: [
        { studentId: 1 }, // 학생 ID로 조회 (가장 빈번)
        { studentId: 1, _id: 1 }, // 복합 인덱스
        { parentPhone: 1 }, // 학부모 전화번호로 조회
        { parentEmail: 1 }, // 학부모 이메일로 조회
        { name: 1 }, // 이름으로 검색
        { grade: 1 }, // 학년별 필터링
        { class: 1 }, // 반별 필터링
        { createdAt: -1 }, // 최신순 정렬
    ],

    // attendance 컬렉션
    attendance: [
        { studentId: 1 }, // 학생별 출석 조회
        { studentId: 1, classDate: -1 }, // 학생별 날짜순 정렬
        { classDate: -1 }, // 날짜순 정렬
        { studentClass: 1, classDate: -1 }, // 반별 날짜순 정렬
        { studentId: 1, studentClass: 1, classDate: 1 }, // 복합 인덱스 (중복 체크용)
    ],

    // online_enrollments 컬렉션
    online_enrollments: [
        { accessCode: 1 }, // 접근 코드로 조회 (unique)
        { email: 1 }, // 이메일로 조회
        { courseId: 1 }, // 강좌별 조회
        { email: 1, courseId: 1 }, // 복합 인덱스
        { createdAt: -1 }, // 최신순 정렬
    ],

    // news 컬렉션
    news: [
        { category: 1, createdAt: -1 }, // 카테고리별 최신순
        { createdAt: -1 }, // 최신순 정렬
        { isPublished: 1, createdAt: -1 }, // 발행된 것만 최신순
    ],

    // online_courses 컬렉션
    online_courses: [
        { courseId: 1 }, // 강좌 ID로 조회
        { isActive: 1, createdAt: -1 }, // 활성 강좌 최신순
        { createdAt: -1 }, // 최신순 정렬
    ],

    // payments 컬렉션
    payments: [
        { paymentId: 1 }, // 결제 ID로 조회
        { orderId: 1 }, // 주문 ID로 조회
        { customerEmail: 1 }, // 고객 이메일로 조회
        { status: 1, timestamp: -1 }, // 상태별 시간순 정렬
        { timestamp: -1 }, // 시간순 정렬
    ],

    // faq 컬렉션
    faq: [
        { category: 1, order: 1 }, // 카테고리별 순서
        { isActive: 1, order: 1 }, // 활성 FAQ 순서
        { order: 1 }, // 순서 정렬
    ],

    // monthly_newsletters 컬렉션
    monthly_newsletters: [
        { year: -1, month: -1 }, // 연도/월별 정렬
        { createdAt: -1 }, // 최신순 정렬
    ],

    // student_feedback 컬렉션
    student_feedback: [
        { studentId: 1, date: -1 }, // 학생별 날짜순
        { date: -1 }, // 날짜순 정렬
    ],

    // competitions 컬렉션
    competitions: [
        { year: -1, month: -1 }, // 연도/월별 정렬
        { createdAt: -1 }, // 최신순 정렬
    ],
};

// MongoDB 연결 및 인덱스 생성 함수
async function createIndexes() {
    const { MongoClient } = require('mongodb');
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
        console.error('❌ MONGODB_URI 환경 변수가 설정되지 않았습니다.');
        process.exit(1);
    }

    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ MongoDB 연결 성공');
        
        const db = client.db(process.env.MONGODB_DB_NAME || 'academy-site');
        
        for (const [collectionName, collectionIndexes] of Object.entries(indexes)) {
            const collection = db.collection(collectionName);
            
            console.log(`\n📋 ${collectionName} 컬렉션 인덱스 생성 중...`);
            
            for (const indexSpec of collectionIndexes) {
                try {
                    // unique 인덱스 확인
                    const isUnique = collectionName === 'online_enrollments' && 
                                   Object.keys(indexSpec)[0] === 'accessCode';
                    
                    if (isUnique) {
                        await collection.createIndex(indexSpec, { unique: true });
                        console.log(`  ✅ Unique 인덱스 생성: ${JSON.stringify(indexSpec)}`);
                    } else {
                        await collection.createIndex(indexSpec);
                        console.log(`  ✅ 인덱스 생성: ${JSON.stringify(indexSpec)}`);
                    }
                } catch (error) {
                    if (error.code === 85 || (error.message && error.message.includes('already exists'))) {
                        console.log(`  ⚠️  인덱스 이미 존재: ${JSON.stringify(indexSpec)}`);
                    } else {
                        console.error(`  ❌ 인덱스 생성 실패: ${JSON.stringify(indexSpec)}`, error.message || error);
                    }
                }
            }
        }
        
        console.log('\n✅ 모든 인덱스 생성 완료!');
        
    } catch (error) {
        console.error('❌ 인덱스 생성 중 오류 발생:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('✅ MongoDB 연결 종료');
    }
}

// 스크립트 직접 실행 시
if (require.main === module) {
    require('dotenv').config({ path: '.env.local' });
    createIndexes();
}

module.exports = { createIndexes, indexes };

