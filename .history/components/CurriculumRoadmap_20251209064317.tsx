'use client';

import { Puzzle, Wrench, Radio } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';
import Image from 'next/image';

export default function CurriculumRoadmap() {
    const steps = [
        {
            number: '01',
            icon: Puzzle,
            title: '블록 코딩 기초',
            subtitle: 'Logic',
            description: '레고를 조립하듯 명령어를 끼워 맞추며 코딩의 원리를 배웁니다. 순차, 반복, 조건 등 프로그래밍의 핵심 개념을 자연스럽게 익힙니다.',
            visual: '스크래치나 엔트리 같은 블록 코딩 화면이 로봇과 연결되는 그래픽',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            number: '02',
            icon: Wrench,
            title: '로봇 조립 및 구조 이해',
            subtitle: 'Mechanics',
            description: '단순한 조작이 아닙니다. 로봇의 관절, 모터, 프레임이 어떻게 연결되어 움직임을 만들어내는지 공학적 구조를 직접 손으로 만지며 이해합니다.',
            visual: '로봇 부품들이 분해되었다가 조립되는 3D 느낌의 일러스트',
            color: 'from-orange-500 to-red-500',
        },
        {
            number: '03',
            icon: Radio,
            title: '기초 센서 활용',
            subtitle: 'Sensing',
            description: '로봇에게 눈과 귀를 선물합니다. 거리 센서로 장애물을 피하고, 소리 센서로 박수를 인식하며 주변 환경과 상호작용하는 법을 배웁니다.',
            visual: '로봇 앞에서 손을 흔들면 로봇이 반응하는 아이콘',
            color: 'from-purple-500 to-pink-500',
        },
    ];

    return (
        <section className="py-20 bg-humanoid-white dark:bg-[#111] relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-deep-electric-blue via-active-orange to-neon-purple animate-gradient-slow"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-16">
                        <h2 className="text-active-orange font-bold tracking-wider mb-2">CURRICULUM ROADMAP</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            3단계로 완성하는<br />
                            로봇 코딩의 기초
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            단계별로 차근차근 배워가는 체계적인 커리큘럼
                        </p>
                    </div>
                </ScrollAnimation>

                <div className="space-y-6 sm:space-y-8 md:space-y-12">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <ScrollAnimation
                                key={index}
                                direction={index % 2 === 0 ? 'right' : 'left'}
                                delay={index * 200}
                            >
                                <div className={`group relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl active:shadow-2xl hover:shadow-2xl transition-all duration-500 active:-translate-y-1 hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-800 ${
                                    index === 1 ? 'md:flex-row-reverse' : ''
                                }`}>
                                    {/* Animated background blob */}
                                    <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-64 h-64 bg-gradient-to-br ${step.color} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`}></div>

                                    {/* Shine effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                    </div>

                                    <div className={`relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                                        {/* Left: Content */}
                                        <div className={index % 2 === 0 ? '' : 'md:order-2'}>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-black text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                                    {step.number}
                                                </div>
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {step.subtitle}
                                                    </span>
                                                    <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-active-orange transition-colors">
                                                        {step.title}
                                                    </h4>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} opacity-20 flex items-center justify-center group-hover:opacity-30 transition-opacity`}>
                                                    <Icon className={`w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br ${step.color}`} />
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right: Visual */}
                                        <div className={`relative ${index % 2 === 0 ? '' : 'md:order-1'}`}>
                                            <div className="relative h-48 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 group-active:scale-105 hover:scale-105 transition-transform duration-500">
                                                {/* Basic Course Images */}
                                                {index === 0 ? (
                                                    <Image
                                                        src="/img/basic01.png"
                                                        alt={step.title}
                                                        fill
                                                        className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        quality={90}
                                                    />
                                                ) : index === 1 ? (
                                                    <Image
                                                        src="/img/basic02.png"
                                                        alt={step.title}
                                                        fill
                                                        className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        quality={90}
                                                    />
                                                ) : index === 2 ? (
                                                    <Image
                                                        src="/img/basic03.png"
                                                        alt={step.title}
                                                        fill
                                                        className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        quality={90}
                                                    />
                                                ) : null}
                                                
                                                {/* Decorative gradient overlay */}
                                                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}


