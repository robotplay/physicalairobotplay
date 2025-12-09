'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        let ticking = false;
        
        const handleMouseMove = (e: MouseEvent) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setMousePosition({
                        x: (e.clientX / window.innerWidth - 0.5) * 20,
                        y: (e.clientY / window.innerHeight - 0.5) * 20,
                    });
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden pt-20">
            {/* Animated Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 transition-transform duration-700 ease-out"
                    style={{
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
                    }}
                >
                    <Image
                        src="/hero-bg.png"
                        alt="Physical AI Education"
                        fill
                        className="object-cover brightness-50"
                        priority
                        quality={85}
                        sizes="100vw"
                        onError={(e) => {
                            // Fallback to gradient if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                </div>
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-deep-electric-blue/20 via-transparent to-active-orange/20 animate-pulse"></div>
            </div>

            {/* Floating particles - Reduced for performance */}
            <div className="absolute inset-0 z-5 overflow-hidden">
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
                
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-humanoid-white via-active-orange to-neon-purple animate-gradient">
                        상상을 현실로
                    </span>
                    <span className="block mt-2">만드는 피지컬 AI 교육</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
                    코드가 화면 밖으로 나와 로봇이 되어 움직이는 순간,<br className="hidden md:block" />
                    아이들의 호기심은 혁신이 됩니다.
                </p>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-delay-2">
                    <button className="group px-8 py-4 bg-deep-electric-blue hover:bg-blue-700 text-white font-bold rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(0,82,255,0.6)] hover:shadow-[0_0_40px_rgba(0,82,255,0.8)] flex items-center gap-2">
                        교육 과정 보기
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold rounded-full transition-all transform hover:scale-105 active:scale-95 hover:border-white/50">
                        상담 문의하기
                    </button>
                </div>
            </div>

            {/* Enhanced Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2 backdrop-blur-sm bg-white/5">
                    <div className="w-1 h-2 bg-white rounded-full animate-scroll-indicator"></div>
                </div>
            </div>
        </section>
    );
}
