# MONGODB_URI 연결 문자열 검토

## 현재 설정된 연결 문자열

```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

---

## ✅ 검토 결과

### 1. 프로토콜 ✅
- `mongodb+srv://` - 올바름

### 2. 사용자 이름 ✅
- `academy-admin` - 올바름

### 3. 비밀번호 ✅
- `hkjtop!%4034` - 올바름
- 원본 비밀번호: `hkjtop!@34`
- URL 인코딩: `@` → `%40` ✅

### 4. 호스트/클러스터 ✅
- `academy-cluster.eekhbti.mongodb.net` - 올바름

### 5. 데이터베이스 이름 ✅
- `/academy-site` - 올바름 (슬래시 포함)

### 6. 쿼리 파라미터 ✅
- `?retryWrites=true&w=majority` - 올바름 (권장 옵션)

---

## 전체 평가: ✅ 올바르게 설정됨

연결 문자열의 형식과 구성 요소가 모두 올바릅니다.

---

## ⚠️ 여전히 인증 실패가 발생하는 경우

연결 문자열이 올바른데도 "bad auth" 에러가 발생한다면, 다음을 확인하세요:

### 확인 사항 1: MongoDB Atlas 사용자 비밀번호

**가장 중요한 확인 사항:**

1. **MongoDB Atlas → Security → Database Access**
2. **`academy-admin` 사용자 찾기**
3. **비밀번호 확인:**
   - MongoDB Atlas의 실제 비밀번호가 `hkjtop!@34`인지 확인
   - 다르다면 연결 문자열의 비밀번호와 일치하지 않음

**해결 방법:**
- MongoDB Atlas의 비밀번호를 `hkjtop!@34`로 설정
- 또는 연결 문자열의 비밀번호를 MongoDB Atlas와 일치하도록 수정

### 확인 사항 2: 사용자 존재 여부

1. **MongoDB Atlas → Security → Database Access**
2. **`academy-admin` 사용자가 있는지 확인**
3. **없다면 새로 생성:**
   - "Add New Database User"
   - Username: `academy-admin`
   - Password: `hkjtop!@34`
   - Privileges: "Atlas admin"

### 확인 사항 3: 네트워크 액세스

1. **MongoDB Atlas → Security → Network Access**
2. **`0.0.0.0/0` (모든 IP 허용)이 있는지 확인**
3. **없다면 추가:**
   - "Add IP Address" → "Allow Access from Anywhere"

### 확인 사항 4: 재배포 확인

1. **Vercel → Deployments 탭**
2. **최신 배포가 환경 변수 수정 이후인지 확인**
3. **최신 배포가 아니라면 재배포**

---

## 연결 문자열 구성 요소 상세 분석

### 형식:
```
mongodb+srv://[사용자이름]:[인코딩된비밀번호]@[클러스터주소]/[데이터베이스이름]?[옵션]
```

### 현재 설정:
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

### 각 부분 설명:

| 부분 | 값 | 상태 |
|------|-----|------|
| 프로토콜 | `mongodb+srv://` | ✅ |
| 사용자 이름 | `academy-admin` | ✅ |
| 비밀번호 (인코딩) | `hkjtop!%4034` | ✅ (`@` → `%40`) |
| 구분자 | `@` | ✅ |
| 클러스터 주소 | `academy-cluster.eekhbti.mongodb.net` | ✅ |
| 데이터베이스 | `/academy-site` | ✅ |
| 옵션 | `?retryWrites=true&w=majority` | ✅ |

---

## 최종 확인 체크리스트

### 연결 문자열:
- [x] 프로토콜: `mongodb+srv://` ✅
- [x] 사용자 이름: `academy-admin` ✅
- [x] 비밀번호 인코딩: `hkjtop!%4034` (`@` → `%40`) ✅
- [x] 클러스터 주소: `academy-cluster.eekhbti.mongodb.net` ✅
- [x] 데이터베이스 이름: `/academy-site` ✅
- [x] 옵션: `?retryWrites=true&w=majority` ✅

### MongoDB Atlas 설정:
- [ ] 사용자: `academy-admin` 존재 확인
- [ ] 비밀번호: `hkjtop!@34` (MongoDB Atlas와 일치)
- [ ] 사용자 권한: "Atlas admin"
- [ ] Network Access: `0.0.0.0/0` 설정됨

### Vercel 설정:
- [x] `MONGODB_URI` 연결 문자열 올바름 ✅
- [ ] `MONGODB_DB_NAME`: `academy-site` (슬래시 없음)
- [ ] 재배포 완료

---

## 요약

### ✅ 연결 문자열: 올바름

현재 설정된 `MONGODB_URI` 연결 문자열은 형식과 구성이 올바릅니다:
- 비밀번호 인코딩: `hkjtop!%4034` ✅
- 데이터베이스 이름: `/academy-site` ✅
- 모든 구성 요소가 올바름 ✅

### ⚠️ 여전히 에러가 발생한다면:

1. **MongoDB Atlas의 실제 비밀번호 확인**
   - `hkjtop!@34`인지 확인
   - 다르다면 일치하도록 수정

2. **사용자 존재 확인**
   - `academy-admin` 사용자가 있는지 확인

3. **네트워크 액세스 확인**
   - `0.0.0.0/0` 설정 확인

4. **재배포 확인**
   - 환경 변수 수정 후 재배포했는지 확인

---

## 다음 단계

1. **MongoDB Atlas에서 사용자 비밀번호 확인**
2. **일치하지 않으면 수정**
3. **재배포**
4. **연결 테스트**

연결 문자열 자체는 올바르므로, MongoDB Atlas 설정을 확인하는 것이 중요합니다!

