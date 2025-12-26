# MongoDB 연결 반복 문제 해결 가이드

## 🔴 현재 문제

**증상:**
- MongoDB Atlas 대시보드에서 연결이 반복적으로 연결되었다가 끊어짐
- Connections 그래프: 4.0 connections → 0으로 떨어짐 (반복)
- Read/Write Operations: 스파이크 후 0으로 떨어짐
- Data Transfer: 스파이크 후 0으로 떨어짐

**원인 분석:**
이 패턴은 **인증 실패 후 자동 재시도**를 나타냅니다.

---

## 🔍 문제 원인

### 가능한 원인들:

1. **인증 실패 (가장 가능성 높음)**
   - 비밀번호 불일치
   - 비밀번호 인코딩 문제
   - 사용자 이름 불일치

2. **연결 문자열 오류**
   - 데이터베이스 이름 누락
   - 잘못된 클러스터 주소
   - 쿼리 파라미터 오류

3. **네트워크 액세스 문제**
   - IP 화이트리스트 설정 문제
   - 방화벽 차단

4. **연결 풀 설정 문제**
   - 연결 타임아웃
   - 최대 연결 수 제한

---

## ✅ 완전한 해결 방법

### Step 1: MongoDB Atlas 사용자 재생성 (권장)

**가장 확실한 방법:**

1. **MongoDB Atlas → Security → Database Access**
2. **기존 `academy-admin` 사용자 삭제**
   - "..." 메뉴 → "Delete" 클릭
   - 확인

3. **새 사용자 생성**
   - "Add New Database User" 클릭
   - Authentication Method: **Password** 선택
   - Username: `academy-admin` 입력
   - Password: `hkjtop!@34` 입력 (정확히 입력)
   - Database User Privileges: **"Atlas admin"** 선택
   - "Add User" 클릭

4. **⚠️ 중요:** 사용자 생성 후 비밀번호가 정확히 `hkjtop!@34`인지 확인

---

### Step 2: 올바른 연결 문자열 준비

#### 2-1. 연결 문자열 구성

**올바른 최종 연결 문자열:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

**구성 요소:**
- 프로토콜: `mongodb+srv://`
- 사용자 이름: `academy-admin`
- 비밀번호: `hkjtop!%4034` (`@` → `%40` 인코딩)
- 클러스터: `academy-cluster.eekhbti.mongodb.net`
- 데이터베이스: `/academy-site` (중요!)
- 옵션: `?retryWrites=true&w=majority`

#### 2-2. 연결 문자열 검증

**체크리스트:**
- [ ] `<db_password>`가 `hkjtop!%4034`로 교체됨
- [ ] 비밀번호 인코딩: `@` → `%40`
- [ ] 데이터베이스 이름: `/academy-site` 포함
- [ ] 쿼리 파라미터: `retryWrites=true&w=majority`

---

### Step 3: Vercel 환경 변수 설정

#### 3-1. 기존 MONGODB_URI 삭제 후 재생성

1. **Vercel → Settings → Environment Variables**
2. **`MONGODB_URI` 찾기**
3. **"..." 메뉴 → "Delete" 클릭**
4. **확인**

#### 3-2. 새 MONGODB_URI 추가

1. **"Add New" 버튼 클릭**
2. **Key:** `MONGODB_URI`
3. **Value:** 아래 연결 문자열 붙여넣기
   ```
   mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
4. **Environment:**
   - ✅ **Production** (필수!)
   - ✅ **Preview** (권장)
   - ✅ **Development** (선택)
5. **"Save" 클릭**

#### 3-3. MONGODB_DB_NAME 확인

1. **`MONGODB_DB_NAME` 확인**
2. **Value가 `academy-site`인지 확인** (슬래시 없음)
3. **다르다면 수정**

---

### Step 4: 네트워크 액세스 확인

1. **MongoDB Atlas → Security → Network Access**
2. **IP 주소 목록 확인**
3. **`0.0.0.0/0` (모든 IP 허용)이 있는지 확인**
4. **없으면 추가:**
   - "Add IP Address" → "Allow Access from Anywhere"
   - "Confirm"

---

### Step 5: 연결 풀 설정 개선 (선택사항)

연결이 반복되는 문제를 완전히 해결하기 위해 연결 옵션을 추가할 수 있습니다.

**연결 문자열에 추가 옵션:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority&maxPoolSize=10&minPoolSize=1&maxIdleTimeMS=30000
```

