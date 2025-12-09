'use client';

import ScrollAnimation from './ScrollAnimation';
import { Plane, Brain, Target } from 'lucide-react';
import Image from 'next/image';

export default function AirRobotOverview() {
    const concepts = [
        {
            icon: Plane,
            title: '3D 공간 제어',
            description: '하늘을 날아다니는',
            color: 'from-sky-400 to-blue-500',
        },
        {
            icon: Brain,
            title: '알고리즘',
            description: '센서 데이터로 판단하고',
            color: 'from-blue-500 to-indigo-600',
        },
        {
            icon: Target,
            title: '미션 수행',
            description: '스스로 균형을 잡는다',
            color: 'from-indigo-600 to-purple-600',
        },
    ];

    return (
        <section className="py-20 bg-[#1A1A1A]">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 right-10 w-96 h-96 bg-sky-400 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
                    {/* Left: Text Content */}
                    <ScrollAnimation direction="right" delay={100}>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                Physical AI의 정점,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                                    지능형 비행 로봇
                                </span>
                            </h2>
                            <p className="text-lg text-gray-300">
                                단순한 조종(RC)을 넘어, 센서 데이터와 프로그래밍을 통해 스스로 균형을 잡고 임무를 수행하는 <strong className="text-sky-600">지능형 비행 로봇</strong>을 구현합니다. 하늘이라는 3차원 공간을 제어하는 것은 Physical AI의 최고 난이도 과제입니다.
                            </p>
                            
                            <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
                                <h3 className="text-lg font-bold text-white mb-3">이 과정이 적합한 학생</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-sky-500 mt-1">✓</span>
                                        <span>텍스트 코딩(C언어/아두이노) 입문을 원하는 학생</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-sky-500 mt-1">✓</span>
                                        <span>IRO 로봇올림피아드 등 대회 출전을 목표로 하는 학생</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-sky-500 mt-1">✓</span>
                                        <span>항공우주 분야 진로를 고려하는 학생</span>
                                    </li>
                                </ul>
                            </div>
                            
                            {/* Concept visualization */}
                            <div className="flex items-center gap-4 flex-wrap">
                                {concepts.map((concept, index) => {
                                    const Icon = concept.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-3 bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-sm">
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${concept.color} flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">{concept.title}</div>
                                                <div className="text-white font-semibold">{concept.description}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Right: Visual */}
                    <ScrollAnimation direction="left" delay={200}>
                        <div className="relative">
                            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-gray-800 group border border-gray-700 shadow-xl">
                                {/* Drone Image */}
                                <Image
                                    src="/img/drone01.png"
                                    alt="비행 로봇 드론 - Physical AI AirRobot Course"
                                    fill
                                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={90}
                                    priority
                                />
                                
                                {/* Gradient overlay for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Glowing effect */}
                                <div className="absolute top-4 right-4 w-20 h-20 bg-sky-400/30 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 bg-blue-500/30 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}

