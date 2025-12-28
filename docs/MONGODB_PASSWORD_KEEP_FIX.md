# MongoDB 비밀번호 유지 및 인증 실패 해결

## 현재 상황

- **비밀번호:** `hkjtop!@34` (유지)
- **에러:** `bad auth : authentication failed`
- **원인:** 연결 문자열에서 비밀번호 인코딩 문제

---

## 해결 방법: 비밀번호 인코딩만 수정

비밀번호를 변경하지 않고, 연결 문자열에서 `@`를 `%40`으로 인코딩하면 됩니다.

---

## Step 1: MongoDB Atlas 사용자 비밀번호 확인

### 1-1. MongoDB Atlas 접속

1. **https://cloud.mongodb.com 접속**
2. **로그인**

### 1-2. Database Access 확인

1. **Security → Database Access 클릭**
2. **`academy-admin` 사용자 찾기**

### 1-3. 비밀번호 확인/설정

**비밀번호가 `hkjtop!@34`인지 확인:**

1. **사용자 옆 "..." 메뉴 → "Edit" 클릭**
2. **비밀번호 확인**
3. **비밀번호가 다르다면:**
   - "Edit Password" 클릭
   - 새 비밀번호: `hkjtop!@34` 입력
   - "Update User" 클릭

**⚠️ 중요:** MongoDB Atlas의 비밀번호가 정확히 `hkjtop!@34`인지 확인하세요!

---

## Step 2: 연결 문자열 준비

### 2-1. 비밀번호 인코딩

**비밀번호:** `hkjtop!@34`

**인코딩 규칙:**
- `@` → `%40`
- `!` → (일반적으로 인코딩 불필요)

**인코딩된 비밀번호:** `hkjtop!%4034`

### 2-2. 연결 문자열 구성

**기본 형식:**
```
mongodb+srv://[사용자이름]:[인코딩된비밀번호]@[클러스터주소]/[데이터베이스이름]?[옵션]
```

**최종 연결 문자열:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

**구성 요소:**
- 사용자 이름: `academy-admin`
- 비밀번호: `hkjtop!%4034` (`@` → `%40` 인코딩)
- 클러스터: `academy-cluster.eekhbti.mongodb.net`
- 데이터베이스: `/academy-site`
- 옵션: `?retryWrites=true&w=majority`

---

## Step 3: Vercel 환경 변수 수정

### 3-1. Vercel 대시보드 접속

1. **https://vercel.com 접속**
2. **로그인**
3. **프로젝트 선택** (`academy-site`)

### 3-2. MONGODB_URI 수정

1. **Settings → Environment Variables 클릭**
2. **`MONGODB_URI` 찾기**
3. **"..." 메뉴 → "Edit" 클릭** (또는 변수 클릭)

