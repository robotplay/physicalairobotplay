# Vercel MongoDB 연결 오류 해결 가이드

## 🔴 문제 상황

공지사항 작성 시 다음 에러가 발생합니다:
```
"MongoDB URI가 설정되지 않았습니다."
"Vercel 환경 변수에 MONGODB_URI를 설정해주세요."
```

**원인:** Vercel 프로덕션 환경에 `MONGODB_URI` 환경 변수가 설정되지 않았습니다.

---

## ✅ 해결 방법 (5단계)

### 1단계: MongoDB Atlas 연결 문자열 확인

#### 방법 A: 이미 MongoDB Atlas 계정이 있는 경우

1. **MongoDB Atlas 대시보드 접속**
   - https://cloud.mongodb.com 접속
   - 로그인

2. **연결 문자열 가져오기**
   - 왼쪽 메뉴에서 **"Database"** 클릭
   - 클러스터 옆 **"Connect"** 버튼 클릭
   - **"Connect your application"** 선택
   - Driver: **Node.js**, Version: **5.5 or later** 선택
   - 연결 문자열 복사
     - 예: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

3. **데이터베이스 이름 추가**
   - 복사한 연결 문자열 끝에 데이터베이스 이름 추가
   - 예: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/academy-site?retryWrites=true&w=majority`
   - ⚠️ `/?` 부분을 `/academy-site?`로 변경

#### 방법 B: MongoDB Atlas 계정이 없는 경우

1. **MongoDB Atlas 계정 생성**
   - https://www.mongodb.com/cloud/atlas/register 접속
   - 무료 계정 생성 (Free Tier - M0 클러스터)

2. **클러스터 생성**
   - "Build a Database" 클릭
   - "M0 FREE" 선택
   - 클라우드 제공자 및 리전 선택 (가장 가까운 지역)
   - 클러스터 이름 설정 (예: `academy-cluster`)
   - "Create" 클릭 (약 3-5분 소요)

3. **데이터베이스 사용자 생성**
   - "Database Access" 메뉴 클릭
   - "Add New Database User" 클릭
   - 인증 방법: **Password** 선택
   - 사용자 이름과 비밀번호 설정 (⚠️ 반드시 기록해두세요!)
   - 권한: **"Atlas admin"** 또는 **"Read and write to any database"** 선택
   - "Add User" 클릭

4. **네트워크 액세스 설정**
   - "Network Access" 메뉴 클릭
   - "Add IP Address" 클릭
   - **"Allow Access from Anywhere"** 선택 (또는 `0.0.0.0/0` 입력)
   - "Confirm" 클릭

5. **연결 문자열 가져오기**
   - "Database" 메뉴로 돌아가기
   - 클러스터 옆 "Connect" 버튼 클릭
   - "Connect your application" 선택
   - Driver: **Node.js**, Version: **5.5 or later** 선택
   - 연결 문자열 복사
   - 데이터베이스 이름 추가: `/?` → `/academy-site?`

---

### 2단계: Vercel 대시보드 접속

1. **Vercel 대시보드 접속**
   - https://vercel.com 접속
   - 로그인

2. **프로젝트 선택**
   - `academy-site` 또는 해당 프로젝트 클릭

---

### 3단계: 환경 변수 추가

1. **Settings 메뉴 클릭**
   - 프로젝트 페이지 상단의 **"Settings"** 탭 클릭

2. **Environment Variables 메뉴 클릭**
   - 왼쪽 메뉴에서 **"Environment Variables"** 클릭

3. **MONGODB_URI 추가**
   - **"Add New"** 버튼 클릭
   - **Key**: `MONGODB_URI`
   - **Value**: 1단계에서 복사한 연결 문자열
     - 예: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/academy-site?retryWrites=true&w=majority`
   - **Environment**: 
     - ✅ **Production** (필수)
     - ✅ **Preview** (권장)
     - ✅ **Development** (선택)
   - **"Save"** 클릭

4. **MONGODB_DB_NAME 추가** (선택사항)
   - **"Add New"** 버튼 클릭
   - **Key**: `MONGODB_DB_NAME`
   - **Value**: `academy-site`
   - **Environment**: 
     - ✅ **Production**
     - ✅ **Preview**
     - ✅ **Development**
   - **"Save"** 클릭

---

### 4단계: 배포 재시작

환경 변수를 추가한 후 **반드시 재배포**해야 합니다.

#### 방법 A: 자동 재배포 (권장)

1. **최신 커밋 푸시**
   ```bash
   git commit --allow-empty -m "trigger redeploy"
   git push origin main
   ```

2. **Vercel이 자동으로 재배포 시작** (약 2-3분 소요)

#### 방법 B: 수동 재배포

1. **Deployments 탭 클릭**
   - 프로젝트 페이지에서 **"Deployments"** 탭 클릭

2. **최신 배포 재시작**
   - 최신 배포 옆 **"..."** (점 3개) 버튼 클릭
   - **"Redeploy"** 선택
   - **"Redeploy"** 확인

3. **배포 완료 대기**
   - 상태가 "Building" → "Ready"로 변경될 때까지 대기 (약 2-3분)

