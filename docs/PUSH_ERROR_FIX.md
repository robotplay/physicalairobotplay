# Git Push 인증 오류 해결

## 문제
- "Missing or invalid credentials" 오류
- VSCode Git credential helper 소켓 연결 오류
- "Authentication failed" 오류

## 원인
VSCode의 Git credential helper가 제대로 작동하지 않아 인증 정보를 입력할 수 없었습니다.

## 해결 방법

### 방법 1: URL에 토큰 포함 (가장 빠름)

```bash
# Personal Access Token을 URL에 포함
git remote set-url origin https://YOUR_TOKEN@github.com/robotplay/physicalairobotplay.git

# 푸시
git push origin main
```

⚠️ **주의**: 이 방법은 토큰이 Git 설정에 저장되므로 보안상 완벽하지 않습니다. 하지만 빠르게 해결할 수 있습니다.

### 방법 2: Credential Helper 재설정

```bash
# VSCode credential helper 제거
git config --global --unset credential.helper

# Store 방식으로 변경 (토큰을 파일에 저장)
git config --global credential.helper store

# 푸시 시도 (이번에는 토큰 입력 가능)
git push origin main
```

### 방법 3: SSH 사용 (가장 안전)

```bash
# SSH URL로 변경
git remote set-url origin git@github.com:robotplay/physicalairobotplay.git

# SSH 키가 GitHub에 등록되어 있다면 바로 작동
git push origin main
```

## 권장 해결 순서

1. **먼저 방법 1 시도** (가장 빠름)
2. 안 되면 **방법 2 시도**
3. 장기적으로는 **방법 3 (SSH)** 권장

