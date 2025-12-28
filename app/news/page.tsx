'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Calendar, ArrowLeft, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
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

const CATEGORY_COLORS: Record<string, string> = {
    '공지사항': 'bg-blue-500',
    '대회 소식': 'bg-purple-500',
    '교육 정보': 'bg-green-500',
    '수업 스케치': 'bg-orange-500',
};

export default function NewsPage() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const categories = [
        { value: 'all', label: '전체' },
        { value: '공지사항', label: '공지사항' },
        { value: '대회 소식', label: '대회 소식' },
        { value: '교육 정보', label: '교육 정보' },
        { value: '수업 스케치', label: '수업 스케치' },
    ];

    useEffect(() => {
        const loadNews = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    sort: 'desc',
                    page: currentPage.toString(),
                    limit: '6',
                });
                
                if (selectedCategory !== 'all') {
                    params.append('category', selectedCategory);
                }

                const response = await fetch(`/api/news?${params.toString()}`);
                const result = await response.json();
                if (result.success) {
                    setNewsItems(result.data || []);
                    setTotalPages(result.totalPages || 1);
                    setTotalCount(result.totalCount || 0);
                }
            } catch (error) {
                console.error('Failed to load news:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadNews();
    }, [currentPage, selectedCategory]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1); // 카테고리 변경 시 첫 페이지로
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                            <p className="text-base sm:text-lg text-gray-300 mb-6">
                                PAR Play의 최신 소식과 교육 정보를 확인하세요
                            </p>
                            <p className="text-sm text-gray-400">
                                총 {totalCount}개의 게시물
                            </p>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-8 sm:mb-12">
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                            {categories.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => handleCategoryChange(category.value)}
                                    className={`
                                        px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold text-sm sm:text-base
                                        transition-all duration-300 transform hover:scale-105 active:scale-95
                                        ${
                                            selectedCategory === category.value
                                                ? 'bg-gradient-to-r from-deep-electric-blue to-active-orange text-white shadow-lg'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                                        }
                                    `}
                                >
                                    {category.label}
                                </button>
                            ))}
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
                                <Link
                                    key={item._id}
                                    href={`/news/${item._id}`}
                                    className="group bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700 hover:border-deep-electric-blue/50 cursor-pointer block"
                                >
                                    {/* Image */}
                                    <div className="relative w-full aspect-video overflow-hidden bg-gray-900">
                                        {item.image?.startsWith('data:image/') ? (
                                            // Base64 이미지
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            // 일반 이미지 URL
                                            <Image
                                                src={item.image || '/img/01.jpeg'}
                                                alt={item.title}
                                                fill
                                                className="object-contain group-hover:scale-105 transition-transform duration-700"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                quality={85}
                                                unoptimized={item.image?.startsWith('/uploads/')}
                                                onError={(e) => {
                                                    // 이미지 로드 실패 시 기본 이미지로 대체
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/img/01.jpeg';
                                                }}
                                            />
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${CATEGORY_COLORS[item.category] || 'bg-deep-electric-blue'}`}>
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
                                        <p className="text-sm sm:text-base text-gray-300 line-clamp-3 mb-4">
                                            {item.excerpt || item.content.substring(0, 100) + '...'}
                                        </p>
                                        <div className="flex items-center gap-2 text-deep-electric-blue text-sm font-semibold group-hover:translate-x-2 transition-transform">
                                            <span>자세히 보기</span>
                                            <span>→</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 sm:mt-16 flex items-center justify-center gap-2 sm:gap-3">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`
                                    flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold
                                    transition-all duration-300 transform hover:scale-105 active:scale-95
                                    ${
                                        currentPage === 1
                                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                            : 'bg-gray-800 text-white hover:bg-deep-electric-blue border border-gray-700'
                                    }
                                `}
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="hidden sm:inline">이전</span>
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    // 페이지가 많을 때 표시할 페이지 수 제한
                                    const showPage = 
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1);

                                    if (!showPage) {
                                        // 생략 표시
                                        if (page === currentPage - 2 || page === currentPage + 2) {
                                            return (
                                                <span key={page} className="px-2 text-gray-500">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`
                                                w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl font-bold text-sm sm:text-base
                                                transition-all duration-300 transform hover:scale-110 active:scale-95
                                                ${
                                                    currentPage === page
                                                        ? 'bg-gradient-to-r from-deep-electric-blue to-active-orange text-white shadow-lg'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                                                }
                                            `}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`
                                    flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold
                                    transition-all duration-300 transform hover:scale-105 active:scale-95
                                    ${
                                        currentPage === totalPages
                                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                            : 'bg-gray-800 text-white hover:bg-deep-electric-blue border border-gray-700'
                                    }
                                `}
                            >
                                <span className="hidden sm:inline">다음</span>
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}




