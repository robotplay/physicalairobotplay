# Vercel 환경 변수 문제 해결 가이드

## 🔍 문제: "결제 시스템 설정이 완료되지 않았습니다"

프로덕션 환경에서 계속 에러가 발생하는 경우, 다음을 확인하세요.

---

## ✅ 체크리스트

### 1. Vercel 환경 변수 확인

1. **Vercel 대시보드 접속**
   - https://vercel.com
   - 프로젝트 선택

2. **Settings → Environment Variables**
   - 다음 변수들이 **모두** 있는지 확인:
     - `NEXT_PUBLIC_PORTONE_STORE_ID`
     - `NEXT_PUBLIC_PORTONE_CHANNEL_KEY`
     - `NEXT_PUBLIC_SITE_URL`

3. **Environment 확인**
   - 각 변수의 **Production** 체크박스가 체크되어 있는지 확인
   - `NEXT_PUBLIC_` 접두사가 있는 변수는 **모든 환경(Production, Preview, Development)에 체크**되어야 합니다

### 2. 환경 변수 값 확인

다음 값들이 정확히 입력되어 있는지 확인:

```
NEXT_PUBLIC_PORTONE_STORE_ID=store-c7408361-d836-4e72-b76c-e328a4e3c119
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3
NEXT_PUBLIC_SITE_URL=https://parplay.co.kr
```

**주의사항:**
- 앞뒤 공백이 없어야 합니다
- 값이 정확히 복사되었는지 확인
- 따옴표나 특수문자가 포함되지 않았는지 확인

### 3. 배포 재시작 확인

환경 변수를 추가하거나 수정한 후:

1. **반드시 배포를 재시작**해야 합니다
2. **Deployments → 최신 배포 → "..." → "Redeploy"**
3. 배포가 완료될 때까지 대기 (2-3분)

---

## 🔧 문제 해결 단계

### Step 1: 환경 변수 재확인

Vercel 대시보드에서:

1. **Settings → Environment Variables**
2. **각 변수를 클릭하여 값 확인**
3. **Production 환경에 체크되어 있는지 확인**

### Step 2: 환경 변수 재설정 (필요한 경우)

환경 변수가 없거나 잘못된 경우:

1. **변수 삭제 후 재추가**
2. **값을 정확히 복사하여 입력**
3. **Production, Preview, Development 모두 체크**
4. **Save 클릭**

### Step 3: 배포 재시작

1. **Deployments 탭**
2. **최신 배포 → "..." → "Redeploy"**
3. **배포 완료 대기**

### Step 4: 브라우저 캐시 삭제

배포 후에도 문제가 있으면:

1. **브라우저 개발자 도구 열기 (F12)**
2. **Application 탭 → Clear Storage**
3. **페이지 새로고침 (Ctrl+Shift+R 또는 Cmd+Shift+R)**

---

## 🐛 디버깅 방법

### 브라우저 콘솔 확인

1. **개발자 도구 열기 (F12)**
2. **Console 탭**
3. **결제 버튼 클릭**
4. **에러 메시지 확인**

다음과 같은 로그가 표시되어야 합니다:

```
포트원 결제 요청: {
  storeId: "store-c7408...",
  channelKeyLength: 47,
  channelKeyPrefix: "channel-key...",
  nodeEnv: "production"
}
```

만약 `storeId: "없음"` 또는 `channelKeyPrefix: "없음"`이 표시되면:
- 환경 변수가 설정되지 않았거나
- 배포가 재시작되지 않았습니다

### Vercel 빌드 로그 확인

1. **Vercel → Deployments → 최신 배포**
2. **Build Logs 확인**
3. **환경 변수가 제대로 로드되었는지 확인**

---

## ⚠️ 자주 발생하는 문제

### 문제 1: 환경 변수가 설정되었지만 작동하지 않음

**원인:** 배포가 재시작되지 않음

**해결:**
1. Deployments → 최신 배포 → Redeploy
2. 또는 Git에 작은 변경사항 푸시하여 자동 배포 트리거

### 문제 2: Production 환경에만 체크하지 않음

**원인:** `NEXT_PUBLIC_` 변수가 Production에 체크되지 않음

**해결:**
1. Settings → Environment Variables
2. 각 `NEXT_PUBLIC_` 변수 클릭
3. Production 체크박스 확인
4. Save 클릭

### 문제 3: 환경 변수 값에 공백 포함

**원인:** 복사 시 앞뒤 공백이 포함됨

**해결:**
1. 환경 변수 값 재입력
2. 앞뒤 공백 제거
3. Save 클릭

### 문제 4: 환경 변수 이름 오타

**원인:** 변수 이름이 정확하지 않음

**해결:**
정확한 변수 이름 확인:
- `NEXT_PUBLIC_PORTONE_STORE_ID` (대소문자 정확히)
- `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` (대소문자 정확히)

---

## 📋 최종 확인 사항

다음 항목을 모두 확인하세요:

- [ ] Vercel에 `NEXT_PUBLIC_PORTONE_STORE_ID` 변수가 있음
- [ ] Vercel에 `NEXT_PUBLIC_PORTONE_CHANNEL_KEY` 변수가 있음
- [ ] 두 변수 모두 **Production 환경에 체크**되어 있음
- [ ] 변수 값이 정확함 (공백 없음)
- [ ] 환경 변수 추가/수정 후 **배포를 재시작**함
- [ ] 배포가 완료되었음
- [ ] 브라우저 캐시를 삭제하고 테스트함

---

## 🚀 빠른 해결 방법

### 방법 1: 환경 변수 재설정

1. Vercel → Settings → Environment Variables
2. 기존 변수 삭제
3. 변수 재추가 (값 정확히 입력)
4. Production, Preview, Development 모두 체크
5. Save
6. Deployments → Redeploy

### 방법 2: Git 푸시로 재배포

1. 작은 변경사항 커밋 (예: README 수정)
2. Git push
3. Vercel 자동 배포 대기

---

## 💡 팁

- 환경 변수를 추가/수정한 후 **반드시 배포를 재시작**해야 합니다
- `NEXT_PUBLIC_` 접두사가 있는 변수는 **모든 환경에 체크**해야 합니다
- 브라우저 콘솔에서 환경 변수가 로드되었는지 확인할 수 있습니다

**문제가 계속되면 Vercel 지원팀에 문의하거나, 빌드 로그를 확인하세요!**









