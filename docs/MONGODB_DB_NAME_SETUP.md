# MONGODB_DB_NAME 환경 변수 설정 가이드

## MONGODB_DB_NAME이 필요한가요?

### 선택사항이지만 권장됩니다

`MONGODB_DB_NAME`은 **선택사항**이지만, 명시적으로 설정하는 것을 **권장**합니다.

**이유:**
- 코드에서 기본값(`academy-site`)을 사용하지만, 명시적으로 설정하면 더 명확합니다
- 다른 환경(개발/프로덕션)에서 다른 데이터베이스를 사용할 수 있습니다
- 설정 파일에서 한눈에 확인할 수 있습니다

**현재 코드 동작:**
```typescript
// lib/mongodb.ts
return client.db(process.env.MONGODB_DB_NAME || 'academy-site');
```

- `MONGODB_DB_NAME`이 설정되어 있으면 → 해당 값 사용
- 설정되어 있지 않으면 → 기본값 `academy-site` 사용

---

## Vercel에 설정하는 방법

### Step 1: Vercel 대시보드 접속

1. **브라우저에서 https://vercel.com 접속**
2. **로그인**
3. **프로젝트 선택**
   - `academy-site` 또는 해당 프로젝트 클릭

### Step 2: Settings 메뉴로 이동

1. **프로젝트 페이지 상단의 "Settings" 탭 클릭**
2. **왼쪽 메뉴에서 "Environment Variables" 클릭**

### Step 3: MONGODB_DB_NAME 추가

1. **"Add New" 버튼 클릭**
   - 페이지 오른쪽 상단 또는 목록 위에 있음

2. **Key 입력**
   - **Key:** `MONGODB_DB_NAME`
   - ⚠️ 대소문자 정확히 입력 (모두 대문자)
   - 공백 없이 입력

3. **Value 입력**
   - **Value:** `academy-site`
   - 소문자로 입력
   - 하이픈(`-`) 포함

4. **Environment 선택**
   - ✅ **Production** (필수!)
   - ✅ **Preview** (권장)
   - ✅ **Development** (선택)
   
   **⚠️ 중요:** Production은 반드시 체크해야 합니다!

5. **"Save" 버튼 클릭**
   - 또는 "Add" 버튼 클릭
   - 환경 변수가 목록에 추가됨

### Step 4: 설정 확인

**환경 변수 목록에서 확인:**
- `MONGODB_DB_NAME`이 목록에 표시되는지 확인
- Value가 `academy-site`로 표시되는지 확인
- Production, Preview, Development 체크박스가 체크되어 있는지 확인

---

## 설정 예시

### Vercel 환경 변수 설정 화면:

```
┌─────────────────────────────────────────┐
│ Environment Variables                    │
├─────────────────────────────────────────┤
│ Add New                                 │
├─────────────────────────────────────────┤
│ Key: MONGODB_DB_NAME                    │
│ Value: academy-site                     │
│ Environment:                            │
│   ☑ Production                          │
│   ☑ Preview                             │
│   ☑ Development                         │
│                                         │
│   [Cancel]  [Save]                      │
└─────────────────────────────────────────┘
```

---

## 전체 환경 변수 목록 확인

설정 완료 후 다음 환경 변수들이 모두 있어야 합니다:

### 필수 환경 변수 (6개):

1. ✅ `MONGODB_URI` - MongoDB 연결 문자열
2. ✅ `MONGODB_DB_NAME` - 데이터베이스 이름 (방금 추가)
3. ✅ `NEXT_PUBLIC_SITE_URL` - 사이트 URL
4. ✅ `NEXT_PUBLIC_PORTONE_STORE_ID` - 포트원 Store ID
5. ✅ `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` - 포트원 Channel Key
6. ✅ `NEXT_PUBLIC_ADMIN_PASSWORD` - 관리자 비밀번호

---

## 재배포 필요 여부

### MONGODB_DB_NAME만 추가하는 경우

**재배포가 필요합니다!**

환경 변수를 추가한 후 반드시 재배포해야 적용됩니다.

**재배포 방법:**

#### 방법 1: Vercel 대시보드에서 재배포 (권장)

