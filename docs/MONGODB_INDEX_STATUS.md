# MongoDB 인덱스 생성 상태 확인 가이드

## 📋 인덱스 생성 확인 방법

### 방법 1: MongoDB Atlas UI에서 확인

1. **MongoDB Atlas 접속**
   - https://cloud.mongodb.com/ 로그인

2. **Database → Browse Collections**
   - `academy-site` 데이터베이스 클릭

3. **각 컬렉션의 Indexes 탭 확인**
   - 컬렉션 클릭 → **Indexes** 탭 클릭
   - 생성된 인덱스 목록 확인
   - Status가 **"READY"**인지 확인

---

## ✅ 전체 인덱스 목록 및 생성 상태

### students 컬렉션 (8개 인덱스)

- [ ] `{ "studentId": 1 }` ⭐ **최우선**
- [ ] `{ "studentId": 1, "_id": 1 }` (복합 인덱스)
- [ ] `{ "parentPhone": 1 }` ⭐ **학부모 로그인용**
- [ ] `{ "parentEmail": 1 }`
- [ ] `{ "name": 1 }`
- [ ] `{ "grade": 1 }`
- [ ] `{ "class": 1 }`
- [ ] `{ "createdAt": -1 }`

**확인 방법:**
```
students 컬렉션 → Indexes 탭
- _id_ (기본)
- studentId_1
- studentId_1_id_1 (COMPOUND)
- parentPhone_1
- parentEmail_1
- name_1
- grade_1
- class_1
- createdAt_-1
```

---

### attendance 컬렉션 (5개 인덱스)

- [ ] `{ "studentId": 1 }` ⭐ **최우선**
- [ ] `{ "studentId": 1, "classDate": -1 }` (복합 인덱스)
- [ ] `{ "classDate": -1 }`
- [ ] `{ "studentClass": 1, "classDate": -1 }` (복합 인덱스)
- [ ] `{ "studentId": 1, "studentClass": 1, "classDate": 1 }` (복합 인덱스)

**확인 방법:**
```
attendance 컬렉션 → Indexes 탭
- _id_ (기본)
- studentId_1
- studentId_1_classDate_-1 (COMPOUND)
- classDate_-1
- studentClass_1_classDate_-1 (COMPOUND)
- studentId_1_studentClass_1_classDate_1 (COMPOUND)
```

---

### online_enrollments 컬렉션 (5개 인덱스)

- [ ] `{ "accessCode": 1 }` ⚠️ **Unique 체크 필수!**
- [ ] `{ "email": 1 }`
- [ ] `{ "courseId": 1 }`
- [ ] `{ "email": 1, "courseId": 1 }` (복합 인덱스)
- [ ] `{ "createdAt": -1 }`

**확인 방법:**
```
online_enrollments 컬렉션 → Indexes 탭
- _id_ (기본)
- accessCode_1 (UNIQUE)
- email_1
- courseId_1
- email_1_courseId_1 (COMPOUND)
- createdAt_-1
```

---

### payments 컬렉션 (5개 인덱스)

- [ ] `{ "paymentId": 1 }`
- [ ] `{ "orderId": 1 }`
- [ ] `{ "customerEmail": 1 }`
- [ ] `{ "status": 1, "timestamp": -1 }` (복합 인덱스)
- [ ] `{ "timestamp": -1 }`

**확인 방법:**
```
payments 컬렉션 → Indexes 탭
- _id_ (기본)
- paymentId_1
- orderId_1
- customerEmail_1
- status_1_timestamp_-1 (COMPOUND)
- timestamp_-1
```

---

### news 컬렉션 (3개 인덱스)

- [ ] `{ "category": 1, "createdAt": -1 }` (복합 인덱스)
- [ ] `{ "createdAt": -1 }`
- [ ] `{ "isPublished": 1, "createdAt": -1 }` (복합 인덱스)

**확인 방법:**
```
news 컬렉션 → Indexes 탭
- _id_ (기본)
- category_1_createdAt_-1 (COMPOUND)
- createdAt_-1
- isPublished_1_createdAt_-1 (COMPOUND)
```

---

### faq 컬렉션 (3개 인덱스)

- [ ] `{ "category": 1, "order": 1 }` (복합 인덱스)
- [ ] `{ "isActive": 1, "order": 1 }` (복합 인덱스)
- [ ] `{ "order": 1 }`

**확인 방법:**
```
faq 컬렉션 → Indexes 탭
- _id_ (기본)
- category_1_order_1 (COMPOUND)
- isActive_1_order_1 (COMPOUND)
- order_1
```

---

### users 컬렉션 (4개 인덱스)

- [ ] `{ "username": 1 }` ⚠️ **Unique 체크 필수!**
- [ ] `{ "email": 1 }`
- [ ] `{ "role": 1 }`
- [ ] `{ "username": 1, "role": 1 }` (복합 인덱스)

