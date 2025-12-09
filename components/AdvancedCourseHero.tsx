'use client';

import { useEffect, useState } from 'react';
import { Code2, Eye, Zap } from 'lucide-react';

export default function AdvancedCourseHero() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [codeLines, setCodeLines] = useState<string[]>([]);

    useEffect(() => {
        setIsLoaded(true);
        
        // Typewriter effect for code
        const sampleCode = [
            'import cv2',
            'import numpy as np',
            '',
            'def detect_object(frame):',
            '    # AI Vision Processing',
            '    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)',
            '    edges = cv2.Canny(gray, 50, 150)',
            '    return edges',
        ];
        
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < sampleCode.length) {
                setCodeLines(prev => [...prev, sampleCode[currentIndex]]);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 200);
        
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <section className="relative h-screen min-h-[500px] sm:min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#0F0F0F] to-[#1A1A1A] pt-16 sm:pt-20">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(157, 0, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(157, 0, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}></div>
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-deep-electric-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Code terminal effect - Hidden on mobile */}
            <div className="hidden lg:block absolute top-20 right-10 w-96 h-64 bg-black/80 backdrop-blur-sm rounded-lg border border-neon-purple/30 p-4 transition-opacity">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="ml-2 text-xs text-gray-400">terminal.py</span>
                </div>
                <div className="font-mono text-xs text-green-400 space-y-1">
                    {codeLines.map((line, i) => (
                        <div key={i} className="animate-fade-in">
                            <span className="text-neon-purple">$</span> {line || '\u00A0'}
                        </div>
                    ))}
                    {codeLines.length > 0 && (
                        <div className="animate-pulse">
                            <span className="text-neon-purple">|</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className={`relative z-10 text-center px-4 max-w-5xl mx-auto transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon-purple/10 backdrop-blur-md rounded-full border border-neon-purple/30 mb-6">
                    <Code2 className="w-4 h-4 text-neon-purple" />
                    <span className="text-sm text-neon-purple font-semibold">ADVANCED COURSE</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 px-2">
                    <span className="block text-white mb-1 sm:mb-2">
                        코드로 로봇의 눈을 뜨게 하다
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-deep-electric-blue to-neon-purple animate-gradient">
                        Code the Vision, Master the AI
                    </span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-4">
                    상상을 현실로 구현하는 엔지니어링의 시작, <span className="text-neon-purple font-semibold">Advanced Course</span>
                </p>
                
                <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-6 sm:mb-10 max-w-3xl mx-auto px-4">
                    블록을 넘어 실제 개발 언어(Python/C++)로. AI 비전과 자율주행 기술을 통해<br className="hidden sm:block" />
                    스스로 생각하고 판단하는 로봇을 설계합니다.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                    <button className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-neon-purple to-deep-electric-blue active:from-purple-600 active:to-blue-600 hover:from-purple-600 hover:to-blue-600 text-white text-sm sm:text-base font-bold rounded-lg transition-all transform active:scale-95 hover:scale-105 shadow-[0_0_30px_rgba(157,0,255,0.5)] hover:shadow-[0_0_40px_rgba(157,0,255,0.7)] flex items-center justify-center gap-2 touch-manipulation">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                        심화 과정 상담 신청하기
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <div className="w-6 h-10 border-2 border-neon-purple/50 rounded-full flex justify-center pt-2 backdrop-blur-sm bg-black/20">
                    <div className="w-1 h-2 bg-neon-purple rounded-full animate-scroll-indicator"></div>
                </div>
            </div>
        </section>
    );
}


