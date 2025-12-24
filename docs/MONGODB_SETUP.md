# MongoDB Atlas 설정 가이드

## 개요

신청서 데이터를 영구적으로 저장하기 위해 MongoDB Atlas를 사용합니다.

## 1. MongoDB Atlas 계정 생성

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) 접속
2. 무료 계정 생성 (Free Tier - M0 클러스터)
3. 이메일 인증 완료

## 2. 클러스터 생성

1. **"Build a Database"** 클릭
2. **"M0 FREE"** 선택 (무료 티어)
3. 클라우드 제공자 및 리전 선택 (가장 가까운 지역 선택)
4. 클러스터 이름 설정 (예: `academy-cluster`)
5. **"Create"** 클릭

## 3. 데이터베이스 사용자 생성

1. **"Database Access"** 메뉴 클릭
2. **"Add New Database User"** 클릭
3. 인증 방법: **Password** 선택
4. 사용자 이름과 비밀번호 설정 (기억해두세요!)
5. 권한: **"Atlas admin"** 또는 **"Read and write to any database"** 선택
6. **"Add User"** 클릭

## 4. 네트워크 액세스 설정

1. **"Network Access"** 메뉴 클릭
2. **"Add IP Address"** 클릭
3. **"Allow Access from Anywhere"** 선택 (또는 특정 IP 입력)
   - 개발 환경: `0.0.0.0/0` (모든 IP 허용)
   - 프로덕션: Vercel IP 또는 특정 IP만 허용
4. **"Confirm"** 클릭

## 5. 연결 문자열 가져오기

1. **"Database"** 메뉴로 돌아가기
2. 클러스터 옆 **"Connect"** 버튼 클릭
3. **"Connect your application"** 선택
4. Driver: **Node.js**, Version: **5.5 or later** 선택
5. 연결 문자열 복사 (예: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

## 6. 환경 변수 설정

`.env.local` 파일에 다음 변수를 추가하세요:

```env
# MongoDB Atlas 연결 문자열
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# 데이터베이스 이름 (선택사항, 기본값: academy-site)
MONGODB_DB_NAME=academy-site
```

**중요:** 
- `username`과 `password`를 실제 생성한 사용자 정보로 교체하세요
- 클러스터 주소(`cluster0.xxxxx.mongodb.net`)도 실제 주소로 교체하세요
- `.env.local` 파일은 절대 Git에 커밋하지 마세요!

## 7. 연결 테스트

개발 서버를 재시작하고 신청서를 제출해보세요:

```bash
npm run dev
```

브라우저 콘솔에서 다음 메시지를 확인할 수 있습니다:
- `✅ MongoDB 저장 성공: [ObjectId]` - 성공
- `❌ MongoDB 저장 실패: [에러]` - 실패 (연결 문자열 확인 필요)

## 8. MongoDB Atlas에서 데이터 확인

1. MongoDB Atlas 대시보드 접속
2. **"Database"** 메뉴 클릭
3. **"Browse Collections"** 클릭
4. `academy-site` 데이터베이스 → `airplane_registrations` 컬렉션 확인
5. 신청서 데이터가 저장되어 있는지 확인

## 문제 해결

### 연결 오류가 발생하는 경우

1. **연결 문자열 확인**
   - 사용자 이름과 비밀번호가 올바른지 확인
   - 특수문자가 있으면 URL 인코딩 필요

2. **네트워크 액세스 확인**
   - IP 주소가 허용 목록에 있는지 확인
   - 개발 환경에서는 `0.0.0.0/0` 사용 가능

3. **환경 변수 확인**
   - `.env.local` 파일이 프로젝트 루트에 있는지 확인
   - 변수 이름이 정확한지 확인 (`MONGODB_URI`)
   - 개발 서버 재시작 필요

### 데이터가 저장되지 않는 경우

1. 브라우저 콘솔에서 에러 메시지 확인
2. MongoDB Atlas 대시보드에서 컬렉션 확인
3. API 라우트 로그 확인

## 다음 단계

MongoDB 연결이 완료되면:
- ✅ 신청서 데이터가 영구적으로 저장됨
- ✅ 관리자 페이지에서 실시간 조회 가능
- ✅ 결제 시스템 연동 준비 완료

## 참고 자료

- [MongoDB Atlas 공식 문서](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js 드라이버](https://docs.mongodb.com/drivers/node/)

















