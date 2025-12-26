import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { sendEmail, createRegistrationEmailTemplate } from '@/lib/email';
import { generateEnrollmentToken, generateAccessCode } from '@/lib/enrollment-token';
import { successResponse, badRequestResponse, handleMongoError } from '@/lib/api-response';

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
        const { studentName, grade, parentName, phone, email, message, courseId, courseTitle } = body;

        // 데이터 검증
        if (!studentName || !grade || !parentName || !phone || !courseId) {
            return badRequestResponse('필수 항목을 입력해주세요.', '학생명, 학년, 보호자명, 연락처, 강좌ID는 필수입니다.');
        }

        if (!email) {
            return badRequestResponse('이메일은 필수입니다.', '수강 접근 링크를 받으려면 이메일이 필요합니다.');
        }

        const enrollmentId = `enrollment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // 수강 접근 토큰 생성 (365일 유효)
        const accessToken = await generateEnrollmentToken({
            enrollmentId,
            courseId,
            studentEmail: email,
            studentName,
        }, 365);

        // 짧은 접근 코드 생성 (6자리)
        const accessCode = generateAccessCode();

        // 신청 데이터 생성
        const enrollmentData = {
            id: enrollmentId,
            courseId,
            courseTitle: courseTitle || '온라인 강좌',
            studentName,
            grade,
            parentName,
            phone,
            email,
            message: message || '',
            accessToken, // 수강 접근 토큰
            accessCode, // 짧은 접근 코드
            status: 'pending', // pending, paid, completed, cancelled
            paymentStatus: 'unpaid', // unpaid, paid, refunded
            timestamp: new Date().toISOString(),
            createdAt: new Date(),
        };

        // MongoDB에 저장
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.ONLINE_ENROLLMENTS);
        const result = await collection.insertOne(enrollmentData);
        
        console.log('✅ 수강 신청 저장 성공:', result.insertedId);

        // 수강 접근 URL 생성
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parplay.co.kr';
        const accessUrl = `${siteUrl}/online-courses/${courseId}?token=${accessToken}`;
        const shortAccessUrl = `${siteUrl}/online-courses/access?code=${accessCode}`;

        // 문자 메시지 생성
        const smsMessage = `[온라인 강좌 신청] 새로운 신청이 접수되었습니다.

강좌: ${courseTitle || '온라인 강좌'}
학생: ${studentName} (${grade})
보호자: ${parentName}
연락처: ${phone}
${email ? `이메일: ${email}\n` : ''}${message ? `문의: ${message.substring(0, 30)}${message.length > 30 ? '...' : ''}\n` : ''}
관리자 페이지에서 확인해주세요.`;

        // 문자 전송
        await sendSMS(phone, smsMessage);

        // 이메일 발송
        try {
            const emailTemplate = createEnrollmentEmailTemplate({
                studentName,
                courseTitle: courseTitle || '온라인 강좌',
                accessUrl,
                accessCode,
                parentName,
            });
            
            await sendEmail({
                to: email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
            });
            
            console.log('📧 수강 접근 링크 이메일 발송 성공:', email);
        } catch (emailError) {
            console.error('📧 이메일 발송 실패 (온라인 강좌 신청):', emailError);
            // 이메일 발송 실패해도 전체 프로세스는 계속 진행
        }

        // 토큰 제외하고 반환 (보안)
        const { accessToken: _, ...enrollmentDataWithoutToken } = enrollmentData;

        return successResponse({
            enrollment: enrollmentDataWithoutToken,
            accessUrl: shortAccessUrl, // 짧은 URL 제공
            message: '신청이 완료되었습니다. 이메일로 수강 접근 링크가 발송되었습니다.',
        }, '온라인 강좌 신청이 완료되었습니다.', 201);
    } catch (error) {
        console.error('신청서 처리 오류:', error);
        return handleMongoError(error);
    }
}

/**
 * 수강 신청 확인 이메일 템플릿 생성
 */
function createEnrollmentEmailTemplate(data: {
    studentName: string;
    courseTitle: string;
    accessUrl: string;
    accessCode: string;
    parentName: string;
}) {
    const { studentName, courseTitle, accessUrl, accessCode, parentName } = data;

    return {
        subject: `[피지컬 AI 로봇플레이] ${courseTitle} 수강 신청 완료`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>수강 신청 완료</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Malgun Gothic', sans-serif; background-color: #f5f5f5;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0066FF 0%, #FF6B35 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                🎉 수강 신청 완료!
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px; font-size: 16px; color: #333333; line-height: 1.6;">
                                안녕하세요, <strong>${parentName}</strong> 학부모님!
                            </p>
                            <p style="margin: 0 0 30px; font-size: 16px; color: #333333; line-height: 1.6;">
                                <strong>${studentName}</strong> 학생의 <strong>${courseTitle}</strong> 수강 신청이 완료되었습니다.
                            </p>
                            
                            <!-- Access Info Box -->
                            <div style="background-color: #f8f9fa; border-left: 4px solid #0066FF; padding: 20px; margin: 30px 0; border-radius: 8px;">
                                <h2 style="margin: 0 0 15px; font-size: 18px; color: #0066FF;">
                                    📚 수강 접근 방법
                                </h2>
                                <p style="margin: 0 0 15px; font-size: 14px; color: #666666;">
                                    아래 버튼을 클릭하거나 접근 코드를 입력하여 수강하실 수 있습니다.
                                </p>
                                
                                <!-- Access Button -->
                                <div style="text-align: center; margin: 25px 0;">
                                    <a href="${accessUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #0066FF 0%, #0052CC 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);">
                                        지금 수강하기 →
                                    </a>
                                </div>
                                
                                <!-- Access Code -->
                                <div style="background-color: #ffffff; border: 2px dashed #0066FF; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
                                    <p style="margin: 0 0 8px; font-size: 13px; color: #666666;">
                                        접근 코드
                                    </p>
                                    <p style="margin: 0; font-size: 32px; font-weight: bold; color: #0066FF; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                                        ${accessCode}
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Important Notes -->
                            <div style="background-color: #fff8e6; border-left: 4px solid #FFB800; padding: 20px; margin: 30px 0; border-radius: 8px;">
                                <h3 style="margin: 0 0 12px; font-size: 16px; color: #FFB800;">
                                    ⚠️ 중요 안내
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #666666; line-height: 1.8;">
                                    <li>이 이메일은 수강 접근을 위한 중요한 정보를 포함하고 있습니다. 안전하게 보관해주세요.</li>
                                    <li>접근 코드는 본인만 사용할 수 있으며, 다른 사람과 공유하지 마세요.</li>
                                    <li>수강 접근 링크는 1년간 유효합니다.</li>
                                    <li>수강 중 문의사항이 있으시면 언제든지 연락주세요.</li>
                                </ul>
                            </div>
                            
                            <p style="margin: 30px 0 0; font-size: 14px; color: #999999; text-align: center; line-height: 1.6;">
                                감사합니다.<br>
                                <strong style="color: #0066FF;">피지컬 AI 로봇플레이</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px; font-size: 13px; color: #999999;">
                                충남 천안시 서북구 불당22대로 39, 2층 202호
                            </p>
                            <p style="margin: 0; font-size: 13px; color: #999999;">
                                📞 문의: 010-0000-0000 | 📧 info@parplay.co.kr
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    };
}

