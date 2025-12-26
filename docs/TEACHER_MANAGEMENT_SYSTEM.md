# 강사 관리 시스템 설계 문서

## 📋 목표
- 강사(선생님)들이 직접 강좌를 등록/수정할 수 있도록
- 관리자는 강사 계정 관리
- 강사는 자신의 강좌만 관리
- 강사는 공지사항, 대회소식, 교육정보 게시판 사용 가능

## 🏗️ 시스템 구조

### 1. 사용자 역할 (Role-Based Access Control)

```
┌─────────────────┐
│   Admin (관리자) │
│  - 모든 권한     │
│  - 강사 관리     │
│  - 모든 강좌 관리│
│  - 모든 게시글 관리│
└─────────────────┘
         │
         ├─────────────────┐
         │                 │
┌─────────────────┐  ┌─────────────────┐
│ Teacher (강사)   │  │  Student (학생) │
│ - 자신의 강좌만  │  │  - 수강만 가능   │
│ - 게시글 작성    │  │                 │
└─────────────────┘  └─────────────────┘
```

### 2. 데이터베이스 스키마

#### Users 컬렉션
```typescript
{
  _id: ObjectId,
  id: string,              // 고유 ID
  username: string,        // 로그인 ID
  password: string,        // 해시된 비밀번호
  name: string,            // 이름
  email: string,           // 이메일
  phone: string,           // 연락처
  role: 'admin' | 'teacher' | 'student',
  teacherId?: string,      // 강사 ID (teacher인 경우)
  status: 'active' | 'inactive', // 계정 상태
  createdAt: Date,
  updatedAt: Date
}
```

#### Online Courses 컬렉션 (수정)
```typescript
{
  ...기존 필드들...,
  teacherId: string,       // 강사 ID (작성자)
  teacherName: string,     // 강사 이름
  status: 'draft' | 'published', // 초안/발행
}
```

#### News 컬렉션 (수정)
```typescript
{
  ...기존 필드들...,
  authorId: string,        // 작성자 ID
  authorName: string,      // 작성자 이름
  authorRole: 'admin' | 'teacher', // 작성자 역할
}
```

### 3. 페이지 구조

```
/admin
  ├── /login              (공통 로그인)
  ├── /dashboard          (관리자 대시보드)
  │   ├── teachers        (강사 관리 탭)
  │   ├── courses         (모든 강좌 관리)
  │   ├── news            (모든 게시글 관리)
  │   └── ...
  │
  └── /teacher            (강사 전용)
      ├── /dashboard      (강사 대시보드)
      ├── /courses        (내 강좌만)
      └── /news            (게시글 작성)
```

### 4. 권한별 접근 제어

#### Admin (관리자)
- ✅ 모든 강사 계정 관리 (생성, 수정, 삭제, 활성화/비활성화)
- ✅ 모든 강좌 조회/수정/삭제
- ✅ 모든 게시글 조회/수정/삭제
- ✅ 모든 결제/신청 내역 조회

#### Teacher (강사)
- ✅ 자신의 강좌만 조회/생성/수정/삭제
- ✅ 공지사항, 대회소식, 교육정보 게시글 작성
- ✅ 자신이 작성한 게시글만 수정/삭제
- ❌ 다른 강사의 강좌 접근 불가
- ❌ 다른 사람의 게시글 수정/삭제 불가
- ❌ 강사 계정 관리 불가

## 🔐 인증 시스템

### 로그인 플로우
```
1. /admin/login 또는 /teacher/login 접속
2. username + password 입력
3. API로 인증 확인
4. 역할에 따라 리다이렉트:
   - admin → /admin/dashboard
   - teacher → /teacher/dashboard
```

### 세션 관리
- JWT 토큰 또는 세션 쿠키 사용
- 역할 정보 포함
- 24시간 자동 만료

## 📝 구현 단계

### Phase 1: 사용자 관리 시스템
1. ✅ Users 컬렉션 생성
2. ✅ 사용자 인증 API (`/api/auth/login`, `/api/auth/logout`)
3. ✅ 강사 계정 관리 API (`/api/users`)
4. ✅ 관리자 페이지에 강사 관리 탭 추가

### Phase 2: 강사 전용 대시보드
1. ✅ `/teacher/dashboard` 페이지 생성
2. ✅ 강사 전용 강좌 관리 페이지
3. ✅ 강사 전용 게시글 작성 페이지
4. ✅ 권한 체크 미들웨어

### Phase 3: 데이터 필터링
1. ✅ 강좌에 `teacherId` 필드 추가
2. ✅ 게시글에 `authorId`, `authorRole` 필드 추가
3. ✅ API에서 역할별 필터링 적용
4. ✅ 강사는 자신의 데이터만 조회

### Phase 4: UI/UX 개선
1. ✅ 역할별 메뉴 표시
2. ✅ 강사 대시보드 UI
3. ✅ 강사 계정 관리 UI

## 🎯 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### 사용자 관리 (Admin만)
- `GET /api/users` - 사용자 목록
- `POST /api/users` - 사용자 생성
- `PUT /api/users/:id` - 사용자 수정
- `DELETE /api/users/:id` - 사용자 삭제

### 강좌 관리
- `GET /api/online-courses` - 강좌 목록 (역할별 필터링)
- `POST /api/online-courses` - 강좌 생성 (teacherId 자동 추가)
- `PUT /api/online-courses/:id` - 강좌 수정 (권한 체크)
- `DELETE /api/online-courses/:id` - 강좌 삭제 (권한 체크)

### 게시글 관리
- `GET /api/news` - 게시글 목록
- `POST /api/news` - 게시글 작성 (authorId 자동 추가)
- `PUT /api/news/:id` - 게시글 수정 (권한 체크)
- `DELETE /api/news/:id` - 게시글 삭제 (권한 체크)

## 🔒 보안 고려사항

1. **비밀번호 해싱**: bcrypt 사용
2. **JWT 토큰**: 역할 정보 포함, 만료 시간 설정
3. **API 권한 체크**: 모든 API에서 역할 확인
4. **데이터 필터링**: 강사는 자신의 데이터만 조회
5. **입력 검증**: 모든 입력값 검증

## 📊 예상 데이터 흐름

### 강사가 강좌 등록하는 경우
```
1. 강사 로그인 (/teacher/login)
2. 강사 대시보드 접속 (/teacher/dashboard)
3. "강좌 등록" 클릭
4. 강좌 정보 입력
5. POST /api/online-courses
   - teacherId: 현재 로그인한 강사 ID 자동 추가
   - status: 'draft' (초안) 또는 'published' (발행)
6. 강좌 목록에 표시 (해당 강사만 보임)
```

### 강사가 게시글 작성하는 경우
```
1. 강사 대시보드에서 "게시글 작성" 클릭
2. 게시글 작성 폼 표시
3. POST /api/news
   - authorId: 현재 로그인한 강사 ID 자동 추가
   - authorName: 강사 이름 자동 추가
   - authorRole: 'teacher' 자동 추가
4. 게시글 목록에 표시 (모든 사용자에게 보임)
```

## ✅ 구현 우선순위

1. **High Priority**
   - 사용자 인증 시스템
   - 강사 계정 관리 (관리자)
   - 강사 전용 대시보드

2. **Medium Priority**
   - 강좌에 teacherId 필드 추가
   - 게시글에 authorId 필드 추가
   - 권한별 필터링

3. **Low Priority**
   - UI/UX 개선
   - 통계 대시보드
   - 알림 시스템

