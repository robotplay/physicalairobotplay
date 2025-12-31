'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ParentLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        studentId: '',
        parentPhone: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 전화번호 정규화 (하이픈 제거)
        const normalizedPhone = formData.parentPhone.replace(/[-\s]/g, '');
        const loginData = {
            studentId: formData.studentId.trim(),
            parentPhone: normalizedPhone,
        };

        console.log('Login attempt:', loginData);

        try {
            const response = await fetch('/api/auth/parent-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
                credentials: 'include',
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            let result;
            try {
                result = await response.json();
                console.log('Response result:', result);
            } catch (jsonError) {
                console.error('JSON parse error:', jsonError);
                const text = await response.text();
                console.error('Response text:', text);
                throw new Error('서버 응답을 파싱할 수 없습니다.');
            }

            if (!response.ok || !result.success) {
                const errorMessage = result.error || '로그인 실패';
                console.error('Login failed:', errorMessage);
                toast.error(errorMessage);
                setLoading(false);
                return;
            }

            // 로그인 성공 - 즉시 리다이렉트
            console.log('Login successful, redirecting...');
            
            // 토스트 메시지 표시 후 리다이렉트
            toast.success('로그인 성공', { duration: 500 });
            
            // 쿠키 설정을 위한 짧은 지연 후 강제 리다이렉트
            setTimeout(() => {
                console.log('Redirecting to /parent-portal');
                // window.location.replace 대신 href 사용 (더 확실함)
                window.location.href = '/parent-portal';
            }, 300);
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
            toast.error(errorMessage);
            setLoading(false);
        }
    };

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
                                    required
                                    placeholder="student-xxxxx"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
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
                                    required
                                    placeholder="010-1234-5678"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
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

