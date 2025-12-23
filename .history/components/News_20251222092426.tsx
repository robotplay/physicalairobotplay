'use client';

import { useState, useEffect } from 'react';
import ScrollAnimation from './ScrollAnimation';
import { Newspaper, Calendar, ArrowRight, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsItem {
    _id: string;
    id: string;
    category: string;
    title: string;
    content: string;
    excerpt: string;
    image: string;
    createdAt: string;
}

export default function News() {
    const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const response = await fetch('/api/news?limit=3&sort=desc');
                const result = await response.json();
                if (result.success) {
                    setLatestNews(result.data || []);
                }
            } catch (error) {
                console.error('Failed to load news:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadNews();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).replace(/\./g, '.').replace(/\s/g, '');
    };

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
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse">
                                <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : latestNews.length === 0 ? (
                    <div className="text-center py-16 mb-12 sm:mb-16">
                        <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">아직 공지사항이 없습니다.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                        {latestNews.map((item, index) => (
                            <ScrollAnimation key={item._id} direction="up" delay={index * 150}>
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
                                                <span>{formatDate(item.createdAt)}</span>
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-deep-electric-blue transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm sm:text-base text-gray-300 line-clamp-3 mb-4 flex-1">
                                                {item.excerpt || item.content.substring(0, 100) + '...'}
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
                )}

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
