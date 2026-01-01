'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { logger } from '@/lib/logger';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 중복 제출 방지
        if (isLoading) {
            logger.log('[Admin Login] Already submitting, ignoring...');
            return;
        }
        
        // 입력값 검증
        if (!username.trim() || !password.trim()) {
            toast.error('아이디와 비밀번호를 입력해주세요.');
            return;
        }
        
        setError('');
        setIsLoading(true);

        const loadingToast = toast.loading('로그인 중...');

        try {
            logger.log('[Admin Login] Submitting login request...');
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                cache: 'no-store',
                body: JSON.stringify({ username: username.trim(), password }),
            });

            const result = await response.json();
            
            logger.log('[Admin Login] Response:', {
                status: response.status,
                ok: response.ok,
                success: result.success,
                error: result.error,
            });

            if (result.success) {
                // JWT 인증 성공 - 쿠키에 토큰이 자동 설정됨
                toast.success('로그인 성공!', { id: loadingToast });
                
                // 쿠키 설정 완료를 위한 충분한 지연 후 리다이렉트
                // 전체 페이지 리로드를 통해 쿠키 반영 보장
                setTimeout(() => {
                    logger.log('[Admin Login] Redirecting to /admin');
                    window.location.href = '/admin';
                }, 800);
            } else {
                toast.error(result.error || '로그인에 실패했습니다.', { id: loadingToast });
                setError(result.error || '로그인에 실패했습니다.');
                setIsLoading(false);
            }
        } catch (error) {
            logger.error('[Admin Login] Error:', error);
            toast.error('로그인 중 오류가 발생했습니다.', { id: loadingToast });
            setError('로그인 중 오류가 발생했습니다.');
            setIsLoading(false);
        }
    };
    
    // 엔터 키 핸들러 - 폼 제출 버튼 클릭
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading && username.trim() && password.trim()) {
            e.preventDefault();
            // 제출 버튼 클릭으로 폼 제출
            const submitButton = e.currentTarget.closest('form')?.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-electric-blue via-active-orange to-neon-purple p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-deep-electric-blue to-active-orange flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            관리자 로그인
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                            상담 문의 관리 페이지에 접근하려면<br />비밀번호를 입력해주세요
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                아이디
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-deep-electric-blue focus:ring-2 focus:ring-deep-electric-blue/20 transition-all"
                                    placeholder="관리자 아이디"
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                비밀번호
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-deep-electric-blue focus:ring-2 focus:ring-deep-electric-blue/20 transition-all"
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer transition-colors"
                                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !username || !password}
                            className="w-full px-6 py-3 bg-gradient-to-r from-deep-electric-blue to-active-orange hover:from-blue-700 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 touch-manipulation cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    확인 중...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5" />
                                    로그인
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                            💡 관리자 계정이 없다면 먼저 생성해주세요
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

