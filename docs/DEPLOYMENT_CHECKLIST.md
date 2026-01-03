# 배포 체크리스트

## 로컬 변경사항을 프로덕션에 반영하는 방법

### 1단계: 변경사항 확인
```bash
git status
```

### 2단계: 모든 변경사항 스테이징
```bash
git add .
```

### 3단계: 커밋
```bash
git commit -m "공지사항 상세 페이지 추가, 이미지 업로드 기능, MongoDB 연동 완료"
```

### 4단계: GitHub에 푸시
```bash
git push origin main
```

### 5단계: Vercel 자동 배포 확인
- Vercel은 GitHub의 main 브랜치에 푸시되면 자동으로 배포를 시작합니다
- 배포 완료까지 약 2-3분 소요
- Vercel 대시보드에서 배포 상태 확인 가능

---

## 문제 해결

### 변경사항이 반영되지 않는 경우

1. **Git 푸시 확인**
   ```bash
   git log --oneline -3
   git remote -v
   ```

2. **Vercel 배포 상태 확인**
   - https://vercel.com 접속
   - 프로젝트 선택
   - Deployments 탭에서 최신 배포 확인
   - 빌드 에러가 있는지 확인

3. **수동 재배포**
   - Vercel 대시보드 → Deployments
   - 최신 배포의 "..." 메뉴 클릭
   - "Redeploy" 선택

4. **브라우저 캐시 클리어**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)
   - 또는 시크릿 모드로 테스트

---

## 주요 변경사항 (최근)

- ✅ 공지사항 상세 페이지 (`/news/[id]`)
- ✅ 이미지 업로드 기능 (`/api/news/upload`)
- ✅ MongoDB 공지사항 CRUD API
- ✅ 관리자 페이지 공지사항 관리 탭
- ✅ 이미지 비율 수정 (object-contain)
- ✅ 커리큘럼 로드맵 강화
- ✅ Next.js 16 params 처리 수정






