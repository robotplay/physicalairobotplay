# ⚠️ 보안 경고: Personal Access Token 노출

## 현재 상황
Personal Access Token이 코드/대화에 노출되었습니다.

## 즉시 조치 사항

### 1. 토큰 무효화 (권장)

1. https://github.com/settings/tokens 접속
2. "academy-site-deploy" 토큰 찾기
3. 토큰 삭제 또는 무효화
4. 새 토큰 생성 (필요한 경우)

### 2. 새 토큰 생성 (필요한 경우)

1. https://github.com/settings/tokens 접속
2. "Generate new token (classic)" 클릭
3. 새 이름으로 생성 (예: `academy-site-deploy-2`)
4. 새 토큰으로 URL 업데이트

## 보안 모범 사례

- ✅ 토큰을 코드나 공개 장소에 저장하지 않기
- ✅ 토큰을 다른 사람과 공유하지 않기
- ✅ 토큰이 노출되면 즉시 무효화
- ✅ 정기적으로 토큰 갱신
- ✅ 최소 권한 원칙 (필요한 권한만 부여)

## 향후 권장사항

1. **SSH 키 사용** (더 안전)
   ```bash
   git remote set-url origin git@github.com:robotplay/physicalairobotplay.git
   ```

2. **환경 변수 사용**
   - 토큰을 환경 변수로 관리
   - `.env` 파일에 저장 (Git에 커밋하지 않기)

3. **Git Credential Helper**
   - macOS Keychain 사용
   - 토큰을 안전하게 저장

