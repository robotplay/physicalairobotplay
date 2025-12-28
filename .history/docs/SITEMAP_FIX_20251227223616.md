# 사이트맵 개선 및 수정 가이드

## 🔍 발견된 문제

1. **정적 사이트맵 파일 사용**
   - `public/sitemap.xml`이 정적 파일로 존재
   - 마지막 수정일이 2025-12-25로 고정되어 업데이트되지 않음

2. **동적 콘텐츠 누락**
   - 뉴스 페이지 (`/news/[id]`)가 사이트맵에 포함되지 않음
   - 온라인 강좌 페이지 (`/online-courses/[id]`)가 사이트맵에 포함되지 않음

3. **잘못된 사이트맵 제출**
   - `/sitemap..xml` (타이핑 오류)가 Google Search Console에 등록됨
   - "가져올 수 없음" 상태

4. **불필요한 항목 포함**
   - `icon.png` 같은 이미지 파일이 사이트맵에 포함됨 (일반적으로 제외)

## ✅ 해결 방법

### 1. 동적 사이트맵 생성 구현

Next.js 13+ App Router의 `app/sitemap.ts` 파일을 사용하여 동적 사이트맵 생성:

**파일 위치:** `app/sitemap.ts`

**주요 기능:**
- 정적 페이지 자동 포함 (홈, 과정 페이지, 커리큘럼 등)
- MongoDB에서 뉴스 항목 동적으로 가져와서 포함
- MongoDB에서 온라인 강좌 동적으로 가져와서 포함
- 각 페이지에 적절한 우선순위 및 변경 빈도 설정
- MongoDB 연결 실패 시에도 정적 페이지 반환

### 2. 정적 사이트맵 파일 제거

`public/sitemap.xml` 파일을 삭제했습니다. Next.js가 자동으로 `app/sitemap.ts`를 사용하여 `/sitemap.xml` 경로에서 동적 사이트맵을 제공합니다.

### 3. Google Search Console 정리

**작업 필요:**

`/sitemap..xml` (잘못된 사이트맵)은 삭제할 수 없을 수 있습니다. 하지만 문제없습니다:

**방법 1: 세 점 메뉴에서 삭제 시도**
1. Google Search Console → Sitemaps 섹션
2. `/sitemap..xml` 행의 오른쪽 **세 점 메뉴 (⋮)** 클릭
3. 드롭다운 메뉴에서 **"삭제"** 옵션 찾기
   - 삭제 옵션이 보이지 않으면 다음 방법 사용

**방법 2: 삭제 옵션이 없는 경우 (권장)**

실제로 `/sitemap..xml`은 **"가져올 수 없음"** 상태이고 **0개 페이지**만 발견했으므로:
- Google이 이미 이 사이트맵을 무시하고 있습니다
- 검색 결과에 영향을 주지 않습니다
- 삭제하지 않아도 문제없습니다

**중요:** `/sitemap.xml`이 **"성공"** 상태이면 이 것이 사용됩니다.

**방법 3: 시간이 지나면 자동으로 사라질 수 있음**

일부 경우 Google이 오류가 있는 사이트맵을 자동으로 제거하기도 합니다.

**결론:** `/sitemap..xml`을 삭제할 수 없다면 무시해도 됩니다. `/sitemap.xml`만 제대로 작동하면 됩니다.

### 4. 사이트맵 재제출

**방법 1: Google Search Console에서**
1. Google Search Console → Sitemaps
2. "새 사이트맵 추가" 섹션
3. `sitemap.xml` 입력
4. "제출" 클릭

**방법 2: robots.txt 확인**
- `robots.txt`에 이미 `Sitemap: https://parplay.co.kr/sitemap.xml` 포함되어 있음
- Google이 자동으로 발견함

## 📊 사이트맵 구조

### 정적 페이지 (항상 포함)

