# 수집된 기사 시스템 설정 가이드

> **📌 이 문서 하나로 모든 설정을 완료할 수 있습니다.**

---

## 📋 진행 순서

### 1단계: MongoDB 인덱스 생성 ✅

### 2단계: 환경 변수 설정 ✅

### 3단계: 테스트 ✅

---

## ✅ 1단계: MongoDB 인덱스 생성

### 인덱스 생성 상태 확인

**MongoDB Atlas에서 확인:**
1. MongoDB Atlas → Database → Browse Collections
2. `collected_news` 컬렉션 선택 (없으면 생성)
3. Indexes 탭 확인

**필요한 인덱스 (7개):**
- [ ] `sourceUrl_1` (unique) - 중복 체크용
- [ ] `publishedAt_-1` - 최신순 정렬
- [ ] `isActive_1_publishedAt_-1` (복합) - 활성 기사 최신순
- [ ] `collectedAt_-1` - 수집일 기준 조회
- [ ] `keywords_1` - 키워드 검색
- [ ] `category_1_publishedAt_-1` (복합) - 카테고리별 최신순
- [ ] `relevanceScore_-1` - 관련성 순 정렬

### 인덱스 생성 방법 (3가지 중 선택)

#### 방법 1: MongoDB Atlas UI (가장 쉬움) ⭐ 권장

1. MongoDB Atlas → Database → Browse Collections
2. `collected_news` 컬렉션 선택 (없으면 생성)
3. Indexes 탭 → Create Index 클릭
4. 각 인덱스를 하나씩 생성:

```
인덱스 1: { "sourceUrl": 1 } - Unique 체크!
인덱스 2: { "publishedAt": -1 }
인덱스 3: { "isActive": 1, "publishedAt": -1 }
인덱스 4: { "collectedAt": -1 }
인덱스 5: { "keywords": 1 }
인덱스 6: { "category": 1, "publishedAt": -1 }
인덱스 7: { "relevanceScore": -1 }
```

#### 방법 2: 스크립트 실행 (로컬)

```bash
# .env.local 파일이 있는 경우
source .env.local
npm run create-collected-news-indexes
```

#### 방법 3: MongoDB Shell

```javascript
use('academy-site');

// 1. sourceUrl (unique)
db.collected_news.createIndex({ sourceUrl: 1 }, { unique: true });

// 2. publishedAt
db.collected_news.createIndex({ publishedAt: -1 });

// 3. isActive + publishedAt
db.collected_news.createIndex({ isActive: 1, publishedAt: -1 });

// 4. collectedAt
db.collected_news.createIndex({ collectedAt: -1 });

// 5. keywords
db.collected_news.createIndex({ keywords: 1 });

// 6. category + publishedAt
db.collected_news.createIndex({ category: 1, publishedAt: -1 });

// 7. relevanceScore
db.collected_news.createIndex({ relevanceScore: -1 });
```

**인덱스 생성 확인:**
- MongoDB Atlas UI에서 `collected_news` 컬렉션의 Indexes 탭 확인
- 모든 인덱스의 Status가 "READY"인지 확인

---

## ✅ 2단계: 환경 변수 설정

### Vercel 대시보드에서 설정

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Settings → Environment Variables**

3. **필수 환경 변수 확인**

   **이미 설정되어 있어야 하는 변수:**
   - ✅ `MONGODB_URI`: MongoDB 연결 문자열
   - ✅ `JWT_SECRET`: JWT 토큰 암호화 키
   - ✅ `BLOB_READ_WRITE_TOKEN`: Vercel Blob Storage 토큰 (이미지 저장용)

4. **선택사항 환경 변수 추가 (보안 강화용)**

   **`CRON_SECRET`:**
   - Key: `CRON_SECRET`
   - Value: 강력한 랜덤 문자열 생성
     ```bash
     # 터미널에서 실행
     openssl rand -base64 32
     ```
   - Environment: Production, Preview, Development 모두 선택
   - Save 클릭

   **⚠️ 주의:** `CRON_SECRET`을 설정하지 않으면 기본값이 사용됩니다. 프로덕션에서는 반드시 설정하세요.

5. **재배포**
   - 환경 변수 변경 후 자동 재배포 또는 수동 재배포

---

## ✅ 3단계: 테스트

### 3.1 수동 수집 테스트

1. **관리자 로그인**
   - `/admin/login` 접속
   - 관리자 계정으로 로그인

2. **수집된 기사 탭 이동**
   - 관리자 페이지 → "수집된 기사" 탭 클릭

3. **수동 수집 실행**
   - "수동 수집" 버튼 클릭
   - 수집 진행 상태 확인 (로딩 중...)
   - 결과 확인:
     - 수집된 기사 수
     - 중복된 기사 수
     - 실패한 기사 수

4. **수집 상태 확인**
   - 수집 상태 대시보드에서 정보 확인:
     - 마지막 수집 시간
     - 다음 수집 예정 시간
     - 전체 수집 기사 수
     - 최근 24시간 수집 기사 수

### 3.2 수집된 기사 확인

