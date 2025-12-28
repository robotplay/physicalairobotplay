# Facebook/Instagram API 설정 단계별 가이드

## 현재 상태: 대시보드 화면까지 완료 ✅

다음 단계를 순서대로 진행하세요.

## Step 1: 제품(Products) 추가

**중요:** Facebook Developer에서는 제품이 "이용 사례"와 연동되어 있습니다. 
이미 "Instagram에서 메시지 및 콘텐츠 관리" 이용 사례를 선택하셨다면, 
해당 제품(Instagram Graph API)이 자동으로 추가되었을 수 있습니다.

### 방법 1: 좌측 메뉴에서 "이용 사례" 확인

1. **좌측 사이드바에서 "이용 사례" 메뉴 클릭**
   - 좌측 메뉴에서 연필 아이콘이 있는 "이용 사례" 항목 찾기
   - 클릭

2. **이용 사례 페이지에서 제품 확인**
   - 선택한 이용 사례 목록이 표시됨
   - "Instagram에서 메시지 및 콘텐츠 관리" 확인
   - 해당 이용 사례와 연결된 제품 확인

### 방법 2: 대시보드에서 직접 확인

**현재 대시보드 화면에서:**

1. **"앱 맞춤 설정 및 요건" 섹션 확인**
   - 대시보드 중앙에 "Instagram에서 메시지 및 콘텐츠 관리 맞춤 설정 이용 사례" 항목이 보임
   - 이 항목의 오른쪽 화살표(→) 클릭

2. **맞춤 설정 페이지로 이동**
   - Instagram Graph API 설정 페이지로 이동
   - 여기서 제품 설정 가능

### 방법 3: 좌측 메뉴에서 제품 직접 찾기

1. **좌측 사이드바 확인**
   - "이용 사례" 아래에 "Instagram Graph API" 또는 관련 메뉴가 있을 수 있음
   - 또는 "앱 설정" 메뉴를 펼쳐보기 (드롭다운 화살표 클릭)

2. **"앱 설정" 메뉴 확장**
   - "앱 설정" 옆의 드롭다운 화살표(▼) 클릭
   - 확장된 메뉴에서 제품 관련 항목 확인

### Instagram Graph API 설정 확인/추가

**현재 상태 확인:**

1. **대시보드의 "앱 맞춤 설정 및 요건" 섹션에서**
   - "Instagram에서 메시지 및 콘텐츠 관리 맞춤 설정 이용 사례" 항목의 오른쪽 화살표 클릭
   - 또는 해당 항목 전체를 클릭
   - Instagram Graph API 설정 페이지로 이동

2. **또는 좌측 메뉴에서 "이용 사례" 클릭 후**
   - 선택한 이용 사례 목록에서 "Instagram에서 메시지 및 콘텐츠 관리" 클릭
   - 설정 페이지로 이동

3. **Instagram API 설정 페이지 확인**
   - Instagram API가 선택되어 있음
   - Instagram 앱 ID와 앱 시크릿 코드가 생성됨
   - ✅ 이 화면이 맞습니다!

4. **필수 권한 추가**
   - 화면 중앙에 "① 1. 필수 메시지 권한 추가" 섹션 확인
   - 필요한 권한들:
     - `instagram_business_basic`
     - `instagram_manage_comments`
     - `instagram_business_manage_messages`
   - 파란색 "Add all required permissions" 버튼 클릭
   - 또는 "모든 필수 권한 추가" 버튼 클릭

5. **권한 추가 완료**
   - 권한이 추가되면 체크 표시로 변경됨
   - 필요하면 추가 설정 진행

6. **설정 저장**
   - 설정이 완료되면 자동으로 저장됨
   - 또는 "저장" 또는 "Save" 버튼 클릭

**참고:**
- Instagram 앱 ID와 시크릿 코드는 나중에 필요할 수 있으니 기록해두세요
- 콘텐츠 게시만 필요하다면 메시지 권한은 선택사항일 수 있으나, 권장 권한이므로 추가하는 것이 좋습니다

### Facebook Pages API 추가

**Facebook Pages 제품 찾기:**

1. **Instagram Graph API와 동일한 방법으로 찾기**
   - 대시보드 또는 제품 페이지에서 "Facebook Pages" 또는 "Pages" 찾기
   - 또는 "Pages"로 검색

2. **"Facebook Pages" 설정**
   - "Facebook Pages" 카드 찾기
   - "설정" 또는 "Set Up" 버튼 클릭

2. **기본 설정 완료**
   - 간단한 설정 화면이 나타남
   - 기본 설정 유지하고 "완료" 또는 "Done" 클릭
   - 대시보드로 돌아옴

## Step 2: Page Access Token 발급

### Graph API Explorer 사용

1. **Graph API Explorer 접속**
   - 새 탭에서 https://developers.facebook.com/tools/explorer 접속
   - 또는 Facebook Developers 사이트에서 "도구" → "Graph API Explorer" 클릭

