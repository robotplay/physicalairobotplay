# 수집된 기사 시스템 설정 가이드

## 📋 설정 체크리스트

### 1. MongoDB 인덱스 생성 ✅

인덱스 생성 스크립트가 준비되어 있습니다. 다음 명령어로 실행하세요:

```bash
npm run create-collected-news-indexes
```

또는 MongoDB Atlas에서 수동으로 생성:

1. MongoDB Atlas → Collections → `collected_news` 선택
2. Indexes 탭 → Create Index 클릭
3. 다음 인덱스들을 생성:

```javascript
// 1. sourceUrl (unique)
{ sourceUrl: 1 } - unique: true

// 2. publishedAt (descending)
{ publishedAt: -1 }

// 3. isActive + publishedAt
{ isActive: 1, publishedAt: -1 }

// 4. collectedAt (descending)
{ collectedAt: -1 }

// 5. keywords
{ keywords: 1 }

// 6. category + publishedAt
{ category: 1, publishedAt: -1 }

// 7. relevanceScore (descending)
{ relevanceScore: -1 }
```

**인덱스 생성 확인:**
- MongoDB Atlas UI에서 `collected_news` 컬렉션의 Indexes 탭 확인
- 또는 MongoDB Shell에서: `db.collected_news.getIndexes()`

---

### 2. 환경 변수 설정

#### Vercel 대시보드에서 설정

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Settings → Environment Variables**

3. **환경 변수 추가**

   **필수 환경 변수 (이미 설정되어 있을 수 있음):**
   - `MONGODB_URI`: MongoDB 연결 문자열
   - `JWT_SECRET`: JWT 토큰 암호화 키
   - `BLOB_READ_WRITE_TOKEN`: Vercel Blob Storage 토큰 (이미지 저장용)

   **선택사항 (보안 강화용):**
   - `CRON_SECRET`: Cron 작업 인증용 시크릿 (기본값: `default-cron-secret-change-in-production`)
     - **권장**: 강력한 랜덤 문자열 생성
     - 예: `openssl rand -base64 32`로 생성

4. **환경 적용**
   - Production, Preview, Development 모두 선택
   - Save 클릭

5. **재배포**
   - 환경 변수 변경 후 자동 재배포 또는 수동 재배포

---

### 3. 테스트

#### 3.1 수동 수집 테스트

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
   - 수집 상태 대시보드에서 정보 확인:
     - 마지막 수집 시간
     - 다음 수집 예정 시간
     - 전체 수집 기사 수
     - 최근 24시간 수집 기사 수

#### 3.2 수집된 기사 확인

1. **관리자 페이지에서 확인**
   - "수집된 기사" 탭에서 목록 확인
   - 기사 상세 정보 확인
   - 이미지 표시 확인

2. **게시판에서 확인**
   - `/news/collected` 접속
   - 수집된 기사 목록 확인
   - 필터링 및 검색 테스트
   - 기사 상세 페이지 확인

3. **기사 관리 테스트**
   - 기사 활성화/비활성화
   - 기사 삭제
   - 원본 링크 열기

#### 3.3 Cron 작업 테스트

**로컬 테스트:**
```bash
# Cron API 직접 호출 (테스트용)
curl -X GET "http://localhost:3000/api/news/collect/cron" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**프로덕션 테스트:**
- Vercel 대시보드 → Deployments → Functions → Cron Jobs 확인
- 또는 Vercel 대시보드 → Settings → Cron Jobs에서 실행 로그 확인

---

## 🔍 문제 해결

### 인덱스 생성 실패

**증상:**
- 인덱스 생성 스크립트 실행 시 오류

**해결:**
1. MongoDB 연결 확인 (`MONGODB_URI` 환경 변수)
2. MongoDB Atlas에서 IP 화이트리스트 확인
3. 수동으로 MongoDB Atlas UI에서 인덱스 생성

### 수집 실패

**증상:**
- 수동 수집 시 오류 발생

**해결:**
1. RSS 피드 URL 확인
2. 네트워크 연결 확인
3. MongoDB 연결 확인
4. 로그 확인 (Vercel 대시보드 → Functions → Logs)

### 이미지 업로드 실패

**증상:**
- 이미지가 표시되지 않음

**해결:**
1. `BLOB_READ_WRITE_TOKEN` 환경 변수 확인
2. Vercel Blob Storage 활성화 확인
3. 이미지 URL 확인 (원본 URL로 fallback되었는지)

### Cron 작업이 실행되지 않음

**증상:**
- 자동 수집이 실행되지 않음

**해결:**
1. Vercel 대시보드에서 Cron 설정 확인
2. `vercel.json`의 `crons` 설정 확인
3. Vercel 프로젝트가 올바르게 배포되었는지 확인
4. Cron 실행 로그 확인 (Vercel 대시보드)

---

## 📊 모니터링

### 수집 로그 확인

1. **관리자 페이지**
   - "수집된 기사" 탭 → 수집 상태 대시보드

2. **MongoDB Atlas**
   - `collection_logs` 컬렉션에서 수집 로그 확인

3. **Vercel 대시보드**
   - Functions → Logs에서 API 호출 로그 확인

---

## ✅ 완료 확인

다음 항목들이 모두 완료되었는지 확인하세요:

- [ ] MongoDB 인덱스 생성 완료
- [ ] 환경 변수 설정 완료 (MONGODB_URI, JWT_SECRET, BLOB_READ_WRITE_TOKEN)
- [ ] CRON_SECRET 설정 (선택사항, 보안 강화용)
- [ ] 수동 수집 테스트 성공
- [ ] 수집된 기사 목록 확인
- [ ] 게시판 페이지에서 기사 표시 확인
- [ ] Cron 작업 실행 확인 (Vercel 대시보드)

---

**작성일:** 2025-01-XX  
**버전:** 1.0

