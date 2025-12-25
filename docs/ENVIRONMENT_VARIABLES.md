# 환경 변수 목록 및 백업 가이드

## 📋 전체 환경 변수 목록

### 1. 데이터베이스 (Database)

#### MONGODB_URI
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database?retryWrites=true&w=majority
```
- **목적**: MongoDB Atlas 연결
- **필수**: ✅ Yes
- **환경**: Production, Preview, Development
- **백업 중요도**: 🔴 Critical
- **복구 우선순위**: 1

---

### 2. 모니터링 (Monitoring)

#### NEXT_PUBLIC_SENTRY_DSN
```bash
NEXT_PUBLIC_SENTRY_DSN=https://[key]@[orgid].ingest.us.sentry.io/[projectid]
```
- **목적**: Sentry 에러 추적
- **필수**: ❌ No (선택사항)
- **환경**: Production, Preview
- **백업 중요도**: 🟡 Medium
- **현재 값**: `https://9a49abc9e9dbd869cbc3cdfae30945f0@o4510592184090624.ingest.us.sentry.io/4510592420216832`

#### SENTRY_ORG
```bash
SENTRY_ORG=your-org-name
```
- **목적**: Sentry 조직 이름
- **필수**: ❌ No
- **환경**: Production, Preview, Development

#### SENTRY_PROJECT
```bash
SENTRY_PROJECT=your-project-name
```
- **목적**: Sentry 프로젝트 이름
- **필수**: ❌ No
- **환경**: Production, Preview, Development

#### SENTRY_AUTH_TOKEN
```bash
SENTRY_AUTH_TOKEN=sntrys_[long_token]
```
- **목적**: Sentry API 인증 토큰
- **필수**: ❌ No
- **환경**: Build-time only
- **백업 중요도**: 🟡 Medium
- **⚠️ 보안**: 절대 공개 금지!

---

### 3. 결제 시스템 (Payment)

#### NEXT_PUBLIC_PORTONE_STORE_ID
```bash
NEXT_PUBLIC_PORTONE_STORE_ID=store-xxxxx-xxxxx
```
- **목적**: PortOne 스토어 ID
- **필수**: ✅ Yes (결제 기능 사용 시)
- **환경**: Production, Preview
- **백업 중요도**: 🔴 Critical

#### PORTONE_API_SECRET
```bash
PORTONE_API_SECRET=your-api-secret-key
```
- **목적**: PortOne API 시크릿 키
- **필수**: ✅ Yes (결제 기능 사용 시)
- **환경**: Production only
- **백업 중요도**: 🔴 Critical
- **⚠️ 보안**: 절대 공개 금지! Production만 설정

---

### 4. 사이트 설정 (Site Configuration)

#### SITE_URL
```bash
SITE_URL=https://parplay.co.kr
```
- **목적**: 사이트 기본 URL (사이트맵, OG 태그)
- **필수**: ✅ Yes
- **환경**: Production, Preview, Development
- **백업 중요도**: 🟢 Low
- **현재 값**: `https://parplay.co.kr`

#### NEXT_PUBLIC_SITE_URL
```bash
NEXT_PUBLIC_SITE_URL=https://parplay.co.kr
```
- **목적**: 클라이언트 사이드 URL (Analytics, 사이트맵)
- **필수**: ✅ Yes
- **환경**: Production, Preview, Development
- **백업 중요도**: 🟢 Low

---

## 🔐 환경별 설정 매트릭스

| 변수 | Production | Preview | Development | 비고 |
|------|-----------|---------|-------------|------|
| MONGODB_URI | ✅ 필수 | ✅ 필수 | ✅ 필수 | 실제 DB |
| NEXT_PUBLIC_SENTRY_DSN | ✅ 권장 | ✅ 권장 | ❌ 선택 | 에러 추적 |
| SENTRY_AUTH_TOKEN | ✅ 필수 | ✅ 필수 | ❌ 선택 | 빌드 타임 |
| PORTONE_API_SECRET | ✅ 필수 | ❌ 테스트키 | ❌ 선택 | 프로덕션만 실제 키 |
| SITE_URL | ✅ 필수 | ✅ 필수 | ✅ 필수 | 각 환경 URL |

---

## 📦 백업 전략

### 백업 위치

#### 1순위: 비밀번호 관리자 (추천)
```
✅ 1Password
✅ Bitwarden
✅ LastPass
✅ Dashlane

장점:
- 암호화 저장
- 팀 공유 가능
- 버전 관리
- 접근 로그
```

