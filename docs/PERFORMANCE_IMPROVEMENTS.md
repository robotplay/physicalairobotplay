# 성능 개선 가이드

## 📊 개선 항목

### 1. ✅ MongoDB 인덱스 생성

**목적**: 자주 조회되는 필드에 인덱스를 추가하여 쿼리 성능 향상

**실행 방법**:

```bash
# 방법 1: Node.js 스크립트 실행
node scripts/create-indexes.js

# 방법 2: MongoDB Atlas에서 직접 실행
# MongoDB Atlas → Database → Browse Collections → 각 컬렉션에서 인덱스 생성

# 방법 3: MongoDB Compass에서 실행
# Compass → Database → Collection → Indexes 탭 → Create Index
```

**생성되는 인덱스**:

- **users**: `username`, `email`, `role`
- **students**: `studentId`, `parentPhone`, `parentEmail`, `name`, `grade`, `class`
- **attendance**: `studentId`, `classDate`, `studentClass`
- **online_enrollments**: `accessCode` (unique), `email`, `courseId`
- **news**: `category`, `createdAt`, `isPublished`
- **payments**: `paymentId`, `orderId`, `customerEmail`, `status`, `timestamp`
- **faq**: `category`, `order`, `isActive`
- **monthly_newsletters**: `year`, `month`
- **student_feedback**: `studentId`, `date`
- **competitions**: `year`, `month`

**예상 성능 향상**:
- 학생 조회: **10-100배** 빠름
- 출석 조회: **5-50배** 빠름
- 검색 쿼리: **3-20배** 빠름

---

### 2. ✅ API 응답 캐싱

**목적**: 정적 데이터나 자주 변경되지 않는 데이터에 캐싱 적용

**적용된 API**:

#### 공개 API (캐싱 가능)
- `GET /api/faq` - FAQ 목록 (1시간 캐시)
- `GET /api/online-courses` - 온라인 강좌 목록 (30분 캐시)
- `GET /api/news` - 공지사항 목록 (10분 캐시)
- `GET /api/news/[id]` - 공지사항 상세 (1시간 캐시)
- `GET /api/online-courses/[id]` - 강좌 상세 (1시간 캐시)

#### 인증 필요 API (캐싱 제한)
- `GET /api/analytics` - 분석 데이터 (캐싱 없음, 실시간 필요)
- `GET /api/students` - 학생 목록 (캐싱 없음, 실시간 필요)
- `GET /api/attendance` - 출석 기록 (캐싱 없음, 실시간 필요)

**캐싱 전략**:

```typescript
// Next.js Route Handler에서 캐싱 설정
export const revalidate = 3600; // 1시간 (초 단위)

// 또는 동적 캐싱
export async function GET(request: NextRequest) {
    const response = NextResponse.json(data);
    
    // Cache-Control 헤더 설정
    response.headers.set(
        'Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=86400'
    );
    
    return response;
}
```

**예상 성능 향상**:
- API 응답 시간: **50-90%** 감소
- 데이터베이스 부하: **70-95%** 감소
- 사용자 경험: **즉시 로딩** (캐시 히트 시)

---

### 3. ⚠️ 이미지 저장 방식 개선 (선택사항)

**현재 상태**: Base64로 MongoDB에 저장

**문제점**:
- 데이터베이스 크기 증가
- 로딩 속도 저하
- 큰 이미지 처리 어려움

**개선 방안**:

#### 옵션 1: Vercel Blob Storage (권장)

**장점**:
- Vercel 네이티브 서비스
- 빠른 CDN 제공
- 무료 플랜 제공 (100GB 저장, 1TB 전송)

**설정 방법**:

```bash
# 패키지 설치
npm install @vercel/blob
```

```typescript
// app/api/news/upload/route.ts 수정
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Vercel Blob에 업로드
    const blob = await put(file.name, file, {
        access: 'public',
    });
    
    return NextResponse.json({
        success: true,
        path: blob.url, // CDN URL 반환
    });
}
```

