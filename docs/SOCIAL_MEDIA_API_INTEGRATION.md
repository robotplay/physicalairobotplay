# 소셜 미디어 API 연동 가이드

## 개요

Facebook과 Instagram에 실제로 포스팅하기 위해서는 각 플랫폼의 Graph API를 사용해야 합니다.

## 필요한 준비사항

### 1. Facebook Developer 계정 및 앱 생성

#### Step 1: Facebook 계정 확인 및 준비

**Facebook 개인 계정이 필요합니다:**
- Facebook Developer는 Facebook 개인 계정으로 로그인해야 합니다
- 비즈니스 페이지 계정이 아닌 **개인 Facebook 계정**이 필요합니다

**Facebook 계정이 없다면:**
1. https://www.facebook.com 접속
2. "새 계정 만들기" 클릭
3. 이름, 이메일/전화번호, 생년월일, 성별 입력
4. 비밀번호 설정
5. 이메일/전화번호 인증 완료
6. Facebook 계정 생성 완료

#### Step 2: Facebook Developer 계정 등록

1. **Facebook Developers 접속**
   - 브라우저에서 https://developers.facebook.com 접속

2. **로그인**
   - 우측 상단 "로그인" 버튼 클릭
   - 위에서 만든 Facebook 개인 계정으로 로그인
   - 2단계 인증이 설정되어 있다면 인증 코드 입력

3. **Developer 계정 등록**
   - 처음 접속하면 "개발자로 등록" 또는 "Register as a Developer" 버튼 표시
   - 클릭 후 다음 정보 입력:
     - **국가/지역**: 대한민국 선택
     - **개발자 역할**: 자신의 역할 선택 (예: "소프트웨어 개발자")
     - **Facebook Developer 정책 동의**: 체크박스 선택
   - "등록 완료" 또는 "Complete Registration" 버튼 클릭
   - 휴대폰 번호 인증이 필요한 경우 번호 입력 및 인증 코드 입력

4. **등록 완료 확인**
   - 대시보드 페이지로 이동하면 등록 완료
   - 좌측 메뉴에 "내 앱" 또는 "My Apps" 메뉴 표시

#### Step 3: Facebook App 생성

1. **앱 만들기 시작**
   - https://developers.facebook.com/apps 접속
   - 또는 대시보드에서 "앱 만들기" 또는 "Create App" 버튼 클릭

2. **앱 유형 선택**
   - 다음 중 하나 선택:
     - **"비즈니스"** (Business) - 권장 (마케팅, 자동 포스팅용)
     - **"소비자"** (Consumer) - 일반 앱용
     - **"다른"** (Other) - 기타 용도
   - "만들기" 또는 "Next" 클릭

3. **이용 사례 선택 (Use Cases)**
   
   이 단계에서는 앱이 어떤 용도로 사용될지 선택합니다.
   
   **권장 선택 (Facebook/Instagram 자동 포스팅용):**
   
   왼쪽 필터에서 **"Content Management (콘텐츠 관리)"** 선택
   
   또는 상단의 필터에서:
   - **"Content Management (5)"** 클릭
   - 또는 **"All (19)"** 선택 후 필요한 항목만 체크
   
   **체크해야 할 이용 사례:**
   
   ✅ **"Manage Instagram Content"** 또는 **"Instagram Content Publishing"** 
      - Instagram에 콘텐츠를 게시하고 관리
   
   ✅ **"Manage Facebook Page Content"** 또는 **"Facebook Page Publishing"**
      - Facebook 페이지에 포스트 게시 및 관리
   
   **선택사항:**
   - Marketing API 관련 항목은 광고가 아니라면 선택하지 않아도 됩니다
   - Facebook Login은 사용자 인증이 필요할 때만 선택
   
   - "Next" 또는 "다음" 버튼 클릭

   **⚠️ 비즈니스 인증이 필요한 이용 사례:**
   
   일부 이용 사례를 선택하면 "비즈니스 인증 필요" 경고가 나타날 수 있습니다.
   
   **자동 포스팅을 위해 체크해야 할 항목:**
   
   ✅ **"Instagram에서 메시지 및 콘텐츠 관리"** (Manage Messages and Content on Instagram)
      - Instagram API를 통해 게시물 올리기, 스토리 공유, 댓글 응답 등
      - 이것이 자동 포스팅에 필요합니다!
   
   **선택하지 않아도 되는 항목:**
   
   ❌ **"Threads API 액세스"** - Threads를 사용하지 않으면 선택 불필요
   ❌ **"다른 웹사이트에 콘텐츠 퍼가기"** - 임베드 기능이 필요 없으면 선택 불필요
   
   **비즈니스 인증에 대해:**
   
   - 이 화면에서 "완료" 버튼을 클릭해도 됩니다
   - 비즈니스 인증은 **나중에 완료**해도 됩니다
   - 개발 모드에서는 자신의 계정으로 테스트할 수 있습니다
   - 프로덕션 사용을 위해서는 비즈니스 인증이 필요합니다
   - 일단 앱을 생성하고, 나중에 비즈니스 인증을 진행하는 것을 권장합니다
   
   **"완료" 버튼 클릭하여 진행**

