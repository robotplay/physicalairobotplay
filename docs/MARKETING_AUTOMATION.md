# 마케팅 자동화 기능 가이드

## 개요

이 문서는 피지컬 AI 교육 사이트의 마케팅 자동화 기능에 대한 설명입니다. 이메일 마케팅 캠페인과 소셜 미디어 연동 기능을 포함합니다.

## 구현된 기능

### 1. 이메일 마케팅 캠페인

#### 1.1 뉴스레터 구독 관리

- **구독자 관리**
  - 구독/구독 취소 기능
  - 구독자 목록 조회 (관리자)
  - 구독 상태 추적

- **API 엔드포인트**
  - `POST /api/newsletter/subscribe` - 뉴스레터 구독
  - `DELETE /api/newsletter/subscribe?email={email}` - 구독 취소
  - `GET /api/newsletter/subscribe?email={email}` - 구독 상태 확인
  - `GET /api/newsletter/subscribers` - 구독자 목록 (관리자)

#### 1.2 이메일 캠페인 발송

- **캠페인 타입**
  - 뉴스레터: 일반 뉴스레터 발송
  - 프로모션: 프로모션 이메일 발송 (이미지, CTA 포함)

- **기능**
  - 대량 이메일 발송 (배치 처리)
  - 발송 상태 추적
  - 성공/실패 통계
  - 테스트 이메일 발송

- **API 엔드포인트**
  - `POST /api/marketing/campaigns` - 캠페인 생성 및 발송
  - `GET /api/marketing/campaigns` - 캠페인 목록 조회

### 2. 소셜 미디어 연동

#### 2.1 자동 포스팅

- **기능**
  - 소셜 미디어 포스트 생성 및 기록
  - 플랫폼별 포스팅 상태 추적
  - 자동 포스팅 옵션 (향후 실제 API 연동 예정)

- **API 엔드포인트**
  - `POST /api/marketing/social` - 소셜 미디어 포스트 생성
  - `GET /api/marketing/social` - 포스트 목록 조회
  - `GET /api/marketing/social/stats` - 소셜 미디어 통계

#### 2.2 소셜 미디어 통계

- **통계 항목**
  - 전체 포스트 수
  - 상태별 통계 (대기 중, 게시됨, 실패)
  - 컨텐츠 타입별 통계
  - 플랫폼별 통계
  - 날짜별 통계

## 사용 방법

### 관리자 페이지

1. 관리자 페이지에 접속 (`/admin`)
2. "마케팅" 탭 선택
3. 다음 서브 탭을 사용:
   - **뉴스레터 구독자**: 구독자 목록 확인 및 관리
   - **이메일 캠페인**: 캠페인 생성 및 발송
   - **소셜 미디어**: 소셜 미디어 포스트 관리 및 통계

### 뉴스레터 캠페인 생성

1. "이메일 캠페인" 탭에서 "새 캠페인" 버튼 클릭
2. 캠페인 정보 입력:
   - 캠페인 타입 선택 (뉴스레터 또는 프로모션)
   - 제목 입력
   - 내용 입력
   - 프로모션인 경우 추가 정보 입력 (이미지, CTA 등)
   - 수신자 선택 (모든 구독자 또는 테스트 이메일)
3. "캠페인 생성" 클릭
4. 캠페인이 생성되고 발송이 시작됩니다.

### 뉴스레터 구독 (프론트엔드)

1. 웹사이트 하단 Footer에서 뉴스레터 구독 폼 찾기
2. 이름 (선택) 및 이메일 주소 입력
3. "구독하기" 버튼 클릭
4. 구독 완료 메시지 확인

## 데이터베이스 컬렉션

### newsletter_subscribers

```typescript
{
  _id: ObjectId,
  email: string,           // 구독자 이메일
  name: string,            // 구독자 이름 (선택)
  status: 'active' | 'unsubscribed',  // 구독 상태
  subscribedAt: Date,      // 구독일
  unsubscribedAt?: Date,   // 구독 취소일
  createdAt: Date,
  updatedAt: Date,
}
```

### email_campaigns

