# Vercel Analytics 설정 가이드

## 📋 개요

Vercel Analytics를 사용하여 페이지뷰, 방문자 수, 성능 메트릭을 추적합니다.

---

## ✅ 완료된 작업

### 1. 패키지 설치
- ✅ `@vercel/analytics` - 페이지뷰 및 방문자 추적
- ✅ `@vercel/speed-insights` - 성능 메트릭 수집

### 2. 코드 통합
- ✅ `app/layout.tsx`에 Analytics 및 SpeedInsights 컴포넌트 추가
- ✅ 모든 페이지에 자동 적용

---

## 🚀 Vercel 대시보드에서 활성화

### 1단계: Vercel 대시보드 접속
1. [Vercel 대시보드](https://vercel.com) 접속
2. 프로젝트 선택 (`academy-site` 또는 해당 프로젝트)

### 2단계: Analytics 활성화
1. 프로젝트 페이지에서 **"Analytics"** 탭 클릭
2. **"Enable Analytics"** 버튼 클릭
3. 플랜 선택:
   - **Hobby (무료)**: 2,500 이벤트/월
   - **Pro**: 100,000 이벤트/월
   - **Enterprise**: 무제한

### 3단계: Speed Insights 활성화
1. 프로젝트 페이지에서 **"Speed Insights"** 탭 클릭
2. **"Enable Speed Insights"** 버튼 클릭
3. 자동으로 활성화됨

---

## 📊 수집되는 데이터

### Analytics (페이지뷰 추적)
- **페이지뷰**: 각 페이지 방문 횟수
- **고유 방문자**: 중복 제거된 방문자 수
- **Top Pages**: 가장 많이 방문한 페이지
- **Referrers**: 유입 경로 (검색엔진, 소셜미디어 등)
- **Countries**: 방문자 국가
- **Devices**: 데스크톱/모바일/태블릿 비율
- **Browsers**: 브라우저 종류 및 버전

### Speed Insights (성능 메트릭)
- **FCP (First Contentful Paint)**: 첫 콘텐츠 표시 시간
- **LCP (Largest Contentful Paint)**: 최대 콘텐츠 표시 시간
- **FID (First Input Delay)**: 첫 입력 지연 시간
- **CLS (Cumulative Layout Shift)**: 누적 레이아웃 이동
- **TTFB (Time to First Byte)**: 첫 바이트까지의 시간
- **INP (Interaction to Next Paint)**: 상호작용 응답 시간

---

## 🔍 데이터 확인 방법

### Analytics 대시보드
1. Vercel 대시보드 → 프로젝트 선택
2. **"Analytics"** 탭 클릭
3. 다음 정보 확인:
   - **Overview**: 전체 통계 요약
   - **Pages**: 페이지별 통계
   - **Referrers**: 유입 경로
   - **Countries**: 국가별 방문자
   - **Devices**: 디바이스별 통계

### Speed Insights 대시보드
1. Vercel 대시보드 → 프로젝트 선택
2. **"Speed Insights"** 탭 클릭
3. 다음 정보 확인:
   - **Performance Score**: 전체 성능 점수
   - **Core Web Vitals**: 주요 웹 성능 지표
   - **Page Performance**: 페이지별 성능
   - **Device Performance**: 디바이스별 성능

---

## 📈 실시간 모니터링

### 실시간 데이터 확인
1. Vercel 대시보드 → Analytics
2. **"Real-time"** 또는 **"Live"** 모드 활성화
3. 실시간 방문자 및 페이지뷰 확인

### 시간대별 필터
- **Last 24 hours**: 최근 24시간
- **Last 7 days**: 최근 7일
- **Last 30 days**: 최근 30일
- **Custom**: 사용자 지정 기간

---

## 🎯 주요 메트릭 설명

### 페이지뷰 메트릭

#### 1. Page Views (페이지뷰)
- **정의**: 페이지가 로드된 총 횟수
- **활용**: 인기 페이지 파악, 트래픽 추이 분석

#### 2. Unique Visitors (고유 방문자)
- **정의**: 중복 제거된 방문자 수
- **활용**: 실제 사용자 수 파악

#### 3. Bounce Rate (이탈률)
- **정의**: 한 페이지만 보고 떠난 방문자 비율
- **활용**: 콘텐츠 품질 평가

### 성능 메트릭

#### 1. FCP (First Contentful Paint)
- **목표**: < 1.8초
- **의미**: 사용자가 콘텐츠를 처음 본 시간
- **개선**: 이미지 최적화, CSS 최적화

#### 2. LCP (Largest Contentful Paint)
- **목표**: < 2.5초
- **의미**: 가장 큰 콘텐츠가 표시된 시간
- **개선**: 이미지 최적화, 서버 응답 시간 개선

#### 3. CLS (Cumulative Layout Shift)
- **목표**: < 0.1
- **의미**: 레이아웃이 얼마나 이동했는지
- **개선**: 이미지 크기 지정, 폰트 최적화

#### 4. TTFB (Time to First Byte)
- **목표**: < 600ms
- **의미**: 서버 응답 시간
- **개선**: CDN 사용, 서버 최적화

---

## 🔧 고급 설정

### 커스텀 이벤트 추적

특정 사용자 행동을 추적하려면:

```typescript
import { track } from '@vercel/analytics';

// 버튼 클릭 추적
track('button_click', {
  button_name: '수강신청',
  page: '/basic-course',
});

// 폼 제출 추적
track('form_submit', {
  form_name: '상담신청',
  success: true,
});
```

### 페이지별 추적 제외

특정 페이지를 추적에서 제외하려면:

```typescript
// app/admin/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function AdminLayout({ children }) {
  return (
    <>
      {children}
      {/* Analytics 제외 */}
    </>
  );
}
```

---

## 📊 데이터 분석 팁

### 1. 인기 페이지 파악
- Analytics → Pages 탭
- 가장 많이 방문한 페이지 확인
- 콘텐츠 전략 수립

### 2. 유입 경로 분석
- Analytics → Referrers 탭
- 주요 유입 경로 파악
- 마케팅 전략 최적화

### 3. 성능 문제 페이지 찾기
- Speed Insights → Page Performance
- 느린 페이지 확인
- 우선순위 개선

### 4. 디바이스별 최적화
- Analytics → Devices
- 모바일/데스크톱 비율 확인
- 디바이스별 최적화

---

## ✅ 설정 확인 체크리스트

### 코드 설정
- [x] `@vercel/analytics` 패키지 설치
- [x] `@vercel/speed-insights` 패키지 설치
- [x] `app/layout.tsx`에 컴포넌트 추가
- [ ] 개발 서버 재시작
- [ ] 로컬에서 테스트

### Vercel 대시보드 설정
- [ ] Vercel 대시보드 접속
- [ ] Analytics 활성화
- [ ] Speed Insights 활성화
- [ ] 플랜 선택 (무료/유료)

### 배포 및 확인
- [ ] 프로덕션 배포
- [ ] Analytics 대시보드에서 데이터 확인
- [ ] Speed Insights 대시보드에서 데이터 확인
- [ ] 실시간 데이터 확인

---

## 🚀 배포 및 테스트

### 1단계: 로컬 테스트
```bash
# 개발 서버 재시작
npm run dev

# 브라우저에서 접속
http://localhost:3000

# 브라우저 콘솔 확인 (F12)
# Vercel Analytics 로그 확인
```

### 2단계: 프로덕션 배포
```bash
# Git 커밋 및 푸시
git add .
git commit -m "Add Vercel Analytics and Speed Insights"
git push

# Vercel 자동 배포
# 또는 Vercel 대시보드에서 수동 배포
```

### 3단계: 데이터 수집 확인
1. 프로덕션 사이트 방문
2. 여러 페이지 탐색
3. 5-10분 후 Vercel 대시보드 확인
4. Analytics 탭에서 데이터 확인

---

## ⚠️ 주의사항

### 데이터 수집 시작 시간
- 배포 후 **5-10분** 정도 소요
- 실시간 데이터는 약간의 지연 있음
- 24시간 후 정확한 통계 확인 가능

### 무료 플랜 제한
- **Hobby 플랜**: 2,500 이벤트/월
- 초과 시 추가 이벤트 수집 안 됨
- Pro 플랜으로 업그레이드 필요

### 개인정보 보호
- Vercel Analytics는 쿠키를 사용하지 않음
- GDPR 준수
- 개인 식별 정보 수집 안 함

---

## 📚 추가 리소스

### 공식 문서
- [Vercel Analytics 문서](https://vercel.com/docs/analytics)
- [Speed Insights 문서](https://vercel.com/docs/speed-insights)
- [Web Vitals 가이드](https://web.dev/vitals/)

### 대시보드 링크
- [Vercel 대시보드](https://vercel.com/dashboard)
- [Analytics 대시보드](https://vercel.com/dashboard/analytics)
- [Speed Insights 대시보드](https://vercel.com/dashboard/speed-insights)

---

## 🎉 완료!

Vercel Analytics와 Speed Insights가 성공적으로 설정되었습니다.

### 다음 단계
1. 개발 서버 재시작
2. 프로덕션 배포
3. Vercel 대시보드에서 Analytics 활성화
4. 데이터 수집 확인

### 예상 시간
- 코드 설정: ✅ 완료 (5분)
- Vercel 대시보드 설정: 5분
- 배포 및 확인: 10분
- **총 소요 시간**: 약 20분

---

**설정 완료일**: 2024-12-25  
**상태**: ✅ 코드 통합 완료, Vercel 대시보드 활성화 필요

