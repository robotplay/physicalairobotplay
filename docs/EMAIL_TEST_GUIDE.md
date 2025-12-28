# 이메일 발송 테스트 가이드

## 현재 상황

테스트 API (`/api/consultations/test-email`)는 새로 추가된 파일이므로 **배포가 필요**합니다.

## 즉시 테스트 방법

### 방법 1: 기존 상담문의 API로 테스트 (권장)

실제 상담문의 폼을 사용하여 이메일 발송을 테스트할 수 있습니다:

1. 웹사이트의 상담문의 모달 열기
2. 다음 정보 입력:
   - 이름: (테스트용 이름)
   - 연락처: (테스트용 전화번호)
   - **이메일**: (테스트할 이메일 주소) ⭐ 중요
   - 관심 과정: (선택)
   - 문의 내용: (테스트용 메시지)
3. 제출하기 클릭
4. 브라우저 개발자 도구 (F12) → Network 탭에서 응답 확인
5. Response에서 `emailSent` 필드 확인:
   ```json
   {
     "success": true,
     "emailSent": true,  // 또는 false
     "emailError": null, // 또는 에러 메시지
     ...
   }
   ```

### 방법 2: Vercel 로그 확인

1. Vercel 대시보드 → 프로젝트 → Functions
2. `/api/consultations` 함수 선택
3. 최근 실행 로그에서 다음 메시지 확인:
   - ✅ 성공: `📧 상담문의 확인 이메일 발송 성공: your-email@example.com`
   - ❌ 실패: `📧 이메일 발송 실패 (상담문의): [에러 내용]`
   - ⚠️ 미설정: `📧 이메일 서비스가 설정되지 않았습니다`

## 테스트 API 사용 (배포 후)

### 1. 배포

테스트 API를 사용하려면 먼저 배포가 필요합니다:

```bash
# Git에 추가 및 커밋
git add app/api/consultations/test-email/
git commit -m "Add email test API endpoint"

# Vercel에 배포 (자동 배포가 설정되어 있다면 push만 하면 됨)
git push
```

또는 Vercel 대시보드에서:
1. Deployments → Redeploy 클릭

### 2. 배포 후 테스트

**GET 요청 (환경 변수 확인):**
```
브라우저에서 접속:
https://parplay.co.kr/api/consultations/test-email
```

**POST 요청 (이메일 테스트):**
브라우저 개발자 도구 콘솔에서:
```javascript
fetch('/api/consultations/test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: 'your-test-email@example.com' })
})
.then(r => r.json())
.then(console.log)
```

## 문제 해결

### 환경 변수 확인

1. Vercel 대시보드 → Settings → Environment Variables
2. 다음 변수가 모두 설정되어 있는지 확인:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASSWORD`
   - `SMTP_FROM` (선택사항)
   - `SMTP_FROM_NAME` (선택사항)

### 배포 확인

- Vercel 대시보드 → Deployments
- 최신 배포가 성공적으로 완료되었는지 확인
- 빌드 로그에서 에러가 없는지 확인

### 로그 확인

- Vercel 대시보드 → 프로젝트 → Functions → `/api/consultations`
- 최근 실행 로그에서 에러 메시지 확인




