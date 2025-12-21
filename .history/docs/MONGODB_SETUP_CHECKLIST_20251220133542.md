# MongoDB 설정 체크리스트 ✅

## 📋 단계별 체크리스트

### ✅ 1단계: MongoDB Atlas 계정 생성
- [ ] https://www.mongodb.com/cloud/atlas/register 접속
- [ ] 계정 생성 완료
- [ ] 이메일 인증 완료

### ✅ 2단계: 무료 클러스터 생성
- [ ] "Build a Database" 클릭
- [ ] "M0 FREE" 선택
- [ ] AWS 클라우드 제공자 선택
- [ ] Seoul 또는 Tokyo 리전 선택
- [ ] 클러스터 이름 설정
- [ ] "Create" 클릭
- [ ] 클러스터 생성 완료 대기 (1-3분)

### ✅ 3단계: 데이터베이스 사용자 생성
- [ ] "Database Access" 메뉴 클릭
- [ ] "Add New Database User" 클릭
- [ ] 사용자 이름 설정 (예: `academy-admin`)
- [ ] 비밀번호 설정 및 기록
- [ ] "Atlas admin" 권한 선택
- [ ] "Add User" 클릭

### ✅ 4단계: 네트워크 접근 허용
- [ ] "Network Access" 메뉴 클릭
- [ ] "Add IP Address" 클릭
- [ ] "Allow Access from Anywhere" 선택
- [ ] "Confirm" 클릭
- [ ] 적용 완료 대기 (1-2분)

### ✅ 5단계: 연결 문자열 가져오기
- [ ] "Database" 메뉴 클릭
- [ ] 클러스터 옆 "Connect" 버튼 클릭
- [ ] "Connect your application" 선택
- [ ] Node.js 드라이버 선택
- [ ] 연결 문자열 복사
- [ ] `<password>` 부분을 실제 비밀번호로 교체

### ✅ 6단계: 환경 변수 설정
- [ ] 프로젝트 루트에 `.env.local` 파일 생성
- [ ] `MONGODB_URI` 변수 추가
- [ ] 연결 문자열 입력
- [ ] 파일 저장

### ✅ 7단계: 연결 테스트
- [ ] 개발 서버 재시작 (`npm run dev`)
- [ ] `http://localhost:3000/api/test-db` 접속
- [ ] 성공 메시지 확인
- [ ] 신청서 제출 테스트
- [ ] MongoDB Atlas에서 데이터 확인

---

## 🔍 연결 문자열 예시

```
mongodb+srv://academy-admin:YourPassword123@academy-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**주의사항:**
- `academy-admin` → 실제 사용자 이름으로 교체
- `YourPassword123` → 실제 비밀번호로 교체
- `academy-cluster.xxxxx.mongodb.net` → 실제 클러스터 주소로 교체
- 비밀번호에 특수문자가 있으면 URL 인코딩 필요

---

## 🧪 테스트 방법

### 방법 1: API 테스트
```
http://localhost:3000/api/test-db
```

**성공 응답:**
```json
{
  "success": true,
  "message": "MongoDB 연결 성공!",
  "database": "academy-site",
  "collections": [],
  "test": "연결 테스트 완료"
}
```

### 방법 2: 신청서 제출 테스트
1. `http://localhost:3000/program/airplane` 접속
2. 신청서 작성 및 제출
3. 브라우저 콘솔(F12)에서 확인:
   - `✅ MongoDB 저장 성공: [ObjectId]` → 성공
   - `❌ MongoDB 저장 실패: [에러]` → 실패

### 방법 3: MongoDB Atlas에서 확인
1. MongoDB Atlas 대시보드 접속
2. "Database" → "Browse Collections"
3. `academy-site` → `airplane_registrations` 확인
4. 신청서 데이터 확인

---

## ❌ 문제 해결

### 에러: "MongoDB URI가 설정되지 않았습니다"
**해결:**
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 파일 이름이 정확한지 확인 (`.env.local`)
- 개발 서버 재시작

### 에러: "인증 실패"
**해결:**
- 사용자 이름과 비밀번호 확인
- 비밀번호에 특수문자가 있으면 URL 인코딩
- MongoDB Atlas에서 사용자 비밀번호 재설정

### 에러: "IP 주소가 허용되지 않음"
**해결:**
- Network Access에서 `0.0.0.0/0` 추가 확인
- 변경 사항 적용까지 1-2분 대기

---

## 📞 다음 단계

모든 체크리스트를 완료하면:
- ✅ 신청서 데이터가 MongoDB에 영구 저장됨
- ✅ 관리자 페이지에서 실시간 조회 가능
- ✅ 결제 시스템 연동 준비 완료

**3단계(포트원 결제 연동)로 진행할 수 있습니다!**
