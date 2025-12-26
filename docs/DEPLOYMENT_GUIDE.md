# 배포 가이드

## 🚀 Vercel 배포

### 1. Vercel 프로젝트 생성

```bash
# Vercel CLI 설치 (선택)
npm i -g vercel

# 프로젝트 연결
vercel link

# 또는 Vercel 대시보드에서 GitHub 저장소 연결
```

### 2. 환경변수 설정

Vercel 대시보드 → Settings → Environment Variables

#### 필수 환경변수

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT 시크릿 (강력한 랜덤 문자열)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long

# 사이트 URL
NEXT_PUBLIC_SITE_URL=https://parplay.co.kr
```

#### 선택 환경변수

```bash
# 이메일 (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_NAME=피지컬 AI 로봇플레이
SMTP_FROM_EMAIL=noreply@parplay.co.kr

# PortOne 결제
NEXT_PUBLIC_PORTONE_STORE_ID=your-store-id
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=your-channel-key
PORTONE_API_SECRET=your-api-secret

# 관리자 계정 (초기 설정용)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# SMS (선택)
SMS_API_KEY=your-sms-api-key
SMS_API_URL=https://sms-api-url.com
ADMIN_PHONE=010-0000-0000
```

### 3. 배포

```bash
# 프로덕션 배포
vercel --prod

# 또는 GitHub push로 자동 배포
git push origin main
```

---

## 🗄️ MongoDB 설정

### 1. MongoDB Atlas 설정

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 접속
2. 무료 클러스터 생성
3. Database Access → Add New Database User
4. Network Access → Add IP Address (0.0.0.0/0 또는 Vercel IP)
5. Connect → Connect your application → 연결 문자열 복사

### 2. 인덱스 생성

MongoDB Compass 또는 Atlas UI에서:

```javascript
// users 컬렉션
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 })
db.users.createIndex({ "role": 1 })

// online_enrollments 컬렉션
db.online_enrollments.createIndex({ "accessCode": 1 }, { unique: true })
db.online_enrollments.createIndex({ "email": 1 })
db.online_enrollments.createIndex({ "courseId": 1 })
db.online_enrollments.createIndex({ "createdAt": -1 })

// online_courses 컬렉션
db.online_courses.createIndex({ "category": 1 })
db.online_courses.createIndex({ "createdAt": -1 })

// news 컬렉션
db.news.createIndex({ "category": 1 })
db.news.createIndex({ "createdAt": -1 })
```

---

## 📧 이메일 설정 (Gmail)

### 1. Gmail 앱 비밀번호 생성

1. Google 계정 → 보안
2. 2단계 인증 활성화
3. 앱 비밀번호 생성
4. "메일" 선택 → 비밀번호 복사

### 2. 환경변수 설정

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-digit-app-password
```

---

## 💳 PortOne 결제 설정

### 1. PortOne 가입

1. [PortOne](https://portone.io/) 가입
2. 상점 생성
3. 채널 생성 (테스트/실제)

### 2. API 키 발급

1. 개발자 센터 → API Keys
2. Store ID, Channel Key, API Secret 복사

### 3. 환경변수 설정

```bash
NEXT_PUBLIC_PORTONE_STORE_ID=imp12345678
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=channel-key-xxxxxxxx
PORTONE_API_SECRET=your-api-secret
```

---

## 🔐 보안 체크리스트

### 배포 전 확인

- [ ] JWT_SECRET이 강력한 랜덤 문자열인가?
- [ ] MongoDB 연결 문자열이 안전하게 저장되었는가?
- [ ] API 시크릿 키들이 환경변수로 관리되는가?
- [ ] .env.local 파일이 .gitignore에 포함되었는가?
- [ ] 프로덕션 환경에서 HTTPS가 사용되는가?
- [ ] CORS 설정이 적절한가?
- [ ] Rate Limiting이 설정되었는가? (선택)

### JWT_SECRET 생성

```bash
# Node.js로 강력한 시크릿 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 또는 OpenSSL
openssl rand -hex 32
```

---

## 🧪 배포 후 테스트

### 1. 기본 기능 테스트

```bash
# 헬스 체크
curl https://your-domain.com/api/test-db

# MongoDB 연결 확인
curl https://your-domain.com/api/verify-mongodb
```

### 2. 관리자 계정 초기화

```bash
# 초기 관리자 생성
curl -X POST https://your-domain.com/api/admin/init
```

### 3. 전체 플로우 테스트

1. 메인 페이지 접속
2. 온라인 강좌 → 강의 보기
3. 신청하기 → 정보 입력
4. 이메일 수신 확인
5. 접근 코드로 수강 시작
6. 관리자 로그인 테스트

---

## 📊 모니터링

### Vercel Analytics

```typescript
// app/layout.tsx에 이미 추가됨
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
```

### 로그 확인

```bash
# Vercel CLI로 실시간 로그
vercel logs --follow

# 또는 Vercel 대시보드에서 확인
```

---

## 🔄 업데이트 배포

### 자동 배포 (GitHub)

```bash
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main
# → Vercel이 자동으로 배포
```

### 수동 배포

```bash
vercel --prod
```

### 롤백

```bash
# Vercel 대시보드에서 이전 배포 선택 → Promote to Production
```

---

## 🐛 문제 해결

### 빌드 실패

```bash
# 로컬에서 빌드 테스트
npm run build

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

### MongoDB 연결 실패

1. IP 화이트리스트 확인 (0.0.0.0/0)
2. 연결 문자열 확인
3. 사용자 권한 확인

### 이메일 발송 실패

1. SMTP 설정 확인
2. 앱 비밀번호 재생성
3. 방화벽 설정 확인

### 결제 실패

1. PortOne 키 확인
2. 채널 활성화 확인
3. 테스트/실제 모드 확인

---

## 📝 체크리스트

### 배포 전

- [ ] 환경변수 모두 설정
- [ ] MongoDB 인덱스 생성
- [ ] 빌드 성공 확인
- [ ] 테스트 가이드 검토

### 배포 후

- [ ] 헬스 체크 통과
- [ ] 관리자 로그인 테스트
- [ ] 수강 신청 플로우 테스트
- [ ] 이메일 발송 테스트
- [ ] 결제 테스트 (테스트 모드)

### 프로덕션 전환

- [ ] 도메인 연결
- [ ] SSL 인증서 확인
- [ ] PortOne 실제 모드 전환
- [ ] 백업 설정
- [ ] 모니터링 설정

---

## 🎉 완료!

배포가 완료되면:

1. 📧 팀에 공유
2. 📊 Analytics 확인
3. 🐛 버그 리포트 대기
4. 🚀 마케팅 시작!

**Happy Deploying! 🚀**
