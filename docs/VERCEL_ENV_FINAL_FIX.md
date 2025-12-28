# 🚨 최종 해결: Vercel 환경 변수 설정 (필수!)

## 현재 문제

API 응답:
```json
{
  "success": false,
  "storeIdExists": false,
  "channelKeyExists": false,
  "siteUrlExists": false
}
```

**원인:** Vercel에 환경 변수가 설정되지 않았습니다.

---

## ✅ 즉시 해야 할 작업

### Step 1: Vercel 대시보드 접속

1. **https://vercel.com 접속**
2. **로그인**
3. **프로젝트 선택** (`academy-site` 또는 해당 프로젝트)

### Step 2: 환경 변수 추가 (Settings → Environment Variables)

**각 변수를 하나씩 추가하세요:**

#### 변수 1: Store ID
```
Key: NEXT_PUBLIC_PORTONE_STORE_ID
Value: store-c7408361-d836-4e72-b76c-e328a4e3c119
Environment: ✅ Production ✅ Preview ✅ Development (모두 체크!)
```

#### 변수 2: Channel Key
```
Key: NEXT_PUBLIC_PORTONE_CHANNEL_KEY
Value: channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3
Environment: ✅ Production ✅ Preview ✅ Development (모두 체크!)
```

#### 변수 3: Site URL
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://parplay.co.kr
Environment: ✅ Production ✅ Preview ✅ Development (모두 체크!)
```

### Step 3: 저장 확인

각 변수를 추가한 후:
1. **"Save" 또는 "Add" 버튼 클릭**
2. **변수 목록에 3개가 모두 표시되는지 확인**
3. **각 변수의 "Production" 체크박스가 체크되어 있는지 확인**

### Step 4: 배포 재시작 (가장 중요!)

환경 변수를 추가한 후 **반드시 배포를 재시작**해야 합니다!

#### 방법 1: Git 푸시 (가장 간단)
```bash
# 이미 코드가 푸시되었으므로 Vercel이 자동으로 배포합니다
# Vercel 대시보드에서 배포 상태를 확인하세요
```

#### 방법 2: Vercel 대시보드에서 수동 재배포
1. **Deployments 탭 클릭**
2. **최신 배포 찾기**
3. **배포 카드에서 "..." 메뉴 클릭**
4. **"Redeploy" 선택** (없으면 "Redeploy" 버튼 클릭)
5. **"Redeploy" 확인**
6. **배포 완료 대기 (2-3분)**

---

## 🔍 확인 방법

### 1. Vercel 대시보드에서 확인

**Settings → Environment Variables**에서:
- ✅ `NEXT_PUBLIC_PORTONE_STORE_ID` 존재
- ✅ `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` 존재
- ✅ `NEXT_PUBLIC_SITE_URL` 존재
- ✅ 각 변수의 **Production** 체크박스가 체크됨

### 2. 배포 후 API 확인

배포가 완료되면 브라우저에서 다음 URL 접속:
```
https://parplay.co.kr/api/payment/check-env
```

**성공 응답 예시:**
```json
{
  "success": true,
  "storeIdExists": true,
  "channelKeyExists": true,
  "siteUrlExists": true,
  "storeId": "store-c7408361-d836-4e72-b76c-e328a4e3c119",
  "channelKey": "channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3",
  "siteUrl": "https://parplay.co.kr"
}
```

### 3. 결제 버튼 테스트

1. **https://parplay.co.kr/program/airplane 접속**
2. **신청서 작성**
3. **결제 버튼 클릭**
4. **결제 창이 정상적으로 열리는지 확인**

---

## ⚠️ 중요 사항

### Production 체크박스 필수!

환경 변수를 추가할 때 **반드시 Production 환경에 체크**해야 합니다!

- ❌ Production 체크 안 함 → 프로덕션에서 변수 사용 불가
- ✅ Production 체크 함 → 프로덕션에서 변수 사용 가능

### 배포 재시작 필수!

환경 변수를 추가/수정한 후:
- ❌ 배포 재시작 안 함 → 환경 변수 적용 안 됨
- ✅ 배포 재시작 함 → 환경 변수 적용됨

### 변수 이름 정확히!

대소문자를 정확히 입력하세요:
- ✅ `NEXT_PUBLIC_PORTONE_STORE_ID` (정확)
- ❌ `NEXT_PUBLIC_PORTONE_STORE_id` (오류)
- ❌ `next_public_portone_store_id` (오류)

---

## 🆘 여전히 작동하지 않으면

1. **Vercel 대시보드에서 환경 변수 다시 확인**
2. **각 변수의 Production 체크박스 확인**
3. **배포 로그 확인** (Deployments → 최신 배포 → Logs)
4. **브라우저 콘솔 확인** (F12 → Console)
5. **`/api/payment/check-env` API 응답 확인**

---

## 📞 추가 도움이 필요하면

다음 정보를 제공해주세요:
- Vercel 대시보드 스크린샷 (Environment Variables 페이지)
- `/api/payment/check-env` API 응답
- 브라우저 콘솔 에러 메시지







