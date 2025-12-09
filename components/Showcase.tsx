'use client';

import { Instagram, Play, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Showcase() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    
    const images = [
        '/img/01.jpeg',
        '/img/02.jpeg',
        '/img/03.jpeg',
        '/img/04.jpeg',
        '/img/05.jpeg',
        '/img/06.jpeg',
    ];

    // Auto slide functionality (pause on hover/touch)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Touch handlers for swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();
    };

    return (
        <section id="news" className="section-padding relative overflow-hidden">
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

                {/* Image Slider */}
                <ScrollAnimation direction="fade" delay={100}>
                    <div className="relative max-w-6xl mx-auto px-4">
                        {/* Main Slider */}
                        <div 
                            className="relative h-[400px] sm:h-[500px] md:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-2xl group"
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            {/* Images */}
                            {images.map((src, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-700 ${
                                        index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                                >
                                    <Image
                                        src={src}
                                        alt={`상상이 현실이 되는 순간 ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                                        quality={85}
                                        priority={index === 0}
                                        loading={index === 0 ? "eager" : "lazy"}
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                </div>
                            ))}

                            {/* Navigation Buttons - Hidden on mobile, visible on tablet+ */}
                            <button
                                onClick={prevSlide}
                                className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 active:bg-white/30 hover:bg-white/30 backdrop-blur-md rounded-full items-center justify-center border border-white/30 transition-all active:scale-95 hover:scale-110 group touch-manipulation"
                                aria-label="이전 이미지"
                            >
                                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white group-active:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/20 active:bg-white/30 hover:bg-white/30 backdrop-blur-md rounded-full items-center justify-center border border-white/30 transition-all active:scale-95 hover:scale-110 group touch-manipulation"
                                aria-label="다음 이미지"
                            >
                                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white group-active:scale-110 transition-transform" />
                            </button>

                            {/* Slide Indicators - Larger on mobile for touch */}
                            <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-2">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`h-2 md:h-2 rounded-full transition-all touch-manipulation ${
                                            index === currentSlide
                                                ? 'bg-white w-8 md:w-8'
                                                : 'bg-white/50 active:bg-white/75 hover:bg-white/75 w-2'
                                        }`}
                                        aria-label={`슬라이드 ${index + 1}로 이동`}
                                    />
                                ))}
                            </div>

                            {/* Slide Counter - Smaller on mobile */}
                            <div className="absolute top-3 md:top-4 right-3 md:right-4 z-20 px-3 py-1.5 md:px-4 md:py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                                <span className="text-white text-xs md:text-sm font-semibold">
                                    {currentSlide + 1} / {images.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>

                <ScrollAnimation direction="fade" delay={500}>
                    <div className="mt-12 text-center">
                        <a
                            href="https://www.instagram.com/pysical_ai_robotplay/"
                            target="_blank"
                            rel="noopener noreferrer"
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
