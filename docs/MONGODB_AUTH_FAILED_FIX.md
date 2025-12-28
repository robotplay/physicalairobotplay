# MongoDB 인증 실패 해결 가이드

## 🔴 현재 에러

```json
{
  "success": false,
  "hasMongoUri": true,
  "dbConnected": false,
  "error": "MongoDB 연결 실패",
  "details": "bad auth : authentication failed"
}
```

**문제:** MongoDB 인증 실패 (사용자 이름 또는 비밀번호 오류)

---

## 원인 분석

### 가능한 원인:

1. **비밀번호 인코딩 문제**
   - 비밀번호 `hkjtop!@34`의 `@`가 제대로 인코딩되지 않음
   - `@` → `%40`으로 인코딩 필요

2. **MongoDB Atlas 사용자 정보 불일치**
   - Vercel에 설정한 사용자 이름/비밀번호가 MongoDB Atlas와 다름
   - 사용자가 삭제되었거나 비밀번호가 변경됨

3. **연결 문자열 형식 오류**
   - 사용자 이름 또는 비밀번호 부분에 오타
   - 특수문자 처리 문제

---

## 해결 방법

### Step 1: MongoDB Atlas 사용자 정보 확인

#### 1-1. Database Access 확인

1. **MongoDB Atlas 대시보드 접속**
   - https://cloud.mongodb.com 접속
   - 로그인

2. **Security → Database Access 클릭**

3. **사용자 목록 확인**
   - `academy-admin` 사용자가 있는지 확인
   - 사용자 이름이 정확한지 확인

4. **사용자가 없다면:**
   - "Add New Database User" 클릭
   - Username: `academy-admin` 입력
   - Password: 새 비밀번호 설정 (⚠️ 기록해두세요!)
   - Privileges: "Atlas admin" 선택
   - "Add User" 클릭

#### 1-2. 사용자 비밀번호 확인/재설정

**비밀번호를 모르는 경우:**

1. **사용자 옆 "..." 메뉴 클릭**
2. **"Edit" 선택**
3. **"Edit Password" 클릭**
4. **새 비밀번호 설정**
   - 예: `hkjtop!@34` (또는 더 간단한 비밀번호)
   - ⚠️ **비밀번호를 반드시 기록해두세요!**
5. **"Update User" 클릭**

---

### Step 2: 연결 문자열 재확인 및 수정

#### 2-1. 현재 설정된 연결 문자열 확인

**Vercel에서 확인:**
1. Vercel 대시보드 → Settings → Environment Variables
2. `MONGODB_URI` 값 확인
3. 복사하여 텍스트 에디터에 붙여넣기

#### 2-2. 비밀번호 인코딩 확인

**비밀번호: `hkjtop!@34`**

**올바른 인코딩:**
- `@` → `%40`
- 인코딩된 비밀번호: `hkjtop!%4034`

**연결 문자열 형식:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

#### 2-3. 연결 문자열 구성 요소 확인

**올바른 형식:**
```
mongodb+srv://[사용자이름]:[인코딩된비밀번호]@[클러스터주소]/[데이터베이스이름]?[옵션]
```

**예시:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

**체크리스트:**
- [ ] `mongodb+srv://`로 시작
- [ ] 사용자 이름: `academy-admin` (MongoDB Atlas와 일치)
- [ ] 비밀번호: `hkjtop!%4034` (`@`가 `%40`으로 인코딩됨)
- [ ] 클러스터 주소: `academy-cluster.eekhbti.mongodb.net`
- [ ] 데이터베이스 이름: `/academy-site`
- [ ] 옵션: `?retryWrites=true&w=majority`

---

### Step 3: Vercel 환경 변수 수정

#### 3-1. MONGODB_URI 수정

1. **Vercel 대시보드 → Settings → Environment Variables**

2. **`MONGODB_URI` 찾기**

3. **"Edit" 또는 "..." 메뉴 클릭**

4. **Value 수정:**
   
   **올바른 연결 문자열:**
   ```
   mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
   
   **⚠️ 중요:**
   - 비밀번호의 `@`가 `%40`으로 인코딩되어 있는지 확인
   - 사용자 이름이 MongoDB Atlas와 일치하는지 확인
   - 데이터베이스 이름 `/academy-site`가 포함되어 있는지 확인

5. **"Save" 클릭**

#### 3-2. 대안: 비밀번호를 간단하게 변경

**비밀번호에 특수문자가 문제를 일으키는 경우:**

1. **MongoDB Atlas에서 비밀번호 변경**
   - Database Access → 사용자 편집
   - 새 비밀번호: `Academy2025` (특수문자 없음)
   - Update User

2. **Vercel 연결 문자열 수정**
   ```
   mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
   - 특수문자가 없으므로 인코딩 불필요

