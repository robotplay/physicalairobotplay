'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ConsultationModal from './ConsultationModal';

export default function FloatingConsultationButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            {/* 플로팅 버튼 */}
            <button
                onClick={() => setIsModalOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="fixed bottom-6 right-6 z-50 group"
                aria-label="상담 문의하기"
            >
                {/* 메인 버튼 */}
                <div className="relative">
                    {/* 애니메이션 효과 (펄스) */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-deep-electric-blue to-active-orange rounded-full opacity-75 blur-lg animate-pulse group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* 버튼 본체 */}
                    <div className="relative w-16 h-16 bg-gradient-to-r from-deep-electric-blue to-active-orange rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-active:scale-95">
                        <MessageCircle className="w-8 h-8 text-white" />
                    </div>

                    {/* 알림 배지 (선택사항) */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                        <span className="text-xs text-white font-bold">!</span>
                    </div>
                </div>

                {/* 텍스트 라벨 */}
                <div 
                    className={`
                        absolute right-20 top-1/2 -translate-y-1/2 
                        bg-gray-900 text-white px-4 py-2 rounded-lg 
                        whitespace-nowrap shadow-xl border border-gray-700
                        transition-all duration-300 ease-out
                        ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}
                    `}
                >
                    <span className="text-sm font-semibold">상담 문의하기</span>
                    {/* 화살표 */}
                    <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
                </div>
            </button>

            {/* 상담 모달 */}
            <ConsultationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
}

