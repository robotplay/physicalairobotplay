# 포트원 Toss Payments Channel 설정 가이드

## ✅ 상점아이디(MID) 선택

**Toss Payments Channel 추가 시:**

### 일반 결제용 (권장)
- **`iamporttest_3`** - 토스페이먼츠 결제창 일반결제
- ✅ **이것을 선택하세요!**
- 일반적인 카드 결제, 간편결제 등에 사용

### 정기결제용
- `iamporttest_4` - 토스페이먼츠 결제창 정기결제
- 정기 구독, 자동 결제에 사용
- 현재는 필요 없음

---

## 📋 Channel 설정 단계

### 1단계: Channel 정보 입력
- **채널 이름**: `테스트` (또는 원하는 이름)
- **채널 속성**: `결제` (Payment)

### 2단계: 결제 모듈 선택
- **결제 모듈**: `결제창` (Payment Window) ✅ 선택됨
- **PG Provider**: `tosspayments` ✅ 자동 선택됨

### 3단계: PG상점아이디(MID) 선택
- **공용 MID 선택**: 
  - ✅ **`iamporttest_3`** - 토스페이먼츠 결제창 일반결제 선택
  - 또는 직접 입력란에 `iamporttest_3` 입력

### 4단계: 저장
- **"저장"** 버튼 클릭

---

## 🔧 Channel 생성 후 할 일

### 1. Channel Key 복사
- 생성된 Channel의 **"Channel Key"** 복사
- 예: `channel-key-xxxxx-xxxxx-xxxxx`

### 2. `.env.local` 파일 업데이트
```env
NEXT_PUBLIC_PORTONE_STORE_ID=store-c7408361-d836-4e72-b76c-e328a4e3c119
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=새로_생성한_Toss_Payments_Channel_Key
```

### 3. 개발 서버 재시작
```bash
npm run dev
```

---

## ✅ Toss Payments의 장점

1. ✅ **macOS 완벽 호환**
   - HTML5_INICIS 문제 없음
   - 모든 플랫폼에서 정상 작동

2. ✅ **설정 간단**
   - 테스트용 공용 MID 제공
   - 추가 계약 불필요 (테스트 모드)

3. ✅ **안정적인 서비스**
   - 토스페이먼츠는 검증된 PG
   - 다양한 결제 수단 지원

4. ✅ **테스트 모드 지원**
   - `iamporttest_3`는 테스트용 MID
   - 실제 결제 없이 테스트 가능

---

## 🧪 테스트

### 1단계: Channel 생성 완료
- Toss Payments Channel 생성
- `iamporttest_3` MID 선택
- Channel Key 복사

### 2단계: 환경 변수 업데이트
- `.env.local` 파일에 새 Channel Key 입력
- 서버 재시작

### 3단계: 결제 테스트
1. `http://localhost:3000/program/airplane` 접속
2. 신청서 작성 및 제출
3. 결제 버튼 클릭
4. Toss Payments 결제 창 확인
   - 정상적으로 열려야 함
   - HTML5_INICIS 에러 없어야 함
   - macOS에서 정상 작동해야 함

---

## 📞 다음 단계

1. **포트원 대시보드에서 Toss Payments Channel 생성**
   - MID: `iamporttest_3` 선택
   - Channel Key 복사

2. **`.env.local` 파일 업데이트**
   - 새 Channel Key 입력

3. **서버 재시작 및 테스트**

---

## 💡 중요 사항

- **테스트 모드**: `iamporttest_3`는 테스트용 MID입니다
- **실운영 전환**: 나중에 실운영으로 전환하려면 토스페이먼츠와 계약 필요
- **macOS 호환성**: Toss Payments는 macOS에서 완벽하게 작동합니다

**`iamporttest_3`를 선택하고 Channel을 생성하세요!**




