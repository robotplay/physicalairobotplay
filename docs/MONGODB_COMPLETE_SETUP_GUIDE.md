# MongoDB 연결 완전 해결 가이드 (처음부터 끝까지)

## 📋 목차

1. [현재 문제 확인](#1-현재-문제-확인)
2. [MongoDB Atlas 계정 준비](#2-mongodb-atlas-계정-준비)
3. [MongoDB Atlas 클러스터 설정](#3-mongodb-atlas-클러스터-설정)
4. [연결 문자열 가져오기](#4-연결-문자열-가져오기)
5. [Vercel 환경 변수 설정](#5-vercel-환경-변수-설정)
6. [재배포 및 확인](#6-재배포-및-확인)
7. [문제 해결](#7-문제-해결)

---

## 1. 현재 문제 확인

### Step 1-1: 문제 진단

공지사항이 작동하지 않는 이유는 **MongoDB 연결이 안 되기 때문**입니다.

**확인 방법:**

1. **브라우저에서 테스트**
   - https://parplay.co.kr/api/news/test 접속
   - 에러 메시지 확인

2. **관리자 페이지에서 확인**
   - https://parplay.co.kr/admin 접속
   - 공지사항 탭 → "연결 테스트" 버튼 클릭
   - 에러 메시지 확인

**예상되는 에러:**
```json
{
  "success": false,
  "error": "MongoDB URI가 설정되지 않았습니다.",
  "hasMongoUri": false,
  "message": "Vercel 환경 변수에 MONGODB_URI를 설정해주세요."
}
```

---

## 2. MongoDB Atlas 계정 준비

### Step 2-1: 계정이 있는 경우

1. https://cloud.mongodb.com 접속
2. 로그인
3. [3단계: MongoDB Atlas 클러스터 설정](#3-mongodb-atlas-클러스터-설정)로 이동

### Step 2-2: 계정이 없는 경우

#### 2-2-1. 계정 생성

1. **MongoDB Atlas 가입**
   - https://www.mongodb.com/cloud/atlas/register 접속
   - "Try Free" 또는 "Sign Up" 클릭

2. **정보 입력**
   - 이메일 주소 입력
   - 비밀번호 설정
   - 이름 입력
   - 회사명 (선택)
   - 약관 동의

3. **이메일 인증**
   - 이메일로 전송된 인증 링크 클릭
   - 인증 완료

#### 2-2-2. 초기 설정

1. **배포 타입 선택**
   - "Build a Database" 클릭
   - 또는 "Get started free" 클릭

2. **클러스터 타입 선택**
   - "M0 FREE" 선택 (무료 티어)
   - "Create" 클릭

---

## 3. MongoDB Atlas 클러스터 설정

### Step 3-1: 클러스터 생성 (계정이 없는 경우)

#### 3-1-1. 클라우드 제공자 및 리전 선택

1. **Cloud Provider 선택**
   - AWS, Google Cloud, Azure 중 선택
   - AWS 권장 (한국 리전: ap-northeast-2)

2. **Region 선택**
   - "Seoul (ap-northeast-2)" 또는 가장 가까운 리전 선택

3. **Cluster Tier 선택**
   - "M0 FREE" 선택 (무료)

4. **Cluster Name 입력**
   - 예: `academy-cluster`
   - 또는 기본값 `Cluster0` 사용

5. **"Create Cluster" 클릭**
   - 클러스터 생성 시작 (약 3-5분 소요)
   - "Your cluster is being created" 메시지 확인

#### 3-1-2. 클러스터 생성 완료 대기

- 진행 상황이 화면에 표시됨
- "Your cluster is ready!" 메시지가 나타날 때까지 대기

### Step 3-2: 데이터베이스 사용자 생성

**⚠️ 중요: 이 단계는 반드시 필요합니다!**

#### 3-2-1. Database Access 메뉴로 이동

1. **왼쪽 메뉴에서 "Security" 클릭**
2. **"Database Access" 클릭**
3. **"Add New Database User" 버튼 클릭**

#### 3-2-2. 사용자 정보 입력

1. **Authentication Method 선택**
   - "Password" 선택 (권장)

2. **Username 입력**
   - 예: `academy-admin`
   - 또는 원하는 사용자 이름

3. **Password 설정**
   - "Autogenerate Secure Password" 클릭 (권장)
   - 또는 직접 비밀번호 입력
   - ⚠️ **비밀번호를 반드시 기록해두세요!** (나중에 필요합니다)

4. **Database User Privileges 선택**
   - "Atlas admin" 선택 (권장)
   - 또는 "Read and write to any database" 선택

5. **"Add User" 버튼 클릭**
   - 사용자 생성 완료

**⚠️ 중요:**
- 사용자 이름과 비밀번호를 안전한 곳에 기록해두세요
- 비밀번호는 나중에 다시 볼 수 없습니다!

### Step 3-3: 네트워크 액세스 설정

**⚠️ 중요: 이 단계를 건너뛰면 연결이 안 됩니다!**

#### 3-3-1. Network Access 메뉴로 이동

1. **왼쪽 메뉴에서 "Security" 클릭**
2. **"Network Access" 클릭**
3. **"Add IP Address" 버튼 클릭**

#### 3-3-2. IP 주소 추가

**방법 1: 모든 IP 허용 (개발/테스트용, 권장)**

1. **"Allow Access from Anywhere" 버튼 클릭**
   - 또는 IP 주소에 `0.0.0.0/0` 입력

2. **"Confirm" 버튼 클릭**

**방법 2: 특정 IP만 허용 (프로덕션용)**

1. **현재 IP 주소 확인**
   - "Add Current IP Address" 버튼 클릭
   - 또는 IP 주소를 직접 입력

2. **"Confirm" 버튼 클릭**

**⚠️ 참고:**
- 개발/테스트 단계에서는 "Allow Access from Anywhere"를 권장합니다
- 프로덕션에서는 보안을 위해 특정 IP만 허용하는 것이 좋습니다
- Vercel은 동적 IP를 사용하므로, 프로덕션에서는 `0.0.0.0/0`을 사용해야 할 수 있습니다

---

## 4. 연결 문자열 가져오기

### Step 4-1: Database 메뉴로 이동

1. **왼쪽 메뉴에서 "Database" 클릭**
2. **클러스터 카드 확인**
   - 클러스터 이름 확인
   - 상태가 "Running"인지 확인 (녹색 점)

### Step 4-2: Connect 버튼 클릭

1. **클러스터 카드에서 "Connect" 버튼 클릭**
   - 클러스터 카드 오른쪽 상단 또는 하단에 있음

2. **연결 방법 선택 창이 열림**

### Step 4-3: 연결 방법 선택

1. **"Connect your application" 선택**
   - 다른 옵션 (Compass, VS Code 등)은 선택하지 않음

2. **다음 화면으로 이동**

### Step 4-4: 드라이버 선택

1. **Driver 선택**
   - 드롭다운에서 **"Node.js"** 선택

2. **Version 선택**
   - 드롭다운에서 **"5.5 or later"** 또는 최신 버전 선택

3. **연결 문자열 확인**
   - 연결 문자열이 자동으로 생성되어 표시됨

### Step 4-5: 연결 문자열 복사

**연결 문자열 예시:**
```
mongodb+srv://academy-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**복사 방법:**
1. **"Copy" 버튼 클릭** (권장)
2. 또는 연결 문자열을 드래그하여 선택 후 `Ctrl+C` (Windows) / `Cmd+C` (Mac)

**⚠️ 주의:**
- `<password>` 부분이 실제 비밀번호로 표시되어야 합니다
- 그렇지 않다면 [Step 4-6: 비밀번호 교체](#step-4-6-비밀번호-교체) 참고

### Step 4-6: 비밀번호 교체 (필요한 경우)

연결 문자열에 `<password>`가 그대로 표시되는 경우:

1. **복사한 연결 문자열 확인**
   ```
   mongodb+srv://academy-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

2. **`<password>`를 실제 비밀번호로 교체**
   - [Step 3-2-2](#3-2-2-사용자-정보-입력)에서 기록한 비밀번호 사용
   - 예: `mongodb+srv://academy-admin:MyPassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

3. **비밀번호에 특수문자가 있는 경우 URL 인코딩**
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - 예: 비밀번호가 `hkjtop!@34`인 경우 → `hkjtop!%4034`

### Step 4-7: 데이터베이스 이름 추가

**⚠️ 중요: 이 단계를 건너뛰면 데이터베이스 연결이 안 됩니다!**

**현재 연결 문자열:**
```
mongodb+srv://academy-admin:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
                                                                    ↑
                                                              여기에 데이터베이스 이름이 없음
```

**수정 방법:**
- `/?` 부분을 `/academy-site?`로 변경

**수정된 연결 문자열:**
```
mongodb+srv://academy-admin:password@cluster0.xxxxx.mongodb.net/academy-site?retryWrites=true&w=majority
                                                                    └──────────┘
                                                                    데이터베이스 이름 추가
```

**시각적 설명:**
```
변경 전: ...mongodb.net/?retryWrites...
변경 후: ...mongodb.net/academy-site?retryWrites...
```

### Step 4-8: 최종 연결 문자열 확인

**올바른 연결 문자열 형식:**
```
mongodb+srv://username:password@cluster.mongodb.net/academy-site?retryWrites=true&w=majority
```

**체크리스트:**
- [ ] `mongodb+srv://`로 시작
- [ ] `username:password@` 부분이 실제 값으로 되어 있음
- [ ] 비밀번호에 특수문자가 있으면 URL 인코딩됨 (`@` → `%40`)
- [ ] 클러스터 주소가 올바름
- [ ] `/academy-site`가 포함되어 있음 (중요!)
- [ ] `?retryWrites=true&w=majority`가 끝에 있음

**예시 (비밀번호에 특수문자가 있는 경우):**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

---

## 5. Vercel 환경 변수 설정

### Step 5-1: Vercel 대시보드 접속

1. **브라우저에서 https://vercel.com 접속**
2. **로그인**
3. **프로젝트 선택**
   - `academy-site` 또는 해당 프로젝트 클릭

### Step 5-2: Settings 메뉴로 이동

1. **프로젝트 페이지 상단의 "Settings" 탭 클릭**
2. **왼쪽 메뉴에서 "Environment Variables" 클릭**

### Step 5-3: MONGODB_URI 추가

1. **"Add New" 버튼 클릭**

2. **Key 입력**
   - `MONGODB_URI` 입력
   - ⚠️ 대소문자 정확히 입력 (대문자)

3. **Value 입력**
   - [Step 4-8](#step-4-8-최종-연결-문자열-확인)에서 준비한 연결 문자열 붙여넣기
   - 예: `mongodb+srv://academy-admin:password@cluster0.xxxxx.mongodb.net/academy-site?retryWrites=true&w=majority`

4. **Environment 선택**
   - ✅ **Production** (필수!)
   - ✅ **Preview** (권장)
   - ✅ **Development** (선택)

5. **"Save" 버튼 클릭**
   - 환경 변수가 목록에 추가됨

### Step 5-4: MONGODB_DB_NAME 추가 (선택, 권장)

1. **"Add New" 버튼 클릭**

2. **Key 입력**
   - `MONGODB_DB_NAME` 입력

3. **Value 입력**
   - `academy-site` 입력

4. **Environment 선택**
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**

5. **"Save" 버튼 클릭**

### Step 5-5: 환경 변수 확인

**설정된 환경 변수 목록 확인:**

- ✅ `MONGODB_URI` - MongoDB 연결 문자열
- ✅ `MONGODB_DB_NAME` - 데이터베이스 이름 (선택)
- ✅ `NEXT_PUBLIC_SITE_URL` - 사이트 URL
- ✅ `NEXT_PUBLIC_PORTONE_STORE_ID` - 포트원 Store ID
- ✅ `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` - 포트원 Channel Key
- ✅ `NEXT_PUBLIC_ADMIN_PASSWORD` - 관리자 비밀번호

**⚠️ 중요:**
- `MONGODB_URI`가 반드시 있어야 합니다
- 각 환경 변수의 "Production" 체크박스가 체크되어 있는지 확인

---

## 6. 재배포 및 확인

### Step 6-1: 재배포 (필수!)

**⚠️ 중요: 환경 변수를 추가한 후 반드시 재배포해야 합니다!**

#### 방법 1: Vercel 대시보드에서 수동 재배포 (권장)

1. **프로젝트 페이지에서 "Deployments" 탭 클릭**

2. **최신 배포 찾기**
   - 가장 위에 있는 배포 (최신)

3. **재배포 시작**
   - 배포 카드 오른쪽 상단의 **"..."** (점 3개) 버튼 클릭
   - **"Redeploy"** 선택
   - 확인 창에서 **"Redeploy"** 클릭

4. **배포 상태 확인**
   - 상태가 "Building" → "Ready"로 변경될 때까지 대기
   - 약 2-3분 소요

#### 방법 2: Git 푸시로 자동 재배포

```bash
git commit --allow-empty -m "trigger redeploy for MongoDB env vars"
git push origin main
```

- Vercel이 자동으로 변경사항을 감지하고 재배포 시작

### Step 6-2: 연결 테스트

**배포 완료 후 (2-3분 대기):**

#### 방법 1: API 테스트 엔드포인트

1. **브라우저에서 다음 URL 접속:**
   ```
   https://parplay.co.kr/api/news/test
   ```

2. **정상 응답 확인:**
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

3. **에러가 발생하는 경우:**
   - [7. 문제 해결](#7-문제-해결) 참고

#### 방법 2: 관리자 페이지에서 확인

1. **관리자 페이지 접속**
   - https://parplay.co.kr/admin 접속
   - 로그인

2. **공지사항 탭 클릭**
   - 상단 탭에서 "공지사항" 클릭

3. **연결 테스트**
   - "연결 테스트" 버튼 클릭
   - 정상 응답 확인

4. **공지사항 작성 테스트**
   - "새 공지사항 작성" 버튼 클릭
   - 테스트 공지사항 작성
   - 제목: "테스트 공지사항"
   - 내용: "테스트 내용입니다"
   - "저장" 버튼 클릭
   - ✅ 성공 메시지 확인
   - 목록에 공지사항이 나타나는지 확인

---

## 7. 문제 해결

### 문제 1: "MongoDB URI가 설정되지 않았습니다" 에러

**원인:** Vercel에 `MONGODB_URI` 환경 변수가 설정되지 않음

**해결:**
1. Vercel 대시보드 → Settings → Environment Variables 확인
2. `MONGODB_URI`가 있는지 확인
3. 없으면 [Step 5-3](#step-5-3-mongodb_uri-추가) 참고하여 추가
4. 재배포 확인

### 문제 2: "MongoDB 연결 실패" 에러

**원인 1: 네트워크 액세스 설정 문제**

**해결:**
1. MongoDB Atlas → Network Access 확인
2. `0.0.0.0/0` 또는 현재 IP가 추가되어 있는지 확인
3. 없으면 [Step 3-3](#step-3-3-네트워크-액세스-설정) 참고하여 추가

**원인 2: 사용자 권한 문제**

**해결:**
1. MongoDB Atlas → Database Access 확인
2. 사용자 권한이 "Atlas admin" 또는 "Read and write to any database"인지 확인
3. 권한이 없으면 사용자 수정 또는 새 사용자 생성

**원인 3: 연결 문자열 오류**

**해결:**
1. 연결 문자열 형식 확인
   - `mongodb+srv://`로 시작하는지
   - 데이터베이스 이름이 포함되어 있는지 (`/academy-site`)
   - 비밀번호에 특수문자가 있으면 URL 인코딩되었는지
2. [Step 4-8](#step-4-8-최종-연결-문자열-확인) 참고하여 재확인

### 문제 3: 재배포 후에도 에러가 발생

**원인:** 환경 변수가 제대로 적용되지 않음

**해결:**
1. **환경 변수 확인**
   - Vercel 대시보드 → Settings → Environment Variables
   - `MONGODB_URI`의 "Production" 체크박스가 체크되어 있는지 확인

2. **재배포 확인**
   - Deployments 탭에서 최신 배포가 환경 변수 추가 이후에 이루어졌는지 확인
   - 최신 배포가 아니라면 다시 재배포

3. **브라우저 캐시 클리어**
   - `Ctrl+Shift+R` (Windows) 또는 `Cmd+Shift+R` (Mac)
   - 또는 시크릿 모드에서 테스트

### 문제 4: 공지사항 작성은 되지만 목록에 나타나지 않음

**원인:** 페이지 새로고침 문제 또는 데이터베이스 연결 문제

**해결:**
1. 페이지 새로고침 (F5)
2. 브라우저 개발자 도구 → Console 탭에서 에러 확인
3. MongoDB Atlas → Database → Browse Collections에서 데이터 확인
   - `academy-site` → `news` 컬렉션 확인

### 문제 5: 비밀번호에 특수문자가 있어 연결이 안 됨

**원인:** URL 인코딩이 안 됨

**해결:**
1. 비밀번호의 특수문자를 URL 인코딩
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
2. 연결 문자열에서 비밀번호 부분만 교체
3. Vercel 환경 변수 업데이트
4. 재배포

---

## ✅ 완료 체크리스트

전체 과정을 완료했는지 확인하세요:

### MongoDB Atlas 설정
- [ ] MongoDB Atlas 계정 생성 완료
- [ ] 클러스터 생성 완료 (상태: Running)
- [ ] 데이터베이스 사용자 생성 완료
- [ ] 네트워크 액세스 설정 완료 (0.0.0.0/0 또는 특정 IP)
- [ ] 연결 문자열 가져오기 완료
- [ ] 데이터베이스 이름 추가 완료 (`/academy-site`)
- [ ] 비밀번호 URL 인코딩 완료 (필요한 경우)

### Vercel 설정
- [ ] Vercel 대시보드 접속 완료
- [ ] `MONGODB_URI` 환경 변수 추가 완료
- [ ] `MONGODB_DB_NAME` 환경 변수 추가 완료 (선택)
- [ ] 환경 변수의 "Production" 체크박스 체크 완료
- [ ] 재배포 완료

### 테스트
- [ ] `/api/news/test` 접속하여 연결 확인 완료
- [ ] 관리자 페이지에서 "연결 테스트" 성공
- [ ] 공지사항 작성 테스트 성공
- [ ] 공지사항 목록에 표시되는지 확인 완료

---

## 📞 추가 도움이 필요한 경우

문제가 계속되면 다음 정보를 확인해주세요:

1. **에러 메시지**
   - 브라우저 콘솔 (F12 → Console)
   - `/api/news/test` 응답

2. **환경 변수 상태**
   - Vercel 대시보드 → Settings → Environment Variables 스크린샷

3. **MongoDB Atlas 설정**
   - Network Access 설정 스크린샷
   - Database Access 사용자 목록 스크린샷

4. **배포 로그**
   - Vercel 대시보드 → Deployments → 최신 배포 → Logs

---

## 📚 관련 문서

- 연결 문자열 가져오기: `/docs/MONGODB_CONNECTION_STRING_GUIDE.md`
- 비밀번호 인코딩: `/docs/MONGODB_PASSWORD_ENCODING.md`
- 환경 변수 체크리스트: `/docs/ENV_VARS_CHECKLIST.md`
- Vercel MongoDB 수정: `/docs/VERCEL_MONGODB_FIX.md`
