# MongoDB 인증 실패 해결 가이드

## 🔍 문제: "bad auth : authentication failed"

인증 실패가 발생하는 경우, 다음 단계를 순서대로 확인하세요.

---

## ✅ 해결 방법 1: MongoDB Atlas에서 사용자 확인 및 비밀번호 재설정

### 1단계: 사용자 확인
1. MongoDB Atlas 대시보드 접속
2. 왼쪽 사이드바 → **"SECURITY"** → **"Database & Network Access"** 클릭
3. **"Database Users"** 탭 클릭
4. 사용자 목록에서 `hkj5345_db_user` 확인

### 2단계: 비밀번호 재설정 (권장)
1. 사용자 옆 **"Edit"** (연필 아이콘) 클릭
2. **"Password"** 섹션에서:
   - **"Edit Password"** 클릭
   - **새 비밀번호 입력** (특수문자 없는 간단한 비밀번호 권장)
     - 예: `Academy2025` 또는 `MongoDB123`
   - 비밀번호를 **반드시 기록**해두세요!
3. **"Update User"** 클릭

### 3단계: 연결 문자열 업데이트
`.env.local` 파일에서 연결 문자열을 새 비밀번호로 업데이트:

```env
MONGODB_URI=mongodb+srv://hkj5345_db_user:새비밀번호@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster
```

**특수문자가 없는 비밀번호를 사용하면 URL 인코딩이 필요 없습니다!**

---

## ✅ 해결 방법 2: 새 사용자 생성 (특수문자 없는 비밀번호)

### 1단계: 새 사용자 생성
1. **"Database & Network Access"** → **"Database Users"** 탭
2. **"+ ADD NEW DATABASE USER"** 클릭
3. 인증 방법: **"Password"** 선택
4. 사용자 이름: `academy-admin` (또는 원하는 이름)
5. 비밀번호: **특수문자 없는 비밀번호** 입력
   - 예: `Academy2025` 또는 `MongoDB123`
   - ⚠️ **비밀번호를 반드시 기록**해두세요!
6. 권한: **"Atlas admin"** 선택
7. **"Add User"** 클릭

### 2단계: 연결 문자열 업데이트
`.env.local` 파일 업데이트:

```env
MONGODB_URI=mongodb+srv://academy-admin:Academy2025@academy-cluster.eekhbti.mongodb.net/?appName=academy-cluster
```

---

## ✅ 해결 방법 3: URL 인코딩 확인

비밀번호에 특수문자가 있는 경우, 다음 문자들을 URL 인코딩해야 합니다:

| 특수문자 | URL 인코딩 |
|---------|-----------|
| `!` | `%21` |
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `*` | `%2A` |
| `(` | `%28` |
| `)` | `%29` |
| `+` | `%2B` |
| `,` | `%2C` |
| `/` | `%2F` |
| `:` | `%3A` |
| `;` | `%3B` |
| `=` | `%3D` |
| `?` | `%3F` |
| `[` | `%5B` |
| `]` | `%5D` |

**예시:**
- 비밀번호: `!207515Hss`
- URL 인코딩: `%21207515Hss`
- 연결 문자열: `mongodb+srv://hkj5345_db_user:%21207515Hss@academy-cluster.eekhbti.mongodb.net/...`

---

## 🔍 확인 사항 체크리스트

- [ ] MongoDB Atlas에서 사용자가 존재하는지 확인
- [ ] 사용자 이름이 정확한지 확인 (`hkj5345_db_user`)
- [ ] 비밀번호가 정확한지 확인
- [ ] 비밀번호에 특수문자가 있으면 URL 인코딩 적용
- [ ] `.env.local` 파일이 프로젝트 루트에 있는지 확인
- [ ] 개발 서버를 재시작했는지 확인
- [ ] Network Access에서 IP가 허용되었는지 확인 (`0.0.0.0/0`)

---

## 💡 권장 사항

**가장 쉬운 해결 방법:**
1. MongoDB Atlas에서 사용자 비밀번호를 **특수문자 없는 간단한 비밀번호**로 재설정
2. 예: `Academy2025` 또는 `MongoDB123`
3. `.env.local` 파일에서 연결 문자열 업데이트
4. 개발 서버 재시작
5. 테스트

이렇게 하면 URL 인코딩 문제를 완전히 피할 수 있습니다!

---

## 📞 다음 단계

비밀번호를 재설정한 후:
1. `.env.local` 파일 업데이트
2. 개발 서버 재시작: `npm run dev`
3. 테스트: `http://localhost:3000/api/test-db`

성공하면 다음 단계로 진행할 수 있습니다!
