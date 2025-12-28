'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Mail, X } from 'lucide-react';
import ConsultationModal from './ConsultationModal';
import NewsletterSubscribeModal from './NewsletterSubscribeModal';

// 카카오톡 아이콘 SVG
const KakaoIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
    </svg>
);

export default function FloatingConsultationButton() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
    const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    // 카카오톡 채널 링크 (환경 변수 또는 기본값)
    const kakaoChannelUrl = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/_RuUyn';

    // 외부 클릭 시 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleButtonClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleConsultationClick = () => {
        setIsMenuOpen(false);
        setIsConsultationModalOpen(true);
    };

    const handleNewsletterClick = () => {
        setIsMenuOpen(false);
        setIsNewsletterModalOpen(true);
    };

    const handleKakaoChannelClick = () => {
        setIsMenuOpen(false);
        // 카카오톡 채널 링크 열기 (새 탭에서 열기)
        window.open(kakaoChannelUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            {/* 플로팅 버튼 및 메뉴 */}
            <div className="fixed bottom-6 right-6 z-50" ref={menuRef}>
                {/* 선택 메뉴 */}
                {isMenuOpen && (
                    <div className="absolute bottom-20 right-0 mb-2 animate-fade-in">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden min-w-[200px]">
                            <button
                                onClick={handleConsultationClick}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-deep-electric-blue to-active-orange rounded-full flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                        상담 문의하기
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        전문 상담사와 상담
                                    </div>
                                </div>
                            </button>
                            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                            <button
                                onClick={handleNewsletterClick}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-gradient-to-r from-deep-electric-blue to-active-orange rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                        뉴스레터 구독
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        최신 소식 받아보기
                                    </div>
                                </div>
                            </button>
                            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                            <button
                                onClick={handleKakaoChannelClick}
                                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                            >
                                <div className="w-10 h-10 bg-[#FEE500] rounded-full flex items-center justify-center flex-shrink-0">
                                    <KakaoIcon className="w-6 h-6 text-[#000000]" />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                        카카오톡 채널
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        @parplay 단톡방 참여
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* 메인 버튼 */}
                <button
                    onClick={handleButtonClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="group relative"
                    aria-label="문의하기"
                >
                    {/* 애니메이션 효과 (펄스) */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-deep-electric-blue to-active-orange rounded-full opacity-75 blur-lg animate-pulse group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* 버튼 본체 */}
                    <div className="relative w-16 h-16 bg-gradient-to-r from-deep-electric-blue to-active-orange rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-active:scale-95">
                        {isMenuOpen ? (
                            <X className="w-8 h-8 text-white" />
                        ) : (
                            <MessageCircle className="w-8 h-8 text-white" />
                        )}
                    </div>

                    {/* 알림 배지 */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                        <span className="text-xs text-white font-bold">!</span>
                    </div>

                    {/* 텍스트 라벨 */}
                    <div 
                        className={`
                            absolute right-20 top-1/2 -translate-y-1/2 
                            bg-gray-900 dark:bg-gray-800 text-white px-4 py-2 rounded-lg 
                            whitespace-nowrap shadow-xl border border-gray-700
                            transition-all duration-300 ease-out
                            ${isHovered && !isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}
                        `}
                    >
                        <span className="text-sm font-semibold">문의하기</span>
                        {/* 화살표 */}
                        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900 dark:border-l-gray-800"></div>
                    </div>
                </button>
            </div>

            {/* 상담 모달 */}
            <ConsultationModal 
                isOpen={isConsultationModalOpen} 
                onClose={() => setIsConsultationModalOpen(false)} 
            />

            {/* 뉴스레터 구독 모달 */}
            <NewsletterSubscribeModal
                isOpen={isNewsletterModalOpen}
                onClose={() => setIsNewsletterModalOpen(false)}
            />
        </>
    );
}