1. **관리자 페이지에서 확인**
   - "수집된 기사" 탭에서 목록 확인
   - 기사 상세 정보 확인 (제목, 출처, 카테고리, 발행일)
   - 이미지 표시 확인
   - 기사 활성화/비활성화 테스트
   - 기사 삭제 테스트

2. **게시판에서 확인**
   - `/news/collected` 접속
   - 수집된 기사 목록 확인
   - 필터링 테스트 (카테고리별)
   - 검색 테스트 (키워드)
   - 정렬 테스트 (최신순, 관련성순)
   - 기사 상세 페이지 확인
   - 원본 링크 열기 테스트

### 3.3 Cron 작업 확인

**Vercel 대시보드에서 확인:**
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Cron Jobs
3. Cron 작업 실행 로그 확인

**또는 Functions → Logs에서 확인:**
- `/api/news/collect/cron` 호출 로그 확인
- 실행 시간: 6시간마다 (00:00, 06:00, 12:00, 18:00)

---

## 🔍 문제 해결

### 인덱스 생성 실패

**증상:**
- 인덱스 생성 스크립트 실행 시 오류
- MongoDB Atlas에서 인덱스 생성 실패

**해결:**
1. MongoDB 연결 확인 (`MONGODB_URI` 환경 변수)
2. MongoDB Atlas에서 IP 화이트리스트 확인
3. 수동으로 MongoDB Atlas UI에서 인덱스 생성 (방법 1 권장)
4. 컬렉션이 존재하는지 확인 (없으면 먼저 생성)

### 수집 실패

**증상:**
- 수동 수집 시 오류 발생
- "수집 실패" 메시지 표시

**해결:**
1. RSS 피드 URL 확인 (Google News RSS는 정상 작동해야 함)
2. 네트워크 연결 확인
3. MongoDB 연결 확인
4. 로그 확인 (Vercel 대시보드 → Functions → Logs)
5. 관리자 페이지의 수집 상태 대시보드에서 오류 메시지 확인

### 이미지 업로드 실패

**증상:**
- 이미지가 표시되지 않음
- 이미지 URL이 원본 URL로 표시됨

**해결:**
1. `BLOB_READ_WRITE_TOKEN` 환경 변수 확인
2. Vercel Blob Storage 활성화 확인
3. 이미지 URL 확인 (원본 URL로 fallback되었는지 - 정상 동작)
4. 이미지 다운로드 실패 시 원본 URL 사용 (의도된 동작)

### Cron 작업이 실행되지 않음

**증상:**
- 자동 수집이 실행되지 않음
- Vercel 대시보드에 Cron 작업이 표시되지 않음

**해결:**
1. Vercel 대시보드에서 Cron 설정 확인
2. `vercel.json`의 `crons` 설정 확인
3. Vercel 프로젝트가 올바르게 배포되었는지 확인
4. Cron 실행 로그 확인 (Vercel 대시보드 → Functions → Logs)
5. `CRON_SECRET` 환경 변수 확인 (설정한 경우)

---

## 📊 모니터링

### 수집 로그 확인

1. **관리자 페이지**
   - "수집된 기사" 탭 → 수집 상태 대시보드
   - 마지막 수집 시간, 다음 수집 예정 시간 확인

2. **MongoDB Atlas**
   - `collection_logs` 컬렉션에서 수집 로그 확인
   - 수집 상태, 수집된 기사 수, 실패 건수 확인

3. **Vercel 대시보드**
   - Functions → Logs에서 API 호출 로그 확인
   - `/api/news/collect/cron` 호출 로그 확인

---

## ✅ 완료 확인 체크리스트

다음 항목들이 모두 완료되었는지 확인하세요:

### 필수 항목
- [ ] MongoDB 인덱스 생성 완료 (7개)
- [ ] 환경 변수 설정 완료 (MONGODB_URI, JWT_SECRET, BLOB_READ_WRITE_TOKEN)
- [ ] 수동 수집 테스트 성공
- [ ] 수집된 기사 목록 확인 (관리자 페이지)
- [ ] 게시판 페이지에서 기사 표시 확인 (`/news/collected`)

### 선택 항목 (보안 강화)
- [ ] CRON_SECRET 설정 (프로덕션 권장)
- [ ] Cron 작업 실행 확인 (Vercel 대시보드)

---

## 🎯 빠른 시작 가이드

**가장 빠른 설정 방법:**

1. **MongoDB Atlas UI에서 인덱스 생성** (5분)
   - MongoDB Atlas → `collected_news` 컬렉션 → Indexes 탭
   - 7개 인덱스 생성

2. **Vercel 환경 변수 확인** (2분)
   - Vercel 대시보드 → Settings → Environment Variables
   - 필수 변수 확인

3. **수동 수집 테스트** (3분)
   - 관리자 페이지 → "수집된 기사" 탭 → "수동 수집" 버튼

**총 소요 시간: 약 10분**

---

**작성일:** 2025-01-XX  
**버전:** 1.0  
**최종 업데이트:** 2025-01-XX

