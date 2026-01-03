# Vercel 환경 변수 빠른 설정 가이드

## 🚀 5분 안에 설정하기

### Step 1: Vercel 대시보드 접속
1. https://vercel.com 접속
2. 로그인
3. 프로젝트 선택

### Step 2: 환경 변수 추가
**Settings → Environment Variables → Add New**

다음 6개 변수를 추가하세요:

#### 1. 포트원 Store ID
```
Key: NEXT_PUBLIC_PORTONE_STORE_ID
Value: store-c7408361-d836-4e72-b76c-e328a4e3c119
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 2. 포트원 Channel Key
```
Key: NEXT_PUBLIC_PORTONE_CHANNEL_KEY
Value: channel-key-1372947c-7180-4339-ba93-0e78fb28c2d3
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 3. 사이트 URL
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://parplay.co.kr
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 4. MongoDB URI
```
Key: MONGODB_URI
Value: mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 5. MongoDB DB Name
```
Key: MONGODB_DB_NAME
Value: academy-site
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 6. 관리자 비밀번호
```
Key: NEXT_PUBLIC_ADMIN_PASSWORD
Value: 111111
Environment: ✅ Production ✅ Preview ✅ Development
```

### Step 3: 배포 재시작
1. **Deployments 탭 클릭**
2. **최신 배포 옆 "..." → "Redeploy"**
3. **배포 완료 대기 (2-3분)**

### Step 4: 테스트
1. `https://parplay.co.kr/program/airplane` 접속
2. 신청서 작성 및 제출
3. 결제 버튼 클릭
4. ✅ 결제 창이 정상적으로 열려야 합니다!

---

## ✅ 완료!

환경 변수를 설정하고 배포를 재시작하면 결제 시스템이 정상적으로 작동합니다!

**문제가 계속되면:** `docs/VERCEL_ENV_SETUP.md` 파일의 상세 가이드를 참고하세요.










