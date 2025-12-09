# 웹 호스팅 배포 가이드

## 🏆 추천 순위

### 1순위: Vercel (가장 추천) ⭐⭐⭐⭐⭐

**왜 Vercel인가?**
- Next.js를 만든 회사가 운영하는 플랫폼
- Next.js에 완벽하게 최적화됨
- 무료 플랜 제공 (개인/소규모 프로젝트 충분)
- 자동 배포 (Git 연동)
- CDN 자동 설정
- Serverless Functions 내장 (API 라우트 지원)

**장점:**
- ✅ 설정이 매우 간단 (GitHub 연결만 하면 됨)
- ✅ 무료 플랜: 무제한 프로젝트, 100GB 대역폭
- ✅ 자동 HTTPS
- ✅ 환경 변수 관리 쉬움
- ✅ 한국 사용자 접근성 좋음 (글로벌 CDN)

**단점:**
- ❌ 무료 플랜은 서버리스 함수 실행 시간 제한 (충분함)
- ❌ 데이터베이스는 별도 필요 (MongoDB Atlas 등)

**비용:**
- 무료 플랜: 개인 프로젝트 충분
- Pro 플랜: $20/월 (팀 협업, 더 많은 리소스)

**배포 방법:**
1. GitHub에 코드 푸시
2. Vercel.com 가입
3. "New Project" 클릭
4. GitHub 저장소 선택
5. 환경 변수 설정 (NEXT_PUBLIC_ADMIN_PASSWORD 등)
6. Deploy 클릭 → 완료!

**데이터베이스 연동:**
- MongoDB Atlas (무료 플랜 있음) 추천
- Vercel Postgres (Pro 플랜 필요)

---

### 2순위: Railway ⭐⭐⭐⭐

**장점:**
- ✅ 간단한 설정
- ✅ 데이터베이스 내장 (PostgreSQL)
- ✅ 합리적인 가격 ($5/월부터)
- ✅ 한국 사용자 접근성 좋음

**단점:**
- ❌ Vercel만큼 Next.js 최적화는 아님
- ❌ 무료 플랜 제한적

**비용:**
- 무료 크레딧: $5 (테스트용)
- Hobby: $5/월
- Pro: $20/월

**배포 방법:**
1. Railway.app 가입
2. "New Project" → "Deploy from GitHub"
3. 저장소 선택
4. 환경 변수 설정
5. 자동 배포

---

### 3순위: Netlify ⭐⭐⭐⭐

**장점:**
- ✅ 무료 플랜 제공
- ✅ 간단한 설정
- ✅ 좋은 CDN

**단점:**
- ❌ Next.js 최적화는 Vercel보다 약함
- ❌ Serverless Functions 제한적

**비용:**
- 무료 플랜 제공
- Pro: $19/월

---

### 4순위: Render ⭐⭐⭐

**장점:**
- ✅ 무료 플랜 제공
- ✅ 간단한 설정
- ✅ 데이터베이스 옵션

**단점:**
- ❌ 무료 플랜은 서비스가 15분 비활성 시 슬리프 모드
- ❌ 첫 로딩이 느릴 수 있음

**비용:**
- 무료 플랜 (제한적)
- Starter: $7/월

---

## 🚫 비추천 (이 프로젝트에는)

### AWS / GCP / Azure
- ❌ 설정이 복잡함
- ❌ 비용이 높을 수 있음
- ❌ Next.js 특화 플랫폼이 아님
- ✅ 대규모 프로젝트에는 적합

---

## 📊 비교표

| 플랫폼 | 무료 플랜 | 설정 난이도 | Next.js 최적화 | 데이터베이스 | 추천도 |
|--------|----------|------------|---------------|------------|--------|
| **Vercel** | ✅ | ⭐ 매우 쉬움 | ⭐⭐⭐⭐⭐ | 별도 필요 | 🏆 최고 |
| **Railway** | 제한적 | ⭐⭐ 쉬움 | ⭐⭐⭐⭐ | 내장 | 👍 좋음 |
| **Netlify** | ✅ | ⭐⭐ 쉬움 | ⭐⭐⭐⭐ | 별도 필요 | 👍 좋음 |
| **Render** | 제한적 | ⭐⭐ 쉬움 | ⭐⭐⭐ | 옵션 | 보통 |

