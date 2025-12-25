'use client';

import { useState } from 'react';
import Image from "next/image";
import ConsultationModal from "./ConsultationModal";
import { trackCTAClick, trackConsultation } from "@/lib/analytics";

export default function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCurriculumClick = () => {
        trackCTAClick('교육 과정 보기', 'hero');
    };

    const handleConsultationClick = () => {
        trackConsultation('open', 'hero');
        setIsModalOpen(true);
    };

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-bg.png"
                    alt="Physical AI Education"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-humanoid-white to-active-orange">
                        상상을 현실로
                    </span>
                    만드는 피지컬 AI 교육
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                    코드가 화면 밖으로 나와 로봇이 되어 움직이는 순간,<br className="hidden md:block" />
                    아이들의 호기심은 혁신이 됩니다.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <a 
                        href="/curriculum"
                        onClick={handleCurriculumClick}
                        className="px-8 py-4 bg-deep-electric-blue hover:bg-blue-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,82,255,0.5)] text-center cursor-pointer"
                    >
                        교육 과정 보기
                    </a>
                    <button 
                        onClick={handleConsultationClick}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold rounded-full transition-all cursor-pointer"
                        type="button"
                    >
                        상담 문의하기
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-white rounded-full"></div>
                </div>
            </div>

            {/* Consultation Modal */}
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}