**옵션 설명:**
- `maxPoolSize=10`: 최대 연결 풀 크기
- `minPoolSize=1`: 최소 연결 풀 크기
- `maxIdleTimeMS=30000`: 유휴 연결 타임아웃 (30초)

---

### Step 6: 재배포 (필수!)

1. **Deployments 탭 클릭**
2. **최신 배포 → "..." → "Redeploy"**
3. **배포 완료 대기 (2-3분)**

---

### Step 7: 연결 모니터링

#### 7-1. MongoDB Atlas 대시보드 확인

1. **MongoDB Atlas → Database → academy-cluster**
2. **"View Monitoring" 클릭**
3. **Connections 그래프 확인**
4. **정상적인 경우:**
   - 연결이 안정적으로 유지됨
   - 스파이크 후 0으로 떨어지지 않음

#### 7-2. API 테스트

배포 완료 후:

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

#### 7-3. 관리자 페이지 테스트

1. **https://parplay.co.kr/admin 접속**
2. **공지사항 탭 → "연결 테스트" 클릭**
3. **정상 응답 확인**
4. **공지사항 작성 테스트**

---

## 🔍 문제 진단

### 연결이 반복되는 패턴 분석

**정상적인 연결:**
- Connections 그래프: 안정적인 연결 유지
- Read/Write Operations: 지속적인 활동
- Data Transfer: 지속적인 데이터 전송

**문제가 있는 연결 (현재 상황):**
- Connections: 스파이크 → 0 (반복)
- Read/Write Operations: 스파이크 → 0
- Data Transfer: 스파이크 → 0

**이 패턴의 의미:**
- 연결 시도 → 인증 실패 → 연결 종료 → 재시도 (반복)

---

## 🎯 핵심 해결 포인트

### 1. 사용자 재생성 (가장 중요)

**기존 사용자를 삭제하고 새로 생성:**
- 기존 사용자의 비밀번호가 잘못 설정되었을 가능성
- 새로 생성하면 확실하게 비밀번호 확인 가능

### 2. 연결 문자열 정확성

**모든 구성 요소 확인:**
- 비밀번호 인코딩: `hkjtop!%4034`
- 데이터베이스 이름: `/academy-site`
- 쿼리 파라미터: `retryWrites=true&w=majority`

### 3. 환경 변수 재설정

**기존 환경 변수 삭제 후 재생성:**
- 기존 설정에 오류가 있을 수 있음
- 새로 생성하면 확실하게 올바른 값 설정 가능

---

## 체크리스트

### MongoDB Atlas:
- [ ] 기존 사용자 삭제 완료
- [ ] 새 사용자 생성 완료 (`academy-admin`)
- [ ] 비밀번호: `hkjtop!@34` (정확히 일치)
- [ ] 사용자 권한: "Atlas admin"
- [ ] Network Access: `0.0.0.0/0` 설정됨

### Vercel:
- [ ] 기존 `MONGODB_URI` 삭제 완료
- [ ] 새 `MONGODB_URI` 추가 완료
- [ ] 연결 문자열: 올바른 형식
- [ ] 비밀번호 인코딩: `hkjtop!%4034`
- [ ] 데이터베이스 이름: `/academy-site` 포함
- [ ] `MONGODB_DB_NAME`: `academy-site` (슬래시 없음)
- [ ] 재배포 완료

### 테스트:
- [ ] MongoDB Atlas 대시보드: 연결 안정화 확인
- [ ] `/api/news/test`: 정상 응답
- [ ] 관리자 페이지: 연결 테스트 성공
- [ ] 공지사항 작성 테스트 성공

---

## 요약

**연결 반복 문제 해결 순서:**

1. ✅ MongoDB Atlas에서 사용자 재생성 (비밀번호 정확히 `hkjtop!@34`)
2. ✅ Vercel에서 기존 `MONGODB_URI` 삭제 후 재생성
3. ✅ 올바른 연결 문자열 설정:
   ```
   mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```
4. ✅ Network Access 확인 (`0.0.0.0/0`)
5. ✅ 재배포
6. ✅ MongoDB Atlas 대시보드에서 연결 안정화 확인

**핵심:**
- 사용자 재생성으로 비밀번호 확실히 설정
- 환경 변수 재설정으로 연결 문자열 확실히 설정
- 재배포로 변경사항 적용

이 순서대로 진행하면 연결 반복 문제가 해결됩니다!