---

## 🎯 최종 추천: Vercel

### 이유
1. **Next.js 최적화**: 가장 빠르고 안정적
2. **무료 플랜**: 개인/소규모 프로젝트에 충분
3. **설정 간단**: 5분이면 배포 완료
4. **자동 배포**: Git 푸시 시 자동 업데이트
5. **글로벌 CDN**: 한국 사용자 접근성 좋음

### 데이터베이스 추천
- **MongoDB Atlas**: 무료 플랜 512MB (충분함)
- **Supabase**: 무료 플랜, PostgreSQL
- **PlanetScale**: 무료 플랜, MySQL

---

## 📝 배포 전 체크리스트

### 1. 환경 변수 설정
```env
NEXT_PUBLIC_ADMIN_PASSWORD=111111
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2. Git 저장소 준비
- GitHub/GitLab/Bitbucket에 코드 푸시
- `.env.local`은 커밋하지 않음 (이미 .gitignore에 포함)

### 3. 빌드 확인
```bash
npm run build
```
- 빌드 성공 확인

### 4. 프로덕션 최적화
- ✅ 이미 완료됨 (이미지 최적화, 코드 스플리팅 등)

---

## 🚀 Vercel 배포 단계별 가이드

### Step 1: GitHub에 코드 푸시
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### Step 2: Vercel 가입 및 연결
1. https://vercel.com 접속
2. "Sign Up" → GitHub 계정으로 가입
3. "New Project" 클릭
4. GitHub 저장소 선택
5. "Import" 클릭

### Step 3: 프로젝트 설정
- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동)
- **Output Directory**: `.next` (자동)

### Step 4: 환경 변수 설정
- Settings → Environment Variables
- 추가할 변수:
  - `NEXT_PUBLIC_ADMIN_PASSWORD`: `111111` (또는 더 강력한 비밀번호)
  - `NEXT_PUBLIC_SITE_URL`: `https://your-project.vercel.app`

### Step 5: 배포
- "Deploy" 클릭
- 2-3분 후 배포 완료
- 자동으로 URL 생성: `https://your-project.vercel.app`

### Step 6: 커스텀 도메인 (선택)
- Settings → Domains
- 도메인 추가 (예: `physical-ai-robot-play.com`)

---

## 💾 데이터베이스 설정 (Admin 페이지용)

### MongoDB Atlas 설정 (무료)

1. **MongoDB Atlas 가입**
   - https://www.mongodb.com/cloud/atlas 접속
   - 무료 클러스터 생성 (M0)

2. **데이터베이스 연결**
   - Connection String 복사
   - Vercel 환경 변수에 추가: `MONGODB_URI`

3. **API 라우트 생성**
   - `/app/api/consultations/route.ts` 생성
   - MongoDB 연동 코드 작성

### Supabase 설정 (무료, PostgreSQL)

1. **Supabase 가입**
   - https://supabase.com 접속
   - 새 프로젝트 생성

2. **연결 정보**
   - Connection String 복사
   - Vercel 환경 변수에 추가

---

## 🔒 보안 강화 (프로덕션)

### 필수 사항
1. ✅ 강력한 비밀번호 사용 (111111 → 복잡한 비밀번호)
2. ✅ HTTPS 사용 (Vercel 자동)
3. ✅ 환경 변수로 비밀번호 관리
4. ⚠️ 서버 사이드 인증 구현 (현재는 클라이언트 사이드)

### 권장 사항
- Rate Limiting 추가
- CSRF 보호
- 입력 검증 강화

---

## 📞 지원 및 도움말

### Vercel 문서
- https://vercel.com/docs
- 한국어 지원: 제한적 (영어 문서)

### 문제 해결
- Vercel Dashboard → Logs에서 에러 확인
- Build Logs에서 빌드 오류 확인

---

## 💡 최종 권장사항

**지금 당장 배포하려면:**
1. ✅ **Vercel** 사용 (가장 쉬움)
2. ✅ **MongoDB Atlas** 무료 플랜으로 데이터베이스 연동
3. ✅ GitHub에 코드 푸시 후 Vercel 연결

**예상 소요 시간:** 10-15분

**비용:** 무료 (개인 프로젝트 기준)

