# 🚨 긴급: 누락된 환경 변수 추가 필요

## 현재 상태

API 응답:
```json
{
  "success": false,
  "storeIdExists": true,
  "channelKeyExists": false,
  "siteUrlExists": false,
  "missingVars": [
    "NEXT_PUBLIC_PORTONE_CHANNEL_KEY",
    "NEXT_PUBLIC_SITE_URL"
  ]
}
```

**문제:** `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`가 없어서 결제 시스템이 작동하지 않습니다!

---

## ✅ 즉시 해야 할 작업

### Step 1: Vercel 대시보드 접속

1. **https://vercel.com 접속**
2. **로그인**
3. **프로젝트 선택** (`academy-site` 또는 해당 프로젝트)

### Step 2: 누락된 환경 변수 추가

**Settings → Environment Variables → Add New**

#### 변수 1: Channel Key (필수!)
```
Key: NEXT_PUBLIC_PORTONE_CHANNEL_KEY
Value: channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3
Environment: ✅ Production ✅ Preview ✅ Development (모두 체크!)
```

**⚠️ 중요:** 이 변수가 없으면 결제가 불가능합니다!

#### 변수 2: Site URL (선택사항, 권장)
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://parplay.co.kr
Environment: ✅ Production ✅ Preview ✅ Development (모두 체크!)
```

**참고:** 이 변수가 없어도 동적으로 생성되지만, 명시적으로 설정하는 것을 권장합니다.

### Step 3: 저장 및 확인

1. **각 변수를 추가한 후 "Save" 또는 "Add" 버튼 클릭**
2. **변수 목록에서 다음이 모두 있는지 확인:**
   - ✅ `NEXT_PUBLIC_PORTONE_STORE_ID` (이미 있음)
   - ✅ `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` (추가 필요!)
   - ✅ `NEXT_PUBLIC_SITE_URL` (추가 권장)

3. **각 변수의 "Production" 체크박스가 체크되어 있는지 확인**

### Step 4: 배포 자동 재시작

환경 변수를 추가하면 Vercel이 자동으로 배포를 재시작합니다.

**배포 상태 확인:**
1. **Deployments 탭 클릭**
2. **새로운 배포가 시작되었는지 확인**
3. **배포 완료 대기 (2-3분)**

---

## 🔍 확인 방법

### 1. Vercel 대시보드에서 확인

**Settings → Environment Variables**에서:
- ✅ `NEXT_PUBLIC_PORTONE_STORE_ID` 존재
- ✅ `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` 존재 (추가 필요!)
- ✅ `NEXT_PUBLIC_SITE_URL` 존재 (추가 권장)
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
2. **신청서 작성 및 제출**
3. **결제 버튼 클릭**
4. **"결제 시스템 준비 중..." 메시지가 사라지고 정상 버튼이 표시되는지 확인**
5. **결제 창이 정상적으로 열리는지 확인**

---

## ⚠️ 중요 사항

### Production 체크박스 필수!

환경 변수를 추가할 때 **반드시 Production 환경에 체크**해야 합니다!

- ❌ Production 체크 안 함 → 프로덕션에서 변수 사용 불가
- ✅ Production 체크 함 → 프로덕션에서 변수 사용 가능

### 변수 이름 정확히!

대소문자를 정확히 입력하세요:
- ✅ `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` (정확)
- ❌ `NEXT_PUBLIC_PORTONE_channel_key` (오류)
- ❌ `next_public_portone_channel_key` (오류)

### 값 앞뒤 공백 없이!

값을 입력할 때 앞뒤 공백이 없어야 합니다:
- ✅ `channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3` (정확)
- ❌ ` channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3 ` (공백 포함, 오류)

---

## 🆘 여전히 작동하지 않으면

1. **Vercel 대시보드에서 환경 변수 다시 확인**
   - 변수 이름이 정확한지
   - 값이 정확한지
   - Production 체크박스가 체크되어 있는지

2. **배포 로그 확인**
   - Deployments → 최신 배포 → Logs
   - 환경 변수 관련 에러가 있는지 확인

3. **브라우저 콘솔 확인**
   - F12 → Console 탭
   - 에러 메시지 확인

4. **API 응답 확인**
   - `https://parplay.co.kr/api/payment/check-env` 접속
   - 응답 내용 확인

---

## 📞 추가 도움이 필요하면

다음 정보를 제공해주세요:
- Vercel 대시보드 스크린샷 (Environment Variables 페이지)
- `/api/payment/check-env` API 응답
- 브라우저 콘솔 에러 메시지
- 배포 로그 (에러가 있는 경우)




