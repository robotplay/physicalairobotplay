# MongoDB 인덱스 생성 빠른 시작 가이드

## 🚀 가장 쉬운 방법: MongoDB Atlas UI

### 1단계: MongoDB Atlas 접속
1. [MongoDB Atlas](https://cloud.mongodb.com/) 로그인
2. 프로젝트 선택
3. **Database** → **Browse Collections** 클릭

### 2단계: 인덱스 생성 (students 컬렉션 예시)

1. **`students` 컬렉션 클릭**
2. **Indexes** 탭 클릭
3. **Create Index** 버튼 클릭
4. **Index Definition** 입력:
   ```
   { "studentId": 1 }
   ```
5. **Create** 버튼 클릭
6. 반복하여 다음 인덱스들 생성:

#### students 컬렉션 (8개)
- `{ "studentId": 1 }`
- `{ "studentId": 1, "_id": 1 }`
- `{ "parentPhone": 1 }`
- `{ "parentEmail": 1 }`
- `{ "name": 1 }`
- `{ "grade": 1 }`
- `{ "class": 1 }`
- `{ "createdAt": -1 }`

#### attendance 컬렉션 (5개)
- `{ "studentId": 1 }`
- `{ "studentId": 1, "classDate": -1 }`
- `{ "classDate": -1 }`
- `{ "studentClass": 1, "classDate": -1 }`
- `{ "studentId": 1, "studentClass": 1, "classDate": 1 }`

#### online_enrollments 컬렉션 (5개)
- `{ "accessCode": 1 }` ⚠️ **Unique 체크!**
- `{ "email": 1 }`
- `{ "courseId": 1 }`
- `{ "email": 1, "courseId": 1 }`
- `{ "createdAt": -1 }`

#### news 컬렉션 (3개)
- `{ "category": 1, "createdAt": -1 }`
- `{ "createdAt": -1 }`
- `{ "isPublished": 1, "createdAt": -1 }`

#### payments 컬렉션 (5개)
- `{ "paymentId": 1 }`
- `{ "orderId": 1 }`
- `{ "customerEmail": 1 }`
- `{ "status": 1, "timestamp": -1 }`
- `{ "timestamp": -1 }`

#### faq 컬렉션 (3개)
- `{ "category": 1, "order": 1 }`
- `{ "isActive": 1, "order": 1 }`
- `{ "order": 1 }`

#### users 컬렉션 (4개)
- `{ "username": 1 }` ⚠️ **Unique 체크!**
- `{ "email": 1 }`
- `{ "role": 1 }`
- `{ "username": 1, "role": 1 }`

#### monthly_newsletters 컬렉션 (2개)
- `{ "year": -1, "month": -1 }`
- `{ "createdAt": -1 }`

#### student_feedback 컬렉션 (2개)
- `{ "studentId": 1, "date": -1 }`
- `{ "date": -1 }`

#### competitions 컬렉션 (2개)
- `{ "year": -1, "month": -1 }`
- `{ "createdAt": -1 }`

---

## 📋 전체 인덱스 목록 (복사용)

MongoDB Shell에서 실행할 수 있는 전체 스크립트:

```javascript
use('academy-site');

// students
db.students.createIndex({ studentId: 1 });
db.students.createIndex({ studentId: 1, _id: 1 });
db.students.createIndex({ parentPhone: 1 });
db.students.createIndex({ parentEmail: 1 });
db.students.createIndex({ name: 1 });
db.students.createIndex({ grade: 1 });
db.students.createIndex({ class: 1 });
db.students.createIndex({ createdAt: -1 });

// attendance
db.attendance.createIndex({ studentId: 1 });
db.attendance.createIndex({ studentId: 1, classDate: -1 });
db.attendance.createIndex({ classDate: -1 });
db.attendance.createIndex({ studentClass: 1, classDate: -1 });
db.attendance.createIndex({ studentId: 1, studentClass: 1, classDate: 1 });

// online_enrollments
db.online_enrollments.createIndex({ accessCode: 1 }, { unique: true });
db.online_enrollments.createIndex({ email: 1 });
db.online_enrollments.createIndex({ courseId: 1 });
db.online_enrollments.createIndex({ email: 1, courseId: 1 });
db.online_enrollments.createIndex({ createdAt: -1 });

// news
db.news.createIndex({ category: 1, createdAt: -1 });
db.news.createIndex({ createdAt: -1 });
db.news.createIndex({ isPublished: 1, createdAt: -1 });

// payments
db.payments.createIndex({ paymentId: 1 });
db.payments.createIndex({ orderId: 1 });
db.payments.createIndex({ customerEmail: 1 });
db.payments.createIndex({ status: 1, timestamp: -1 });
db.payments.createIndex({ timestamp: -1 });

// faq
db.faq.createIndex({ category: 1, order: 1 });
db.faq.createIndex({ isActive: 1, order: 1 });
db.faq.createIndex({ order: 1 });

// users
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ email: 1 });
db.users.createIndex({ role: 1 });
db.users.createIndex({ username: 1, role: 1 });

// monthly_newsletters
db.monthly_newsletters.createIndex({ year: -1, month: -1 });
db.monthly_newsletters.createIndex({ createdAt: -1 });

// student_feedback
db.student_feedback.createIndex({ studentId: 1, date: -1 });
db.student_feedback.createIndex({ date: -1 });

// competitions
db.competitions.createIndex({ year: -1, month: -1 });
db.competitions.createIndex({ createdAt: -1 });

print("✅ 모든 인덱스 생성 완료!");
```

---

## ✅ 인덱스 생성 확인

각 컬렉션의 인덱스를 확인하려면:

```javascript
db.students.getIndexes()
db.attendance.getIndexes()
db.online_enrollments.getIndexes()
// ... 기타 컬렉션
```

---

## 🎯 우선순위별 생성 순서

### 1순위 (즉시 생성 권장)
1. `students.studentId` - 가장 빈번한 조회
2. `attendance.studentId` - 출석 조회
3. `online_enrollments.accessCode` (unique) - 접근 코드 조회

### 2순위
4. `students.parentPhone` - 학부모 로그인
5. `news.createdAt` - 공지사항 정렬
6. `payments.paymentId` - 결제 조회

### 3순위
7. 나머지 인덱스들

---

**작성일**: 2025년 1월 2일

