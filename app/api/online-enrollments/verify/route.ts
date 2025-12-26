import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';

// POST - 수강생 권한 확인 (My Classroom 로그인 대용)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { customerName, customerPhone } = body;

        if (!customerName || !customerPhone) {
            return NextResponse.json(
                { success: false, error: '이름과 전화번호를 입력해주세요.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        
        // 1. 먼저 결제 내역에서 해당 정보가 있는지 확인
        const payments = await db.collection(COLLECTIONS.PAYMENTS).find({
            customerName,
            customerPhone,
            status: 'completed'
        }).toArray();

        if (payments.length === 0) {
            return NextResponse.json(
                { success: false, error: '결제 내역을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 2. 수강 가능한 강좌 정보 가져오기
        // orderName이 강좌 제목과 일치한다고 가정하거나, 별도의 enrollments 테이블 활용
        // 여기서는 결제된 orderName들을 반환
        const purchasedCourses = payments.map(p => p.orderName);

        // 3. 실제 온라인 강좌 정보들 가져오기
        const onlineCourses = await db.collection(COLLECTIONS.ONLINE_COURSES).find({
            title: { $in: purchasedCourses }
        }).toArray();

        return NextResponse.json({
            success: true,
            courses: onlineCourses.map((c: any) => ({
                ...c,
                _id: c._id.toString(),
                id: c._id.toString()
            })),
            customerName
        });
    } catch (error: any) {
        console.error('Failed to verify enrollment:', error);
        return NextResponse.json(
            { success: false, error: '인증 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

