# PARPLAY 로봇플레이 마스터 워크스페이스 구축 제안서

## 📊 현재 시스템 분석

### 구축된 인프라
- ✅ Next.js 16 (App Router) + TypeScript
- ✅ MongoDB Atlas (데이터베이스)
- ✅ JWT 기반 인증 시스템
- ✅ Role-based Access Control (admin, teacher, student)
- ✅ Admin 대시보드 (상담, 결제, 신청서, 뉴스, 강좌, 강사, 마케팅)
- ✅ Teacher 대시보드 (강좌 관리, 게시글 관리)
- ✅ 온라인 강좌 시스템
- ✅ 뉴스레터 구독 시스템

### 기존 데이터베이스 컬렉션
- `users` (admin, teacher, student)
- `online_courses`
- `news`
- `payments`
- `airplane_registrations`
- `consultations`
- `newsletter_subscribers`

---

## 🎯 PARPLAY 워크스페이스 구축 전략

### 접근 방식: **기존 Admin 대시보드 확장 + 새로운 섹션 추가**

기존 Admin 대시보드(`/app/admin/page.tsx`)에 새로운 탭들을 추가하는 방식이 가장 효율적입니다.

---

## 📋 단계별 구현 계획

### **Phase 1: 데이터베이스 스키마 설계** (우선순위: 최우선)

#### 새로운 컬렉션 추가

```typescript
// 1. students (학생 데이터베이스)
{
  _id: ObjectId,
  studentId: string,           // 고유 학생 ID
  name: string,                 // 학생 이름
  grade: string,                // 학년
  parentName: string,           // 학부모 이름
  parentPhone: string,          // 학부모 연락처
  parentEmail: string,         // 학부모 이메일
  enrolledCourses: string[],    // 수강 중인 과목 ID 배열
  attendance: {                // 출석률
    totalClasses: number,
    attendedClasses: number,
    rate: number
  },
  projects: [{                 // 프로젝트 완성도
    projectId: string,
    projectName: string,
    completionRate: number,
    status: 'in-progress' | 'completed',
    completedAt?: Date
  }],
  competitions: [{             // 대회 참가/수상 기록
    competitionId: string,
    competitionName: string,
    year: number,
    month: number,
    result: 'participated' | 'award' | 'winner',
    award?: string,
    teamMembers?: string[]
  }],
  learningNotes: string,        // 학습 성향 메모
  portfolio: {                 // 포트폴리오
    images: string[],
    videos: string[],
    description: string
  },
  createdAt: Date,
  updatedAt: Date
}

// 2. competitions (대회 관리)
{
  _id: ObjectId,
  competitionId: string,
  name: string,                 // 대회명
  type: 'local' | 'national' | 'international',
  startDate: Date,
  endDate: Date,
  registrationDeadline: Date,
  description: string,
  requirements: string,
  teams: [{                     // 참가 팀
    teamId: string,
    teamName: string,
    members: string[],          // studentId 배열
    teacherId: string,
    status: 'registered' | 'preparing' | 'completed',
    result?: string,
    photos: string[],
    review: string
  }],
  createdAt: Date,
  updatedAt: Date
}

// 3. curriculum (월별 수업 커리큘럼)
{
  _id: ObjectId,
  curriculumId: string,
  courseId: string,            // online_courses와 연결
  month: number,               // 1-12
  year: number,
  weeks: [{                    // 주차별 커리큘럼
    week: number,
    title: string,
    description: string,
    materials: string[],        // 자료 링크
    videos: string[],          // 영상 링크
    assignments: string[]
  }],
  createdAt: Date,
  updatedAt: Date
}

// 4. student_feedback (개별 피드백)
{
  _id: ObjectId,
  feedbackId: string,
  studentId: string,
  teacherId: string,
  courseId: string,
  date: Date,
  content: string,             // 피드백 내용
  strengths: string[],         // 강점
  improvements: string[],      // 개선점
  nextSteps: string,           // 다음 단계
  createdAt: Date
}

// 5. class_gallery (수업 사진/영상 갤러리)
{
  _id: ObjectId,
  galleryId: string,
  courseId: string,
  classDate: Date,
  title: string,
  description: string,
  images: string[],            // 이미지 URL 배열
  videos: string[],            // 영상 URL 배열
  tags: string[],             // 태그 (예: ['로봇제작', '프로그래밍'])
  visibility: 'public' | 'parents-only' | 'private',
  createdAt: Date
}

// 6. faq (FAQ & 자주 묻는 질문)
{
  _id: ObjectId,
  faqId: string,
  category: 'general' | 'enrollment' | 'curriculum' | 'competition' | 'payment',
  question: string,
  answer: string,
  order: number,               // 정렬 순서
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}

// 7. monthly_newsletters (월간 뉴스레터 아카이브)
{
  _id: ObjectId,
  newsletterId: string,
  month: number,
  year: number,
  title: string,
  content: string,             // HTML 콘텐츠
  highlights: string[],        // 주요 하이라이트
  studentSpotlights: string[], // 학생 스포트라이트 (studentId 배열)
  competitionResults: string[], // 대회 결과
  photos: string[],
  sentAt: Date,                // 발송일
  createdAt: Date
}

// 8. analytics (운영 분석)
{
  _id: ObjectId,
  month: number,
  year: number,
  revenue: number,             // 매출
  newEnrollments: number,      // 신규 등록
  activeStudents: number,      // 재학생 수
  satisfactionScore: number,   // 만족도 점수 (1-5)
  attendanceRate: number,      // 평균 출석률
  competitionWins: number,     // 대회 수상 건수
  createdAt: Date
}

// 9. improvement_ideas (개선 아이디어 보드)
{
  _id: ObjectId,
  ideaId: string,
  submittedBy: string,         // user ID
  category: 'curriculum' | 'facility' | 'communication' | 'other',
  title: string,
  description: string,
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'implemented',
  priority: 'low' | 'medium' | 'high',
  votes: number,              // 찬성 투표 수
  createdAt: Date,
  updatedAt: Date
}
```

