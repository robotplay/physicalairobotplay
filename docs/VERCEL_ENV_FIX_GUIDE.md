# Vercel 환경 변수 설정 완료 가이드

## 🔍 현재 상황

에러 메시지:
```
결제 시스템 설정이 완료되지 않았습니다. 
누락된 환경 변수: NEXT_PUBLIC_PORTONE_STORE_ID, NEXT_PUBLIC_PORTONE_CHANNEL_KEY. 
Vercel 대시보드에서 환경 변수를 설정하고 배포를 재시작해주세요.
```

이 에러는 **Vercel에 환경 변수가 설정되지 않았거나, 배포가 재시작되지 않았을 때** 발생합니다.

---

## ✅ 해결 방법 (단계별)

### Step 1: Vercel 환경 변수 확인

1. **Vercel 대시보드 접속**
   - https://vercel.com
   - 로그인
   - 프로젝트 선택

2. **Settings → Environment Variables**
   - 다음 변수들이 있는지 확인:
     - `NEXT_PUBLIC_PORTONE_STORE_ID`
     - `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`
     - `NEXT_PUBLIC_SITE_URL`

### Step 2: 환경 변수 추가 (없는 경우)

각 변수를 추가하세요:

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

### Step 3: 환경 변수 확인

각 변수가 다음 조건을 만족하는지 확인:

- ✅ 변수 이름이 정확함 (대소문자 정확히)
- ✅ 값이 정확함 (앞뒤 공백 없음)
- ✅ **Production 환경에 체크**되어 있음
- ✅ Preview, Development에도 체크되어 있음 (권장)

### Step 4: 배포 재시작 (필수!)

**가장 중요한 단계입니다!**

환경 변수를 추가하거나 수정한 후:

1. **Deployments 탭 클릭**
2. **최신 배포 찾기**
3. **배포 옆 "..." 메뉴 클릭**
4. **"Redeploy" 선택**
5. **"Redeploy" 확인 클릭**
6. **배포 완료 대기 (2-3분)**

**⚠️ 중요:** 환경 변수를 추가한 후 배포를 재시작하지 않으면 환경 변수가 적용되지 않습니다!

---

## 🔍 확인 방법

### 방법 1: 브라우저 콘솔 확인

1. `https://parplay.co.kr/program/airplane` 접속
2. 개발자 도구 열기 (F12)
3. Console 탭 열기
4. 결제 버튼 클릭
5. 다음 로그가 표시되어야 합니다:

```
환경 변수 확인 성공: {
  storeIdExists: true,
  channelKeyExists: true,
  siteUrlExists: true
}
```

만약 `false`가 표시되면:
- 환경 변수가 설정되지 않았거나
- 배포가 재시작되지 않았습니다

### 방법 2: API 엔드포인트 확인

브라우저에서 다음 URL 접속:
```
https://parplay.co.kr/api/payment/check-env
```

다음과 같은 응답이 나와야 합니다:

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

만약 `success: false`이면:
- 환경 변수가 Vercel에 설정되지 않았습니다
- Vercel 대시보드에서 환경 변수를 확인하세요

---

## ⚠️ 자주 발생하는 실수

### 실수 1: 배포를 재시작하지 않음

**증상:** 환경 변수를 추가했지만 여전히 에러 발생

**해결:** Deployments → Redeploy 필수!

### 실수 2: Production 환경에 체크하지 않음

**증상:** Preview나 Development에는 체크했지만 Production에는 체크하지 않음

**해결:** Production 환경에도 체크해야 합니다!

### 실수 3: 변수 이름 오타

**증상:** `NEXT_PUBLIC_PORTONE_STORE_ID` 대신 `NEXT_PUBLIC_PORTONE_STOREID` 입력

**해결:** 변수 이름을 정확히 확인하세요

### 실수 4: 값에 공백 포함

**증상:** 값 앞뒤에 공백이 포함됨

**해결:** 값 앞뒤 공백을 제거하세요

---

## 📋 최종 체크리스트

다음 항목을 모두 확인하세요:

- [ ] Vercel에 `NEXT_PUBLIC_PORTONE_STORE_ID` 변수가 있음
- [ ] Vercel에 `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` 변수가 있음
- [ ] Vercel에 `NEXT_PUBLIC_SITE_URL` 변수가 있음
- [ ] 모든 변수가 **Production 환경에 체크**되어 있음
- [ ] 변수 값이 정확함 (공백 없음, 오타 없음)
- [ ] 환경 변수 추가/수정 후 **배포를 재시작**함
- [ ] 배포가 완료되었음
- [ ] 브라우저에서 `/api/payment/check-env` 확인
- [ ] 브라우저 콘솔에서 환경 변수 확인 로그 확인

---

## 🚀 빠른 해결 (5분)

1. **Vercel → Settings → Environment Variables**
2. **3개 변수 추가 (위의 값 사용)**
3. **Production, Preview, Development 모두 체크**
4. **Save 클릭**
5. **Deployments → 최신 배포 → "..." → "Redeploy"**
6. **배포 완료 대기 (2-3분)**
7. **브라우저에서 테스트**

---

## 💡 팁

- 환경 변수를 추가한 후 **반드시 배포를 재시작**해야 합니다
- `NEXT_PUBLIC_` 접두사가 있는 변수는 **모든 환경에 체크**하는 것이 좋습니다
- 브라우저 콘솔과 `/api/payment/check-env` API로 환경 변수 확인 가능

**환경 변수를 설정하고 배포를 재시작하면 문제가 해결됩니다!** 🎉




