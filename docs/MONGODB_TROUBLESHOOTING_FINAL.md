# MongoDB 연결 문제 최종 진단 가이드

## 현재 설정 확인

환경 변수 목록:
- ✅ `MONGODB_DB_NAME`: `academy-site`
- ⚠️ `MONGODB_URI`: `mongodb+srv://academy-admin:hk...` (비밀번호 부분 확인 필요)
- ✅ `NEXT_PUBLIC_SITE_URL`: `https://parplay.co.kr`
- ✅ `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`: 설정됨
- ✅ `NEXT_PUBLIC_PORTONE_STORE_ID`: 설정됨
- ✅ `NEXT_PUBLIC_ADMIN_PASSWORD`: `hkjtop!@34`

---

## 문제 진단 체크리스트

### 1. MONGODB_URI 비밀번호 확인 (가장 중요!)

**Vercel에서 확인:**
1. **Settings → Environment Variables**
2. **`MONGODB_URI` 클릭 (눈 아이콘으로 전체 값 확인)**
3. **비밀번호 부분 확인:**

   **올바른 형식:**
   ```
   mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
   
   **확인 사항:**
   - 비밀번호가 `hkjtop!%4034`인지 확인 (`@` → `%40` 인코딩)
   - `hkjtop!@34`로 되어 있다면 → ❌ 잘못됨 (인코딩 필요)
   - `hkjtop!%4034`로 되어 있다면 → ✅ 올바름

**잘못된 예시:**
```
mongodb+srv://academy-admin:hkjtop!@34@academy-cluster...
                              └─────┘ └─┘
                              비밀번호 끝  호스트 시작 (잘못 해석됨!)
```

**올바른 예시:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster...
                              └─────────┘ └─┘
                              인코딩된 비밀번호  호스트 시작 (올바름!)
```

---

### 2. MongoDB Atlas 사용자 비밀번호 확인

**가장 중요한 확인 사항:**

1. **MongoDB Atlas → Security → Database Access**
2. **`academy-admin` 사용자 찾기**
3. **비밀번호 확인:**
   - MongoDB Atlas의 실제 비밀번호가 `hkjtop!@34`인지 확인
   - 다르다면 연결 문자열의 비밀번호와 일치하지 않음

**해결 방법:**
- 비밀번호가 다르다면 "Edit" → "Edit Password"
- 비밀번호를 정확히 `hkjtop!@34`로 설정
- "Update User"

---

### 3. 전체 연결 문자열 확인

**올바른 연결 문자열 형식:**

```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

**구성 요소:**
- 프로토콜: `mongodb+srv://`
- 사용자 이름: `academy-admin`
- 비밀번호: `hkjtop!%4034` (`@` → `%40` 인코딩)
- 클러스터: `academy-cluster.eekhbti.mongodb.net`
- 데이터베이스: `/academy-site`
- 옵션: `?retryWrites=true&w=majority`

---

### 4. 재배포 확인

**환경 변수를 수정한 후 반드시 재배포해야 합니다!**

1. **Deployments 탭 확인**
2. **최신 배포가 환경 변수 수정 이후인지 확인**
3. **최신 배포가 아니라면 재배포:**
   - 최신 배포 → "..." → "Redeploy"
   - 배포 완료 대기 (2-3분)

---

## 단계별 해결 방법

### Step 1: MONGODB_URI 전체 값 확인

1. **Vercel → Settings → Environment Variables**
2. **`MONGODB_URI` 클릭**
3. **눈 아이콘 클릭하여 전체 값 확인**
4. **비밀번호 부분 확인:**
   - `hkjtop!@34` → ❌ 잘못됨
   - `hkjtop!%4034` → ✅ 올바름

### Step 2: 비밀번호 인코딩 수정 (필요한 경우)

**비밀번호가 `hkjtop!@34`로 되어 있다면:**

