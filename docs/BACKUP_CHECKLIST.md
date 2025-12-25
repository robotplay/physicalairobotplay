# ✅ 백업 체크리스트

## 📅 일일 백업 체크리스트 (Daily)

### 자동 백업 확인
- [ ] MongoDB Atlas 일일 스냅샷 생성 확인
  ```
  시간: 매일 새벽 2시 (KST)
  확인: https://cloud.mongodb.com/ → Backup → Snapshots
  상태: ✅ Completed
  ```

- [ ] 백업 크기 확인
  ```
  정상 범위: 10MB - 500MB
  급격한 증가 시: 조사 필요
  ```

- [ ] 백업 실패 알림 확인
  ```
  이메일: [관리자 이메일]
  Slack: #alerts 채널
  ```

---

## 📅 주간 백업 체크리스트 (Weekly - 매주 월요일)

### 백업 무결성 검증
- [ ] 최근 7일 스냅샷 모두 존재 확인
- [ ] 백업 크기 트렌드 확인
- [ ] 이상 패턴 조사

### 환경 변수 백업
- [ ] Vercel 환경 변수 변경 사항 확인
- [ ] 비밀번호 관리자에 최신 값 업데이트
- [ ] `docs/ENVIRONMENT_VARIABLES.md` 업데이트

### GitHub 저장소 백업
- [ ] 모든 브랜치 원격 저장소에 푸시 확인
- [ ] 로컬 백업 생성 (선택사항)
  ```bash
  git clone --mirror https://github.com/robotplay/physicalairobotplay.git
  tar -czf backup-$(date +%Y%m%d).tar.gz physicalairobotplay.git
  ```

---

## 📅 월간 백업 체크리스트 (Monthly - 매월 1일)

### 백업 복구 테스트
- [ ] MongoDB 스냅샷 복구 테스트 수행
  ```
  1. 최신 스냅샷 선택
  2. 테스트 클러스터로 복구
  3. 데이터 검증
  4. 복구 시간 측정: [____] 분
  5. 테스트 클러스터 삭제
  ```

- [ ] 복구 시간 기록
  ```
  목표 RTO: 60분
  실제 복구: [____] 분
  개선 필요: [ ] Yes [ ] No
  ```

### 장기 보관 백업 생성
- [ ] 월말 스냅샷을 장기 보관으로 표시
- [ ] 필요시 로컬 또는 S3에 추가 백업
  ```bash
  # MongoDB Atlas에서 다운로드
  # → 암호화 후 S3 업로드
  ```

### 문서 업데이트
- [ ] `docs/ENVIRONMENT_VARIABLES.md` 검토 및 업데이트
- [ ] `docs/DISASTER_RECOVERY_PLAN.md` 검토
- [ ] 백업 프로세스 개선 사항 반영

---

## 📅 분기별 백업 체크리스트 (Quarterly)

### 보안 감사
- [ ] 환경 변수 접근 권한 검토
- [ ] 비밀번호 관리자 접근 로그 확인
- [ ] API 키 로테이션 필요 여부 확인

### API 키 로테이션
- [ ] MongoDB Atlas 사용자 비밀번호 변경
  ```
  1. 새 비밀번호 생성
  2. 연결 문자열 업데이트
  3. Vercel 환경 변수 업데이트
  4. 재배포
  5. 구 비밀번호 비활성화
  ```

- [ ] PortOne API 키 로테이션 (필요시)
- [ ] Sentry Auth Token 갱신 (필요시)

### 백업 정책 검토
- [ ] 백업 보관 기간 적절성 검토
  ```
  현재: 일일 30일, 주간 4주, 월간 12개월
  변경 필요: [ ] Yes [ ] No
  ```

- [ ] 백업 비용 검토
  ```
  월간 비용: $[____]
  최적화 가능: [ ] Yes [ ] No
  ```

---

## 📅 연간 백업 체크리스트 (Yearly - 매년 1월)

### 재해 복구 훈련
- [ ] 전체 팀 참여 복구 훈련 실시
  ```
  시나리오 1: 데이터베이스 완전 손실
  시나리오 2: Vercel 프로젝트 삭제
  시나리오 3: 환경 변수 손실
  ```

- [ ] 훈련 결과 기록
  ```
  복구 시간: [____] 분
  문제점: [____]
  개선 사항: [____]
  ```

### 백업 전략 재평가
- [ ] RTO/RPO 목표 재검토
- [ ] 새로운 백업 기술 조사
- [ ] 비용 대비 효과 분석

### 규정 준수 확인
- [ ] 데이터 보관 법적 요구사항 확인
- [ ] 개인정보 백업 정책 준수 확인
- [ ] 백업 암호화 정책 확인

---

## 🚨 긴급 백업 (사고 발생 시)