**확인 방법:**
```
users 컬렉션 → Indexes 탭
- _id_ (기본)
- username_1 (UNIQUE)
- email_1
- role_1
- username_1_role_1 (COMPOUND)
```

---

### monthly_newsletters 컬렉션 (2개 인덱스)

- [ ] `{ "year": -1, "month": -1 }` (복합 인덱스)
- [ ] `{ "createdAt": -1 }`

**확인 방법:**
```
monthly_newsletters 컬렉션 → Indexes 탭
- _id_ (기본)
- year_-1_month_-1 (COMPOUND)
- createdAt_-1
```

---

### student_feedback 컬렉션 (2개 인덱스)

- [ ] `{ "studentId": 1, "date": -1 }` (복합 인덱스)
- [ ] `{ "date": -1 }`

**확인 방법:**
```
student_feedback 컬렉션 → Indexes 탭
- _id_ (기본)
- studentId_1_date_-1 (COMPOUND)
- date_-1
```

---

### competitions 컬렉션 (2개 인덱스)

- [ ] `{ "year": -1, "month": -1 }` (복합 인덱스)
- [ ] `{ "createdAt": -1 }`

**확인 방법:**
```
competitions 컬렉션 → Indexes 탭
- _id_ (기본)
- year_-1_month_-1 (COMPOUND)
- createdAt_-1
```

---

## 📊 전체 인덱스 통계

### 컬렉션별 인덱스 개수

| 컬렉션 | 필요한 인덱스 | 우선순위 |
|--------|--------------|----------|
| students | 8개 | ⭐⭐⭐ 최우선 |
| attendance | 5개 | ⭐⭐⭐ 최우선 |
| online_enrollments | 5개 | ⭐⭐ 높음 |
| payments | 5개 | ⭐⭐ 높음 |
| news | 3개 | ⭐ 보통 |
| faq | 3개 | ⭐ 보통 |
| users | 4개 | ⭐⭐ 높음 |
| monthly_newsletters | 2개 | ⭐ 보통 |
| student_feedback | 2개 | ⭐ 보통 |
| competitions | 2개 | ⭐ 보통 |
| **총계** | **39개** | |

---

## 🔍 빠른 확인 체크리스트

### 1순위 (즉시 확인)

- [ ] `students.studentId` - 가장 빈번한 조회
- [ ] `attendance.studentId` - 출석 조회
- [ ] `online_enrollments.accessCode` (unique) - 접근 코드 조회

### 2순위

- [ ] `students.parentPhone` - 학부모 로그인
- [ ] `news.createdAt` - 공지사항 정렬
- [ ] `payments.paymentId` - 결제 조회

### 3순위

- [ ] 나머지 인덱스들

---

## ⚠️ 주의사항

### Unique 인덱스 확인
- `online_enrollments.accessCode` - Properties에 **UNIQUE** 표시 확인
- `users.username` - Properties에 **UNIQUE** 표시 확인

### 복합 인덱스 확인
- Properties에 **COMPOUND** 표시 확인
- 필드 순서 확인 (예: `studentId_1_classDate_-1`)

### 인덱스 상태 확인
- 모든 인덱스의 Status가 **"READY"**인지 확인
- "BUILDING" 상태면 완료될 때까지 대기

---

## 🚀 MongoDB Shell로 확인

```javascript
use('academy-site');

// students 컬렉션 인덱스 확인
db.students.getIndexes();

// attendance 컬렉션 인덱스 확인
db.attendance.getIndexes();

// online_enrollments 컬렉션 인덱스 확인
db.online_enrollments.getIndexes();

// payments 컬렉션 인덱스 확인
db.payments.getIndexes();

// news 컬렉션 인덱스 확인
db.news.getIndexes();

// faq 컬렉션 인덱스 확인
db.faq.getIndexes();

// users 컬렉션 인덱스 확인
db.users.getIndexes();

// monthly_newsletters 컬렉션 인덱스 확인
db.monthly_newsletters.getIndexes();

// student_feedback 컬렉션 인덱스 확인
db.student_feedback.getIndexes();

// competitions 컬렉션 인덱스 확인
db.competitions.getIndexes();
```

---

## ✅ 완료 확인 체크리스트

각 컬렉션의 Indexes 탭에서 다음을 확인하세요:

1. **인덱스 개수 확인**
   - 필요한 인덱스 개수와 일치하는지 확인

2. **인덱스 이름 확인**
   - 예: `studentId_1`, `parentPhone_1` 등

3. **Properties 확인**
   - UNIQUE 인덱스: Properties에 "UNIQUE" 표시
   - 복합 인덱스: Properties에 "COMPOUND" 표시

4. **Status 확인**
   - 모든 인덱스가 "READY" 상태인지 확인

5. **Usage 확인**
   - 인덱스 사용 횟수 확인 (0이어도 정상)

---

**작성일**: 2025년 1월 2일  
**상태**: 인덱스 생성 확인 가이드 완료

