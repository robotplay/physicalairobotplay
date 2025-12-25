# 📦 수동 백업 가이드 (무료 솔루션)

## 🎯 개요

MongoDB Atlas M0 (Free Tier)는 자동 백업을 지원하지 않습니다.  
이 가이드는 **무료로** 데이터베이스를 백업하고 복원하는 방법을 제공합니다.

---

## 🛠️ 사전 준비

### 1. MongoDB Database Tools 설치

```bash
# macOS
brew install mongodb-database-tools

# 설치 확인
mongodump --version
mongorestore --version
```

### 2. MONGODB_URI 설정

#### 방법 A: Vercel에서 가져오기
```
1. https://vercel.com/[team]/physicalairobotplay/settings/environment-variables
2. MONGODB_URI 값 복사
3. 터미널에 입력:
   export MONGODB_URI='mongodb+srv://...'
```

#### 방법 B: .env.local에 추가
```bash
# .env.local 파일 편집
echo 'MONGODB_URI=mongodb+srv://...' >> .env.local

# 환경 변수 로드
export $(grep -v '^#' .env.local | xargs)
```

---

## 🚀 빠른 시작

### A) 즉시 백업 실행

```bash
cd /Users/hkjtop/.cursor/worktrees/academy-site/hss

# MONGODB_URI 설정 (Vercel에서 복사)
export MONGODB_URI='mongodb+srv://...'

# 백업 스크립트 실행
./scripts/backup-mongodb.sh
```

**결과:**
```
✅ 백업 완료!
📁 백업 파일: ~/mongodb-backups/backup-20251226-140000.tar.gz
📊 압축 크기: 2.5MB
```

---

### B) 자동화 설정

```bash
# 자동화 설정 스크립트 실행
./scripts/setup-backup-automation.sh

# 옵션 선택:
# 1) 매주 일요일 새벽 2시 (권장)
# 2) 매일 새벽 2시
# 3) 매주 월요일 새벽 2시
```

**설정 후:**
- ✅ 자동으로 정기 백업 실행
- ✅ 로그 파일: `~/mongodb-backup.log`
- ✅ 30일 이상 된 백업 자동 삭제

---

## 📖 상세 사용 가이드

### 백업 스크립트 기능

```bash
./scripts/backup-mongodb.sh
```

**수행 작업:**
1. ✅ MongoDB 데이터 전체 백업 (mongodump)
2. ✅ tar.gz로 압축
3. ✅ `~/mongodb-backups/`에 저장
4. ✅ 30일 이상 된 백업 자동 삭제
5. ✅ 백업 크기 및 개수 출력

**백업 위치:**
```
~/mongodb-backups/
├── backup-20251226-140000.tar.gz  (최신)
├── backup-20251219-140000.tar.gz  (7일 전)
├── backup-20251212-140000.tar.gz  (14일 전)
└── ...
```

---

### 복원 스크립트

```bash
# 사용 가능한 백업 목록 확인
./scripts/restore-mongodb.sh

# 특정 백업 파일 복원
./scripts/restore-mongodb.sh ~/mongodb-backups/backup-20251226-140000.tar.gz
```

**⚠️ 주의:**
- 복원하면 현재 데이터베이스가 덮어씌워집니다!
- 복원 전 현재 데이터를 백업하세요!

---

## 📅 자동화 관리

### cron 작업 확인

```bash
# 현재 cron 작업 보기
crontab -l

# 출력 예시:
# MongoDB 자동 백업 - 매주 일요일 새벽 2시
# 0 2 * * 0 /path/to/backup-wrapper.sh >> ~/mongodb-backup.log 2>&1
```

### cron 작업 수정

```bash
# cron 편집기 열기
crontab -e

# 백업 시간 변경 예시:
# 매일 새벽 3시로 변경
0 3 * * * /path/to/backup-wrapper.sh >> ~/mongodb-backup.log 2>&1
```

### cron 표현식 가이드

