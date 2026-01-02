# Personal Access Token 생성 오류 해결

## 문제
"Note has already been taken" 에러 발생

## 원인
동일한 이름의 토큰이 이미 존재합니다.

## 해결 방법

### 방법 1: 다른 이름 사용 (권장)

Note 필드에 다른 이름 입력:
- `academy-site-deploy`
- `MacBook Deploy 2`
- `academy-site-2025`
- `parplay-academy-deploy`
- `MacBook Deploy Jan 2025`

### 방법 2: 기존 토큰 확인 및 삭제

1. https://github.com/settings/tokens 접속
2. 기존 "MacBook Deploy" 토큰 찾기
3. 기존 토큰이 있다면:
   - 삭제 후 새로 생성, 또는
   - 기존 토큰 사용 (토큰 값 확인 필요)

## 권장 이름 예시

```
academy-site-deploy
parplay-deploy-2025
MacBook-Academy-Deploy
academy-site-push
```

## 다음 단계

1. Note 필드에 새로운 이름 입력
2. Expiration: 90 days 선택
3. repo 체크
4. "Generate token" 클릭

