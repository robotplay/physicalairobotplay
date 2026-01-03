# Edge Runtime 경고 해결 가이드

## 경고 메시지

```
⚠ Using edge runtime on a page currently disables static generation for that page
```

## 원인

`app/opengraph-image.tsx` 파일에서 Edge Runtime을 사용하고 있습니다:

```typescript
export const runtime = 'edge';
```

## 이 경고는 문제인가요?

### ❌ 문제가 아닙니다!

이 경고는 **정보성 경고**이며, Open Graph 이미지 생성에는 Edge Runtime이 적합합니다.

**이유:**
- Open Graph 이미지는 동적으로 생성되는 이미지입니다
- Edge Runtime은 이미지 생성에 최적화되어 있습니다
- 정적 생성이 필요하지 않습니다

---

## 해결 방법 (선택사항)

### 방법 1: 경고 무시 (권장)

**이 경고는 무시해도 됩니다.** Open Graph 이미지는 Edge Runtime을 사용하는 것이 일반적이고 권장됩니다.

### 방법 2: Edge Runtime 제거 (선택사항)

만약 경고를 제거하고 싶다면 Edge Runtime을 제거할 수 있습니다:

**수정 전:**
```typescript
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';  // 이 줄 제거
export const alt = 'Physical AI Robot Play';
```

**수정 후:**
```typescript
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

// export const runtime = 'edge';  // 제거됨
export const alt = 'Physical AI Robot Play';
```

**주의:**
- Edge Runtime을 제거하면 Node.js Runtime을 사용합니다
- Open Graph 이미지 생성에는 Edge Runtime이 더 빠를 수 있습니다
- 경고는 사라지지만, 성능이 약간 저하될 수 있습니다

---

## 권장 사항

### ✅ 경고를 무시하는 것을 권장합니다

**이유:**
1. **Open Graph 이미지는 동적 생성**
   - 정적 생성이 필요하지 않습니다
   - Edge Runtime이 적합합니다

2. **성능 최적화**
   - Edge Runtime은 이미지 생성에 최적화되어 있습니다
   - 더 빠른 응답 시간을 제공합니다

3. **일반적인 사용법**
   - Next.js 공식 문서에서도 Edge Runtime 사용을 권장합니다

---

## 요약

| 항목 | 설명 |
|------|------|
| **경고 유형** | 정보성 경고 (문제 아님) |
| **영향** | 없음 (정적 생성이 필요하지 않음) |
| **권장 조치** | 경고 무시 (현재 설정 유지) |
| **선택적 조치** | Edge Runtime 제거 (경고 제거, 성능 약간 저하 가능) |

---

## 결론

**이 경고는 무시해도 됩니다!**

Open Graph 이미지는 Edge Runtime을 사용하는 것이 정상이며, 이 경고는 단순히 정보를 제공하는 것입니다. 현재 설정을 그대로 유지하는 것을 권장합니다.