2. **앱 선택**
   - 우측 상단의 "Meta App" 드롭다운에서 방금 생성한 앱 선택
   - 예) "피지컬 AI 교육 마케팅"

3. **사용자 토큰 생성**
   - "사용자 또는 페이지" 드롭다운에서 "사용자 토큰" 선택
   - "토큰 생성" 또는 "Generate Token" 클릭
   - 필요한 권한 선택:
     - ✅ `pages_manage_posts` - 페이지 포스트 관리
     - ✅ `pages_read_engagement` - 페이지 참여도 읽기
     - ✅ `instagram_basic` - Instagram 기본 정보
     - ✅ `instagram_content_publish` - Instagram 콘텐츠 게시
   - "토큰 생성" 클릭
   - Facebook 로그인 및 권한 승인

4. **페이지 액세스 토큰 생성**
   - "사용자 또는 페이지" 드롭다운을 "페이지"로 변경
   - 관리하는 Facebook 페이지 선택
   - "페이지 액세스 토큰 생성" 또는 "Generate Page Access Token" 클릭
   - 생성된 토큰 복사 (⚠️ 이 토큰을 안전하게 보관하세요!)

5. **페이지 ID 확인**
   - Graph API Explorer에서 다음 API 호출:
   ```
   GET /me/accounts
   ```
   - 또는:
   ```
   GET /{your-user-id}/accounts
   ```
   - 응답에서 관리하는 페이지의 `id` 값 확인 (이것이 Page ID)

## Step 3: Instagram Business Account ID 확인

### Facebook 페이지와 Instagram 연결 확인

1. **Instagram 비즈니스 계정 확인**
   - Instagram 앱 열기
   - 프로필 → 설정 → 계정
   - "전문 계정" 또는 "비즈니스"로 표시되어 있는지 확인
   - 비즈니스 계정이 아니면 "전문 계정으로 전환" 선택

2. **Facebook 페이지와 연결**
   - Instagram 앱에서: 프로필 → 설정 → 전문 도구 → Facebook 페이지 연결
   - 또는 Facebook 페이지 설정에서: 설정 → Instagram → Instagram 계정 연결

3. **Instagram Business Account ID 확인**
   - Graph API Explorer에서:
   ```
   GET /{page-id}?fields=instagram_business_account
   ```
   - 또는:
   ```
   GET /{page-id}?fields=instagram_business_account{id,username}
   ```
   - 응답에서 `instagram_business_account.id` 값 확인
   - 예) `1234567890123456`

## Step 4: 환경 변수 설정

### .env.local 파일에 추가

프로젝트 루트 디렉토리의 `.env.local` 파일에 다음을 추가:

```env
# Facebook Graph API
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token_here
FACEBOOK_PAGE_ID=your_page_id_here

# Instagram Graph API
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_account_id_here
```

**중요:**
- 실제 토큰과 ID 값으로 교체하세요
- `.env.local` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함되어 있을 것입니다)
- Vercel에 배포할 때는 환경 변수를 Vercel 대시보드에서 설정해야 합니다

## Step 5: 코드 구현

이제 실제 포스팅 기능을 구현할 수 있습니다. 
`docs/SOCIAL_MEDIA_API_INTEGRATION.md` 파일의 "구현 방법" 섹션을 참고하세요.

## Step 6: 테스트

### 개발 환경에서 테스트

1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **관리자 페이지 접속**
   - http://localhost:3000/admin 접속
   - 로그인

3. **소셜 미디어 포스트 생성**
   - 마케팅 탭 → 소셜 미디어 탭
   - "새 포스트" 버튼 클릭
   - 제목, 설명, 이미지 URL, 플랫폼 선택
   - "자동 포스팅" 체크박스 선택
   - "포스트 생성" 클릭

4. **결과 확인**
   - Facebook 페이지와 Instagram 계정에서 실제 포스트 확인
   - 관리자 페이지의 포스트 목록에서 상태 확인

## 트러블슈팅

### 제품을 찾을 수 없는 경우

- 대시보드 상단의 검색창에서 "Instagram" 또는 "Pages" 검색
- 좌측 메뉴의 "제품" 섹션 확인
- 대시보드 새로고침 (F5)

### Instagram Graph API 설정 중 오류

- Facebook 페이지가 생성되어 있는지 확인
- Instagram 계정이 비즈니스 계정인지 확인
- 나중에 연결하는 옵션 선택

### 토큰 생성 실패

- 앱이 개발 모드인지 확인
- 필요한 권한이 모두 선택되었는지 확인
- Facebook 로그인 상태 확인

### 포스팅 테스트 실패

- 환경 변수가 올바르게 설정되었는지 확인
- Page Access Token이 유효한지 확인 (Graph API Explorer에서 테스트)
- Instagram 이미지 URL이 공개적으로 접근 가능한지 확인

