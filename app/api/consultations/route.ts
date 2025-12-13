import { NextRequest, NextResponse } from 'next/server';

// 문자 전송 함수 (실제 서비스 연동 필요)
async function sendSMS(phone: string, message: string) {
    try {
        // TODO: 실제 SMS 서비스 연동
        // 예시: 알리고(Aligo), Twilio, 카카오톡 알림톡 등
        
        // 환경 변수에서 SMS 서비스 설정 가져오기
        const SMS_API_KEY = process.env.SMS_API_KEY;
        const SMS_API_URL = process.env.SMS_API_URL;
        const ADMIN_PHONE = process.env.ADMIN_PHONE || '010-0000-0000'; // 관리자 전화번호
        
        if (!SMS_API_KEY || !SMS_API_URL) {
            console.log('SMS 서비스가 설정되지 않았습니다. 환경 변수를 확인해주세요.');
            console.log('문자 전송 시뮬레이션:', {
                to: ADMIN_PHONE,
                message: message
            });
            return { success: true, simulated: true };
        }

        // 실제 SMS API 호출 예시 (알리고 API 형식)
        /*
        const response = await fetch(SMS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SMS_API_KEY}`
            },
            body: JSON.stringify({
                receiver: ADMIN_PHONE,
                message: message,
                sender: phone
            })
        });

        if (!response.ok) {
            throw new Error('SMS 전송 실패');
        }

        return await response.json();
        */

        // 개발 환경에서는 콘솔에만 출력
        console.log('📱 문자 전송:', {
            to: ADMIN_PHONE,
            from: phone,
            message: message
        });

        return { success: true, simulated: true };
    } catch (error) {
        console.error('SMS 전송 오류:', error);
        throw error;
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, phone, email, course, message } = body;

        // 데이터 검증
        if (!name || !phone || !message) {
            return NextResponse.json(
                { error: '필수 항목을 입력해주세요.' },
                { status: 400 }
            );
        }

        // 상담 문의 데이터 생성
        const consultationData = {
            id: `consultation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name,
            phone,
            email: email || '',
            course: course || '',
            message,
            timestamp: new Date().toISOString(),
        };

        // 문자 메시지 생성
        const courseNames: { [key: string]: string } = {
            'basic': 'Basic Course',
            'advanced': 'Advanced Course',
            'airrobot': 'AirRobot Course',
            'all': '전체 과정'
        };

        const courseName = courseNames[course] || course || '미선택';
        const smsMessage = `[피지컬 AI 교육] 새로운 상담 문의가 접수되었습니다.

이름: ${name}
연락처: ${phone}
${email ? `이메일: ${email}\n` : ''}관심 과정: ${courseName}
문의 내용: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}

관리자 페이지에서 확인해주세요.`;

        // 문자 전송
        await sendSMS(phone, smsMessage);

        return NextResponse.json({
            success: true,
            data: consultationData,
            message: '상담 문의가 접수되었고 문자 알림이 전송되었습니다.'
        });
    } catch (error) {
        console.error('상담 문의 처리 오류:', error);
        return NextResponse.json(
            { error: '상담 문의 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
