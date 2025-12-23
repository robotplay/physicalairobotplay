'use client';

import ScrollAnimation from './ScrollAnimation';
import { Award, GraduationCap, Rocket, Target, Calendar, BookOpen, Users, Trophy } from 'lucide-react';
import Image from 'next/image';

export default function LeaderProfile() {
    const timeline = [
        {
            year: '2020',
            title: '대통령상 수상',
            description: '지능휴머노이드대회 대통령상 수상',
            icon: Trophy,
            color: 'from-yellow-500 to-orange-500',
        },
        {
            year: '2021-2023',
            title: '국제 대회 심사위원',
            description: '월드로보페스타, STEAMCUP AI 로봇대회 심사위원',
            icon: Award,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            year: '2022',
            title: '교육 기관 설립',
            description: 'Physical AI Robot Play 학원 설립 및 운영',
            icon: Rocket,
            color: 'from-purple-500 to-pink-500',
        },
        {
            year: '2023-현재',
            title: '지속적인 성장',
            description: '수백 명의 학생 지도, 다수 국제 대회 수상 배출',
            icon: Target,
            color: 'from-green-500 to-teal-500',
        },
    ];

    const qualifications = [
        {
            icon: GraduationCap,
            title: '학력 및 자격',
            items: [
                '기계공학부 시스템설계제조전공 (한기대)',
                '로봇 교육 전문 자격증 보유',
                'AI·로봇 교육 전문가 인증',
            ],
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: BookOpen,
            title: '교육 철학',
            items: [
                '놀이에서 시작하여 공학으로 완성',
                '아이 한 명 한 명의 성장을 진심으로 고민',
                '세계 무대의 리더를 양성하는 교육',
            ],
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: Users,
            title: '주요 경력',
            items: [
                '천안여고, 오성고, 복자여고 외 휴머노이드 강사',
                '아산 청소년문화교육원 휴머노이드 강사',
                '경기도교육청 IRO 휴머노이드 로보티즈 엔지니어MAX2 강사',
                '호서대학교 유학생 대상 로봇코딩교육',
            ],
            color: 'from-orange-500 to-red-500',
        },
    ];

    return (
        <section id="leader" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-900 to-[#1A1A1A] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 right-10 w-72 h-72 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-active-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-12 sm:mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-deep-electric-blue/10 rounded-full border border-deep-electric-blue/20 mb-4 sm:mb-6">
                            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-deep-electric-blue animate-pulse" />
                            <span className="text-xs sm:text-sm text-deep-electric-blue font-semibold">ABOUT LEADER</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                            누구에게 배우느냐가<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep-electric-blue via-active-orange to-neon-purple">
                                다릅니다
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-300 mt-4 sm:mt-6">
                            하광진 대표님의 교육 철학과 전문성을 소개합니다
                        </p>
                    </div>
                </ScrollAnimation>

                {/* Leader Introduction */}
                <ScrollAnimation direction="right" delay={100}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center mb-16 sm:mb-20">
                        <div className="relative">
                            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group">
                                <Image
                                    src="/img/01.jpeg"
                                    alt="하광진 대표님"
                                    fill
                                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={90}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                        하광진 대표
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-200">
                                        Physical AI Robot Play 대표
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mb-6">
                                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                                    교육 철학
                                </h3>
                                <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4">
                                    우리의 교육은 하루아침에 만들어지지 않았습니다. 지난 수년간 수많은 아이들과 호흡하며 쌓아온 교육 현장의 기록은 단순한 지식 전달을 넘어, 아이 한 명 한 명의 성장을 진심으로 고민해온 <strong className="text-deep-electric-blue">'신뢰의 증명'</strong>입니다.
                                </p>
                                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                                    우리는 아이들이 기술을 통해 성취감을 느끼고, 실패를 두려워하지 않는 단단한 마음을 가진 미래 인재로 자라나도록 돕습니다.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: '지도 학생', value: '500+', icon: Users },
                                    { label: '대회 수상', value: '100+', icon: Trophy },
                                ].map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div key={index} className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
                                            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-deep-electric-blue mb-2" />
                                            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm sm:text-base text-gray-300">
                                                {stat.label}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Timeline */}
                <ScrollAnimation direction="fade" delay={200}>
                    <div className="mb-16 sm:mb-20">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
                            주요 이력
                        </h3>
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-deep-electric-blue via-active-orange to-neon-purple hidden md:block"></div>
                            
                            <div className="space-y-8 sm:space-y-12">
                                {timeline.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="relative flex items-start gap-6 sm:gap-8">
                                            {/* Timeline dot */}
                                            <div className="flex-shrink-0 relative z-10">
                                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                                    <Icon className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700 hover:border-deep-electric-blue/50 transition-all group hover:-translate-y-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <span className="text-sm sm:text-base font-bold text-deep-electric-blue">
                                                        {item.year}
                                                    </span>
                                                    <h4 className="text-xl sm:text-2xl font-bold text-white group-hover:text-deep-electric-blue transition-colors">
                                                        {item.title}
                                                    </h4>
                                                </div>
                                                <p className="text-sm sm:text-base text-gray-300">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Qualifications */}
                <ScrollAnimation direction="fade" delay={300}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {qualifications.map((qual, index) => {
                            const Icon = qual.icon;
                            return (
                                <div
                                    key={index}
                                    className="group bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700 hover:border-deep-electric-blue/50"
                                >
                                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${qual.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-deep-electric-blue transition-colors">
                                        {qual.title}
                                    </h4>
                                    <ul className="space-y-2 sm:space-y-3">
                                        {qual.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-gray-300">
                                                <span className="text-deep-electric-blue mt-1 flex-shrink-0">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
