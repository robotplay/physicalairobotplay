# 수집된 기사 시스템 설정 체크리스트

## ✅ 1. MongoDB 인덱스 생성 확인

### 인덱스 생성 상태 확인

**MongoDB Atlas에서 확인:**
1. MongoDB Atlas → Database → Browse Collections
2. `collected_news` 컬렉션 선택
3. Indexes 탭 확인

**필요한 인덱스 (7개):**
- [ ] `sourceUrl_1` (unique)
- [ ] `publishedAt_-1`
- [ ] `isActive_1_publishedAt_-1` (복합)
- [ ] `collectedAt_-1`
- [ ] `keywords_1`
- [ ] `category_1_publishedAt_-1` (복합)
- [ ] `relevanceScore_-1`

### 인덱스 생성 방법

**방법 1: 스크립트 실행 (로컬)**
```bash
# .env.local 파일이 있는 경우
source .env.local
npm run create-collected-news-indexes
```

**방법 2: MongoDB Atlas UI (권장)**
1. MongoDB Atlas → Database → Browse Collections
2. `collected_news` 컬렉션 선택 (없으면 생성)
3. Indexes 탭 → Create Index
4. 각 인덱스를 하나씩 생성

**방법 3: MongoDB Shell**
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

---

## ✅ 2. 환경 변수 설정

### Vercel 대시보드에서 설정

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Settings → Environment Variables**

3. **필수 환경 변수 확인**

   **이미 설정되어 있어야 하는 변수:**
   - ✅ `MONGODB_URI`: MongoDB 연결 문자열
   - ✅ `JWT_SECRET`: JWT 토큰 암호화 키
   - ✅ `BLOB_READ_WRITE_TOKEN`: Vercel Blob Storage 토큰

4. **선택사항 환경 변수 추가**

   **`CRON_SECRET` (보안 강화용):**
   - Key: `CRON_SECRET`
   - Value: 강력한 랜덤 문자열 (예: `openssl rand -base64 32`로 생성)
   - Environment: Production, Preview, Development 모두 선택
   - Save 클릭

   **⚠️ 주의:** `CRON_SECRET`을 설정하지 않으면 기본값이 사용됩니다. 프로덕션에서는 반드시 설정하세요.

5. **재배포**
   - 환경 변수 변경 후 자동 재배포 또는 수동 재배포

---

## ✅ 3. 테스트

### 3.1 수동 수집 테스트

1. **관리자 로그인**
   - `/admin/login` 접속
   - 관리자 계정으로 로그인

2. **수집된 기사 탭 이동**
   - 관리자 페이지 → "수집된 기사" 탭 클릭

3. **수동 수집 실행**
   - "수동 수집" 버튼 클릭
   - 수집 진행 상태 확인
   - 결과 확인 (수집, 중복, 실패 건수)

4. **수집 상태 확인**
   - 수집 상태 대시보드에서 정보 확인

### 3.2 수집된 기사 확인

1. **관리자 페이지에서 확인**
   - "수집된 기사" 탭에서 목록 확인
   - 기사 상세 정보 확인
   - 이미지 표시 확인

2. **게시판에서 확인**
   - `/news/collected` 접속
   - 수집된 기사 목록 확인
   - 필터링 및 검색 테스트
   - 기사 상세 페이지 확인

### 3.3 Cron 작업 확인

**Vercel 대시보드에서 확인:**
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Cron Jobs
3. Cron 작업 실행 로그 확인

**또는 Functions → Logs에서 확인:**
- `/api/news/collect/cron` 호출 로그 확인

---

## 📊 완료 확인

다음 항목들이 모두 완료되었는지 확인하세요:

- [ ] MongoDB 인덱스 생성 완료 (7개)
- [ ] 환경 변수 설정 완료 (MONGODB_URI, JWT_SECRET, BLOB_READ_WRITE_TOKEN)
- [ ] CRON_SECRET 설정 (선택사항, 보안 강화용)
- [ ] 수동 수집 테스트 성공
- [ ] 수집된 기사 목록 확인
- [ ] 게시판 페이지에서 기사 표시 확인
- [ ] Cron 작업 실행 확인 (Vercel 대시보드)

---

**작성일:** 2025-01-XX  
**버전:** 1.0

