'use client';

import ScrollAnimation from './ScrollAnimation';
import { Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function AirRobotShowcase() {
    const evolution = [
        {
            stage: '기본 프레임',
            description: '드론의 기본 구조',
            image: '🤖',
        },
        {
            stage: '스킨 부착',
            description: '종이/폼보드로 창의적 디자인',
            image: '✈️',
        },
        {
            stage: '완성된 드론',
            description: '용 드론/우주선 드론이 날아오르는 모습',
            image: '🐉',
        },
    ];

    const projects = [
        {
            title: '용 드론',
            description: '상상하는 모든 것이 드론이 됩니다',
            type: '창작형',
        },
        {
            title: '우주선 드론',
            description: '공기 역학적 구조를 고려한 설계',
            type: '융합형',
        },
        {
            title: '호버크래프트',
            description: '하늘을 날다가 땅을 미끄러지는 변신 코딩',
            type: '혁신형',
        },
    ];

    return (
        <section className="py-20 bg-white dark:bg-[#0A1931] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-sky-400 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-16">
                        <h2 className="text-sky-500 font-bold tracking-wider mb-2">CREATIVE SHOWCASE</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            상상하는 모든 것이 드론이 됩니다
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Before & After - Evolution 스타일로 보여주는 창작 과정
                        </p>
                    </div>
                </ScrollAnimation>

                {/* Evolution Timeline */}
                <ScrollAnimation direction="fade" delay={100}>
                    <div className="mb-16">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                            {evolution.map((item, index) => (
                                <div key={index} className="flex-1 text-center group">
                                    <div className="relative mb-6">
                                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-sky-100 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform shadow-lg">
                                            {item.image}
                                        </div>
                                        {index < evolution.length - 1 && (
                                            <div className="hidden md:block absolute top-1/2 left-full w-16 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 transform -translate-y-1/2">
                                                <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 text-sky-500" />
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.stage}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Project Gallery */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {projects.map((project, index) => (
                        <ScrollAnimation
                            key={index}
                            direction="up"
                            delay={index * 150}
                        >
                            <div className="group relative bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-sky-400/50 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-xl">
                                {/* Project visual */}
                                <div className="relative h-48 bg-gradient-to-br from-sky-200 via-blue-200 to-indigo-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
                                    {index === 0 ? (
                                        <Image
                                            src="/img/drone02.png"
                                            alt={project.title}
                                            fill
                                            className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            quality={90}
                                        />
                                    ) : index === 1 ? (
                                        <Image
                                            src="/img/drone04.png"
                                            alt={project.title}
                                            fill
                                            className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            quality={90}
                                        />
                                    ) : index === 2 ? (
                                        <Image
                                            src="/img/drone03.png"
                                            alt={project.title}
                                            fill
                                            className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            quality={90}
                                        />
                                    ) : null}
                                    
                                    {/* Gradient overlay for better visibility */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    {/* Type badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="px-3 py-1 bg-sky-500 text-white text-xs font-bold rounded-full">
                                            {project.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 sm:p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-sky-500" />
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project #{index + 1}</span>
                                    </div>
                                    
                                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-active:text-sky-600 dark:group-active:text-sky-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                        {project.title}
                                    </h4>
                                    
                                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    );
}

