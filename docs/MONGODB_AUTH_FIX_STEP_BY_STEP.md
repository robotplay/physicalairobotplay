# MongoDB 인증 실패 완전 해결 가이드 (단계별)

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

**문제:** MongoDB Atlas 인증 실패 - 사용자 이름 또는 비밀번호가 일치하지 않음

---

## ✅ 완전 해결 방법 (단계별)

### Step 1: MongoDB Atlas에서 사용자 확인 및 재생성

#### 1-1. MongoDB Atlas 접속

1. **https://cloud.mongodb.com 접속**
2. **로그인**

#### 1-2. Database Access 확인

1. **왼쪽 메뉴 → "Security" → "Database Access" 클릭**
2. **사용자 목록 확인**

#### 1-3. 기존 사용자 삭제 (있는 경우)

**`academy-admin` 사용자가 있다면:**

1. **사용자 옆 "..." 메뉴 클릭**
2. **"Delete" 선택**
3. **확인**

#### 1-4. 새 사용자 생성

1. **"Add New Database User" 버튼 클릭**

2. **Authentication Method**
   - ✅ **"Password"** 선택

3. **Username 입력**
   ```
   academy-admin
   ```
   - 정확히 이 이름으로 입력

4. **Password 설정**
   - **"Autogenerate Secure Password" 클릭** (권장)
   - 또는 직접 입력: `Academy2025` (특수문자 없음, 대문자/숫자만)
   - ⚠️ **비밀번호를 반드시 복사하거나 기록해두세요!**

5. **Database User Privileges**
   - ✅ **"Atlas admin"** 선택 (권장)
   - 또는 "Read and write to any database" 선택

6. **"Add User" 버튼 클릭**

#### 1-5. 비밀번호 확인/복사

**⚠️ 중요:** 생성된 비밀번호를 안전한 곳에 기록해두세요!

---

### Step 2: 연결 문자열 생성

#### 2-1. 연결 문자열 가져오기

1. **왼쪽 메뉴 → "Database" 클릭**
2. **클러스터 카드에서 "Connect" 버튼 클릭**
3. **"Connect your application" 선택**
4. **Driver: "Node.js" 선택**
5. **연결 문자열 복사**

**복사한 문자열 예시:**
```
mongodb+srv://academy-admin:<password>@academy-cluster.eekhbti.mongodb.net/?retryWrites=true&w=majority
```

#### 2-2. 비밀번호 교체

**`<password>` 부분을 Step 1-5에서 기록한 실제 비밀번호로 교체**

**예시:**
- 복사한 문자열: `mongodb+srv://academy-admin:<password>@academy-cluster.eekhbti.mongodb.net/?retryWrites=true&w=majority`
- 실제 비밀번호: `Academy2025`
- 교체 후: `mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/?retryWrites=true&w=majority`

#### 2-3. 데이터베이스 이름 추가

**`/?` 부분을 `/academy-site?`로 변경**

**변경 전:**
```
mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/?retryWrites=true&w=majority
```

**변경 후:**
```
mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

#### 2-4. 최종 연결 문자열 확인

**올바른 형식:**
```
mongodb+srv://academy-admin:[실제비밀번호]@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

