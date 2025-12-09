# Physical AI Robot Play - Academy Website

피지컬 AI 로봇플레이 학원 웹사이트

## 🚀 기술 스택

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Language**: TypeScript
- **Deployment**: Vercel (권장)

## 📦 설치 및 실행

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 열기
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🔐 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
# 관리자 비밀번호
NEXT_PUBLIC_ADMIN_PASSWORD=111111

# 사이트 URL (프로덕션 배포 시 변경)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🌐 배포 가이드

### Vercel 배포 (권장)

1. GitHub에 코드 푸시
2. [Vercel](https://vercel.com) 가입
3. "New Project" → GitHub 저장소 선택
4. 환경 변수 설정
5. Deploy 클릭

자세한 내용은 [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) 참고

## 📁 프로젝트 구조

```
academy-site/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── admin/             # 관리자 페이지
│   ├── basic-course/      # Basic Course 페이지
│   ├── advanced-course/   # Advanced Course 페이지
│   ├── airrobot-course/   # AirRobot Course 페이지
│   └── curriculum/        # 커리큘럼 페이지
├── components/             # React 컴포넌트
├── public/                # 정적 파일
│   └── img/              # 이미지 파일
└── docs/                  # 문서
```

## 🎨 주요 기능

- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ✅ SEO 최적화
- ✅ 성능 최적화 (이미지, 코드 스플리팅)
- ✅ 접근성 개선
- ✅ 상담 문의 폼
- ✅ 관리자 페이지
- ✅ 성공 사례 섹션
- ✅ 온라인 특강 섹션

## 📝 관리자 페이지

- URL: `/admin/login`
- 기본 비밀번호: `111111` (환경 변수에서 변경 가능)
- 기능: 상담 문의 확인, 삭제, 연락

## 🔧 개발 가이드

### 새 컴포넌트 추가

```bash
# components 폴더에 새 파일 생성
touch components/NewComponent.tsx
```

### 스타일 가이드

- Tailwind CSS 사용
- 반응형: `sm:`, `md:`, `lg:`, `xl:` 브레이크포인트
- 색상: `deep-electric-blue`, `active-orange`, `neon-purple`

## 📚 문서

- [배포 가이드](./docs/DEPLOYMENT_GUIDE.md)
- [관리자 설정](./docs/ADMIN_SETUP.md)

## 🤝 기여

이 프로젝트는 Physical AI Robot Play를 위한 웹사이트입니다.

## 📄 라이선스

Private Project
