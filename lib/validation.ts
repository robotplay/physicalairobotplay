/**
 * 입력 데이터 검증 및 정제 유틸리티
 */

/**
 * HTML 이스케이프 함수 (XSS 방지)
 */
export function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 이메일 주소 검증
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 전화번호 정규화 (하이픈 제거 등)
 */
export function normalizePhone(phone: string): string {
    return phone.replace(/[-\s()]/g, '');
}

/**
 * 전화번호 형식 검증 (한국 형식)
 */
export function isValidPhone(phone: string): boolean {
    const normalized = normalizePhone(phone);
    // 한국 전화번호: 010, 011, 016, 017, 018, 019로 시작하고 10-11자리
    const phoneRegex = /^(010|011|016|017|018|019)[0-9]{7,8}$/;
    return phoneRegex.test(normalized);
}

/**
 * 텍스트 길이 제한 및 정제
 */
export function sanitizeText(text: string, maxLength: number = 10000): string {
    return text.trim().substring(0, maxLength);
}

/**
 * 이름 검증 (한글, 영문, 숫자, 공백 허용)
 */
export function isValidName(name: string): boolean {
    if (!name || name.trim().length === 0) return false;
    if (name.length > 50) return false;
    // 한글, 영문, 숫자, 공백만 허용
    const nameRegex = /^[가-힣a-zA-Z0-9\s]+$/;
    return nameRegex.test(name);
}

/**
 * 입력 데이터 정제 및 검증
 */
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export function validateConsultationInput(data: {
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
}): ValidationResult {
    const errors: string[] = [];

    // 이름 검증
    if (!data.name || data.name.trim().length === 0) {
        errors.push('이름을 입력해주세요.');
    } else if (!isValidName(data.name)) {
        errors.push('이름은 한글, 영문, 숫자만 사용할 수 있습니다.');
    } else if (data.name.length > 50) {
        errors.push('이름은 50자 이하로 입력해주세요.');
    }

    // 전화번호 검증
    if (!data.phone || data.phone.trim().length === 0) {
        errors.push('전화번호를 입력해주세요.');
    } else if (!isValidPhone(data.phone)) {
        errors.push('올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
    }

    // 이메일 검증 (선택사항이지만 입력된 경우 검증)
    if (data.email && data.email.trim().length > 0) {
        if (!isValidEmail(data.email)) {
            errors.push('올바른 이메일 주소를 입력해주세요.');
        } else if (data.email.length > 255) {
            errors.push('이메일 주소는 255자 이하로 입력해주세요.');
        }
    }

    // 메시지 검증
    if (!data.message || data.message.trim().length === 0) {
        errors.push('문의 내용을 입력해주세요.');
    } else if (data.message.length > 5000) {
        errors.push('문의 내용은 5000자 이하로 입력해주세요.');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}







