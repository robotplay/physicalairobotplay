import { NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

/**
 * 초기 관리자 계정 생성 API
 * 보안을 위해 이미 관리자가 존재하면 생성하지 않음
 */
export async function POST() {
    try {
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.USERS);

        // 이미 관리자 계정이 있는지 확인
        const existingAdmin = await collection.findOne({ role: 'admin' });

        if (existingAdmin) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: '이미 관리자 계정이 존재합니다.',
                    message: '기존 관리자 계정을 사용하세요.'
                },
                { status: 400 }
            );
        }

        // 초기 관리자 계정 생성
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

        const result = await collection.insertOne(adminUser);

        return NextResponse.json({
            success: true,
            message: '초기 관리자 계정이 생성되었습니다.',
            data: {
                username: defaultUsername,
                temporaryPassword: defaultPassword,
                notice: '⚠️ 로그인 후 반드시 비밀번호를 변경하세요!',
            },
        });
    } catch (error) {
        console.error('Failed to create initial admin:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: '관리자 계정 생성 중 오류가 발생했습니다.',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * 관리자 계정 존재 여부 확인
 */
export async function GET() {
    try {
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.USERS);

        const adminCount = await collection.countDocuments({ role: 'admin' });

        return NextResponse.json({
            success: true,
            hasAdmin: adminCount > 0,
            adminCount,
        });
    } catch (error) {
        console.error('Failed to check admin status:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: '관리자 계정 확인 중 오류가 발생했습니다.' 
            },
            { status: 500 }
        );
    }
}

