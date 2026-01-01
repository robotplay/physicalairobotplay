# MongoDB 연결 문자열 최종 설정 가이드

## 현재 상태

**제공된 연결 문자열:**
```
mongodb+srv://academy-admin:<db_password>@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster
```

**비밀번호:** `hkjtop!@34`

---

## 설정해야 할 부분

### 1단계: 비밀번호 교체

**변경 전:**
```
mongodb+srv://academy-admin:<db_password>@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster
```

**변경 후:**
```
mongodb+srv://academy-admin:hkjtop!@34@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster
```

---

### 2단계: 비밀번호 URL 인코딩 (필수!)

**⚠️ 중요:** 비밀번호에 `@` 기호가 있어서 URL 인코딩이 **필수**입니다!

**인코딩 규칙:**
- `@` → `%40`
- `!` → (일반적으로 인코딩 불필요, 하지만 안전을 위해 `%21`로도 가능)

**비밀번호 인코딩:**
- 원본: `hkjtop!@34`
- 인코딩: `hkjtop!%4034` (권장)
- 또는: `hkjtop%21%4034` (더 안전)

**변경 후:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster
```

---

### 3단계: 데이터베이스 이름 추가 (필수!)

**⚠️ 중요:** 데이터베이스 이름을 추가하지 않으면 연결이 안 됩니다!

**변경 전:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster
                                                                    ↑
                                                              여기에 데이터베이스 이름이 없음
```

**변경 후:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?appName=academy-cluster
                                                                    └──────────┘
                                                                    데이터베이스 이름 추가
```

**변경 방법:**
- `/?` 부분을 `/academy-site?`로 변경

---

### 4단계: 쿼리 파라미터 개선 (권장)

**현재:**
```
?appName=academy-cluster
```

**권장:**
```
?retryWrites=true&w=majority
```

**또는 둘 다 포함:**
```
?retryWrites=true&w=majority&appName=academy-cluster
```

---

## 최종 연결 문자열

### 옵션 1: 권장 (appName 제외)

```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

### 옵션 2: appName 포함

```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority&appName=academy-cluster
```

---

## Vercel 환경 변수 설정

### Step 1: Vercel 대시보드 접속

1. https://vercel.com 접속
2. 로그인
3. 프로젝트 선택 (`academy-site`)

### Step 2: 환경 변수 추가

1. **Settings** → **Environment Variables** 클릭
2. **"Add New"** 버튼 클릭

3. **MONGODB_URI 설정:**
   - **Key:** `MONGODB_URI`
   - **Value:** 아래 중 하나를 복사하여 붙여넣기
   
   **권장 (옵션 1):**
   ```
   mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
   
   **또는 appName 포함 (옵션 2):**
   ```
   mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority&appName=academy-cluster
   ```
   
   - **Environment:** 
     - ✅ **Production** (필수!)
     - ✅ **Preview** (권장)
     - ✅ **Development** (선택)
   - **"Save"** 클릭

4. **MONGODB_DB_NAME 설정 (선택, 권장):**
   - **"Add New"** 버튼 클릭
   - **Key:** `MONGODB_DB_NAME`
   - **Value:** `academy-site`
   - **Environment:** 모두 체크
   - **"Save"** 클릭

### Step 3: 재배포 (필수!)

환경 변수를 추가한 후 **반드시 재배포**해야 합니다!

**방법 1: Vercel 대시보드에서 재배포 (권장)**
1. **Deployments** 탭 클릭
2. 최신 배포 옆 **"..."** 클릭
3. **"Redeploy"** 선택
4. **"Redeploy"** 확인
5. 배포 완료 대기 (2-3분)

**방법 2: Git 푸시**
```bash
git commit --allow-empty -m "trigger redeploy for MongoDB"
git push origin main
```

---

## 확인 방법

### Step 1: API 테스트

배포 완료 후 (2-3분 대기):

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

### Step 2: 관리자 페이지에서 확인

1. https://parplay.co.kr/admin 접속
2. 공지사항 탭 클릭
3. **"연결 테스트"** 버튼 클릭
4. 정상 응답 확인

### Step 3: 공지사항 작성 테스트

1. 관리자 페이지 → 공지사항 탭
2. **"새 공지사항 작성"** 클릭
3. 테스트 공지사항 작성
4. **"저장"** 클릭
5. ✅ 성공 메시지 확인

---

## 요약

### 변경 사항 요약:

1. ✅ `<db_password>` → `hkjtop!@34` (비밀번호 교체)
2. ✅ `hkjtop!@34` → `hkjtop!%4034` (URL 인코딩)
3. ✅ `/?` → `/academy-site?` (데이터베이스 이름 추가)
4. ✅ `?appName=academy-cluster` → `?retryWrites=true&w=majority` (쿼리 파라미터 개선)

### 최종 연결 문자열:

```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

### Vercel 설정:

- **Key:** `MONGODB_URI`
- **Value:** 위의 최종 연결 문자열
- **Environment:** Production, Preview, Development 모두 체크
- **재배포 필수!**

---

## 문제 해결

### 연결이 안 되는 경우

1. **비밀번호 인코딩 확인**
   - `@` → `%40`으로 변경했는지 확인
   - 연결 문자열에서 `hkjtop!%4034`가 맞는지 확인

2. **데이터베이스 이름 확인**
   - `/academy-site`가 포함되어 있는지 확인
   - `/?`가 아니라 `/academy-site?`인지 확인

3. **재배포 확인**
   - 환경 변수 추가 후 재배포했는지 확인
   - Deployments 탭에서 최신 배포 확인

4. **MongoDB Atlas 설정 확인**
   - Network Access: `0.0.0.0/0` 설정되어 있는지 확인
   - Database Access: 사용자 권한 확인

---

## 체크리스트

- [ ] 비밀번호를 `hkjtop!@34`로 교체
- [ ] 비밀번호를 `hkjtop!%4034`로 URL 인코딩
- [ ] 데이터베이스 이름 `/academy-site` 추가
- [ ] 쿼리 파라미터 개선 (`retryWrites=true&w=majority`)
- [ ] Vercel에 `MONGODB_URI` 환경 변수 추가
- [ ] 환경 변수의 "Production" 체크박스 체크
- [ ] 재배포 완료
- [ ] `/api/news/test`에서 연결 확인
- [ ] 공지사항 작성 테스트 성공