#### 2순위: 안전한 문서 (암호화)
```
✅ Notion (Private page)
✅ Google Docs (제한된 공유)
✅ Confluence (Private space)

⚠️ 주의:
- 접근 권한 최소화
- 2FA 활성화 필수
- 정기적 권한 검토
```

#### 3순위: 암호화된 파일
```
✅ VeraCrypt 컨테이너
✅ GPG 암호화 파일
✅ 7z 암호화 압축

⚠️ 주의:
- 강력한 비밀번호 사용
- 백업 위치 분산
- 오프라인 백업 병행
```

### 백업 제외 항목 (절대 Git 커밋 금지!)
```
❌ .env.local
❌ .env.production
❌ .env
❌ *.key
❌ *.pem
❌ secrets.json
```

### .gitignore 확인
```bash
# 환경 변수 파일
.env*.local
.env
.env.production

# 비밀 키
*.key
*.pem
secrets/
```

---

## 🔄 복구 절차

### Vercel 환경 변수 설정 방법

#### 방법 1: Vercel 대시보드 (UI)
```
1. https://vercel.com/[team]/physicalairobotplay
2. Settings → Environment Variables
3. 각 변수 추가:
   - Key: MONGODB_URI
   - Value: mongodb+srv://...
   - Environment: Production, Preview, Development
4. Save
```

#### 방법 2: Vercel CLI
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 환경 변수 설정
vercel env add MONGODB_URI production
vercel env add MONGODB_URI preview
vercel env add MONGODB_URI development

# 확인
vercel env ls
```

#### 방법 3: .env 파일 자동 가져오기
```bash
# .env.production 파일 준비
cat > .env.production << EOF
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_SENTRY_DSN=https://...
SITE_URL=https://parplay.co.kr
EOF

# Vercel에 업로드 (한 번에)
vercel env pull .env.production
```

---

## 🚨 긴급 복구 시나리오

### 시나리오 1: 모든 환경 변수 손실
```
우선순위 1 (즉시): MONGODB_URI
→ 데이터베이스 연결 복구

우선순위 2 (30분 내): PORTONE_API_SECRET
→ 결제 기능 복구

우선순위 3 (1시간 내): SENTRY_DSN
→ 모니터링 복구

우선순위 4 (비필수): SITE_URL
→ 기본값 사용 가능
```

### 시나리오 2: MongoDB 연결 문자열 손실
```
복구 방법:
1. MongoDB Atlas 대시보드 접속
2. Database → Connect
3. "Connect your application" 선택
4. Driver: Node.js, Version: 4.1 이상
5. 연결 문자열 복사
6. Vercel 환경 변수 업데이트
7. 재배포 (vercel --prod)
```

### 시나리오 3: Sentry DSN 손실
```
복구 방법:
1. https://sentry.io 접속
2. Settings → Projects
3. 프로젝트 선택
4. Client Keys (DSN)
5. DSN 복사
6. Vercel 환경 변수 업데이트
```

---

## ✅ 백업 체크리스트

### 월간 백업 (매월 1일)
- [ ] 모든 환경 변수를 비밀번호 관리자에 백업
- [ ] MongoDB 연결 문자열 유효성 확인
- [ ] Sentry DSN 유효성 확인
- [ ] PortOne API 키 유효성 확인

### 분기별 검토 (3개월마다)
- [ ] 불필요한 환경 변수 정리
- [ ] 비밀번호 관리자 접근 권한 검토
- [ ] API 키 로테이션 (보안 강화)
- [ ] 백업 복구 테스트 수행

### 연간 감사 (매년 1월)
- [ ] 전체 환경 변수 문서 업데이트
- [ ] 보안 정책 검토
- [ ] 재해 복구 훈련 실시
- [ ] 백업 프로세스 개선

---

## 📞 긴급 연락처

### MongoDB Atlas 지원
- **이메일**: support@mongodb.com
- **전화**: 1-844-666-4632
- **문서**: https://docs.atlas.mongodb.com/

### Vercel 지원
- **이메일**: support@vercel.com
- **문서**: https://vercel.com/docs

### Sentry 지원
- **이메일**: support@sentry.io
- **문서**: https://docs.sentry.io/

---

**마지막 업데이트**: 2025-12-26  
**문서 버전**: 1.0  
**작성자**: AI Assistant

