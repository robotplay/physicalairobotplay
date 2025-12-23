# 이메일 발송 설정 가이드

## 개요

상담문의 및 특강신청 등록 시 자동으로 확인 이메일이 발송됩니다.

## 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해주세요:

### 필수 환경 변수

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_FROM_NAME=피지컬 AI 교육
```

### 환경 변수 설명

- **SMTP_HOST**: SMTP 서버 주소
  - Gmail: `smtp.gmail.com`
  - Outlook: `smtp-mail.outlook.com`
  - 네이버: `smtp.naver.com`
  - 기타: 제공업체에서 안내하는 SMTP 서버 주소

- **SMTP_PORT**: SMTP 포트 번호
  - 일반: `587` (TLS)
  - SSL: `465` (SSL)

- **SMTP_USER**: 이메일 계정 (발신자 이메일)
  - 예: `your-email@gmail.com`

- **SMTP_PASSWORD**: 이메일 계정 비밀번호 또는 앱 비밀번호
  - Gmail: [앱 비밀번호](https://myaccount.google.com/apppasswords) 사용 권장
  - 일반 비밀번호도 가능하지만 보안상 앱 비밀번호 권장

- **SMTP_FROM**: 발신자 이메일 주소 (선택사항)
  - 설정하지 않으면 `SMTP_USER` 사용

- **SMTP_FROM_NAME**: 발신자 이름 (선택사항)
  - 기본값: `피지컬 AI 교육`

## Gmail 설정 방법

### 1. Gmail 2단계 인증 활성화

1. [Google 계정 설정](https://myaccount.google.com/) 접속
2. 보안 → 2단계 인증 활성화

### 2. 앱 비밀번호 생성

1. [앱 비밀번호 페이지](https://myaccount.google.com/apppasswords) 접속
2. "앱 선택" → "메일" 선택
3. "기기 선택" → "기타(맞춤 이름)" → "피지컬 AI 교육" 입력
4. "생성" 클릭
5. 생성된 16자리 비밀번호 복사

### 3. Vercel 환경 변수 설정

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=생성한-16자리-앱-비밀번호
SMTP_FROM=your-email@gmail.com
SMTP_FROM_NAME=피지컬 AI 교육
```

## 네이버 메일 설정 방법

### 1. 네이버 메일 설정

```
SMTP_HOST=smtp.naver.com
SMTP_PORT=587
SMTP_USER=your-email@naver.com
SMTP_PASSWORD=네이버-비밀번호
SMTP_FROM=your-email@naver.com
SMTP_FROM_NAME=피지컬 AI 교육
```

**참고:** 네이버는 SMTP 사용을 위해 별도 설정이 필요할 수 있습니다.

## Outlook/Hotmail 설정 방법

```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=Outlook-비밀번호
SMTP_FROM=your-email@outlook.com
SMTP_FROM_NAME=피지컬 AI 교육
```

## 기타 SMTP 서비스

### SendGrid

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SendGrid-API-Key
SMTP_FROM=your-email@yourdomain.com
SMTP_FROM_NAME=피지컬 AI 교육
```

### AWS SES

```
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=AWS-SMTP-Username
SMTP_PASSWORD=AWS-SMTP-Password
SMTP_FROM=your-email@yourdomain.com
SMTP_FROM_NAME=피지컬 AI 교육
```

## 테스트 방법

### 1. 환경 변수 설정 확인

Vercel 대시보드에서 모든 환경 변수가 설정되었는지 확인하세요.

### 2. 배포 재시작

환경 변수를 추가한 후 배포가 자동으로 재시작됩니다.

### 3. 실제 테스트

1. **상담문의 테스트**
   - 웹사이트에서 상담문의 폼 작성
   - 이메일 주소 입력
   - 제출 후 이메일 수신 확인

2. **특강신청 테스트**
   - 특강신청 폼 작성
   - 이메일 주소 입력
   - 제출 후 이메일 수신 확인

## 이메일 발송 로직

### 상담문의

- **발송 조건**: 이메일 주소가 입력된 경우에만 발송
- **발송 시점**: 상담문의 제출 직후
- **이메일 내용**: 접수 확인 및 접수 정보

### 특강신청

- **발송 조건**: 이메일 주소가 입력된 경우에만 발송
- **발송 시점**: 신청서 제출 직후
- **이메일 내용**: 신청 접수 확인 및 신청 정보, 다음 단계 안내

## 문제 해결

### 이메일이 발송되지 않는 경우

1. **환경 변수 확인**
   - Vercel 대시보드에서 모든 환경 변수가 설정되었는지 확인
   - Production 환경에 체크되어 있는지 확인

2. **SMTP 설정 확인**
   - SMTP 서버 주소가 정확한지 확인
   - 포트 번호가 정확한지 확인
   - 사용자 이름과 비밀번호가 정확한지 확인

3. **로그 확인**
   - Vercel 배포 로그 확인
   - 서버 로그에서 이메일 발송 관련 에러 확인

4. **시뮬레이션 모드**
   - 환경 변수가 설정되지 않으면 시뮬레이션 모드로 동작
   - 콘솔에 이메일 내용이 출력됨
   - 실제 이메일은 발송되지 않음

### Gmail 앱 비밀번호 오류

- 2단계 인증이 활성화되어 있는지 확인
- 앱 비밀번호가 정확히 복사되었는지 확인 (공백 없이)
- 최근 생성한 앱 비밀번호인지 확인

### 이메일이 스팸함으로 이동하는 경우

- 발신자 이메일 주소를 신뢰할 수 있는 도메인으로 변경
- SPF, DKIM, DMARC 레코드 설정 (도메인 이메일 사용 시)
- 이메일 내용에 스팸 키워드 제거

## 보안 주의사항

1. **앱 비밀번호 사용 권장**
   - Gmail 등은 앱 비밀번호 사용 권장
   - 일반 비밀번호 사용 시 보안 위험

2. **환경 변수 보안**
   - 환경 변수는 절대 코드에 하드코딩하지 마세요
   - Vercel 환경 변수에만 저장하세요

3. **이메일 주소 검증**
   - 현재는 기본적인 형식 검증만 수행
   - 필요시 더 엄격한 검증 추가 가능

## 참고 자료

- [Nodemailer 문서](https://nodemailer.com/)
- [Gmail 앱 비밀번호](https://support.google.com/accounts/answer/185833)
- [Vercel 환경 변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)
