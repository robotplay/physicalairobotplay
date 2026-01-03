'use client';

import ScrollAnimation from './ScrollAnimation';
import { GraduationCap, Rocket, Trophy, Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function EnhancedRoadmap() {
    const roadmapStages = [
        {
            stage: '입문',
            title: '블록 코딩 기초',
            duration: '1-2개월',
            description: '스크래치, 엔트리로 코딩의 원리를 배웁니다. 로봇의 기본 구조를 이해하고 간단한 명령을 내려봅니다.',
            outcome: '코딩의 기본 개념 이해, 로봇 조작 능력',
            color: 'from-blue-500 to-cyan-500',
            image: '/img/basic01.png',
        },
        {
            stage: '기초',
            title: '로봇 제어 및 센서 활용',
            duration: '3-6개월',
            description: '아두이노를 활용해 로봇을 제어하고, 다양한 센서를 활용한 프로젝트를 완성합니다.',
            outcome: '하드웨어 제어 능력, 센서 활용 능력',
            color: 'from-green-500 to-teal-500',
            image: '/img/basic02.png',
        },
        {
            stage: '심화',
            title: 'Python/C++ 프로그래밍',
            duration: '6-12개월',
            description: 'Python과 C++로 고급 로봇 제어를 배웁니다. OpenCV를 활용한 컴퓨터 비전, 라즈베리파이를 활용한 AI 구현을 경험합니다.',
            outcome: '프로그래밍 실력, AI·로봇 기술 이해',
            color: 'from-purple-500 to-pink-500',
            image: '/img/Advanced 01.png',
        },
        {
            stage: '대회반',
            title: '국제 대회 준비',
            duration: '12개월+',
            description: 'IRO, FIRA 등 국제 대회를 목표로 팀 프로젝트와 실전 경험을 쌓습니다. 문제 해결 능력과 팀워크를 기릅니다.',
            outcome: '대회 수상, 포트폴리오 완성, 리더십',
            color: 'from-orange-500 to-red-500',
            image: '/img/01.jpeg',
        },
        {
            stage: '영재/진학',
            title: '전문가 과정',
            duration: '지속적',
            description: '대학 진학을 위한 포트폴리오 완성, 로봇 공학 분야 전문가로 성장합니다. 멘토링과 프로젝트 리더 역할을 수행합니다.',
            outcome: '대학 진학, 전문가 역량, 멘토링 능력',
            color: 'from-yellow-500 to-orange-500',
            image: '/img/02.jpeg',
        },
    ];

    return (
        <section id="roadmap" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#1A1A1A] to-gray-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-active-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-12 sm:mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-deep-electric-blue/10 rounded-full border border-deep-electric-blue/20 mb-4 sm:mb-6">
                            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-deep-electric-blue animate-pulse" />
                            <span className="text-xs sm:text-sm text-deep-electric-blue font-semibold">GROWTH PATH</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                            <span className="tracking-tight">1년 뒤, 3년 뒤</span><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep-electric-blue via-active-orange to-neon-purple tracking-tight">
                                우리 아이는 어디까지 갈 수 있을까요?
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-300 mt-4 sm:mt-6">
                            PAR Play의 체계적인 커리큘럼 로드맵으로<br />
                            <strong className="text-deep-electric-blue">입문부터 전문가까지</strong> 단계별 성장을 지원합니다.
                        </p>
                    </div>
                </ScrollAnimation>

                {/* Roadmap Timeline */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-green-500 via-purple-500 via-orange-500 to-yellow-500 hidden md:block"></div>

                    <div className="space-y-8 sm:space-y-12">
                        {roadmapStages.map((stage, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <ScrollAnimation
                                    key={index}
                                    direction={isEven ? 'right' : 'left'}
                                    delay={index * 150}
                                >
                                    <div className="relative flex items-center gap-6 sm:gap-8">
                                        {/* Stage Number */}
                                        <div className="flex-shrink-0 relative z-10">
                                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border-4 border-gray-900`}>
                                                <span className="text-white font-black text-lg sm:text-xl">
                                                    {index + 1}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Card */}
                                        <div className={`flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                                            {/* Text Content */}
                                            <div className={`bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-700 hover:border-deep-electric-blue/50 transition-all group hover:-translate-y-1 ${!isEven ? 'md:order-2' : ''}`}>
                                                <div className="mb-4">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-deep-electric-blue/10 rounded-full border border-deep-electric-blue/20 mb-3">
                                                        <span className="text-xs sm:text-sm font-semibold text-deep-electric-blue uppercase">
                                                            {stage.stage}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            {stage.duration}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-deep-electric-blue transition-colors">
                                                        {stage.title}
                                                    </h3>
                                                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
                                                        {stage.description}
                                                    </p>
                                                </div>
                                                <div className="border-t border-gray-700 pt-4">
                                                    <div className="flex items-start gap-2">
                                                        <Trophy className="w-5 h-5 text-active-orange flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <div className="text-xs sm:text-sm font-semibold text-gray-400 mb-1">
                                                                기대 성과
                                                            </div>
                                                            <div className="text-sm sm:text-base text-white">
                                                                {stage.outcome}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Image */}
                                            <div className={`relative h-48 sm:h-64 md:h-80 rounded-2xl overflow-hidden border border-gray-700 ${!isEven ? 'md:order-1' : ''}`}>
                                                <Image
                                                    src={stage.image}
                                                    alt={stage.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    quality={90}
                                                />
                                                <div className={`absolute inset-0 bg-gradient-to-br ${stage.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                            </div>
                                        </div>

                                        {/* Arrow (except last) */}
                                        {index < roadmapStages.length - 1 && (
                                            <div className="absolute left-8 top-full -bottom-6 hidden md:flex items-center justify-center z-0">
                                                <ArrowRight className="w-6 h-6 text-deep-electric-blue rotate-90" />
                                            </div>
                                        )}
                                    </div>
                                </ScrollAnimation>
                            );
                        })}
                    </div>
                </div>

                {/* Call to Action */}
                <ScrollAnimation direction="fade" delay={600}>
                    <div className="mt-16 sm:mt-20 bg-gradient-to-br from-deep-electric-blue/10 via-active-orange/10 to-neon-purple/10 rounded-3xl p-8 sm:p-12 md:p-16 border border-deep-electric-blue/20">
                        <div className="text-center max-w-4xl mx-auto">
                            <Star className="w-12 h-12 sm:w-16 sm:h-16 text-active-orange mx-auto mb-6 sm:mb-8" />
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                                지금 시작하면, 3년 후 전문가가 됩니다
                            </h3>
                            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10">
                                단계별 커리큘럼으로 체계적으로 성장하는 아이를 보세요.<br />
                                <strong className="text-deep-electric-blue">입문부터 대회 수상, 대학 진학까지</strong> 한 곳에서 완성됩니다.
                            </p>
                            <a
                                href="#consultation"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-deep-electric-blue via-active-orange to-deep-electric-blue bg-[length:200%_100%] hover:bg-[length:100%_100%] text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg"
                            >
                                <GraduationCap className="w-5 h-5" />
                                커리큘럼 상담 신청하기
                            </a>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}







