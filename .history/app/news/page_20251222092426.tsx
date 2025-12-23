'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Calendar, ArrowLeft, Newspaper } from 'lucide-react';
import Link from 'next/link';

const Footer = dynamic(() => import('@/components/Footer'), {
    loading: () => <div className="py-20" />,
    ssr: true,
});

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

export default function NewsPage() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const response = await fetch('/api/news?sort=desc');
                const result = await response.json();
                if (result.success) {
                    setNewsItems(result.data || []);
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
        <main className="min-h-screen bg-[#1A1A1A] text-white">
            <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    {/* Header */}
                    <div className="mb-8 sm:mb-12">
                        <Link
                            href="/#news"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-deep-electric-blue transition-colors mb-6"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>메인으로 돌아가기</span>
                        </Link>
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
                                소식 및 공지사항
                            </h1>
                            <p className="text-base sm:text-lg text-gray-300">
                                PAR Play의 최신 소식과 교육 정보를 확인하세요
                            </p>
                        </div>
                    </div>

                    {/* News Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse">
                                    <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : newsItems.length === 0 ? (
                        <div className="text-center py-16">
                            <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">아직 공지사항이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {newsItems.map((item) => (
                                <article
                                    key={item._id}
                                    className="group bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700 hover:border-deep-electric-blue/50 cursor-pointer"
                                >
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
                                    <div className="p-6 sm:p-8">
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-3">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(item.createdAt)}</span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-deep-electric-blue transition-colors line-clamp-2">
                                            {item.title}
                                        </h2>
                                        <p className="text-sm sm:text-base text-gray-300 line-clamp-3">
                                            {item.excerpt || item.content.substring(0, 100) + '...'}
                                        </p>
                                        <div className="mt-4 text-deep-electric-blue text-sm font-semibold group-hover:translate-x-2 transition-transform">
                                            자세히 보기 →
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Pagination (추후 구현) */}
                    <div className="mt-12 sm:mt-16 text-center">
                        <div className="inline-flex gap-2">
                            <button className="px-4 py-2 bg-deep-electric-blue text-white rounded-lg hover:bg-blue-700 transition-colors">
                                1
                            </button>
                            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                2
                            </button>
                            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                3
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
