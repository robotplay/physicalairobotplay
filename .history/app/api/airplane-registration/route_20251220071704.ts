import { NextRequest, NextResponse } from 'next/server';

// 문자 전송 함수 (실제 서비스 연동 필요)
async function sendSMS(phone: string, message: string) {
    try {
        const SMS_API_KEY = process.env.SMS_API_KEY;
        const SMS_API_URL = process.env.SMS_API_URL;
        const ADMIN_PHONE = process.env.ADMIN_PHONE || '010-0000-0000';
        
        if (!SMS_API_KEY || !SMS_API_URL) {
            console.log('📱 문자 전송 시뮬레이션:', {
                to: ADMIN_PHONE,
                from: phone,
                message: message
            });
            return { success: true, simulated: true };
        }

        // 실제 SMS API 호출 코드는 여기에 추가
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
        const { studentName, grade, parentName, phone, email, message, program, programName } = body;

        // 데이터 검증
        if (!studentName || !grade || !parentName || !phone) {
            return NextResponse.json(
                { error: '필수 항목을 입력해주세요.' },
                { status: 400 }
            );
        }

        // 신청 데이터 생성
        const registrationData = {
            id: `airplane-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            studentName,
            grade,
            parentName,
            phone,
            email: email || '',
            message: message || '',
            program,
            programName,
            status: 'pending', // pending, paid, completed, cancelled
            paymentStatus: 'unpaid', // unpaid, paid, refunded
            timestamp: new Date().toISOString(),
        };

        // 문자 메시지 생성
        const smsMessage = `[제어 비행기 4주 특강] 새로운 신청이 접수되었습니다.

학생: ${studentName} (${grade})
보호자: ${parentName}
연락처: ${phone}
${email ? `이메일: ${email}\n` : ''}${message ? `문의: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}\n` : ''}
관리자 페이지에서 확인해주세요.`;

        // 문자 전송
        await sendSMS(phone, smsMessage);

        return NextResponse.json({
            success: true,
            data: registrationData,
            message: '신청서가 접수되었고 문자 알림이 전송되었습니다.'
        });
    } catch (error) {
        console.error('신청서 처리 오류:', error);
        return NextResponse.json(
            { error: '신청서 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
