'use client';

import { Cpu, Zap, ArrowRight, Plane } from "lucide-react";
import ScrollAnimation from './ScrollAnimation';
import Link from 'next/link';

export default function Program() {
    return (
        <section id="program-airrobot" className="section-padding bg-humanoid-white dark:bg-[#111] relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-deep-electric-blue via-active-orange to-neon-purple animate-gradient-slow"></div>
            </div>

            <div className="relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-16">
                        <h2 className="text-deep-electric-blue font-bold tracking-wider mb-2">CURRICULUM</h2>
                        <h3 className="heading-lg text-gray-900 dark:text-white">
                            미래를 준비하는<br />단계별 로봇 교육
                        </h3>
                    </div>
                </ScrollAnimation>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                    {/* Basic Course */}
                    <ScrollAnimation direction="right" delay={100}>
                        <Link
                            href="/basic-course"
                            className="group relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl active:shadow-2xl hover:shadow-2xl transition-all duration-500 active:-translate-y-2 hover:-translate-y-4 overflow-hidden border border-gray-100 dark:border-gray-800 active:border-active-orange/50 hover:border-active-orange/50 block touch-manipulation"
                        >
                            {/* Animated background blob */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-active-orange/10 rounded-bl-full -mr-8 -mt-8 transition-all duration-700 group-hover:scale-150 group-hover:bg-active-orange/20"></div>
                            
                            {/* Shine effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-active-orange/20 rounded-2xl flex items-center justify-center mb-6 text-active-orange group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                    <Zap size={32} className="group-hover:animate-pulse" />
                                </div>
                                <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-active-orange transition-colors">Basic Course</h4>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    로봇의 구조를 이해하고 기초 코딩을 통해 논리적 사고력을 키우는 입문 과정입니다.
                                </p>
                                <ul className="space-y-3 mb-8 text-gray-600 dark:text-gray-400">
                                    {['블록 코딩 기초', '로봇 조립 및 구조 이해', '기초 센서 활용'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 group-hover:translate-x-2 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                                            <span className="w-2 h-2 bg-active-orange rounded-full group-hover:scale-150 transition-transform"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="w-full py-3 rounded-xl border-2 border-active-orange text-active-orange font-bold hover:bg-active-orange hover:text-white transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 cursor-pointer">
                                    상세 커리큘럼
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </ScrollAnimation>

                {/* Advanced Course */}
                <ScrollAnimation direction="left" delay={200}>
                    <Link
                        href="/advanced-course"
                        className="group relative bg-deep-electric-blue rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl active:shadow-2xl hover:shadow-2xl transition-all duration-500 active:-translate-y-2 hover:-translate-y-4 overflow-hidden text-white active:scale-[1.01] hover:scale-[1.02] block touch-manipulation"
                    >
                            {/* Animated background blob */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8 transition-all duration-700 group-hover:scale-150 group-hover:bg-white/20"></div>
                            
                            {/* Shine effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                    <Cpu size={32} className="group-hover:animate-pulse" />
                                </div>
                                <h4 className="text-2xl font-bold mb-4 group-hover:scale-105 transition-transform">Advanced Course</h4>
                                <p className="text-blue-100 mb-6">
                                    AI 비전 인식과 텍스트 코딩을 결합하여 복잡한 미션을 수행하는 심화 과정입니다.
                                </p>
                                <ul className="space-y-3 mb-8 text-blue-100">
                                    {['Python / C++ 텍스트 코딩', '카메라 비전 & AI 모델링', '자율주행 & 미션 수행'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 group-hover:translate-x-2 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                                            <span className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="w-full py-3 rounded-xl border-2 border-white text-white font-bold hover:bg-white hover:text-deep-electric-blue transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer">
                                    상세 커리큘럼
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </ScrollAnimation>

                    {/* AirRobot Course */}
                    <ScrollAnimation direction="right" delay={300}>
                        <Link
                            href="/airrobot-course"
                            className="group relative bg-gradient-to-br from-sky-400 via-blue-600 to-[#0A1931] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl active:shadow-2xl hover:shadow-2xl transition-all duration-500 active:-translate-y-2 hover:-translate-y-4 overflow-hidden text-white active:scale-[1.01] hover:scale-[1.02] block touch-manipulation"
                        >
                            {/* Animated background blob */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8 transition-all duration-700 group-hover:scale-150 group-hover:bg-white/20"></div>
                            
                            {/* Shine effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                    <Plane size={32} className="group-hover:animate-pulse" />
                                </div>
                                <h4 className="text-2xl font-bold mb-4 group-hover:scale-105 transition-transform">AirRobot Course</h4>
                                <p className="text-blue-100 mb-6">
                                    항공 역학과 알고리즘이 결합된 최상위 마스터 과정. 하늘을 코딩하고 바람을 제어합니다.
                                </p>
                                <ul className="space-y-3 mb-8 text-blue-100">
                                    {['항공 이론 및 제어 기초', 'DIY SW 드론 제어', 'SW 제어 비행기'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 group-hover:translate-x-2 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                                            <span className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="w-full py-3 rounded-xl border-2 border-white text-white font-bold hover:bg-white hover:text-sky-600 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer">
                                    상세 커리큘럼
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}
