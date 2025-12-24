# MongoDB 연결 문제 완전 해결 가이드 (심도 깊은 재검토)

## 🔴 현재 문제

**제공된 연결 문자열:**
```
mongodb+srv://academy-admin:<db_password>@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster
```

**문제점:**
1. ❌ `<db_password>`가 그대로 있음 (실제 비밀번호로 교체 필요)
2. ❌ 데이터베이스 이름이 없음 (`/academy-site` 추가 필요)
3. ❌ 비밀번호 인코딩 필요 (`@` → `%40`)
4. ⚠️ 쿼리 파라미터 개선 가능 (`retryWrites=true&w=majority` 권장)

---

## ✅ 완전한 해결 방법 (단계별)

### Step 1: MongoDB Atlas 사용자 비밀번호 확인

#### 1-1. MongoDB Atlas 접속

1. **https://cloud.mongodb.com 접속**
2. **로그인**

#### 1-2. Database Access 확인

1. **Security → Database Access 클릭**
2. **`academy-admin` 사용자 찾기**

#### 1-3. 비밀번호 확인/설정

**비밀번호가 정확히 `hkjtop!@34`인지 확인:**

1. **사용자 옆 "..." 메뉴 → "Edit" 클릭**
2. **비밀번호 확인**
3. **비밀번호가 다르거나 모르는 경우:**
   - "Edit Password" 클릭
   - 새 비밀번호: `hkjtop!@34` 입력
   - ⚠️ **비밀번호를 정확히 기록해두세요!**
   - "Update User" 클릭

**⚠️ 중요:** MongoDB Atlas의 실제 비밀번호를 정확히 확인하세요!

---

### Step 2: 연결 문자열 준비

#### 2-1. 기본 연결 문자열 가져오기

MongoDB Atlas에서 제공하는 연결 문자열:
```
mongodb+srv://academy-admin:<db_password>@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster
```

#### 2-2. 비밀번호 교체

**`<db_password>`를 실제 비밀번호로 교체:**

- 실제 비밀번호: `hkjtop!@34`
- 교체 후: `mongodb+srv://academy-admin:hkjtop!@34@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster`

#### 2-3. 비밀번호 URL 인코딩

**비밀번호에 `@` 기호가 있어서 URL 인코딩 필요:**

- 원본: `hkjtop!@34`
- 인코딩: `hkjtop!%4034` (`@` → `%40`)
- 교체 후: `mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster`

#### 2-4. 데이터베이스 이름 추가

**`/?` 부분을 `/academy-site?`로 변경:**

- 변경 전: `...mongodb.net/?appName=academy-cluster`
- 변경 후: `...mongodb.net/academy-site?appName=academy-cluster`

#### 2-5. 쿼리 파라미터 개선 (권장)

**`appName=academy-cluster` 대신 권장 옵션 사용:**

- 변경 전: `?appName=academy-cluster`
- 변경 후: `?retryWrites=true&w=majority`
- 또는 둘 다 포함: `?retryWrites=true&w=majority&appName=academy-cluster`

#### 2-6. 최종 연결 문자열

**올바른 최종 연결 문자열:**

```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

**구성 요소:**
- 프로토콜: `mongodb+srv://`
- 사용자 이름: `academy-admin`
- 비밀번호: `hkjtop!%4034` (`@` → `%40` 인코딩)
- 클러스터: `academy-cluster.eekhbti.mongodb.net`
- 데이터베이스: `/academy-site` (추가됨)
- 옵션: `?retryWrites=true&w=majority` (개선됨)

---

### Step 3: Vercel 환경 변수 설정

#### 3-1. MONGODB_URI 수정

1. **Vercel 대시보드 → Settings → Environment Variables**
2. **`MONGODB_URI` 찾기 → "Edit" 클릭**

3. **Value 수정:**

   **올바른 값:**
   ```
   mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```

   **확인 사항:**
   - ✅ `<db_password>`가 `hkjtop!%4034`로 교체됨
   - ✅ 비밀번호 인코딩: `@` → `%40`
   - ✅ 데이터베이스 이름: `/academy-site` 포함
   - ✅ 쿼리 파라미터: `retryWrites=true&w=majority`

4. **Environment 선택:**
   - ✅ **Production** (필수!)
   - ✅ **Preview** (권장)
   - ✅ **Development** (선택)

5. **"Save" 클릭**

#### 3-2. MONGODB_DB_NAME 확인

1. **`MONGODB_DB_NAME` 확인**
2. **Value가 `academy-site`인지 확인** (슬래시 없음)
3. **다르다면 수정:**
   - "Edit" 클릭
   - Value: `academy-site` 입력 (슬래시 없음)
   - "Save" 클릭