---

### **Phase 2: API 라우트 구현** (우선순위: 높음)

#### 새로운 API 엔드포인트

```
/api/students
  - GET: 학생 목록 조회 (필터링, 검색 지원)
  - POST: 학생 등록
  - PUT: 학생 정보 수정

/api/students/[id]
  - GET: 학생 상세 정보
  - PUT: 학생 정보 수정
  - DELETE: 학생 삭제

/api/students/[id]/portfolio
  - GET: 학생 포트폴리오 조회
  - PUT: 포트폴리오 업데이트

/api/competitions
  - GET: 대회 목록
  - POST: 대회 생성

/api/competitions/[id]
  - GET: 대회 상세
  - PUT: 대회 수정
  - DELETE: 대회 삭제

/api/curriculum
  - GET: 커리큘럼 목록 (월별, 과목별 필터링)
  - POST: 커리큘럼 생성

/api/student-feedback
  - GET: 피드백 목록 (학생별, 강사별 필터링)
  - POST: 피드백 작성

/api/gallery
  - GET: 갤러리 목록 (과목별, 날짜별 필터링)
  - POST: 갤러리 항목 추가
  - DELETE: 갤러리 항목 삭제

/api/faq
  - GET: FAQ 목록
  - POST: FAQ 추가 (관리자만)
  - PUT: FAQ 수정
  - DELETE: FAQ 삭제

/api/newsletters
  - GET: 뉴스레터 아카이브
  - POST: 뉴스레터 생성 및 발송

/api/analytics
  - GET: 운영 분석 데이터 (월별, 연도별)

/api/improvement-ideas
  - GET: 개선 아이디어 목록
  - POST: 아이디어 제출
  - PUT: 아이디어 상태 변경 (관리자만)
```

---

### **Phase 3: Admin 대시보드 확장** (우선순위: 높음)

#### 새로운 탭 추가

기존 `/app/admin/page.tsx`에 다음 탭들을 추가:

1. **📊 대시보드 탭** (기본 탭으로 설정)
   - 이번 주 중요 공지
   - 다가오는 대회 일정
   - 학생별 진도 현황 (차트)
   - 학부모 상담 스케줄

2. **👨‍👩‍👧‍👦 학부모 소통 탭**
   - 월간 뉴스레터 관리
   - 학생별 포트폴리오 관리
   - 수업 갤러리 관리
   - FAQ 관리

3. **🎓 학생 관리 탭**
   - 학생 데이터베이스 (CRUD)
   - 월별 수업 커리큘럼 관리
   - 개별 피드백 템플릿 관리

4. **🏆 대회 & 성과 관리 탭**
   - 대회 준비 타임라인
   - 참가 학생 팀 구성
   - 수상 실적 아카이브
   - 대회별 후기 & 사진

5. **📚 수업 콘텐츠 라이브러리 탭**
   - 레벨별 커리큘럼
   - 수업 자료 관리
   - 수업 영상 링크 관리
   - 학습 자료 다운로드

6. **📈 운영 분석 탭**
   - 월별 매출/등록 현황 (차트)
   - 학생 만족도 조사
   - 개선 아이디어 보드

---

### **Phase 4: 학부모 포털 페이지** (우선순위: 중간)

