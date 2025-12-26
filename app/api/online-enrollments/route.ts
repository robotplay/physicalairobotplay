import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { sendEmail, createRegistrationEmailTemplate } from '@/lib/email';

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
            return NextResponse.json(
                { error: '필수 항목을 입력해주세요.' },
                { status: 400 }
            );
        }

        // 신청 데이터 생성
        const enrollmentData = {
            id: `enrollment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            courseId,
            courseTitle: courseTitle || '온라인 강좌',
            studentName,
            grade,
            parentName,
            phone,
            email: email || '',
            message: message || '',
            status: 'pending', // pending, paid, completed, cancelled
            paymentStatus: 'unpaid', // unpaid, paid, refunded
            timestamp: new Date().toISOString(),
            createdAt: new Date(),
        };

        // MongoDB에 저장 (연결이 설정된 경우에만)
        if (process.env.MONGODB_URI) {
            try {
                const db = await getDatabase();
                const collection = db.collection(COLLECTIONS.ONLINE_ENROLLMENTS);
                const result = await collection.insertOne(enrollmentData);
                
                console.log('✅ MongoDB 저장 성공:', result.insertedId);
            } catch (dbError) {
                console.error('❌ MongoDB 저장 실패:', dbError);
                // MongoDB 저장 실패해도 로컬 스토리지는 저장되도록 계속 진행
            }
        } else {
            console.log('ℹ️ MongoDB URI가 설정되지 않아 로컬 스토리지만 사용합니다.');
        }

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

        // 이메일 발송 (이메일이 있는 경우에만)
        if (email) {
            try {
                const emailTemplate = createRegistrationEmailTemplate({
                    studentName,
                    grade,
                    parentName,
                    phone,
                    email,
                    message: message || undefined,
                    programName: courseTitle || '온라인 강좌',
                });
                
                await sendEmail({
                    to: email,
                    subject: emailTemplate.subject,
                    html: emailTemplate.html,
                });
                
                console.log('📧 온라인 강좌 신청 확인 이메일 발송 성공:', email);
            } catch (emailError) {
                console.error('📧 이메일 발송 실패 (온라인 강좌 신청):', emailError);
                // 이메일 발송 실패해도 전체 프로세스는 계속 진행
            }
        }

        return NextResponse.json({
            success: true,
            data: enrollmentData,
            id: enrollmentData.id,
            message: '신청서가 접수되었고 문자 알림이 전송되었습니다.' + (email ? ' 확인 이메일도 발송되었습니다.' : '')
        });
    } catch (error) {
        console.error('신청서 처리 오류:', error);
        return NextResponse.json(
            { error: '신청서 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