---

### Step 4: 네트워크 액세스 확인

#### 4-1. Network Access 확인

1. **MongoDB Atlas → Security → Network Access**
2. **IP 주소 목록 확인**
3. **`0.0.0.0/0` (모든 IP 허용)이 있는지 확인**

#### 4-2. 없으면 추가

1. **"Add IP Address" 버튼 클릭**
2. **"Allow Access from Anywhere" 클릭**
3. **또는 `0.0.0.0/0` 입력**
4. **"Confirm" 클릭**

---

### Step 5: 재배포 (필수!)

**환경 변수를 수정한 후 반드시 재배포해야 합니다!**

#### 5-1. Vercel에서 재배포

1. **Deployments 탭 클릭**
2. **최신 배포 찾기**
3. **배포 카드 오른쪽 상단의 "..." 버튼 클릭**
4. **"Redeploy" 선택**
5. **"Redeploy" 확인 클릭**
6. **배포 완료 대기 (약 2-3분)**

**배포 상태 확인:**
- "Building" → "Ready"로 변경되면 완료

---

### Step 6: 연결 테스트

#### 6-1. API 테스트

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

#### 6-2. 관리자 페이지에서 테스트

1. **https://parplay.co.kr/admin 접속**
2. **공지사항 탭 클릭**
3. **"연결 테스트" 버튼 클릭**
4. **정상 응답 확인**

#### 6-3. 공지사항 작성 테스트

1. **"새 공지사항 작성" 클릭**
2. **테스트 공지사항 작성**
3. **"저장" 클릭**
4. **✅ 성공 메시지 확인**

---

## 🔍 문제 진단 체크리스트

### 연결 문자열 확인:

- [ ] `<db_password>`가 실제 비밀번호로 교체됨
- [ ] 비밀번호 인코딩: `hkjtop!%4034` (`@` → `%40`)
- [ ] 데이터베이스 이름: `/academy-site` 포함
- [ ] 쿼리 파라미터: `retryWrites=true&w=majority`

### MongoDB Atlas 확인:

- [ ] 사용자: `academy-admin` 존재
- [ ] 비밀번호: `hkjtop!@34` (정확히 일치)
- [ ] 사용자 권한: "Atlas admin"
- [ ] Network Access: `0.0.0.0/0` 설정됨

### Vercel 확인:

- [ ] `MONGODB_URI`: 올바른 연결 문자열
- [ ] `MONGODB_DB_NAME`: `academy-site` (슬래시 없음)
- [ ] Environment: Production 체크됨
- [ ] 재배포 완료

---

## 📋 최종 연결 문자열 비교

### ❌ 잘못된 예시:

```
mongodb+srv://academy-admin:<db_password>@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster
```

**문제점:**
- `<db_password>`가 그대로 있음
- 데이터베이스 이름 없음
- 비밀번호 인코딩 없음

### ✅ 올바른 예시:

```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

**올바른 점:**
- 실제 비밀번호로 교체됨 (`hkjtop!%4034`)
- 비밀번호 인코딩됨 (`@` → `%40`)
- 데이터베이스 이름 포함 (`/academy-site`)
- 권장 옵션 사용 (`retryWrites=true&w=majority`)

---

## 🎯 핵심 포인트

### 1. 비밀번호 처리

**MongoDB Atlas:**
- 비밀번호: `hkjtop!@34` (그대로 사용)

**Vercel 연결 문자열:**
- 비밀번호: `hkjtop!%4034` (`@` → `%40` 인코딩)

### 2. 데이터베이스 이름

**연결 문자열:**
- `/academy-site` 포함 (슬래시 포함)

**환경 변수:**
- `academy-site` (슬래시 없음)

### 3. 재배포

**환경 변수 수정 후 반드시 재배포해야 합니다!**

---

## 요약

**완전한 해결 순서:**

1. ✅ MongoDB Atlas 비밀번호 확인 (`hkjtop!@34`)
2. ✅ 연결 문자열 준비:
   - `<db_password>` → `hkjtop!%4034` (인코딩)
   - `/?` → `/academy-site?` (데이터베이스 추가)
   - 쿼리 파라미터 개선
3. ✅ Vercel `MONGODB_URI` 수정
4. ✅ `MONGODB_DB_NAME` 확인 (`academy-site`)
5. ✅ Network Access 확인 (`0.0.0.0/0`)
6. ✅ 재배포
7. ✅ 연결 테스트

**최종 연결 문자열:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

이 연결 문자열을 Vercel에 설정하고 재배포하면 해결됩니다!
