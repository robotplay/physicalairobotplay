/**
 * Rate Limiting 유틸리티
 * API 엔드포인트에 Rate Limiting을 적용하여 DDoS 공격 및 남용을 방지합니다.
 */

interface RateLimitConfig {
    windowMs: number; // 시간 윈도우 (밀리초)
    maxRequests: number; // 최대 요청 수
}

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

// 메모리 기반 저장소 (프로덕션에서는 Redis 등 사용 권장)
const store: RateLimitStore = {};

// 기본 설정
const DEFAULT_CONFIG: RateLimitConfig = {
    windowMs: 60 * 1000, // 1분
    maxRequests: 100, // 최대 100회
};

// 엄격한 설정 (로그인, 인증 등)
const STRICT_CONFIG: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15분
    maxRequests: 5, // 최대 5회
};

// 중간 설정 (일반 API)
const MODERATE_CONFIG: RateLimitConfig = {
    windowMs: 60 * 1000, // 1분
    maxRequests: 30, // 최대 30회
};

/**
 * Rate Limit 설정 타입
 */
export type RateLimitType = 'default' | 'strict' | 'moderate' | 'custom';

/**
 * Rate Limit 결과
 */
export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number; // 초 단위
}

/**
 * 클라이언트 식별자 생성
 * IP 주소 또는 사용자 ID를 기반으로 생성
 */
function getIdentifier(request: Request): string {
    // Vercel에서는 x-forwarded-for 헤더 사용
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    
    return ip;
}

/**
 * Rate Limit 체크
 * @param identifier - 클라이언트 식별자
 * @param config - Rate Limit 설정
 * @returns Rate Limit 결과
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult {
    const now = Date.now();
    const key = identifier;
    const record = store[key];

    // 레코드가 없거나 만료된 경우
    if (!record || now > record.resetTime) {
        store[key] = {
            count: 1,
            resetTime: now + config.windowMs,
        };
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetTime: now + config.windowMs,
        };
    }

    // 요청 수 증가
    record.count++;

    // 제한 초과
    if (record.count > config.maxRequests) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return {
            success: false,
            remaining: 0,
            resetTime: record.resetTime,
            retryAfter,
        };
    }

    return {
        success: true,
        remaining: config.maxRequests - record.count,
        resetTime: record.resetTime,
    };
}

/**
 * Rate Limit 미들웨어
 * @param request - Request 객체
 * @param type - Rate Limit 타입
 * @returns Rate Limit 결과
 */
export function rateLimit(
    request: Request,
    type: RateLimitType = 'default'
): RateLimitResult {
    const identifier = getIdentifier(request);
    
    let config: RateLimitConfig;
    switch (type) {
        case 'strict':
            config = STRICT_CONFIG;
            break;
        case 'moderate':
            config = MODERATE_CONFIG;
            break;
        case 'custom':
            // 커스텀 설정은 별도로 전달해야 함
            config = DEFAULT_CONFIG;
            break;
        default:
            config = DEFAULT_CONFIG;
    }

    return checkRateLimit(identifier, config);
}

/**
 * Rate Limit 헤더 추가
 * @param headers - Headers 객체
 * @param result - Rate Limit 결과
 */
export function addRateLimitHeaders(
    headers: Headers,
    result: RateLimitResult
): void {
    headers.set('X-RateLimit-Limit', String(DEFAULT_CONFIG.maxRequests));
    headers.set('X-RateLimit-Remaining', String(result.remaining));
    headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetTime / 1000)));
    
    if (!result.success && result.retryAfter) {
        headers.set('Retry-After', String(result.retryAfter));
    }
}

/**
 * 오래된 레코드 정리 (메모리 누수 방지)
 * 주기적으로 호출해야 함
 */
export function cleanupExpiredRecords(): void {
    const now = Date.now();
    for (const key in store) {
        if (store[key].resetTime < now) {
            delete store[key];
        }
    }
}

// 5분마다 정리 (프로덕션에서는 더 자주 실행 권장)
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupExpiredRecords, 5 * 60 * 1000);
}

