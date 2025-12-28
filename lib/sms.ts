/**
 * SMS 전송 유틸리티
 * 알리고(Aligo) API를 사용하여 SMS를 전송합니다
 */

interface SMSOptions {
    phone: string;
    message: string;
    sender?: string; // 발신번호 (선택사항, 미설정 시 등록된 발신번호 사용)
}

interface SMSResult {
    success: boolean;
    messageId?: string;
    error?: string;
    simulated?: boolean;
}

/**
 * 알리고 API를 사용하여 SMS 전송
 */
export async function sendSMS(options: SMSOptions): Promise<SMSResult> {
    const SMS_API_KEY = process.env.SMS_API_KEY;
    const SMS_USER_ID = process.env.SMS_USER_ID;
    const SMS_SENDER = process.env.SMS_SENDER; // 발신번호 (선택사항)
    const ADMIN_PHONE = process.env.ADMIN_PHONE || '010-0000-0000'; // 관리자 전화번호

    // 환경 변수 확인
    if (!SMS_API_KEY || !SMS_USER_ID) {
        console.log('📱 SMS 서비스가 설정되지 않았습니다. 환경 변수를 확인해주세요.');
        console.log('📱 SMS 전송 시뮬레이션:', {
            to: ADMIN_PHONE,
            message: options.message.substring(0, 50) + '...',
        });
        return { success: true, simulated: true };
    }

    try {
        // 알리고 API 엔드포인트
        const apiUrl = 'https://apis.aligo.in/send/';
        
        // 전화번호 형식 변환 (하이픈 제거)
        const phoneNumber = options.phone.replace(/[-\s()]/g, '');
        
        // 요청 데이터
        const formData = new URLSearchParams();
        formData.append('key', SMS_API_KEY);
        formData.append('user_id', SMS_USER_ID);
        formData.append('sender', SMS_SENDER || ''); // 발신번호 (등록된 번호 사용 시 빈 문자열)
        formData.append('receiver', phoneNumber);
        formData.append('msg', options.message);
        formData.append('testmode_yn', process.env.NODE_ENV === 'production' ? 'N' : 'Y'); // 프로덕션에서만 실제 발송

        // API 호출
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        const result = await response.json();

        // 알리고 API 응답 확인
        if (result.result_code === '1') {
            console.log('📱 SMS 전송 성공:', {
                to: phoneNumber,
                messageId: result.msg_id,
            });
            return {
                success: true,
                messageId: result.msg_id?.toString(),
            };
        } else {
            // 에러 처리
            const errorMessage = result.message || 'SMS 전송 실패';
            console.error('📱 SMS 전송 실패:', {
                error: errorMessage,
                code: result.result_code,
                to: phoneNumber,
            });
            return {
                success: false,
                error: errorMessage,
            };
        }
    } catch (error) {
        console.error('📱 SMS 전송 오류:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        return {
            success: false,
            error: errorMessage,
        };
    }
}

/**
 * 관리자에게 SMS 알림 전송 (상담문의)
 */
export async function sendAdminConsultationSMS(data: {
    name: string;
    phone: string;
    email?: string;
    course?: string;
    message: string;
}): Promise<SMSResult> {
    const ADMIN_PHONE = process.env.ADMIN_PHONE;
    
    if (!ADMIN_PHONE) {
        console.warn('📱 관리자 전화번호가 설정되지 않았습니다. ADMIN_PHONE 환경 변수를 설정해주세요.');
        return { success: false, error: '관리자 전화번호가 설정되지 않았습니다.' };
    }

    const courseNames: { [key: string]: string } = {
        'basic': 'Basic Course',
        'advanced': 'Advanced Course',
        'airrobot': 'AirRobot Course',
        'all': '전체 과정',
    };

    const courseName = data.course ? courseNames[data.course] || data.course : '미선택';
    const message = `[피지컬 AI 교육] 새로운 상담 문의가 접수되었습니다.

이름: ${data.name}
연락처: ${data.phone}
${data.email ? `이메일: ${data.email}\n` : ''}관심 과정: ${courseName}
문의 내용: ${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}

관리자 페이지에서 확인해주세요.`;

    return sendSMS({
        phone: ADMIN_PHONE,
        message,
    });
}

/**
 * 관리자에게 SMS 알림 전송 (특강신청)
 */
export async function sendAdminRegistrationSMS(data: {
    studentName: string;
    grade: string;
    parentName: string;
    phone: string;
    email?: string;
    message?: string;
    programName: string;
}): Promise<SMSResult> {
    const ADMIN_PHONE = process.env.ADMIN_PHONE;
    
    if (!ADMIN_PHONE) {
        console.warn('📱 관리자 전화번호가 설정되지 않았습니다. ADMIN_PHONE 환경 변수를 설정해주세요.');
        return { success: false, error: '관리자 전화번호가 설정되지 않았습니다.' };
    }

    const message = `[${data.programName}] 새로운 신청이 접수되었습니다.

학생: ${data.studentName} (${data.grade})
보호자: ${data.parentName}
연락처: ${data.phone}
${data.email ? `이메일: ${data.email}\n` : ''}${data.message ? `문의: ${data.message.substring(0, 30)}${data.message.length > 30 ? '...' : ''}\n` : ''}
관리자 페이지에서 확인해주세요.`;

    return sendSMS({
        phone: ADMIN_PHONE,
        message,
    });
}




