# 🚨 긴급: Vercel 환경 변수 설정 필요

## 현재 상태

API 응답:
```json
{
  "success": false,
  "storeIdExists": false,
  "channelKeyExists": false,
  "siteUrlExists": false,
  "missingVars": [
    "NEXT_PUBLIC_PORTONE_STORE_ID",
    "NEXT_PUBLIC_PORTONE_CHANNEL_KEY",
    "NEXT_PUBLIC_SITE_URL"
  ]
}
```

**문제:** Vercel에 환경 변수가 설정되지 않았습니다!

---

## ✅ 즉시 해야 할 작업

### Step 1: Vercel 대시보드 접속

1. **https://vercel.com 접속**
2. **로그인**
3. **프로젝트 선택** (`academy-site` 또는 해당 프로젝트)

### Step 2: 환경 변수 추가

**Settings → Environment Variables → Add New**

#### 변수 1: Store ID
```
Key: NEXT_PUBLIC_PORTONE_STORE_ID
Value: store-c7408361-d836-4e72-b76c-e328a4e3c119
Environment: ✅ Production ✅ Preview ✅ Development (모두 체크)
```

#### 변수 2: Channel Key
```
Key: NEXT_PUBLIC_PORTONE_CHANNEL_KEY
Value: channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3
Environment: ✅ Production ✅ Preview ✅ Development (모두 체크)
```

#### 변수 3: Site URL
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://parplay.co.kr
Environment: ✅ Production ✅ Preview ✅ Development (모두 체크)
```

### Step 3: 저장

각 변수를 추가한 후:
1. **"Save" 또는 "Add" 버튼 클릭**
2. **모든 변수가 목록에 표시되는지 확인**

### Step 4: 배포 재시작 (필수!)

**가장 중요한 단계입니다!**

1. **Deployments 탭 클릭**
2. **최신 배포 찾기**
3. **배포 옆 "..." 메뉴 클릭**
4. **"Redeploy" 선택**
5. **"Redeploy" 확인 클릭**
6. **배포 완료 대기 (2-3분)**

**⚠️ 중요:** 환경 변수를 추가한 후 반드시 배포를 재시작해야 합니다!

---

## 🔍 확인 방법

### 배포 완료 후 확인

1. **브라우저에서 다음 URL 접속:**
   ```
   https://parplay.co.kr/api/payment/check-env
   ```

2. **다음과 같은 응답이 나와야 합니다:**
   ```json
   {
     "success": true,
     "storeIdExists": true,
     "channelKeyExists": true,
     "siteUrlExists": true,
     "storeIdPrefix": "store-c7408...",
     "channelKeyPrefix": "channel-key...",
     "nodeEnv": "production"
   }
   ```

3. **만약 여전히 `success: false`이면:**
   - 환경 변수가 제대로 저장되지 않았을 수 있습니다
   - 변수를 다시 확인하고 재설정하세요
   - 배포를 다시 재시작하세요

---

## ⚠️ 주의사항

### 변수 이름 정확히 입력

- `NEXT_PUBLIC_PORTONE_STORE_ID` (대소문자 정확히)
- `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` (대소문자 정확히)
- `NEXT_PUBLIC_SITE_URL` (대소문자 정확히)

### 값 정확히 입력

- 앞뒤 공백 없이 입력
- 따옴표 없이 입력
- 정확히 복사하여 붙여넣기

### Environment 선택

- `NEXT_PUBLIC_` 접두사가 있는 변수는 **모든 환경에 체크**해야 합니다
- Production, Preview, Development 모두 체크

---

## 📋 체크리스트

환경 변수를 추가한 후:

- [ ] `NEXT_PUBLIC_PORTONE_STORE_ID` 변수가 추가됨
- [ ] `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` 변수가 추가됨
- [ ] `NEXT_PUBLIC_SITE_URL` 변수가 추가됨
- [ ] 모든 변수가 Production 환경에 체크됨
- [ ] 변수 값이 정확함 (공백 없음)
- [ ] 배포를 재시작함 (Redeploy)
- [ ] 배포가 완료됨
- [ ] `/api/payment/check-env` API가 `success: true` 반환

---

## 🚀 빠른 해결 (5분)

1. **Vercel → Settings → Environment Variables**
2. **3개 변수 추가** (위의 값 사용)
3. **Production, Preview, Development 모두 체크**
4. **Save 클릭**
5. **Deployments → 최신 배포 → "..." → "Redeploy"**
6. **배포 완료 대기 (2-3분)**
7. **`https://parplay.co.kr/api/payment/check-env` 확인**
8. **`success: true`가 나오면 완료!**

---

## 💡 팁

- 환경 변수를 추가한 후 **반드시 배포를 재시작**해야 합니다
- 배포가 완료되면 `/api/payment/check-env` API로 확인하세요
- `success: true`가 나오면 결제 시스템이 정상적으로 작동합니다

**환경 변수를 설정하고 배포를 재시작하면 문제가 해결됩니다!** 🎉









