# 소셜 미디어 포스트 생성 예시

## 관리자 페이지에서 생성하는 방법

### 1. 관리자 페이지 접속
- URL: `/admin`
- 로그인 필요 (관리자 계정)

### 2. 마케팅 탭 → 소셜 미디어 탭 선택
- 상단 메뉴에서 "마케팅" 탭 클릭
- 하위 탭에서 "소셜 미디어" 선택

### 3. "새 포스트" 버튼 클릭
- 우측 상단의 보라색 "새 포스트" 버튼 클릭

### 4. 폼 작성 예시

#### 예시 1: 새 강의 과정 공지 (뉴스 타입)

**컨텐츠 타입**: `뉴스`

**컨텐츠 ID** (선택): 비워두기 또는 `news-123` (연결된 뉴스가 있는 경우)

**제목**: 
```
🎯 새로운 강의 과정이 오픈되었습니다!
```

**설명**:
```
피지컬 AI 교육에서 새로운 로봇 프로그래밍 강의를 개설했습니다.
실전 프로젝트 중심의 커리큘럼으로 여러분의 로봇 개발 실력을 키워보세요!
```

**이미지 URL**:
```
https://parplay.co.kr/images/new-course.jpg
```
(실제 이미지 URL로 변경 필요)

**링크 URL**:
```
https://parplay.co.kr/curriculum
```
(강의 소개 페이지 링크)

**플랫폼 선택**: 
- ☑️ Facebook
- ☑️ Twitter
- ☑️ Instagram

**자동 포스팅**: ☐ 체크 해제 (현재는 시뮬레이션 모드)

---

#### 예시 2: 프로모션 이벤트 (커스텀 타입)

**컨텐츠 타입**: `커스텀`

**컨텐츠 ID**: 비워두기

**제목**:
```
🎉 봄맞이 특별 할인 이벤트!
```

**설명**:
```
이번 달 한정으로 모든 강의 과정 20% 할인!
놓치지 마세요. 선착순 마감입니다.
```

**이미지 URL**:
```
https://parplay.co.kr/images/spring-sale.jpg
```

**링크 URL**:
```
https://parplay.co.kr/courses?promo=spring2024
```

**플랫폼 선택**:
- ☑️ Facebook
- ☑️ Twitter
- ☑️ Instagram
- ☑️ LinkedIn
- ☐ YouTube

**자동 포스팅**: ☐ 체크 해제

---

#### 예시 3: 교육 과정 소개 (강의 타입)

**컨텐츠 타입**: `강의`

**컨텐츠 ID**: `course-airrobot-101` (연결된 강의 ID)

**제목**:
```
✈️ AirRobot 과정 - 항공우주 로봇 프로그래밍
```

**설명**:
```
드론과 항공우주 로봇을 활용한 실전 프로그래밍 과정입니다.
이론부터 실제 프로젝트까지 단계별로 학습하세요.
```

**이미지 URL**:
```
https://parplay.co.kr/images/airrobot-course.jpg
```

**링크 URL**:
```
https://parplay.co.kr/curriculum?tab=airrobot
```

**플랫폼 선택**:
- ☑️ Facebook
- ☑️ Twitter
- ☑️ LinkedIn

**자동 포스팅**: ☐ 체크 해제

---

## API를 통한 직접 생성 (개발자용)

### cURL 예시

```bash
curl -X POST https://your-domain.com/api/marketing/social \
  -H "Content-Type: application/json" \
  -H "Cookie: your-admin-session-cookie" \
  -d '{
    "contentType": "news",
    "title": "🎯 새로운 강의 과정이 오픈되었습니다!",
    "description": "피지컬 AI 교육에서 새로운 로봇 프로그래밍 강의를 개설했습니다.",
    "imageUrl": "https://parplay.co.kr/images/new-course.jpg",
    "linkUrl": "https://parplay.co.kr/curriculum",
    "platforms": ["facebook", "twitter", "instagram"],
    "autoPost": false
  }'
```

### JavaScript/TypeScript 예시

```typescript
const createSocialPost = async () => {
  try {
    const response = await fetch('/api/marketing/social', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함
      body: JSON.stringify({
        contentType: 'news',
        title: '🎯 새로운 강의 과정이 오픈되었습니다!',
        description: '피지컬 AI 교육에서 새로운 로봇 프로그래밍 강의를 개설했습니다.',
        imageUrl: 'https://parplay.co.kr/images/new-course.jpg',
        linkUrl: 'https://parplay.co.kr/curriculum',
        platforms: ['facebook', 'twitter', 'instagram'],
        autoPost: false,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('포스트 생성 성공:', result.data);
    } else {
      console.error('포스트 생성 실패:', result.error);
    }
  } catch (error) {
    console.error('에러:', error);
  }
};
```

## 주의사항

1. **이미지 URL**: 실제로 접근 가능한 이미지 URL을 사용해야 합니다.
2. **링크 URL**: 웹사이트 내 유효한 페이지 링크를 사용하세요.
3. **플랫폼 선택**: 최소 1개 이상의 플랫폼을 선택해야 합니다.
4. **자동 포스팅**: 현재는 시뮬레이션 모드로, 실제 소셜 미디어에는 게시되지 않습니다. 데이터베이스에만 저장됩니다.
5. **컨텐츠 ID**: 뉴스나 강의와 연결하려면 해당 컨텐츠의 실제 ID를 입력해야 합니다.

## 포스트 확인

포스트 생성 후 "소셜 미디어" 탭에서 생성된 포스트를 확인할 수 있습니다:
- 제목, 컨텐츠 타입, 플랫폼, 상태(대기 중/게시됨) 표시
- 생성 날짜 확인 가능




