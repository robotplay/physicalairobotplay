# 빠른 푸시 가이드

## 현재 상황
- 푸시 대기 중인 커밋: 1개
- 인증 오류 발생

## 가장 빠른 해결 방법

### 1. Personal Access Token 생성 (2분)

1. 브라우저에서 접속: https://github.com/settings/tokens
2. "Generate new token" → "Generate new token (classic)" 클릭
3. 설정:
   - Note: `academy-site`
   - Expiration: **`90 days`** (권장) 또는 `60 days`
     - 개발 중인 프로젝트: 90일 권장
     - 프로덕션: 30-60일
   - ✅ `repo` 체크 (필수)
4. "Generate token" 클릭
5. **토큰 복사** (예: `ghp_xxxxxxxxxxxxxxxxxxxx`)

### 2. 푸시 실행

터미널에서:

```bash
cd /Users/hkjtop/academy-site
git push origin main
```

프롬프트가 나타나면:
- **Username**: `robotplay` (또는 GitHub 사용자명)
- **Password**: 복사한 Personal Access Token 붙여넣기

### 3. 완료!

푸시가 성공하면:
```
Enumerating objects: ...
Writing objects: ...
To https://github.com/robotplay/physicalairobotplay.git
   c2a9cf0..f80ff77  main -> main
```

---

## 대안: SSH 키 등록 (한 번만 설정)

### 1. SSH 공개 키 복사

```bash
cat ~/.ssh/id_ed25519.pub
# 또는
pbcopy < ~/.ssh/id_ed25519.pub  # macOS에서 클립보드로 복사
```

### 2. GitHub에 SSH 키 추가

1. https://github.com/settings/keys 접속
2. "New SSH key" 클릭
3. 설정:
   - Title: `MacBook Pro`
   - Key: 복사한 공개 키 붙여넣기
4. "Add SSH key" 클릭

### 3. 원격 URL 변경 및 푸시

```bash
cd /Users/hkjtop/academy-site
git remote set-url origin git@github.com:robotplay/physicalairobotplay.git
git push origin main
```

---

## 문제 해결

### "Permission denied" 오류
- Personal Access Token이 올바른지 확인
- 토큰에 `repo` 권한이 있는지 확인

### "Authentication failed" 오류
- Username이 정확한지 확인
- Password에 Personal Access Token을 입력했는지 확인 (GitHub 비밀번호 아님!)

### 토큰이 작동하지 않음
- 토큰이 만료되지 않았는지 확인
- 새로운 토큰 생성 후 다시 시도

