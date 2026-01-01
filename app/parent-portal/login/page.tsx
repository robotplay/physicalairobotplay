'use client';

import { useState, useEffect } from 'react';
import { User, Phone, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ParentLoginPage() {
    const [formData, setFormData] = useState({
        studentId: '',
        parentPhone: '',
    });
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // 페이지 로드 시 인증 상태 확인
    useEffect(() => {
        console.log('=== PARENT LOGIN PAGE LOADED ===');
        let isMounted = true;
        
        // URL에서 로그아웃 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const isLogout = urlParams.get('logout') === 'true';
        
        if (isLogout) {
            // 로그아웃 직후이므로 인증 체크 스킵
            console.log('Logout parameter detected, skipping auth check');
            if (isMounted) {
                setCheckingAuth(false);
            }
            // URL에서 쿼리 파라미터 제거
            window.history.replaceState({}, '', '/parent-portal/login');
            return;
        }
        
        const checkAuth = async () => {
            try {
                console.log('Checking if already authenticated...');
                
                // 타임아웃 설정 (3초로 단축 - 빠른 응답을 위해)
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('인증 확인 시간 초과')), 3000);
                });
                
                const fetchPromise = fetch('/api/auth/me', {
                    credentials: 'include',
                    cache: 'no-store', // 캐시 사용 안 함
                });
                
                const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
                
                if (!isMounted) return;
                
                // 응답이 401 또는 403이면 인증되지 않은 것으로 간주
                if (response.status === 401 || response.status === 403) {
                    console.log('Not authenticated (401/403), showing login form');
                    if (isMounted) {
                        setCheckingAuth(false);
                    }
                    return;
                }
                
                const result = await response.json();
                console.log('Auth check result:', result);
                
                // 이미 로그인된 경우 포털로 리다이렉트
                if (result.success && result.user && result.user.role === 'parent' && result.user.studentId) {
                    console.log('Already authenticated, redirecting to portal...');
                    window.location.href = '/parent-portal';
                    return;
                }
                
                console.log('Not authenticated, showing login form');
                if (isMounted) {
                    setCheckingAuth(false);
                }
            } catch (error) {
                console.error('Auth check error:', error);
                // 에러가 발생해도 로그인 폼 표시 (로그아웃 직후일 수 있음)
                if (isMounted) {
                    setCheckingAuth(false);
                }
            }
        };
        
        checkAuth();
        
        return () => {
            isMounted = false;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 중복 제출 방지
        if (loading) {
            console.log('[Parent Login] Already submitting, ignoring...');
            return;
        }
        
        // 입력값 검증
        if (!formData.studentId.trim() || !formData.parentPhone.trim()) {
            toast.error('학생 ID와 학부모 연락처를 입력해주세요.');
            return;
        }
        
        console.log('[Parent Login] Form submitted');
        setLoading(true);

        // 전화번호 정규화 (하이픈 제거)
        const normalizedPhone = formData.parentPhone.replace(/[-\s]/g, '');
        const loginData = {
            studentId: formData.studentId.trim(),
            parentPhone: normalizedPhone,
        };

        console.log('[Parent Login] Login attempt:', loginData);

        try {
            const response = await fetch('/api/auth/parent-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
                credentials: 'include',
                cache: 'no-store',
            });

            console.log('[Parent Login] Response status:', response.status);

            let result;
            try {
                result = await response.json();
                console.log('[Parent Login] Response result:', result);
            } catch (jsonError) {
                console.error('[Parent Login] JSON parse error:', jsonError);
                const text = await response.text();
                console.error('[Parent Login] Response text:', text);
                throw new Error('서버 응답을 파싱할 수 없습니다.');
            }

            if (!response.ok || !result.success) {
                const errorMessage = result.error || '로그인 실패';
                console.error('[Parent Login] Login failed:', errorMessage);
                toast.error(errorMessage, { duration: 3000 });
                setLoading(false);
                return;
            }

            // 로그인 성공
            console.log('[Parent Login] Login successful, redirecting...');
            toast.success('로그인 성공', { duration: 800 });
            
            // 쿠키 설정 완료를 위한 충분한 지연 후 리다이렉트
            setTimeout(() => {
                console.log('[Parent Login] Redirecting to /parent-portal');
                window.location.href = '/parent-portal';
            }, 800);
        } catch (error) {
            console.error('[Parent Login] Error:', error);
            const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
            toast.error(errorMessage);
            setLoading(false);
        }
    };
    
    // 엔터 키 핸들러 - 폼 제출 버튼 클릭
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !loading && formData.studentId.trim() && formData.parentPhone.trim()) {
            e.preventDefault();
            // 제출 버튼 클릭으로 폼 제출
            const submitButton = e.currentTarget.closest('form')?.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
            }
        }
    };

    // 인증 체크 중이면 로딩 표시
    if (checkingAuth) {
        return (
            <main className="min-h-screen bg-gray-50 dark:bg-black pt-24 sm:pt-28 pb-8 sm:pb-12">
                <div className="max-w-md mx-auto px-4 sm:px-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-deep-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">인증 상태 확인 중...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pt-24 sm:pt-28 pb-8 sm:pb-12">
            <div className="max-w-md mx-auto px-4 sm:px-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-deep-electric-blue to-active-orange flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            학부모 포털 로그인
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            학생 ID와 학부모 연락처로 로그인하세요
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                학생 ID
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    onKeyPress={handleKeyPress}
                                    required
                                    placeholder="student-xxxxx"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                학부모 연락처
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    value={formData.parentPhone}
                                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                    onKeyPress={handleKeyPress}
                                    required
                                    placeholder="010-1234-5678"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-deep-electric-blue hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-all font-semibold"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    로그인
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

