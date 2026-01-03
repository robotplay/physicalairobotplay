# 이메일 발송 문제 해결 가이드

## 🔍 문제 진단

강의문의 신청 메일이 정상적으로 작동하지 않는 경우 다음 단계로 문제를 진단하세요.

## 1단계: 환경 변수 확인

### Vercel 환경 변수 확인

1. Vercel 대시보드 접속: https://vercel.com/dashboard
2. 프로젝트 선택 → Settings → Environment Variables
3. 다음 환경 변수가 모두 설정되어 있는지 확인:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com (선택사항)
SMTP_FROM_NAME=피지컬 AI 교육 (선택사항)
```

### 환경 변수 자동 확인 API

브라우저나 curl로 다음 URL에 접속하여 환경 변수 상태를 확인할 수 있습니다:

```
GET https://your-domain.com/api/consultations/test-email
```

또는 Vercel Functions 로그에서 확인:

1. Vercel 대시보드 → 프로젝트 → Functions 탭
2. 최근 실행된 함수 로그 확인
3. "📧 이메일 서비스가 설정되지 않았습니다" 메시지 확인

## 2단계: 이메일 테스트 API 사용

### 테스트 이메일 전송

다음 API를 사용하여 이메일 발송 기능을 직접 테스트할 수 있습니다:

**요청:**
```bash
POST /api/consultations/test-email
Content-Type: application/json

{
  "to": "your-test-email@example.com"
}
```

**응답 예시:**
```json
{
  "success": true,
  "simulated": false,
  "messageId": "...",
  "envCheck": {
    "SMTP_HOST": "smtp.gmail.com",
    "SMTP_PORT": "587",
    "SMTP_USER": "✅ 설정됨",
    "SMTP_PASSWORD": "✅ 설정됨",
    "SMTP_FROM": "your-email@gmail.com",
    "SMTP_FROM_NAME": "피지컬 AI 교육"
  },
  "message": "이메일이 성공적으로 전송되었습니다."
}
```

## 3단계: Vercel 로그 확인

### 배포 로그 확인

1. Vercel 대시보드 → 프로젝트 → Deployments
2. 최신 배포 선택 → Logs 탭
3. 다음 메시지를 확인:

**정상 작동 시:**
```
📧 이메일 전송 성공: { to: '...', subject: '...', messageId: '...' }
```

**환경 변수 미설정 시:**
```
📧 이메일 서비스가 설정되지 않았습니다. 환경 변수를 확인해주세요.
📧 이메일 전송 시뮬레이션: { to: '...', subject: '...', html: '...' }
```

**에러 발생 시:**
```
📧 이메일 전송 오류: [에러 내용]
```

### Functions 로그 확인

1. Vercel 대시보드 → 프로젝트 → Functions 탭
2. `/api/consultations` 함수 선택
3. 최근 실행 로그 확인
4. 에러 메시지 확인

## 4단계: 일반적인 문제 및 해결 방법

### 문제 1: 환경 변수가 설정되지 않음

**증상:**
- 로그에 "이메일 서비스가 설정되지 않았습니다" 메시지
- `simulated: true` 응답

**해결 방법:**
1. Vercel 환경 변수에 모든 필수 변수 설정
2. Production, Preview, Development 환경 모두 체크
3. Save 버튼 클릭
4. **새 배포 트리거 필요** (환경 변수 변경 후 자동 재배포되지 않을 수 있음)

### 문제 2: Gmail 앱 비밀번호 오류

**증상:**
- "Invalid login" 또는 "Authentication failed" 에러

**해결 방법:**
1. Gmail 2단계 인증 활성화 확인
2. 앱 비밀번호가 정확히 복사되었는지 확인 (공백 제거)
3. 새 앱 비밀번호 생성 후 재설정
4. [Gmail 설정 가이드 참고](./EMAIL_SETUP.md#gmail-설정-방법)

### 문제 3: 이메일이 스팸함으로 이동

**증상:**
- 이메일이 발송되었지만 받은편지함에 없음

**해결 방법:**
1. 스팸함 확인
2. `SMTP_FROM_NAME`을 명확한 이름으로 설정
3. 도메인 이메일 사용 시 SPF, DKIM 설정

### 문제 4: Vercel 환경 변수 변경 후 반영 안 됨

**증상:**
- 환경 변수를 설정했지만 여전히 작동하지 않음

**해결 방법:**
1. 환경 변수 저장 후 **새 배포 트리거**
   - Vercel 대시보드 → Deployments → Redeploy 클릭
   - 또는 git push를 통해 새 배포 발생
2. 배포 완료 후 다시 테스트

### 문제 5: 이메일은 발송되지만 사용자가 받지 못함

**증상:**
- 로그에는 성공했지만 실제로 이메일을 받지 못함

**해결 방법:**
1. 올바른 이메일 주소를 입력했는지 확인
2. 오타 확인 (공백, 대소문자 등)
3. 발송된 이메일 주소와 입력한 주소 일치 확인
4. 다른 이메일 주소로 테스트

## 5단계: 상세 디버깅

### API 응답 확인

상담문의 제출 후 API 응답에 다음 필드가 포함됩니다:

```json
{
  "success": true,
  "data": { ... },
  "emailSent": true,      // 이메일 발송 성공 여부
  "emailError": null,     // 에러 발생 시 에러 메시지
  "message": "..."
}
```

**브라우저 개발자 도구에서 확인:**
1. F12 → Network 탭
2. 상담문의 제출
3. `/api/consultations` 요청 선택
4. Response 탭에서 `emailSent` 및 `emailError` 확인

### 코드 레벨 확인

`lib/email.ts`의 `createTransporter()` 함수에서:
- 환경 변수가 모두 설정되어 있는지 확인
- `transporter`가 `null`이 아닌지 확인

## 체크리스트

문제 해결을 위한 체크리스트:

- [ ] Vercel 환경 변수에 모든 필수 변수 설정됨
- [ ] SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD 모두 설정됨
- [ ] Production 환경에 체크되어 있음
- [ ] 환경 변수 저장 후 새 배포가 완료됨
- [ ] Gmail 앱 비밀번호가 정확함
- [ ] Gmail 2단계 인증이 활성화되어 있음
- [ ] 테스트 이메일 API로 정상 작동 확인
- [ ] Vercel 로그에서 에러 메시지 확인
- [ ] 올바른 이메일 주소 입력 확인

## 추가 도움말

- [이메일 설정 가이드](./EMAIL_SETUP.md)
- [Gmail 설정 방법](./EMAIL_SETUP.md#gmail-설정-방법)
- [Vercel 환경 변수 설정](./VERCEL_ENV_SETUP.md)







