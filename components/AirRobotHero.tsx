'use client';

import { useEffect, useState } from 'react';
import { Plane, Zap } from 'lucide-react';

export default function AirRobotHero() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <section className="relative h-screen min-h-[500px] sm:min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-400 via-blue-600 to-[#0A1931]">
            {/* Animated sky background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 50%, rgba(135, 206, 235, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(10, 25, 49, 0.4) 0%, transparent 50%)
                    `,
                }}></div>
            </div>

            {/* Cloud effects */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-32 h-16 bg-white/10 rounded-full blur-xl animate-float"
                        style={{
                            left: `${(i * 20) % 100}%`,
                            top: `${(i * 15 + 20) % 100}%`,
                            animationDelay: `${i * 2}s`,
                            animationDuration: `${10 + i * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Flying plane animation */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 opacity-10 animate-float">
                <Plane className="w-full h-full text-white transform rotate-45" />
            </div>

            {/* Main Content */}
            <div className={`relative z-10 text-center px-4 max-w-5xl mx-auto transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
                    <Plane className="w-4 h-4 text-white" />
                    <span className="text-sm text-white font-semibold">AIRROBOT COURSE</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 px-4">
                    <span className="block text-white mb-1 sm:mb-2">
                        하늘을 코딩하고,
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-200 to-white animate-gradient">
                        바람을 제어하라
                    </span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-4">
                    Code the Sky, Control the Wind
                </p>
                
                <p className="text-sm sm:text-base md:text-lg text-blue-200 mb-6 sm:mb-10 max-w-3xl mx-auto px-4">
                    Physical AI의 날개를 달다.<br className="hidden sm:block" />
                    당신의 코드가 현실의 하늘을 지배하는 순간.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                    <button className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-sky-400 to-blue-600 active:from-sky-500 active:to-blue-700 hover:from-sky-500 hover:to-blue-700 text-white text-sm sm:text-base font-bold rounded-lg transition-all transform active:scale-95 hover:scale-110 shadow-[0_0_30px_rgba(135,206,235,0.5)] hover:shadow-[0_0_40px_rgba(135,206,235,0.7)] flex items-center justify-center gap-2 touch-manipulation">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                        AirRobot 과정 상담 신청하기
                    </button>
                    <a 
                        href="/curriculum?tab=airrobot"
                        className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 active:bg-white/20 hover:bg-white/20 backdrop-blur-md text-white text-sm sm:text-base border border-white/30 font-bold rounded-lg transition-all transform active:scale-95 hover:scale-105 touch-manipulation inline-block text-center"
                    >
                        커리큘럼 자세히 보기
                    </a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2 backdrop-blur-sm bg-white/5">
                    <div className="w-1 h-2 bg-white rounded-full animate-scroll-indicator"></div>
                </div>
            </div>
        </section>
    );
}

