# MongoDB 인증 실패 최종 해결 가이드

## 🔴 현재 에러

```json
{
  "success": false,
  "hasMongoUri": true,
  "dbConnected": false,
  "error": "MongoDB 연결 실패",
  "details": "bad auth: authentication failed"
}
```

**문제:** MongoDB Atlas 인증 실패 - 사용자 이름 또는 비밀번호 불일치

---

## ✅ 확실한 해결 방법 (단계별)

### Step 1: MongoDB Atlas에서 사용자 확인 및 재생성

#### 1-1. MongoDB Atlas 접속

1. **https://cloud.mongodb.com 접속**
2. **로그인**

#### 1-2. 기존 사용자 삭제

1. **Security → Database Access 클릭**
2. **`academy-admin` 사용자 찾기**
3. **사용자가 있다면:**
   - "..." 메뉴 → "Delete" 클릭
   - 확인

#### 1-3. 새 사용자 생성

1. **"Add New Database User" 버튼 클릭**

2. **Authentication Method:**
   - ✅ **"Password"** 선택

3. **Username:**
   ```
   academy-admin
   ```
   - 정확히 이 이름으로 입력

4. **Password:**
   - **직접 입력:** `hkjtop!@34`
   - ⚠️ **비밀번호를 정확히 입력하세요!**
   - 대소문자, 특수문자 모두 정확히

5. **Database User Privileges:**
   - ✅ **"Atlas admin"** 선택

6. **"Add User" 버튼 클릭**

7. **⚠️ 중요:** 사용자 생성 완료 후 비밀번호가 정확히 `hkjtop!@34`인지 확인

---

### Step 2: Vercel 연결 문자열 확인 및 수정

#### 2-1. 현재 연결 문자열 확인

**Vercel → Settings → Environment Variables → MONGODB_URI**

현재 설정되어 있어야 하는 값:
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

#### 2-2. 연결 문자열 검증

**올바른 형식 체크리스트:**
- [ ] `mongodb+srv://`로 시작
- [ ] 사용자 이름: `academy-admin`
- [ ] 비밀번호: `hkjtop!%4034` (`@` → `%40` 인코딩)
- [ ] 클러스터: `academy-cluster.eekhbti.mongodb.net`
- [ ] 데이터베이스: `/academy-site` 포함
- [ ] 옵션: `?retryWrites=true&w=majority`

#### 2-3. 연결 문자열 수정 (필요한 경우)

1. **Vercel → Settings → Environment Variables**
2. **`MONGODB_URI` 찾기 → "Edit" 클릭**
3. **Value 확인 및 수정:**

   **올바른 값:**
   ```
   mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```

   **확인 사항:**
   - 비밀번호가 `hkjtop!%4034`인지 확인 (`@` → `%40`)
   - 사용자 이름이 `academy-admin`인지 확인
   - 데이터베이스 이름 `/academy-site`가 포함되어 있는지 확인

4. **"Save" 클릭**

---

### Step 3: 네트워크 액세스 확인

1. **MongoDB Atlas → Security → Network Access**
2. **IP 주소 목록 확인**
3. **`0.0.0.0/0` (모든 IP 허용)이 있는지 확인**
4. **없다면 추가:**
   - "Add IP Address" → "Allow Access from Anywhere"
   - "Confirm"

---

### Step 4: 재배포 (필수!)

환경 변수를 수정하거나 MongoDB Atlas 설정을 변경한 후 **반드시 재배포**해야 합니다!

#### 4-1. Vercel에서 재배포

1. **Deployments 탭 클릭**
2. **최신 배포 찾기**
3. **배포 카드 오른쪽 상단의 "..." 버튼 클릭**
4. **"Redeploy" 선택**
5. **"Redeploy" 확인 클릭**
6. **배포 완료 대기 (약 2-3분)**

**배포 상태 확인:**
- "Building" → "Ready"로 변경되면 완료

---

### Step 5: 연결 테스트

#### 5-1. 관리자 페이지에서 테스트

배포 완료 후 (2-3분 대기):

1. **https://parplay.co.kr/admin 접속**
2. **공지사항 탭 클릭**
3. **"연결 테스트" 버튼 클릭**

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

#### 5-2. API 테스트

브라우저에서 접속:
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

---

