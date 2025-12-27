'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function CourseAccessForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const codeFromUrl = searchParams.get('code');

    const [accessCode, setAccessCode] = useState(codeFromUrl || '');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!accessCode || accessCode.length !== 6) {
            toast.error('6자리 접근 코드를 입력해주세요.');
            return;
        }

        setIsVerifying(true);
        const loadingToast = toast.loading('접근 코드 확인 중...');

        try {
            const response = await fetch('/api/online-enrollments/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: accessCode.toUpperCase() }),
            });

            const result = await response.json();

            if (result.success && result.data) {
                toast.success('확인 완료! 강좌로 이동합니다.', { id: loadingToast });
                
                // 토큰을 URL에 포함하여 강좌 페이지로 이동
                const { enrollment, accessToken } = result.data;
                router.push(`/online-courses/${enrollment.courseId}?token=${accessToken}`);
            } else {
                toast.error(result.error || '유효하지 않은 접근 코드입니다.', { id: loadingToast });
            }
        } catch (error) {
            console.error('Verification error:', error);
            toast.error('확인 중 오류가 발생했습니다.', { id: loadingToast });
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-deep-electric-blue via-active-orange to-neon-purple flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 sm:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-deep-electric-blue to-active-orange flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            온라인 강좌 접근
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                            이메일로 받은 6자리 접근 코드를 입력해주세요
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label htmlFor="accessCode" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                접근 코드
                            </label>
                            <input
                                type="text"
                                id="accessCode"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-deep-electric-blue focus:ring-2 focus:ring-deep-electric-blue/20 transition-all font-mono"
                                placeholder="ABC123"
                                maxLength={6}
                                required
                                autoFocus
                                disabled={isVerifying}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                6자리 영문 대문자와 숫자 조합
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isVerifying || accessCode.length !== 6}
                            className="w-full px-6 py-3 bg-gradient-to-r from-deep-electric-blue to-active-orange hover:from-blue-700 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    확인 중...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    수강 시작하기
                                </>
                            )}
                        </button>
                    </form>

                    {/* Help Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                        접근 코드를 받지 못하셨나요?
                                    </h3>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                        • 이메일 스팸함을 확인해주세요<br />
                                        • 수강 신청 시 입력한 이메일로 발송됩니다<br />
                                        • 문제가 계속되면 고객센터로 문의해주세요
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                            📞 문의: 010-0000-0000 | 📧 info@parplay.co.kr
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CourseAccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-deep-electric-blue via-active-orange to-neon-purple flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <CourseAccessForm />
        </Suspense>
    );
}

