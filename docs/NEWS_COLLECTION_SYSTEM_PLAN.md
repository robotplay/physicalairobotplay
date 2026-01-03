# Physical AI Robot 기사 자동 수집 게시판 구축 기획서

## 📋 프로젝트 개요

### 목적
Physical AI Robot 관련 뉴스 기사를 자동으로 수집하여 웹사이트에 게시판 형태로 표시하는 시스템 구축

### 목표
- Physical AI Robot 관련 기사 자동 수집
- 무료 데이터 소스 활용
- 자동화된 워크플로우로 관리 부담 최소화
- 사용자 친화적인 게시판 UI 제공

---

## 🎯 1단계: 데이터 수집 방법 설계

### 1.1 무료 뉴스 수집 방법 조사

#### 방법 1: RSS 피드 활용 (권장)
**장점:**
- 무료
- 정기적으로 업데이트
- 구조화된 데이터
- API 호출 제한 없음

**대상 사이트:**
- Google News RSS: `https://news.google.com/rss/search?q=Physical+AI+Robot&hl=ko&gl=KR&ceid=KR:ko`
- 네이버 뉴스 RSS: `https://news.naver.com/main/rss/section.naver?sid=105`
- 다음 뉴스 RSS: `https://media.daum.net/rss/`
- 기술 블로그 RSS 피드

**구현 방법:**
```typescript
// RSS 피드 파싱
- feedparser 라이브러리 사용
- XML 파싱하여 제목, 내용, 링크, 날짜 추출
- 키워드 필터링 (Physical AI Robot, 로봇, AI 등)
```

#### 방법 2: 웹 스크래핑 (보조)
**장점:**
- 특정 사이트의 기사 수집 가능
- 더 세밀한 필터링 가능

**단점:**
- 사이트 구조 변경 시 수정 필요
- robots.txt 준수 필요
- 법적 이슈 가능성

**대상 사이트:**
- 언론사 웹사이트 (공개 기사만)
- 기술 블로그
- 교육 관련 뉴스 사이트

**구현 방법:**
```typescript
// 웹 스크래핑
- Cheerio 또는 Puppeteer 사용
- HTML 파싱하여 기사 정보 추출
- Rate limiting 적용 (1초당 1회 요청)
```

#### 방법 3: 공개 API 활용
**대상:**
- Google News API (제한적)
- 네이버 검색 API (무료 할당량 제공)
- 다음 검색 API

**구현 방법:**
```typescript
// API 호출
- 네이버 검색 API: 무료 25,000건/일
- 키워드: "Physical AI Robot", "로봇 교육", "AI 로봇" 등
- 정기적으로 API 호출하여 신규 기사 수집
```

### 1.2 키워드 전략

**주요 키워드:**
- Physical AI Robot
- 로봇 교육
- AI 로봇
- 코딩 교육
- 로봇플레이
- 로봇 코딩
- 휴머노이드 로봇
- 드론 코딩
- STEAM 교육

**키워드 필터링:**
- 제목 또는 본문에 키워드 포함 여부 확인
- 관련성 점수 계산
- 중복 기사 제거 (URL 기준)

### 1.3 데이터 구조 설계

```typescript
interface NewsArticle {
    _id: string;
    title: string;              // 기사 제목
    content: string;            // 기사 본문 (요약 또는 전체)
    excerpt: string;           // 기사 요약
    source: string;            // 출처 (예: "천안아산신문")
    sourceUrl: string;         // 원본 기사 URL
    imageUrl?: string;         // 썸네일 이미지 URL
    publishedAt: Date;         // 발행일
    collectedAt: Date;         // 수집일
    keywords: string[];        // 관련 키워드
    category: string;          // 카테고리
    relevanceScore: number;    // 관련성 점수 (0-100)
    isActive: boolean;         // 게시 여부
    viewCount: number;         // 조회수
    createdAt: Date;
    updatedAt: Date;
}
```

---

## 🔄 2단계: 자동화 워크플로우 구축

### 2.1 수집 스케줄링

**Vercel Cron Jobs 활용:**
```typescript
// vercel.json에 Cron 설정
{
  "crons": [
    {
      "path": "/api/news/collect",
      "schedule": "0 */6 * * *"  // 6시간마다 실행
    }
  ]
}
```

