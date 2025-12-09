'use client';

import Image from 'next/image';
import { Sparkles, ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BasicCourseHero() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-active-orange/20 via-transparent to-deep-electric-blue/20"></div>
                {/* Placeholder for hero image - replace with actual image */}
                <div className="w-full h-full bg-gradient-to-br from-orange-100 via-orange-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
            </div>

            {/* Floating particles - Reduced for performance */}
            <div className="absolute inset-0 z-5 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-active-orange rounded-full opacity-20 animate-float will-change-transform"
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
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-active-orange/10 backdrop-blur-md rounded-full border border-active-orange/20 mb-6 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-active-orange animate-spin-slow" />
                    <span className="text-sm text-active-orange font-semibold">BASIC COURSE</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                    <span className="block text-gray-900 dark:text-white mb-2">
                        상상이 현실로 움직이는 시작,
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-active-orange via-orange-500 to-deep-electric-blue animate-gradient">
                        Basic Course
                    </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-delay">
                    로봇의 구조를 이해하고, 내가 짠 코드로 로봇을 직접 움직여보세요.
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-delay-2">
                    <button className="px-8 py-4 bg-active-orange hover:bg-orange-600 text-white font-bold rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(255,107,0,0.5)] hover:shadow-[0_0_40px_rgba(255,107,0,0.7)]">
                        수강 상담 신청하기
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <div className="w-6 h-10 border-2 border-active-orange/50 rounded-full flex justify-center pt-2 backdrop-blur-sm bg-white/5">
                    <div className="w-1 h-2 bg-active-orange rounded-full animate-scroll-indicator"></div>
                </div>
            </div>
        </section>
    );
}

