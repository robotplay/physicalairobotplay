# Personal Access Token으로 푸시하기

## ✅ 토큰 생성 완료!

이메일 확인: "academy-site-deploy" 토큰이 성공적으로 생성되었습니다.

## 다음 단계

### 1. 토큰 값 복사 (중요!)

1. **GitHub 토큰 페이지로 이동**
   - https://github.com/settings/tokens 접속
   - 또는 이메일의 링크 클릭

2. **"academy-site-deploy" 토큰 찾기**
   - 최근 생성된 토큰 목록에서 확인

3. **토큰 값 복사**
   - 토큰 이름 옆에 있는 **복사 아이콘** 클릭
   - 또는 토큰을 클릭해서 상세 페이지에서 복사
   - 토큰은 `ghp_`로 시작하는 긴 문자열입니다
   - 예: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

⚠️ **중요**: 토큰 값은 이 페이지에서만 볼 수 있습니다. 나중에 다시 볼 수 없으니 안전한 곳에 보관하세요!

### 2. 푸시 실행

터미널에서 다음 명령 실행:

```bash
cd /Users/hkjtop/academy-site
git push origin main
```

### 3. 인증 정보 입력

프롬프트가 나타나면:

- **Username**: `robotplay` (또는 GitHub 사용자명)
- **Password**: 복사한 Personal Access Token 붙여넣기
  - ⚠️ GitHub 비밀번호가 **아닙니다**!
  - Personal Access Token을 입력해야 합니다!

### 4. 성공 확인

푸시가 성공하면 다음과 같은 메시지가 나타납니다:

```
Enumerating objects: ...
Writing objects: ...
To https://github.com/robotplay/physicalairobotplay.git
   c2a9cf0..f80ff77  main -> main
```

## 문제 해결

### "Authentication failed" 오류
- 토큰을 정확히 복사했는지 확인
- Username이 정확한지 확인
- Password 필드에 토큰을 입력했는지 확인 (GitHub 비밀번호 아님!)

### "Permission denied" 오류
- 토큰에 `repo` 권한이 있는지 확인
- 토큰이 만료되지 않았는지 확인

### 토큰을 찾을 수 없음
- https://github.com/settings/tokens 접속
- "academy-site-deploy" 토큰 확인
- 토큰이 보이지 않으면 새로 생성

## 보안 팁

- ✅ 토큰은 비밀번호처럼 관리
- ✅ 토큰을 코드나 공개 장소에 저장하지 않기
- ✅ 토큰을 다른 사람과 공유하지 않기
- ✅ 만료되면 새 토큰 생성