**수집 주기:**
- 매일 4회 (00:00, 06:00, 12:00, 18:00)
- 또는 매일 1회 (새벽 2시)

### 2.2 수집 프로세스

```
1. RSS 피드 수집
   ↓
2. 기사 파싱 및 필터링
   ↓
3. 중복 체크 (URL 기준)
   ↓
4. 관련성 점수 계산
   ↓
5. 이미지 다운로드 및 최적화
   ↓
6. MongoDB에 저장
   ↓
7. 관리자 알림 (선택사항)
```

### 2.3 중복 방지 로직

```typescript
// 중복 체크
- sourceUrl을 기준으로 기존 기사 확인
- 제목 유사도 검사 (Levenshtein distance)
- 발행일 기준으로 최근 30일 내 기사만 수집
```

### 2.4 이미지 처리

```typescript
// 이미지 처리 워크플로우
1. 원본 이미지 URL에서 이미지 다운로드
2. Sharp를 사용하여 리사이즈 및 최적화
3. Vercel Blob Storage에 업로드
4. CDN URL로 저장
5. 원본 URL은 백업용으로 보관
```

---

## 🗄️ 3단계: 데이터베이스 설계

### 3.1 MongoDB 컬렉션 구조

**컬렉션: `collected_news`**

```javascript
{
  _id: ObjectId,
  title: String,              // 필수
  content: String,           // 필수
  excerpt: String,           // 자동 생성 또는 원본
  source: String,            // 필수 (예: "천안아산신문")
  sourceUrl: String,         // 필수, unique
  imageUrl: String,          // 선택
  publishedAt: Date,        // 필수
  collectedAt: Date,         // 필수
  keywords: [String],        // 필수
  category: String,          // 필수 (예: "교육", "기술", "대회")
  relevanceScore: Number,    // 필수 (0-100)
  isActive: Boolean,         // 기본값: true
  viewCount: Number,         // 기본값: 0
  createdAt: Date,
  updatedAt: Date
}
```

### 3.2 인덱스 설계

```javascript
// 성능 최적화를 위한 인덱스
db.collected_news.createIndex({ sourceUrl: 1 }, { unique: true });
db.collected_news.createIndex({ publishedAt: -1 });
db.collected_news.createIndex({ collectedAt: -1 });
db.collected_news.createIndex({ isActive: 1, publishedAt: -1 });
db.collected_news.createIndex({ keywords: 1 });
db.collected_news.createIndex({ relevanceScore: -1 });
```

---

## 🎨 4단계: 게시판 UI 설계

### 4.1 게시판 페이지 구조

**경로: `/news/collected`**

**기능:**
- 기사 목록 표시 (카드 형태)
- 필터링 (카테고리, 날짜)
- 검색 기능
- 페이지네이션
- 정렬 (최신순, 관련성순)

### 4.2 기사 카드 디자인

```
┌─────────────────────────────┐
│ [이미지]  제목              │
│          출처 | 날짜        │
│          요약 내용...       │
│          [자세히 보기]      │
└─────────────────────────────┘
```

### 4.3 상세 페이지

**경로: `/news/collected/[id]`**

**기능:**
- 전체 기사 내용 표시
- 원본 링크 제공
- 관련 기사 추천
- 소셜 공유 버튼

---

## 🔧 5단계: API 엔드포인트 설계

### 5.1 수집 API

**`POST /api/news/collect`**
- RSS 피드 수집
- 기사 파싱 및 저장
- 관리자 전용 (인증 필요)

**`GET /api/news/collect/status`**
- 최근 수집 상태 확인
- 수집된 기사 수, 실패 건수 등

### 5.2 조회 API

**`GET /api/collected-news`**
- 수집된 기사 목록 조회
- 필터링, 정렬, 페이지네이션 지원
- 공개 API (인증 불필요)

**`GET /api/collected-news/[id]`**
- 특정 기사 상세 조회
- 조회수 증가

### 5.3 관리 API

**`PUT /api/collected-news/[id]`**
- 기사 활성화/비활성화
- 카테고리 수정
- 관리자 전용

**`DELETE /api/collected-news/[id]`**
- 기사 삭제
- 관리자 전용

---

## 📦 6단계: 필요한 라이브러리 및 도구

### 6.1 필수 패키지

