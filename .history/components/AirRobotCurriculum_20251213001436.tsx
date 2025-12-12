'use client';

import { BookOpen, Wrench, Plane, Trophy } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';
import { useState } from 'react';

export default function AirRobotCurriculum() {
    const [activeTab, setActiveTab] = useState<'blocks' | 'arduino'>('blocks');

    const steps = [
        {
            number: '01',
            icon: BookOpen,
            title: '항공 이론 및 제어 기초',
            subtitle: 'Aeronautics & Logic',
            description: '비행기는 어떻게 뜨는가? 베르누이 정리와 양력의 원리를 이해하고, 아두이노 보드가 비행기의 두뇌 역할을 하는 원리를 배웁니다.',
            activities: [
                '기체 역학(양력, 추력, 항력, 중력) 시뮬레이션',
                '자이로(Gyro) 센서와 가속도 센서로 수평을 잡는 알고리즘 이해',
            ],
            color: 'from-sky-400 to-blue-500',
            bgColor: 'from-sky-900/20 to-blue-900/20',
        },
        {
            number: '02',
            icon: Wrench,
            title: 'DIY SW 드론 제어',
            subtitle: 'Creative Drone Lab',
            description: '정해진 모양이 아닙니다. 우주선, 용(Dragon), 무당벌레 등 나만의 창의적인 스킨을 입히고 공기 역학적 구조를 설계합니다.',
            activities: [
                'Level 1: 기본형 - 드론의 기본 비행 원리 코딩',
                'Level 2: 창작형 - 용 드론, 우주선 드론, 나비 드론 등 스킨 제작',
                'Level 3: 융합형 - 하늘을 날다가 땅을 미끄러지는 호버크래프트 변신 코딩',
            ],
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'from-blue-900/20 to-indigo-900/20',
        },
        {
            number: '03',
            icon: Plane,
            title: 'SW 제어 비행기',
            subtitle: 'Intelligent Plane',
            description: '프로펠러의 힘과 마이크로 모터 속도를 코딩으로 정밀 제어하여 고도 비행, 회전 비행 등 미션을 수행합니다.',
            activities: [
                '고익기 제어 - 날개 수직 위치에 따른 비행 안정성 테스트',
                '창작 날다람쥐 비행기 - 독특한 형태의 비행체 설계 및 체공 시간 연장 알고리즘',
                '오토파일럿 미션 - 이륙 후 정해진 시간 동안 스스로 비행하고 착륙하는 자율 비행 코드',
            ],
            color: 'from-indigo-600 to-purple-600',
            bgColor: 'from-indigo-900/20 to-purple-900/20',
        },
        {
            number: '04',
            icon: Trophy,
            title: '대회 및 실전 프로젝트',
            subtitle: 'Competition & Pro',
            description: 'IRO 로봇올림피아드 에어로봇 종목 및 글로벌 대회 준비 과정입니다. C언어/아두이노 심화와 실전 미션 수행을 통해 전문성을 키웁니다.',
            activities: [
                'C언어/아두이노 심화 - 블록 코딩을 넘어 텍스트 코딩으로 정밀 제어',
                '미션 수행 - 정밀속도 제어로 8자 비행, 정밀 착륙 등 대회 규정에 맞춘 실전 훈련',
                'IRO 로봇올림피아드 에어로봇 종목 준비',
            ],
            color: 'from-purple-600 to-pink-600',
            bgColor: 'from-purple-900/20 to-pink-900/20',
        },
    ];

    return (
        <section className="py-20 bg-[#1A1A1A]">
            {/* Sky gradient background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        radial-gradient(circle at 30% 20%, rgba(135, 206, 235, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(10, 25, 49, 0.3) 0%, transparent 50%)
                    `,
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-16">
                        <h2 className="text-sky-500 font-bold tracking-wider mb-2">CURRICULUM ROADMAP</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">
                            4단계로 완성하는<br />
                            항공 AI 마스터 과정
                        </h3>
                        <p className="text-gray-300">
                            항공 역학과 알고리즘이 결합된 최상위 마스터 과정
                        </p>
                    </div>
                </ScrollAnimation>

                {/* Tech Stack Tabs */}
                <ScrollAnimation direction="fade" delay={100}>
                    <div className="max-w-4xl mx-auto mb-16">
                        <div className="bg-gray-800 rounded-xl p-1.5 sm:p-2 border border-gray-700">
                            <div
                                onMouseEnter={() => setActiveTab('blocks')}
                                onTouchStart={() => setActiveTab('blocks')}
                                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer text-gray-300"
                            >
                                MBlocks (블록코딩)
                            </div>
                            <div
                                onMouseEnter={() => setActiveTab('arduino')}
                                onTouchStart={() => setActiveTab('arduino')}
                                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer text-gray-300"
                            >
                                Arduino C++ (텍스트코딩)
                            </div>
                        </div>
                        <div className="mt-4 text-center min-h-[2rem]">
                            {activeTab === 'blocks' ? (
                                <p className="text-gray-300">
                                    마우스 클릭으로 비행 원리를 직관적으로 이해합니다.
                                </p>
                            ) : (
                                <p className="text-gray-300">
                                    전문가 수준의 정밀한 센서 제어와 알고리즘을 작성합니다.
                                </p>
                            )}
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Curriculum Steps */}
                <div className="space-y-8 sm:space-y-10 md:space-y-12">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <ScrollAnimation
                                key={index}
                                direction={index % 2 === 0 ? 'right' : 'left'}
                                delay={index * 200}
                            >
                                <div className="group relative bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl active:shadow-2xl hover:shadow-2xl transition-all duration-500 active:-translate-y-1 hover:-translate-y-2 overflow-hidden border border-gray-700">
                                    {/* Background gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${step.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                    
                                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
                                        {/* Left: Visual */}
                                        {index === 0 ? (
                                            /* YouTube Video for first step */
                                            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-gray-900 border border-gray-700">
                                                <iframe
                                                    className="w-full h-full"
                                                    src="https://www.youtube.com/embed/CHn_q5l6itU?autoplay=1&rel=0"
                                                    title="항공 이론 및 제어 기초 - Aeronautics & Logic"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    style={{ border: 'none' }}
                                                />
                                            </div>
                                        ) : (
                                            <div className={`relative h-64 md:h-auto bg-gradient-to-br ${step.bgColor} rounded-2xl overflow-hidden`}>
                                                <div className="w-full h-full flex items-center justify-center p-8">
                                                    <div className="text-center">
                                                        <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg`}>
                                                            <Icon className="w-12 h-12 text-white" />
                                                        </div>
                                                        <div className="text-6xl font-black text-gray-700">
                                                            {step.number}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Right: Content */}
                                        <div>
                                            <div className="mb-4">
                                                <span className="text-xs font-semibold text-gray-400">
                                                    {step.subtitle}
                                                </span>
                                                <h4 className="text-2xl md:text-3xl font-bold text-white">
                                                    {step.title}
                                                </h4>
                                            </div>
                                            
                                            <p className="text-gray-300">
                                                {step.description}
                                            </p>

                                            {/* Activities */}
                                            <div className="space-y-3">
                                                {step.activities.map((activity, i) => (
                                                    <div key={i} className="flex items-start gap-3">
                                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${step.color} mt-2 flex-shrink-0`}></div>
                                                        <span className="text-sm text-gray-300">{activity}</span>
                                                    </div>
                                                ))}
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

