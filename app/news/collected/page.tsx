'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Calendar, Search, Filter, ArrowRight, Newspaper } from 'lucide-react';
import Link from 'next/link';
// import { sanitizeHtml } from '@/lib/sanitize'; // 사용하지 않음
import type { CollectedNewsArticle } from '@/types';

const Footer = dynamic(() => import('@/components/Footer'), {
    loading: () => <div className="py-20" />,
    ssr: true,
});

const CATEGORY_LABELS: Record<string, string> = {
    education: '교육',
    technology: '기술',
    competition: '대회',
    general: '일반',
};

const CATEGORY_COLORS: Record<string, string> = {
    education: 'bg-green-500',
    technology: 'bg-blue-500',
    competition: 'bg-purple-500',
    general: 'bg-gray-500',
};

export default function CollectedNewsPage() {
    const [articles, setArticles] = useState<CollectedNewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'relevance'>('newest');
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const categories = [
        { value: 'all', label: '전체' },
        { value: 'education', label: '교육' },
        { value: 'technology', label: '기술' },
        { value: 'competition', label: '대회' },
        { value: 'general', label: '일반' },
    ];

    useEffect(() => {
        const loadArticles = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    limit: '12',
                    sort: sortBy,
                });

                if (selectedCategory !== 'all') {
                    params.append('category', selectedCategory);
                }

                if (searchKeyword.trim()) {
                    params.append('keyword', searchKeyword.trim());
                }

                const response = await fetch(`/api/collected-news?${params.toString()}`);
                const result = await response.json();

                if (result.success) {
                    // imageUrl이 빈 문자열인 경우 undefined로 처리
                    const processedArticles = (result.data.articles || []).map((article: CollectedNewsArticle) => ({
                        ...article,
                        imageUrl: article.imageUrl && article.imageUrl.trim() !== '' ? article.imageUrl : undefined,
                    }));
                    
                    console.log('목록 기사 로딩 완료:', {
                        count: processedArticles.length,
                        withImages: processedArticles.filter((a: CollectedNewsArticle) => a.imageUrl).length,
                        sampleImageUrl: processedArticles.find((a: CollectedNewsArticle) => a.imageUrl)?.imageUrl?.substring(0, 100),
                    });
                    
                    setArticles(processedArticles);
                    setTotalPages(result.data.pagination.totalPages || 1);
                    setTotal(result.data.pagination.total || 0);
                }
            } catch (error) {
                console.error('Failed to load articles:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadArticles();
    }, [currentPage, selectedCategory, searchKeyword, sortBy]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // 검색 시 첫 페이지로
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).replace(/\./g, '.').replace(/\s/g, '');
    };

    const renderImage = (title: string, imageUrl?: string) => {
        console.log('목록 이미지 렌더링:', { title, imageUrl, hasImageUrl: !!imageUrl, imageUrlType: typeof imageUrl });
        
        // imageUrl이 없거나 빈 문자열인 경우
        if (!imageUrl || (typeof imageUrl === 'string' && imageUrl.trim() === '')) {
            console.log('목록 이미지 URL이 없음 - placeholder 표시');
            return (
                <div className="w-full h-48 bg-gray-700 rounded-t-lg flex items-center justify-center">
                    <Newspaper className="w-12 h-12 text-gray-500" />
                </div>
            );
        }

        const trimmedUrl = imageUrl.trim();
        console.log('목록 이미지 URL 처리:', { trimmedUrl, startsWithData: trimmedUrl.startsWith('data:'), startsWithHttps: trimmedUrl.startsWith('https://'), startsWithHttp: trimmedUrl.startsWith('http://') });

        // Base64 이미지 처리
        if (trimmedUrl.startsWith('data:image/') || trimmedUrl.startsWith('data:')) {
            console.log('목록 Base64 이미지로 처리');
            return (
                <img
                    src={trimmedUrl}
                    alt={title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                        console.error('목록 Base64 이미지 로딩 실패:', trimmedUrl.substring(0, 50));
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                            parent.innerHTML = `
                                <div class="w-full h-48 bg-gray-700 rounded-t-lg flex items-center justify-center">
                                    <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            `;
                        }
                    }}
                    onLoad={() => {
                        console.log('목록 Base64 이미지 로딩 성공');
                    }}
                />
            );
        }

        // CDN URL 처리 (Vercel Blob Storage 등) - https:// 또는 http://
        if (trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('http://')) {
            console.log('목록 CDN/HTTP 이미지로 처리:', trimmedUrl);
            return (
                <img
                    src={trimmedUrl}
                    alt={title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    crossOrigin="anonymous"
                    loading="lazy"
                    onError={(e) => {
                        console.error('목록 CDN 이미지 로딩 실패:', trimmedUrl);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                            parent.innerHTML = `
                                <div class="w-full h-48 bg-gray-700 rounded-t-lg flex items-center justify-center">
                                    <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            `;
                        }
                    }}
                    onLoad={() => {
                        console.log('목록 CDN 이미지 로딩 성공:', trimmedUrl);
                    }}
                />
            );
        }

        // 로컬 이미지
        console.log('목록 로컬 이미지로 처리:', trimmedUrl);
        return (
            <Image
                src={trimmedUrl}
                alt={title}
                width={400}
                height={192}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={() => {
                    console.error('목록 로컬 이미지 로딩 실패:', trimmedUrl);
                }}
                onLoad={() => {
                    console.log('목록 로컬 이미지 로딩 성공');
                }}
            />
        );
    };

    return (
        <div className="min-h-screen bg-[#1A1A1A]">
            {/* Header */}
            <div className="bg-gradient-to-r from-deep-electric-blue/20 to-active-orange/20 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-deep-electric-blue/10 rounded-full border border-deep-electric-blue/20 mb-4">
                            <Newspaper className="w-5 h-5 text-deep-electric-blue" />
                            <span className="text-sm text-deep-electric-blue font-semibold">
                                COLLECTED NEWS
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
                            Physical AI Robot 관련 뉴스
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                            로봇 교육, AI 기술, 대회 소식 등 Physical AI Robot 관련 최신 기사를 확인하세요
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
                <div className="bg-gray-800 rounded-2xl p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    placeholder="키워드로 검색..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-deep-electric-blue"
                                />
                            </div>
                        </form>

                        {/* Sort */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'newest' | 'relevance')}
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-deep-electric-blue appearance-none"
                            >
                                <option value="newest">최신순</option>
                                <option value="relevance">관련성순</option>
                            </select>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => {
                                    setSelectedCategory(category.value);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedCategory === category.value
                                        ? 'bg-deep-electric-blue text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Articles Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-700"></div>
                                <div className="p-6">
                                    <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-16">
                        <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">수집된 기사가 없습니다.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-gray-400">
                            총 <span className="text-white font-semibold">{total}</span>개의 기사
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <Link
                                    key={article._id}
                                    href={`/news/collected/${article._id}`}
                                    className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-750 transition-colors group"
                                >
                                    {renderImage(article.title, article.imageUrl)}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    CATEGORY_COLORS[article.category] || 'bg-gray-500'
                                                } text-white`}
                                            >
                                                {CATEGORY_LABELS[article.category] || article.category}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {article.source}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-deep-electric-blue transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(article.publishedAt as string)}</span>
                                            </div>
                                            <div className="flex items-center gap-1 group-hover:text-deep-electric-blue transition-colors">
                                                <span>자세히 보기</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                                >
                                    이전
                                </button>
                                <div className="flex gap-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum: number;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-4 py-2 rounded-lg transition-colors ${
                                                    currentPage === pageNum
                                                        ? 'bg-deep-electric-blue text-white'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                                >
                                    다음
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}

