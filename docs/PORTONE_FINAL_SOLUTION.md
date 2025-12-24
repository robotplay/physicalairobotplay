# 포트원 HTML5_INICIS 에러 최종 해결 방법

## 🎯 문제

**에러 메시지:**
```
결제 창 호출에 실패하였습니다. 요청을 파싱하는 과정에서 에러가 발생했습니다. 
HTML5_INICIS 에 대해 지원하지 않는 기능입니다.
```

**근본 원인:**
- 포트원 Channel의 PG(Payment Gateway) 설정이 HTML5_INICIS로 되어 있음
- macOS에서는 HTML5_INICIS가 지원되지 않음
- 코드에서 `pgProvider`를 지정하여 HTML5_INICIS를 피해야 함

---

## ✅ 해결 방법 1: 코드에서 pgProvider 지정 (시도 중)

코드에서 `pgProvider: 'INICIS'`를 명시적으로 지정하여 HTML5_INICIS가 아닌 일반 INICIS를 사용하도록 했습니다.

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
    pgProvider: 'INICIS', // HTML5_INICIS가 아닌 일반 INICIS 사용
    customer: {
        fullName: customerName,
        email: customerEmail,
        phoneNumber: customerPhone,
    },
    // ...
});
```

---

## ✅ 해결 방법 2: 포트원 대시보드에서 Channel PG 변경 (가장 확실한 방법)

코드 수정만으로 해결되지 않으면 **반드시 포트원 대시보드에서 Channel의 PG 설정을 변경**해야 합니다.

### 단계별 가이드

#### 1단계: 포트원 대시보드 접속
1. https://admin.portone.io 접속
2. 로그인

#### 2단계: Store 및 Channel 확인
1. **Store 선택**
   - Store ID: `store-c7408361-d836-4e72-b76c-e328a4e3c119`

2. **"Channels" 또는 "결제 채널" 메뉴 클릭**

3. **Channel 확인**
   - Channel Key: `channel-key-8d151049-3196-4ed2-b59f-c4c5124c6971`
   - Channel 클릭하여 상세 정보 확인

#### 3단계: Channel PG 설정 확인
1. **Channel 상세 페이지에서 "PG 설정" 또는 "결제 게이트웨이" 확인**
2. 현재 설정이 **"HTML5_INICIS"** 또는 **"이니시스 HTML5"**로 되어 있는지 확인

#### 4단계: Channel PG 변경 또는 Channel 재생성

**옵션 A: PG 설정 변경 (가능한 경우)**
1. Channel의 "PG 설정" 또는 "결제 게이트웨이" 메뉴 클릭
2. **"일반 결제" 또는 "표준 결제" 선택**
3. **"INICIS" (HTML5가 아닌 일반 방식) 선택**
4. 설정 저장

**옵션 B: Channel 재생성 (더 확실한 방법)**
1. **기존 Channel 삭제**
   - Channel 옆 "Delete" 또는 "삭제" 클릭
   - 확인

2. **새 Channel 생성**
   - "+ Channel 추가" 또는 "+ 결제 채널 추가" 클릭
   - **결제 수단**: "신용카드" 또는 "CARD"
   - **PG 선택**: 
     - ✅ **"일반 결제" 또는 "표준 결제"**
     - ✅ **"INICIS" (HTML5가 아닌 일반 방식)**
     - ✅ 또는 **"TOSSPAYMENTS"**, **"KCP"** 등 다른 macOS 호환 PG
   - **⚠️ "HTML5_INICIS" 또는 "이니시스 HTML5"는 선택하지 마세요!**

3. **Channel 생성 완료**

4. **새 Channel Key 복사**
   - 생성된 Channel의 "Channel Key" 복사

5. **`.env.local` 파일 업데이트**
   ```env
   NEXT_PUBLIC_PORTONE_CHANNEL_KEY=새로운_Channel_Key
   ```

6. **서버 재시작**
   ```bash
   npm run dev
   ```

---

## 🔧 코드 수정 완료

다음 수정이 완료되었습니다:

1. ✅ `payMethod: 'CARD'` 추가 (필수 파라미터)
2. ✅ `currency: 'CURRENCY_KRW'` 형식 사용
3. ✅ `pgProvider: 'INICIS'` 추가 (HTML5_INICIS 회피)

---

## 🧪 테스트

### 1단계: 포트원 대시보드에서 Channel 확인/변경

**가장 중요한 단계입니다!**

1. 포트원 대시보드 접속
2. Store → Channels 메뉴
3. Channel의 PG 설정 확인
4. **HTML5_INICIS가 아닌 일반 결제 방식으로 변경**

### 2단계: 결제 테스트

1. **신청 페이지 접속**
   ```
   http://localhost:3000/program/airplane
   ```

2. **신청서 작성 및 제출**

3. **결제 버튼 클릭**

4. **결제 창 확인**
   - macOS에서 지원되는 결제 방식으로 결제 창이 열려야 함
   - HTML5_INICIS 에러가 발생하지 않아야 함

---

## ⚠️ 중요 사항

### macOS 호환 PG 목록

포트원에서 지원하는 macOS 호환 PG:

- ✅ **INICIS** (일반 방식, HTML5 아님)
- ✅ **TOSSPAYMENTS** (토스페이먼츠)
- ✅ **KCP** (KCP)
- ✅ **NICE** (나이스)
- ✅ **KICC** (KICC)
- ✅ **SMARTRO** (스마트로)

### 지원되지 않는 PG

- ❌ **HTML5_INICIS** (macOS에서 지원되지 않음)
- ❌ **이니시스 HTML5**

---

## 📞 문제가 계속되면

1. **포트원 대시보드에서 Channel PG 설정 확인** (가장 중요!)
2. **Channel을 재생성하여 macOS 호환 PG 선택**
3. **포트원 고객센터에 문의**
   - Channel의 PG 설정 변경 방법 문의
   - macOS 호환 PG 추천 요청

---

## 💡 핵심 해결책

**이 문제는 코드만으로는 완전히 해결할 수 없습니다.**

**반드시 포트원 대시보드에서 Channel의 PG 설정을 변경해야 합니다:**

1. Channel의 PG가 **"HTML5_INICIS"**로 설정되어 있으면
2. **"일반 결제" 또는 "표준 결제"** 방식으로 변경하거나
3. Channel을 재생성하여 **macOS 호환 PG**를 선택해야 합니다.

**포트원 대시보드에서 Channel PG 설정을 변경한 후 다시 테스트해보세요!**




