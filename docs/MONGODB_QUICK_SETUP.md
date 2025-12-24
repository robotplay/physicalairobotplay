# MongoDB Atlas 빠른 설정 가이드 (5분 완성)

## 🚀 단계별 설정

### 1단계: MongoDB Atlas 계정 생성 (1분)

1. **https://www.mongodb.com/cloud/atlas/register** 접속
2. **"Try Free"** 또는 **"Sign Up"** 클릭
3. Google 계정으로 가입 (가장 빠름) 또는 이메일로 가입
4. 이메일 인증 완료

---

### 2단계: 무료 클러스터 생성 (2분)

1. 로그인 후 **"Build a Database"** 클릭
2. **"M0 FREE"** 선택 (완전 무료, 신용카드 불필요)
3. 클라우드 제공자: **AWS** 선택
4. 리전: **Seoul (ap-northeast-2)** 또는 **Tokyo (ap-northeast-1)** 선택
5. 클러스터 이름: `academy-cluster` (또는 원하는 이름)
6. **"Create"** 클릭
   - ⏱️ 클러스터 생성에 1-3분 소요됩니다

---

### 3단계: 데이터베이스 사용자 생성 (1분)

1. 왼쪽 메뉴에서 **"Database Access"** 클릭
2. **"Add New Database User"** 클릭
3. 인증 방법: **Password** 선택
4. 사용자 이름: `academy-admin` (또는 원하는 이름)
5. 비밀번호: **강력한 비밀번호 입력** (예: `Academy2025!`)
   - ⚠️ **이 비밀번호를 반드시 기억해두세요!**
6. 권한: **"Atlas admin"** 선택
7. **"Add User"** 클릭

---

### 4단계: 네트워크 접근 허용 (30초)

1. 왼쪽 메뉴에서 **"Network Access"** 클릭
2. **"Add IP Address"** 클릭
3. **"Allow Access from Anywhere"** 선택
   - 또는 `0.0.0.0/0` 입력
4. **"Confirm"** 클릭
   - ⏱️ 적용까지 1-2분 소요될 수 있습니다

---

### 5단계: 연결 문자열 가져오기 (30초)

1. 왼쪽 메뉴에서 **"Database"** 클릭
2. 생성한 클러스터 옆 **"Connect"** 버튼 클릭
3. **"Connect your application"** 선택
4. Driver: **Node.js**, Version: **5.5 or later** 선택
5. 연결 문자열 복사
   ```
   mongodb+srv://academy-admin:<password>@academy-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **중요:** `<password>` 부분을 **3단계에서 설정한 실제 비밀번호로 교체**
   - 예: `mongodb+srv://academy-admin:Academy2025!@academy-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - ⚠️ 비밀번호에 특수문자(`@`, `#`, `%` 등)가 있으면 URL 인코딩 필요
     - `@` → `%40`
     - `#` → `%23`
     - `%` → `%25`

---

### 6단계: 환경 변수 설정 (30초)

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용 추가:

```env
# MongoDB Atlas 연결 문자열
MONGODB_URI=mongodb+srv://academy-admin:Academy2025!@academy-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

# 데이터베이스 이름 (선택사항, 기본값: academy-site)
MONGODB_DB_NAME=academy-site
```

**⚠️ 중요:**
- `academy-admin`을 실제 사용자 이름으로 교체
- `Academy2025!`를 실제 비밀번호로 교체
- `academy-cluster.xxxxx.mongodb.net`을 실제 클러스터 주소로 교체
- `.env.local` 파일은 절대 Git에 커밋하지 마세요!

---

### 7단계: 연결 테스트 (1분)

1. 개발 서버 재시작:
   ```bash
   npm run dev
   ```

2. 브라우저에서 테스트:
   ```
   http://localhost:3000/api/test-db
   ```

3. 성공 응답 예시:
   ```json
   {
     "success": true,
     "message": "MongoDB 연결 성공!",
     "database": "academy-site",
     "collections": [],
     "test": "연결 테스트 완료"
   }
   ```

4. 실패 시:
   - 에러 메시지를 확인하고 위 단계를 다시 확인
   - 브라우저 콘솔에서 상세 에러 확인

---

## ✅ 연결 확인 방법

### 방법 1: API 테스트
- `http://localhost:3000/api/test-db` 접속
- 성공 메시지 확인

### 방법 2: 신청서 제출 테스트
1. `http://localhost:3000/program/airplane` 접속
2. 신청서 제출
3. 브라우저 콘솔에서 `✅ MongoDB 저장 성공` 메시지 확인

### 방법 3: MongoDB Atlas에서 확인
1. MongoDB Atlas 대시보드 접속
2. **"Database"** → **"Browse Collections"** 클릭
3. `academy-site` → `airplane_registrations` 컬렉션 확인
4. 신청서 데이터 확인

---

## 🔧 문제 해결

### "MongoDB URI가 설정되지 않았습니다" 에러
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 파일 이름이 정확한지 확인 (`.env.local`)
- 개발 서버 재시작

### "인증 실패" 에러
- 사용자 이름과 비밀번호 확인
- 비밀번호에 특수문자가 있으면 URL 인코딩
- MongoDB Atlas에서 사용자 비밀번호 재설정

### "IP 주소가 허용되지 않음" 에러
- Network Access에서 `0.0.0.0/0` 추가 확인
- 변경 사항 적용까지 1-2분 대기

### 연결은 되지만 데이터가 저장되지 않음
- 브라우저 콘솔 확인
- MongoDB Atlas에서 컬렉션 확인
- API 라우트 로그 확인

---

## 📞 다음 단계

MongoDB 연결이 완료되면:
- ✅ 신청서 데이터가 영구적으로 저장됨
- ✅ 관리자 페이지에서 실시간 조회 가능
- ✅ 결제 시스템 연동 준비 완료

**3단계(포트원 결제 연동)로 진행할 준비가 되었습니다!**















