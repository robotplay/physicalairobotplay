# Google Search Console 사이트맵 관리 가이드

## 현재 상황

Google Search Console에서 두 개의 사이트맵이 등록되어 있습니다:

1. `/sitemap..xml` - ❌ "가져올 수 없음" (오류 상태, 0개 페이지)
2. `/sitemap.xml` - ✅ "성공" (정상 작동)

## `/sitemap..xml` 삭제 방법

### 방법 1: 세 점 메뉴에서 삭제

1. Google Search Console 접속
2. 왼쪽 메뉴에서 **"Sitemaps"** 클릭
3. `/sitemap..xml` 행의 **오른쪽 끝에 있는 세 점 아이콘 (⋮)** 클릭
4. 드롭다운 메뉴에서 **"삭제"** 또는 **"Remove"** 선택
5. 확인 대화상자에서 삭제 확인

**참고:** 일부 경우 삭제 옵션이 보이지 않을 수 있습니다 (Google의 버그 또는 제한사항).

### 방법 2: 삭제 옵션이 없는 경우

**중요:** 삭제할 수 없다고 해서 문제가 되지 않습니다!

**이유:**
- `/sitemap..xml`은 이미 **"가져올 수 없음"** 상태입니다
- **0개 페이지**만 발견했습니다
- Google이 이미 이 사이트맵을 무시하고 있습니다
- 검색 결과에 전혀 영향을 주지 않습니다

**실제로 중요한 것:**
- ✅ `/sitemap.xml`이 **"성공"** 상태입니다
- ✅ 이것이 실제로 사용되는 사이트맵입니다
- ✅ `/sitemap.xml`만 제대로 작동하면 됩니다

### 방법 3: 다른 방법 (고급)

만약 정말 삭제하고 싶다면:

1. Google Search Console → **Settings** (설정)
2. **Users and permissions** (사용자 및 권한) 확인
3. 권한이 있는지 확인

또는:
- Google Search Console API를 사용하여 삭제 (개발자 필요)

## 권장 조치

### 현재 상태로도 문제없음

`/sitemap..xml`을 삭제할 수 없다면:
- ✅ **무시해도 됩니다**
- ✅ `/sitemap.xml`만 제대로 작동하면 됩니다
- ✅ 검색 엔진 최적화에 영향 없습니다

### 집중해야 할 것

1. `/sitemap.xml`이 계속 "성공" 상태인지 확인
2. "발견된 페이지" 수가 정확한지 확인
3. 새로운 페이지가 추가되면 사이트맵이 자동으로 업데이트되는지 확인

## 사이트맵 확인 방법

### 1. 사이트맵 직접 접속

브라우저에서:
```
https://parplay.co.kr/sitemap.xml
```

확인 사항:
- XML 형식이 올바른지
- 모든 페이지가 포함되어 있는지
- 날짜가 최신인지

### 2. Google Search Console에서 확인

1. Google Search Console → Sitemaps
2. `/sitemap.xml` 행 확인:
   - ✅ 상태: "성공"
   - ✅ 마지막으로 읽은 날짜: 최신 날짜
   - ✅ 발견된 페이지: 숫자 확인

### 3. URL 검사 도구 사용

1. Google Search Console → URL 검사
2. 특정 페이지 URL 입력 (예: `https://parplay.co.kr/news`)
3. "색인 생성됨" 확인

## 자주 묻는 질문

### Q: `/sitemap..xml`을 삭제할 수 없는데 괜찮나요?

**A:** 네, 문제없습니다. 이미 "가져올 수 없음" 상태이고 0개 페이지만 발견했으므로 Google이 무시하고 있습니다.

### Q: 두 개의 사이트맵이 있는 게 문제가 되나요?

**A:** 아니요. Google은 성공한 사이트맵만 사용합니다. 실패한 사이트맵은 무시됩니다.

### Q: `/sitemap.xml`만 사용하도록 할 수 있나요?

**A:** 이미 `/sitemap.xml`만 사용되고 있습니다. `/sitemap..xml`은 실패했으므로 사용되지 않습니다.

### Q: 사이트맵이 제대로 업데이트되고 있나요?

**A:** 확인 방법:
1. `https://parplay.co.kr/sitemap.xml` 직접 접속
2. 날짜가 최신인지 확인
3. 뉴스 및 강좌 페이지가 포함되어 있는지 확인

## 다음 단계

1. ✅ `/sitemap.xml`이 "성공" 상태인지 확인
2. ✅ 사이트맵이 최신 데이터를 포함하는지 확인
3. ✅ Google이 페이지를 정상적으로 색인 생성하는지 확인
4. ⚠️ `/sitemap..xml`은 무시 (삭제 불가능해도 문제없음)

## 추가 도움말

- [사이트맵 개선 가이드](./SITEMAP_FIX.md)
- [Google Search Console 도움말](https://support.google.com/webmasters/answer/7451001)







