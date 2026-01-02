# Personal Access Token 보안 조치 가이드

## 현재 상황
- 토큰이 대화/코드에 노출됨
- 보안 위험 존재
- 즉시 조치 필요

## 조치 단계

### 1단계: 기존 토큰 무효화

1. **GitHub 토큰 페이지 접속**
   - https://github.com/settings/tokens
   - 또는 https://github.com/settings/tokens?type=beta (Fine-grained tokens)

2. **"academy-site-deploy" 토큰 찾기**
   - 토큰 목록에서 확인

3. **토큰 삭제**
   - 토큰 옆의 **삭제 버튼** 클릭
   - 확인 메시지에서 **"I understand, delete this token"** 클릭

### 2단계: 새 토큰 생성

1. **"Generate new token" → "Generate new token (classic)" 클릭**

2. **설정**
   - Note: `academy-site-deploy-2` (또는 다른 이름)
   - Expiration: `90 days`
   - ✅ `repo` 체크

3. **"Generate token" 클릭**

4. **토큰 복사** (한 번만 표시됨!)

### 3단계: Git 원격 URL 업데이트

```bash
cd /Users/hkjtop/academy-site

# 새 토큰으로 URL 업데이트 (NEW_TOKEN을 새 토큰으로 교체)
git remote set-url origin https://NEW_TOKEN@github.com/robotplay/physicalairobotplay.git

# 확인
git remote -v
```

### 4단계: 테스트

```bash
# 간단한 테스트 (원격 저장소 정보 확인)
git ls-remote origin

# 또는 푸시 테스트
git push origin main
```

## 보안 모범 사례

### ✅ DO
- 토큰을 환경 변수로 관리
- SSH 키 사용 (더 안전)
- 정기적으로 토큰 갱신
- 최소 권한 원칙 (필요한 권한만)

### ❌ DON'T
- 토큰을 코드에 하드코딩
- 토큰을 Git에 커밋
- 토큰을 공개 장소에 저장
- 토큰을 다른 사람과 공유

## 향후 권장사항

### 옵션 1: SSH 키 사용 (가장 안전)

```bash
# SSH 키 생성 (이미 있다면 생략)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 공개 키를 GitHub에 추가
# https://github.com/settings/keys

# 원격 URL 변경
git remote set-url origin git@github.com:robotplay/physicalairobotplay.git
```

### 옵션 2: GitHub CLI 사용

```bash
# GitHub CLI 설치
brew install gh

# 인증
gh auth login

# 자동으로 토큰 관리
```

### 옵션 3: 환경 변수 사용

```bash
# .env 파일에 저장 (Git에 커밋하지 않기!)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# 스크립트에서 사용
git remote set-url origin https://${GITHUB_TOKEN}@github.com/robotplay/physicalairobotplay.git
```

