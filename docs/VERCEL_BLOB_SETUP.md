# Vercel Blob Storage 설정 가이드

## 📋 개요

이미지 로딩 속도를 향상시키기 위해 Vercel Blob Storage를 사용합니다. Base64 저장 방식에서 CDN 기반 저장 방식으로 전환하여 성능을 크게 개선할 수 있습니다.

---

## 🚀 설정 방법

### 1단계: Vercel Blob Storage 활성화

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard 접속
   - 프로젝트 선택

2. **Storage 탭 클릭**
   - 프로젝트 설정 → **Storage** 탭 클릭

3. **Blob Storage 생성**
   - **"Create Database"** 또는 **"Add Storage"** 클릭
   - **"Blob"** 선택
   - Storage 이름 입력 (예: `academy-images`)
   - **"Create"** 클릭

4. **토큰 생성**
   - Storage 생성 후 **"Settings"** → **"Tokens"** 클릭
   - **"Create Token"** 클릭
   - Token 이름 입력 (예: `academy-site-upload`)
   - 권한: **Read and Write** 선택
   - **"Create"** 클릭
   - **토큰 복사** (한 번만 표시되므로 안전하게 보관)

### 2단계: 환경 변수 설정

1. **Vercel 대시보드 → Settings → Environment Variables**

2. **환경 변수 추가**
   - **Key**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: 위에서 복사한 토큰
   - **Environment**: Production, Preview, Development 모두 선택
   - **"Save"** 클릭

3. **로컬 개발 환경 설정** (선택사항)
   - `.env.local` 파일에 추가:
     ```
     BLOB_READ_WRITE_TOKEN=your_token_here
     ```

### 3단계: 배포 및 확인

1. **변경사항 커밋 및 푸시**
   ```bash
   git add .
   git commit -m "feat: Vercel Blob Storage 통합"
   git push origin main
   ```

2. **Vercel 자동 배포 확인**
   - Vercel이 자동으로 배포를 시작합니다
   - 배포 완료 후 이미지 업로드 테스트

3. **이미지 업로드 테스트**
   - 관리자 페이지 → 공지사항 작성
   - 이미지 업로드
   - 업로드된 이미지 URL이 `https://*.public.blob.vercel-storage.com/` 형식인지 확인

---

## ✅ 확인 방법

### 이미지 업로드 API 응답 확인

업로드 성공 시 응답:
```json
{
  "success": true,
  "path": "https://xxx.public.blob.vercel-storage.com/images/xxx.jpg",
  "storageType": "blob",
  "message": "이미지가 업로드되었습니다. (최적화: 45.2% 용량 감소, CDN 사용)"
}
```

### 브라우저 개발자 도구 확인

1. **Network 탭**에서 이미지 요청 확인
2. **Response Headers**에서 CDN 헤더 확인:
   - `x-vercel-cache`: CDN 캐시 상태
   - `cf-cache-status`: Cloudflare 캐시 상태

---

## 🔄 기존 Base64 이미지와의 호환성

### 자동 Fallback

- **Blob Storage 사용 가능**: CDN URL 반환
- **Blob Storage 사용 불가**: Base64 반환 (기존 방식)
- **기존 Base64 이미지**: 그대로 표시됨 (호환성 유지)

### 이미지 표시 로직

현재 코드는 Base64와 CDN URL을 모두 지원합니다:
- `data:image/`로 시작 → Base64 이미지
- `https://`로 시작 → CDN URL 이미지

---

## 📊 성능 개선 효과

### Before (Base64)
- 이미지 로딩: **1-3초**
- 데이터베이스 크기: **큼** (이미지 포함)
- 페이지 로딩: **느림**

### After (Vercel Blob Storage)
- 이미지 로딩: **200-500ms** (5-10배 빠름)
- 데이터베이스 크기: **작음** (URL만 저장)
- 페이지 로딩: **빠름** (CDN 캐싱)

---

## ⚠️ 주의사항

### 1. 토큰 보안
- **절대 공개 저장소에 커밋하지 마세요**
- `.env.local`은 `.gitignore`에 포함되어 있어야 합니다
- Vercel 환경 변수로만 관리하는 것을 권장합니다

### 2. 비용
- **무료 플랜**: 월 1GB 저장, 10GB 전송
- **Pro 플랜**: 월 10GB 저장, 100GB 전송
- 대부분의 경우 무료 플랜으로 충분합니다

### 3. 마이그레이션
- 기존 Base64 이미지는 그대로 작동합니다
- 새로운 이미지만 Blob Storage에 저장됩니다
- 필요 시 기존 이미지를 마이그레이션할 수 있습니다 (선택사항)

---

## 🔧 문제 해결

### Blob Storage 업로드 실패

**증상**: 이미지 업로드 시 Base64로 fallback됨

**원인 및 해결**:
1. **토큰 미설정**
   - Vercel 환경 변수에 `BLOB_READ_WRITE_TOKEN` 확인
   - 토큰이 올바른지 확인

2. **토큰 권한 부족**
   - 토큰이 **Read and Write** 권한인지 확인
   - 새 토큰 생성 후 재설정

3. **Storage 미생성**
   - Vercel 대시보드에서 Blob Storage가 생성되었는지 확인

### 이미지가 표시되지 않음

**증상**: 업로드는 성공했지만 이미지가 표시되지 않음

**해결**:
1. **CDN URL 확인**
   - 업로드 응답의 `path`가 `https://`로 시작하는지 확인
2. **CORS 설정**
   - Vercel Blob Storage는 기본적으로 CORS가 활성화되어 있습니다
3. **브라우저 콘솔 확인**
   - 네트워크 에러가 있는지 확인

---

## 📝 참고

- **Vercel Blob Storage 문서**: https://vercel.com/docs/storage/vercel-blob
- **@vercel/blob 패키지**: https://www.npmjs.com/package/@vercel/blob
- **성능 개선 가이드**: `docs/PERFORMANCE_IMPROVEMENTS.md`

---

**작성일**: 2025년 1월 2일  
**상태**: 설정 가이드 완료

