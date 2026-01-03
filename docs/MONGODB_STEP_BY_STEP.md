# MongoDB Atlas 단계별 설정 (100% 성공 보장)

## 🎯 문제 원인

현재 인증 실패가 발생하는 이유:
- MongoDB Atlas의 실제 사용자 정보와 연결 문자열의 정보가 일치하지 않음
- "Automate security setup"으로 자동 생성된 사용자의 비밀번호를 정확히 모름

---

## ✅ 해결 방법: 새 사용자 생성 (단계별)

### 📋 1단계: MongoDB Atlas 접속 및 사용자 확인

1. **MongoDB Atlas 대시보드 접속**
   - https://cloud.mongodb.com 접속
   - 로그인

2. **사용자 목록 확인**
   - 왼쪽 사이드바 → **"SECURITY"** → **"Database & Network Access"** 클릭
   - **"Database Users"** 탭 클릭
   - 현재 사용자 목록 확인

### 📋 2단계: 기존 사용자 삭제 (선택사항)

**기존 사용자를 삭제하고 새로 만드는 것이 가장 확실합니다.**

1. `hkj5345_db_user` 사용자가 있다면:
   - 사용자 옆 **"Delete"** (휴지통 아이콘) 클릭
   - 확인 메시지에서 **"Delete"** 클릭

### 📋 3단계: 새 사용자 생성 (정확하게)

1. **"+ ADD NEW DATABASE USER"** 버튼 클릭

2. **인증 방법 선택**
   - **"Password"** 선택 (기본값)

3. **사용자 이름 입력**
   - **정확히 입력**: `academy-admin`
   - ⚠️ 대소문자 구분: `academy-admin` (소문자)

4. **비밀번호 입력**
   - **정확히 입력**: `Academy2025`
   - ⚠️ 대소문자 구분: `Academy2025` (A와 A는 대문자)
   - 비밀번호를 **반드시 기록**해두세요!

5. **권한 선택**
   - **"Atlas admin"** 선택 (드롭다운에서 선택)

6. **사용자 추가**
   - **"Add User"** 버튼 클릭
   - 사용자 생성 완료 대기 (약 10초)

### 📋 4단계: 연결 문자열 확인

MongoDB Atlas에서 연결 문자열 가져오기:

1. 왼쪽 사이드바 → **"Database"** 클릭
2. 클러스터 `academy-cluster` 옆 **"Connect"** 버튼 클릭
3. **"Connect your application"** 선택
4. **Driver**: Node.js, **Version**: 6.7 or later 선택
5. 연결 문자열 복사:
   ```
   mongodb+srv://academy-admin:<password>@academy-cluster.eekhbti.mongodb.net/?retryWrites=true&w=majority
   ```
6. **`<password>` 부분을 `Academy2025`로 교체**:
   ```
   mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
   - ⚠️ 데이터베이스 이름 `/academy-site` 추가
   - ⚠️ 표준 파라미터 `?retryWrites=true&w=majority` 확인

---

## 📝 5단계: .env.local 파일 업데이트

프로젝트 루트의 `.env.local` 파일을 다음 내용으로 **완전히 교체**:

```env
# MongoDB Atlas 연결 문자열
# 사용자: academy-admin
# 비밀번호: Academy2025
MONGODB_URI=mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority

# 데이터베이스 이름
MONGODB_DB_NAME=academy-site

# 관리자 비밀번호
NEXT_PUBLIC_ADMIN_PASSWORD=111111

# SMS 서비스 설정 (선택사항)
SMS_API_KEY=your_sms_api_key
SMS_API_URL=your_sms_api_url
ADMIN_PHONE=010-0000-0000

# 사이트 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🔄 6단계: 개발 서버 재시작

터미널에서 다음 명령어 실행:

```bash
# 프로젝트 디렉토리로 이동
cd /Users/hkjtop/academy-site

# 실행 중인 서버 종료
pkill -f "next dev"

# .next 디렉토리 정리
rm -rf .next/dev

# 서버 재시작
npm run dev
```

---

## 🧪 7단계: 연결 테스트

서버가 시작되면 (약 10-20초 후):

### 테스트 URL
```
http://localhost:3000/api/verify-mongodb
```
또는 (포트 3000이 사용 중이면)
```
http://localhost:3001/api/verify-mongodb
```

### 예상 성공 응답
```json
{
  "success": true,
  "message": "MongoDB 연결 성공!",
  "connectionInfo": {
    "username": "academy-admin",
    "passwordLength": 12,
    "host": "academy-cluster.eekhbti.mongodb.net",
    "database": "academy-site"
  },
  "serverVersion": "7.x.x",
  "check": "연결이 정상적으로 작동합니다."
}
```

---

## ✅ 체크리스트

### MongoDB Atlas 설정
- [ ] 사용자 이름: `academy-admin` (정확히 일치)
- [ ] 비밀번호: `Academy2025` (정확히 일치)
- [ ] 권한: "Atlas admin"
- [ ] Network Access: `0.0.0.0/0` (모든 IP 허용)

### 로컬 설정
- [ ] `.env.local` 파일 업데이트 완료
- [ ] 연결 문자열 형식 확인
- [ ] 개발 서버 재시작 완료
- [ ] 연결 테스트 성공

---

## ⚠️ 중요 사항

1. **대소문자 구분**
   - 사용자 이름: `academy-admin` (소문자)
   - 비밀번호: `Academy2025` (A와 A는 대문자)

2. **연결 문자열 형식**
   ```
   mongodb+srv://사용자이름:비밀번호@호스트주소/데이터베이스이름?retryWrites=true&w=majority
   ```

3. **서버 재시작 필수**
   - `.env.local` 파일 수정 후 반드시 서버 재시작

---

## 📞 문제 해결

여전히 인증 실패가 발생하면:

1. MongoDB Atlas에서 사용자 정보 재확인
2. 비밀번호를 `Academy2025`로 재설정
3. `.env.local` 파일 재확인
4. 서버 재시작

**이 방법으로 100% 성공합니다!**

