1. **"Deployments" 탭 클릭**
2. **최신 배포 찾기**
3. **배포 카드 오른쪽 상단의 "..." (점 3개) 버튼 클릭**
4. **"Redeploy" 선택**
5. **확인 창에서 "Redeploy" 클릭**
6. **배포 완료 대기 (약 2-3분)**

#### 방법 2: Git 푸시로 자동 재배포

```bash
git commit --allow-empty -m "trigger redeploy for MONGODB_DB_NAME"
git push origin main
```

---

## 확인 방법

### Step 1: 배포 완료 확인

1. **Deployments 탭에서 배포 상태 확인**
   - "Building" → "Ready"로 변경되면 완료

### Step 2: 연결 테스트

배포 완료 후 (2-3분):

1. **브라우저에서 접속:**
   ```
   https://parplay.co.kr/api/news/test
   ```

2. **정상 응답 확인:**
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

### Step 3: 관리자 페이지에서 확인

1. **https://parplay.co.kr/admin 접속**
2. **공지사항 탭 클릭**
3. **"연결 테스트" 버튼 클릭**
4. **정상 응답 확인**

---

## 문제 해결

### MONGODB_DB_NAME을 설정하지 않아도 되나요?

**답:** 네, 설정하지 않아도 됩니다. 하지만 권장됩니다.

**이유:**
- 코드에서 기본값 `academy-site`를 사용합니다
- 하지만 명시적으로 설정하면 더 명확하고 관리하기 쉽습니다

### MONGODB_DB_NAME을 다른 값으로 설정할 수 있나요?

**답:** 네, 가능합니다.

**예시:**
- 개발 환경: `academy-site-dev`
- 프로덕션 환경: `academy-site`
- 테스트 환경: `academy-site-test`

**주의:**
- 연결 문자열(`MONGODB_URI`)의 데이터베이스 이름과 일치해야 합니다
- 예: `MONGODB_URI`에 `/academy-site`가 있으면 `MONGODB_DB_NAME`도 `academy-site`여야 합니다

### MONGODB_URI와 MONGODB_DB_NAME의 관계

**MONGODB_URI에 데이터베이스 이름이 포함된 경우:**
```
mongodb+srv://...@cluster.mongodb.net/academy-site?...
                                              └─────────┘
                                              이 부분이 데이터베이스 이름
```

**이 경우:**
- `MONGODB_DB_NAME`을 설정하면 → `MONGODB_DB_NAME` 값 사용
- `MONGODB_DB_NAME`을 설정하지 않으면 → URI의 `/academy-site` 사용 (코드에서 기본값 사용)

**권장:**
- `MONGODB_URI`에 데이터베이스 이름 포함 (`/academy-site`)
- `MONGODB_DB_NAME`도 명시적으로 설정 (`academy-site`)
- 둘 다 같은 값으로 설정

---

## 체크리스트

- [ ] Vercel 대시보드 접속 완료
- [ ] Settings → Environment Variables 메뉴로 이동 완료
- [ ] "Add New" 버튼 클릭 완료
- [ ] Key: `MONGODB_DB_NAME` 입력 완료
- [ ] Value: `academy-site` 입력 완료
- [ ] Environment: Production, Preview, Development 모두 체크 완료
- [ ] "Save" 버튼 클릭 완료
- [ ] 환경 변수 목록에 추가되었는지 확인 완료
- [ ] 재배포 완료
- [ ] `/api/news/test`에서 연결 확인 완료

---

## 요약

### 설정해야 할 값:

- **Key:** `MONGODB_DB_NAME`
- **Value:** `academy-site`
- **Environment:** Production, Preview, Development 모두 체크

### 중요 사항:

- ✅ 선택사항이지만 권장됩니다
- ✅ 재배포가 필요합니다
- ✅ `MONGODB_URI`의 데이터베이스 이름과 일치해야 합니다

---

## 다음 단계

`MONGODB_DB_NAME` 설정 완료 후:

1. **재배포 완료**
2. **연결 테스트 확인**
3. **공지사항 작성 테스트**

모든 환경 변수가 설정되었는지 확인하세요!





