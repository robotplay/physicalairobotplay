# MONGODB_DB_NAME 올바른 값 설정

## ❌ 현재 설정 (잘못됨)

```
Name: MONGODB_DB_NAME
Value: /academy-site
```

**문제:** 슬래시(`/`)가 포함되어 있습니다.

---

## ✅ 올바른 설정

```
Name: MONGODB_DB_NAME
Value: academy-site
```

**올바름:** 슬래시 없이 데이터베이스 이름만 입력합니다.

---

## 이유 설명

### MONGODB_URI vs MONGODB_DB_NAME

**MONGODB_URI (연결 문자열):**
- 전체 연결 문자열에 데이터베이스 이름이 포함됨
- 형식: `mongodb+srv://...@cluster.net/academy-site?...`
- 슬래시(`/`) 포함: `/academy-site`

**MONGODB_DB_NAME (환경 변수):**
- 데이터베이스 이름만 저장
- 코드에서 `client.db(process.env.MONGODB_DB_NAME)`로 사용
- 슬래시(`/`) 불필요: `academy-site`

### 코드 확인

```typescript
// lib/mongodb.ts (41번째 줄)
return client.db(process.env.MONGODB_DB_NAME || 'academy-site');
```

**MongoDB의 `db()` 메서드:**
- 데이터베이스 이름만 받습니다
- 슬래시(`/`)가 있으면 오류 발생 가능

---

## 수정 방법

### Step 1: Vercel에서 수정

1. **Vercel 대시보드 → Settings → Environment Variables**
2. **`MONGODB_DB_NAME` 찾기**
3. **"Edit" 또는 Value 필드 클릭**
4. **Value 수정:**
   - 현재: `/academy-site` ❌
   - 수정: `academy-site` ✅
5. **"Save" 클릭**

### Step 2: 재배포 (필수!)

환경 변수를 수정한 후 반드시 재배포해야 합니다.

1. **Deployments 탭 클릭**
2. **최신 배포 → "..." → "Redeploy"**
3. **배포 완료 대기 (2-3분)**

---

## 최종 확인

### 올바른 환경 변수 설정:

| Key | Value | 설명 |
|-----|-------|------|
| `MONGODB_URI` | `mongodb+srv://academy-admin:hkjtop!%4034@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority` | 연결 문자열 (슬래시 포함) |
| `MONGODB_DB_NAME` | `academy-site` | 데이터베이스 이름 (슬래시 없음) |

---

## 체크리스트

- [ ] `MONGODB_DB_NAME` Value가 `academy-site`인지 확인 (슬래시 없음)
- [ ] `MONGODB_URI`에 `/academy-site`가 포함되어 있는지 확인 (슬래시 포함)
- [ ] 재배포 완료
- [ ] 연결 테스트 성공

---

## 요약

**MONGODB_DB_NAME:**
- ❌ `/academy-site` (잘못됨 - 슬래시 포함)
- ✅ `academy-site` (올바름 - 슬래시 없음)

**MONGODB_URI:**
- ✅ `...mongodb.net/academy-site?...` (올바름 - 슬래시 포함)

**핵심:**
- `MONGODB_DB_NAME`은 데이터베이스 이름만 (슬래시 없음)
- `MONGODB_URI`는 전체 연결 문자열 (슬래시 포함)