#### 옵션 2: Cloudinary

**장점**:
- 이미지 최적화 자동
- 무료 플랜 제공 (25GB 저장)
- CDN 제공

**설정 방법**:

```bash
# 패키지 설치
npm install cloudinary
```

```typescript
// app/api/news/upload/route.ts 수정
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Cloudinary에 업로드
    const buffer = await file.arrayBuffer();
    const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: 'academy-site' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(Buffer.from(buffer));
    });
    
    return NextResponse.json({
        success: true,
        path: result.secure_url, // CDN URL 반환
    });
}
```

**예상 성능 향상**:
- 이미지 로딩 속도: **3-10배** 빠름
- 데이터베이스 크기: **70-90%** 감소
- 페이지 로딩 속도: **20-40%** 개선

---

## 🚀 실행 순서

### 즉시 실행 (권장)

1. **MongoDB 인덱스 생성**
   ```bash
   node scripts/create-indexes.js
   ```
   - ⏱️ 소요 시간: 1-2분
   - 📈 성능 향상: 즉시 효과

2. **API 캐싱 적용**
   - 이미 적용됨 (코드에 반영)
   - ⏱️ 소요 시간: 0분 (이미 완료)
   - 📈 성능 향상: 즉시 효과

### 선택적 실행

3. **이미지 CDN 통합**
   - ⏱️ 소요 시간: 1-2시간
   - 📈 성능 향상: 큰 효과
   - 💰 비용: 무료 플랜 사용 가능

---

## 📊 예상 성능 개선 결과

### Before (개선 전)
- 학생 조회: 200-500ms
- 출석 조회: 300-800ms
- 공지사항 로딩: 400-1000ms
- 이미지 로딩: 1-3초

### After (개선 후)
- 학생 조회: **20-50ms** (10배 향상)
- 출석 조회: **30-80ms** (10배 향상)
- 공지사항 로딩: **40-100ms** (10배 향상, 캐시 히트 시)
- 이미지 로딩: **200-500ms** (5배 향상, CDN 사용 시)

---

## ✅ 체크리스트

### 완료된 항목
- [x] MongoDB 인덱스 생성 스크립트 작성
- [x] API 캐싱 전략 문서화
- [x] 이미지 CDN 통합 가이드 작성
- [x] **API 캐싱 적용 완료** ✅
  - `GET /api/faq`: 1시간 캐시 적용됨
  - `GET /api/online-courses`: 30분 캐시 적용됨
  - `GET /api/news`: 10분 캐시 적용됨
  - `GET /api/news/[id]`: 1시간 캐시 적용됨
  - `GET /api/online-courses/[id]`: 1시간 캐시 적용됨
  - 모든 API에 `revalidate` 및 `Cache-Control` 헤더 설정 완료

### 실행 필요
- [ ] **MongoDB 인덱스 생성 실행** ⚠️
  - 스크립트: `scripts/create-indexes.js` 작성 완료
  - 실행 명령: `node scripts/create-indexes.js`
  - 상태: 아직 실행되지 않음 (수동 실행 필요)
- [ ] 이미지 CDN 통합 (선택사항)

---

## 📝 참고 사항

### MongoDB 인덱스 모니터링

인덱스 사용률 확인:
```javascript
// MongoDB Compass 또는 Atlas에서 실행
db.students.aggregate([
    { $indexStats: {} }
])
```

### 캐시 무효화

캐시를 무효화해야 할 때:
```typescript
// Next.js에서
import { revalidatePath } from 'next/cache';

// 특정 경로 재검증
revalidatePath('/api/news');
```

### 이미지 마이그레이션

기존 Base64 이미지를 CDN으로 마이그레이션:
```typescript
// 마이그레이션 스크립트 작성 필요
// Base64 → CDN 업로드 → URL 업데이트
```

---

**작성일**: 2025년 1월 2일  
**상태**: 인덱스 및 캐싱 가이드 완료, 이미지 CDN은 선택사항

