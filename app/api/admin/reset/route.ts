import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

/**
 * 관리자 계정 초기화 API
 * 기존 관리자 계정을 삭제하고 새로 생성
 * 보안을 위해 특별한 키가 필요
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { resetKey } = body;

        // 보안 키 확인 (환경변수 또는 기본값)
        const validResetKey = process.env.ADMIN_RESET_KEY || 'reset-admin-2024';
        
        if (resetKey !== validResetKey) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: '유효하지 않은 초기화 키입니다.',
                    hint: '환경변수 ADMIN_RESET_KEY 또는 기본값 "reset-admin-2024"를 사용하세요.'
                },
                { status: 403 }
            );
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.USERS);

        // 기존 관리자 계정 모두 삭제
        const deleteResult = await collection.deleteMany({ role: 'admin' });

        // 새 관리자 계정 생성
        const defaultUsername = 'admin';
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123!@#';
        
        const hashedPassword = await hashPassword(defaultPassword);

        const adminUser = {
            username: defaultUsername,
            password: hashedPassword,
            name: '시스템 관리자',
            email: 'admin@parplay.co.kr',
            phone: '',
            role: 'admin',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await collection.insertOne(adminUser);

        return NextResponse.json({
            success: true,
            message: '관리자 계정이 초기화되었습니다.',
            deletedCount: deleteResult.deletedCount,
            data: {
                username: defaultUsername,
                temporaryPassword: defaultPassword,
                notice: '⚠️ 로그인 후 반드시 비밀번호를 변경하세요!',
            },
        });
    } catch (error) {
        console.error('Failed to reset admin:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: '관리자 계정 초기화 중 오류가 발생했습니다.',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * 모든 관리자 계정 목록 조회 (디버깅용)
 */
export async function GET() {
    try {
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.USERS);

        const admins = await collection.find({ role: 'admin' }).toArray();

        // 비밀번호 제외하고 반환
        const adminList = admins.map(admin => ({
            _id: admin._id.toString(),
            username: admin.username,
            name: admin.name,
            email: admin.email,
            status: admin.status,
            createdAt: admin.createdAt,
        }));

        return NextResponse.json({
            success: true,
            count: adminList.length,
            admins: adminList,
        });
    } catch (error) {
        console.error('Failed to list admins:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: '관리자 목록 조회 중 오류가 발생했습니다.' 
            },
            { status: 500 }
        );
    }
}