3. **앱 기본 정보 입력**
   - **앱 표시 이름**: 예) "피지컬 AI 교육 마케팅"
   - **앱 연락처 이메일**: 실제 이메일 주소 (앱 관련 알림 수신)
   - **앱 용도 선택**: "비즈니스 관리" 또는 "마케팅" 선택
   - "앱 만들기" 또는 "Create App" 클릭

4. **보안 확인 (필요한 경우)**
   - CAPTCHA 또는 보안 확인 단계 완료

#### Step 4: 제품 추가 (Products)

앱 생성 후 제품 추가 페이지로 이동합니다. 다음 제품들을 추가해야 합니다:

**Facebook Login 추가:**
1. "Facebook 로그인" 또는 "Facebook Login" 찾기
2. "설정" 또는 "Set Up" 버튼 클릭
3. "웹" 또는 "Web" 선택 (또는 건너뛰기 가능)

**Instagram Graph API 추가:**
1. "Instagram Graph API" 찾기
2. "설정" 또는 "Set Up" 버튼 클릭
3. Instagram 계정 연결 안내가 나오면 나중에 연결 가능 (Skip)

**Pages (선택사항, 하지만 권장):**
1. "Facebook Pages" 찾기
2. "설정" 또는 "Set Up" 클릭
3. 페이지 관리 권한 설정

#### Step 5: 앱 설정 (App Settings)

1. **좌측 메뉴에서 "설정" → "기본 설정"** 선택

2. **앱 도메인 추가** (선택사항이지만 권장):
   - "앱 도메인" 필드에 도메인 입력: 예) `parplay.co.kr`
   - 저장

3. **플랫폼 추가**:
   - "플랫폼 추가" 또는 "Add Platform" 버튼 클릭
   - "웹사이트" 선택
   - 사이트 URL 입력: 예) `https://parplay.co.kr`

4. **앱 ID 및 앱 시크릿 확인**:
   - **앱 ID** (App ID): 나중에 필요
   - **앱 시크릿** (App Secret): "표시" 클릭하여 확인 (보안에 주의)

#### Step 6: 권한 및 기능 설정

1. **좌측 메뉴에서 "제품" → "Facebook 로그인" → "설정"** 선택

2. **유효한 OAuth 리디렉션 URI 추가** (나중에 필요할 수 있음):
   - "유효한 OAuth 리디렉션 URI" 섹션
   - 예) `https://parplay.co.kr/api/auth/facebook/callback`
   - (현재는 자동 포스팅만 사용하므로 나중에 추가 가능)

3. **권한 설정**:
   - "앱 검토" → "권한 및 기능" 메뉴
   - 필요한 권한 요청 (일반적으로 다음과 같은 권한 필요):
     - `pages_manage_posts` - 페이지 포스트 관리
     - `pages_read_engagement` - 페이지 참여도 읽기
     - `instagram_basic` - Instagram 기본 정보
     - `instagram_content_publish` - Instagram 콘텐츠 게시
   - 주의: 일부 권한은 앱 검토가 필요할 수 있습니다