---

### 5단계: 연결 확인

배포 완료 후 연결 상태를 확인하세요.

#### 방법 1: 관리자 페이지에서 확인

1. **관리자 페이지 접속**
   - https://parplay.co.kr/admin 접속
   - 로그인

2. **공지사항 탭 클릭**
   - 상단 탭에서 **"공지사항"** 클릭

3. **연결 테스트**
   - **"연결 테스트"** 버튼 클릭
   - ✅ 정상 응답 예시:
     ```json
     {
       "success": true,
       "hasMongoUri": true,
       "dbConnected": true,
       "collectionExists": true,
       "newsCount": 0,
       "message": "MongoDB 연결이 정상입니다."
     }
     ```

#### 방법 2: 브라우저에서 직접 확인

브라우저에서 다음 URL 접속:
```
https://parplay.co.kr/api/news/test
```

✅ 정상 응답 예시:
```json
{
  "success": true,
  "hasMongoUri": true,
  "dbConnected": true,
  "collectionExists": true,
  "newsCount": 0,
  "message": "MongoDB 연결이 정상입니다."
}
```

#### 방법 3: 공지사항 작성 테스트

1. **관리자 페이지 → 공지사항 탭**
2. **"새 공지사항 작성"** 버튼 클릭
3. **공지사항 작성**
   - 카테고리: 공지사항
   - 제목: 테스트 공지사항
   - 내용: 테스트 내용
4. **"저장"** 버튼 클릭
5. ✅ 성공 메시지가 표시되고 목록에 나타나야 합니다

---

## ⚠️ 주의사항

### 연결 문자열 형식

**올바른 형식:**
```
mongodb+srv://username:password@cluster.mongodb.net/academy-site?retryWrites=true&w=majority
```

**잘못된 형식:**
```
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```
- ❌ 데이터베이스 이름이 없음 (`/academy-site` 추가 필요)

### 비밀번호에 특수문자가 있는 경우

비밀번호에 `@`, `#`, `%` 등의 특수문자가 있으면 **URL 인코딩**이 필요합니다:

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`

**예시:**
- 원본 비밀번호: `MyP@ss#123`
- 인코딩된 비밀번호: `MyP%40ss%23123`
- 연결 문자열: `mongodb+srv://username:MyP%40ss%23123@cluster.mongodb.net/academy-site?retryWrites=true&w=majority`

### 환경 변수 적용 시간

환경 변수를 추가한 후 **반드시 재배포**해야 적용됩니다. 재배포하지 않으면 변경사항이 반영되지 않습니다.

---

## 🔍 문제 해결

### 여전히 "MongoDB URI가 설정되지 않았습니다" 에러가 발생하는 경우

1. **환경 변수 확인**
   - Vercel 대시보드 → Settings → Environment Variables
   - `MONGODB_URI`가 정확히 입력되어 있는지 확인
   - 오타나 공백이 없는지 확인

2. **재배포 확인**
   - Deployments 탭에서 최신 배포가 환경 변수 추가 이후에 이루어졌는지 확인
   - 최신 배포가 아니라면 재배포 필요

3. **브라우저 캐시 클리어**
   - Ctrl+Shift+R (Windows) 또는 Cmd+Shift+R (Mac)
   - 또는 시크릿 모드에서 테스트

### "MongoDB 연결 실패" 에러가 발생하는 경우

1. **MongoDB Atlas IP 화이트리스트 확인**
   - MongoDB Atlas → Network Access
   - `0.0.0.0/0` (모든 IP 허용) 또는 Vercel IP가 추가되어 있는지 확인

2. **사용자 권한 확인**
   - MongoDB Atlas → Database Access
   - 사용자 권한이 "Atlas admin" 또는 "Read and write to any database"인지 확인

3. **연결 문자열 확인**
   - 사용자 이름과 비밀번호가 정확한지 확인
   - 클러스터 주소가 정확한지 확인
   - 데이터베이스 이름이 올바른지 확인

---

## ✅ 완료 체크리스트

- [ ] MongoDB Atlas에서 연결 문자열 복사
- [ ] 연결 문자열에 데이터베이스 이름 추가 (`/academy-site`)
- [ ] Vercel 대시보드에서 `MONGODB_URI` 환경 변수 추가
- [ ] `MONGODB_DB_NAME` 환경 변수 추가 (선택)
- [ ] 환경 변수에 Production, Preview, Development 모두 체크
- [ ] Vercel 재배포 완료
- [ ] `/api/news/test`에서 연결 확인
- [ ] 공지사항 작성 테스트 성공

---

## 📞 추가 도움이 필요한 경우

문제가 계속되면 다음 정보를 확인해주세요:

1. **브라우저 콘솔 에러 메시지**
   - F12 → Console 탭

2. **API 응답 내용**
   - `https://parplay.co.kr/api/news/test` 응답

3. **Vercel 배포 로그**
   - Vercel 대시보드 → Deployments → 최신 배포 → Logs

4. **MongoDB Atlas 연결 상태**
   - MongoDB Atlas → Database → 클러스터 상태






