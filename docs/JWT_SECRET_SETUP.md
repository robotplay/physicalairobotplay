# JWT_SECRET 환경 변수 설정 가이드

## 📋 개요

`JWT_SECRET`은 JWT(JSON Web Token) 토큰을 암호화하고 검증하는 데 사용되는 비밀 키입니다. 이 값이 없거나 약하면 보안 문제가 발생할 수 있습니다.

---

## 🔐 JWT_SECRET 생성 방법

### 강력한 랜덤 문자열 생성

**터미널에서 실행:**

```bash
# 방법 1: openssl 사용 (권장)
openssl rand -base64 32

# 방법 2: Node.js 사용
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 방법 3: Python 사용
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**예시 출력:**
```
K8jL3mN9pQ2rT5vW8xY1zA4bC6dE9fG0hI3jK5lM7nO0pQ2rS4tU6vW8xY0z
```

**⚠️ 중요:**
- 최소 32자 이상의 랜덤 문자열 사용
- 예측 가능한 값 사용 금지 (예: "password", "secret", "123456")
- 각 환경(프로덕션, 개발)마다 다른 값 사용 권장

---

## 🚀 Vercel 대시보드에서 설정

### 1단계: Vercel 대시보드 접속

1. https://vercel.com/dashboard 접속
2. 로그인
3. 프로젝트 선택 (academy-site)

### 2단계: Environment Variables 설정

1. **Settings 클릭**
   - 프로젝트 페이지에서 "Settings" 탭 클릭

2. **Environment Variables 클릭**
   - 좌측 메뉴에서 "Environment Variables" 선택

3. **새 환경 변수 추가**
   - "Add New" 또는 "+" 버튼 클릭

4. **환경 변수 입력**
   - **Key**: `JWT_SECRET`
   - **Value**: 위에서 생성한 랜덤 문자열 입력
     ```
     예: K8jL3mN9pQ2rT5vW8xY1zA4bC6dE9fG0hI3jK5lM7nO0pQ2rS4tU6vW8xY0z
     ```
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     - (모두 선택 권장)

5. **Save 클릭**

### 3단계: 재배포

환경 변수를 추가한 후 자동으로 재배포되거나, 수동으로 재배포할 수 있습니다:

1. **Deployments 탭 클릭**
2. **최신 배포의 "..." 메뉴 클릭**
3. **"Redeploy" 선택**

또는 자동 재배포를 기다립니다 (보통 몇 분 내).

---

## 💻 로컬 개발 환경 설정

### .env.local 파일에 추가

프로젝트 루트 디렉토리에 `.env.local` 파일이 있는지 확인하고, 없으면 생성합니다:

```bash
# 프로젝트 루트에서
touch .env.local
```

`.env.local` 파일에 다음 내용 추가:

```env
JWT_SECRET=K8jL3mN9pQ2rT5vW8xY1zA4bC6dE9fG0hI3jK5lM7nO0pQ2rS4tU6vW8xY0z
```

**⚠️ 주의:**
- `.env.local` 파일은 Git에 커밋하지 마세요 (이미 `.gitignore`에 포함되어 있음)
- 프로덕션과 개발 환경의 `JWT_SECRET`은 다르게 설정하는 것을 권장합니다

### 개발 서버 재시작

환경 변수를 추가한 후 개발 서버를 재시작합니다:

```bash
# 개발 서버 중지 (Ctrl + C)
# 그 다음 다시 시작
npm run dev
```

---

## ✅ 설정 확인

### Vercel에서 확인

1. Vercel 대시보드 → Settings → Environment Variables
2. `JWT_SECRET`이 목록에 있는지 확인
3. Value가 마스킹되어 표시됨 (보안상 정상)

### 로컬에서 확인

```bash
# .env.local 파일 확인 (값은 보이지 않아도 됨)
cat .env.local | grep JWT_SECRET

# 또는 Node.js로 확인 (개발 서버 실행 시)
# 콘솔에 경고 메시지가 없으면 정상
```

### 애플리케이션에서 확인

관리자 페이지나 로그인 페이지에서 로그인을 시도해보세요:
- 로그인이 정상적으로 작동하면 설정이 올바릅니다
- 오류가 발생하면 환경 변수가 제대로 로드되지 않은 것입니다

---

## 🔍 문제 해결

### 문제 1: "JWT_SECRET이 기본값으로 설정되어 있습니다" 경고

**증상:**
- 콘솔에 경고 메시지 표시
- 프로덕션 환경에서 보안 경고

**해결:**
1. Vercel 대시보드에서 `JWT_SECRET` 환경 변수 확인
2. 값이 설정되어 있는지 확인
3. 재배포 후에도 경고가 나타나면 환경 변수 값이 기본값인지 확인

### 문제 2: 로그인이 작동하지 않음

**증상:**
- 로그인 시도 시 오류 발생
- 토큰 검증 실패

**해결:**
1. 환경 변수가 올바르게 설정되었는지 확인
2. 개발 서버 재시작 (로컬 환경)
3. Vercel 재배포 (프로덕션 환경)
4. 브라우저 쿠키 삭제 후 다시 시도

### 문제 3: 환경 변수가 인식되지 않음

**증상:**
- 환경 변수를 추가했지만 애플리케이션에서 인식하지 못함

**해결:**
1. 환경 변수 이름 확인 (`JWT_SECRET` - 대소문자 구분)
2. 재배포 확인 (Vercel)
3. 개발 서버 재시작 (로컬)
4. `.env.local` 파일 위치 확인 (프로젝트 루트에 있어야 함)

---

## 🔒 보안 권장사항

### ✅ 해야 할 것

1. **강력한 랜덤 값 사용**
   - 최소 32자 이상
   - 예측 불가능한 랜덤 문자열

2. **환경별로 다른 값 사용**
   - 프로덕션과 개발 환경의 `JWT_SECRET`을 다르게 설정

3. **정기적으로 변경**
   - 보안상 문제가 의심되면 즉시 변경
   - 변경 시 모든 사용자 재로그인 필요

4. **환경 변수로만 관리**
   - 코드에 하드코딩하지 않기
   - Git에 커밋하지 않기

### ❌ 하지 말아야 할 것

1. **약한 값 사용 금지**
   - "password", "secret", "123456" 등
   - 짧은 문자열

2. **공유하지 않기**
   - 다른 사람과 공유하지 않기
   - 공개 저장소에 커밋하지 않기

3. **기본값 사용 금지**
   - 프로덕션에서는 반드시 변경

---

## 📝 체크리스트

설정 완료 확인:

- [ ] 강력한 랜덤 문자열 생성 (32자 이상)
- [ ] Vercel 대시보드에 `JWT_SECRET` 환경 변수 추가
- [ ] Production, Preview, Development 모두 선택
- [ ] 재배포 완료
- [ ] 로컬 개발 환경 `.env.local` 파일에 추가 (선택사항)
- [ ] 로그인 테스트 성공
- [ ] 경고 메시지 없음

---

## 🎯 빠른 설정 (5분)

1. **JWT_SECRET 생성** (1분)
   ```bash
   openssl rand -base64 32
   ```

2. **Vercel에 추가** (2분)
   - Vercel 대시보드 → Settings → Environment Variables
   - Key: `JWT_SECRET`, Value: 생성한 문자열
   - 모든 환경 선택 → Save

3. **재배포** (2분)
   - 자동 재배포 대기 또는 수동 재배포

4. **테스트** (1분)
   - 관리자 로그인 페이지에서 로그인 테스트

---

**작성일:** 2025-01-XX  
**버전:** 1.0

