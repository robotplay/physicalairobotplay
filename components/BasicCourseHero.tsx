'use client';

import Image from 'next/image';
import { Sparkles, ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import ConsultationModal from './ConsultationModal';

export default function BasicCourseHero() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <section className="relative h-screen min-h-[500px] sm:min-h-[600px] flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 bg-[#1A1A1A]">
                <div className="absolute inset-0 bg-gradient-to-br from-active-orange/20 via-transparent to-deep-electric-blue/20"></div>
                {/* Subtle animated background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-active-orange rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-deep-electric-blue rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
            </div>

            {/* Floating particles - Reduced for performance */}
            <div className="absolute inset-0 z-[5] overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-active-orange rounded-full opacity-40 animate-float will-change-transform"
                        style={{
                            left: `${(i * 12) % 100}%`,
                            top: `${(i * 18) % 100}%`,
                            animationDelay: `${i * 0.6}s`,
                            animationDuration: `${3 + (i % 3)}s`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-active-orange/20 backdrop-blur-md rounded-full border border-active-orange/40 mb-6 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-active-orange animate-spin-slow" />
                    <span className="text-sm text-active-orange font-semibold">BASIC COURSE</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 px-2">
                    <span className="block text-white">
                        상상이 현실로 움직이는 시작,
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-active-orange via-orange-500 to-deep-electric-blue animate-gradient">
                        Basic Course
                    </span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10">
                    로봇의 구조를 이해하고, 내가 짠 코드로 로봇을 직접 움직여보세요.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-delay-2 px-4 mt-6 mb-24 sm:mb-32">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 sm:px-10 sm:py-5 bg-active-orange active:bg-orange-600 hover:bg-orange-600 text-white text-base sm:text-lg font-bold rounded-full transition-all transform active:scale-95 hover:scale-105 shadow-[0_0_30px_rgba(255,107,0,0.5)] hover:shadow-[0_0_40px_rgba(255,107,0,0.7)] touch-manipulation cursor-pointer"
                        aria-label="수강 상담 신청하기"
                        type="button"
                    >
                        수강 상담 신청하기
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 sm:bottom-16 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <div className="w-6 h-10 border-2 border-active-orange/70 rounded-full flex justify-center pt-2 backdrop-blur-sm bg-white/10">
                    <div className="w-1 h-2 bg-active-orange rounded-full animate-scroll-indicator"></div>
                </div>
            </div>

            {/* Consultation Modal */}
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}

