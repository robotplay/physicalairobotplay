'use client';

import { Instagram, Play, Sparkles } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';
import { useState } from 'react';

export default function Showcase() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="section-padding relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-active-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-16">
                        <h2 className="text-neon-purple font-bold tracking-wider mb-2">SHOWCASE</h2>
                        <h3 className="heading-lg text-gray-900 dark:text-white">
                            상상이 현실이 되는 순간
                        </h3>
                    </div>
                </ScrollAnimation>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[800px] md:h-[600px]">
                    {/* Large Item (Left) */}
                    <ScrollAnimation direction="right" delay={100}>
                        <div
                            className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 group cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(0)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
                            
                            {/* Animated overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-deep-electric-blue/20 via-active-orange/20 to-neon-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-5"></div>
                            
                            <div className="absolute bottom-0 left-0 p-8 z-20 transform transition-all group-hover:translate-y-0 translate-y-4">
                                <span className="px-3 py-1 bg-active-orange text-white text-xs font-bold rounded-full mb-3 inline-block animate-pulse">BEST PROJECT</span>
                                <h4 className="text-2xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">제미나이 연동 휴머노이드</h4>
                                <p className="text-gray-200">학생들이 직접 학습시킨 AI 모델로 대화하는 로봇입니다.</p>
                            </div>
                            
                            {/* Play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center z-15 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform">
                                    <Play className="w-10 h-10 text-white ml-1" />
                                </div>
                            </div>
                            
                            {/* Placeholder for Image/Video */}
                            <div className="w-full h-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 group-hover:scale-110 transition-transform duration-700"></div>
                        </div>
                    </ScrollAnimation>

                    {/* Medium Item (Top Right) */}
                    <ScrollAnimation direction="down" delay={200}>
                        <div
                            className="md:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-deep-electric-blue to-neon-purple group cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(1)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
                                <Instagram className="w-12 h-12 text-white group-hover:scale-125 group-hover:rotate-12 transition-all" />
                                <h4 className="text-white text-xl font-bold group-hover:scale-105 transition-transform">Instagram Feed</h4>
                                <div className="flex gap-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 bg-white rounded-full animate-pulse"
                                            style={{ animationDelay: `${i * 0.2}s` }}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            {/* Animated grid pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[length:200%_100%] animate-shimmer"></div>
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Small Item (Bottom Right 1) */}
                    <ScrollAnimation direction="up" delay={300}>
                        <div
                            className="relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 group cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(2)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-deep-electric-blue/60 to-transparent z-10 flex items-center justify-center group-hover:from-deep-electric-blue/80 transition-all">
                                <div className="text-center transform group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-8 h-8 text-white mx-auto mb-2 group-hover:animate-spin" />
                                    <span className="text-white font-bold text-lg">Class #1</span>
                                </div>
                            </div>
                            
                            {/* Animated background */}
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 group-hover:scale-110 transition-transform duration-500"></div>
                        </div>
                    </ScrollAnimation>

                    {/* Small Item (Bottom Right 2) */}
                    <ScrollAnimation direction="up" delay={400}>
                        <div
                            className="relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 group cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(3)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-active-orange/60 to-transparent z-10 flex items-center justify-center group-hover:from-active-orange/80 transition-all">
                                <div className="text-center transform group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-8 h-8 text-white mx-auto mb-2 group-hover:animate-spin" />
                                    <span className="text-white font-bold text-lg">Class #2</span>
                                </div>
                            </div>
                            
                            {/* Animated background */}
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 group-hover:scale-110 transition-transform duration-500"></div>
                        </div>
                    </ScrollAnimation>
                </div>

                <ScrollAnimation direction="fade" delay={500}>
                    <div className="mt-12 text-center">
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 text-deep-electric-blue font-bold hover:text-neon-purple transition-all group hover:scale-105"
                        >
                            <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            인스타그램에서 더 보기
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
