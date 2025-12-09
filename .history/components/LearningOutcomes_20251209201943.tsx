'use client';

import { CheckCircle, Target, Brain, Lightbulb } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';

export default function LearningOutcomes() {
    const outcomes = [
        {
            icon: Target,
            title: '문제 해결 능력 향상',
            description: '로봇을 움직이기 위해 문제를 분석하고 해결책을 찾는 과정에서 자연스럽게 문제 해결 능력이 발달합니다.',
        },
        {
            icon: Brain,
            title: '공간 지각 능력 및 소근육 발달',
            description: '로봇을 조립하고 조작하는 과정에서 손의 정밀한 움직임과 공간 인식 능력이 향상됩니다.',
        },
        {
            icon: Lightbulb,
            title: '알고리즘적 사고 배양',
            description: '순차적이고 논리적인 사고 과정을 통해 알고리즘적 사고력이 체계적으로 발달합니다.',
        },
    ];

    return (
        <section className="py-20 bg-[#1A1A1A] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-10 sm:mb-12 md:mb-16">
                        <h2 className="text-deep-electric-blue font-bold tracking-wider mb-2 text-sm sm:text-base">LEARNING OUTCOMES</h2>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                            Basic Course를 통해<br />
                            얻을 수 있는 것들
                        </h3>
                        <p className="text-sm sm:text-base text-gray-300">
                            놀이처럼 재미있지만, 그 안에는 탄탄한 논리적 사고 교육이 담겨 있습니다.
                        </p>
                    </div>
                </ScrollAnimation>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                    {outcomes.map((outcome, index) => {
                        const Icon = outcome.icon;
                        return (
                            <ScrollAnimation
                                key={index}
                                direction="up"
                                delay={index * 150}
                            >
                                <div className="group relative bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg active:shadow-xl hover:shadow-xl transition-all duration-300 active:-translate-y-1 hover:-translate-y-2 border border-gray-100">
                                    {/* Check icon */}
                                    <div className="absolute top-4 right-4">
                                        <CheckCircle className="w-6 h-6 text-active-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Icon */}
                                    <div className="w-16 h-16 bg-active-orange/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-active-orange/20 group-hover:scale-110 transition-all">
                                        <Icon className="w-8 h-8 text-active-orange" />
                                    </div>

                                    {/* Content */}
                                    <h4 className="text-xl font-bold text-gray-900">
                                        {outcome.title}
                                    </h4>
                                    <p className="text-gray-600">
                                        {outcome.description}
                                    </p>

                                    {/* Hover effect line */}
                                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-active-orange to-deep-electric-blue group-hover:w-full transition-all duration-500"></div>
                                </div>
                            </ScrollAnimation>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}


