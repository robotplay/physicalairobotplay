# MongoDB 연결 문자열 비밀번호 인코딩 가이드

## 🔴 문제: 비밀번호에 특수문자가 있는 경우

비밀번호에 `@`, `#`, `%` 등의 특수문자가 있으면 MongoDB 연결 문자열에서 **URL 인코딩**이 필요합니다.

---

## 현재 연결 문자열 분석

### 제공된 연결 문자열:
```
mongodb+srv://academy-admin:hkjtop!@34@academy-cluster.eekhbti.mongodb.net/academy-site?appName=academy-cluster
```

### 문제점:

1. **비밀번호에 `@` 기호 포함**
   - 비밀번호: `hkjtop!@34`
   - `@`는 URL에서 사용자명:비밀번호와 호스트를 구분하는 예약 문자입니다
   - 따라서 `@`를 `%40`으로 인코딩해야 합니다

2. **쿼리 파라미터**
   - `?appName=academy-cluster`는 선택사항입니다
   - 일반적으로 `?retryWrites=true&w=majority`를 사용하는 것이 권장됩니다

---

## ✅ 올바른 연결 문자열

### 방법 1: 비밀번호 URL 인코딩 (권장)

**비밀번호 인코딩:**
- `hkjtop!@34` → `hkjtop!%4034`
- `@` → `%40`으로 변경

**최종 연결 문자열:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

### 방법 2: 쿼리 파라미터 포함 (선택)

`appName`을 유지하고 싶다면:
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority&appName=academy-cluster
```

---

## 🔍 비밀번호 특수문자 인코딩 규칙

| 특수문자 | 인코딩 | 예시 |
|---------|--------|------|
| `@` | `%40` | `password@123` → `password%40123` |
| `#` | `%23` | `password#123` → `password%23123` |
| `%` | `%25` | `password%123` → `password%25123` |
| `&` | `%26` | `password&123` → `password%26123` |
| `:` | `%3A` | `password:123` → `password%3A123` |
| `/` | `%2F` | `password/123` → `password%2F123` |
| `?` | `%3F` | `password?123` → `password%3F123` |
| `=` | `%3D` | `password=123` → `password%3D123` |
| `!` | `%21` | (일반적으로 인코딩 불필요) |

**참고:** `!`는 일반적으로 인코딩이 필요 없지만, 문제가 발생하면 `%21`로 인코딩할 수 있습니다.

---

## 📝 단계별 수정 방법

### Step 1: 비밀번호 확인

현재 비밀번호: `hkjtop!@34`

### Step 2: 특수문자 인코딩

- `@` → `%40`
- `!` → (일반적으로 그대로 사용 가능)

인코딩된 비밀번호: `hkjtop!%4034`

### Step 3: 연결 문자열 조합

**형식:**
```
mongodb+srv://username:encoded-password@cluster.mongodb.net/database-name?options
```

**조합:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

---

## 🧪 온라인 인코딩 도구 사용

비밀번호만 인코딩하려면:

1. **온라인 URL 인코더 사용**
   - https://www.urlencoder.org/
   - 비밀번호 부분만 입력: `hkjtop!@34`
   - 인코딩 결과: `hkjtop!%4034`

2. **수동 인코딩**
   - `@` → `%40`으로 직접 교체

---

## ✅ 최종 확인

### 올바른 연결 문자열 체크리스트:

- [ ] `mongodb+srv://`로 시작
- [ ] `academy-admin:hkjtop!%4034@` (비밀번호 인코딩됨)
- [ ] `academy-cluster.eekhbti.mongodb.net` (클러스터 주소)
- [ ] `/academy-site` (데이터베이스 이름)
- [ ] `?retryWrites=true&w=majority` (연결 옵션)

### 최종 연결 문자열:

```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

---

## ⚠️ 주의사항

### 1. 비밀번호 인코딩은 필수

비밀번호에 `@`가 있으면 반드시 `%40`으로 인코딩해야 합니다. 그렇지 않으면 MongoDB가 비밀번호를 잘못 해석합니다.

**잘못된 예:**
```
mongodb+srv://academy-admin:hkjtop!@34@academy-cluster...
                              └─────┘ └─┘
                              비밀번호 끝  호스트 시작 (잘못 해석됨!)
```

**올바른 예:**
```
mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster...
                              └─────────┘ └─┘
                              인코딩된 비밀번호  호스트 시작 (올바름!)
```

### 2. 쿼리 파라미터

- `retryWrites=true`: 쓰기 재시도 활성화 (권장)
- `w=majority`: 다수 노드에 쓰기 확인 (권장)
- `appName`: 애플리케이션 이름 (선택사항)

---

## 🔧 문제 해결

### 연결이 안 되는 경우

1. **비밀번호 인코딩 확인**
   - `@` → `%40`으로 변경했는지 확인

2. **연결 문자열 형식 확인**
   - 데이터베이스 이름이 포함되어 있는지 확인 (`/academy-site`)
   - 쿼리 파라미터가 올바른지 확인

3. **MongoDB Atlas 설정 확인**
   - Network Access: IP 화이트리스트 확인
   - Database Access: 사용자 권한 확인

---

## 📚 관련 문서

- 연결 문자열 가져오기: `/docs/MONGODB_CONNECTION_STRING_GUIDE.md`
- Vercel 환경 변수 설정: `/docs/VERCEL_MONGODB_FIX.md`