| URL | 우선순위 | 변경 빈도 |
|-----|---------|-----------|
| `/` | 1.0 | daily |
| `/basic-course` | 0.9 | weekly |
| `/advanced-course` | 0.9 | weekly |
| `/airrobot-course` | 0.8 | monthly |
| `/curriculum` | 0.7 | monthly |
| `/news` | 0.8 | daily |
| `/program/airplane` | 0.6 | monthly |
| `/program/airplane/success` | 0.7 | monthly |
| `/program/airplane/fail` | 0.6 | monthly |
| `/my-classroom` | 0.5 | monthly |

### 동적 페이지 (MongoDB에서 가져옴)

- **뉴스 항목**: `/news/[id]`
  - 우선순위: 0.7
  - 변경 빈도: weekly
  - lastModified: 업데이트 날짜 또는 생성 날짜

- **온라인 강좌**: `/online-courses/[id]`
  - 우선순위: 0.7
  - 변경 빈도: monthly
  - lastModified: 업데이트 날짜 또는 생성 날짜

## 🧪 테스트 방법

### 1. 로컬에서 테스트

```bash
npm run dev
```

브라우저에서 접속:
```
http://localhost:3000/sitemap.xml
```

확인 사항:
- XML 형식이 올바른지
- 모든 정적 페이지가 포함되어 있는지
- 동적 페이지가 포함되어 있는지 (MongoDB 연결 시)

### 2. 프로덕션에서 테스트

배포 후:
```
https://parplay.co.kr/sitemap.xml
```

확인 사항:
- 사이트맵이 정상적으로 로드되는지
- 최신 날짜가 반영되는지
- 뉴스 및 강좌 페이지가 포함되어 있는지

### 3. Google Search Console에서 확인

1. Google Search Console → Sitemaps
2. `/sitemap.xml` 상태 확인
3. "성공" 상태여야 함
4. "발견된 페이지" 수 확인
5. "마지막으로 읽은 날짜" 확인

## 🔄 배포 후 확인 체크리스트

- [ ] `app/sitemap.ts` 파일이 배포되었는지 확인
- [ ] `public/sitemap.xml` 파일이 제거되었는지 확인
- [ ] `https://parplay.co.kr/sitemap.xml` 접속 시 XML이 정상적으로 표시되는지 확인
- [ ] Google Search Console에서 `/sitemap.xml` 상태가 "성공"인지 확인
- [ ] `/sitemap..xml` (잘못된 사이트맵)이 삭제되었는지 확인
- [ ] "발견된 페이지" 수가 증가했는지 확인 (뉴스 및 강좌 포함)

## 📝 참고 사항

### MongoDB 연결이 없는 경우

MongoDB URI가 설정되지 않았거나 연결에 실패해도:
- 정적 페이지는 정상적으로 사이트맵에 포함됨
- 동적 페이지(뉴스, 강좌)만 제외됨
- 에러 로그는 출력되지만 사이트맵 생성은 계속 진행됨

### 사이트맵 크기 제한

- Google은 사이트맵 파일당 최대 50,000개 URL 허용
- 파일 크기 최대 50MB (압축 시)
- 현재 구조에서는 문제 없음

### 업데이트 주기

- Next.js는 빌드 시 사이트맵을 생성
- Vercel에서는 배포 시마다 사이트맵이 새로 생성됨
- Google은 보통 몇 시간~하루에 한 번 사이트맵을 읽음

## 🆘 문제 해결

### 사이트맵이 404 에러를 반환하는 경우

1. `app/sitemap.ts` 파일이 올바른 위치에 있는지 확인
2. Next.js 빌드 로그 확인 (에러가 있는지)
3. 배포가 완료되었는지 확인

### 동적 페이지가 포함되지 않는 경우

1. MongoDB 연결 확인:
   - `MONGODB_URI` 환경 변수 설정 확인
   - Vercel Functions 로그에서 에러 확인

2. 데이터 존재 확인:
   - 뉴스 및 온라인 강좌 데이터가 MongoDB에 있는지 확인

### Google Search Console에서 사이트맵을 읽지 못하는 경우

1. 사이트맵 URL 직접 접속하여 확인
2. XML 형식이 올바른지 확인
3. `robots.txt`에 사이트맵 참조가 있는지 확인
4. Google Search Console에서 수동으로 사이트맵 재제출