```json
{
  "dependencies": {
    "rss-parser": "^3.13.0",        // RSS 피드 파싱
    "cheerio": "^1.0.0-rc.12",      // HTML 파싱
    "node-fetch": "^3.3.2",         // HTTP 요청
    "sharp": "^0.34.5",              // 이미지 처리 (이미 설치됨)
    "@vercel/blob": "^2.0.0",       // 이미지 저장 (이미 설치됨)
    "date-fns": "^3.0.0",           // 날짜 처리
    "string-similarity": "^4.0.4"   // 텍스트 유사도 계산
  }
}
```

### 6.2 선택적 패키지

```json
{
  "dependencies": {
    "puppeteer": "^21.0.0",         // 동적 웹 스크래핑 (필요시)
    "natural": "^6.5.0"              // 자연어 처리 (키워드 추출)
  }
}
```

---

## 🚀 7단계: 구현 순서

### Phase 1: 기본 수집 시스템 (1주)
1. RSS 피드 파싱 구현
2. MongoDB 스키마 및 인덱스 생성
3. 기본 수집 API 구현
4. 중복 체크 로직 구현

### Phase 2: 이미지 처리 (3일)
1. 이미지 다운로드 로직
2. 이미지 최적화 및 저장
3. 이미지 URL 관리

### Phase 3: 게시판 UI (1주)
1. 게시판 목록 페이지
2. 기사 상세 페이지
3. 필터링 및 검색 기능
4. 페이지네이션

### Phase 4: 자동화 (2일)
1. Vercel Cron 설정
2. 스케줄링 테스트
3. 에러 핸들링 및 로깅

### Phase 5: 관리 기능 (3일)
1. 관리자 페이지 통합
2. 기사 관리 기능
3. 수집 상태 모니터링

### Phase 6: 최적화 및 테스트 (3일)
1. 성능 최적화
2. 에러 처리 개선
3. 사용자 테스트

---

## ⚠️ 8단계: 주의사항 및 제약사항

### 8.1 법적 고려사항
- **저작권:** 기사 내용은 원본 링크로 연결, 전체 내용 복제 지양
- **robots.txt 준수:** 웹 스크래핑 시 사이트 정책 확인
- **이용약관 확인:** RSS 피드 사용 시 이용약관 확인

### 8.2 기술적 제약사항
- **Rate Limiting:** API 호출 제한 준수
- **데이터 용량:** 이미지 저장 공간 관리
- **에러 처리:** 네트워크 오류, 파싱 오류 처리

### 8.3 운영 고려사항
- **모니터링:** 수집 실패 알림 설정
- **백업:** 수집된 데이터 정기 백업
- **정기 점검:** 수집 품질 주기적 확인

---

## 📊 9단계: 성공 지표

### 9.1 수집 지표
- 일일 수집 기사 수
- 수집 성공률
- 중복 기사 비율

### 9.2 사용자 지표
- 게시판 조회수
- 기사 상세 페이지 조회수
- 평균 체류 시간

### 9.3 품질 지표
- 관련성 점수 평균
- 사용자 피드백
- 관리자 승인률

---

## 🔄 10단계: 향후 개선 방향

### 10.1 단기 개선
- 더 많은 뉴스 소스 추가
- 키워드 자동 추출 개선
- 관련 기사 추천 기능

### 10.2 중기 개선
- AI 기반 기사 요약
- 감성 분석 (긍정/부정)
- 다국어 지원

### 10.3 장기 개선
- 실시간 알림 (새 기사 수집 시)
- 소셜 미디어 연동
- 사용자 맞춤 추천

---

## 📝 다음 단계

1. **기획 검토 및 승인**
2. **기술 스택 최종 확인**
3. **개발 환경 설정**
4. **Phase 1 구현 시작**

---

## 📚 참고 자료

- [RSS 2.0 스펙](https://www.rssboard.org/rss-specification)
- [Vercel Cron Jobs 문서](https://vercel.com/docs/cron-jobs)
- [MongoDB 인덱스 최적화](https://www.mongodb.com/docs/manual/indexes/)
- [웹 스크래핑 법적 가이드](https://www.eff.org/issues/coders/scraping-faq)

---

**작성일:** 2025-01-XX  
**버전:** 1.0  
**작성자:** Development Team

