# ☁️ Google Drive 자동 백업 가이드

## 🎯 개요

MongoDB 백업을 Google Drive에 자동으로 업로드하는 무료 솔루션입니다.

**장점:**
- ✅ 완전 무료 (Google Drive 15GB 무료)
- ✅ 자동 업로드 (백업 완료 시 즉시)
- ✅ 원격 저장 (로컬 파일 손실 방지)
- ✅ 웹 접근 가능 (어디서나 다운로드)

---

## 📋 설정 단계

### Step 1: rclone 설치 확인

```bash
# 이미 설치되어 있습니다!
rclone version

# 출력 예시:
# rclone v1.72.1
```

---

### Step 2: Google Drive 연동 (5분)

#### 자동 설정 스크립트 실행

```bash
cd /Users/hkjtop/.cursor/worktrees/academy-site/hss

./scripts/setup-gdrive.sh
```

#### 설정 프로세스

스크립트 실행 후 아래 단계를 따라주세요:

```
1. 'n' 입력 → 새 원격 저장소 생성

2. 이름 입력: gdrive

3. Storage 선택:
   → 번호 입력 (보통 15번 정도가 Google Drive)
   → 리스트에서 "Google Drive" 찾아서 번호 입력

4. Client ID: 엔터 (기본값 사용)

5. Client Secret: 엔터 (기본값 사용)

6. Scope 선택: 1
   → 1 / Full access to all files
   
7. Root folder ID: 엔터

8. Service Account: 엔터

9. Advanced config: n

10. Auto config: y
    → 브라우저가 자동으로 열립니다

11. 구글 로그인:
    ✅ 백업 저장용 Google 계정으로 로그인
    ✅ rclone 권한 허용

12. Configure as team drive: n

13. 설정 완료!
    → 'q' 입력하여 종료
```

---

### Step 3: 연결 확인

```bash
# 연결된 원격 저장소 확인
rclone listremotes

# 출력: gdrive:

# Google Drive 최상위 폴더 목록 보기
rclone lsd gdrive:

# Google Drive에 테스트 폴더 생성
rclone mkdir gdrive:mongodb-backups
```

---

### Step 4: 테스트 업로드

```bash
# 기존 백업을 Google Drive에 업로드
rclone copy ~/mongodb-backups/ gdrive:mongodb-backups/ --progress

# 업로드 확인
rclone ls gdrive:mongodb-backups/
```

**예상 출력:**
```
  2621440 backup-20251226-080918.tar.gz
```

---

## 🚀 자동 업로드 작동 확인

### 백업 실행 (자동 업로드 포함)

```bash
cd /Users/hkjtop/.cursor/worktrees/academy-site/hss

# 환경 변수 로드
export $(grep -v '^#' .env.local | xargs)

# 백업 실행 (자동으로 Google Drive 업로드됨!)
./scripts/backup-mongodb.sh
```

**예상 출력:**
```
🔄 MongoDB 백업 시작...
📦 백업 중...
✅ 백업 완료! 크기: 3.3M
🗜️  압축 중...
✅ 압축 완료! 크기: 2.5M
☁️  Google Drive 업로드 중...
✅ Google Drive 업로드 완료!
🧹 30일 이상 된 백업 정리 중...
✅ 현재 백업 개수: 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 백업 완료!

📁 로컬 백업: ~/mongodb-backups/backup-20251226-080918.tar.gz
📊 압축 크기: 2.5M
📦 전체 백업: 1개
☁️  Google Drive: ✅ 업로드됨
   위치: gdrive:mongodb-backups/backup-20251226-080918.tar.gz
```

---

## 📅 자동 백업 스케줄

기존 cron 작업이 그대로 작동합니다:

```
✅ 매주 일요일 새벽 2시에 자동 백업
✅ 백업 완료 후 자동으로 Google Drive에 업로드
✅ 로컬 + 클라우드 이중 백업
```

### cron 확인

```bash
crontab -l

# 출력:
# MongoDB 자동 백업 - 매주 일요일 새벽 2시
# 0 2 * * 0 /path/to/backup-wrapper.sh >> ~/mongodb-backup.log 2>&1
```

---

## 🌐 Google Drive에서 백업 확인

### 방법 1: 웹 브라우저

```
1. https://drive.google.com 접속
2. "mongodb-backups" 폴더 찾기
3. 백업 파일 목록 확인
```

### 방법 2: rclone 명령어

```bash
# Google Drive 백업 목록
rclone ls gdrive:mongodb-backups/

# 백업 파일 상세 정보
rclone lsl gdrive:mongodb-backups/

# 특정 백업 다운로드
rclone copy gdrive:mongodb-backups/backup-20251226-080918.tar.gz ~/Downloads/
```

---

## 💾 Google Drive에서 복원

### 시나리오: 로컬 백업 손실 시

```bash
# 1. Google Drive에서 백업 목록 확인
rclone ls gdrive:mongodb-backups/

# 2. 최신 백업 다운로드
rclone copy gdrive:mongodb-backups/backup-[최신날짜].tar.gz ~/mongodb-backups/

# 3. 환경 변수 설정
export $(grep -v '^#' .env.local | xargs)

# 4. 복원 실행
./scripts/restore-mongodb.sh ~/mongodb-backups/backup-[날짜].tar.gz
```

---

## 🧹 Google Drive 백업 관리

### 오래된 백업 삭제

```bash
# 30일 이상 된 백업 확인
rclone ls gdrive:mongodb-backups/ | awk '{print $2}' | sort

# 특정 백업 삭제
rclone delete gdrive:mongodb-backups/backup-20251126-080918.tar.gz

# 전체 삭제 (주의!)
# rclone delete gdrive:mongodb-backups/
```