### 즉시 수행
- [ ] 현재 상태 긴급 백업
  ```bash
  # MongoDB Atlas에서 즉시 스냅샷 생성
  "Take Snapshot Now" 클릭
  이름: emergency-backup-$(date +%Y%m%d-%H%M)
  ```

- [ ] 로컬 백업 생성
  ```bash
  mongodump --uri="$MONGODB_URI" --out=./emergency-backup
  tar -czf emergency-backup-$(date +%Y%m%d-%H%M).tar.gz ./emergency-backup
  ```

- [ ] 환경 변수 스냅샷
  ```bash
  # Vercel CLI로 환경 변수 백업
  vercel env pull .env.emergency-backup
  ```

### 사고 기록
- [ ] 사고 발생 시간 기록
- [ ] 사고 원인 간략히 기록
- [ ] 수행한 긴급 조치 기록
- [ ] 데이터 손실 범위 확인

---

## 📊 백업 상태 대시보드

### MongoDB Atlas
```
최근 백업: [날짜/시간]
상태: ✅ 정상 | ⚠️ 경고 | ❌ 실패
크기: [___] MB
보관 개수: [___]개
```

### GitHub
```
최근 커밋: [날짜/시간]
브랜치 수: [___]개
원격 저장소: ✅ 동기화 | ⚠️ 지연
```

### 환경 변수
```
최근 백업: [날짜/시간]
저장 위치: [비밀번호 관리자 이름]
변수 개수: [___]개
```

---

## 🔔 알림 설정

### MongoDB Atlas 알림
```
설정: Alerts → Add Alert
조건:
├─ Backup Failed
├─ Snapshot Older Than 48 Hours
└─ Storage Usage > 80%

알림 채널:
├─ Email: [관리자 이메일]
└─ Slack: #alerts
```

### Vercel 배포 알림
```
설정: Project Settings → Notifications
조건:
├─ Deployment Failed
├─ Deployment Succeeded (선택)
└─ Domain Configuration Error

알림 채널:
└─ Email: [관리자 이메일]
```

### GitHub 알림
```
설정: Repository Settings → Webhooks
이벤트:
├─ Push (main 브랜치)
├─ Pull Request
└─ Release

알림 채널:
└─ Slack: #github-activity
```

---

## 📝 백업 로그 템플릿

### 일일 백업 로그
```
날짜: YYYY-MM-DD
담당자: [이름]

[ ] MongoDB 백업 확인
    - 스냅샷 ID: [____]
    - 크기: [____] MB
    - 상태: ✅ 정상

[ ] GitHub 푸시 확인
    - 최근 커밋: [____]
    - 브랜치: [____]

이상 사항: [없음 | 설명]
조치 사항: [없음 | 설명]
```

### 복구 테스트 로그
```
날짜: YYYY-MM-DD
담당자: [이름]
시나리오: [데이터베이스 복구 | 애플리케이션 복구 | 환경 변수 복구]

시작 시간: [____]
완료 시간: [____]
소요 시간: [____] 분

테스트 결과:
[ ] 성공
[ ] 부분 성공 (설명: ____)
[ ] 실패 (설명: ____)

개선 사항:
[____]
```

---

## 🎯 백업 KPI (Key Performance Indicators)

### 목표 지표
```
백업 성공률: > 99.9%
복구 테스트 빈도: 월 1회 이상
복구 성공률: 100%
평균 복구 시간: < 60분
백업 데이터 무결성: 100%
```

### 측정 방법
```
1. 백업 성공률
   = (성공한 백업 수 / 전체 백업 시도 수) × 100

2. 복구 성공률
   = (성공한 복구 수 / 전체 복구 시도 수) × 100

3. 평균 복구 시간
   = Σ(각 복구 시간) / 복구 횟수
```

---

## 🛠️ 유용한 명령어 모음

### MongoDB 백업
```bash
# 전체 백업 (dump)
mongodump --uri="$MONGODB_URI" --out=./backup

# 특정 컬렉션만 백업
mongodump --uri="$MONGODB_URI" --collection=news --out=./backup

# 압축 백업
mongodump --uri="$MONGODB_URI" --gzip --archive=backup.gz

# 복원
mongorestore --uri="$MONGODB_URI" --gzip --archive=backup.gz
```

### Git 백업
```bash
# 미러 클론 (모든 브랜치, 태그 포함)
git clone --mirror [repository-url]

# 번들 파일 생성 (오프라인 백업)
git bundle create backup.bundle --all

# 번들 복원
git clone backup.bundle restored-repo
```

### Vercel 환경 변수
```bash
# 모든 환경 변수 확인
vercel env ls

# 환경 변수 백업
vercel env pull .env.backup

# 환경 변수 복원 (수동)
vercel env add VAR_NAME production < value.txt
```

---

**마지막 업데이트**: 2025-12-26  
**다음 검토 예정**: 2026-01-01  
**담당자**: DevOps 팀  
**승인자**: [관리자 이름]