#### Step 7: 앱 상태 확인

1. **앱 상태 확인**:
   - 앱 대시보드에서 "앱 상태" 확인
   - 초기에는 "개발 모드" (Development Mode) 상태
   - 개발 모드에서는 자신의 Facebook 계정으로만 테스트 가능

2. **비즈니스 인증 (나중에 완료 가능)**:
   
   **비즈니스 인증이 필요한 경우:**
   - Instagram/Facebook Pages에 자동 포스팅을 위해서는 비즈니스 인증이 필요할 수 있습니다
   - 하지만 개발 및 테스트 단계에서는 인증 없이도 작동할 수 있습니다
   
   **비즈니스 인증 방법 (나중에 진행):**
   1. Facebook Business Manager 접속: https://business.facebook.com
   2. 비즈니스 계정 생성 또는 기존 비즈니스에 앱 연결
   3. 비즈니스 인증 신청 (신분증, 사업자등록증 등 제출)
   4. 인증 완료까지 며칠 소요될 수 있음
   
   **개발 모드에서 테스트:**
   - 비즈니스 인증이 없어도 개발 모드에서는 자신의 페이지/계정으로 테스트 가능
   - Page Access Token을 발급받으면 자동 포스팅 테스트 가능

3. **앱 공개 (나중에)**:
   - 프로덕션 사용을 위해서는 "앱 검토" → "앱 정보 확인" 완료 필요
   - 하지만 자동 포스팅의 경우 개발 모드에서도 작동 가능

### 2. 액세스 토큰 (Access Token) 발급

Facebook과 Instagram API를 사용하려면 **Page Access Token**이 필요합니다.

#### Step 1: Facebook 페이지 확인

1. **Facebook 페이지가 있는지 확인**:
   - https://www.facebook.com/pages/manage 접속
   - 관리하는 페이지 목록 확인
   - 페이지가 없다면 페이지 생성 필요

2. **페이지 생성 (없는 경우)**:
   - https://www.facebook.com/pages/create 접속
   - 페이지 유형 선택 (예: "비즈니스 또는 브랜드")
   - 페이지 이름, 카테고리 입력
   - 프로필 사진, 커버 사진 추가
   - 페이지 생성 완료

#### Step 2: Facebook 페이지를 앱에 연결

1. **Graph API Explorer 사용**:
   - https://developers.facebook.com/tools/explorer 접속
   - 우측 상단에서 생성한 앱 선택

2. **페이지 액세스 토큰 생성**:
   - "사용자 또는 페이지" 드롭다운에서 "페이지" 선택
   - 관리하는 페이지 선택
   - "페이지 액세스 토큰 생성" 또는 "Generate Page Access Token" 클릭
   - 토큰이 생성되면 복사 (이 토큰을 환경 변수에 저장)

#### Step 3: Instagram Business Account ID 확인

1. **Instagram 계정을 비즈니스 계정으로 전환** (아직 안 했다면):
   - Instagram 앱 열기
   - 프로필 → 설정 → 계정
   - "전문 계정으로 전환" 선택
   - "비즈니스" 선택

2. **Facebook 페이지와 Instagram 연결**:
   - Instagram 앱에서: 프로필 → 설정 → 전문 도구 → Facebook 페이지 연결
   - 또는 Facebook 페이지 설정에서: 설정 → Instagram → Instagram 계정 연결

3. **Instagram Business Account ID 확인**:
   - Graph API Explorer에서: `GET /me/accounts`
   - 또는 직접: `GET /{page-id}?fields=instagram_business_account`
   - 응답에서 `instagram_business_account.id` 값 확인 (이 값이 Instagram Account ID)

#### Step 4: 장기 토큰 생성 (선택사항)

Page Access Token은 일반적으로 만료되지 않지만, 만약 만료가 걱정된다면:

1. **장기 토큰으로 변환**:
   - Graph API Explorer에서 다음 API 호출:
   ```
   GET /{page-id}?fields=access_token&access_token={short-lived-token}
   ```
   - 또는 장기 토큰 생성 API 사용

2. **토큰 만료 확인**:
   - Graph API Explorer에서: `GET /me?access_token={your-token}`
   - `expires_in` 필드 확인

#### Instagram Business Account 연결
- Facebook 페이지와 Instagram 비즈니스 계정 연결 필요
- Instagram Graph API를 통해 포스팅 가능

## 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# Facebook Graph API
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token
FACEBOOK_PAGE_ID=your_page_id

# Instagram Graph API
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
```

## 구현 방법

### 1. Facebook SDK 설치

```bash
npm install facebook-nodejs-business-sdk
# 또는
npm install axios
```

### 2. Facebook 포스팅 API 구현

#### lib/social/facebook.ts 생성

```typescript
import axios from 'axios';

interface FacebookPostOptions {
  message: string;
  link?: string;
  imageUrl?: string;
}

export async function postToFacebook(options: FacebookPostOptions): Promise<{
  success: boolean;
  postId?: string;
  error?: string;
}> {
  try {
    const { message, link, imageUrl } = options;
    const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;

    if (!pageAccessToken || !pageId) {
      throw new Error('Facebook Page Access Token 또는 Page ID가 설정되지 않았습니다.');
    }

    const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
    
    const params: any = {
      message,
      access_token: pageAccessToken,
    };

    // 이미지가 있는 경우 미디어 업로드
    if (imageUrl) {
      // 이미지를 먼저 업로드
      const photoUrl = `https://graph.facebook.com/v18.0/${pageId}/photos`;
      const photoResponse = await axios.post(photoUrl, {
        url: imageUrl,
        access_token: pageAccessToken,
      });

      if (photoResponse.data.id) {
        params.attached_media = JSON.stringify([{
          media_fbid: photoResponse.data.id,
        }]);
      }
    }

    // 링크가 있는 경우 추가
    if (link) {
      params.link = link;
    }

    const response = await axios.post(url, params);

    return {
      success: true,
      postId: response.data.id,
    };
  } catch (error: any) {
    console.error('Facebook 포스팅 오류:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message || '알 수 없는 오류',
    };
  }
}
```

### 3. Instagram 포스팅 API 구현

#### lib/social/instagram.ts 생성

```typescript
import axios from 'axios';

interface InstagramPostOptions {
  caption: string;
  imageUrl: string;
  linkUrl?: string;
}

export async function postToInstagram(options: InstagramPostOptions): Promise<{
  success: boolean;
  postId?: string;
  error?: string;
}> {
  try {
    const { caption, imageUrl, linkUrl } = options;
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN; // Instagram도 Facebook 토큰 사용
    const instagramAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    if (!accessToken || !instagramAccountId) {
      throw new Error('Instagram Access Token 또는 Account ID가 설정되지 않았습니다.');
    }

    // Step 1: 이미지 컨테이너 생성
    const containerUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media`;
    const containerResponse = await axios.post(containerUrl, {
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken,
    });

    const creationId = containerResponse.data.id;

    // Step 2: 이미지 게시
    const publishUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`;
    const publishResponse = await axios.post(publishUrl, {
      creation_id: creationId,
      access_token: accessToken,
    });

    return {
      success: true,
      postId: publishResponse.data.id,
    };
  } catch (error: any) {
    console.error('Instagram 포스팅 오류:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message || '알 수 없는 오류',
    };
  }
}
```

### 4. API Route 업데이트

#### app/api/marketing/social/route.ts 수정

```typescript
import { postToFacebook } from '@/lib/social/facebook';
import { postToInstagram } from '@/lib/social/instagram';

// ... 기존 코드 ...

