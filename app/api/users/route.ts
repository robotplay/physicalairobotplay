import { NextRequest } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { hashPassword, verifyToken, hasPermission } from '@/lib/auth';
import { cookies } from 'next/headers';
import {
    successResponse,
    unauthorizedResponse,
    badRequestResponse,
    handleMongoError,
    handleError,
} from '@/lib/api-response';

// 권한 체크 헬퍼 함수
async function checkAuth(requiredRole: 'admin' | 'teacher' = 'admin') {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return { authorized: false, error: '인증되지 않았습니다.' };
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return { authorized: false, error: '유효하지 않은 토큰입니다.' };
    }

    if (!hasPermission(payload.role, requiredRole)) {
        return { authorized: false, error: '권한이 없습니다.' };
    }

    return { authorized: true, user: payload };
}

// GET - 사용자 목록 조회 (관리자만)
export async function GET(request: NextRequest) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role'); // 역할별 필터링

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.USERS);

        const query = role ? { role } : {};
        const users = await collection
            .find(query)
            .project({ password: 0 }) // 비밀번호 제외
            .sort({ createdAt: -1 })
            .toArray();

        const formattedUsers = users.map((user) => ({
            ...user,
            _id: user._id.toString(),
        }));

        return successResponse({
            users: formattedUsers,
            count: formattedUsers.length,
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

// POST - 사용자 생성 (관리자만)
export async function POST(request: NextRequest) {
    try {
        console.log('=== POST /api/users - Creating user ===');
        
        const auth = await checkAuth('admin');
        console.log('Auth check result:', auth);
        
        if (!auth.authorized) {
            console.error('Authorization failed:', auth.error);
            return unauthorizedResponse(auth.error);
        }

        const body = await request.json();
        console.log('Received body:', { ...body, password: '***' }); // 비밀번호는 로그에서 숨김
        
        const { username, password, name, email, phone, role } = body;

        // 필수 필드 검증
        if (!username || !password || !name || !role) {
            console.error('Missing required fields:', { username: !!username, password: !!password, name: !!name, role: !!role });
            return badRequestResponse('필수 항목을 입력해주세요.', '아이디, 비밀번호, 이름, 역할은 필수입니다.');
        }

        // 역할 검증
        if (!['admin', 'teacher', 'student'].includes(role)) {
            return badRequestResponse('유효하지 않은 역할입니다.', '역할은 admin, teacher, student 중 하나여야 합니다.');
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.USERS);

        // 중복 아이디 확인
        console.log('Checking for existing user:', username);
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            console.error('Username already exists:', username);
            return badRequestResponse('이미 사용 중인 아이디입니다.');
        }

        // 비밀번호 해싱
        console.log('Hashing password...');
        const hashedPassword = await hashPassword(password);

        // 사용자 데이터 생성
        const teacherId = role === 'teacher' 
            ? `teacher-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
            : undefined;

        const userData = {
            id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            username,
            password: hashedPassword,
            name,
            email: email || '',
            phone: phone || '',
            role,
            teacherId,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        console.log('Inserting user data:', { ...userData, password: '***' });
        const result = await collection.insertOne(userData);
        console.log('User created successfully with ID:', result.insertedId.toString());

        // 비밀번호 제외하고 반환
        const { password: _, ...userWithoutPassword } = userData;

        return successResponse(
            {
                ...userWithoutPassword,
                _id: result.insertedId.toString(),
            },
            '사용자가 생성되었습니다.',
            201
        );
    } catch (error) {
        console.error('Create user error:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
        return handleMongoError(error);
    }
}

