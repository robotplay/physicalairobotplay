# MongoDB 인덱스 수동 생성 가이드

## 🔴 자동 스크립트 실행 실패 시

MongoDB 인증 오류로 자동 스크립트 실행이 실패한 경우, 다음 방법으로 수동으로 인덱스를 생성할 수 있습니다.

---

## 방법 1: MongoDB Atlas에서 생성 (권장)

### 1. MongoDB Atlas 접속
1. [MongoDB Atlas](https://cloud.mongodb.com/) 로그인
2. 프로젝트 선택
3. Database → Browse Collections

### 2. 각 컬렉션에서 인덱스 생성

#### users 컬렉션
```javascript
// Atlas UI에서 Indexes 탭 → Create Index 클릭
// 또는 MongoDB Shell에서:
db.users.createIndex({ username: 1 })
db.users.createIndex({ email: 1 })
db.users.createIndex({ role: 1 })
db.users.createIndex({ username: 1, role: 1 })
```

#### students 컬렉션
```javascript
db.students.createIndex({ studentId: 1 })
db.students.createIndex({ studentId: 1, _id: 1 })
db.students.createIndex({ parentPhone: 1 })
db.students.createIndex({ parentEmail: 1 })
db.students.createIndex({ name: 1 })
db.students.createIndex({ grade: 1 })
db.students.createIndex({ class: 1 })
db.students.createIndex({ createdAt: -1 })
```

#### attendance 컬렉션
```javascript
db.attendance.createIndex({ studentId: 1 })
db.attendance.createIndex({ studentId: 1, classDate: -1 })
db.attendance.createIndex({ classDate: -1 })
db.attendance.createIndex({ studentClass: 1, classDate: -1 })
db.attendance.createIndex({ studentId: 1, studentClass: 1, classDate: 1 })
```

#### online_enrollments 컬렉션
```javascript
db.online_enrollments.createIndex({ accessCode: 1 }, { unique: true })
db.online_enrollments.createIndex({ email: 1 })
db.online_enrollments.createIndex({ courseId: 1 })
db.online_enrollments.createIndex({ email: 1, courseId: 1 })
db.online_enrollments.createIndex({ createdAt: -1 })
```

#### news 컬렉션
```javascript
db.news.createIndex({ category: 1, createdAt: -1 })
db.news.createIndex({ createdAt: -1 })
db.news.createIndex({ isPublished: 1, createdAt: -1 })
```

#### payments 컬렉션
```javascript
db.payments.createIndex({ paymentId: 1 })
db.payments.createIndex({ orderId: 1 })
db.payments.createIndex({ customerEmail: 1 })
db.payments.createIndex({ status: 1, timestamp: -1 })
db.payments.createIndex({ timestamp: -1 })
```

#### faq 컬렉션
```javascript
db.faq.createIndex({ category: 1, order: 1 })
db.faq.createIndex({ isActive: 1, order: 1 })
db.faq.createIndex({ order: 1 })
```

#### monthly_newsletters 컬렉션
```javascript
db.monthly_newsletters.createIndex({ year: -1, month: -1 })
db.monthly_newsletters.createIndex({ createdAt: -1 })
```

#### student_feedback 컬렉션
```javascript
db.student_feedback.createIndex({ studentId: 1, date: -1 })
db.student_feedback.createIndex({ date: -1 })
```

#### competitions 컬렉션
```javascript
db.competitions.createIndex({ year: -1, month: -1 })
db.competitions.createIndex({ createdAt: -1 })
```

---

## 방법 2: MongoDB Compass에서 생성

### 1. MongoDB Compass 실행
1. MongoDB Compass 설치 및 실행
2. 연결 문자열로 MongoDB 연결

### 2. 인덱스 생성
1. 데이터베이스 선택
2. 컬렉션 선택
3. **Indexes** 탭 클릭
4. **Create Index** 버튼 클릭
5. 필드와 정렬 방향 설정 (1: 오름차순, -1: 내림차순)
6. **Create** 클릭

---

## 방법 3: MongoDB Shell에서 일괄 실행

MongoDB Shell에 접속한 후 다음 스크립트를 실행:

```javascript
// 데이터베이스 선택
use academy-site

// users 컬렉션
db.users.createIndex({ username: 1 })
db.users.createIndex({ email: 1 })
db.users.createIndex({ role: 1 })
db.users.createIndex({ username: 1, role: 1 })

// students 컬렉션
db.students.createIndex({ studentId: 1 })
db.students.createIndex({ studentId: 1, _id: 1 })
db.students.createIndex({ parentPhone: 1 })
db.students.createIndex({ parentEmail: 1 })
db.students.createIndex({ name: 1 })
db.students.createIndex({ grade: 1 })
db.students.createIndex({ class: 1 })
db.students.createIndex({ createdAt: -1 })

// attendance 컬렉션
db.attendance.createIndex({ studentId: 1 })
db.attendance.createIndex({ studentId: 1, classDate: -1 })
db.attendance.createIndex({ classDate: -1 })
db.attendance.createIndex({ studentClass: 1, classDate: -1 })
db.attendance.createIndex({ studentId: 1, studentClass: 1, classDate: 1 })

// online_enrollments 컬렉션
db.online_enrollments.createIndex({ accessCode: 1 }, { unique: true })
db.online_enrollments.createIndex({ email: 1 })
db.online_enrollments.createIndex({ courseId: 1 })
db.online_enrollments.createIndex({ email: 1, courseId: 1 })
db.online_enrollments.createIndex({ createdAt: -1 })

// news 컬렉션
db.news.createIndex({ category: 1, createdAt: -1 })
db.news.createIndex({ createdAt: -1 })
db.news.createIndex({ isPublished: 1, createdAt: -1 })

// payments 컬렉션
db.payments.createIndex({ paymentId: 1 })
db.payments.createIndex({ orderId: 1 })
db.payments.createIndex({ customerEmail: 1 })
db.payments.createIndex({ status: 1, timestamp: -1 })
db.payments.createIndex({ timestamp: -1 })

// faq 컬렉션
db.faq.createIndex({ category: 1, order: 1 })
db.faq.createIndex({ isActive: 1, order: 1 })
db.faq.createIndex({ order: 1 })

// monthly_newsletters 컬렉션
db.monthly_newsletters.createIndex({ year: -1, month: -1 })
db.monthly_newsletters.createIndex({ createdAt: -1 })

// student_feedback 컬렉션
db.student_feedback.createIndex({ studentId: 1, date: -1 })
db.student_feedback.createIndex({ date: -1 })

// competitions 컬렉션
db.competitions.createIndex({ year: -1, month: -1 })
db.competitions.createIndex({ createdAt: -1 })

print("✅ 모든 인덱스 생성 완료!")
```

---

## 인덱스 생성 확인

인덱스가 제대로 생성되었는지 확인:

```javascript
// 각 컬렉션의 인덱스 확인
db.students.getIndexes()
db.attendance.getIndexes()
db.online_enrollments.getIndexes()
// ... 기타 컬렉션
```

---

## 주의사항

1. **Unique 인덱스**: `online_enrollments.accessCode`는 unique 인덱스입니다.
2. **복합 인덱스**: 여러 필드를 포함하는 인덱스는 순서가 중요합니다.
3. **인덱스 생성 시간**: 데이터가 많을 경우 인덱스 생성에 시간이 걸릴 수 있습니다.
4. **성능 영향**: 인덱스 생성 중에는 해당 컬렉션의 쓰기 성능이 일시적으로 저하될 수 있습니다.

---

## 예상 성능 향상

인덱스 생성 후:
- 학생 조회: **10-100배** 빠름
- 출석 조회: **5-50배** 빠름
- 검색 쿼리: **3-20배** 빠름

---

**작성일**: 2025년 1월 2일  
**상태**: 수동 생성 가이드 제공

