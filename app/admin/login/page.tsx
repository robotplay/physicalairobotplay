'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // 간단한 비밀번호 검증 (실제로는 환경 변수나 API로 확인)
        // 프로덕션에서는 서버 사이드에서 검증해야 합니다
        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '111111';
        
        setTimeout(() => {
            if (password === adminPassword) {
                // 세션 스토리지에 인증 정보 저장
                sessionStorage.setItem('admin-authenticated', 'true');
                sessionStorage.setItem('admin-login-time', Date.now().toString());
                router.push('/admin');
            } else {
                setError('비밀번호가 올바르지 않습니다.');
                setIsLoading(false);
            }
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep-electric-blue via-active-orange to-neon-purple p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-deep-electric-blue to-active-orange flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            관리자 로그인
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            상담 문의 관리 페이지에 접근하려면<br />비밀번호를 입력해주세요
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                비밀번호
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200"
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
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
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full px-6 py-3 bg-gradient-to-r from-deep-electric-blue to-active-orange hover:from-blue-700 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 touch-manipulation"
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

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-center text-gray-500">
                            💡 비밀번호는 .env.local 파일에서 관리됩니다
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

