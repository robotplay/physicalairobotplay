# GitHub 인증 설정 가이드

## 현재 상황
- 원격 저장소: `https://github.com/robotplay/physicalairobotplay.git`
- 인증 오류로 푸시 실패
- 1개의 커밋이 푸시 대기 중

---

## 해결 방법 1: Personal Access Token (PAT) 사용 (추천)

### 1단계: GitHub에서 Personal Access Token 생성

1. **GitHub에 로그인**
   - https://github.com 접속
   - 로그인

2. **Settings로 이동**
   - 우측 상단 프로필 클릭 → **Settings**

3. **Developer settings**
   - 좌측 하단 **Developer settings** 클릭

4. **Personal access tokens**
   - **Personal access tokens** → **Tokens (classic)** 클릭
   - 또는 **Fine-grained tokens** (새로운 방식)

5. **Generate new token**
   - **Generate new token** (classic) 또는 **Generate new token** 클릭

6. **토큰 설정**
   - **Note**: `academy-site-push` (설명)
   - **Expiration**: 원하는 기간 선택 (90일, 1년 등)
   - **Scopes**: 최소한 다음 권한 체크
     - ✅ `repo` (전체 저장소 접근)
     - ✅ `workflow` (GitHub Actions 사용 시)

7. **Generate token**
   - 하단 **Generate token** 클릭
   - ⚠️ **중요**: 토큰을 복사해 안전한 곳에 보관 (한 번만 표시됨)

### 2단계: Git에 토큰 설정

#### 방법 A: Git Credential Helper 사용 (추천)

```bash
# macOS의 경우
git config --global credential.helper osxkeychain

# 푸시 시도 (토큰을 비밀번호로 입력)
git push origin main
# Username: GitHub 사용자명 입력
# Password: Personal Access Token 입력 (비밀번호 아님!)
```

#### 방법 B: URL에 토큰 포함 (임시)

```bash
# 원격 URL 변경 (토큰 포함)
git remote set-url origin https://YOUR_TOKEN@github.com/robotplay/physicalairobotplay.git

# 푸시
git push origin main
```

⚠️ **보안 주의**: 이 방법은 토큰이 Git 설정에 저장되므로 보안상 권장하지 않습니다.

---

## 해결 방법 2: SSH 키 사용 (더 안전)

### 1단계: SSH 키 생성

```bash
# SSH 키 생성 (이미 있다면 생략)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Enter 키 3번 누르기 (기본 설정 사용)
# 또는 passphrase 설정 (추천)
```

### 2단계: SSH 키를 GitHub에 추가

```bash
# 공개 키 복사
cat ~/.ssh/id_ed25519.pub
# 또는
pbcopy < ~/.ssh/id_ed25519.pub  # macOS
```

1. **GitHub Settings**
   - https://github.com/settings/keys 접속
   - **New SSH key** 클릭

2. **키 추가**
   - **Title**: `MacBook Pro` (설명)
   - **Key**: 복사한 공개 키 붙여넣기
   - **Add SSH key** 클릭

### 3단계: 원격 URL을 SSH로 변경

```bash
# 원격 URL 확인
git remote -v

# SSH URL로 변경
git remote set-url origin git@github.com:robotplay/physicalairobotplay.git

# 연결 테스트
ssh -T git@github.com
# "Hi robotplay! You've successfully authenticated..." 메시지 확인

# 푸시
git push origin main
```

---

## 해결 방법 3: GitHub CLI 사용

### 1단계: GitHub CLI 설치

```bash
# macOS (Homebrew)
brew install gh

# 또는 공식 사이트에서 설치
# https://cli.github.com/
```

### 2단계: GitHub CLI 인증

```bash
# GitHub CLI 로그인
gh auth login

# 옵션 선택:
# - GitHub.com
# - HTTPS
# - Login with a web browser
# - 브라우저에서 인증 완료
```

### 3단계: 푸시

```bash
git push origin main
```

---

## 빠른 해결 (가장 간단)

### Personal Access Token으로 즉시 푸시

1. **토큰 생성** (위의 "해결 방법 1" 참고)

2. **터미널에서 실행**:

```bash
cd /Users/hkjtop/academy-site

# 푸시 시도
git push origin main

# Username: robotplay (또는 GitHub 사용자명)
# Password: [생성한 Personal Access Token 붙여넣기]
```

---

## 문제 해결 체크리스트

- [ ] Personal Access Token 생성 완료
- [ ] 토큰에 `repo` 권한 부여
- [ ] Git credential helper 설정
- [ ] 푸시 시도

---

## 추가 팁

### Credential Helper 확인

```bash
# 현재 설정 확인
git config --global credential.helper

# macOS Keychain 사용 설정
git config --global credential.helper osxkeychain
```

### 원격 URL 확인/변경

```bash
# 현재 URL 확인
git remote -v

# HTTPS로 변경
git remote set-url origin https://github.com/robotplay/physicalairobotplay.git

# SSH로 변경
git remote set-url origin git@github.com:robotplay/physicalairobotplay.git
```

---

## 보안 권장사항

1. ✅ **Personal Access Token 사용 시**:
   - 토큰은 비밀번호처럼 관리
   - 만료 기간 설정
   - 불필요한 권한 부여하지 않기

2. ✅ **SSH 키 사용 시**:
   - Passphrase 설정
   - 공개 키만 GitHub에 업로드
   - 개인 키는 절대 공유하지 않기

3. ✅ **일반적인 보안**:
   - 정기적으로 토큰/키 갱신
   - 사용하지 않는 토큰/키 삭제

---

## 참고 링크

- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub SSH Keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Git Credential Helper](https://git-scm.com/docs/git-credential)

