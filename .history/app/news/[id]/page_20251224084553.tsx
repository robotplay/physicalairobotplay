'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Calendar, ArrowLeft, Newspaper, Clock } from 'lucide-react';
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
    updatedAt?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
    '공지사항': 'bg-blue-500',
    '대회 소식': 'bg-purple-500',
    '교육 정보': 'bg-green-500',
    '수업 스케치': 'bg-orange-500',
};

export default function NewsDetailPage() {
    const params = useParams();
    const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNews = async () => {
            try {
                // Next.js 16에서는 params가 Promise일 수 있음
                const resolvedParams = params instanceof Promise ? await params : params;
                const id = resolvedParams.id as string;
                
                if (!id) {
                    setError('공지사항 ID가 없습니다.');
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(`/api/news/${id}`);
                const result = await response.json();

                if (result.success) {
                    setNewsItem(result.data);
                } else {
                    setError(result.error || '공지사항을 불러올 수 없습니다.');
                }
            } catch (error) {
                console.error('Failed to load news:', error);
                setError('공지사항을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadNews();
    }, [params]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#1A1A1A] text-white">
                <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="text-center py-20">
                            <div className="w-16 h-16 border-4 border-deep-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">로딩 중...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !newsItem) {
        return (
            <main className="min-h-screen bg-[#1A1A1A] text-white">
                <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="text-center py-20">
                            <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">공지사항을 찾을 수 없습니다</h2>
                            <p className="text-gray-400 mb-8">{error || '요청하신 공지사항이 존재하지 않습니다.'}</p>
                            <Link
                                href="/news"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-deep-electric-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                목록으로 돌아가기
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#1A1A1A] text-white">
            <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-deep-electric-blue transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>목록으로 돌아가기</span>
                        </Link>
                    </div>

                    {/* Article */}
                    <article className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
                        {/* Image */}
                        {newsItem.image && (
                            <div className="relative w-full aspect-video overflow-hidden bg-gray-900">
                                <Image
                                    src={newsItem.image}
                                    alt={newsItem.title}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                    quality={90}
                                    unoptimized={newsItem.image.startsWith('/uploads/')}
                                    onError={(e) => {
                                        // 이미지 로드 실패 시 기본 이미지로 대체
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/img/01.jpeg';
                                    }}
                                />
                                <div className="absolute top-6 left-6">
                                    <span className={`px-4 py-2 text-white text-sm font-semibold rounded-full ${CATEGORY_COLORS[newsItem.category] || 'bg-gray-500'}`}>
                                        {newsItem.category}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6 sm:p-8 md:p-12">
                            {/* Header */}
                            <div className="mb-6 pb-6 border-b border-gray-700">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                                    {newsItem.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>작성일: {formatDate(newsItem.createdAt)}</span>
                                    </div>
                                    {newsItem.updatedAt && newsItem.updatedAt !== newsItem.createdAt && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>수정일: {formatDate(newsItem.updatedAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="prose prose-invert max-w-none">
                                <div className="text-base sm:text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {newsItem.content}
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Related Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            전체 목록 보기
                        </Link>
                        <Link
                            href="/#news"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-electric-blue via-active-orange to-deep-electric-blue bg-[length:200%_100%] hover:bg-[length:100%_100%] text-white font-semibold rounded-lg transition-all"
                        >
                            메인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
