# 공지사항 작성 오류 해결 가이드

## 문제 진단

### 1. MongoDB 연결 확인

관리자 페이지의 공지사항 탭에서 **"연결 테스트"** 버튼을 클릭하여 MongoDB 연결 상태를 확인하세요.

또는 브라우저에서 직접 확인:
```
https://parplay.co.kr/api/news/test
```

**정상 응답 예시:**
```json
{
  "success": true,
  "hasMongoUri": true,
  "dbConnected": true,
  "collectionExists": true,
  "newsCount": 0,
  "message": "MongoDB 연결이 정상입니다."
}
```

### 2. Vercel 환경 변수 확인

**필수 환경 변수:**
- `MONGODB_URI` - MongoDB 연결 문자열
- `MONGODB_DB_NAME` - 데이터베이스 이름 (선택, 기본값: academy-site)

**확인 방법:**
1. Vercel 대시보드 접속
2. 프로젝트 선택
3. Settings → Environment Variables
4. `MONGODB_URI`가 설정되어 있는지 확인

### 3. 공지사항 작성 시 에러 확인

**브라우저 개발자 도구 확인:**
1. F12 또는 Cmd+Option+I (Mac)로 개발자 도구 열기
2. Console 탭 확인
3. Network 탭에서 `/api/news` 요청 확인
4. 에러 메시지 확인

## 일반적인 문제 및 해결 방법

### 문제 1: "MongoDB가 설정되지 않았습니다" 에러

**원인:** Vercel에 `MONGODB_URI` 환경 변수가 설정되지 않음

**해결:**
1. Vercel 대시보드 → Settings → Environment Variables
2. `MONGODB_URI` 추가
3. 값: MongoDB Atlas 연결 문자열
4. Environment: Production, Preview, Development 모두 체크
5. 저장 후 재배포

### 문제 2: "공지사항을 불러오는데 실패했습니다" 에러

**원인:** MongoDB 연결 문제 또는 네트워크 문제

**해결:**
1. MongoDB Atlas에서 IP 화이트리스트 확인
   - `0.0.0.0/0` (모든 IP 허용) 또는 Vercel IP 추가
2. MongoDB Atlas에서 데이터베이스 사용자 권한 확인
3. 연결 문자열 형식 확인:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

### 문제 3: 공지사항 작성 후 목록에 나타나지 않음

**원인:** 페이지 새로고침이 안 됨

**해결:**
1. 작성 후 자동으로 목록이 새로고침되는지 확인
2. 수동으로 페이지 새로고침 (F5)
3. 브라우저 캐시 클리어

### 문제 4: 이미지 업로드 실패

**원인:** 파일 크기 제한 또는 파일 타입 문제

**해결:**
1. 파일 크기: 5MB 이하 확인
2. 파일 타입: 이미지 파일만 허용 (jpg, png, gif 등)
3. 업로드 후 경로가 자동으로 입력되는지 확인

## 디버깅 단계

### Step 1: 연결 테스트
```
https://parplay.co.kr/api/news/test
```

### Step 2: 공지사항 목록 조회 테스트
```
https://parplay.co.kr/api/news
```

### Step 3: 공지사항 작성 테스트
관리자 페이지에서 간단한 공지사항 작성 시도

### Step 4: 브라우저 콘솔 확인
- 개발자 도구 → Console 탭
- 에러 메시지 확인
- Network 탭에서 API 응답 확인

## 예상되는 에러 메시지

### "MongoDB URI가 설정되지 않았습니다"
→ Vercel 환경 변수에 `MONGODB_URI` 추가 필요

### "MongoDB 연결 실패"
→ MongoDB Atlas 설정 확인 (IP 화이트리스트, 사용자 권한)

### "유효하지 않은 ID입니다"
→ 수정 시 ID가 올바르게 전달되는지 확인

### "카테고리, 제목, 내용은 필수 항목입니다"
→ 폼 입력값 확인

## 빠른 해결 체크리스트

- [ ] Vercel 환경 변수에 `MONGODB_URI` 설정됨
- [ ] MongoDB Atlas IP 화이트리스트 설정됨
- [ ] MongoDB 사용자 권한 확인됨
- [ ] 연결 테스트 API 정상 응답
- [ ] 브라우저 콘솔에 에러 없음
- [ ] 네트워크 탭에서 API 응답 확인

## 문의

문제가 계속되면 다음 정보를 함께 확인해주세요:
1. 브라우저 콘솔 에러 메시지
2. `/api/news/test` 응답 내용
3. 작성하려는 공지사항 내용 (카테고리, 제목, 내용)
