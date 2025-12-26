# 포트원 KSNET Channel 설정 완료

## ✅ Channel Key 업데이트 완료

새로운 KSNET Channel Key로 업데이트되었습니다:

**새 Channel Key:**
```
channel-key-c499bd34-6e6a-40f3-93f2-54d9966ee46b
```

**PG:**
- KSNET (macOS 호환, HTML5_INICIS 문제 해결)

---

## 🔧 변경 사항

### 1. 환경 변수 업데이트 (`.env.local`)

```env
NEXT_PUBLIC_PORTONE_STORE_ID=store-c7408361-d836-4e72-b76c-e328a4e3c119
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=channel-key-c499bd34-6e6a-40f3-93f2-54d9966ee46b
```

### 2. 코드 업데이트 (`components/PaymentButton.tsx`)

```typescript
const response = await portone.requestPayment({
    storeId: storeId,
    channelKey: channelKey,
    paymentId: paymentId,
    orderName: orderName,
    totalAmount: amount,
    currency: 'CURRENCY_KRW',
    payMethod: 'CARD',
    pgProvider: 'KSNET', // KSNET PG 사용 (macOS 호환)
    customer: {
        fullName: customerName,
        email: customerEmail,
        phoneNumber: customerPhone,
    },
    // ...
});
```

---

## 🎯 KSNET PG의 장점

1. ✅ **macOS 호환성**
   - HTML5_INICIS와 달리 macOS에서 완전히 지원됨
   - 크로스 플랫폼 호환성 우수

2. ✅ **안정적인 결제 처리**
   - 검증된 PG 서비스
   - 다양한 결제 수단 지원

3. ✅ **테스트 모드 지원**
   - 현재 테스트 모드로 설정되어 있음
   - 실결제 전 충분한 테스트 가능

---

## 🧪 테스트 방법

### 1단계: 개발 서버 재시작

환경 변수가 변경되었으므로 서버를 재시작해야 합니다:

```bash
# 서버 종료 (Ctrl+C)
# 서버 재시작
npm run dev
```

### 2단계: 결제 테스트

1. **신청 페이지 접속**
   ```
   http://localhost:3000/program/airplane
   ```

2. **신청서 작성 및 제출**

3. **결제 버튼 클릭**

4. **결제 창 확인**
   - KSNET 결제 창이 정상적으로 열려야 함
   - HTML5_INICIS 에러가 발생하지 않아야 함
   - macOS에서 정상 작동해야 함

---

## ✅ 예상 결과

- ✅ HTML5_INICIS 에러 해결
- ✅ macOS에서 정상 작동
- ✅ 결제 창 정상 표시
- ✅ 결제 프로세스 완료 가능

---

## 📞 문제 발생 시

만약 여전히 문제가 발생한다면:

1. **개발 서버 재시작 확인**
   - 환경 변수 변경 후 반드시 서버 재시작 필요

2. **포트원 대시보드 확인**
   - Channel이 활성화되어 있는지 확인
   - KSNET PG 설정이 올바른지 확인

3. **브라우저 콘솔 확인**
   - 개발자 도구(F12) → Console 탭
   - 에러 메시지 확인

---

## 🎉 완료!

새로운 KSNET Channel Key로 설정이 완료되었습니다. 
개발 서버를 재시작한 후 결제 테스트를 진행하세요!





