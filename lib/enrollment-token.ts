import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export interface EnrollmentTokenPayload {
    enrollmentId: string;
    courseId: string;
    studentEmail: string;
    studentName: string;
    expiresAt?: number; // 만료 시간 (optional, 기본: 무제한)
}

/**
 * 수강 접근 토큰 생성
 * @param payload 토큰에 포함할 수강 정보
 * @param expiresInDays 만료 일수 (기본: 365일, 0이면 무제한)
 */
export async function generateEnrollmentToken(
    payload: Omit<EnrollmentTokenPayload, 'expiresAt'>,
    expiresInDays = 365
): Promise<string> {
    const jwt = new SignJWT({
        ...payload,
        type: 'enrollment',
    });

    jwt.setProtectedHeader({ alg: 'HS256' });
    jwt.setIssuedAt();
    jwt.setJti(payload.enrollmentId); // JWT ID로 enrollment ID 사용

    // 만료 시간 설정 (0이면 무제한)
    if (expiresInDays > 0) {
        const expiresAt = Math.floor(Date.now() / 1000) + (expiresInDays * 24 * 60 * 60);
        jwt.setExpirationTime(expiresAt);
    }

    return await jwt.sign(SECRET_KEY);
}

/**
 * 수강 접근 토큰 검증
 * @param token 검증할 토큰
 * @returns 토큰이 유효하면 payload 반환, 아니면 null
 */
export async function verifyEnrollmentToken(
    token: string
): Promise<EnrollmentTokenPayload | null> {
    try {
        const verified = await jwtVerify(token, SECRET_KEY);
        const payload = verified.payload as unknown as EnrollmentTokenPayload & { type: string };

        // 토큰 타입 확인
        if (payload.type !== 'enrollment') {
            console.error('Invalid token type:', payload.type);
            return null;
        }

        return {
            enrollmentId: payload.enrollmentId,
            courseId: payload.courseId,
            studentEmail: payload.studentEmail,
            studentName: payload.studentName,
            expiresAt: payload.expiresAt,
        };
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

/**
 * 짧은 접근 코드 생성 (이메일에 포함하기 쉬운 6자리 코드)
 * @returns 6자리 영숫자 코드
 */
export function generateAccessCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 혼동하기 쉬운 문자 제외 (I, O, 0, 1)
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * 토큰에서 강좌 ID 추출 (검증 없이)
 * 빠른 확인용, 실제 검증은 verifyEnrollmentToken 사용
 */
export function extractCourseIdFromToken(token: string): string | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        return payload.courseId || null;
    } catch {
        return null;
    }
}