### 백업 동기화

```bash
# 로컬 → Google Drive 동기화
rclone sync ~/mongodb-backups/ gdrive:mongodb-backups/

# Google Drive → 로컬 동기화 (주의: 로컬 파일 삭제됨!)
rclone sync gdrive:mongodb-backups/ ~/mongodb-backups/
```

---

## 📊 스토리지 용량 관리

### Google Drive 무료 용량

```
무료 계정: 15GB
├─ Gmail: ~
├─ Google Photos: ~
└─ Google Drive: ~

백업 예상 사용량:
├─ 백업 1개: 2.5MB
├─ 주간 백업 (1년): 2.5MB × 52 = 130MB
└─ 총 예상: 150MB (여유 충분!)
```

### 용량 확인

```bash
# Google Drive 사용 현황
rclone about gdrive:

# 출력 예시:
# Total:   15 GiB
# Used:    1.2 GiB
# Free:    13.8 GiB
```

---

## 🔧 고급 설정

### 특정 시간에 업로드

백업은 로컬에 저장하고, 특정 시간에만 Google Drive 업로드:

```bash
# crontab -e 편집
# 백업: 매일 새벽 2시
0 2 * * * /path/to/backup-wrapper.sh >> ~/mongodb-backup.log 2>&1

# Google Drive 업로드: 매일 새벽 3시
0 3 * * * rclone copy ~/mongodb-backups/ gdrive:mongodb-backups/ >> ~/gdrive-sync.log 2>&1
```

### 암호화 백업

```bash
# rclone crypt 설정 (암호화)
rclone config

# 새 원격 저장소 생성
# 이름: gdrive-encrypted
# Storage: crypt
# Remote: gdrive:mongodb-backups
# Password: (강력한 비밀번호 입력)

# 암호화하여 업로드
rclone copy ~/mongodb-backups/ gdrive-encrypted: --progress
```

### 대역폭 제한

```bash
# 업로드 속도 제한 (1MB/s)
rclone copy ~/mongodb-backups/ gdrive:mongodb-backups/ --bwlimit 1M

# 특정 시간대에만 업로드 (새벽 2-4시)
rclone copy ~/mongodb-backups/ gdrive:mongodb-backups/ --bwlimit 02:00,10M 04:00,off
```

---

## 🚨 트러블슈팅

### 문제 1: "Failed to configure" 에러

```bash
# 해결: rclone 재설정
rclone config delete gdrive
./scripts/setup-gdrive.sh
```

### 문제 2: "couldn't find file" 에러

```bash
# 해결: 백업 폴더 생성
rclone mkdir gdrive:mongodb-backups
```

### 문제 3: 업로드 속도 느림

```bash
# 해결: 전송 설정 최적화
rclone copy ~/mongodb-backups/ gdrive:mongodb-backups/ \
  --transfers 8 \
  --checkers 16 \
  --buffer-size 64M
```

### 문제 4: 토큰 만료

```bash
# 증상: "Token expired" 에러
# 해결: 재인증
rclone config reconnect gdrive
```

---

## 📈 백업 전략

### 3-2-1 백업 규칙 (완성!)

```
✅ 3개 사본:
   1️⃣ 로컬 (~mongodb-backups/)
   2️⃣ Google Drive (gdrive:mongodb-backups/)
   3️⃣ 외장 하드 (선택사항)

✅ 2개 미디어:
   💾 로컬 디스크
   ☁️  클라우드 스토리지

✅ 1개 오프사이트:
   ☁️  Google Drive (원격)
```

### 권장 보관 정책

```
로컬:
├─ 최근 30일 백업 유지
└─ 자동 정리 (30일 이상 삭제)

Google Drive:
├─ 최근 90일 백업 유지 (수동 관리)
├─ 월말 백업 영구 보관
└─ 1년 이상 백업 선택적 삭제
```

---

## ✅ 설정 완료 체크리스트

- [x] rclone 설치
- [ ] Google Drive 연동 (`./scripts/setup-gdrive.sh`)
- [ ] 연결 테스트 (`rclone lsd gdrive:`)
- [ ] 백업 폴더 생성 (`rclone mkdir gdrive:mongodb-backups`)
- [ ] 테스트 업로드 (`./scripts/backup-mongodb.sh`)
- [ ] 자동 백업 확인 (다음 일요일 확인)

---

## 📞 유용한 명령어 모음

```bash
# Google Drive 백업 목록
rclone ls gdrive:mongodb-backups/

# 최신 백업 확인
rclone ls gdrive:mongodb-backups/ | tail -1

# 백업 개수
rclone ls gdrive:mongodb-backups/ | wc -l

# 백업 총 크기
rclone size gdrive:mongodb-backups/

# 특정 백업 다운로드
rclone copy gdrive:mongodb-backups/backup-[날짜].tar.gz ~/Downloads/

# 모든 백업 다운로드
rclone copy gdrive:mongodb-backups/ ~/mongodb-backups-restore/

# Google Drive 용량 확인
rclone about gdrive:
```

---

## 🎯 다음 단계

### 지금 실행
```bash
1. Google Drive 연동
   ./scripts/setup-gdrive.sh

2. 테스트 백업 (자동 업로드 포함)
   ./scripts/backup-mongodb.sh

3. Google Drive 확인
   https://drive.google.com
```

### 다음 주 확인
```bash
# 자동 백업 로그 확인
tail -f ~/mongodb-backup.log

# Google Drive 백업 확인
rclone ls gdrive:mongodb-backups/
```

---

**마지막 업데이트**: 2025-12-26  
**버전**: 1.0  
**작성자**: AI Assistant