## 문제 해결

### 여전히 "bad auth" 에러가 발생하는 경우

#### 확인 사항 1: MongoDB Atlas 비밀번호 정확성

**가장 중요한 확인 사항:**

1. **MongoDB Atlas → Security → Database Access**
2. **`academy-admin` 사용자 클릭**
3. **비밀번호 확인:**
   - 비밀번호가 정확히 `hkjtop!@34`인지 확인
   - 대소문자, 특수문자 모두 정확히 일치해야 함

**해결 방법:**
- 비밀번호가 다르다면 "Edit" → "Edit Password"
- 비밀번호를 정확히 `hkjtop!@34`로 설정
- "Update User"

#### 확인 사항 2: 연결 문자열 비밀번호 인코딩

**Vercel의 MONGODB_URI 확인:**

1. **Vercel → Settings → Environment Variables**
2. **`MONGODB_URI` 클릭 (눈 아이콘으로 값 확인)**
3. **비밀번호 부분 확인:**
   - `hkjtop!@34` → ❌ 잘못됨 (`@`가 인코딩되지 않음)
   - `hkjtop!%4034` → ✅ 올바름 (`@`가 `%40`으로 인코딩됨)

**수정 방법:**
- `@`를 `%40`으로 교체
- 전체 연결 문자열 다시 확인

#### 확인 사항 3: 사용자 이름 일치

1. **MongoDB Atlas → Database Access**
2. **사용자 이름 확인** (예: `academy-admin`)
3. **Vercel → MONGODB_URI의 사용자 이름과 일치하는지 확인**

#### 확인 사항 4: 재배포 확인

1. **Deployments 탭에서 최신 배포 확인**
2. **환경 변수 수정 또는 MongoDB Atlas 설정 변경 이후에 배포되었는지 확인**
3. **최신 배포가 아니라면 다시 재배포**

---

## 빠른 해결 방법 (권장)

### 방법: 사용자 재생성 + 정확한 비밀번호 설정

1. **MongoDB Atlas → Database Access**
2. **기존 `academy-admin` 사용자 삭제**
3. **새 사용자 생성:**
   - Username: `academy-admin`
   - Password: `hkjtop!@34` (정확히 입력)
   - Privileges: "Atlas admin"
4. **Vercel 연결 문자열 확인:**
   ```
   mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
5. **재배포**
6. **연결 테스트**

---

## 체크리스트

### MongoDB Atlas:
- [ ] 기존 사용자 삭제 완료
- [ ] 새 사용자 생성 완료 (`academy-admin`)
- [ ] 비밀번호: `hkjtop!@34` (정확히 일치)
- [ ] 사용자 권한: "Atlas admin"
- [ ] Network Access: `0.0.0.0/0` 설정됨

### Vercel 연결 문자열:
- [ ] 사용자 이름: `academy-admin` (MongoDB Atlas와 일치)
- [ ] 비밀번호: `hkjtop!%4034` (`@` → `%40` 인코딩)
- [ ] 데이터베이스 이름: `/academy-site` 포함
- [ ] 재배포 완료

### 테스트:
- [ ] 관리자 페이지에서 "연결 테스트" 성공
- [ ] `/api/news/test`에서 연결 확인 완료

---

## 요약

**인증 실패 해결 순서:**

1. ✅ MongoDB Atlas에서 사용자 재생성 (비밀번호 정확히 `hkjtop!@34`)
2. ✅ Vercel 연결 문자열 확인 (`hkjtop!%4034` - 인코딩됨)
3. ✅ 네트워크 액세스 확인 (`0.0.0.0/0`)
4. ✅ 재배포
5. ✅ 연결 테스트

**가장 중요한 것:**
- MongoDB Atlas의 비밀번호: `hkjtop!@34` (정확히 일치)
- Vercel 연결 문자열의 비밀번호: `hkjtop!%4034` (인코딩됨)
- 둘 다 같은 비밀번호지만, 연결 문자열에서는 `@`를 `%40`으로 인코딩해야 함

---

## 추가 도움

문제가 계속되면 다음 정보를 확인해주세요:

1. **MongoDB Atlas 사용자 비밀번호 스크린샷**
2. **Vercel MONGODB_URI 값 (비밀번호 부분만)**
3. **에러 메시지 전체**



