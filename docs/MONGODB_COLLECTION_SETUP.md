# MongoDB 컬렉션 확인 및 생성 가이드

## 🔍 현재 상황

MongoDB Atlas UI에서 `students` 컬렉션이 보이지 않는 경우:
- **원인**: 아직 학생 데이터가 없어서 컬렉션이 자동 생성되지 않았을 수 있습니다
- **해결**: 컬렉션을 수동으로 생성하거나, 첫 학생을 등록하면 자동 생성됩니다

---

## ✅ 방법 1: MongoDB Atlas UI에서 컬렉션 확인

### 1단계: 현재 컬렉션 목록 확인

1. **MongoDB Atlas 접속**
   - https://cloud.mongodb.com/ 로그인

2. **Database → Browse Collections**
   - 왼쪽 사이드바에서 `academy-cluster` 확장
   - `academy-site` 데이터베이스 클릭

3. **컬렉션 목록 확인**
   - 현재 보이는 컬렉션 목록 확인
   - 예: `users`, `news`, `payments`, `attendance` 등

### 2단계: students 컬렉션이 없는 경우

**옵션 A: 첫 학생 등록으로 자동 생성 (권장)**
- 관리자 페이지에서 학생을 등록하면 자동으로 `students` 컬렉션이 생성됩니다
- https://www.parplay.co.kr/admin → 학생 관리 → 학생 등록

**옵션 B: MongoDB Shell로 수동 생성**
- 아래 "방법 2" 참조

---

## ✅ 방법 2: MongoDB Shell로 컬렉션 생성

### 1단계: MongoDB Shell 접속

1. **MongoDB Atlas → Database → Connect**
2. **Connect your application** 또는 **MongoDB Shell** 선택
3. **Connection String 복사** 또는 **Shell 접속**

### 2단계: 컬렉션 생성 및 인덱스 생성

```javascript
// 데이터베이스 선택
use('academy-site');

// students 컬렉션 생성 (빈 컬렉션)
db.createCollection('students');

// 인덱스 생성
db.students.createIndex({ studentId: 1 });
db.students.createIndex({ studentId: 1, _id: 1 });
db.students.createIndex({ parentPhone: 1 });
db.students.createIndex({ parentEmail: 1 });
db.students.createIndex({ name: 1 });
db.students.createIndex({ grade: 1 });
db.students.createIndex({ class: 1 });
db.students.createIndex({ createdAt: -1 });

print("✅ students 컬렉션 및 인덱스 생성 완료!");
```

---

## ✅ 방법 3: MongoDB Atlas UI에서 컬렉션 생성

### 1단계: 컬렉션 생성

1. **Database → Browse Collections**
2. **`academy-site` 데이터베이스 클릭**
3. **"+ Create" 또는 "Create Collection" 버튼 클릭**
4. **Collection Name**: `students` 입력
5. **Create** 클릭

### 2단계: 인덱스 생성

1. **`students` 컬렉션 클릭**
2. **Indexes 탭 클릭**
3. **Create Index 버튼 클릭**
4. **Index Definition 입력**:
   ```
   { "studentId": 1 }
   ```
5. **Create 클릭**
6. **나머지 인덱스들도 동일하게 생성**

---

## 📋 필요한 컬렉션 목록

다음 컬렉션들이 존재하는지 확인하고, 없으면 생성하세요:

### 필수 컬렉션
- ✅ `users` - 사용자 (관리자, 교사 등)
- ✅ `students` - 학생 정보
- ✅ `attendance` - 출석 기록
- ✅ `payments` - 결제 정보
- ✅ `news` - 공지사항
- ✅ `online_courses` - 온라인 강의
- ✅ `online_enrollments` - 온라인 강의 수강 등록
- ✅ `faq` - 자주 묻는 질문
- ✅ `monthly_newsletters` - 월간 뉴스레터
- ✅ `student_feedback` - 학생 피드백
- ✅ `competitions` - 대회 정보

### 선택적 컬렉션
- `airplane_registrations` - 항공기 등록
- `consultations` - 상담
- `newsletter_subscribers` - 뉴스레터 구독자
- `email_campaigns` - 이메일 캠페인
- `social_posts` - 소셜 미디어 게시물
- `class_gallery` - 수업 갤러리
- `curriculum` - 커리큘럼
- `analytics` - 분석 데이터
- `improvement_ideas` - 개선 아이디어
- `consultation_schedules` - 상담 일정