**예시 (비밀번호가 `Academy2025`인 경우):**
```
mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

---

### Step 3: Vercel 환경 변수 설정

#### 3-1. Vercel 대시보드 접속

1. **https://vercel.com 접속**
2. **로그인**
3. **프로젝트 선택** (`academy-site`)

#### 3-2. 기존 MONGODB_URI 삭제

1. **Settings → Environment Variables 클릭**
2. **`MONGODB_URI` 찾기**
3. **"..." 메뉴 → "Delete" 클릭**
4. **확인**

#### 3-3. 새 MONGODB_URI 추가

1. **"Add New" 버튼 클릭**

2. **Key 입력:**
   ```
   MONGODB_URI
   ```

3. **Value 입력:**
   - Step 2-4에서 준비한 최종 연결 문자열 붙여넣기
   - 예: `mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority`
   - ⚠️ **비밀번호가 정확한지 다시 한 번 확인!**

4. **Environment 선택:**
   - ✅ **Production** (필수!)
   - ✅ **Preview** (권장)
   - ✅ **Development** (선택)

5. **"Save" 버튼 클릭**

#### 3-4. MONGODB_DB_NAME 확인

1. **`MONGODB_DB_NAME` 환경 변수 확인**
2. **없으면 추가:**
   - Key: `MONGODB_DB_NAME`
   - Value: `academy-site`
   - Environment: 모두 체크
   - Save

---

### Step 4: 네트워크 액세스 확인

#### 4-1. MongoDB Atlas → Network Access 확인

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

**여전히 에러가 발생하는 경우:**
- [문제 해결](#문제-해결) 섹션 참고

#### 6-2. 관리자 페이지에서 확인

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

## 문제 해결

### 여전히 "bad auth" 에러가 발생하는 경우

#### 확인 사항 1: 비밀번호 정확성

1. **MongoDB Atlas → Database Access**
2. **사용자 비밀번호 확인**
3. **Vercel → MONGODB_URI의 비밀번호와 일치하는지 확인**

**주의:**
- 비밀번호에 공백이 있으면 안 됩니다
- 대소문자를 정확히 입력해야 합니다
- 특수문자가 있으면 URL 인코딩 필요 (`@` → `%40`)

#### 확인 사항 2: 사용자 이름 정확성

1. **MongoDB Atlas → Database Access**
2. **사용자 이름 확인** (예: `academy-admin`)
3. **Vercel → MONGODB_URI의 사용자 이름과 일치하는지 확인**

#### 확인 사항 3: 연결 문자열 형식

**올바른 형식:**
```
mongodb+srv://[사용자이름]:[비밀번호]@[클러스터주소]/[데이터베이스이름]?[옵션]
```

**체크리스트:**
- [ ] `mongodb+srv://`로 시작
- [ ] 사용자 이름: `academy-admin` (MongoDB Atlas와 일치)
- [ ] 비밀번호: 실제 비밀번호 (MongoDB Atlas와 일치)
- [ ] `@` 기호가 사용자:비밀번호와 호스트 사이에 있음
- [ ] 클러스터 주소: `academy-cluster.eekhbti.mongodb.net`
- [ ] 데이터베이스 이름: `/academy-site` 포함
- [ ] 옵션: `?retryWrites=true&w=majority`

#### 확인 사항 4: 재배포 확인

1. **Deployments 탭에서 최신 배포 확인**
2. **환경 변수 수정 이후에 배포되었는지 확인**
3. **최신 배포가 아니라면 다시 재배포**

---

## 빠른 해결 방법 (권장)

### 방법: 새 사용자 생성 + 간단한 비밀번호

1. **MongoDB Atlas → Database Access**
2. **기존 사용자 삭제 (있는 경우)**
3. **새 사용자 생성:**
   - Username: `academy-admin`
   - Password: `Academy2025` (특수문자 없음)
   - Privileges: "Atlas admin"
4. **연결 문자열:**
   ```
   mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
5. **Vercel → MONGODB_URI 수정**
6. **재배포**

---

## 체크리스트

### MongoDB Atlas:
- [ ] 새 사용자 생성 완료 (`academy-admin`)
- [ ] 비밀번호 기록 완료
- [ ] 사용자 권한: "Atlas admin"
- [ ] Network Access: `0.0.0.0/0` 설정됨

### 연결 문자열:
- [ ] 사용자 이름: `academy-admin` (MongoDB Atlas와 일치)
- [ ] 비밀번호: 실제 비밀번호 (MongoDB Atlas와 일치)
- [ ] 데이터베이스 이름: `/academy-site` 포함
- [ ] 옵션: `?retryWrites=true&w=majority`

### Vercel:
- [ ] 기존 `MONGODB_URI` 삭제 완료
- [ ] 새 `MONGODB_URI` 추가 완료
- [ ] 비밀번호 정확히 입력됨
- [ ] Production 체크박스 체크됨
- [ ] 재배포 완료

### 테스트:
- [ ] `/api/news/test`에서 연결 확인 완료
- [ ] 공지사항 작성 테스트 성공

---

## 요약

**인증 실패 해결 순서:**

1. ✅ MongoDB Atlas에서 사용자 새로 생성 (비밀번호 기록)
2. ✅ 연결 문자열 준비 (비밀번호 교체 + 데이터베이스 이름 추가)
3. ✅ Vercel에서 기존 MONGODB_URI 삭제 후 새로 추가
4. ✅ 재배포
5. ✅ 연결 테스트

**가장 중요한 것:**
- MongoDB Atlas의 사용자 이름과 비밀번호
- Vercel 연결 문자열의 사용자 이름과 비밀번호가 **정확히 일치**해야 함

