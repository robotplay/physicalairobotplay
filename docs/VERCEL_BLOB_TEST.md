# Vercel Blob Storage 테스트 가이드

## ✅ 환경 변수 확인 완료

`BLOB_READ_WRITE_TOKEN` 환경 변수가 설정되어 있다면, 다음 단계를 진행하세요.

---

## 🚀 테스트 단계

### 1단계: 재배포 확인

1. **Vercel 대시보드 → Deployments**
   - 최근 배포가 완료되었는지 확인
   - 환경 변수 추가 후 자동 재배포되었는지 확인

2. **수동 재배포 (필요한 경우)**
   - 최근 배포 탭에서 **"Redeploy"** 클릭
   - 또는 코드 변경 후 자동 배포 대기

### 2단계: 이미지 업로드 테스트

1. **관리자 페이지 접속**
   - https://www.parplay.co.kr/admin
   - 로그인

2. **공지사항 작성**
   - **공지사항** 탭 클릭
   - **"새 공지사항 작성"** 클릭

3. **이미지 업로드**
   - 이미지 파일 선택
   - **"업로드"** 버튼 클릭
   - 업로드 완료 메시지 확인

4. **응답 확인**
   - 브라우저 개발자 도구 → **Network** 탭
   - `/api/news/upload` 요청 클릭
   - **Response** 탭에서 확인:
     ```json
     {
       "success": true,
       "path": "https://xxx.public.blob.vercel-storage.com/images/xxx.jpg",
       "storageType": "blob",
       "message": "이미지가 업로드되었습니다. (최적화: 45.2% 용량 감소, CDN 사용)"
     }
     ```

### 3단계: 성능 확인

1. **이미지 로딩 속도 확인**
   - 브라우저 개발자 도구 → **Network** 탭
   - 이미지 요청 확인
   - **Time** 컬럼에서 로딩 시간 확인
   - 예상: **200-500ms** (이전 1-3초에서 개선)

2. **CDN 헤더 확인**
   - 이미지 요청 → **Headers** 탭
   - 다음 헤더 확인:
     - `x-vercel-cache`: CDN 캐시 상태
     - `cf-cache-status`: Cloudflare 캐시 상태

---

## ✅ 성공 확인 체크리스트

- [ ] `storageType: "blob"` 응답 확인
- [ ] 이미지 URL이 `https://*.public.blob.vercel-storage.com/` 형식
- [ ] 이미지가 정상적으로 표시됨
- [ ] 이미지 로딩 속도 개선 확인 (200-500ms)
- [ ] CDN 헤더 확인

---

## 🔧 문제 해결

### `storageType: "base64"`로 표시되는 경우

**원인**: 환경 변수가 제대로 적용되지 않음

**해결**:
1. **재배포 확인**
   - 환경 변수 추가 후 재배포가 완료되었는지 확인
   - 수동으로 "Redeploy" 클릭

2. **환경 변수 확인**
   - Settings → Environment Variables
   - `BLOB_READ_WRITE_TOKEN` 값이 올바른지 확인
   - Production, Preview, Development 모두 설정되었는지 확인

3. **Storage 연결 확인**
   - Storage 탭에서 Blob Storage가 프로젝트에 연결되었는지 확인

### 이미지가 표시되지 않는 경우

**해결**:
1. **CDN URL 확인**
   - 업로드 응답의 `path`가 올바른 URL인지 확인
   - 브라우저에서 직접 URL 접근 테스트

2. **CORS 확인**
   - Vercel Blob Storage는 기본적으로 CORS가 활성화되어 있습니다
   - 브라우저 콘솔에서 CORS 에러 확인

3. **네트워크 확인**
   - 브라우저 개발자 도구 → Network 탭
   - 이미지 요청 상태 코드 확인 (200 OK인지)

---

## 📊 성능 개선 확인

### Before (Base64)
- 이미지 로딩: **1-3초**
- 데이터베이스 크기: **큼** (이미지 포함)
- 페이지 로딩: **느림**

### After (Vercel Blob Storage)
- 이미지 로딩: **200-500ms** ✅
- 데이터베이스 크기: **작음** (URL만 저장) ✅
- 페이지 로딩: **빠름** (CDN 캐싱) ✅

---

## 🎯 다음 단계

1. **이미지 업로드 테스트** 완료
2. **성능 개선 확인** 완료
3. **기존 Base64 이미지**: 그대로 작동 (호환성 유지)
4. **새 이미지**: 모두 Blob Storage에 저장됨

---

**작성일**: 2025년 1월 2일  
**상태**: 테스트 가이드 완료

