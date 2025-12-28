import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, createConsultationEmailTemplate, createAdminConsultationNotificationTemplate } from '@/lib/email';
import { validateConsultationInput, sanitizeText } from '@/lib/validation';
import { sendAdminConsultationSMS } from '@/lib/sms';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { name, phone, email, course, message } = body;

        // 입력 데이터 정제
        name = sanitizeText(name || '', 50);
        phone = sanitizeText(phone || '', 20);
        email = email ? sanitizeText(email, 255) : '';
        course = sanitizeText(course || '', 50);
        message = sanitizeText(message || '', 5000);

        // 데이터 검증
        const validation = validateConsultationInput({ name, phone, email, message });
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.errors[0] || '입력 데이터가 올바르지 않습니다.', errors: validation.errors },
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

        // 관리자에게 SMS 알림 전송
        let smsSent = false;
        let smsError: string | undefined = undefined;
        try {
            const smsResult = await sendAdminConsultationSMS({
                name,
                phone,
                email,
                course,
                message,
            });
            if (smsResult.success) {
                smsSent = true;
                console.log('📱 관리자 SMS 알림 전송 성공');
            } else {
                smsError = smsResult.error || 'SMS 전송 실패';
                console.warn('📱 관리자 SMS 알림 전송 실패:', smsError);
            }
        } catch (err) {
            smsError = err instanceof Error ? err.message : '알 수 없는 오류';
            console.error('📱 관리자 SMS 알림 전송 오류:', err);
            // SMS 전송 실패해도 전체 프로세스는 계속 진행
        }

        // 관리자에게 알림 이메일 발송
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM || process.env.SMTP_USER;
        let adminEmailSent = false;
        if (adminEmail) {
            try {
                const adminEmailTemplate = createAdminConsultationNotificationTemplate({
                    name,
                    phone,
                    email,
                    course,
                    message,
                });
                
                const adminEmailResult = await sendEmail({
                    to: adminEmail,
                    subject: adminEmailTemplate.subject,
                    html: adminEmailTemplate.html,
                });
                
                if (adminEmailResult.success) {
                    adminEmailSent = true;
                    console.log('📧 관리자 알림 이메일 발송 성공:', adminEmail);
                } else {
                    console.warn('📧 관리자 알림 이메일 발송 결과:', adminEmailResult);
                }
            } catch (err) {
                console.error('📧 관리자 알림 이메일 발송 실패:', err);
                // 관리자 이메일 발송 실패해도 전체 프로세스는 계속 진행
            }
        } else {
            console.warn('📧 관리자 이메일 주소가 설정되지 않았습니다. ADMIN_EMAIL 환경 변수를 설정해주세요.');
        }

        // 신청자에게 확인 이메일 발송 (이메일이 있는 경우에만)
        let emailSent = false;
        let emailError = null;
        if (email) {
            try {
                const emailTemplate = createConsultationEmailTemplate({
                    name,
                    phone,
                    email,
                    course,
                    message,
                });
                
                const emailResult = await sendEmail({
                    to: email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                });
                
                if (emailResult.success) {
                    emailSent = true;
                    console.log('📧 상담문의 확인 이메일 발송 성공:', email);
                } else {
                    console.warn('📧 이메일 발송 결과:', emailResult);
                }
            } catch (err) {
                emailError = err instanceof Error ? err.message : '알 수 없는 오류';
                console.error('📧 이메일 발송 실패 (상담문의):', err);
                // 이메일 발송 실패해도 전체 프로세스는 계속 진행
            }
        }

        return NextResponse.json({
            success: true,
            data: consultationData,
            smsSent: smsSent,
            smsError: smsError || undefined,
            emailSent: emailSent,
            emailError: emailError || undefined,
            adminEmailSent: adminEmailSent,
            message: '상담 문의가 접수되었습니다.' + 
                (smsSent ? ' 관리자에게 SMS 알림이 전송되었습니다.' : '') +
                (adminEmailSent ? ' 관리자에게 알림 이메일이 발송되었습니다.' : '') +
                (email && emailSent ? ' 신청자에게 확인 이메일도 발송되었습니다.' : '') +
                (smsError ? ` SMS 발송 실패: ${smsError}` : '') +
                (email && !emailSent && !emailError ? ' 신청자 이메일 발송을 시도했으나 실패했습니다.' : '') +
                (email && emailError ? ` 신청자 이메일 발송 실패: ${emailError}` : '')
        });
    } catch (error) {
        console.error('상담 문의 처리 오류:', error);
        return NextResponse.json(
            { error: '상담 문의 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}





