```
분 시 일 월 요일
│  │  │  │  │
│  │  │  │  └─ 요일 (0-7, 0=일요일)
│  │  │  └─── 월 (1-12)
│  │  └────── 일 (1-31)
│  └───────── 시 (0-23)
└──────────── 분 (0-59)

예시:
0 2 * * 0     → 매주 일요일 새벽 2시
0 2 * * *     → 매일 새벽 2시
0 2 * * 1     → 매주 월요일 새벽 2시
0 2 1 * *     → 매월 1일 새벽 2시
0 */6 * * *   → 6시간마다
```

### 백업 로그 확인

```bash
# 실시간 로그 모니터링
tail -f ~/mongodb-backup.log

# 최근 백업 로그 확인
tail -n 50 ~/mongodb-backup.log

# 오늘 백업 로그만 보기
grep "$(date +%Y-%m-%d)" ~/mongodb-backup.log
```

---

## 🔧 트러블슈팅

### 문제 1: "mongodump: command not found"

```bash
# 해결: MongoDB Database Tools 설치
brew install mongodb-database-tools

# 설치 확인
which mongodump
```

### 문제 2: "MONGODB_URI 환경 변수가 설정되지 않았습니다"

```bash
# 해결: 환경 변수 설정
export MONGODB_URI='mongodb+srv://...'

# 또는 .env.local에 추가
echo 'MONGODB_URI=mongodb+srv://...' >> .env.local
```

### 문제 3: "Permission denied"

```bash
# 해결: 실행 권한 추가
chmod +x ./scripts/backup-mongodb.sh
chmod +x ./scripts/setup-backup-automation.sh
chmod +x ./scripts/restore-mongodb.sh
```

### 문제 4: cron이 작동하지 않음

```bash
# 1. cron 서비스 상태 확인 (Linux)
sudo service cron status

# 2. 로그 확인
tail -f ~/mongodb-backup.log

# 3. 수동 실행 테스트
./scripts/backup-wrapper.sh

# 4. 환경 변수 확인
# cron은 환경 변수가 로드되지 않을 수 있음
# backup-wrapper.sh가 .env.local을 로드하는지 확인
```

---

## 💾 백업 저장 위치 권장

### 로컬 백업 (기본)
```
위치: ~/mongodb-backups/
장점: ✅ 무료, ✅ 빠름
단점: ❌ 컴퓨터 고장 시 손실
```

### 외장 하드 (권장)
```bash
# 외장 하드에 복사
cp ~/mongodb-backups/backup-*.tar.gz /Volumes/External/backups/

# 자동화 (cron에 추가)
rsync -av ~/mongodb-backups/ /Volumes/External/backups/
```

### 클라우드 스토리지 (최고)

#### Google Drive
```bash
# rclone 설치
brew install rclone

# Google Drive 설정
rclone config

# 백업 업로드
rclone copy ~/mongodb-backups/ gdrive:mongodb-backups/
```

#### Dropbox
```bash
# Dropbox CLI 설치
brew install dropbox-uploader

# 백업 업로드
dropbox_uploader.sh upload ~/mongodb-backups/backup-*.tar.gz /
```

#### AWS S3 (비용 발생)
```bash
# AWS CLI 설치
brew install awscli

# S3 업로드
aws s3 sync ~/mongodb-backups/ s3://my-bucket/mongodb-backups/
```

---

## 📊 백업 전략 권장사항

### 백업 빈도

```
트래픽/데이터 변경 빈도에 따라:

소규모 (<100 방문자/일):
├─ 백업: 주 1회 (일요일)
└─ 보관: 4주 (1개월)

중규모 (100-1000 방문자/일):
├─ 백업: 주 2회 (수, 일)
└─ 보관: 8주 (2개월)

대규모 (>1000 방문자/일):
├─ 백업: 매일
└─ 보관: M10으로 업그레이드 권장
```

### 3-2-1 백업 규칙

