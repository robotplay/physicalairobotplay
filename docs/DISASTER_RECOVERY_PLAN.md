# 🚨 재해 복구 계획 (Disaster Recovery Plan)

## 📋 목차
1. [복구 목표](#복구-목표)
2. [복구 시나리오](#복구-시나리오)
3. [데이터베이스 복구](#데이터베이스-복구)
4. [애플리케이션 복구](#애플리케이션-복구)
5. [복구 우선순위](#복구-우선순위)

---

## 🎯 복구 목표

### RTO (Recovery Time Objective)
```
목표: 장애 발생 후 서비스 복구까지 허용 시간

Critical 서비스:
├─ 웹사이트 접근: 15분
├─ 데이터베이스 연결: 30분
├─ 결제 기능: 1시간
└─ 모니터링/Analytics: 2시간
```

### RPO (Recovery Point Objective)
```
목표: 허용 가능한 데이터 손실 시간

데이터 유형별:
├─ 뉴스 콘텐츠: 24시간
├─ 상담 문의: 6시간
├─ 결제 데이터: 0시간 (실시간 백업)
└─ 사용자 등록: 6시간
```

---

## 🔥 복구 시나리오

### 시나리오 1: 전체 데이터베이스 손실 🔴

#### 증상
```
❌ 모든 MongoDB 쿼리 실패
❌ 뉴스 페이지 404 에러
❌ 상담 문의 제출 불가
❌ 드론 등록 불가
```

#### 영향도
```
비즈니스 영향: 🔴 Critical
사용자 영향: 100%
복구 긴급도: 최고
```

#### 복구 절차
```
1단계: 상황 파악 (5분)
├─ MongoDB Atlas 대시보드 확인
├─ 클러스터 상태 확인
└─ 에러 로그 확인

2단계: 긴급 조치 (10분)
├─ Vercel 배포 일시 중지
├─ 사용자에게 공지 (점검 중)
└─ 복구 팀 소집

3단계: 백업 복구 (30-60분)
├─ MongoDB Atlas 백업 목록 확인
├─ 최신 스냅샷 선택
├─ 새 클러스터로 복구
└─ 연결 문자열 업데이트

4단계: 검증 및 재배포 (15분)
├─ 데이터 무결성 검증
├─ 연결 테스트
├─ Vercel 환경 변수 업데이트
└─ 프로덕션 재배포

5단계: 모니터링 (30분)
├─ 서비스 정상 작동 확인
├─ 에러 로그 모니터링
└─ 사용자 피드백 확인
```

**총 예상 복구 시간: 60-90분**

---

### 시나리오 2: Vercel 프로젝트 삭제 🟠

#### 증상
```
❌ 사이트 접속 불가 (404)
❌ Vercel 대시보드에서 프로젝트 사라짐
❌ 배포 히스토리 손실
```

#### 영향도
```
비즈니스 영향: 🟠 High
사용자 영향: 100%
복구 긴급도: 높음
```

#### 복구 절차
```
1단계: 새 Vercel 프로젝트 생성 (5분)
├─ https://vercel.com/new
├─ GitHub 저장소 연결
├─ 프로젝트 설정
└─ 프레임워크: Next.js 선택

2단계: 환경 변수 복구 (15분)
├─ 백업된 환경 변수 파일 확인
├─ Vercel 대시보드에서 환경 변수 입력
│   ├─ MONGODB_URI
│   ├─ NEXT_PUBLIC_SENTRY_DSN
│   ├─ PORTONE_API_SECRET
│   └─ SITE_URL
└─ 모든 환경 (Production, Preview, Development) 설정

3단계: 도메인 재설정 (10분)
├─ parplay.co.kr DNS 설정 확인
├─ Vercel 도메인 추가
├─ DNS 레코드 확인
└─ SSL 인증서 발급 대기

4단계: 배포 및 검증 (15분)
├─ main 브랜치 자동 배포
├─ 배포 로그 확인
├─ 사이트 접속 테스트
└─ 모든 기능 테스트

5단계: Analytics 재설정 (10분)
├─ Vercel Analytics 활성화
├─ Sentry 연동 확인
└─ Google Search Console 확인
```

**총 예상 복구 시간: 45-60분**

---

### 시나리오 3: GitHub 저장소 손실 🟡

#### 증상
```
❌ GitHub 저장소 접근 불가
❌ 소스 코드 접근 불가
❌ 새 배포 불가
```

#### 영향도
```
비즈니스 영향: 🟡 Medium (기존 배포는 작동)
사용자 영향: 0% (즉시), 100% (업데이트 시)
복구 긴급도: 중간
```

#### 복구 절차
```
1단계: 로컬 소스 코드 확인 (5분)
├─ 개발 환경에 최신 코드 있는지 확인
├─ git log로 커밋 히스토리 확인
└─ 누락된 파일 확인

2단계: 새 GitHub 저장소 생성 (10분)
├─ https://github.com/new
├─ 저장소 이름: physicalairobotplay
├─ Private 저장소 설정
└─ README, .gitignore 선택

3단계: 코드 푸시 (15분)
├─ git remote 재설정
│   git remote remove origin
│   git remote add origin https://github.com/[org]/[repo].git
├─ 전체 브랜치 푸시
│   git push -u origin main
│   git push origin feature/vercel-analytics
└─ 태그 푸시 (있는 경우)

4단계: Vercel 재연결 (10분)
├─ Vercel 대시보드
├─ Settings → Git Integration
├─ Disconnect 후 Reconnect
└─ 새 저장소 선택

5단계: 브랜치 보호 규칙 재설정 (10분)
├─ Settings → Branches
├─ main 브랜치 보호
├─ PR 리뷰 필수 설정
└─ CI/CD 설정 복구
```

**총 예상 복구 시간: 40-50분**

---

### 시나리오 4: 환경 변수 손실 🟢

#### 증상
```
⚠️ 데이터베이스 연결 실패
⚠️ Sentry 에러 전송 실패
⚠️ 결제 기능 오류
```

#### 영향도
```
비즈니스 영향: 🟢 Low-Medium
사용자 영향: 50% (기능별 다름)
복구 긴급도: 낮음
```

#### 복구 절차
```
1단계: 백업에서 환경 변수 확인 (5분)
├─ docs/ENVIRONMENT_VARIABLES.md 확인
├─ 비밀번호 관리자에서 값 확인
└─ 누락된 변수 목록 작성

2단계: Vercel 환경 변수 복구 (15분)
├─ Vercel Dashboard → Settings → Environment Variables
├─ 각 변수 입력:
│   Production:
│   ├─ MONGODB_URI=...
│   ├─ NEXT_PUBLIC_SENTRY_DSN=...
│   ├─ PORTONE_API_SECRET=...
│   └─ SITE_URL=https://parplay.co.kr
│
│   Preview:
│   ├─ MONGODB_URI=...
│   └─ SITE_URL=https://preview-url.vercel.app
│
│   Development:
│   └─ MONGODB_URI=...
└─ Save

3단계: 재배포 (5분)
├─ Deployments → Latest → Redeploy
└─ 배포 완료 대기

4단계: 검증 (10분)
├─ 각 기능 테스트
│   ├─ 뉴스 페이지 로딩
│   ├─ 상담 문의 제출
│   ├─ 결제 기능
│   └─ Sentry 에러 전송
└─ 로그 확인
```

**총 예상 복구 시간: 30-35분**

---

## 💾 데이터베이스 복구 상세 가이드

### 방법 1: MongoDB Atlas 스냅샷 복구

#### 전제 조건
```
✅ M10 이상 클러스터 (자동 백업 지원)
✅ 백업이 활성화되어 있음
✅ 복구할 스냅샷이 존재
```

#### 단계별 복구 (새 클러스터)

```bash
# 1. MongoDB Atlas 대시보드 접속
https://cloud.mongodb.com/

# 2. Backup → Snapshots 선택

# 3. 복구할 스냅샷 선택
# - 날짜/시간 확인
# - 데이터 크기 확인
# - 상태: Completed

# 4. "..." 메뉴 → "Restore" 클릭

# 5. 복구 방법 선택
옵션 A: "Restore to a new cluster" (권장)
├─ 클러스터 이름: backup-restore-YYYYMMDD
├─ 티어: 원본과 동일
├─ 리전: 원본과 동일
└─ 복구 시작 (10-30분 소요)

옵션 B: "Download" (로컬 복구)
├─ 압축 파일 다운로드
├─ 로컬 MongoDB 복원
└─ 데이터 검증 후 업로드

# 6. 복구 완료 후 연결 문자열 확인
mongodb+srv://backup-restore-YYYYMMDD.xxxxx.mongodb.net/

# 7. 데이터 검증
- 컬렉션 수 확인
- 레코드 수 확인
- 최신 데이터 확인

# 8. 프로덕션 전환
- Vercel 환경 변수 업데이트
- 재배포
- 모니터링

# 9. 원본 클러스터 조사
- 장애 원인 파악
- 필요시 삭제 또는 수리

# 10. 백업 클러스터 이름 변경
- 프로덕션 클러스터로 승격
- 또는 계속 백업으로 유지
```

### 방법 2: Point-in-Time 복구 (M10+)

```bash
# 1. Backup → Point-in-Time Restores

# 2. 복구 시점 선택
# - 날짜: 2025-12-26
# - 시간: 14:30:45 (1초 단위)

# 3. 복구 대상 선택
# - 전체 데이터베이스
# - 특정 컬렉션만 (선택사항)

# 4. 복구 수행
# - 새 클러스터로 복구 (권장)
# - 소요 시간: 10-30분

# 5. 검증 및 전환
# - 데이터 무결성 확인
# - 프로덕션 연결 문자열 업데이트
```

### 방법 3: 로컬 백업 복구

```bash
# 사전 준비: mongorestore 설치
brew install mongodb-database-tools

# 1. 백업 파일 압축 해제
tar -xzf mongodb-backup-YYYYMMDD.tar.gz
cd mongodb-backup-YYYYMMDD

# 2. 로컬 MongoDB에 복원 (검증용)
mongorestore --uri="mongodb://localhost:27017" --db=academy-site ./

# 3. 데이터 검증
mongo academy-site
> db.news.count()
> db.consultations.count()

# 4. MongoDB Atlas에 업로드
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net" ./

# 5. 프로덕션 연결 문자열 업데이트
```

---

## 🔄 애플리케이션 복구 절차

### 완전 재배포 (Vercel)

```bash
# 1. 로컬 개발 환경 확인
cd /path/to/project
git status
git log -5

# 2. 빌드 테스트
npm run build
# ✅ Build 성공 확인

# 3. Vercel CLI로 배포
npm i -g vercel
vercel login
vercel --prod

# 4. 배포 확인
# - URL 접속
# - 모든 페이지 테스트
# - 에러 로그 확인

# 5. 도메인 확인
# - https://parplay.co.kr 접속
# - SSL 인증서 확인
# - DNS 전파 확인
```

### 롤백 (이전 배포로 복구)

```bash
# 1. Vercel 대시보드 접속
https://vercel.com/[team]/physicalairobotplay

# 2. Deployments 목록 확인

# 3. 정상 작동하는 이전 배포 선택

# 4. "..." 메뉴 → "Promote to Production"

# 5. 확인 후 프로덕션 전환
# ✅ 즉시 반영 (1-2분)

# 6. 검증
# - 사이트 접속
# - 기능 테스트
# - 에러 확인
```

---

## 📊 복구 우선순위

### Priority 1: 즉시 복구 (15분 이내)

```
1. 웹사이트 접근 복구
   └─ 사용자가 사이트에 접속 가능

2. 데이터베이스 연결 복구
   └─ 기본 콘텐츠 표시 가능
```

### Priority 2: 긴급 복구 (1시간 이내)

```
1. 뉴스 콘텐츠 표시
   └─ MongoDB 읽기 기능 복구

2. 상담 문의 제출
   └─ MongoDB 쓰기 기능 복구

3. 드론 등록 기능
   └─ 데이터베이스 완전 복구
```

### Priority 3: 중요 복구 (2시간 이내)

```
1. 결제 기능 복구
   └─ PortOne API 연동 복구

2. 모니터링 복구
   └─ Sentry 에러 추적 복구
```

### Priority 4: 일반 복구 (4시간 이내)

```
1. Analytics 복구
   └─ Vercel Analytics 데이터 수집

2. 검색 엔진 최적화
   └─ 사이트맵, robots.txt 확인
```

---

## ✅ 복구 체크리스트

### 데이터베이스 복구
- [ ] MongoDB Atlas 백업 존재 확인
- [ ] 최신 스냅샷 선택
- [ ] 새 클러스터로 복구
- [ ] 데이터 무결성 검증
- [ ] 연결 문자열 업데이트
- [ ] 프로덕션 배포
- [ ] 읽기/쓰기 테스트

### 환경 변수 복구
- [ ] 백업에서 환경 변수 확인
- [ ] Vercel에 환경 변수 입력
- [ ] Production 환경 설정
- [ ] Preview 환경 설정
- [ ] Development 환경 설정
- [ ] 재배포 수행
- [ ] 기능 검증

### 애플리케이션 복구
- [ ] 소스 코드 확인
- [ ] 로컬 빌드 테스트
- [ ] Vercel 재배포
- [ ] 도메인 연결 확인
- [ ] SSL 인증서 확인
- [ ] 모든 페이지 테스트
- [ ] 에러 로그 확인

### 모니터링 복구
- [ ] Sentry 에러 추적 확인
- [ ] Vercel Analytics 데이터 확인
- [ ] Google Search Console 확인
- [ ] 성능 모니터링 확인

---

## 📞 긴급 연락처 및 리소스

### 내부 담당자
```
개발팀 리더: [이름]
└─ 전화: [번호]
└─ 이메일: [이메일]

DevOps 엔지니어: [이름]
└─ 전화: [번호]
└─ 이메일: [이메일]
```

### 외부 지원
```
MongoDB Atlas 지원
├─ 이메일: support@mongodb.com
├─ 전화: 1-844-666-4632
└─ 긴급: https://support.mongodb.com/

Vercel 지원
├─ 이메일: support@vercel.com
└─ 긴급: https://vercel.com/help

Sentry 지원
└─ 이메일: support@sentry.io
```

### 유용한 링크
```
MongoDB Atlas 대시보드
└─ https://cloud.mongodb.com/

Vercel 대시보드
└─ https://vercel.com/

GitHub 저장소
└─ https://github.com/robotplay/physicalairobotplay

문서 저장소
└─ docs/ 폴더 참조
```

---

## 📝 사후 조치 (Post-Recovery)

### 즉시 수행
```
1. 장애 보고서 작성
   - 장애 시작 시간
   - 장애 원인
   - 영향 범위
   - 복구 소요 시간

2. 사용자 공지
   - 장애 해결 안내
   - 불편 사과
   - 보상 계획 (필요시)

3. 데이터 무결성 검증
   - 모든 컬렉션 레코드 수 확인
   - 최신 데이터 손실 여부 확인
   - 필요시 수동 복구
```

### 1주일 내 수행
```
1. 근본 원인 분석 (Root Cause Analysis)
   - 왜 장애가 발생했는가?
   - 재발 방지 대책은?
   - 프로세스 개선 필요 사항

2. 백업 전략 검토
   - 백업 빈도 적절한가?
   - 백업 보관 기간 충분한가?
   - 추가 백업 위치 필요한가?

3. 복구 프로세스 개선
   - 복구 시간 단축 방안
   - 자동화 가능 부분
   - 문서 업데이트
```

### 1개월 내 수행
```
1. 재해 복구 훈련
   - 팀원 전체 참여
   - 실제 시나리오 연습
   - 복구 시간 측정

2. 모니터링 강화
   - 조기 경보 시스템 구축
   - 자동 알림 설정
   - 대시보드 개선

3. 백업 검증 자동화
   - 정기 백업 테스트
   - 자동 복구 테스트
   - 결과 리포팅
```

---

**마지막 업데이트**: 2025-12-26  
**문서 버전**: 1.0  
**다음 검토 예정**: 2026-01-26  
**작성자**: AI Assistant

