# Vercel 프로덕션 환경 변수 설정 가이드

## 🔍 문제

프로덕션 환경(`parplay.co.kr`)에서 "결제 시스템 설정이 완료되지 않았습니다" 에러가 발생합니다.

**원인:** Vercel에 환경 변수가 설정되지 않았습니다.

---

## ✅ 해결 방법: Vercel 환경 변수 설정

### 1단계: Vercel 대시보드 접속

1. **Vercel 대시보드 접속**
   - https://vercel.com 접속
   - 로그인

2. **프로젝트 선택**
   - `academy-site` 또는 해당 프로젝트 클릭

### 2단계: 환경 변수 설정

1. **Settings 메뉴 클릭**
   - 프로젝트 페이지에서 "Settings" 탭 클릭

2. **Environment Variables 메뉴 클릭**
   - 왼쪽 메뉴에서 "Environment Variables" 클릭

3. **환경 변수 추가**

   다음 환경 변수들을 **모두 추가**하세요:

   #### 필수 환경 변수 (결제 시스템)

   ```
   NEXT_PUBLIC_PORTONE_STORE_ID=store-c7408361-d836-4e72-b76c-e328a4e3c119
   ```

   ```
   NEXT_PUBLIC_PORTONE_CHANNEL_KEY=channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3
   ```

   #### 필수 환경 변수 (사이트 설정)

   ```
   NEXT_PUBLIC_SITE_URL=https://parplay.co.kr
   ```

   #### 필수 환경 변수 (데이터베이스)

   ```
   MONGODB_URI=mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
   ```

   ```
   MONGODB_DB_NAME=academy-site
   ```

   #### 필수 환경 변수 (관리자)

   ```
   NEXT_PUBLIC_ADMIN_PASSWORD=111111
   ```
   (또는 더 강력한 비밀번호)

   #### 선택 환경 변수 (SMS - 나중에 설정 가능)

   ```
   SMS_API_KEY=your_sms_api_key
   ```

   ```
   SMS_API_URL=your_sms_api_url
   ```

   ```
   ADMIN_PHONE=010-0000-0000
   ```

### 3단계: 환경 변수 추가 방법

각 환경 변수마다:

1. **"Add New" 버튼 클릭**
2. **Key 입력**: 예) `NEXT_PUBLIC_PORTONE_STORE_ID`
3. **Value 입력**: 예) `store-c7408361-d836-4e72-b76c-e328a4e3c119`
4. **Environment 선택**: 
   - ✅ **Production** (필수)
   - ✅ **Preview** (선택)
   - ✅ **Development** (선택)
5. **"Save" 클릭**

**중요:** `NEXT_PUBLIC_` 접두사가 있는 변수는 **반드시 Production, Preview, Development 모두 선택**해야 합니다!

### 4단계: 배포 재시작

환경 변수를 추가한 후:

1. **Deployments 탭 클릭**
2. **최신 배포 옆 "..." 메뉴 클릭**
3. **"Redeploy" 선택**
4. **"Redeploy" 확인**

또는:

1. **Git에 작은 변경사항 푸시** (예: README 수정)
2. **자동 배포 트리거**

---

## 📋 환경 변수 체크리스트

다음 환경 변수들이 모두 설정되어 있는지 확인하세요:

- [ ] `NEXT_PUBLIC_PORTONE_STORE_ID`
- [ ] `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`
- [ ] `NEXT_PUBLIC_SITE_URL` (프로덕션 URL)
- [ ] `MONGODB_URI`
- [ ] `MONGODB_DB_NAME`
- [ ] `NEXT_PUBLIC_ADMIN_PASSWORD`

---

## 🔍 확인 방법

### 1. Vercel 대시보드에서 확인

1. **Settings → Environment Variables**
2. **모든 환경 변수가 추가되어 있는지 확인**
3. **Production 환경에 체크되어 있는지 확인**

### 2. 배포 후 테스트

1. **배포 완료 후** `https://parplay.co.kr/program/airplane` 접속
2. **신청서 작성 및 제출**
3. **결제 버튼 클릭**
4. **결제 창이 정상적으로 열리는지 확인**

---

## ⚠️ 중요 사항

### NEXT_PUBLIC_ 접두사

- `NEXT_PUBLIC_` 접두사가 있는 변수는 **클라이언트 사이드에서 접근 가능**합니다
- 브라우저에서 볼 수 있으므로 **민감한 정보는 포함하지 마세요**
- 결제 키는 `NEXT_PUBLIC_` 접두사가 필요합니다 (포트원 SDK가 클라이언트에서 사용)

### 프로덕션 URL

- `NEXT_PUBLIC_SITE_URL`은 **반드시 프로덕션 URL**로 설정해야 합니다
- 예: `https://parplay.co.kr` (http가 아닌 https 사용)

### 환경 변수 값 확인

현재 설정된 값 (`.env.local` 참고):

```
NEXT_PUBLIC_PORTONE_STORE_ID=store-c7408361-d836-4e72-b76c-e328a4e3c119
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3
NEXT_PUBLIC_SITE_URL=https://parplay.co.kr
MONGODB_URI=mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
MONGODB_DB_NAME=academy-site
NEXT_PUBLIC_ADMIN_PASSWORD=111111
```

---

## 🚀 빠른 설정 가이드

### Vercel 대시보드에서:

1. **프로젝트 → Settings → Environment Variables**
2. **다음 변수들을 하나씩 추가:**

```
Key: NEXT_PUBLIC_PORTONE_STORE_ID
Value: store-c7408361-d836-4e72-b76c-e328a4e3c119
Environment: Production, Preview, Development 모두 체크

Key: NEXT_PUBLIC_PORTONE_CHANNEL_KEY
Value: channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3
Environment: Production, Preview, Development 모두 체크

Key: NEXT_PUBLIC_SITE_URL
Value: https://parplay.co.kr
Environment: Production, Preview, Development 모두 체크

Key: MONGODB_URI
Value: mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
Environment: Production, Preview, Development 모두 체크

Key: MONGODB_DB_NAME
Value: academy-site
Environment: Production, Preview, Development 모두 체크

Key: NEXT_PUBLIC_ADMIN_PASSWORD
Value: 111111
Environment: Production, Preview, Development 모두 체크
```

3. **모든 변수 추가 후 배포 재시작**

---

## 📞 문제 해결

### 여전히 에러가 발생하는 경우

1. **환경 변수 확인**
   - Vercel 대시보드에서 모든 변수가 추가되어 있는지 확인
   - Production 환경에 체크되어 있는지 확인

2. **배포 재시작**
   - 환경 변수 추가 후 반드시 배포를 재시작해야 합니다

3. **빌드 로그 확인**
   - Vercel → Deployments → 최신 배포 → Build Logs
   - 에러 메시지 확인

4. **브라우저 콘솔 확인**
   - 개발자 도구(F12) → Console 탭
   - 에러 메시지 확인

---

## ✅ 완료 후

환경 변수를 모두 설정하고 배포를 재시작한 후:

1. `https://parplay.co.kr/program/airplane` 접속
2. 신청서 작성 및 제출
3. 결제 버튼 클릭
4. **결제 창이 정상적으로 열려야 합니다!**

---

## 💡 팁

- 환경 변수를 추가한 후 **반드시 배포를 재시작**해야 합니다
- `NEXT_PUBLIC_` 접두사가 있는 변수는 **모든 환경(Production, Preview, Development)에 체크**해야 합니다
- 프로덕션 URL은 **https://**로 시작해야 합니다

**환경 변수를 설정한 후 배포를 재시작하면 결제 시스템이 정상적으로 작동할 것입니다!** 🚀