```typescript
{
  _id: ObjectId,
  type: 'newsletter' | 'promotion',  // 캠페인 타입
  title: string,                      // 제목
  content: string,                    // 내용
  description?: string,               // 설명 (프로모션용)
  imageUrl?: string,                  // 이미지 URL (프로모션용)
  ctaText?: string,                   // CTA 텍스트 (프로모션용)
  ctaUrl?: string,                    // CTA URL (프로모션용)
  recipientType: 'all' | 'test',      // 수신자 타입
  recipientCount: number,             // 수신자 수
  status: 'sending' | 'completed' | 'failed',  // 발송 상태
  successCount?: number,              // 성공 건수
  failedCount?: number,               // 실패 건수
  errors?: string[],                  // 오류 목록
  createdAt: Date,
  sentAt?: Date,                      // 발송 시작 시간
  completedAt?: Date,                 // 발송 완료 시간
}
```

### social_posts

```typescript
{
  _id: ObjectId,
  contentType: 'news' | 'course' | 'custom',  // 컨텐츠 타입
  contentId?: string,                         // 컨텐츠 ID
  title: string,                              // 제목
  description: string,                        // 설명
  imageUrl?: string,                          // 이미지 URL
  linkUrl?: string,                           // 링크 URL
  platforms: string[],                        // 플랫폼 목록 (['facebook', 'twitter', 'instagram'])
  status: 'pending' | 'posted' | 'failed',    // 상태
  autoPost: boolean,                          // 자동 포스팅 여부
  postResults: {                              // 플랫폼별 포스팅 결과
    [platform: string]: {
      success: boolean,
      postId?: string,
      error?: string,
      timestamp: Date,
    }
  },
  createdAt: Date,
  postedAt?: Date,                            // 포스팅 시간
}
```

## 이메일 템플릿

### 뉴스레터 템플릿

`createNewsletterEmailTemplate()` 함수를 사용하여 뉴스레터 이메일 템플릿을 생성합니다.

### 프로모션 템플릿

`createPromotionEmailTemplate()` 함수를 사용하여 프로모션 이메일 템플릿을 생성합니다. 이미지, CTA 버튼 등을 포함할 수 있습니다.

## 대량 이메일 발송

`sendBulkEmail()` 함수를 사용하여 대량 이메일을 발송합니다. 배치 단위로 처리하여 API 레이트 리밋을 방지합니다.

- 기본 배치 크기: 10개
- 배치 간 지연: 1초

## 향후 개선 사항

### 소셜 미디어 실제 API 연동

현재는 소셜 미디어 포스팅을 데이터베이스에 기록만 합니다. 향후 다음 API들을 연동할 수 있습니다:

- Facebook Graph API
- Twitter API v2
- Instagram Basic Display API
- LinkedIn API

### 자동 포스팅

뉴스/강좌 생성 시 자동으로 소셜 미디어에 포스팅하는 기능을 추가할 수 있습니다.

### 이메일 스케줄링

특정 시간에 이메일을 발송하는 스케줄링 기능을 추가할 수 있습니다.

### A/B 테스트

이메일 캠페인에 A/B 테스트 기능을 추가할 수 있습니다.

## 환경 변수

이메일 발송을 위해서는 다음 환경 변수가 설정되어 있어야 합니다:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_FROM_NAME=피지컬 AI 교육
```

자세한 내용은 `docs/EMAIL_SETUP.md`를 참고하세요.

## 보안 고려사항

- 관리자 권한이 필요한 API는 `verifyAdminAuth()` 미들웨어로 보호됩니다.
- 이메일 주소는 소문자로 변환하여 저장됩니다.
- 구독 취소 링크는 이메일 템플릿에 포함됩니다.
- 대량 이메일 발송은 배치 처리로 API 레이트 리밋을 준수합니다.

## 문제 해결

### 이메일이 발송되지 않는 경우

1. 환경 변수가 올바르게 설정되었는지 확인
2. SMTP 서버 설정 확인
3. API 로그 확인

### 구독자가 보이지 않는 경우

1. 데이터베이스 연결 확인
2. 관리자 권한 확인
3. API 응답 확인

### 소셜 미디어 포스팅이 작동하지 않는 경우

현재는 실제 소셜 미디어 API가 연동되어 있지 않습니다. 데이터베이스에 기록만 됩니다. 실제 연동을 위해서는 각 플랫폼의 API 키와 액세스 토큰이 필요합니다.

