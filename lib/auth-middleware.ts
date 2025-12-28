import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export interface AuthUser {
    _id: string;
    username: string;
    name: string;
    email: string;
    role: 'admin' | 'teacher';
    teacherId?: string;
}

/**
 * 인증 미들웨어
 * JWT 토큰을 검증하고 사용자 정보를 반환
 */
export async function authenticate(request: NextRequest): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return { user: null, error: '인증 토큰이 없습니다.' };
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return { user: null, error: '유효하지 않은 토큰입니다.' };
        }

        return { user: decoded as unknown as AuthUser, error: null };
    } catch (error) {
        console.error('Authentication error:', error);
        return { user: null, error: '인증에 실패했습니다.' };
    }
}

/**
 * 관리자 권한 체크 (간편 버전)
 */
export async function verifyAdminAuth(request: NextRequest): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    const { user, error } = await authenticate(request);

    if (!user) {
        return { success: false, error: error || '인증이 필요합니다.' };
    }

    if (user.role !== 'admin') {
        return { success: false, error: '관리자 권한이 필요합니다.' };
    }

    return { success: true, user };
}

/**
 * 관리자 권한 체크
 */
export async function requireAdmin(request: NextRequest): Promise<{ user: AuthUser | null; response: NextResponse | null }> {
    const { user, error } = await authenticate(request);

    if (!user) {
        return {
            user: null,
            response: NextResponse.json(
                { success: false, error: error || '인증이 필요합니다.' },
                { status: 401 }
            ),
        };
    }

    if (user.role !== 'admin') {
        return {
            user: null,
            response: NextResponse.json(
                { success: false, error: '관리자 권한이 필요합니다.' },
                { status: 403 }
            ),
        };
    }

    return { user, response: null };
}

/**
 * 강사 권한 체크
 */
export async function requireTeacher(request: NextRequest): Promise<{ user: AuthUser | null; response: NextResponse | null }> {
    const { user, error } = await authenticate(request);

    if (!user) {
        return {
            user: null,
            response: NextResponse.json(
                { success: false, error: error || '인증이 필요합니다.' },
                { status: 401 }
            ),
        };
    }

    if (user.role !== 'teacher' && user.role !== 'admin') {
        return {
            user: null,
            response: NextResponse.json(
                { success: false, error: '강사 또는 관리자 권한이 필요합니다.' },
                { status: 403 }
            ),
        };
    }

    return { user, response: null };
}

/**
 * 리소스 소유자 체크
 * 강사가 자신의 리소스만 수정/삭제할 수 있도록 체크
 */
export function checkResourceOwnership(user: AuthUser, resourceOwnerId: string): boolean {
    // 관리자는 모든 리소스 접근 가능
    if (user.role === 'admin') {
        return true;
    }

    // 강사는 자신의 리소스만 접근 가능
    if (user.role === 'teacher') {
        return user._id === resourceOwnerId || user.teacherId === resourceOwnerId;
    }

    return false;
}

/**
 * 강좌 소유자 체크
 */
export function checkCourseOwnership(user: AuthUser, courseTeacherId?: string): boolean {
    // 관리자는 모든 강좌 접근 가능
    if (user.role === 'admin') {
        return true;
    }

    // 강사는 자신의 강좌만 접근 가능
    if (user.role === 'teacher' && courseTeacherId) {
        return user.teacherId === courseTeacherId;
    }

    return false;
}

/**
 * 게시글 소유자 체크
 */
export function checkPostOwnership(user: AuthUser, postAuthorId?: string): boolean {
    // 관리자는 모든 게시글 접근 가능
    if (user.role === 'admin') {
        return true;
    }

    // 강사는 자신의 게시글만 접근 가능
    if (user.role === 'teacher' && postAuthorId) {
        return user._id === postAuthorId;
    }

    return false;
}

