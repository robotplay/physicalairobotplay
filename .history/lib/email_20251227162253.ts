import nodemailer from 'nodemailer';

// 이메일 전송 설정
function createTransporter() {
    // 환경 변수에서 이메일 설정 가져오기
    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
    const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || 'noreply@parplay.co.kr';
    const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || '피지컬 AI 교육';

    // 환경 변수가 설정되지 않은 경우 시뮬레이션 모드
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
        console.log('📧 이메일 서비스가 설정되지 않았습니다. 환경 변수를 확인해주세요.');
        return null;
    }

    // Nodemailer transporter 생성
    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465, // 465 포트는 SSL 사용
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
    });
}

// 이메일 전송 함수
export async function sendEmail(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
}): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
    try {
        const transporter = createTransporter();

        // Transporter가 없으면 시뮬레이션 모드
        if (!transporter) {
            console.log('📧 이메일 전송 시뮬레이션:', {
                to: options.to,
                subject: options.subject,
                html: options.html.substring(0, 100) + '...',
            });
            return { success: true, simulated: true };
        }

        const SMTP_FROM = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@parplay.co.kr';
        const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || '피지컬 AI 교육';

        // 이메일 전송
        const info = await transporter.sendMail({
            from: `"${SMTP_FROM_NAME}" <${SMTP_FROM}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text || options.html.replace(/<[^>]*>/g, ''), // HTML 태그 제거하여 텍스트 생성
        });

        console.log('📧 이메일 전송 성공:', {
            to: options.to,
            subject: options.subject,
            messageId: info.messageId,
        });

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('📧 이메일 전송 오류:', error);
        throw error;
    }
}

// 상담문의 등록 확인 이메일 템플릿
export function createConsultationEmailTemplate(data: {
    name: string;
    phone: string;
    email?: string;
    course?: string;
    message: string;
}): { subject: string; html: string } {
    const courseNames: { [key: string]: string } = {
        'basic': 'Basic Course',
        'advanced': 'Advanced Course',
        'airrobot': 'AirRobot Course',
        'all': '전체 과정',
    };

    const courseName = data.course ? courseNames[data.course] || data.course : '미선택';

    const subject = '[피지컬 AI 교육] 상담 문의가 접수되었습니다';
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>상담 문의 접수 확인</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #00A3FF 0%, #FF4D4D 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">상담 문의 접수 확인</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">
            안녕하세요, <strong>${data.name}</strong>님!
        </p>
        
        <p style="font-size: 16px; margin-bottom: 30px;">
            상담 문의가 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00A3FF;">
            <h2 style="margin-top: 0; color: #00A3FF; font-size: 18px;">접수 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 100px;">이름:</td>
                    <td style="padding: 8px 0;">${data.name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">연락처:</td>
                    <td style="padding: 8px 0;">${data.phone}</td>
                </tr>
                ${data.email ? `
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">이메일:</td>
                    <td style="padding: 8px 0;">${data.email}</td>
                </tr>
                ` : ''}
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">관심 과정:</td>
                    <td style="padding: 8px 0;">${courseName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">문의 내용:</td>
                    <td style="padding: 8px 0;">${data.message.replace(/\n/g, '<br>')}</td>
                </tr>
            </table>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>안내사항:</strong><br>
                담당자가 확인 후 1-2일 내에 연락드리겠습니다. 급하신 경우 전화로 문의해주세요.
            </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="font-size: 14px; color: #666; margin: 0;">
                피지컬 AI 교육<br>
                <a href="https://parplay.co.kr" style="color: #00A3FF; text-decoration: none;">parplay.co.kr</a>
            </p>
        </div>
    </div>
</body>
</html>
    `;

    return { subject, html };
}

// 관리자 알림 이메일 템플릿 (상담문의)
export function createAdminConsultationNotificationTemplate(data: {
    name: string;
    phone: string;
    email?: string;
    course?: string;
    message: string;
}): { subject: string; html: string } {
    const courseNames: { [key: string]: string } = {
        'basic': 'Basic Course',
        'advanced': 'Advanced Course',
        'airrobot': 'AirRobot Course',
        'all': '전체 과정',
    };

    const courseName = data.course ? courseNames[data.course] || data.course : '미선택';

    const subject = `[상담문의 신청] ${data.name}님의 상담 문의가 접수되었습니다`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>상담 문의 알림</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #FF4D4D 0%, #00A3FF 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">새로운 상담 문의</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">
            새로운 상담 문의가 접수되었습니다. 관리자 페이지에서 확인해주세요.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #FF4D4D;">
            <h2 style="margin-top: 0; color: #FF4D4D; font-size: 18px;">신청자 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 120px;">이름:</td>
                    <td style="padding: 8px 0;">${data.name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">연락처:</td>
                    <td style="padding: 8px 0;">
                        <a href="tel:${data.phone}" style="color: #00A3FF; text-decoration: none;">${data.phone}</a>
                    </td>
                </tr>
                ${data.email ? `
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">이메일:</td>
                    <td style="padding: 8px 0;">
                        <a href="mailto:${data.email}" style="color: #00A3FF; text-decoration: none;">${data.email}</a>
                    </td>
                </tr>
                ` : ''}
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">관심 과정:</td>
                    <td style="padding: 8px 0;">${courseName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">문의 내용:</td>
                    <td style="padding: 8px 0;">${data.message.replace(/\n/g, '<br>')}</td>
                </tr>
            </table>
        </div>
        
        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #0c5460; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #0c5460;">
                <strong>다음 단계:</strong><br>
                관리자 페이지에서 상담 문의를 확인하고 신청자에게 연락해주세요.
            </p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
            <a href="https://parplay.co.kr/admin" style="display: inline-block; padding: 12px 24px; background: #00A3FF; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                관리자 페이지로 이동
            </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="font-size: 14px; color: #666; margin: 0;">
                피지컬 AI 교육<br>
                <a href="https://parplay.co.kr" style="color: #00A3FF; text-decoration: none;">parplay.co.kr</a>
            </p>
        </div>
    </div>
</body>
</html>
    `;

    return { subject, html };
}

// 특강신청 등록 확인 이메일 템플릿
export function createRegistrationEmailTemplate(data: {
    studentName: string;
    grade: string;
    parentName: string;
    phone: string;
    email?: string;
    message?: string;
    programName: string;
}): { subject: string; html: string } {
    const subject = `[피지컬 AI 교육] ${data.programName} 신청이 접수되었습니다`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>신청 접수 확인</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #00A3FF 0%, #FF4D4D 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">신청 접수 확인</h1>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
        <p style="font-size: 16px; margin-bottom: 20px;">
            안녕하세요, <strong>${data.parentName}</strong>님!
        </p>
        
        <p style="font-size: 16px; margin-bottom: 30px;">
            <strong>${data.programName}</strong> 신청이 성공적으로 접수되었습니다.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00A3FF;">
            <h2 style="margin-top: 0; color: #00A3FF; font-size: 18px;">신청 정보</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 100px;">프로그램:</td>
                    <td style="padding: 8px 0;">${data.programName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">학생 이름:</td>
                    <td style="padding: 8px 0;">${data.studentName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">학년:</td>
                    <td style="padding: 8px 0;">${data.grade}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">보호자 이름:</td>
                    <td style="padding: 8px 0;">${data.parentName}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">연락처:</td>
                    <td style="padding: 8px 0;">${data.phone}</td>
                </tr>
                ${data.email ? `
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">이메일:</td>
                    <td style="padding: 8px 0;">${data.email}</td>
                </tr>
                ` : ''}
                ${data.message ? `
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">문의사항:</td>
                    <td style="padding: 8px 0;">${data.message.replace(/\n/g, '<br>')}</td>
                </tr>
                ` : ''}
            </table>
        </div>
        
        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #0c5460; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #0c5460;">
                <strong>다음 단계:</strong><br>
                1. 결제를 완료해주세요. (신청서 제출 후 결제 버튼을 클릭하세요)<br>
                2. 결제 완료 후 최종 확정됩니다.<br>
                3. 프로그램 시작 전 안내 메일을 발송드립니다.
            </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="font-size: 14px; color: #666; margin: 0;">
                피지컬 AI 교육<br>
                <a href="https://parplay.co.kr" style="color: #00A3FF; text-decoration: none;">parplay.co.kr</a>
            </p>
        </div>
    </div>
</body>
</html>
    `;

    return { subject, html };
}