---

### Step 4: 네트워크 액세스 확인

인증 실패는 네트워크 문제일 수도 있습니다.

1. **MongoDB Atlas → Security → Network Access**

2. **IP 주소 확인**
   - `0.0.0.0/0` (모든 IP 허용)이 있는지 확인
   - 없으면 "Add IP Address" → "Allow Access from Anywhere" 클릭

---

### Step 5: 재배포

환경 변수를 수정한 후 **반드시 재배포**해야 합니다!

1. **Deployments 탭 클릭**
2. **최신 배포 옆 "..." 클릭**
3. **"Redeploy" 선택**
4. **배포 완료 대기 (2-3분)**

---

## 단계별 체크리스트

### MongoDB Atlas 확인:
- [ ] Database Access에서 `academy-admin` 사용자 존재 확인
- [ ] 사용자 비밀번호 확인/재설정 완료
- [ ] 사용자 권한이 "Atlas admin"인지 확인
- [ ] Network Access에 `0.0.0.0/0` 추가됨

### 연결 문자열 확인:
- [ ] 사용자 이름: `academy-admin` (MongoDB Atlas와 일치)
- [ ] 비밀번호: `hkjtop!%4034` (`@` → `%40` 인코딩)
- [ ] 클러스터 주소: `academy-cluster.eekhbti.mongodb.net`
- [ ] 데이터베이스 이름: `/academy-site` 포함
- [ ] 옵션: `?retryWrites=true&w=majority`

### Vercel 설정 확인:
- [ ] `MONGODB_URI` 환경 변수 수정 완료
- [ ] Production, Preview, Development 모두 체크
- [ ] 재배포 완료

---

## 테스트 방법

### Step 1: 연결 테스트

배포 완료 후 (2-3분):

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

**여전히 에러가 발생하는 경우:**
- [Step 6: 추가 문제 해결](#step-6-추가-문제-해결) 참고

---

## Step 6: 추가 문제 해결

### 문제 1: 여전히 "bad auth" 에러

**해결 방법:**

1. **MongoDB Atlas에서 새 사용자 생성**
   - Database Access → "Add New Database User"
   - Username: `academy-user` (다른 이름 사용)
   - Password: `SimplePassword123` (특수문자 없음)
   - Privileges: "Atlas admin"
   - Add User

2. **Vercel 연결 문자열 수정**
   ```
   mongodb+srv://academy-user:SimplePassword123@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```

3. **재배포**

### 문제 2: 비밀번호 인코딩이 복잡함

**해결 방법: 비밀번호를 간단하게 변경**

1. **MongoDB Atlas에서 비밀번호 변경**
   - 특수문자 없는 비밀번호 사용
   - 예: `Academy2025`, `ParPlay2025`

2. **연결 문자열 수정**
   - 인코딩 불필요
   - 예: `mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority`

### 문제 3: 사용자 이름이 다른 경우

**해결 방법:**

1. **MongoDB Atlas에서 실제 사용자 이름 확인**
   - Database Access → 사용자 목록 확인

2. **연결 문자열에서 사용자 이름 수정**
   - 실제 사용자 이름으로 교체

---

## 빠른 해결 방법 (권장)

### 방법 1: 비밀번호를 간단하게 변경 (가장 쉬움)

1. **MongoDB Atlas → Database Access**
2. **사용자 편집 → 비밀번호 변경**
   - 새 비밀번호: `Academy2025` (특수문자 없음)
3. **Vercel → MONGODB_URI 수정**
   ```
   mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
4. **재배포**

### 방법 2: 비밀번호 인코딩 정확히 확인

1. **현재 Vercel의 MONGODB_URI 값 확인**
2. **비밀번호 부분 확인:**
   - `hkjtop!@34` → ❌ 잘못됨
   - `hkjtop!%4034` → ✅ 올바름
3. **올바르게 수정 후 재배포**

---

## 최종 확인

### 올바른 연결 문자열 예시:

**비밀번호에 특수문자가 있는 경우:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

**비밀번호에 특수문자가 없는 경우:**
```
mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

---

## 요약

**인증 실패 원인:**
1. 비밀번호 인코딩 문제 (`@` → `%40`)
2. 사용자 이름/비밀번호 불일치
3. MongoDB Atlas 사용자 설정 문제

**해결 방법:**
1. MongoDB Atlas 사용자 정보 확인
2. 비밀번호 인코딩 확인 (`@` → `%40`)
3. Vercel 연결 문자열 수정
4. 재배포

**가장 쉬운 방법:**
- 비밀번호를 특수문자 없는 것으로 변경 (`Academy2025`)
- 인코딩 불필요



