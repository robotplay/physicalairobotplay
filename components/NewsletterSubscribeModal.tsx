'use client';

import { useState, useEffect } from 'react';
import { X, Mail, User, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface NewsletterSubscribeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewsletterSubscribeModal({ isOpen, onClose }: NewsletterSubscribeModalProps) {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterName, setNewsletterName] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleNewsletterSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            toast.error('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        setIsSubscribing(true);
        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newsletterEmail,
                    name: newsletterName || undefined,
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('뉴스레터 구독이 완료되었습니다!');
                setNewsletterEmail('');
                setNewsletterName('');
                // 성공 후 모달 닫기 (선택사항 - 사용자 경험에 따라 주석 처리 가능)
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                toast.error(result.error || '구독에 실패했습니다.');
            }
        } catch (error) {
            console.error('뉴스레터 구독 오류:', error);
            toast.error('구독 처리 중 오류가 발생했습니다.');
        } finally {
            setIsSubscribing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    aria-label="닫기"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-deep-electric-blue to-active-orange rounded-full mb-4">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            뉴스레터 구독
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            최신 소식과 교육 정보를 이메일로 받아보세요
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleNewsletterSubscribe} className="space-y-4">
                        <div>
                            <label htmlFor="newsletter-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                이름 (선택)
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="newsletter-name"
                                    type="text"
                                    value={newsletterName}
                                    onChange={(e) => setNewsletterName(e.target.value)}
                                    placeholder="이름을 입력해주세요"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                이메일 주소 <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubscribing}
                            className="w-full py-3 px-4 bg-gradient-to-r from-deep-electric-blue to-active-orange text-white font-semibold rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
                        >
                            {isSubscribing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>구독 중...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>구독하기</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer note */}
                    <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
                        언제든지 구독을 취소할 수 있습니다
                    </p>
                </div>
            </div>
        </div>
    );
}

