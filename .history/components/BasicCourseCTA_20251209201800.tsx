'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';

export default function BasicCourseCTA() {
    return (
        <section className="py-20 bg-gradient-to-br from-active-orange/10 via-orange-50 to-deep-electric-blue/10">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-active-orange rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-deep-electric-blue rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <ScrollAnimation direction="fade" delay={100}>
                    <div className="text-center bg-gray-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl border border-gray-700">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-active-orange/10 rounded-full mb-4 sm:mb-6">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-active-orange" />
                            <span className="text-xs sm:text-sm font-semibold text-active-orange">첫 로봇 친구를 만나는 설렘</span>
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                            우리 아이의 첫 AI 파트너,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-active-orange to-deep-electric-blue">
                                지금 만나보세요
                            </span>
                        </h2>
                        
                        <p className="text-base sm:text-lg text-gray-600">
                            Basic Course는 아이들이 로봇과 코딩의 세계로 들어가는 첫 번째 문입니다.
                            <br className="hidden sm:block" />
                            상담을 통해 우리 아이에게 맞는 학습 계획을 세워보세요.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                            <button className="group px-6 py-3 sm:px-8 sm:py-4 bg-active-orange active:bg-orange-600 hover:bg-orange-600 text-white text-sm sm:text-base font-bold rounded-full transition-all transform active:scale-95 hover:scale-110 shadow-[0_0_30px_rgba(255,107,0,0.5)] hover:shadow-[0_0_40px_rgba(255,107,0,0.7)] flex items-center justify-center gap-2 touch-manipulation">
                                수강 상담 신청하기
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <a 
                                href="/curriculum?tab=basic"
                                className="px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900"
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


