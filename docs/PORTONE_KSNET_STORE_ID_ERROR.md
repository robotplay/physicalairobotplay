# 포트원 KSNET Store ID 오류 해결 가이드

## 🔍 문제

**에러 메시지:**
```
ERROR: 상점아이디오류 sndStoreid (store-c7408361-d836-4e72-b76c-e328a4e3c119)!!
```

**원인:**
- KSNET Channel에서 포트원 Store ID가 아닌 **KSNET 상점아이디(MID)**가 필요함
- KSNET Channel 설정 시 KSNET에서 발급받은 상점아이디(MID)를 입력해야 함
- 또는 Channel이 다른 Store에 연결되어 있을 수 있음

---

## ✅ 해결 방법

### 방법 1: 포트원 대시보드에서 KSNET Channel 설정 확인 및 수정 (권장)

#### 1단계: 포트원 대시보드 접속
1. https://admin.portone.io 접속
2. 로그인

#### 2단계: Store 및 Channel 확인
1. **Store 선택**
   - Store ID: `store-c7408361-d836-4e72-b76c-e328a4e3c119`

2. **Channels 메뉴 클릭**

3. **KSNET Channel 확인**
   - Channel Key: `channel-key-c499bd34-6e6a-40f3-93f2-54d9966ee46b`
   - Channel 클릭하여 상세 정보 확인

#### 3단계: KSNET 상점아이디(MID) 설정 확인
1. **Channel 상세 페이지에서 "PG 설정" 또는 "결제 게이트웨이 설정" 확인**

2. **KSNET 상점아이디(MID) 확인**
   - KSNET에서 발급받은 상점아이디가 입력되어 있는지 확인
   - 테스트 모드라면 테스트용 MID 사용 가능

3. **KSNET 상점아이디가 없다면:**
   - **KSNET 계약 필요**: KSNET과 직접 계약하여 상점아이디 발급 필요
   - 또는 **다른 PG 사용**: KSNET 대신 다른 PG로 Channel 변경

#### 4단계: KSNET 상점아이디 입력 (있는 경우)
1. **Channel의 "PG 설정" 메뉴 클릭**
2. **"KSNET 상점아이디" 또는 "MID" 입력란 확인**
3. **KSNET에서 발급받은 상점아이디 입력**
   - 테스트 모드: `2999199999` (테스트용 MID)
   - 실운영 모드: KSNET에서 발급받은 실제 MID
4. **API Key도 함께 입력** (KSNET에서 제공)
5. **설정 저장**

---

### 방법 2: 다른 PG로 Channel 변경 (KSNET 계약이 없는 경우)

KSNET 계약이 없다면 다른 PG로 Channel을 변경하세요:

#### 옵션 A: 기존 Channel의 PG 변경
1. **Channel 상세 페이지 → "PG 설정" 메뉴**
2. **다른 PG 선택:**
   - TOSSPAYMENTS (토스페이먼츠)
   - KCP
   - NICE
   - INICIS (HTML5가 아닌 일반 방식)
3. **해당 PG의 상점아이디 및 API Key 입력**
4. **설정 저장**

#### 옵션 B: 새 Channel 생성
1. **기존 Channel 삭제**
2. **새 Channel 생성**
   - 결제 수단: "신용카드"
   - PG 선택: TOSSPAYMENTS, KCP, NICE 등
   - 해당 PG의 상점아이디 및 API Key 입력
3. **새 Channel Key 복사**
4. **`.env.local` 파일 업데이트**

---

### 방법 3: 코드에서 pgProvider 제거 (임시 해결책)

코드에서 `pgProvider`를 제거하여 Channel 설정에 맡기는 방법입니다:

**수정된 코드:**
```typescript
const response = await portone.requestPayment({
    storeId: storeId,
    channelKey: channelKey,
    paymentId: paymentId,
    orderName: orderName,
    totalAmount: amount,
    currency: 'CURRENCY_KRW',
    payMethod: 'CARD',
    // pgProvider 제거 - Channel 설정에 따라 자동으로 PG 선택
    customer: {
        fullName: customerName,
        email: customerEmail,
        phoneNumber: customerPhone,
    },
    // ...
});
```

이 방법은 Channel이 올바르게 설정되어 있을 때만 작동합니다.

---

## 🧪 테스트

### 1단계: 포트원 대시보드에서 설정 확인
- KSNET Channel의 상점아이디(MID) 설정 확인
- 또는 다른 PG로 변경

### 2단계: 개발 서버 재시작
```bash
npm run dev
```

### 3단계: 결제 테스트
1. `http://localhost:3000/program/airplane` 접속
2. 신청서 작성 및 제출
3. 결제 버튼 클릭
4. 결제 창 확인

---

## ⚠️ 중요 사항

### KSNET 사용 시 필요 사항
1. **KSNET 계약**: KSNET과 직접 계약하여 상점아이디 발급 필요
2. **상점아이디(MID)**: KSNET에서 발급받은 MID
3. **API Key**: KSNET에서 제공한 API Key

### 테스트 모드
- 테스트 모드에서는 테스트용 MID 사용 가능 (예: `2999199999`)
- 테스트 결제는 매일 23:00~23:50 사이에 자동 취소됨

### 실운영 모드
- KSNET에서 발급받은 실제 상점아이디와 API Key 사용 필요

---

## 📞 다음 단계

1. **포트원 대시보드에서 KSNET Channel 설정 확인**
   - KSNET 상점아이디(MID)가 설정되어 있는지 확인
   - 없다면 KSNET 계약 필요 또는 다른 PG로 변경

2. **KSNET 계약이 없다면:**
   - 다른 PG로 Channel 변경 (TOSSPAYMENTS, KCP, NICE 등)
   - 또는 포트원 고객센터에 문의

3. **설정 완료 후 결제 테스트**

---

## 💡 권장 사항

**KSNET 계약이 없다면:**
- **TOSSPAYMENTS** 사용 권장 (설정이 간단하고 macOS 호환성 우수)
- 또는 **KCP**, **NICE** 등 다른 PG 사용

**포트원 대시보드에서 Channel의 PG를 변경한 후 다시 테스트해보세요!**









