# 환경 변수 체크리스트

## 현재 설정된 환경 변수 (4개)

✅ `NEXT_PUBLIC_SITE_URL` - 사이트 URL
✅ `NEXT_PUBLIC_PORTONE_STORE_ID` - 포트원 Store ID
✅ `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` - 포트원 Channel Key
✅ `NEXT_PUBLIC_ADMIN_PASSWORD` - 관리자 비밀번호

---

## ❌ 누락된 필수 환경 변수 (2개)

### 1. MONGODB_URI (필수!)

**용도:** 공지사항, 신청서, 결제 내역 등을 MongoDB에 저장하기 위한 연결 문자열

**설정 방법:**
1. Vercel 대시보드 → Settings → Environment Variables → Add New
2. Key: `MONGODB_URI`
3. Value: MongoDB Atlas 연결 문자열
   - 예: `mongodb+srv://username:password@cluster.mongodb.net/academy-site?retryWrites=true&w=majority`
4. Environment: ✅ Production ✅ Preview ✅ Development (모두 체크)
5. Save

**MongoDB Atlas 연결 문자열 가져오기:**
- https://cloud.mongodb.com 접속
- Database → 클러스터 옆 "Connect" 클릭
- "Connect your application" 선택
- 연결 문자열 복사
- 데이터베이스 이름 추가: `/?` → `/academy-site?`

### 2. MONGODB_DB_NAME (선택, 권장)

**용도:** 사용할 데이터베이스 이름 지정 (없으면 기본값 `academy-site` 사용)

**설정 방법:**
1. Vercel 대시보드 → Settings → Environment Variables → Add New
2. Key: `MONGODB_DB_NAME`
3. Value: `academy-site`
4. Environment: ✅ Production ✅ Preview ✅ Development (모두 체크)
5. Save

---

## 전체 환경 변수 목록 (총 6개)

### 필수 환경 변수 (6개)

| 순서 | Key | 용도 | 필수 여부 |
|------|-----|------|----------|
| 1 | `NEXT_PUBLIC_SITE_URL` | 사이트 URL | ✅ 필수 |
| 2 | `NEXT_PUBLIC_PORTONE_STORE_ID` | 포트원 Store ID | ✅ 필수 |
| 3 | `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` | 포트원 Channel Key | ✅ 필수 |
| 4 | `NEXT_PUBLIC_ADMIN_PASSWORD` | 관리자 비밀번호 | ✅ 필수 |
| 5 | `MONGODB_URI` | MongoDB 연결 문자열 | ✅ **필수** (누락됨!) |
| 6 | `MONGODB_DB_NAME` | MongoDB 데이터베이스 이름 | ⚠️ 권장 (기본값 사용 가능) |

---

## 즉시 해야 할 작업

### Step 1: MongoDB Atlas 연결 문자열 확인

MongoDB Atlas 계정이 있다면:
1. https://cloud.mongodb.com 접속
2. Database → 클러스터 옆 "Connect" 클릭
3. 연결 문자열 복사

MongoDB Atlas 계정이 없다면:
- https://www.mongodb.com/cloud/atlas/register 에서 무료 계정 생성
- 클러스터 생성 (M0 FREE)
- 데이터베이스 사용자 생성
- 네트워크 액세스: "Allow Access from Anywhere" 설정
- 연결 문자열 가져오기

### Step 2: Vercel에 환경 변수 추가

1. **Vercel 대시보드 접속**
   - https://vercel.com 접속
   - 프로젝트 선택

2. **Settings → Environment Variables → Add New**

3. **MONGODB_URI 추가**
   - Key: `MONGODB_URI`
   - Value: MongoDB 연결 문자열 (데이터베이스 이름 포함)
   - Environment: 모두 체크
   - Save

4. **MONGODB_DB_NAME 추가** (선택)
   - Key: `MONGODB_DB_NAME`
   - Value: `academy-site`
   - Environment: 모두 체크
   - Save

### Step 3: 재배포

환경 변수 추가 후 반드시 재배포:

**방법 1: 자동 재배포**
```bash
git commit --allow-empty -m "trigger redeploy"
git push origin main
```

**방법 2: Vercel 대시보드에서 수동 재배포**
- Deployments 탭 → 최신 배포 옆 "..." → "Redeploy"

### Step 4: 확인

배포 완료 후 (2-3분):
- https://parplay.co.kr/api/news/test 접속
- `"success": true` 확인
- 관리자 페이지 → 공지사항 탭 → "연결 테스트" 버튼 클릭

---

## 환경 변수별 기능

### 결제 시스템 (포트원)
- `NEXT_PUBLIC_PORTONE_STORE_ID` - Store ID
- `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` - Channel Key
- `NEXT_PUBLIC_SITE_URL` - 사이트 URL

### 데이터베이스 (MongoDB)
- `MONGODB_URI` - 연결 문자열 (필수!)
- `MONGODB_DB_NAME` - 데이터베이스 이름 (선택)

### 관리자
- `NEXT_PUBLIC_ADMIN_PASSWORD` - 관리자 비밀번호

---

## 문제 해결

### "MongoDB URI가 설정되지 않았습니다" 에러
→ `MONGODB_URI` 환경 변수 추가 필요

### 공지사항이 표시되지 않음
→ `MONGODB_URI` 환경 변수 추가 및 재배포 필요

### 공지사항 작성 시 에러 발생
→ `MONGODB_URI` 환경 변수 추가 및 재배포 필요

---

## 참고 문서

- 상세 가이드: `/docs/VERCEL_MONGODB_FIX.md`
- 빠른 설정: `/docs/VERCEL_ENV_QUICK_SETUP.md`

