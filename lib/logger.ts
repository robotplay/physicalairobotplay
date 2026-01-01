/**
 * 환경별 로깅 유틸리티
 * 프로덕션에서는 console.log를 제거하고, 에러만 로깅합니다.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
    /**
     * 개발 환경에서만 로그 출력
     */
    log: (...args: any[]) => {
        if (isDevelopment) {
            console.log('[LOG]', ...args);
        }
    },

    /**
     * 개발 환경에서만 정보 로그 출력
     */
    info: (...args: any[]) => {
        if (isDevelopment) {
            console.info('[INFO]', ...args);
        }
    },

    /**
     * 경고 로그 (항상 출력)
     */
    warn: (...args: any[]) => {
        console.warn('[WARN]', ...args);
    },

    /**
     * 에러 로그 (항상 출력)
     */
    error: (...args: any[]) => {
        console.error('[ERROR]', ...args);
    },

    /**
     * 디버그 로그 (개발 환경에서만)
     */
    debug: (...args: any[]) => {
        if (isDevelopment) {
            console.debug('[DEBUG]', ...args);
        }
    },
};