---

## 🔍 컬렉션 존재 여부 확인

### MongoDB Shell에서 확인

```javascript
use('academy-site');

// 모든 컬렉션 목록 확인
show collections

// 특정 컬렉션 확인
db.getCollectionNames().includes('students')  // true/false 반환

// 컬렉션 통계 확인
db.students.stats()
```

### MongoDB Atlas UI에서 확인

1. **Database → Browse Collections**
2. **`academy-site` 데이터베이스 확장**
3. **컬렉션 목록 확인**

---

## ⚠️ 주의사항

1. **빈 컬렉션 생성**
   - 컬렉션을 생성해도 데이터가 없으면 Atlas UI에서 보이지 않을 수 있습니다
   - 첫 문서를 삽입하면 컬렉션이 표시됩니다

2. **인덱스는 나중에 생성 가능**
   - 컬렉션을 먼저 생성하고, 데이터를 추가한 후 인덱스를 생성해도 됩니다
   - 하지만 인덱스를 먼저 생성하면 성능이 더 좋습니다

3. **데이터베이스 이름 확인**
   - 환경 변수 `MONGODB_DB_NAME`이 올바르게 설정되어 있는지 확인
   - 기본값: `academy-site`

---

## 🚀 빠른 해결 방법

### 옵션 1: 관리자 페이지에서 학생 등록 (가장 쉬움)

1. https://www.parplay.co.kr/admin 접속
2. 로그인
3. **학생 관리** 탭 클릭
4. **학생 등록** 버튼 클릭
5. 학생 정보 입력 후 저장
6. → `students` 컬렉션이 자동 생성됩니다!

### 옵션 2: MongoDB Shell 스크립트 실행

```javascript
use('academy-site');

// 컬렉션 생성 (없는 경우)
if (!db.getCollectionNames().includes('students')) {
    db.createCollection('students');
    print('✅ students 컬렉션 생성 완료');
} else {
    print('ℹ️  students 컬렉션 이미 존재');
}

// 인덱스 생성
try {
    db.students.createIndex({ studentId: 1 });
    print('✅ 인덱스 생성 완료');
} catch (e) {
    print('⚠️  인덱스 이미 존재하거나 오류: ' + e);
}
```

---

## 💳 payments 컬렉션이 없는 경우

### 원인
- 아직 결제 데이터가 없어서 컬렉션이 자동 생성되지 않았습니다
- 첫 결제가 완료되면 자동으로 생성됩니다

### 해결 방법

#### 방법 1: MongoDB Atlas UI에서 수동 생성 (권장)

1. **Database → Browse Collections**
2. **`academy-site` 데이터베이스 클릭**
3. **"+ Create" 또는 "Create Collection" 버튼 클릭**
4. **Collection Name**: `payments` 입력
5. **Create** 클릭
6. **`payments` 컬렉션 클릭 → Indexes 탭 → 인덱스 생성**

#### 방법 2: MongoDB Shell로 생성

```javascript
use('academy-site');

// payments 컬렉션 생성
if (!db.getCollectionNames().includes('payments')) {
    db.createCollection('payments');
    print('✅ payments 컬렉션 생성 완료');
} else {
    print('ℹ️  payments 컬렉션 이미 존재');
}

// 인덱스 생성
db.payments.createIndex({ paymentId: 1 });
db.payments.createIndex({ orderId: 1 });
db.payments.createIndex({ customerEmail: 1 });
db.payments.createIndex({ status: 1, timestamp: -1 });
db.payments.createIndex({ timestamp: -1 });

print("✅ payments 컬렉션 및 인덱스 생성 완료!");
```

#### 방법 3: 첫 결제로 자동 생성
- 실제 결제를 진행하면 자동으로 `payments` 컬렉션이 생성됩니다
- 하지만 인덱스는 수동으로 생성해야 합니다

---

**작성일**: 2025년 1월 2일  
**상태**: 컬렉션 확인 및 생성 가이드 완료 (payments 컬렉션 추가)