4. **Value 수정:**
   
   **현재 값 확인:**
   - 비밀번호 부분이 `hkjtop!@34`로 되어 있다면 → ❌ 잘못됨
   - 비밀번호 부분이 `hkjtop!%4034`로 되어 있다면 → ✅ 올바름
   
   **올바른 값으로 수정:**
   ```
   mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
   
   **⚠️ 중요:**
   - `@`가 `%40`으로 인코딩되어 있는지 확인
   - 사용자 이름: `academy-admin`
   - 데이터베이스 이름: `/academy-site` 포함

5. **"Save" 클릭**

### 3-3. 환경 변수 확인

**설정된 환경 변수 목록:**
- ✅ `MONGODB_URI` - 연결 문자열 (방금 수정)
- ✅ `MONGODB_DB_NAME` - `academy-site`
- ✅ `NEXT_PUBLIC_SITE_URL`
- ✅ `NEXT_PUBLIC_PORTONE_STORE_ID`
- ✅ `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`
- ✅ `NEXT_PUBLIC_ADMIN_PASSWORD` - `hkjtop!@34` (결제 시스템용)

---

## Step 4: 재배포 (필수!)

환경 변수를 수정한 후 **반드시 재배포**해야 합니다!

### 4-1. Vercel에서 재배포

1. **Deployments 탭 클릭**
2. **최신 배포 찾기**
3. **배포 카드 오른쪽 상단의 "..." 버튼 클릭**
4. **"Redeploy" 선택**
5. **"Redeploy" 확인 클릭**
6. **배포 완료 대기 (약 2-3분)**

**배포 상태 확인:**
- "Building" → "Ready"로 변경되면 완료

---

## Step 5: 연결 테스트

### 5-1. API 테스트

배포 완료 후 (2-3분 대기):

**브라우저에서 접속:**
```
https://parplay.co.kr/api/news/test
```

**정상 응답:**
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

**여전히 에러가 발생하는 경우:**
- [문제 해결](#문제-해결) 섹션 참고

### 5-2. 관리자 페이지에서 확인

1. **https://parplay.co.kr/admin 접속**
2. **공지사항 탭 클릭**
3. **"연결 테스트" 버튼 클릭**
4. **정상 응답 확인**

### 5-3. 공지사항 작성 테스트

1. **"새 공지사항 작성" 클릭**
2. **테스트 공지사항 작성**
3. **"저장" 클릭**
4. **✅ 성공 메시지 확인**

---

## 문제 해결

### 여전히 "bad auth" 에러가 발생하는 경우

#### 확인 사항 1: 비밀번호 인코딩

**Vercel의 MONGODB_URI 값 확인:**

1. **Vercel → Settings → Environment Variables**
2. **`MONGODB_URI` 클릭 (눈 아이콘으로 값 확인)**
3. **비밀번호 부분 확인:**
   - `hkjtop!@34` → ❌ 잘못됨 (`@`가 인코딩되지 않음)
   - `hkjtop!%4034` → ✅ 올바름 (`@`가 `%40`으로 인코딩됨)

**수정 방법:**
- `@`를 `%40`으로 교체
- 전체 연결 문자열 다시 확인

#### 확인 사항 2: MongoDB Atlas 비밀번호

**MongoDB Atlas의 실제 비밀번호 확인:**

1. **MongoDB Atlas → Security → Database Access**
2. **`academy-admin` 사용자 확인**
3. **비밀번호가 정확히 `hkjtop!@34`인지 확인**

**비밀번호가 다르다면:**
- "Edit" → "Edit Password"
- 비밀번호를 `hkjtop!@34`로 설정
- "Update User"

#### 확인 사항 3: 연결 문자열 형식

**올바른 형식 체크리스트:**

- [ ] `mongodb+srv://`로 시작
- [ ] 사용자 이름: `academy-admin`
- [ ] 비밀번호: `hkjtop!%4034` (`@` → `%40`)
- [ ] `@` 기호가 비밀번호와 호스트 사이에 있음
- [ ] 클러스터 주소: `academy-cluster.eekhbti.mongodb.net`
- [ ] 데이터베이스 이름: `/academy-site` 포함
- [ ] 옵션: `?retryWrites=true&w=majority`

#### 확인 사항 4: 재배포 확인

1. **Deployments 탭에서 최신 배포 확인**
2. **환경 변수 수정 이후에 배포되었는지 확인**
3. **최신 배포가 아니라면 다시 재배포**

---

## 최종 확인

### 올바른 연결 문자열:

```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

### 핵심 포인트:

1. **비밀번호:** `hkjtop!@34` (MongoDB Atlas)
2. **인코딩:** `hkjtop!%4034` (연결 문자열에서)
3. **데이터베이스:** `/academy-site` 포함
4. **재배포:** 필수!

---

## 체크리스트

### MongoDB Atlas:
- [ ] 사용자: `academy-admin`
- [ ] 비밀번호: `hkjtop!@34` (확인 완료)
- [ ] 사용자 권한: "Atlas admin"
- [ ] Network Access: `0.0.0.0/0` 설정됨

### Vercel 연결 문자열:
- [ ] 사용자 이름: `academy-admin`
- [ ] 비밀번호: `hkjtop!%4034` (`@` → `%40` 인코딩)
- [ ] 데이터베이스 이름: `/academy-site` 포함
- [ ] 재배포 완료

### 테스트:
- [ ] `/api/news/test`에서 연결 확인 완료
- [ ] 공지사항 작성 테스트 성공

---

## 요약

**비밀번호 유지하면서 해결하는 방법:**

1. ✅ MongoDB Atlas 비밀번호: `hkjtop!@34` (그대로 유지)
2. ✅ Vercel 연결 문자열: `hkjtop!%4034` (`@` → `%40` 인코딩)
3. ✅ 데이터베이스 이름: `/academy-site` 포함
4. ✅ 재배포 완료

**가장 중요한 것:**
- MongoDB Atlas의 비밀번호: `hkjtop!@34`
- Vercel 연결 문자열의 비밀번호: `hkjtop!%4034` (인코딩됨)
- 둘 다 같은 비밀번호지만, 연결 문자열에서는 `@`를 `%40`으로 인코딩해야 함



