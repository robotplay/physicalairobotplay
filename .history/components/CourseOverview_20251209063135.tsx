'use client';

import ScrollAnimation from './ScrollAnimation';
import Image from 'next/image';

export default function CourseOverview() {
    return (
        <section className="py-20 bg-white dark:bg-black relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 right-10 w-96 h-96 bg-active-orange rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <ScrollAnimation direction="right" delay={100}>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                내 손끝에서 시작되는<br />
                                <span className="text-active-orange">로봇의 첫 움직임</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                Basic Course는 코딩이 처음인 친구들을 위한 입문 과정입니다. 복잡한 텍스트 코딩 대신 직관적인 블록 코딩을 통해 논리적 사고력을 키우고, 화면 속이 아닌 현실 세계에서 작동하는 <strong className="text-active-orange">'피지컬 AI'</strong>의 기초를 다집니다.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-active-orange rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">입문 과정</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-deep-electric-blue rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">블록 코딩 기반</span>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Right: Image/Visual */}
                    <ScrollAnimation direction="left" delay={200}>
                        <div className="relative">
                            <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group">
                                {/* Basic Course Image */}
                                <Image
                                    src="/img/basic04.png"
                                    alt="내 손끝에서 시작되는 로봇의 첫 움직임 - Basic Course"
                                    fill
                                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={90}
                                    priority
                                />
                                
                                {/* Gradient overlay for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Decorative elements */}
                                <div className="absolute top-4 right-4 w-20 h-20 bg-active-orange/20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                                <div className="absolute bottom-4 left-4 w-16 h-16 bg-deep-electric-blue/20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>
            </div>
        </section>
    );
}


