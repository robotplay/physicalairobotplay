# MongoDB Atlas Database & Network Access 설정 가이드

## 📍 현재 위치

**MongoDB Atlas → Security → Database & Network Access**

이 메뉴에서 네트워크 액세스 설정을 확인하고 수정할 수 있습니다.

---

## ✅ 네트워크 액세스 설정 확인

### Step 1: Network Access 메뉴로 이동

1. **"Database & Network Access" 클릭** (현재 선택된 메뉴)
2. **상단 탭에서 "Network Access" 클릭**
   - 또는 왼쪽 메뉴에서 "Network Access" 선택

### Step 2: IP 주소 목록 확인

**현재 설정된 IP 주소 목록이 표시됩니다.**

**확인 사항:**
- `0.0.0.0/0` (모든 IP 허용)이 있는지 확인
- 특정 IP 주소만 허용되어 있는지 확인
- IP 주소가 없는지 확인

---

## 🔧 네트워크 액세스 설정 방법

### 방법 1: 모든 IP 허용 (개발/테스트용, 권장)

**Vercel은 동적 IP를 사용하므로 모든 IP를 허용하는 것이 가장 간단합니다.**

1. **"Add IP Address" 버튼 클릭**

2. **IP 주소 입력:**
   - **"Allow Access from Anywhere" 버튼 클릭** (권장)
   - 또는 IP 주소에 `0.0.0.0/0` 입력
   - Comment: `Vercel deployment` (선택사항)

3. **"Confirm" 클릭**

4. **설정 완료 확인:**
   - IP 주소 목록에 `0.0.0.0/0` 추가됨
   - 상태가 "Active"로 표시됨

### 방법 2: 특정 IP만 허용 (프로덕션용)

**보안이 중요한 경우 특정 IP만 허용할 수 있습니다.**

1. **"Add IP Address" 버튼 클릭**

2. **IP 주소 입력:**
   - "Add Current IP Address" 클릭 (현재 IP 자동 추가)
   - 또는 IP 주소를 직접 입력 (예: `123.456.789.0/24`)
   - Comment: `Production server` (선택사항)

3. **"Confirm" 클릭**

**⚠️ 주의:**
- Vercel은 동적 IP를 사용하므로 특정 IP만 허용하면 문제가 발생할 수 있습니다
- 프로덕션 환경에서도 `0.0.0.0/0`을 사용하는 것이 일반적입니다

---

## 🔍 현재 설정 확인

### Network Access 페이지에서 확인:

**표시되는 정보:**
- IP 주소 또는 CIDR 블록
- 상태 (Active/Inactive)
- 마지막 업데이트 시간
- Comment (설명)

**정상적인 설정:**
- `0.0.0.0/0` (모든 IP 허용) - ✅ 권장
- 상태: Active
- Comment: Vercel deployment (선택사항)

---

## ⚠️ 문제 해결

### 문제 1: IP 주소가 없는 경우

**증상:**
- IP 주소 목록이 비어있음
- 연결이 안 됨

**해결:**
- "Add IP Address" → "Allow Access from Anywhere" 클릭
- `0.0.0.0/0` 추가

### 문제 2: 특정 IP만 허용되어 있는 경우

**증상:**
- 특정 IP 주소만 허용됨
- Vercel에서 연결이 안 됨 (동적 IP 때문)

**해결:**
- "Add IP Address" → "Allow Access from Anywhere" 클릭
- `0.0.0.0/0` 추가
- 또는 기존 IP 주소 삭제 후 `0.0.0.0/0` 추가

### 문제 3: IP 주소가 비활성화된 경우

**증상:**
- IP 주소가 있지만 상태가 "Inactive"

**해결:**
- IP 주소 옆 "..." 메뉴 → "Edit" 클릭
- 상태를 "Active"로 변경
- 또는 IP 주소 삭제 후 다시 추가

---

## 📋 체크리스트

### Network Access 설정:

- [ ] "Network Access" 메뉴로 이동 완료
- [ ] IP 주소 목록 확인 완료
- [ ] `0.0.0.0/0` (모든 IP 허용) 추가 완료
- [ ] 상태가 "Active"인지 확인 완료

### 연결 테스트:

- [ ] 설정 완료 후 재배포 완료
- [ ] `/api/news/test`에서 연결 확인 완료
- [ ] MongoDB Atlas 대시보드에서 연결 안정화 확인

---

## 요약

**"Database & Network Access" 메뉴에서:**

1. ✅ **"Network Access" 탭 클릭**
2. ✅ **"Add IP Address" 클릭**
3. ✅ **"Allow Access from Anywhere" 클릭** (또는 `0.0.0.0/0` 입력)
4. ✅ **"Confirm" 클릭**
5. ✅ **설정 완료 확인**

**핵심:**
- `0.0.0.0/0` (모든 IP 허용) 설정이 필요합니다
- Vercel은 동적 IP를 사용하므로 특정 IP만 허용하면 문제가 발생할 수 있습니다

이 설정을 완료하면 연결 문제가 해결될 가능성이 높습니다!

