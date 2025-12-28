import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyAdminAuth } from '@/lib/auth-middleware';
import { sendEmail, createNewsletterEmailTemplate, createPromotionEmailTemplate } from '@/lib/email';
import { ObjectId } from 'mongodb';

// 캠페인 생성 및 발송
export async function POST(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const authResult = await verifyAdminAuth(request);
        if (!authResult.success) {
            return NextResponse.json(
                { success: false, error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { type, title, content, description, imageUrl, ctaText, ctaUrl, recipientType } = body;

        if (!type || !title || !content) {
            return NextResponse.json(
                { success: false, error: '필수 필드가 누락되었습니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const subscribersCollection = db.collection(COLLECTIONS.NEWSLETTER_SUBSCRIBERS);
        const campaignsCollection = db.collection(COLLECTIONS.EMAIL_CAMPAIGNS);

        // 수신자 목록 가져오기
        let recipients: string[] = [];
        
        if (recipientType === 'all') {
            // 모든 활성 구독자
            const subscribers = await subscribersCollection
                .find({ status: 'active' })
                .toArray();
            recipients = subscribers.map((sub) => sub.email);
        } else if (recipientType === 'test' && body.testEmails) {
            // 테스트 이메일
            recipients = Array.isArray(body.testEmails) ? body.testEmails : [body.testEmails];
        } else {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 수신자 타입입니다.' },
                { status: 400 }
            );
        }

        if (recipients.length === 0) {
            return NextResponse.json(
                { success: false, error: '수신자가 없습니다.' },
                { status: 400 }
            );
        }

        // 캠페인 레코드 생성
        const campaignData = {
            type,
            title,
            content,
            description,
            imageUrl,
            ctaText,
            ctaUrl,
            recipientType,
            recipientCount: recipients.length,
            status: 'sending',
            createdAt: new Date(),
            sentAt: null as Date | null,
            completedAt: null as Date | null,
        };

        const campaignResult = await campaignsCollection.insertOne(campaignData);
        const campaignId = campaignResult.insertedId.toString();

        // 이메일 발송 (비동기로 처리하여 즉시 응답)
        // 각 수신자별로 개인화된 이메일 생성 및 발송
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parplay.co.kr';
        
        // 이메일 발송 함수 (각 수신자별로 unsubscribeUrl 개인화)
        const sendPersonalizedEmails = async () => {
            let success = 0;
            let failed = 0;
            const errors: string[] = [];

            for (const email of recipients) {
                try {
                    // 수신자별로 unsubscribeUrl 개인화
                    const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
                    
                    let emailTemplate: { subject: string; html: string };
                    if (type === 'newsletter') {
                        emailTemplate = createNewsletterEmailTemplate({
                            title,
                            content,
                            unsubscribeUrl,
                        });
                    } else {
                        emailTemplate = createPromotionEmailTemplate({
                            title,
                            description: description || content,
                            imageUrl,
                            ctaText: ctaText || '자세히 보기',
                            ctaUrl: ctaUrl || siteUrl,
                            unsubscribeUrl,
                        });
                    }

                    const sendResult = await sendEmail({ to: email, subject: emailTemplate.subject, html: emailTemplate.html });
                    if (sendResult.success) {
                        if (sendResult.simulated) {
                            console.warn(`이메일 시뮬레이션 모드: ${email} (SMTP 설정 필요)`);
                        }
                        success++;
                    } else {
                        failed++;
                        errors.push(`${email}: 이메일 전송 실패`);
                    }
                } catch (error: unknown) {
                    failed++;
                    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
                    errors.push(`${email}: ${errorMessage}`);
                    console.error(`이메일 발송 실패 (${email}):`, error);
                }
                
                // API 레이트 리밋 방지를 위한 짧은 지연
                if (recipients.indexOf(email) < recipients.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            return { success, failed, errors };
        };

        sendPersonalizedEmails()
            .then(async (result) => {
                // 캠페인 상태 업데이트
                const finalStatus = result.failed === 0 ? 'completed' : (result.success === 0 ? 'failed' : 'completed');
                await campaignsCollection.updateOne(
                    { _id: campaignResult.insertedId },
                    {
                        $set: {
                            status: finalStatus,
                            sentAt: new Date(),
                            completedAt: new Date(),
                            successCount: result.success,
                            failedCount: result.failed,
                            errors: result.errors.length > 0 ? result.errors : undefined,
                        },
                    }
                );
                console.log(`캠페인 발송 완료 (${campaignId}): 성공 ${result.success}건, 실패 ${result.failed}건`);
                if (result.errors.length > 0) {
                    console.error(`캠페인 발송 오류 (${campaignId}):`, result.errors);
                }
            })
            .catch(async (error: unknown) => {
                // 캠페인 상태 업데이트 (실패)
                const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
                await campaignsCollection.updateOne(
                    { _id: campaignResult.insertedId },
                    {
                        $set: {
                            status: 'failed',
                            completedAt: new Date(),
                            error: errorMessage,
                        },
                    }
                );
                console.error(`캠페인 발송 실패 (${campaignId}):`, errorMessage);
            });

        return NextResponse.json({
            success: true,
            message: '캠페인이 생성되었고 발송을 시작했습니다.',
            data: {
                campaignId,
                recipientCount: recipients.length,
                status: 'sending',
            },
        });
    } catch (error: unknown) {
        console.error('캠페인 생성 오류:', error);
        return NextResponse.json(
            { success: false, error: '캠페인 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 캠페인 목록 조회
export async function GET(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const authResult = await verifyAdminAuth(request);
        if (!authResult.success) {
            return NextResponse.json(
                { success: false, error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.EMAIL_CAMPAIGNS);

        // 총 개수
        const total = await collection.countDocuments({});

        // 목록 조회
        const campaigns = await collection
            .find({})
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        return NextResponse.json({
            success: true,
            data: {
                campaigns: campaigns.map((campaign) => ({
                    _id: campaign._id.toString(),
                    type: campaign.type,
                    title: campaign.title,
                    recipientCount: campaign.recipientCount,
                    status: campaign.status,
                    successCount: campaign.successCount || 0,
                    failedCount: campaign.failedCount || 0,
                    createdAt: campaign.createdAt,
                    sentAt: campaign.sentAt,
                    completedAt: campaign.completedAt,
                })),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error: unknown) {
        console.error('캠페인 목록 조회 오류:', error);
        return NextResponse.json(
            { success: false, error: '캠페인 목록 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 캠페인 삭제
export async function DELETE(request: NextRequest) {
    try {
        // 관리자 인증 확인
        const authResult = await verifyAdminAuth(request);
        if (!authResult.success) {
            return NextResponse.json(
                { success: false, error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const campaignId = searchParams.get('id');

        if (!campaignId) {
            return NextResponse.json(
                { success: false, error: '캠페인 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.EMAIL_CAMPAIGNS);
        
        if (!ObjectId.isValid(campaignId)) {
            return NextResponse.json(
                { success: false, error: '유효하지 않은 캠페인 ID입니다.' },
                { status: 400 }
            );
        }

        const result = await collection.deleteOne({ _id: new ObjectId(campaignId) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: '캠페인을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '캠페인이 삭제되었습니다.',
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
        console.error('캠페인 삭제 오류:', errorMessage);
        return NextResponse.json(
            { success: false, error: '캠페인 삭제 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

