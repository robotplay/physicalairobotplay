# ADMIN_EMAIL 환경 변수 설정 가이드

## 📧 개요

`ADMIN_EMAIL` 환경 변수는 상담문의나 특강신청이 접수될 때 관리자에게 알림 이메일을 보낼 이메일 주소를 지정합니다.

## 🎯 사용되는 곳

- **상담문의 API** (`/api/consultations`): 새로운 상담 문의가 접수될 때
- **특강신청 API** (`/api/airplane-registration`): 새로운 특강신청이 접수될 때

## ⚙️ 설정 방법

### 방법 1: Vercel 환경 변수 설정 (프로덕션)

1. **Vercel 대시보드 접속**
   - [https://vercel.com](https://vercel.com) 접속
   - 로그인 후 프로젝트 선택

2. **프로젝트 설정으로 이동**
   - 프로젝트 페이지에서 **"Settings"** 클릭
   - 왼쪽 메뉴에서 **"Environment Variables"** 클릭

3. **환경 변수 추가**
   - **"Add New"** 버튼 클릭
   - **Key**: `ADMIN_EMAIL` 입력
   - **Value**: 관리자 이메일 주소 입력 (예: `admin@parplay.co.kr` 또는 `your-email@gmail.com`)
   - **Environment**: 필요한 환경 선택
     - ✅ **Production** (프로덕션 환경)
     - ✅ **Preview** (프리뷰 환경, 선택사항)
     - ✅ **Development** (개발 환경, 선택사항)
   - **"Save"** 버튼 클릭

4. **배포 다시 시작 (필수)**
   - 환경 변수를 추가/수정한 후에는 **반드시 재배포**해야 합니다
   - **"Deployments"** 탭으로 이동
   - 최신 배포의 **"..."** 메뉴 클릭
   - **"Redeploy"** 선택
   - 또는 코드를 커밋/푸시하면 자동으로 재배포됩니다

### 방법 2: 로컬 개발 환경 (.env.local)

1. **프로젝트 루트 디렉토리로 이동**
   ```bash
   cd /Users/hkjtop/academy-site
   ```

2. **.env.local 파일 편집**
   - 파일이 없으면 생성
   - 파일에 다음 내용 추가:
   ```env
   ADMIN_EMAIL=admin@parplay.co.kr
   ```
   또는
   ```env
   ADMIN_EMAIL=your-email@gmail.com
   ```

3. **개발 서버 재시작**
   ```bash
   # 개발 서버가 실행 중이면 중지 (Ctrl+C)
   npm run dev
   ```

## 🔍 설정 확인 방법

### 1. API 테스트

상담문의를 제출하면 응답에 `adminEmailSent` 필드가 포함됩니다:

```json
{
  "success": true,
  "adminEmailSent": true,
  "message": "상담 문의가 접수되었고 문자 알림이 전송되었습니다. 관리자에게 알림 이메일이 발송되었습니다."
}
```

### 2. Vercel 로그 확인

Vercel 대시보드에서 Functions 로그 확인:
- **Deployments** → 최신 배포 → **Functions** 탭
- 상담문의나 특강신청이 접수될 때 로그 확인:
  ```
  📧 관리자 알림 이메일 발송 성공: admin@parplay.co.kr
  ```

### 3. 환경 변수 확인 API (개발용)

로컬 개발 환경에서:
```bash
curl http://localhost:3000/api/consultations/test-email
```

응답에서 환경 변수 상태 확인 가능합니다.

## ⚠️ 중요 사항

### ADMIN_EMAIL이 설정되지 않은 경우

`ADMIN_EMAIL` 환경 변수가 설정되지 않으면, 시스템은 다음 순서로 대체 값을 시도합니다:

1. `ADMIN_EMAIL` 환경 변수
2. `SMTP_FROM` 환경 변수 (이메일 발송자 주소)
3. `SMTP_USER` 환경 변수 (SMTP 사용자명)

**결과:**
- 관리자 이메일이 설정되지 않으면 관리자 알림 이메일이 발송되지 않습니다
- 상담문의나 특강신청은 정상적으로 접수되지만, 관리자에게는 이메일 알림이 가지 않습니다
- 로그에 경고 메시지가 출력됩니다:
  ```
  📧 관리자 이메일 주소가 설정되지 않았습니다. ADMIN_EMAIL 환경 변수를 설정해주세요.
  ```

### 이메일 발송 실패 시

관리자 알림 이메일 발송이 실패해도:
- 상담문의/특강신청은 정상적으로 접수됩니다
- 신청자에게 확인 이메일은 정상적으로 발송됩니다 (이메일 주소가 제공된 경우)
- 전체 프로세스는 계속 진행됩니다
- 에러는 로그에 기록됩니다

## 📝 권장 설정

### 프로덕션 환경

```env
ADMIN_EMAIL=admin@parplay.co.kr
```

또는

```env
ADMIN_EMAIL=your-business-email@gmail.com
```

### 로컬 개발 환경

```env
ADMIN_EMAIL=your-test-email@gmail.com
```

## 🔧 문제 해결

### 관리자 이메일이 발송되지 않는 경우

1. **환경 변수 확인**
   - Vercel 대시보드에서 `ADMIN_EMAIL` 환경 변수가 올바르게 설정되었는지 확인
   - 환경 변수 이름에 오타가 없는지 확인 (대소문자 구분)

2. **재배포 확인**
   - 환경 변수 추가/수정 후 재배포가 완료되었는지 확인
   - Vercel Deployments 탭에서 최신 배포 상태 확인

3. **이메일 설정 확인**
   - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` 환경 변수가 올바르게 설정되었는지 확인
   - 이메일 발송 기능 자체가 작동하는지 테스트

4. **로그 확인**
   - Vercel Functions 로그에서 에러 메시지 확인
   - 관리자 이메일 발송 관련 로그 확인:
     - 성공: `📧 관리자 알림 이메일 발송 성공: [이메일주소]`
     - 실패: `📧 관리자 알림 이메일 발송 실패: [에러메시지]`
     - 설정 안됨: `📧 관리자 이메일 주소가 설정되지 않았습니다.`

5. **스팸함 확인**
   - 관리자 이메일의 스팸함/정크메일 확인
   - 일부 이메일 서비스는 처음 받는 발송자의 이메일을 스팸으로 분류할 수 있습니다

### Gmail 사용 시

Gmail을 관리자 이메일로 사용하는 경우:
- Gmail 앱 비밀번호가 필요할 수 있습니다 (2단계 인증 사용 시)
- Gmail 일일 발송 한도(500통/일)에 주의하세요
- 자세한 내용은 [EMAIL_SETUP.md](./EMAIL_SETUP.md) 참조

## 📚 관련 문서

- [이메일 설정 가이드](./EMAIL_SETUP.md) - SMTP 설정 방법
- [이메일 문제 해결](./EMAIL_TROUBLESHOOTING.md) - 이메일 발송 문제 해결
- [코드 검토 및 개선 사항](./CODE_REVIEW_AND_IMPROVEMENTS.md) - 관리자 알림 이메일 추가 내용

## ✅ 체크리스트

설정 완료 후 확인 사항:

- [ ] Vercel 환경 변수에 `ADMIN_EMAIL` 추가됨
- [ ] 환경 변수 값이 올바른 이메일 주소 형식인지 확인
- [ ] 재배포 완료됨
- [ ] 테스트 상담문의/특강신청 제출
- [ ] 관리자 이메일함에서 알림 이메일 수신 확인
- [ ] Vercel 로그에서 "관리자 알림 이메일 발송 성공" 메시지 확인
- [ ] 스팸함도 확인 (처음 받는 경우)






