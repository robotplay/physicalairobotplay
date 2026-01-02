/**
 * 환경 변수 검증 유틸리티
 * 앱 시작 시 필수 환경 변수가 설정되어 있는지 확인합니다.
 */

interface EnvValidationResult {
    isValid: boolean;
    missing: string[];
    warnings: string[];
}

/**
 * 필수 환경 변수 목록
 */
const REQUIRED_ENV_VARS = {
    // 프로덕션에서만 필수
    production: [
        'MONGODB_URI',
        // JWT_SECRET은 기본값이 있어서 경고만 표시
    ],
    // 모든 환경에서 필수
    all: [
        // NEXT_PUBLIC_SITE_URL은 기본값이 있어서 선택사항으로 변경
    ],
    // 선택사항 (기능 사용 시 필수)
    optional: {
        'NEXT_PUBLIC_PORTONE_STORE_ID': '결제 시스템',
        'NEXT_PUBLIC_PORTONE_CHANNEL_KEY': '결제 시스템',
        'SMTP_HOST': '이메일 발송',
        'SMTP_USER': '이메일 발송',
        'SMTP_PASSWORD': '이메일 발송',
    },
} as const;

/**
 * 환경 변수 검증
 * @param env - 검증할 환경 (기본값: 현재 환경)
 * @returns 검증 결과
 */
export function validateEnvVars(env: string = process.env.NODE_ENV || 'development'): EnvValidationResult {
    const missing: string[] = [];
    const warnings: string[] = [];

    // 프로덕션 환경에서 필수인 변수 확인
    if (env === 'production') {
        for (const varName of REQUIRED_ENV_VARS.production) {
            if (!process.env[varName]) {
                missing.push(varName);
            }
        }
    }

    // 모든 환경에서 필수인 변수 확인
    for (const varName of REQUIRED_ENV_VARS.all) {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    }

    // 선택사항 변수 확인 (경고만)
    for (const [varName, feature] of Object.entries(REQUIRED_ENV_VARS.optional)) {
        if (!process.env[varName]) {
            warnings.push(`${varName} (${feature} 기능 사용 시 필요)`);
        }
    }

    // JWT_SECRET 기본값 경고
    if (process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
        warnings.push('JWT_SECRET이 기본값으로 설정되어 있습니다. 프로덕션에서는 반드시 변경하세요.');
    }

    return {
        isValid: missing.length === 0,
        missing,
        warnings,
    };
}

/**
 * 환경 변수 검증 및 에러 던지기
 * 프로덕션 환경에서 필수 환경 변수가 없으면 에러를 던집니다.
 */
export function validateEnvOrThrow(): void {
    const env = process.env.NODE_ENV || 'development';
    const result = validateEnvVars(env);

    if (!result.isValid && env === 'production') {
        const errorMessage = [
            '❌ 필수 환경 변수가 설정되지 않았습니다:',
            ...result.missing.map(v => `  - ${v}`),
            '',
            'Vercel 대시보드에서 환경 변수를 설정해주세요:',
            'Settings → Environment Variables → Add New',
        ].join('\n');

        throw new Error(errorMessage);
    }

    // 경고 출력 (프로덕션에서만)
    if (result.warnings.length > 0 && env === 'production') {
        console.warn('⚠️ 환경 변수 경고:');
        result.warnings.forEach(warning => {
            console.warn(`  - ${warning}`);
        });
    }
}

/**
 * 환경 변수 검증 결과를 로그로 출력
 */
export function logEnvValidation(): void {
    const env = process.env.NODE_ENV || 'development';
    const result = validateEnvVars(env);

    if (result.isValid) {
        console.log('✅ 환경 변수 검증 통과');
    } else {
        console.error('❌ 환경 변수 검증 실패:');
        result.missing.forEach(v => {
            console.error(`  - ${v} (필수)`);
        });
    }

    if (result.warnings.length > 0) {
        console.warn('⚠️ 환경 변수 경고:');
        result.warnings.forEach(warning => {
            console.warn(`  - ${warning}`);
        });
    }
}

/**
 * 특정 환경 변수가 설정되어 있는지 확인
 */
export function hasEnvVar(varName: string): boolean {
    return !!process.env[varName];
}

/**
 * 환경 변수 값을 안전하게 가져오기
 * @param varName - 환경 변수 이름
 * @param defaultValue - 기본값
 * @returns 환경 변수 값 또는 기본값
 */
export function getEnvVar(varName: string, defaultValue?: string): string {
    const value = process.env[varName];
    if (!value && defaultValue === undefined) {
        throw new Error(`환경 변수 ${varName}가 설정되지 않았습니다.`);
    }
    return value || defaultValue || '';
}

