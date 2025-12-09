'use client';

import { ArrowRight, Plane, Zap } from 'lucide-react';
import { useState } from 'react';
import ScrollAnimation from './ScrollAnimation';
import ConsultationModal from './ConsultationModal';

export default function AirRobotCTA() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="py-20 bg-gradient-to-br from-sky-400 via-blue-600 to-[#0A1931] relative overflow-hidden">
            {/* Sky effects */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
                <ScrollAnimation direction="fade" delay={100}>
                    <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 border border-white/20 shadow-2xl">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full mb-4 sm:mb-6 border border-white/20">
                            <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            <span className="text-xs sm:text-sm font-semibold text-white">Physical AI의 정점</span>
                        </div>
                        
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
                            하늘을 제어하는 코드를<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-blue-100 to-white">
                                지금 시작하세요
                            </span>
                        </h2>
                        
                        <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
                            AirRobot Course는 Physical AI의 최고 난이도 과정입니다.
                            <br className="hidden sm:block" />
                            상담을 통해 여러분의 항공우주 꿈을 현실로 만들어보세요.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="group px-6 py-3 sm:px-8 sm:py-4 bg-white active:bg-blue-50 hover:bg-blue-50 text-sky-600 text-sm sm:text-base font-bold rounded-lg transition-all transform active:scale-95 hover:scale-110 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 touch-manipulation cursor-pointer"
                                aria-label="AirRobot 과정 상담 신청하기"
                                type="button"
                            >
                                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                                AirRobot 과정 상담 신청하기
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <a 
                                href="/curriculum?tab=airrobot"
                                className="px-6 py-3 sm:px-8 sm:py-4 bg-white/10 active:bg-white/20 hover:bg-white/20 backdrop-blur-md text-white text-sm sm:text-base border-2 border-white/30 font-bold rounded-lg transition-all transform active:scale-95 hover:scale-105 touch-manipulation inline-block text-center cursor-pointer"
                            >
                                커리큘럼 자세히 보기
                            </a>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>

            {/* Consultation Modal */}
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}

