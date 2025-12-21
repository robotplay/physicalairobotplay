# 포트원 Channel Key 확인 가이드

## 🔍 문제: "channelKey is not correct" 에러

이 에러는 포트원 대시보드에서 Channel Key가 올바르게 설정되지 않았거나, 복사 과정에서 문제가 발생했을 수 있습니다.

---

## ✅ 해결 방법

### 1단계: 포트원 대시보드에서 Channel 확인

1. **포트원 대시보드 접속**
   - https://admin.portone.io 접속
   - 로그인

2. **Store 선택**
   - 대시보드에서 생성한 Store 클릭
   - Store ID: `store-c7408361-d836-4e72-b76c-e328a4e3c119`

3. **Channel 확인**
   - 왼쪽 메뉴에서 **"Channels"** 또는 **"결제 채널"** 클릭
   - 활성화된 Channel이 있는지 확인
   - **Channel이 없다면 생성해야 합니다!**

### 2단계: Channel 생성 (필요한 경우)

1. **"+ Channel 추가"** 또는 **"결제 채널 추가"** 버튼 클릭
2. **결제 수단 선택**
   - 카드 결제: "신용카드" 또는 "CARD" 선택
   - 테스트 모드이므로 "테스트" 옵션 선택
3. **Channel 생성 완료**
4. **Channel Key 복사**
   - 생성된 Channel의 **"Channel Key"** 복사
   - ⚠️ **전체 키를 정확히 복사하세요!**

### 3단계: .env.local 파일 업데이트

생성한 Channel Key로 `.env.local` 파일을 업데이트하세요:

```env
NEXT_PUBLIC_PORTONE_STORE_ID=store-c7408361-d836-4e72-b76c-e328a4e3c119
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=새로_생성한_Channel_Key_여기에_입력
```

### 4단계: 개발 서버 재시작

환경 변수를 변경했으므로 서버를 재시작해야 합니다:

```bash
# 서버 종료 후 재시작
npm run dev
```

---

## ⚠️ 주의사항

1. **Channel Key는 공백 없이 복사**
   - 앞뒤 공백이 있으면 에러 발생
   - 전체 키를 정확히 복사

2. **Store와 Channel이 연결되어 있는지 확인**
   - Store에 Channel이 연결되어 있어야 함
   - Channel이 비활성화되어 있으면 활성화 필요

3. **테스트 모드 확인**
   - 테스트 모드에서 사용하는 Channel Key인지 확인
   - 실결제 모드와 테스트 모드의 Channel Key는 다를 수 있음

---

## 🔍 Channel Key 형식 확인

일반적인 Channel Key 형식:
- 길이: 약 50-100자
- 형식: 영문자와 숫자 조합
- 예시: `krvsoTV9AXWxxVtzQAVSgSnzhqYSr0H5hhCMKn9LsSOMQceDJZCIrtpiLTQHEqourSpIDVZTiExGB1tL`

현재 설정된 Channel Key:
- `krvsoTV9AXWxxVtzQAVSgSnzhqYSr0H5hhCMKn9LsSOMQceDJZCIrtpiLTQHEqourSpIDVZTiExGB1tL`

---

## 📞 다음 단계

1. 포트원 대시보드에서 Channel 확인
2. Channel이 없으면 생성
3. 새로운 Channel Key로 `.env.local` 업데이트
4. 서버 재시작
5. 결제 테스트

**Channel Key를 확인한 후 알려주시면 추가로 도와드리겠습니다!**