if (autoPost) {
    const postResults: Record<string, { success: boolean; postId?: string; error?: string; timestamp: Date }> = {};
    
    for (const platform of platforms) {
        try {
            let result;
            
            if (platform === 'facebook') {
                result = await postToFacebook({
                    message: `${title}\n\n${description}`,
                    link: linkUrl || undefined,
                    imageUrl: imageUrl || undefined,
                });
            } else if (platform === 'instagram') {
                if (!imageUrl) {
                    postResults[platform] = {
                        success: false,
                        error: 'Instagram은 이미지가 필수입니다.',
                        timestamp: new Date(),
                    };
                    continue;
                }
                result = await postToInstagram({
                    caption: `${title}\n\n${description}${linkUrl ? `\n\n🔗 ${linkUrl}` : ''}`,
                    imageUrl,
                });
            } else {
                // 다른 플랫폼은 추후 구현
                postResults[platform] = {
                    success: false,
                    error: '아직 지원하지 않는 플랫폼입니다.',
                    timestamp: new Date(),
                };
                continue;
            }
            
            postResults[platform] = {
                success: result.success,
                postId: result.postId,
                error: result.error,
                timestamp: new Date(),
            };
        } catch (error: any) {
            postResults[platform] = {
                success: false,
                error: error.message || '알 수 없는 오류',
                timestamp: new Date(),
            };
        }
    }
    
    // 모든 플랫폼 성공 여부 확인
    const allSuccess = Object.values(postResults).every(r => r.success);
    const allFailed = Object.values(postResults).every(r => !r.success);
    
    postData.status = allSuccess ? 'posted' : (allFailed ? 'failed' : 'posted'); // 부분 성공도 posted
    postData.postedAt = new Date();
    postData.postResults = postResults;
}
```

## Instagram 비즈니스 계정 연결 방법

1. **Facebook 페이지와 Instagram 계정 연결**
   - Facebook 페이지 설정 → Instagram → Instagram 계정 연결
   - Instagram 계정을 비즈니스 계정으로 전환 필요

2. **Instagram Business Account ID 확인**
   - Graph API Explorer 사용: `GET /me/accounts`
   - 연결된 Instagram 계정 정보 확인

## 주의사항

### 1. 토큰 관리
- **Short-lived Token**: 1-2시간 유효
- **Long-lived Token**: 60일 유효, 재갱신 필요
- **Page Access Token**: 만료 없음 (권장)

### 2. Instagram 제한사항
- Instagram Graph API는 **비즈니스 계정**만 사용 가능
- 이미지는 **필수**입니다
- 하루 포스팅 제한: 약 25개
- 이미지 크기: 최소 320x320px, 권장 1080x1080px

### 3. Facebook 제한사항
- 하루 포스팅 제한: 약 25개
- 스팸 정책 준수 필요
- 이미지 크기: 최대 2048x2048px

### 4. 보안
- Access Token은 **절대 클라이언트에 노출**하면 안 됩니다
- 환경 변수로만 관리
- GitHub 등에 커밋하지 않도록 주의

## 테스트 방법

1. **Graph API Explorer 사용**
   - https://developers.facebook.com/tools/explorer
   - 토큰으로 API 직접 테스트

2. **개발 환경에서 테스트**
   - `autoPost: true`로 포스트 생성
   - 실제 포스팅 확인

## 트러블슈팅

### 토큰 오류
- 토큰이 만료되었는지 확인
- 페이지 권한이 있는지 확인
- 토큰 권한 범위 확인 (pages_manage_posts, instagram_basic 등)

### 이미지 업로드 실패
- 이미지 URL이 공개적으로 접근 가능한지 확인
- 이미지 크기 제한 확인
- 이미지 형식 확인 (JPG, PNG 지원)

### Instagram 포스팅 실패
- 비즈니스 계정인지 확인
- Facebook 페이지와 연결되었는지 확인
- 이미지가 필수인지 확인

## 참고 자료

- [Facebook Graph API 문서](https://developers.facebook.com/docs/graph-api)
- [Instagram Graph API 문서](https://developers.facebook.com/docs/instagram-api)
- [Facebook Pages API](https://developers.facebook.com/docs/pages)
- [Instagram Media Publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)

