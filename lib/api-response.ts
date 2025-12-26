import { NextResponse } from 'next/server';

/**
 * 표준화된 API 응답 유틸리티
 */

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
    details?: string;
    code?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * 성공 응답 생성
 */
export function successResponse<T>(data: T, message?: string, status = 200): NextResponse<ApiSuccessResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            ...(message && { message }),
        },
        { status }
    );
}

/**
 * 에러 응답 생성
 */
export function errorResponse(
    error: string,
    status = 500,
    details?: string,
    code?: string
): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        {
            success: false,
            error,
            ...(details && { details }),
            ...(code && { code }),
        },
        { status }
    );
}

/**
 * 인증 에러 응답
 */
export function unauthorizedResponse(message = '인증되지 않았습니다.'): NextResponse<ApiErrorResponse> {
    return errorResponse(message, 401, undefined, 'UNAUTHORIZED');
}

/**
 * 권한 에러 응답
 */
export function forbiddenResponse(message = '권한이 없습니다.'): NextResponse<ApiErrorResponse> {
    return errorResponse(message, 403, undefined, 'FORBIDDEN');
}

/**
 * 잘못된 요청 에러 응답
 */
export function badRequestResponse(message: string, details?: string): NextResponse<ApiErrorResponse> {
    return errorResponse(message, 400, details, 'BAD_REQUEST');
}

/**
 * 찾을 수 없음 에러 응답
 */
export function notFoundResponse(message = '리소스를 찾을 수 없습니다.'): NextResponse<ApiErrorResponse> {
    return errorResponse(message, 404, undefined, 'NOT_FOUND');
}

/**
 * 서버 에러 응답
 */
export function serverErrorResponse(message = '서버 오류가 발생했습니다.', details?: string): NextResponse<ApiErrorResponse> {
    return errorResponse(message, 500, details, 'SERVER_ERROR');
}

/**
 * MongoDB 에러 처리
 */
export function handleMongoError(error: unknown): NextResponse<ApiErrorResponse> {
    console.error('MongoDB error:', error);
    
    if (error instanceof Error) {
        // 중복 키 에러
        if ('code' in error && error.code === 11000) {
            return errorResponse('이미 존재하는 데이터입니다.', 409, error.message, 'DUPLICATE_KEY');
        }
        
        // 연결 에러
        if (error.message.includes('EBADNAME') || error.message.includes('querySrv')) {
            return errorResponse(
                '데이터베이스 연결에 실패했습니다.',
                503,
                '데이터베이스 연결 문자열을 확인해주세요.',
                'DB_CONNECTION_ERROR'
            );
        }
        
        return serverErrorResponse('데이터베이스 오류가 발생했습니다.', error.message);
    }
    
    return serverErrorResponse();
}

/**
 * 일반 에러 처리
 */
export function handleError(error: unknown, context?: string): NextResponse<ApiErrorResponse> {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    
    if (error instanceof Error) {
        return serverErrorResponse('처리 중 오류가 발생했습니다.', error.message);
    }
    
    return serverErrorResponse();
}

