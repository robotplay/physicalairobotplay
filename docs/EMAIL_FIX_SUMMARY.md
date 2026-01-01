# 이메일 발송 기능 개선 완료

## ✅ 완료된 작업

### 1. 관리자 알림 이메일 기능 추가

**문제:** 상담문의 신청 시 관리자에게 이메일이 발송되지 않았음

**해결:**
- 관리자 알림 이메일 템플릿 함수 추가 (`createAdminConsultationNotificationTemplate`)
- 상담문의 API에 관리자 이메일 발송 로직 추가
- 관리자 이메일은 환경 변수 `ADMIN_EMAIL`에서 가져오거나, 없으면 `SMTP_FROM` 또는 `SMTP_USER` 사용

### 2. 이메일 발송 상태 추적 개선

- 신청자 이메일 발송 성공/실패 상태 추적
- 관리자 이메일 발송 성공/실패 상태 추적
- API 응답에 `emailSent`, `adminEmailSent`, `emailError` 필드 추가

### 3. 로깅 개선

- 이메일 발송 성공/실패 로그 추가
- 환경 변수 미설정 시 경고 메시지 출력

## 📧 이메일 발송 흐름

상담문의 신청 시:

1. **관리자 알림 이메일** 발송
   - 수신자: `ADMIN_EMAIL` 환경 변수 또는 `SMTP_FROM`/`SMTP_USER`
   - 내용: 신청자 정보 및 문의 내용
   - 관리자 페이지 링크 포함

2. **신청자 확인 이메일** 발송 (이메일 주소가 입력된 경우에만)
   - 수신자: 신청자가 입력한 이메일 주소
   - 내용: 접수 확인 및 접수 정보

## 🔧 환경 변수 설정

### 필수 환경 변수

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 선택 환경 변수

```
SMTP_FROM=your-email@gmail.com
SMTP_FROM_NAME=피지컬 AI 교육
ADMIN_EMAIL=admin@parplay.co.kr  # 관리자 알림 수신 이메일
```

**참고:** `ADMIN_EMAIL`이 설정되지 않으면 `SMTP_FROM` 또는 `SMTP_USER`를 관리자 이메일로 사용합니다.

## 🧪 테스트 방법

### 1. 상담문의 폼으로 테스트

1. 웹사이트에서 상담문의 모달 열기
2. 정보 입력:
   - 이름, 연락처, **이메일** (중요), 문의 내용
3. 제출하기 클릭
4. 브라우저 개발자 도구 (F12) → Network 탭
5. `/api/consultations` 요청 → Response 확인:
   ```json
   {
     "success": true,
     "emailSent": true,        // 신청자 이메일 발송 성공
     "adminEmailSent": true,   // 관리자 이메일 발송 성공
     ...
   }
   ```

### 2. Vercel 로그 확인

1. Vercel 대시보드 → 프로젝트 → Functions
2. `/api/consultations` 함수 선택
3. 최근 실행 로그 확인:
   - ✅ `📧 관리자 알림 이메일 발송 성공: admin@parplay.co.kr`
   - ✅ `📧 상담문의 확인 이메일 발송 성공: user@example.com`
   - ❌ `📧 관리자 알림 이메일 발송 실패: ...`
   - ❌ `📧 이메일 발송 실패 (상담문의): ...`

## 🚨 문제 해결

### 관리자 이메일이 발송되지 않는 경우

1. **환경 변수 확인**
   - Vercel 대시보드 → Settings → Environment Variables
   - `ADMIN_EMAIL` 또는 `SMTP_FROM`/`SMTP_USER` 설정 확인

2. **로그 확인**
   - Vercel Functions 로그에서 "📧 관리자 알림 이메일 발송 성공" 메시지 확인
   - 에러가 있으면 에러 메시지 확인

3. **이메일 주소 확인**
   - 관리자 이메일 주소가 올바른지 확인
   - 스팸함도 확인

### 신청자 이메일이 발송되지 않는 경우

1. **이메일 주소 입력 확인**
   - 상담문의 폼에서 이메일 주소를 입력했는지 확인

2. **환경 변수 확인**
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` 모두 설정되어 있는지 확인
   - [이메일 설정 가이드](./EMAIL_SETUP.md) 참고

3. **로그 확인**
   - Vercel Functions 로그에서 "📧 이메일 발송 실패" 메시지 확인
   - 에러 내용 확인

## 📝 관련 문서

- [이메일 설정 가이드](./EMAIL_SETUP.md)
- [이메일 문제 해결 가이드](./EMAIL_TROUBLESHOOTING.md)
- [이메일 테스트 가이드](./EMAIL_TEST_GUIDE.md)






