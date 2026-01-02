# Vercel Blob Storage 빠른 설정 가이드

## ✅ Blob Storage 생성 완료 후

이미 "Created Blob store successfully" 메시지가 표시되었다면, 다음 단계를 진행하세요.

---

## 🚀 빠른 설정 (3단계)

### 1단계: 환경 변수 확인

1. **Vercel 대시보드 → Settings → Environment Variables**

2. **자동 생성 확인**
   - `BLOB_READ_WRITE_TOKEN` 환경 변수가 자동으로 생성되었는지 확인
   - ✅ **있으면**: 2단계로 넘어가세요
   - ❌ **없으면**: 아래 "수동 설정" 참조

### 2단계: Storage 연결 확인

1. **Storage 탭으로 이동**
   - 프로젝트 설정 → **Storage** 탭

2. **Blob Storage 확인**
   - 생성된 Blob Storage가 프로젝트에 연결되어 있는지 확인
   - 연결되어 있다면 "Connected" 또는 "Linked" 표시

### 3단계: 재배포 및 테스트

1. **자동 재배포 대기**
   - Vercel이 환경 변수 변경을 감지하여 자동 재배포
   - 또는 수동으로 "Redeploy" 클릭

2. **이미지 업로드 테스트**
   - 관리자 페이지 → 공지사항 작성
   - 이미지 업로드
   - 업로드 응답에서 `storageType: "blob"` 확인

---

## 🔧 환경 변수가 자동 생성되지 않은 경우

### 방법 1: Storage 페이지에서 확인

1. **Storage 탭 클릭**
   - 프로젝트 설정 → **Storage** 탭

2. **Blob Storage 클릭**
   - 생성된 Blob Storage 클릭

3. **연결 정보 확인**
   - "Connect" 또는 "Link to Project" 버튼이 있다면 클릭
   - 또는 "Settings" 또는 "Configuration" 메뉴 확인

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 프로젝트 디렉토리에서
cd /Users/hkjtop/academy-site
vercel link

# 환경 변수 확인
vercel env ls
```

### 방법 3: 수동 환경 변수 추가

1. **Settings → Environment Variables**

2. **"Add New" 클릭**

3. **환경 변수 입력**
   - **Key**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: 
     - Storage 페이지에서 토큰 복사
     - 또는 Vercel CLI: `vercel env pull` 실행 후 `.env.local` 확인
   - **Environment**: Production, Preview, Development 모두 선택
   - **"Save"** 클릭

---

## ✅ 확인 방법

### 이미지 업로드 API 응답

성공 시:
```json
{
  "success": true,
  "path": "https://xxx.public.blob.vercel-storage.com/images/xxx.jpg",
  "storageType": "blob"
}
```

실패 시 (Base64 fallback):
```json
{
  "success": true,
  "path": "data:image/jpeg;base64,...",
  "storageType": "base64"
}
```

---

## 🔍 문제 해결

### "storageType": "base64"로 표시되는 경우

**원인**: `BLOB_READ_WRITE_TOKEN` 환경 변수가 없거나 잘못됨

**해결**:
1. Vercel 환경 변수에 `BLOB_READ_WRITE_TOKEN` 확인
2. 재배포 실행
3. 다시 테스트

### Storage가 프로젝트에 연결되지 않은 경우

**해결**:
1. Storage 탭에서 Blob Storage 클릭
2. "Connect to Project" 또는 "Link" 버튼 클릭
3. 프로젝트 선택 후 연결

---

## 📝 참고

- **Vercel Blob Storage**: 프로젝트에 연결되면 자동으로 환경 변수가 설정될 수 있습니다
- **재배포 필요**: 환경 변수 추가 후 반드시 재배포해야 합니다
- **기존 Base64 이미지**: 그대로 작동합니다 (호환성 유지)

---

**작성일**: 2025년 1월 2일  
**상태**: 빠른 설정 가이드 완료

