# MongoDB 연결 문제 해결 가이드

## 🔴 현재 문제

```
DNS 조회 실패: academy-cluster.eekhbti.mongodb.net → 찾을 수 없음
인증 실패: MongoServerError (code 8000)
```

## 📋 해결 단계

### 1. MongoDB Atlas 접속

1. https://cloud.mongodb.com 접속
2. 로그인

### 2. 클러스터 상태 확인

#### 옵션 A: 클러스터가 존재하는 경우

1. **Database** 메뉴 클릭
2. 클러스터 이름 확인 (예: `Cluster0`)
3. **Connect** 버튼 클릭
4. **Connect your application** 선택
5. Driver: **Node.js** 선택
6. Version: **5.5 or later** 선택
7. 연결 문자열 복사:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### 옵션 B: 클러스터가 없는 경우 (새로 생성)

1. **Database** 메뉴에서 **Build a Database** 클릭
2. **Shared** (FREE) 선택
3. Provider: **AWS** 선택
4. Region: **Seoul (ap-northeast-2)** 또는 가장 가까운 지역
5. Cluster Name: `academy-cluster` 입력
6. **Create** 클릭 (약 3-5분 소요)

### 3. 데이터베이스 사용자 생성/확인

1. **Database Access** 메뉴 클릭
2. **Add New Database User** 클릭
3. 사용자 정보 입력:
   - Username: `academy-admin`
   - Password: **강력한 비밀번호 생성** (특수문자 포함 시 URL 인코딩 필요)
   - Database User Privileges: **Read and write to any database**
4. **Add User** 클릭

**⚠️ 비밀번호 특수문자 URL 인코딩:**
```
@ → %40
# → %23
$ → %24
% → %25
^ → %5E
& → %26
```

예: `Pass@word#123` → `Pass%40word%23123`

### 4. 네트워크 액세스 설정

1. **Network Access** 메뉴 클릭
2. **Add IP Address** 클릭
3. **Allow Access from Anywhere** 선택 (0.0.0.0/0)
   - 또는 Vercel IP 추가
4. **Confirm** 클릭

### 5. 연결 문자열 구성

최종 연결 문자열 형식:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

예시:
```
mongodb+srv://academy-admin:SecurePass123@cluster0.ab1cd.mongodb.net/academy-site?retryWrites=true&w=majority
```

**중요:**
- `<username>`: 실제 사용자 이름
- `<password>`: URL 인코딩된 비밀번호
- `<cluster>`: 실제 클러스터 주소
- `<database>`: `academy-site`

### 6. 환경 변수 업데이트

#### Vercel 환경 변수

1. https://vercel.com 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables**
4. `MONGODB_URI` 찾기 → **Edit**
5. 새 연결 문자열 입력
6. **Save** 클릭
7. **Redeploy** 필요 (자동으로 안 될 수 있음)

#### 로컬 환경 변수 (.env.local)

```bash
# .env.local
MONGODB_URI=mongodb+srv://academy-admin:SecurePass123@cluster0.ab1cd.mongodb.net/academy-site?retryWrites=true&w=majority
```

### 7. 연결 테스트

#### 방법 1: API 테스트
```bash
curl https://parplay.co.kr/api/test-db
```

성공 응답:
```json
{
  "status": "success",
  "message": "Database connection successful",
  "database": "academy-site"
}
```

#### 방법 2: 관리자 페이지
1. https://parplay.co.kr/admin 접속
2. 로그인
3. "온라인 강좌" 탭 확인
4. 데이터가 로드되면 성공

---

## 🔧 연결 문자열 체크리스트

연결이 안 되면 다음을 확인하세요:

- [ ] 사용자 이름이 정확한가?
- [ ] 비밀번호가 URL 인코딩되었는가?
- [ ] 클러스터 주소가 정확한가?
- [ ] 데이터베이스 이름이 `academy-site`인가?
- [ ] Network Access에서 IP가 허용되었는가?
- [ ] 사용자 권한이 "Read and write"인가?

---

## 📞 지원이 필요하면

새 연결 문자열을 복사해서 알려주세요. `.env.local` 파일을 업데이트하고 테스트하겠습니다.

현재 연결 문자열 (마스킹):
```
mongodb+srv://academy-admin:****@academy-cluster.eekhbti.mongodb.net/academy-site?retryWrites=true&w=majority
```

새 연결 문자열 형식:
```
mongodb+srv://<user>:<password>@<cluster>.mongodb.net/academy-site?retryWrites=true&w=majority
```

