# 포트원 Channel PG 설정 가이드 (HTML5_INICIS 에러 해결)

## 🔍 문제 원인

**에러 메시지:**
- "HTML5_INICIS 에 대해 지원하지 않는 기능입니다"
- "payMethod는 필수 파라미터입니다"

**원인:**
- 포트원 Channel의 PG(Payment Gateway) 설정이 HTML5_INICIS로 되어 있음
- macOS에서는 HTML5_INICIS가 지원되지 않음
- Channel의 PG를 일반 카드 결제 방식으로 변경해야 함

---

## ✅ 해결 방법: 포트원 대시보드에서 Channel PG 설정 변경

### 1단계: 포트원 대시보드 접속

1. **포트원 대시보드 접속**
   - https://admin.portone.io 접속
   - 로그인

2. **Store 선택**
   - Store ID: `store-c7408361-d836-4e72-b76c-e328a4e3c119`

### 2단계: Channel PG 설정 확인 및 변경

1. **"Channels" 또는 "결제 채널" 메뉴 클릭**

2. **Channel 선택**
   - Channel Key: `channel-key-8d151049-3196-4ed2-b59f-c4c5124c6971`
   - Channel 클릭

3. **PG 설정 확인**
   - Channel의 PG(Payment Gateway) 설정 확인
   - 현재 "HTML5_INICIS" 또는 "이니시스 HTML5"로 설정되어 있을 수 있음

4. **PG 변경 (필요한 경우)**
   - **"PG 설정" 또는 "결제 게이트웨이" 메뉴 클릭**
   - **일반 카드 결제 방식 선택:**
     - "일반 결제" 또는 "표준 결제"
     - "PG_PROVIDER_INICIS" (HTML5가 아닌 일반 방식)
     - 또는 다른 macOS 호환 PG 선택

5. **설정 저장**

### 3단계: Channel 재생성 (대안)

PG 설정을 변경할 수 없다면 Channel을 재생성하세요:

1. **기존 Channel 삭제**
   - Channel 옆 "Delete" 클릭
   - 확인

2. **새 Channel 생성**
   - "+ Channel 추가" 또는 "+ 결제 채널 추가" 클릭
   - 결제 수단: "신용카드" 또는 "CARD"
   - **PG 선택:**
     - "일반 결제" 또는 "표준 결제" 선택
     - **HTML5_INICIS가 아닌 일반 결제 방식 선택**
   - Channel 생성 완료

3. **새 Channel Key 복사**
   - 생성된 Channel의 "Channel Key" 복사

4. **`.env.local` 파일 업데이트**
   ```env
   NEXT_PUBLIC_PORTONE_CHANNEL_KEY=새로운_Channel_Key
   ```

---

## 🔧 코드 수정 완료

다음 수정이 완료되었습니다:

1. ✅ `payMethod: 'CARD'` 추가 (필수 파라미터)
2. ✅ `currency: 'CURRENCY_KRW'` 형식으로 변경
3. ✅ 포트원 SDK v2 표준 형식 사용

**수정된 코드:**
```typescript
const response = await portone.requestPayment({
    storeId: storeId,
    channelKey: channelKey,
    paymentId: paymentId,
    orderName: orderName,
    totalAmount: amount,
    currency: 'CURRENCY_KRW',
    payMethod: 'CARD', // 필수 파라미터
    customer: {
        fullName: customerName,
        email: customerEmail,
        phoneNumber: customerPhone,
    },
    // ...
});
```

---

## 🧪 테스트

1. **포트원 대시보드에서 Channel PG 설정 확인/변경**

2. **신청 페이지 접속**
   ```
   http://localhost:3000/program/airplane
   ```

3. **신청서 작성 및 제출**

4. **결제 버튼 클릭**

5. **결제 창 확인**
   - macOS에서 지원되는 결제 방식으로 결제 창이 열려야 함
   - HTML5_INICIS 에러가 발생하지 않아야 함

---

## ⚠️ 중요 사항

### macOS 호환 PG 설정

포트원 대시보드에서 Channel의 PG를 다음 중 하나로 설정해야 합니다:

- ✅ **일반 결제** (표준 방식)
- ✅ **PG_PROVIDER_INICIS** (HTML5가 아닌 일반 방식)
- ✅ **다른 macOS 호환 PG**

### 지원되지 않는 설정

- ❌ **HTML5_INICIS** (macOS에서 지원되지 않음)
- ❌ **이니시스 HTML5**

---

## 📞 다음 단계

1. 포트원 대시보드에서 Channel PG 설정 확인
2. 필요하면 Channel PG를 일반 결제 방식으로 변경
3. 또는 Channel을 재생성하여 macOS 호환 PG 선택
4. 결제 테스트

**Channel PG 설정을 변경한 후 다시 테스트해보세요!**
