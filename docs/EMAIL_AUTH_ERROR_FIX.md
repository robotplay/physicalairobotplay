# Gmail 인증 오류 해결 가이드

## 🔴 현재 발생한 에러

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

이 에러는 Gmail 인증 정보가 잘못되었을 때 발생합니다.

## ✅ 해결 방법

### 1단계: Gmail 2단계 인증 확인

1. [Google 계정 보안 페이지](https://myaccount.google.com/security) 접속
2. "2단계 인증" 섹션 확인
3. **"2단계 인증"이 "켜짐" 상태인지 확인**
4. 꺼져있다면 활성화 필요

### 2단계: Gmail 앱 비밀번호 생성

**⚠️ 중요:** 일반 비밀번호가 아닌 **앱 비밀번호**를 사용해야 합니다!

#### 2.1. 앱 비밀번호 생성

1. [앱 비밀번호 페이지](https://myaccount.google.com/apppasswords) 직접 접속
2. **"앱 선택"** → **"메일"** 선택
3. **"기기 선택"** → **"기타(맞춤 이름)"** → "피지컬 AI 교육" 입력
4. **"생성"** 버튼 클릭
5. 생성된 **16자리 비밀번호 복사** (예: `abcd efgh ijkl mnop`)

**⚠️ 중요:**
- 비밀번호는 **한 번만 표시**되므로 즉시 복사하세요
- 공백이 있어도 되지만, Vercel 환경 변수에 입력할 때는 공백 없이 입력하는 것을 권장합니다
- 예: `abcdefghijklmnop`

### 3단계: Vercel 환경 변수 업데이트

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. `SMTP_PASSWORD` 환경 변수 찾기
4. **Edit** 클릭 (또는 삭제 후 새로 추가)
5. **Value**에 새로 생성한 앱 비밀번호 입력 (공백 없이)
6. **Environment**: Production, Preview, Development 모두 체크
7. **Save** 클릭

**예시:**
```
Key: SMTP_PASSWORD
Value: abcdefghijklmnop  (공백 없이 16자리 앱 비밀번호)
```

### 4단계: 배포 재시작

⚠️ **중요:** 환경 변수를 변경한 후에는 **새 배포가 필요**합니다!

**방법 1: Vercel 대시보드에서**
1. Vercel 대시보드 → **Deployments** 탭
2. 최신 배포 옆 **"..."** 메뉴 클릭
3. **"Redeploy"** 선택
4. 배포 완료 대기 (1-2분)

**방법 2: Git Push**
```bash
git commit --allow-empty -m "Trigger redeploy for email config"
git push
```

### 5단계: 테스트

1. 상담문의 폼 제출
2. Vercel 로그 확인:
   - Functions → `/api/consultations` → 최근 실행 로그
   - 다음 메시지가 나타나야 함:
     ```
     📧 관리자 알림 이메일 발송 성공: ...
     📧 상담문의 확인 이메일 발송 성공: ...
     ```
   - 에러가 없다면 성공!

## 🔍 확인 체크리스트

다음을 확인하세요:

- [ ] Gmail 2단계 인증이 활성화되어 있음
- [ ] 앱 비밀번호를 생성했음 (일반 비밀번호 아님!)
- [ ] 앱 비밀번호를 정확히 복사했음 (공백 제거)
- [ ] Vercel 환경 변수 `SMTP_PASSWORD`에 앱 비밀번호가 설정됨
- [ ] 환경 변수 저장 후 새 배포가 완료됨
- [ ] Vercel 로그에서 에러가 더 이상 나타나지 않음

## ❌ 자주 하는 실수

### 실수 1: 일반 비밀번호 사용
- ❌ Gmail 계정 비밀번호를 그대로 사용
- ✅ 앱 비밀번호를 사용해야 함

### 실수 2: 환경 변수 업데이트 후 재배포 안 함
- ❌ 환경 변수만 변경하고 배포 안 함
- ✅ 환경 변수 변경 후 반드시 재배포 필요

### 실수 3: 앱 비밀번호 복사 시 공백 포함
- ❌ `abcd efgh ijkl mnop` (공백 포함)
- ✅ `abcdefghijklmnop` (공백 없이, 권장) 또는 공백 포함해도 작동하지만 공백 없이 권장

### 실수 4: 이전 앱 비밀번호 사용
- ❌ 오래된 앱 비밀번호 재사용
- ✅ 새로 생성한 앱 비밀번호 사용

## 🆘 여전히 문제가 있는 경우

### 다른 Gmail 계정 사용

현재 사용 중인 Gmail 계정에 문제가 있다면:

1. 새로운 Gmail 계정으로 앱 비밀번호 생성
2. Vercel 환경 변수 업데이트:
   - `SMTP_USER`: 새 Gmail 주소
   - `SMTP_PASSWORD`: 새 앱 비밀번호
   - `SMTP_FROM`: 새 Gmail 주소 (선택사항)
   - `ADMIN_EMAIL`: 관리자 이메일 (선택사항)

### 다른 이메일 서비스 사용

Gmail 대신 다른 서비스를 사용할 수 있습니다:

**Outlook/Hotmail:**
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

**네이버:**
```
SMTP_HOST=smtp.naver.com
SMTP_PORT=587
SMTP_USER=your-email@naver.com
SMTP_PASSWORD=your-password
```

**SendGrid (권장):**
- 더 안정적이고 대량 발송 가능
- [SendGrid 가이드 참고](./EMAIL_SETUP.md#sendgrid)

## 📚 관련 문서

- [이메일 설정 가이드](./EMAIL_SETUP.md)
- [Gmail 설정 방법](./EMAIL_SETUP.md#gmail-설정-방법)
- [이메일 문제 해결 가이드](./EMAIL_TROUBLESHOOTING.md)







