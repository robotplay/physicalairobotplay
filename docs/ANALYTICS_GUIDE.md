# Analytics 가이드

## 📊 개요

Vercel Analytics와 통합된 사용자 행동 추적 시스템입니다.

## ✅ 설치 완료 항목

### 1. 이벤트 추적 라이브러리
- ✅ `lib/analytics.ts` 생성
- ✅ Vercel Analytics `track()` 함수 통합
- ✅ 타입 안전한 이벤트 정의

### 2. 추적 중인 이벤트

#### CTA 클릭 추적
```typescript
trackCTAClick('교육 과정 보기', 'hero');
```

**추적 위치:**
- Hero 섹션: "교육 과정 보기" 버튼

#### 상담 문의 추적
```typescript
trackConsultation('open', 'hero');
trackConsultation('submit', 'modal');
```

**추적 위치:**
- Hero 섹션: "상담 문의하기" 버튼 클릭 시
- ConsultationModal: 폼 제출 성공 시

#### 스크롤 깊이 추적
```typescript
trackScrollDepth(25); // 25%, 50%, 75%, 100%
```

**추적 위치:**
- 홈페이지 (`app/page.tsx`)
- 자동으로 25%, 50%, 75%, 100% 스크롤 시 추적

### 3. 사용 가능한 이벤트 타입

```typescript
type AnalyticsEvent =
  | 'cta_click'              // CTA 버튼 클릭
  | 'consultation_open'      // 상담 모달 열기
  | 'consultation_submit'    // 상담 폼 제출
  | 'course_view'            // 과정 페이지 조회
  | 'news_view'              // 뉴스 기사 조회
  | 'external_link_click'    // 외부 링크 클릭
  | 'scroll_depth'           // 스크롤 깊이
  | 'video_play'             // 비디오 재생
  | 'image_view';            // 이미지 조회
```

## 📈 Vercel Analytics 대시보드 확인

### 1. 접속 방법
```
https://vercel.com/[your-team]/[your-project]/analytics
```

### 2. 확인 가능한 데이터

#### 기본 메트릭
- **Page Views**: 페이지 조회수
- **Visitors**: 방문자 수
- **Top Pages**: 인기 페이지
- **Referrers**: 유입 경로
- **Devices**: 디바이스 분포
- **Browsers**: 브라우저 분포
- **Countries**: 국가별 분포

#### 커스텀 이벤트
- **cta_click**: CTA 클릭 수
  - Properties: `cta_name`, `location`
- **consultation_open**: 상담 모달 열기 수
  - Properties: `source`
- **consultation_submit**: 상담 제출 수
  - Properties: `source`
- **scroll_depth**: 스크롤 깊이 분포
  - Properties: `depth_percentage`

## 🎯 추가 이벤트 추적 방법

### 과정 페이지 조회 추적

```typescript
// app/basic-course/page.tsx
import { useEffect } from 'react';
import { trackCourseView } from '@/lib/analytics';

export default function BasicCoursePage() {
  useEffect(() => {
    trackCourseView('Basic Course');
  }, []);
  
  // ...
}
```

### 뉴스 기사 조회 추적

```typescript
// app/news/[id]/page.tsx
import { useEffect } from 'react';
import { trackNewsView } from '@/lib/analytics';

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  useEffect(() => {
    trackNewsView(params.id, '뉴스 제목');
  }, [params.id]);
  
  // ...
}
```

### 외부 링크 클릭 추적

```typescript
import { trackExternalLink } from '@/lib/analytics';

<a 
  href="https://example.com"
  onClick={() => trackExternalLink('https://example.com', '외부 링크')}
>
  외부 링크
</a>
```

### 비디오 재생 추적

```typescript
import { trackVideoPlay } from '@/lib/analytics';

<video 
  onPlay={() => trackVideoPlay('소개 영상', '/videos/intro.mp4')}
>
  <source src="/videos/intro.mp4" />
</video>
```

## 📊 데이터 분석 가이드

### 1. 전환율 계산

```
전환율 = (consultation_submit / consultation_open) × 100%
```

**목표**: 20% 이상

### 2. CTA 효과 분석

```
CTA 클릭률 = (cta_click / page_views) × 100%
```

**목표**: 5% 이상

### 3. 사용자 참여도 분석

```
참여도 = (scroll_depth_100 / page_views) × 100%
```

**목표**: 30% 이상 (100% 스크롤)

## 🔍 개발 환경에서 테스트

### 1. 콘솔 로그 확인

개발 환경에서는 모든 이벤트가 콘솔에 로그됩니다:

```
[Analytics] cta_click { cta_name: '교육 과정 보기', location: 'hero' }
[Analytics] consultation_open { source: 'hero' }
[Analytics] scroll_depth { depth_percentage: 25 }
```

### 2. 브라우저 개발자 도구

1. **Network 탭** 열기
2. `/_vercel/insights` 필터 적용
3. 이벤트 전송 확인

## 🚀 다음 단계

### 1. 추가 이벤트 구현 (선택사항)

- [ ] 과정 페이지 조회 추적
- [ ] 뉴스 기사 조회 추적
- [ ] 외부 링크 클릭 추적
- [ ] 비디오 재생 추적
- [ ] 이미지 갤러리 조회 추적

### 2. A/B 테스트 설정 (선택사항)

Vercel의 Edge Config를 활용한 A/B 테스트:

```typescript
// lib/ab-test.ts
import { get } from '@vercel/edge-config';

export async function getVariant(testName: string): Promise<'A' | 'B'> {
  const config = await get(testName);
  return Math.random() < 0.5 ? 'A' : 'B';
}
```

### 3. 정기 데이터 분석

**주간 체크리스트:**
- [ ] 페이지뷰 트렌드 확인
- [ ] 전환율 계산
- [ ] CTA 클릭률 분석
- [ ] 사용자 참여도 분석
- [ ] 개선점 도출

## 📚 참고 자료

- [Vercel Analytics 문서](https://vercel.com/docs/analytics)
- [Vercel Analytics API](https://vercel.com/docs/analytics/package)
- [Google Analytics 4 비교](https://vercel.com/docs/analytics/comparison)

## ✅ 완료 상태

```
✅ Analytics 라이브러리 구현
✅ CTA 클릭 추적
✅ 상담 문의 추적
✅ 스크롤 깊이 추적
✅ 개발 환경 로깅
⏳ 과정 페이지 조회 추적 (선택사항)
⏳ 뉴스 기사 조회 추적 (선택사항)
⏳ A/B 테스트 설정 (선택사항)
```

---

**마지막 업데이트**: 2025-12-25
**작성자**: AI Assistant