1. **`MONGODB_URI` Edit 클릭**
2. **비밀번호 부분 수정:**
   - `hkjtop!@34` → `hkjtop!%4034` (`@` → `%40`)
3. **전체 연결 문자열 확인:**
   ```
   mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
4. **Save 클릭**

### Step 3: MongoDB Atlas 비밀번호 확인

1. **MongoDB Atlas → Security → Database Access**
2. **`academy-admin` 사용자 확인**
3. **비밀번호가 `hkjtop!@34`인지 확인**
4. **다르다면 수정:**
   - "Edit" → "Edit Password"
   - 비밀번호: `hkjtop!@34` 입력
   - "Update User"

### Step 4: 재배포

1. **Deployments 탭 클릭**
2. **최신 배포 → "..." → "Redeploy"**
3. **배포 완료 대기 (2-3분)**

### Step 5: 연결 테스트

배포 완료 후:

1. **https://parplay.co.kr/admin 접속**
2. **공지사항 탭 → "연결 테스트" 클릭**
3. **정상 응답 확인**

---

## 가장 흔한 문제

### 문제 1: 비밀번호 인코딩 누락

**증상:**
- 연결 문자열에 `hkjtop!@34`로 되어 있음
- `@`가 인코딩되지 않아 MongoDB가 비밀번호를 잘못 해석

**해결:**
- `@` → `%40`으로 변경
- `hkjtop!@34` → `hkjtop!%4034`

### 문제 2: MongoDB Atlas 비밀번호 불일치

**증상:**
- Vercel 연결 문자열의 비밀번호와 MongoDB Atlas의 실제 비밀번호가 다름

**해결:**
- MongoDB Atlas에서 비밀번호를 `hkjtop!@34`로 설정
- 또는 연결 문자열의 비밀번호를 MongoDB Atlas와 일치하도록 수정

### 문제 3: 재배포 누락

**증상:**
- 환경 변수를 수정했지만 재배포하지 않음

**해결:**
- Deployments 탭 → 최신 배포 → Redeploy

---

## 최종 확인 체크리스트

### Vercel 환경 변수:
- [ ] `MONGODB_URI` 전체 값 확인 완료
- [ ] 비밀번호: `hkjtop!%4034` (`@` → `%40` 인코딩)
- [ ] 사용자 이름: `academy-admin`
- [ ] 데이터베이스: `/academy-site` 포함
- [ ] `MONGODB_DB_NAME`: `academy-site` (슬래시 없음)

### MongoDB Atlas:
- [ ] 사용자: `academy-admin` 존재
- [ ] 비밀번호: `hkjtop!@34` (Vercel과 일치)
- [ ] 사용자 권한: "Atlas admin"
- [ ] Network Access: `0.0.0.0/0` 설정됨

### 배포:
- [ ] 환경 변수 수정 후 재배포 완료
- [ ] 배포 상태: "Ready"

### 테스트:
- [ ] 관리자 페이지 "연결 테스트" 성공
- [ ] `/api/news/test` 정상 응답

---

## 요약

**가장 중요한 확인 사항:**

1. **MONGODB_URI 비밀번호 인코딩**
   - `hkjtop!@34` → ❌
   - `hkjtop!%4034` → ✅

2. **MongoDB Atlas 비밀번호 일치**
   - MongoDB Atlas: `hkjtop!@34`
   - Vercel 연결 문자열: `hkjtop!%4034` (인코딩됨)

3. **재배포 필수**
   - 환경 변수 수정 후 반드시 재배포

---

## 빠른 해결 방법

1. **Vercel → MONGODB_URI → 전체 값 확인**
2. **비밀번호가 `hkjtop!%4034`인지 확인** (`@` → `%40`)
3. **다르다면 수정 후 Save**
4. **MongoDB Atlas → 사용자 비밀번호 `hkjtop!@34` 확인**
5. **재배포**
6. **연결 테스트**

이 순서대로 확인하면 문제를 해결할 수 있습니다!

