'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import ConsultationModal from "./ConsultationModal";

export default function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        // Only enable parallax on desktop (not mobile/tablet)
        if (typeof window === 'undefined' || window.innerWidth < 1024) return;
        
        let ticking = false;
        let rafId: number | null = null;
        
        const handleMouseMove = (e: MouseEvent) => {
            if (!ticking) {
                rafId = window.requestAnimationFrame(() => {
                    const width = window.innerWidth || 1920;
                    const height = window.innerHeight || 1080;
                    setMousePosition({
                        x: (e.clientX / width - 0.5) * 20,
                        y: (e.clientY / height - 0.5) * 20,
                    });
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafId !== null) {
                window.cancelAnimationFrame(rafId);
            }
        };
    }, []);

    return (
        <section className="relative h-screen min-h-[500px] sm:min-h-[600px] flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
            {/* Animated Background Image */}
            <div className="absolute inset-0 z-0 bg-[#1A1A1A]">
                <div
                    className="absolute inset-0 transition-transform duration-700 ease-out"
                    style={{
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
                    }}
                >
                    <Image
                        src="/hero-bg.png"
                        alt="피지컬 AI 로봇 교육 - 학생들이 로봇을 조작하며 학습하는 모습"
                        fill
                        className="object-cover brightness-50"
                        priority
                        quality={85}
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-deep-electric-blue/20 via-transparent to-active-orange/20 animate-pulse"></div>
            </div>

            {/* Floating particles - Reduced for performance */}
            <div className="absolute inset-0 z-[5] overflow-hidden">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-float will-change-transform"
                        style={{
                            left: `${(i * 10) % 100}%`,
                            top: `${(i * 15) % 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + (i % 3)}s`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-active-orange animate-spin-slow" />
                    <span className="text-sm text-white font-semibold">Physical AI Robot Play</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg px-2">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-humanoid-white via-active-orange to-neon-purple animate-gradient">
                        상상을 현실로
                    </span>
                    <span className="block mt-1 md:mt-2">만드는 피지컬 AI 교육</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay px-4">
                    코드가 화면 밖으로 나와 로봇이 되어 움직이는 순간,<br className="hidden sm:block" />
                    아이들의 호기심은 혁신이 됩니다.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-delay-2 px-4 mt-6 mb-24 sm:mb-32">
                    <Link 
                        href="/curriculum"
                        className="group px-6 py-3 sm:px-8 sm:py-4 bg-deep-electric-blue active:bg-blue-700 hover:bg-blue-700 text-white text-sm sm:text-base font-bold rounded-full transition-all transform active:scale-95 hover:scale-110 shadow-[0_0_30px_rgba(0,82,255,0.6)] hover:shadow-[0_0_40px_rgba(0,82,255,0.8)] flex items-center justify-center gap-2 touch-manipulation cursor-pointer"
                        aria-label="교육 과정 보기"
                    >
                        교육 과정 보기
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Link>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 active:bg-white/20 hover:bg-white/20 backdrop-blur-md text-white text-sm sm:text-base border border-white/30 font-bold rounded-full transition-all transform active:scale-95 hover:scale-105 hover:border-white/50 touch-manipulation cursor-pointer"
                        aria-label="상담 문의하기"
                        type="button"
                    >
                        상담 문의하기
                    </button>
                </div>
            </div>

            {/* Enhanced Scroll Indicator */}
            <div className="absolute bottom-12 sm:bottom-16 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2 backdrop-blur-sm bg-white/5">
                    <div className="w-1 h-2 bg-white rounded-full animate-scroll-indicator"></div>
                </div>
            </div>

            {/* Consultation Modal */}
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}
