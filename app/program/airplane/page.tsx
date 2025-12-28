'use client';

import { useState, useEffect } from 'react';
import { Plane, Wrench, Code, Trophy, Award, CheckCircle, Calendar, Users, MapPin, ArrowRight, Zap } from 'lucide-react';
import AirplaneRegistrationModal from '@/components/AirplaneRegistrationModal';
import ScrollAnimation from '@/components/ScrollAnimation';

export default function AirplaneProgramPage() {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [codeParticles, setCodeParticles] = useState<Array<{ left: number; top: number; delay: number; duration: number; value: string }>>([]);

    useEffect(() => {
        setIsMounted(true);
        // 클라이언트에서만 코드 입자 생성
        const particles = Array.from({ length: 20 }, () => ({
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 5,
            duration: 10 + Math.random() * 10,
            value: Math.random() > 0.5 ? '0' : '1',
        }));
        setCodeParticles(particles);
    }, []);

    const weeks = [
        {
            week: 'Week 1',
            title: '항공 역학의 이해 & 기체 조립',
            subtitle: 'Take Off',
            icon: Wrench,
            content: '고익기(High-wing)와 날다람쥐 형태의 창작 비행기 구조 이해. 양력과 추력의 원리를 배우고 나만의 비행기를 조립합니다.',
            tech: ['DIY Assembly', 'Aerodynamics'],
            color: 'from-sky-400 to-blue-500',
        },
        {
            week: 'Week 2',
            title: 'SW 제어 기초 & 엠블록 코딩',
            subtitle: 'Control',
            icon: Code,
            content: '엠블록(mBlock)을 활용한 블록 코딩 기초. 모터의 회전 속도를 제어하여 이륙과 착륙 메커니즘을 구현합니다.',
            tech: ['Block Coding', 'DC Motor Control'],
            color: 'from-blue-500 to-indigo-600',
        },
        {
            week: 'Week 3',
            title: '아두이노 심화 & 비행 패턴 구현',
            subtitle: 'Maneuver',
            icon: Plane,
            content: '아두이노(C언어) 환경 설정 및 센서 제어. 직진 비행, 회전 비행, 8자 회전 비행 등 복잡한 비행 패턴을 코드로 작성합니다.',
            tech: ['Arduino IDE', 'Sensor Calibration'],
            color: 'from-indigo-600 to-purple-600',
        },
        {
            week: 'Week 4',
            title: '미션 수행 & 파이널 챌린지',
            subtitle: 'Mission',
            icon: Trophy,
            content: '비행 시간(Timer) 제어를 통한 정밀 착륙 미션. 친구들과 함께하는 오래 날리기 및 장애물 통과 대회.',
            tech: ['Algorithm Optimization', 'Team Challenge'],
            color: 'from-purple-600 to-pink-600',
        },
    ];

    const features = [
        {
            title: 'Smart Board',
            description: '아두이노 호환 보드와 BMP280(기압 센서) 등 정밀 센서 탑재',
            icon: Award,
        },
        {
            title: 'Safety Design',
            description: '초경량 소재와 안전한 프로펠러 설계',
            icon: CheckCircle,
        },
        {
            title: 'Dual Mode',
            description: '저학년을 위한 블록 코딩부터 고학년을 위한 텍스트 코딩(C++)까지 모두 지원',
            icon: Code,
        },
    ];

    const partners = [
        { name: 'KICT기업인협회', logo: '/img/kict.png' },
        { name: '선문대학교', logo: '/img/sunmoon.png' },
        { name: '피지컬 AI 로봇플레이', logo: '/img/logo.png' },
        { name: '충남콘텐츠진흥원', logo: '/img/chungnam.png' },
    ];

    const awards = [
        '충남콘텐츠진흥원장상',
        '선문대학교총장상',
        'KICT기업인협회장상',
    ];

    return (
        <main className="min-h-screen bg-[#0A0A0A]">
            {/* Hero Section */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-900/50 via-blue-900/30 to-[#0A0A0A]"></div>
                    {/* 비행기 이미지가 있다면 사용, 없으면 그라데이션만 */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-sky-400 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>
                </div>

                {/* Code Particles Effect */}
                {isMounted && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        {codeParticles.map((particle, i) => (
                            <div
                                key={i}
                                className="absolute text-sky-400/20 text-xs font-mono animate-float"
                                style={{
                                    left: `${particle.left}%`,
                                    top: `${particle.top}%`,
                                    animationDelay: `${particle.delay}s`,
                                    animationDuration: `${particle.duration}s`,
                                }}
                            >
                                {particle.value}
                            </div>
                        ))}
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-white font-semibold">충남콘텐츠진흥원장상 수상 교구 활용</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                        <span className="block text-white mb-2">
                            Code Your Wings
                        </span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-sky-300">
                            내 코드로 하늘을 지배하다
                        </span>
                    </h1>
                    
                    <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-4 max-w-3xl mx-auto leading-relaxed">
                        비행기, 조종기로 날리시나요?<br />
                        <span className="text-sky-400 font-semibold">우리는 코드로 날립니다.</span>
                    </p>
                    
                    <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                        대한민국 No.1 SW 제어 전동 비행기 <span className="text-red-400 font-bold">'나로 에어'</span>와 함께하는<br />
                        4주 완성 항공 엔지니어링 클래스
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => setIsRegistrationOpen(true)}
                            className="group px-8 py-4 bg-gradient-to-r from-[#00A3FF] to-[#FF4D4D] hover:from-[#0088DD] hover:to-[#FF3333] text-white font-bold rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(0,163,255,0.5)] hover:shadow-[0_0_40px_rgba(0,163,255,0.7)] flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Zap className="w-5 h-5" />
                            4주 특강 신청하기
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-2 bg-white rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Curriculum Section */}
            <section className="py-20 bg-[#1A1A1A] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <ScrollAnimation direction="fade">
                        <div className="text-center mb-16">
                            <h2 className="text-sky-400 font-bold tracking-wider mb-2 text-sm sm:text-base">CURRICULUM</h2>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                                4주 완성 항공 엔지니어링
                            </h3>
                            <p className="text-gray-300 text-lg">
                                체계적인 커리큘럼으로 항공 역학과 SW 제어를 마스터합니다
                            </p>
                        </div>
                    </ScrollAnimation>

                    {/* Vertical Timeline */}
                    <div className="relative max-w-4xl mx-auto">
                        {/* Timeline Line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-400 via-blue-500 to-pink-600 hidden md:block"></div>

                        <div className="space-y-12">
                            {weeks.map((week, index) => {
                                const Icon = week.icon;
                                return (
                                    <ScrollAnimation key={index} direction="right" delay={index * 150}>
                                        <div className="relative flex items-start gap-6 md:gap-8">
                                            {/* Timeline Dot */}
                                            <div className="hidden md:flex flex-shrink-0 items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 border-4 border-sky-400 shadow-lg z-10">
                                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${week.color} flex items-center justify-center`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                            </div>

                                            {/* Content Card */}
                                            <div className="flex-1 bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-700 hover:border-sky-400/50 transition-all hover:-translate-y-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="text-xs font-bold text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20">
                                                        {week.week}
                                                    </span>
                                                    <span className="text-sm font-semibold text-gray-400">{week.subtitle}</span>
                                                </div>
                                                
                                                <h4 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                                                    {week.title}
                                                </h4>
                                                
                                                <p className="text-gray-300 mb-6 leading-relaxed">
                                                    {week.content}
                                                </p>

                                                {/* Tech Tags */}
                                                <div className="flex flex-wrap gap-2">
                                                    {week.tech.map((tech, i) => (
                                                        <span
                                                            key={i}
                                                            className={`px-3 py-1 bg-gradient-to-r ${week.color} text-white text-xs font-semibold rounded-full`}
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollAnimation>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Features */}
            <section className="py-20 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <ScrollAnimation direction="fade">
                        <div className="text-center mb-16">
                            <h2 className="text-sky-400 font-bold tracking-wider mb-2 text-sm sm:text-base">NARO AIR</h2>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                                나로 에어 교구의 특장점
                            </h3>
                        </div>
                    </ScrollAnimation>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <ScrollAnimation key={index} direction="up" delay={index * 100}>
                                    <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-700 hover:border-sky-400/50 transition-all hover:-translate-y-2">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mb-6">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-3">
                                            {feature.title}
                                        </h4>
                                        <p className="text-gray-300 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </ScrollAnimation>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Awards & Partners */}
            <section className="py-20 bg-[#1A1A1A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <ScrollAnimation direction="fade">
                        <div className="text-center mb-16">
                            <h2 className="text-sky-400 font-bold tracking-wider mb-2 text-sm sm:text-base">TRUST & AUTHORITY</h2>
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                                수상 및 인증
                            </h3>
                        </div>
                    </ScrollAnimation>

                    {/* Awards */}
                    <div className="mb-16">
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            {awards.map((award, index) => (
                                <ScrollAnimation key={index} direction="fade" delay={index * 100}>
                                    <div className="px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
                                        <div className="flex items-center gap-2">
                                            <Trophy className="w-5 h-5 text-yellow-400" />
                                            <span className="text-white font-semibold">{award}</span>
                                        </div>
                                    </div>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>

                    {/* Partners */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        {partners.map((partner, index) => (
                            <ScrollAnimation key={index} direction="up" delay={index * 100}>
                                <div className="bg-gray-800 rounded-xl p-6 flex items-center justify-center border border-gray-700 hover:border-sky-400/50 transition-all hover:scale-110 grayscale hover:grayscale-0">
                                    <span className="text-gray-400 hover:text-white text-sm font-semibold text-center">
                                        {partner.name}
                                    </span>
                                </div>
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-sky-900 via-blue-900 to-[#0A0A0A]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
                    <ScrollAnimation direction="fade">
                        <div className="bg-gray-800/50 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-gray-700 shadow-2xl">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                                4주 특강 신청하기
                            </h2>
                            
                            <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Calendar className="w-5 h-5 text-sky-400 flex-shrink-0" />
                                    <span>2026. 01. 31 (토)</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0" />
                                    <span>선문대학교 (천안/아산)</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Users className="w-5 h-5 text-sky-400 flex-shrink-0" />
                                    <span>초3 ~ 고3 (SW 수준별 분반 수업)</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsRegistrationOpen(true)}
                                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00A3FF] to-[#FF4D4D] hover:from-[#0088DD] hover:to-[#FF3333] text-white font-bold rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(0,163,255,0.5)] hover:shadow-[0_0_40px_rgba(0,163,255,0.7)] flex items-center justify-center gap-2 mx-auto cursor-pointer animate-pulse"
                            >
                                <Zap className="w-5 h-5" />
                                선착순 마감 - 지금 신청하기
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            {/* Registration Modal */}
            <AirplaneRegistrationModal isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} />
        </main>
    );
}




















