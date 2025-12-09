'use client';

import ScrollAnimation from './ScrollAnimation';
import { Brain, Eye, Rocket } from 'lucide-react';
import Image from 'next/image';

export default function AdvancedCourseOverview() {
    const concepts = [
        {
            icon: Brain,
            title: 'Think',
            description: '데이터를 해석하고',
            color: 'from-neon-purple to-purple-600',
        },
        {
            icon: Eye,
            title: 'See',
            description: '세상을 보고',
            color: 'from-deep-electric-blue to-blue-600',
        },
        {
            icon: Rocket,
            title: 'Act',
            description: '스스로 행동한다',
            color: 'from-active-orange to-orange-600',
        },
    ];

    return (
        <section className="py-20 bg-[#1A1A1A] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 right-10 w-96 h-96 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
                    {/* Left: Text Content */}
                    <ScrollAnimation direction="right" delay={100}>
                        <div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                                단순한 코딩 학원이 아닌,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-deep-electric-blue">
                                    미래 기술자를 양성하는 연구소
                                </span>
                            </h2>
                            <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-6 sm:mb-8">
                                Advanced Course는 로봇에게 단순히 명령을 내리는 것을 넘어, 로봇이 세상을 <strong className="text-neon-purple">'보고(See)'</strong> 데이터를 <strong className="text-deep-electric-blue">'해석(Think)'</strong>하여 스스로 <strong className="text-active-orange">'행동(Act)'</strong>하게 만드는 심화 과정입니다. 현업 개발자들이 사용하는 툴과 언어를 미리 경험하며 미래의 AI 엔지니어로서의 역량을 키웁니다.
                            </p>
                            
                            {/* Concept visualization */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {concepts.map((concept, index) => {
                                    const Icon = concept.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-3 bg-black/40 rounded-lg p-4 border border-gray-800">
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${concept.color} flex items-center justify-center flex-shrink-0`}>
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
                            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-neon-purple/20 via-deep-electric-blue/20 to-black border border-neon-purple/30 group">
                                {/* Advanced Course Image */}
                                <Image
                                    src="/img/Advanced.png"
                                    alt="미래 기술자를 양성하는 연구소 - Advanced Course"
                                    fill
                                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={90}
                                    priority
                                />
                                
                                {/* Gradient overlay for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Glowing effect */}
                                <div className="absolute top-4 right-4 w-20 h-20 bg-neon-purple/30 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 bg-deep-electric-blue/30 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}

