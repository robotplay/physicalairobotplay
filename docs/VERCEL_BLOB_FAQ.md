# Vercel Blob Storage FAQ

## ❓ 자주 묻는 질문

### Q1: 토큰을 알려줘야 하나요?

**A: 아니요, 알려줄 필요 없습니다.**

- ✅ **Vercel 환경 변수에 설정되어 있으면 자동으로 사용됩니다**
- ✅ 코드에서 `process.env.BLOB_READ_WRITE_TOKEN`으로 자동 읽어옵니다
- ✅ 토큰 값은 **절대 공개하지 마세요** (보안상 위험)

**작동 원리**:
```typescript
// app/api/news/upload/route.ts
const USE_BLOB_STORAGE = process.env.BLOB_READ_WRITE_TOKEN ? true : false;
// 환경 변수가 있으면 자동으로 Blob Storage 사용
```

---

### Q2: 환경 변수가 설정되어 있는지 어떻게 확인하나요?

**A: Vercel 대시보드에서 확인하세요.**

1. **Vercel 대시보드 → Settings → Environment Variables**
2. `BLOB_READ_WRITE_TOKEN`이 목록에 있는지 확인
3. ✅ **있으면**: 설정 완료, 추가 작업 불필요
4. ❌ **없으면**: 수동으로 추가 필요

---

### Q3: 로컬 개발 환경에서도 사용하려면?

**A: `.env.local` 파일에 추가하세요 (선택사항).**

```bash
# .env.local 파일에 추가
BLOB_READ_WRITE_TOKEN=your_token_here
```

**주의사항**:
- `.env.local`은 `.gitignore`에 포함되어 있어야 합니다
- 토큰 값은 절대 Git에 커밋하지 마세요
- 로컬 테스트가 필요할 때만 추가하세요

---

### Q4: 토큰 값은 어디서 확인하나요?

**A: Vercel 대시보드에서 확인하세요.**

1. **Settings → Environment Variables**
   - `BLOB_READ_WRITE_TOKEN` 값 확인 (마스킹되어 있을 수 있음)

2. **Vercel CLI 사용** (로컬 개발용)
   ```bash
   vercel env pull .env.local
   # .env.local 파일에서 토큰 확인
   ```

3. **Storage 페이지**
   - Storage 탭 → Blob Storage 클릭
   - 연결 정보 또는 토큰 확인 (UI에 따라 다를 수 있음)

---

### Q5: 환경 변수가 있는데도 Base64로 fallback되는 경우

**A: 재배포가 필요할 수 있습니다.**

1. **재배포 확인**
   - Vercel 대시보드 → Deployments
   - 최근 배포가 환경 변수 추가 후인지 확인
   - 아니면 "Redeploy" 클릭

2. **환경 변수 확인**
   - Production, Preview, Development 모두 설정되었는지 확인
   - 값이 올바른지 확인

3. **Storage 연결 확인**
   - Storage 탭에서 Blob Storage가 프로젝트에 연결되었는지 확인

---

### Q6: 토큰을 공개 저장소에 커밋하면 안 되나요?

**A: 절대 안 됩니다!**

- ❌ **Git에 커밋하면 안 됩니다**
- ❌ **공개 저장소에 올리면 안 됩니다**
- ✅ **Vercel 환경 변수로만 관리하세요**
- ✅ `.env.local`은 `.gitignore`에 포함되어 있어야 합니다

**보안 위험**:
- 토큰이 노출되면 누구나 Blob Storage에 접근할 수 있습니다
- 이미지 삭제, 수정, 무단 업로드 가능
- 비용 발생 가능

---

### Q7: Base64와 Blob Storage의 차이는?

**A: 성능과 저장 방식의 차이입니다.**

| 항목 | Base64 | Blob Storage |
|------|--------|--------------|
| 저장 위치 | MongoDB 문서 내 | Vercel CDN |
| 로딩 속도 | 1-3초 | 200-500ms |
| 데이터베이스 크기 | 큼 | 작음 (URL만) |
| CDN 캐싱 | 없음 | 있음 |
| 비용 | 데이터베이스 비용 증가 | 무료 플랜 사용 가능 |

---

### Q8: 기존 Base64 이미지는 어떻게 되나요?

**A: 그대로 작동합니다.**

- ✅ 기존 Base64 이미지는 그대로 표시됩니다
- ✅ 새로운 이미지만 Blob Storage에 저장됩니다
- ✅ 자동 마이그레이션은 없습니다 (선택사항)

**마이그레이션 (선택사항)**:
- 필요 시 기존 Base64 이미지를 Blob Storage로 전환할 수 있습니다
- 스크립트 작성 필요 (현재는 제공되지 않음)

---

## 📝 요약

1. **토큰 알려줄 필요 없음**: 환경 변수에 설정되어 있으면 자동 사용
2. **보안 주의**: 토큰 값은 절대 공개하지 마세요
3. **재배포 필요**: 환경 변수 추가 후 재배포 필요
4. **기존 이미지 호환**: Base64 이미지는 그대로 작동

---

**작성일**: 2025년 1월 2일  
**상태**: FAQ 완료