```
3: 백업 사본 3개 유지
2: 2가지 다른 미디어에 저장
1: 1개는 오프사이트(클라우드)에 저장

예시:
1️⃣ 로컬 컴퓨터 (~/mongodb-backups/)
2️⃣ 외장 하드 (/Volumes/External/)
3️⃣ Google Drive (클라우드)
```

---

## 🔄 복구 시나리오

### 시나리오 1: 실수로 데이터 삭제

```bash
# 1. 최신 백업 확인
ls -lht ~/mongodb-backups/

# 2. 복원 실행
export MONGODB_URI='mongodb+srv://...'
./scripts/restore-mongodb.sh ~/mongodb-backups/backup-[최신날짜].tar.gz

# 3. 웹사이트 확인
curl https://parplay.co.kr/api/news

# 4. Vercel 재배포 (필요시)
vercel --prod
```

### 시나리오 2: 특정 시점으로 복구

```bash
# 1. 복구할 날짜의 백업 찾기
ls -l ~/mongodb-backups/ | grep "20251220"

# 2. 해당 백업 복원
./scripts/restore-mongodb.sh ~/mongodb-backups/backup-20251220-140000.tar.gz
```

### 시나리오 3: 로컬 백업 손실 (클라우드에서 복구)

```bash
# 1. 클라우드에서 다운로드 (Google Drive 예시)
rclone copy gdrive:mongodb-backups/ ~/mongodb-backups/

# 2. 복원
./scripts/restore-mongodb.sh ~/mongodb-backups/backup-[날짜].tar.gz
```

---

## ✅ 정기 점검 체크리스트

### 월간 (매월 1일)
- [ ] 백업 파일 존재 확인
  ```bash
  ls -lh ~/mongodb-backups/
  ```
- [ ] 최근 백업 날짜 확인
- [ ] 백업 크기 트렌드 확인
- [ ] 복원 테스트 (테스트 환경)

### 분기별 (3개월마다)
- [ ] cron 작업 정상 작동 확인
  ```bash
  crontab -l
  tail -n 100 ~/mongodb-backup.log
  ```
- [ ] 클라우드 백업 동기화 확인
- [ ] 오래된 백업 정리 (수동)
  ```bash
  find ~/mongodb-backups/ -name "*.tar.gz" -mtime +90 -delete
  ```

---

## 📞 도움말

### 스크립트 위치
```
scripts/
├── backup-mongodb.sh          → 수동 백업
├── restore-mongodb.sh         → 복원
├── setup-backup-automation.sh → 자동화 설정
└── backup-wrapper.sh          → cron용 래퍼
```

### 문서 위치
```
docs/
├── MANUAL_BACKUP_GUIDE.md          → 이 문서
├── DISASTER_RECOVERY_PLAN.md       → 재해 복구 계획
├── BACKUP_CHECKLIST.md             → 백업 체크리스트
└── ENVIRONMENT_VARIABLES.md        → 환경 변수 가이드
```

### 유용한 명령어
```bash
# 백업 크기 확인
du -sh ~/mongodb-backups/

# 백업 개수 확인
ls -1 ~/mongodb-backups/*.tar.gz | wc -l

# 가장 최근 백업
ls -t ~/mongodb-backups/*.tar.gz | head -1

# 백업 파일 정보
tar -tzf ~/mongodb-backups/backup-[날짜].tar.gz | head

# 디스크 사용량 확인
df -h ~
```

---

## 🎯 다음 단계

### 지금 실행
1. ✅ MongoDB Database Tools 설치
2. ✅ MONGODB_URI 환경 변수 설정
3. ✅ 첫 백업 실행
4. ✅ 자동화 설정

### 1주일 후
- 백업 로그 확인
- 백업 파일 존재 확인
- 필요시 스케줄 조정

### 1개월 후
- 복원 테스트 수행
- 클라우드 백업 설정 (Google Drive 등)
- M10 업그레이드 검토

---

**마지막 업데이트**: 2025-12-26  
**버전**: 1.0  
**작성자**: AI Assistant

