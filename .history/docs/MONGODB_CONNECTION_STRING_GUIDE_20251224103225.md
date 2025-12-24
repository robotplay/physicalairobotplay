# MongoDB Atlas 연결 문자열 가져오기 상세 가이드

## 📋 목차

1. [MongoDB Atlas 대시보드 접속](#1-mongodb-atlas-대시보드-접속)
2. [클러스터 찾기](#2-클러스터-찾기)
3. [Connect 버튼 클릭](#3-connect-버튼-클릭)
4. [연결 방법 선택](#4-연결-방법-선택)
5. [연결 문자열 복사](#5-연결-문자열-복사)
6. [데이터베이스 이름 추가](#6-데이터베이스-이름-추가)
7. [최종 확인](#7-최종-확인)

---

## 1. MongoDB Atlas 대시보드 접속

### Step 1-1: 웹사이트 접속

1. 브라우저에서 다음 주소로 접속:
   ```
   https://cloud.mongodb.com
   ```

2. **로그인**
   - 이미 계정이 있다면 이메일/비밀번호로 로그인
   - 계정이 없다면 "Sign Up" 또는 "Register" 클릭하여 무료 계정 생성

### Step 1-2: 대시보드 확인

로그인 후 MongoDB Atlas 대시보드가 표시됩니다.

**화면 구성:**
- 왼쪽: 메뉴 (Database, Security, Deployment 등)
- 중앙: 클러스터 목록 또는 대시보드
- 오른쪽: 알림 및 설정

---

## 2. 클러스터 찾기

### Step 2-1: Database 메뉴 클릭

1. **왼쪽 메뉴에서 "Database" 클릭**
   - 또는 상단 메뉴에서 "Database" 선택
   - 클러스터 목록이 표시됩니다

### Step 2-2: 클러스터 확인

**클러스터 카드 구성:**
- 클러스터 이름 (예: `Cluster0`, `academy-cluster`)
- 상태 표시 (녹색 점 = 정상)
- 리전 정보 (예: `AWS / ap-northeast-2`)
- 클러스터 타입 (예: `M0 FREE`)

**참고:**
- 클러스터가 없다면 "Build a Database" 버튼을 클릭하여 새 클러스터 생성
- 여러 클러스터가 있다면 연결하려는 클러스터를 찾으세요

---

## 3. Connect 버튼 클릭

### Step 3-1: Connect 버튼 위치 찾기

클러스터 카드에서 **"Connect"** 버튼을 찾습니다.

**위치:**
- 클러스터 카드 오른쪽 상단 또는 하단
- 또는 클러스터 이름 옆에 있는 버튼

### Step 3-2: Connect 버튼 클릭

**"Connect"** 버튼을 클릭하면 연결 방법 선택 창이 열립니다.

---

## 4. 연결 방법 선택

### Step 4-1: 연결 방법 옵션 확인

다음과 같은 연결 방법 옵션이 표시됩니다:

1. **"Connect your application"** (애플리케이션 연결) ← **이것을 선택!**
2. "Connect using MongoDB Compass" (MongoDB Compass로 연결)
3. "Connect using VS Code" (VS Code로 연결)
4. "Connect using a MongoDB driver" (드라이버로 연결)

### Step 4-2: "Connect your application" 선택

**"Connect your application"** 옵션을 클릭합니다.

**이유:**
- Next.js 애플리케이션에서 사용할 연결 문자열을 가져오기 위함
- 다른 옵션들은 개발 도구용이므로 선택하지 않습니다

---

## 5. 연결 문자열 복사

### Step 5-1: 드라이버 및 버전 선택

**"Connect your application"** 선택 후 다음 화면이 표시됩니다:

**설정 항목:**
1. **Driver (드라이버)**
   - 드롭다운에서 **"Node.js"** 선택

2. **Version (버전)**
   - 드롭다운에서 **"5.5 or later"** 또는 **최신 버전** 선택

### Step 5-2: 연결 문자열 확인

드라이버 선택 후 연결 문자열이 표시됩니다.

**연결 문자열 형식:**
```
mongodb+srv://<username>:<password>@<cluster-name>.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**예시:**
```
mongodb+srv://academy-admin:Academy2025@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 5-3: 연결 문자열 복사

**방법 1: 복사 버튼 사용 (권장)**
- 연결 문자열 옆에 있는 **"Copy"** 버튼 클릭
- 또는 연결 문자열을 드래그하여 선택 후 `Ctrl+C` (Windows) / `Cmd+C` (Mac)

**방법 2: 수동 복사**
- 연결 문자열 전체를 마우스로 드래그하여 선택
- `Ctrl+C` (Windows) / `Cmd+C` (Mac)로 복사

**⚠️ 주의사항:**
- `<username>`과 `<password>` 부분이 실제 값으로 표시되어야 합니다
- `@` 기호 앞의 `<username>:<password>` 부분을 확인하세요
- 연결 문자열 전체를 정확히 복사해야 합니다

---

## 6. 데이터베이스 이름 추가

### Step 6-1: 복사한 연결 문자열 확인

복사한 연결 문자열을 텍스트 에디터에 붙여넣어 확인합니다.

**복사한 형식 (데이터베이스 이름 없음):**
```
mongodb+srv://academy-admin:Academy2025@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**문제점:**
- `/?` 부분이 데이터베이스 이름 없이 바로 쿼리 파라미터로 연결됨
- 우리는 `academy-site` 데이터베이스를 사용해야 함

### Step 6-2: 데이터베이스 이름 추가

**변경 전:**
```
mongodb+srv://academy-admin:Academy2025@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**변경 후:**
```
mongodb+srv://academy-admin:Academy2025@cluster0.xxxxx.mongodb.net/academy-site?retryWrites=true&w=majority
```

**변경 방법:**
1. `/?` 부분을 찾습니다
2. `/?`를 `/academy-site?`로 변경합니다
   - 슬래시(`/`) 뒤에 `academy-site` 추가
   - 물음표(`?`)는 그대로 유지

**시각적 설명:**
```
변경 전: ...mongodb.net/?retryWrites...
변경 후: ...mongodb.net/academy-site?retryWrites...
         └─────────┘ └─────────┘
         클러스터 주소   데이터베이스 이름
```

### Step 6-3: 최종 연결 문자열 확인

**올바른 형식:**
```
mongodb+srv://username:password@cluster.mongodb.net/academy-site?retryWrites=true&w=majority
```

**구성 요소:**
- `mongodb+srv://` - 프로토콜 (MongoDB Atlas용)
- `username:password` - 데이터베이스 사용자 인증 정보
- `@` - 인증 정보와 호스트 구분자
- `cluster.mongodb.net` - 클러스터 호스트 주소
- `/academy-site` - **데이터베이스 이름** (추가한 부분)
- `?retryWrites=true&w=majority` - 연결 옵션

---

## 7. 최종 확인

### Step 7-1: 연결 문자열 검증

**체크리스트:**
- [ ] `mongodb+srv://`로 시작하는가?
- [ ] `username:password@` 부분이 실제 값으로 되어 있는가?
- [ ] 클러스터 주소가 올바른가?
- [ ] `/academy-site`가 포함되어 있는가?
- [ ] `?retryWrites=true&w=majority`가 끝에 있는가?

### Step 7-2: 예시 비교

**❌ 잘못된 예시:**
```
mongodb+srv://academy-admin:Academy2025@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
- 데이터베이스 이름이 없음 (`/?`)

**✅ 올바른 예시:**
```
mongodb+srv://academy-admin:Academy2025@cluster0.xxxxx.mongodb.net/academy-site?retryWrites=true&w=majority
```
- 데이터베이스 이름 포함 (`/academy-site?`)

---

## 🔍 문제 해결

### 문제 1: 연결 문자열에 `<username>` 또는 `<password>`가 그대로 표시됨

**원인:** MongoDB Atlas에서 사용자 정보가 자동으로 치환되지 않음

**해결:**
1. "Database Access" 메뉴로 이동
2. 사용자 이름과 비밀번호 확인
3. 연결 문자열에서 `<username>`과 `<password>`를 실제 값으로 교체

**예시:**
```
변경 전: mongodb+srv://<username>:<password>@cluster.mongodb.net/academy-site?...
변경 후: mongodb+srv://academy-admin:Academy2025@cluster.mongodb.net/academy-site?...
```

### 문제 2: 비밀번호에 특수문자가 있어 연결이 안 됨

**원인:** URL에서 특수문자가 예약 문자로 인식됨

**해결:** URL 인코딩 필요

**인코딩 규칙:**
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `=` → `%3D`

**예시:**
- 원본 비밀번호: `MyP@ss#123`
- 인코딩된 비밀번호: `MyP%40ss%23123`
- 연결 문자열: `mongodb+srv://username:MyP%40ss%23123@cluster.mongodb.net/academy-site?retryWrites=true&w=majority`

**온라인 도구 사용:**
- https://www.urlencoder.org/ 에서 비밀번호만 인코딩 가능

### 문제 3: 클러스터가 보이지 않음

**원인:** 클러스터가 생성되지 않았거나 다른 조직/프로젝트에 있음

**해결:**
1. 왼쪽 상단에서 프로젝트/조직 확인
2. "Build a Database" 버튼 클릭하여 새 클러스터 생성
3. 클러스터 생성 완료 대기 (3-5분)

### 문제 4: Connect 버튼이 비활성화됨

**원인:** 클러스터가 아직 생성 중이거나 오류 상태

**해결:**
1. 클러스터 상태 확인 (녹색 점 = 정상)
2. 클러스터 생성 완료 대기
3. 페이지 새로고침 (F5)

---

## 📝 요약

### 빠른 참조

**연결 문자열 가져오기:**
1. https://cloud.mongodb.com 접속
2. Database → 클러스터 선택
3. Connect → "Connect your application"
4. Node.js 선택 → 연결 문자열 복사
5. `/?` → `/academy-site?`로 변경

**최종 연결 문자열 형식:**
```
mongodb+srv://username:password@cluster.mongodb.net/academy-site?retryWrites=true&w=majority
```

---

## ✅ 다음 단계

연결 문자열을 가져왔다면:

1. **Vercel 환경 변수에 추가**
   - Vercel 대시보드 → Settings → Environment Variables
   - Key: `MONGODB_URI`
   - Value: 위에서 준비한 연결 문자열
   - Environment: 모두 체크

2. **재배포**
   - Deployments 탭 → 최신 배포 → Redeploy

3. **연결 확인**
   - https://parplay.co.kr/api/news/test 접속
   - `"success": true` 확인

---

## 📚 관련 문서

- 전체 설정 가이드: `/docs/VERCEL_MONGODB_FIX.md`
- 환경 변수 체크리스트: `/docs/ENV_VARS_CHECKLIST.md`
- MongoDB Atlas 설정: `/docs/MONGODB_SETUP.md`
