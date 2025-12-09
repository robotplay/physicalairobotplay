'use client';

import { ArrowRight, Zap, CircuitBoard } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';

export default function AdvancedCourseCTA() {
    return (
        <section className="py-20 bg-black relative overflow-hidden">
            {/* Circuit board background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(157, 0, 255, 0.1) 2px, rgba(157, 0, 255, 0.1) 4px),
                        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(157, 0, 255, 0.1) 2px, rgba(157, 0, 255, 0.1) 4px)
                    `,
                }}></div>
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-deep-electric-blue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <ScrollAnimation direction="fade" delay={100}>
                    <div className="text-center bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 border border-gray-800 shadow-2xl">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-neon-purple/10 rounded-full mb-4 sm:mb-6 border border-neon-purple/30">
                            <CircuitBoard className="w-4 h-4 sm:w-5 sm:h-5 text-neon-purple" />
                            <span className="text-xs sm:text-sm font-semibold text-neon-purple">Advanced Technology</span>
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
                            준비된 미래 인재를 기다립니다.
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-deep-electric-blue to-neon-purple">
                                한계를 뛰어넘는 도전을 시작하세요
                            </span>
                        </h2>
                        
                        <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                            Advanced Course는 미래의 AI 엔지니어를 위한 전문 과정입니다.
                            <br className="hidden sm:block" />
                            상담을 통해 여러분의 기술 역량을 확인하고 맞춤형 학습 계획을 세워보세요.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                            <button className="group px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-neon-purple to-deep-electric-blue active:from-purple-600 active:to-blue-600 hover:from-purple-600 hover:to-blue-600 text-white text-sm sm:text-base font-bold rounded-lg transition-all transform active:scale-95 hover:scale-110 shadow-[0_0_30px_rgba(157,0,255,0.5)] hover:shadow-[0_0_40px_rgba(157,0,255,0.7)] flex items-center justify-center gap-2 touch-manipulation">
                                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                심화 과정 상담 신청하기
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <a 
                                href="/curriculum?tab=advanced"
                                className="px-6 py-3 sm:px-8 sm:py-4 bg-black active:bg-gray-900 hover:bg-gray-900 text-white text-sm sm:text-base border-2 border-gray-800 active:border-neon-purple/50 hover:border-neon-purple/50 font-bold rounded-lg transition-all transform active:scale-95 hover:scale-105 touch-manipulation inline-block text-center"
                            >
                                커리큘럼 자세히 보기
                            </a>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}


