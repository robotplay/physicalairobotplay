'use client';

import ScrollAnimation from './ScrollAnimation';
import { Newspaper, Calendar, ArrowRight, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function News() {
    // 최신 소식 3개만 미리보기
    const latestNews = [
        {
            id: 1,
            category: '공지사항',
            title: '2025년 봄학기 신규 수강생 모집 안내',
            date: '2025.01.15',
            excerpt: '2025년 봄학기 신규 수강생을 모집합니다. Basic Course, Advanced Course, AirRobot Course 모두 모집 중입니다.',
            image: '/img/01.jpeg',
        },
        {
            id: 2,
            category: '대회 소식',
            title: 'IRO 국제로봇올림피아드 수상 소식',
            date: '2025.01.10',
            excerpt: '우리 학원 학생들이 IRO 국제로봇올림피아드에서 우수한 성과를 거두었습니다. 금상 2명, 은상 3명, 동상 5명이 수상했습니다.',
            image: '/img/02.jpeg',
        },
        {
            id: 3,
            category: '교육 정보',
            title: '로봇 코딩 교육의 중요성',
            date: '2025.01.05',
            excerpt: '4차 산업혁명 시대에 로봇 코딩 교육이 왜 중요한지, 그리고 우리 아이들에게 어떤 도움이 되는지에 대해 설명합니다.',
            image: '/img/03.jpeg',
        },
    ];

    return (
        <section id="news" className="py-12 sm:py-16 md:py-20 bg-[#1A1A1A] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 right-10 w-72 h-72 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-active-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-deep-electric-blue/10 rounded-full border border-deep-electric-blue/20 mb-4 sm:mb-6">
                            <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-deep-electric-blue animate-pulse" />
                            <span className="text-xs sm:text-sm text-deep-electric-blue font-semibold">NEWS & NOTICES</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                            최신 소식 및 공지사항
                        </h2>
                        <p className="text-base sm:text-lg text-gray-300 mt-4 sm:mt-6">
                            PAR Play의 최신 소식과 교육 정보를 확인하세요
                        </p>
                    </div>
                </ScrollAnimation>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                    {latestNews.map((item, index) => (
                        <ScrollAnimation key={item.id} direction="up" delay={index * 150}>
                            <Link href="/news" className="group">
                                <article className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700 hover:border-deep-electric-blue/50 cursor-pointer h-full flex flex-col">
                                    {/* Image */}
                                    <div className="relative h-48 sm:h-56 overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            quality={85}
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-deep-electric-blue text-white text-xs font-semibold rounded-full">
                                                {item.category}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 sm:p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-3">
                                            <Calendar className="w-4 h-4" />
                                            <span>{item.date}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-deep-electric-blue transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-300 line-clamp-3 mb-4 flex-1">
                                            {item.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-deep-electric-blue text-sm font-semibold group-hover:translate-x-2 transition-transform">
                                            <span>자세히 보기</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </ScrollAnimation>
                    ))}
                </div>

                {/* View All Button */}
                <ScrollAnimation direction="fade" delay={400}>
                    <div className="text-center">
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-deep-electric-blue via-active-orange to-deep-electric-blue bg-[length:200%_100%] hover:bg-[length:100%_100%] text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg"
                        >
                            <FileText className="w-5 h-5" />
                            전체 소식 보기
                        </Link>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
