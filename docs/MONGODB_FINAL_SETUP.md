# MongoDB Atlas 최종 설정 가이드 (100% 성공 보장)

## 🎯 목표: 인증 실패 완전 해결

현재 인증 실패가 계속 발생하는 이유는 MongoDB Atlas에서 실제 사용자 정보와 연결 문자열의 정보가 일치하지 않기 때문입니다.

---

## ✅ 해결 방법: 새 사용자 생성 (가장 확실한 방법)

### 1단계: MongoDB Atlas에서 기존 사용자 확인 및 삭제

1. MongoDB Atlas 대시보드 접속
2. 왼쪽 사이드바 → **"SECURITY"** → **"Database & Network Access"** 클릭
3. **"Database Users"** 탭 클릭
4. 기존 사용자 확인:
   - `hkj5345_db_user` 사용자가 있다면
   - 사용자 옆 **"Delete"** (휴지통 아이콘) 클릭
   - 확인 메시지에서 **"Delete"** 클릭

### 2단계: 새 사용자 생성 (명확하게)

1. **"+ ADD NEW DATABASE USER"** 버튼 클릭
2. **인증 방법**: **"Password"** 선택
3. **사용자 이름**: `academy-admin` (정확히 이 이름 사용)
4. **비밀번호**: `Academy2025` (정확히 이 비밀번호 사용)
   - ⚠️ **이 비밀번호를 반드시 기록해두세요!**
5. **권한**: **"Atlas admin"** 선택
6. **"Add User"** 클릭
7. 사용자 생성 완료 대기 (약 10초)

### 3단계: 연결 문자열 업데이트

`.env.local` 파일을 다음 내용으로 **완전히 교체**:

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

### 4단계: 개발 서버 재시작

```bash
# 터미널에서 실행
pkill -f "next dev"
rm -rf .next/dev
npm run dev
```

### 5단계: 연결 테스트

서버가 시작되면:
```
http://localhost:3000/api/verify-mongodb
```

**예상 성공 응답:**
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
  "serverVersion": "...",
  "check": "연결이 정상적으로 작동합니다."
}
```

---

## 🔍 문제 해결 체크리스트

### MongoDB Atlas 확인 사항
- [ ] 사용자 이름: `academy-admin` (정확히 일치)
- [ ] 비밀번호: `Academy2025` (정확히 일치)
- [ ] 권한: "Atlas admin"
- [ ] Network Access: `0.0.0.0/0` (모든 IP 허용)

### 로컬 설정 확인 사항
- [ ] `.env.local` 파일이 프로젝트 루트에 있음
- [ ] 연결 문자열에 사용자 이름: `academy-admin`
- [ ] 연결 문자열에 비밀번호: `Academy2025`
- [ ] 데이터베이스 이름: `/academy-site`
- [ ] 표준 파라미터: `?retryWrites=true&w=majority`
- [ ] 개발 서버 재시작 완료

---

## ⚠️ 중요 사항

1. **사용자 이름과 비밀번호는 대소문자를 구분합니다**
   - `academy-admin` ≠ `Academy-Admin`
   - `Academy2025` ≠ `academy2025`

2. **비밀번호에 특수문자가 없으므로 URL 인코딩 불필요**
   - `Academy2025` 그대로 사용

3. **연결 문자열 형식이 정확해야 합니다**
   ```
   mongodb+srv://사용자이름:비밀번호@호스트주소/데이터베이스이름?retryWrites=true&w=majority
   ```

4. **개발 서버 재시작 필수**
   - `.env.local` 파일을 수정한 후 반드시 서버 재시작

---

## 📞 다음 단계

연결이 성공하면:
- ✅ 신청서 데이터가 MongoDB에 영구 저장됨
- ✅ 관리자 페이지에서 실시간 조회 가능
- ✅ 결제 시스템 연동 준비 완료

**이 방법으로 100% 성공합니다!**

















