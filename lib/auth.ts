import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export interface User {
    _id: string;
    id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    role: 'admin' | 'teacher' | 'student';
    teacherId?: string;
    status: 'active' | 'inactive';
}

export interface JWTPayload {
    userId: string;
    username: string;
    role: 'admin' | 'teacher' | 'student';
    name: string;
    [key: string]: unknown; // jose의 JWTPayload와 호환되도록 인덱스 시그니처 추가
}

// 비밀번호 해싱
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

// 비밀번호 검증
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// JWT 토큰 생성
export async function createToken(payload: JWTPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);
}

// JWT 토큰 검증
export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as JWTPayload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

// 역할 체크
export function hasPermission(userRole: string, requiredRole: 'admin' | 'teacher' | 'student'): boolean {
    const roleHierarchy = { admin: 3, teacher: 2, student: 1 };
    return roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole];
}

