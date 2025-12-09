'use client';

import ScrollAnimation from './ScrollAnimation';
import { Rocket, Code2, Target, Award, Globe, Heart, Zap, Cpu } from 'lucide-react';
import Image from 'next/image';

export default function About() {
    const values = [
        {
            icon: Heart,
            title: '신뢰와 진정성',
            description: '수년간의 교육 현장 기록은 단순한 지식 전달을 넘어, 아이 한 명 한 명의 성장을 진심으로 고민해온 신뢰의 증명입니다.',
            color: 'from-red-500 to-pink-500',
        },
        {
            icon: Code2,
            title: '기술적 차별성',
            description: '놀이에서 시작하여 공학으로 완성되는 체계적인 커리큘럼. 기초부터 실전 AI 엔지니어링까지 단계별 학습.',
            color: 'from-deep-electric-blue to-cyan-500',
        },
        {
            icon: Target,
            title: '글로벌 비전',
            description: '교실 안의 1등이 아닌, 세계 무대의 리더를 양성. IRO와 FIRA 등 국제 대회 출전을 목표로 하는 체계적 훈련.',
            color: 'from-active-orange to-red-500',
        },
        {
            icon: Rocket,
            title: '미래 기술 연구소',
            description: '아이들의 상상력이 기술을 만나 현실이 되는 곳. 스스로 생각하는 로봇을 만드는 과정에서 리더로 성장합니다.',
            color: 'from-neon-purple to-pink-500',
        },
    ];

    const curriculum = [
        {
            icon: Zap,
            title: 'Basic Course',
            description: '아두이노와 엠블록을 활용해 로봇의 구조를 이해하고 논리적 사고의 틀을 잡습니다.',
            color: 'from-active-orange to-orange-600',
        },
        {
            icon: Cpu,
            title: 'Advanced Course',
            description: 'Python과 C++, 라즈베리파이와 OpenCV를 도입하여 현업 개발자 수준의 기술을 경험합니다.',
            color: 'from-deep-electric-blue to-blue-600',
        },
        {
            icon: Globe,
            title: 'Air Robot & Humanoid',
            description: '드론의 항공 역학부터 인간형 로봇의 보행 알고리즘까지, 로봇 공학의 모든 영역을 아우릅니다.',
            color: 'from-sky-400 to-blue-600',
        },
    ];

    return (
        <section id="about" className="py-12 sm:py-16 md:py-20 bg-white dark:bg-black relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-active-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                {/* Hero Section */}
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-12 sm:mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-deep-electric-blue/10 rounded-full border border-deep-electric-blue/20 mb-4 sm:mb-6">
                            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-deep-electric-blue animate-pulse" />
                            <span className="text-xs sm:text-sm text-deep-electric-blue font-semibold">ABOUT PAR</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                            코드가 현실이 되는 곳,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep-electric-blue via-active-orange to-neon-purple">
                                미래를 움직이는 힘을 기릅니다
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            피지컬 AI 로봇플레이는 화면 속에 갇힌 코딩 교육을 거부합니다.<br className="hidden sm:block" />
                            우리는 아이들이 작성한 코드가 로봇이라는 물리적 실체를 통해<br className="hidden sm:block" />
                            현실 세계에서 움직이고, 보고, 판단하게 만드는 <strong className="text-deep-electric-blue">'살아있는 기술 교육'</strong>을 지향합니다.
                        </p>
                    </div>
                </ScrollAnimation>

                {/* Main Content */}
                <div className="space-y-16 sm:space-y-20 md:space-y-24">
                    {/* Education Philosophy */}
                    <ScrollAnimation direction="right" delay={100}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                                    <span className="text-sm sm:text-base font-semibold text-red-500 uppercase tracking-wider">Education Philosophy</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                                    신뢰와 진정성의 기록
                                </h3>
                                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    우리의 교육은 하루아침에 만들어지지 않았습니다. 지난 수년간 수많은 아이들과 호흡하며 쌓아온 교육 현장의 기록은 단순한 지식 전달을 넘어, 아이 한 명 한 명의 성장을 진심으로 고민해온 <strong className="text-deep-electric-blue">'신뢰의 증명'</strong>입니다.
                                </p>
                                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    우리는 아이들이 기술을 통해 성취감을 느끼고, 실패를 두려워하지 않는 단단한 마음을 가진 미래 인재로 자라나도록 돕습니다.
                                </p>
                            </div>
                            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl group">
                                <Image
                                    src="/img/02.jpeg"
                                    alt="신뢰와 진정성의 기록 - 피지컬 AI 로봇플레이 교육 현장"
                                    fill
                                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={90}
                                    priority
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Technical Differentiation */}
                    <ScrollAnimation direction="left" delay={200}>
                        <div>
                            <div className="text-center mb-8 sm:mb-12">
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-deep-electric-blue" />
                                    <span className="text-sm sm:text-base font-semibold text-deep-electric-blue uppercase tracking-wider">Technical Differentiation</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    기초부터 실전 AI 엔지니어링까지
                                </h3>
                                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                    피지컬 AI 로봇플레이의 커리큘럼은 놀이에서 시작하여 공학(Engineering)으로 완성됩니다.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                {curriculum.map((course, index) => {
                                    const Icon = course.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-deep-electric-blue/50"
                                        >
                                            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                            </div>
                                            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-deep-electric-blue transition-colors">
                                                {course.title}
                                            </h4>
                                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {course.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Vision */}
                    <ScrollAnimation direction="right" delay={300}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
                            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl group order-2 md:order-1">
                                <Image
                                    src="/img/01.jpeg"
                                    alt="세계 무대를 향한 도전 - IRO & FIRA 국제 대회 비전"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    style={{ objectPosition: 'left center' }}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={90}
                                    priority
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                            <div className="order-1 md:order-2">
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-active-orange" />
                                    <span className="text-sm sm:text-base font-semibold text-active-orange uppercase tracking-wider">Global Vision</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                                    세계 무대를 향한 도전
                                </h3>
                                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                                    우리는 교실 안의 1등이 아닌, 세계 무대의 리더를 양성합니다. <strong className="text-active-orange">국제로봇올림피아드(IRO)</strong>와 <strong className="text-active-orange">세계로봇월드컵(FIRA)</strong> 등 공신력 있는 국제 대회 출전을 목표로 하는 체계적인 훈련 시스템을 갖추고 있습니다.
                                </p>
                                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    아이들은 경쟁을 통해 자신의 한계를 넘어서고, 글로벌 인재들과 교류하며 더 넓은 세상을 경험하게 됩니다.
                                </p>
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Core Values */}
                    <ScrollAnimation direction="fade" delay={400}>
                        <div>
                            <div className="text-center mb-8 sm:mb-12">
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    우리의 핵심 가치
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                {values.map((value, index) => {
                                    const Icon = value.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-deep-electric-blue/50"
                                        >
                                            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                            </div>
                                            <h4 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-deep-electric-blue transition-colors">
                                                {value.title}
                                            </h4>
                                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {value.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Promise Section */}
                    <ScrollAnimation direction="fade" delay={500}>
                        <div className="relative bg-gradient-to-br from-deep-electric-blue/10 via-active-orange/10 to-neon-purple/10 rounded-3xl p-8 sm:p-12 md:p-16 border border-deep-electric-blue/20">
                            <div className="text-center max-w-4xl mx-auto">
                                <Award className="w-12 h-12 sm:w-16 sm:h-16 text-deep-electric-blue mx-auto mb-6 sm:mb-8" />
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                                    우리의 약속
                                </h3>
                                <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
                                    피지컬 AI 로봇플레이는 단순한 코딩 학원이 아닙니다.<br className="hidden sm:block" />
                                    아이들의 상상력이 기술을 만나 현실이 되는 <strong className="text-deep-electric-blue">'미래 기술 연구소'</strong>입니다.
                                </p>
                                <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 sm:mb-10">
                                    스스로 생각하는 로봇을 만드는 과정에서,<br className="hidden sm:block" />
                                    아이들 역시 스스로 생각하는 리더로 성장할 것입니다.
                                </p>
                                <div className="border-t border-deep-electric-blue/30 pt-6 sm:pt-8">
                                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-deep-electric-blue mb-2">
                                        가장 뜨거운 열정으로, 가장 앞선 미래를 교육합니다.
                                    </p>
                                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-4">
                                        <strong className="text-gray-900 dark:text-white">피지컬 AI 로봇플레이 대표 하광진</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}

