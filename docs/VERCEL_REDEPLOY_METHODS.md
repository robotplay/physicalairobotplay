# Vercel 배포 재시작 방법

## 🔍 문제: "..." 메뉴를 찾을 수 없음

Vercel UI가 업데이트되어 "..." 메뉴가 보이지 않을 수 있습니다. 다음 방법들을 시도해보세요.

---

## ✅ 방법 1: 배포 항목 클릭하여 재배포

### Step 1: 배포 항목 클릭
1. **Deployments 페이지에서 최신 배포 항목 클릭**
   - 예: "EKDToCvMx" 또는 가장 위에 있는 배포 클릭

2. **배포 상세 페이지로 이동**

### Step 2: Redeploy 버튼 찾기
배포 상세 페이지에서:
1. **상단 또는 우측 상단에 "Redeploy" 버튼 찾기**
2. **"Redeploy" 버튼 클릭**
3. **확인**

---

## ✅ 방법 2: Git 푸시로 자동 재배포 (가장 확실한 방법)

환경 변수를 추가한 후 Git에 작은 변경사항을 푸시하면 자동으로 재배포됩니다.

### Step 1: 작은 변경사항 만들기

터미널에서:

```bash
cd /Users/hkjtop/academy-site

# README 파일에 공백 추가 (또는 다른 작은 변경)
echo "" >> README.md

# 또는 빈 파일 생성
touch .vercel-redeploy
```

### Step 2: Git 커밋 및 푸시

```bash
git add .
git commit -m "환경 변수 적용을 위한 재배포"
git push
```

### Step 3: Vercel 자동 배포 확인

1. **Vercel 대시보드 → Deployments**
2. **새로운 배포가 시작되는지 확인**
3. **배포 완료 대기 (2-3분)**

---

## ✅ 방법 3: Vercel CLI 사용 (선택사항)

Vercel CLI를 설치하여 명령어로 재배포할 수 있습니다.

### Step 1: Vercel CLI 설치

```bash
npm install -g vercel
```

### Step 2: 로그인

```bash
vercel login
```

### Step 3: 프로젝트 디렉토리에서 재배포

```bash
cd /Users/hkjtop/academy-site
vercel --prod
```

---

## ✅ 방법 4: 환경 변수 추가 시 자동 재배포

일부 경우 환경 변수를 추가하면 자동으로 재배포가 트리거될 수 있습니다:

1. **Settings → Environment Variables**
2. **환경 변수 추가**
3. **Save 클릭**
4. **자동으로 재배포가 시작되는지 확인**

만약 자동 재배포가 시작되지 않으면 **방법 2 (Git 푸시)**를 사용하세요.

---

## 🎯 권장 방법: Git 푸시로 재배포

가장 확실하고 간단한 방법입니다:

```bash
cd /Users/hkjtop/academy-site
echo "# 재배포" >> .vercel-redeploy
git add .vercel-redeploy
git commit -m "환경 변수 적용을 위한 재배포"
git push
```

이렇게 하면:
1. Git에 푸시됨
2. Vercel이 자동으로 변경사항 감지
3. 자동으로 새 배포 시작
4. 환경 변수가 포함된 새 배포 생성

---

## 🔍 배포 상태 확인

### Vercel 대시보드에서 확인

1. **Deployments 페이지**
2. **최신 배포 확인**
3. **상태가 "Building" 또는 "Ready"인지 확인**
4. **"Ready"가 되면 배포 완료**

### 배포 완료 후 확인

배포가 완료되면:

1. **브라우저에서 확인:**
   ```
   https://parplay.co.kr/api/payment/check-env
   ```

2. **다음과 같은 응답이 나와야 합니다:**
   ```json
   {
     "success": true,
     "storeIdExists": true,
     "channelKeyExists": true,
     "siteUrlExists": true
   }
   ```

---

## 💡 팁

- **가장 확실한 방법:** Git 푸시로 자동 재배포
- **빠른 방법:** 배포 항목 클릭하여 Redeploy 버튼 찾기
- **환경 변수 추가 후:** 항상 배포가 재시작되었는지 확인

**Git 푸시 방법을 사용하면 확실하게 재배포할 수 있습니다!** 🚀




