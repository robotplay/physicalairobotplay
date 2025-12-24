# MongoDB 연결 문제 해결 요약

## 🔍 발견된 문제

### 문제 1: 연결 문자열 형식
**기존 연결 문자열:**
```
mongodb+srv://hkj5345_db_user:hsshyc207515@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster
```

**문제점:**
- 데이터베이스 이름이 없음 (`/` 다음에 바로 `?`)
- 표준 파라미터(`retryWrites`, `w`)가 없음
- `appName` 파라미터는 선택사항이지만 표준 형식이 아님

### 문제 2: 환경 변수 로딩 확인 필요
- 개발 서버 재시작 후 환경 변수가 제대로 로드되는지 확인 필요

---

## ✅ 적용한 수정 사항

### 1. 연결 문자열 표준 형식으로 수정
**수정된 연결 문자열:**
```
mongodb+srv://hkj5345_db_user:hsshyc207515@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

**변경 사항:**
- 데이터베이스 이름 추가: `/academy-site`
- 표준 파라미터 추가: `?retryWrites=true&w=majority`
- `appName` 파라미터 제거

### 2. 진단 도구 추가
- `app/api/test-db/route.ts`: 환경 변수 확인 로그 추가
- `app/api/verify-mongodb/route.ts`: 상세한 연결 진단 API 추가

---

## 🧪 테스트 방법

### 방법 1: 기본 연결 테스트
```
http://localhost:3000/api/test-db
```

### 방법 2: 상세 진단 테스트 (권장)
```
http://localhost:3000/api/verify-mongodb
```

이 API는 다음 정보를 제공합니다:
- 연결 문자열 정보 (사용자 이름, 호스트, 데이터베이스)
- 인증 실패 시 구체적인 해결 방법
- 에러 타입별 제안 사항

---

## 📋 확인 체크리스트

### MongoDB Atlas 설정 확인
- [ ] 사용자 이름: `hkj5345_db_user`
- [ ] 비밀번호: `hsshyc207515`
- [ ] 클러스터 주소: `academy-cluster.eekhbti.mongodb.net`
- [ ] Network Access: `0.0.0.0/0` (모든 IP 허용)

### 로컬 설정 확인
- [x] `.env.local` 파일에 연결 문자열 설정
- [x] 연결 문자열 형식 수정 완료
- [ ] 개발 서버 재시작 완료
- [ ] 연결 테스트 성공

---

## 🔧 추가 문제 해결

### 여전히 인증 실패가 발생하는 경우

1. **MongoDB Atlas에서 사용자 확인**
   - "Database & Network Access" → "Database Users" 탭
   - `hkj5345_db_user` 사용자 확인
   - 비밀번호가 정확히 `hsshyc207515`인지 확인

2. **비밀번호 재설정**
   - 사용자 옆 "Edit" 클릭
   - 비밀번호를 `hsshyc207515`로 재설정
   - "Update User" 클릭

3. **새 사용자 생성 (대안)**
   - "+ ADD NEW DATABASE USER" 클릭
   - 사용자 이름: `academy-admin`
   - 비밀번호: `hsshyc207515`
   - 권한: "Atlas admin"
   - 연결 문자열의 사용자 이름도 업데이트 필요

---

## 📞 다음 단계

연결이 성공하면:
- ✅ 신청서 데이터가 MongoDB에 영구 저장됨
- ✅ 관리자 페이지에서 실시간 조회 가능
- ✅ 결제 시스템 연동 준비 완료

**3단계(포트원 결제 연동)로 진행할 수 있습니다!**