#### 새로운 라우트: `/app/parent-portal`

학부모가 로그인하여 확인할 수 있는 페이지:

- 학생별 포트폴리오 조회
- 수업 사진/영상 갤러리
- 월간 뉴스레터 아카이브
- FAQ
- 상담 신청

**인증 방식:**
- 학부모 전용 로그인 (이메일/전화번호 + 비밀번호)
- 또는 학생 ID + 학부모 전화번호로 인증

---

### **Phase 5: 컴포넌트 구조** (우선순위: 중간)

#### 새로운 컴포넌트 생성

```
components/admin/
  ├── DashboardTab.tsx          // 대시보드 메인
  ├── ParentCommunicationTab.tsx // 학부모 소통
  ├── StudentManagementTab.tsx   // 학생 관리
  ├── CompetitionTab.tsx         // 대회 관리
  ├── ContentLibraryTab.tsx      // 콘텐츠 라이브러리
  ├── AnalyticsTab.tsx           // 운영 분석
  ├── StudentForm.tsx            // 학생 등록/수정 폼
  ├── CompetitionForm.tsx        // 대회 등록/수정 폼
  ├── CurriculumEditor.tsx       // 커리큘럼 에디터
  ├── FeedbackTemplate.tsx       // 피드백 템플릿
  ├── GalleryManager.tsx         // 갤러리 관리
  └── NewsletterEditor.tsx       // 뉴스레터 에디터
```

---

## 🚀 구현 우선순위

### **1단계: 핵심 기능** (1-2주)
1. ✅ 데이터베이스 스키마 설계 및 컬렉션 생성
2. ✅ 학생 관리 API 구현
3. ✅ 학생 관리 탭 UI 구현
4. ✅ 대시보드 탭 기본 구조

### **2단계: 학부모 소통** (1주)
1. ✅ FAQ 시스템
2. ✅ 갤러리 시스템
3. ✅ 뉴스레터 아카이브
4. ✅ 포트폴리오 관리

### **3단계: 대회 & 커리큘럼** (1주)
1. ✅ 대회 관리 시스템
2. ✅ 커리큘럼 관리
3. ✅ 피드백 템플릿

### **4단계: 분석 & 콘텐츠** (1주)
1. ✅ 운영 분석 대시보드
2. ✅ 콘텐츠 라이브러리
3. ✅ 개선 아이디어 보드

### **5단계: 학부모 포털** (1주)
1. ✅ 학부모 인증 시스템
2. ✅ 학부모 포털 페이지
3. ✅ 포트폴리오 공유 기능

---

## 💡 기술적 고려사항

### 1. **기존 시스템과의 통합**
- 기존 `online_courses` 컬렉션과 `curriculum` 연결
- 기존 `users` 컬렉션의 `teacher` 역할 활용
- 기존 인증 시스템 재사용

### 2. **성능 최적화**
- 학생 목록 페이지네이션 (20-50개씩)
- 이미지 최적화 (Next.js Image 컴포넌트)
- 차트 라이브러리: Recharts 또는 Chart.js

### 3. **보안**
- 학부모 포털: 학생 정보 접근 제한
- 갤러리: visibility 설정 (public/parents-only/private)
- API: 기존 인증 미들웨어 재사용

### 4. **파일 업로드**
- 이미지/영상: `/public/uploads/` 디렉토리
- 또는 클라우드 스토리지 (AWS S3, Cloudinary) 고려

---

## 📦 필요한 추가 패키지

```json
{
  "recharts": "^2.10.0",           // 차트 라이브러리
  "react-datepicker": "^4.25.0",   // 날짜 선택기
  "react-select": "^5.8.0",        // 다중 선택 드롭다운
  "react-dropzone": "^14.2.0"      // 파일 업로드
}
```

---

## 🎨 UI/UX 권장사항

1. **대시보드**
   - 카드 기반 레이아웃
   - 색상 코딩 (중요도별)
   - 실시간 통계 위젯

2. **학생 관리**
   - 테이블 + 필터링
   - 검색 기능
   - 일괄 작업 (출석률 계산 등)

3. **갤러리**
   - 그리드 레이아웃
   - 라이트박스 (이미지 확대)
   - 태그 필터링

---

## ✅ 다음 단계

이 제안서를 검토하신 후, 다음 중 선택해주세요:

1. **전체 구현 시작** - 모든 Phase를 순차적으로 구현
2. **1단계만 먼저** - 핵심 기능(학생 관리)만 먼저 구현
3. **특정 기능 우선** - 원하시는 특정 기능부터 구현

어떤 방식으로 진행하시겠습니까?

