'use client';

import ScrollAnimation from './ScrollAnimation';
import { Award, Rocket, Cpu, Globe } from 'lucide-react';
import Image from 'next/image';

export default function History() {
    const events = [
        {
            year: "2018",
            title: "교육의 시작",
            description: "아이들의 눈높이에서 시작된 첫 번째 코딩 클래스. 작은 호기심이 큰 꿈으로 자라나기 시작했습니다.",
            icon: Rocket,
            image: '/img/01.jpg',
        },
        {
            year: "2020",
            title: "대통령상 수상",
            description: "전국 청소년 로봇올림피아드 FIRA 국제로봇컨테스트 대회 다수 수상 우리의 교육 방식이 틀리지 않았음을 증명한 순간이었습니다.",
            icon: Award,
            image: '/img/02.jpeg',
        },
        {
            year: "2023",
            title: "피지컬 AI 도입",
            description: "화면 속 코딩을 넘어, 실제 로봇을 제어하는 피지컬 AI 커리큘럼을 전면 도입했습니다.",
            icon: Cpu,
            image: '/img/03.jpg',
        },
        {
            year: "2024",
            title: "글로벌 챌린지",
            description: "세계 로봇 올림피아드 출전. 아이들은 이제 세계를 무대로 경쟁하고 협력합니다.",
            icon: Globe,
            image: '/img/04.jpeg',
        },
    ];

    return (
        <section className="py-20 bg-white dark:bg-black relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-active-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-16">
                        <h2 className="text-deep-electric-blue font-bold tracking-wider mb-2">OUR STORY</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                            우리가 걸어온 길,<br />그리고 아이들이 나아갈 미래
                        </h3>
                    </div>
                </ScrollAnimation>

                <div className="relative">
                    {/* Animated Vertical Line - Hidden on mobile */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full">
                        <div className="absolute inset-0 bg-gradient-to-b from-deep-electric-blue/20 via-deep-electric-blue to-deep-electric-blue/20"></div>
                        <div className="absolute top-0 left-0 w-full h-0 bg-gradient-to-b from-deep-electric-blue to-transparent animate-timeline-line"></div>
                    </div>

                    <div className="space-y-12 sm:space-y-16 md:space-y-20">
                        {events.map((event, index) => {
                            const Icon = event.icon;
                            return (
                                <ScrollAnimation
                                    key={index}
                                    direction={index % 2 === 0 ? 'right' : 'left'}
                                    delay={index * 200}
                                >
                                    <div className={`relative flex flex-col md:flex-row items-center group ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        {/* Image Side */}
                                        <div className={`w-full md:w-1/2 px-4 sm:px-6 md:px-8 mb-6 md:mb-0 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                                            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.02]">
                                                <Image
                                                    src={event.image}
                                                    alt={`${event.year} - ${event.title}`}
                                                    fill
                                                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    quality={85}
                                                    loading={index < 2 ? "eager" : "lazy"}
                                                    priority={index === 0}
                                                    unoptimized={process.env.NODE_ENV === 'development'}
                                                />
                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                {/* Year badge overlay */}
                                                <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full border-2 border-deep-electric-blue">
                                                    <span className="text-xl font-black text-deep-electric-blue">{event.year}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timeline Dot - Hidden on mobile */}
                                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 z-30">
                                            <div className="w-5 h-5 rounded-full bg-white border-4 border-deep-electric-blue shadow-[0_0_20px_rgba(0,82,255,0.6)] transition-all group-hover:scale-150 group-hover:shadow-[0_0_30px_rgba(0,82,255,0.8)]"></div>
                                            <div className="absolute inset-0 rounded-full bg-deep-electric-blue animate-ping opacity-75"></div>
                                        </div>

                                        {/* Content Side */}
                                        <div className={`w-full md:w-1/2 px-4 sm:px-6 md:px-8 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                                            <div className="text-center md:text-left h-full flex flex-col justify-center">
                                                <div className="relative z-10 transform transition-all group-hover:scale-105">
                                                    <div className="inline-flex items-center gap-2 mb-4 justify-center md:justify-start">
                                                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-deep-electric-blue" />
                                                        <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-deep-electric-blue">{event.title}</h4>
                                                    </div>
                                                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                                        {event.description}
                                                    </p>
                                                </div>
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
    );
}
