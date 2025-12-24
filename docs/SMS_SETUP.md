# 문자 알림 설정 가이드

## 개요

상담 문의 폼이 제출되면 관리자에게 문자 알림이 자동으로 전송됩니다.

## 현재 상태

### 개발 환경
- 문자 전송이 **시뮬레이션 모드**로 동작합니다
- 콘솔에 문자 내용이 출력됩니다
- 실제 문자는 전송되지 않습니다

### 프로덕션 환경 설정 필요

## 문자 전송 서비스 옵션

### 옵션 1: 알리고 (Aligo) - 추천 (한국)
- **장점**: 한국 서비스, 저렴한 가격, 안정적
- **가격**: 건당 약 20원
- **사이트**: https://www.aligo.co.kr

### 옵션 2: 카카오톡 알림톡
- **장점**: 무료 플랜 제공, 브랜드 인지도 높음
- **단점**: 사업자 등록 필요
- **사이트**: https://business.kakao.com

### 옵션 3: Twilio
- **장점**: 글로벌 서비스, 다양한 국가 지원
- **단점**: 한국 지원 제한적
- **사이트**: https://www.twilio.com

## 환경 변수 설정

`.env.local` 파일에 다음 변수를 추가하세요:

```env
# SMS 서비스 설정 (알리고 예시)
SMS_API_KEY=your_api_key_here
SMS_API_URL=https://apis.aligo.in/send/
ADMIN_PHONE=010-1234-5678  # 관리자 전화번호 (문자 수신 번호)
```

## 알리고 API 연동 예시

`app/api/consultations/route.ts` 파일의 `sendSMS` 함수를 다음과 같이 수정하세요:

```typescript
async function sendSMS(phone: string, message: string) {
    const SMS_API_KEY = process.env.SMS_API_KEY;
    const SMS_USER_ID = process.env.SMS_USER_ID; // 알리고 사용자 ID
    const ADMIN_PHONE = process.env.ADMIN_PHONE;

    const response = await fetch('https://apis.aligo.in/send/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            key: SMS_API_KEY,
            user_id: SMS_USER_ID,
            sender: '01012345678', // 발신번호 (알리고에 등록된 번호)
            receiver: ADMIN_PHONE,
            msg: message,
            testmode_yn: 'N'
        })
    });

    const result = await response.json();
    return result;
}
```

## 문자 메시지 형식

기본 메시지 형식:
```
[피지컬 AI 교육] 새로운 상담 문의가 접수되었습니다.

이름: 홍길동
연락처: 010-1234-5678
이메일: example@email.com
관심 과정: AirRobot Course
문의 내용: 상담 문의 내용...

관리자 페이지에서 확인해주세요.
```

## 테스트 방법

1. 개발 환경에서 테스트:
   - 상담 문의 폼 제출
   - 브라우저 콘솔에서 문자 내용 확인

2. 프로덕션 환경에서 테스트:
   - 환경 변수 설정 후
   - 실제 문자 수신 확인

## 주의사항

1. **개인정보 보호**: 전화번호는 암호화하여 저장하는 것을 권장합니다
2. **비용 관리**: 문자 전송 건수에 따라 비용이 발생합니다
3. **Rate Limiting**: API 호출 제한을 설정하여 남용을 방지하세요
4. **에러 처리**: 문자 전송 실패 시에도 상담 문의는 저장되도록 처리되어 있습니다

## 문제 해결

### 문자가 전송되지 않는 경우
1. 환경 변수가 올바르게 설정되었는지 확인
2. SMS 서비스 API 키가 유효한지 확인
3. 관리자 전화번호 형식 확인 (010-1234-5678)
4. 서비스 제공업체의 계정 상태 확인

### 개발 환경에서 테스트
- 현재는 콘솔에만 출력되므로 실제 문자 전송 없이 테스트 가능
- 프로덕션 배포 전에 실제 서비스 연동 필요


















