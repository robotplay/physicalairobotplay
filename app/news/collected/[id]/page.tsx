'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Calendar, ArrowLeft, ExternalLink, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/sanitize';
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

export default function CollectedNewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [article, setArticle] = useState<CollectedNewsArticle | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<CollectedNewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [articleId, setArticleId] = useState<string>('');

    useEffect(() => {
        const getParams = async () => {
            const resolvedParams = await params;
            setArticleId(resolvedParams.id);
        };
        getParams();
    }, [params]);

    useEffect(() => {
        if (!articleId) return;

        const loadArticle = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/collected-news/${articleId}`);
                const result = await response.json();

                if (result.success) {
                    const articleData = result.data.article;
                    console.log('기사 데이터:', {
                        title: articleData.title,
                        imageUrl: articleData.imageUrl,
                        imageUrlType: typeof articleData.imageUrl,
                        imageUrlLength: articleData.imageUrl?.length,
                        imageUrlPreview: articleData.imageUrl?.substring(0, 100),
                        hasImageUrl: !!articleData.imageUrl,
                    });
                    
                    // imageUrl이 빈 문자열이거나 null인 경우 undefined로 처리
                    if (!articleData.imageUrl || articleData.imageUrl.trim() === '' || articleData.imageUrl === null) {
                        articleData.imageUrl = undefined;
                    } else {
                        // imageUrl이 있으면 trim 처리
                        articleData.imageUrl = articleData.imageUrl.trim();
                    }
                    
                    setArticle(articleData);
                    setRelatedArticles(result.data.relatedArticles || []);
                } else {
                    console.error('기사 로딩 실패:', result.error);
                }
            } catch (error) {
                console.error('Failed to load article:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadArticle();
    }, [articleId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const renderImage = (title: string, imageUrl?: string) => {
        console.log('renderImage 호출:', { title, imageUrl, hasImageUrl: !!imageUrl, imageUrlType: typeof imageUrl });
        
        // imageUrl이 없거나 빈 문자열인 경우
        if (!imageUrl || (typeof imageUrl === 'string' && imageUrl.trim() === '')) {
            console.log('이미지 URL이 없음 - placeholder 표시');
            return (
                <div className="w-full mb-6 h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            );
        }

        const trimmedUrl = imageUrl.trim();
        console.log('이미지 URL 처리:', { trimmedUrl, startsWithData: trimmedUrl.startsWith('data:'), startsWithHttps: trimmedUrl.startsWith('https://') });

        // Base64 이미지 처리
        if (trimmedUrl.startsWith('data:image/') || trimmedUrl.startsWith('data:')) {
            console.log('Base64 이미지로 처리');
            return (
                <div className="w-full mb-6">
                    <img
                        src={trimmedUrl}
                        alt={title}
                        className="w-full h-auto rounded-lg object-contain max-h-[600px]"
                        onError={(e) => {
                            console.error('Base64 이미지 로딩 실패:', trimmedUrl.substring(0, 50));
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                        onLoad={() => {
                            console.log('Base64 이미지 로딩 성공');
                        }}
                    />
                </div>
            );
        }

        // CDN URL 처리 (Vercel Blob Storage 등)
        if (trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('http://')) {
            console.log('CDN/HTTP 이미지로 처리:', trimmedUrl);
            return (
                <div className="w-full mb-6">
                    <img
                        src={trimmedUrl}
                        alt={title}
                        className="w-full h-auto rounded-lg object-contain max-h-[600px]"
                        crossOrigin="anonymous"
                        loading="lazy"
                        onError={(e) => {
                            console.error('CDN 이미지 로딩 실패:', trimmedUrl);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            // 에러 발생 시 placeholder 표시
                            const parent = target.parentElement;
                            if (parent) {
                                parent.innerHTML = `
                                    <div class="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                                        <svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                `;
                            }
                        }}
                        onLoad={() => {
                            console.log('CDN 이미지 로딩 성공:', trimmedUrl);
                        }}
                    />
                </div>
            );
        }

        // 로컬 이미지 (Next.js Image 컴포넌트 사용)
        console.log('로컬 이미지로 처리:', trimmedUrl);
        return (
            <div className="w-full mb-6">
                <Image
                    src={trimmedUrl}
                    alt={title}
                    width={1200}
                    height={600}
                    className="w-full h-auto rounded-lg object-contain max-h-[600px]"
                    onError={() => {
                        console.error('로컬 이미지 로딩 실패:', trimmedUrl);
                    }}
                    onLoad={() => {
                        console.log('로컬 이미지 로딩 성공');
                    }}
                />
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1A1A1A]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12">
                    <div className="bg-gray-800 rounded-2xl p-8 animate-pulse">
                        <div className="h-8 bg-gray-700 rounded mb-4"></div>
                        <div className="h-48 bg-gray-700 rounded mb-6"></div>
                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-[#1A1A1A]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12">
                    <div className="text-center">
                        <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">기사를 찾을 수 없습니다</h2>
                        <p className="text-gray-400 mb-6">요청하신 기사가 존재하지 않거나 삭제되었습니다.</p>
                        <Link
                            href="/news/collected"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-deep-electric-blue text-white rounded-lg hover:bg-deep-electric-blue/80 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            목록으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1A1A1A]">
            {/* Header */}
            <div className="bg-gradient-to-r from-deep-electric-blue/20 to-active-orange/20 border-b border-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
                    {/* 헤더는 비워두거나 제목만 표시 */}
                </div>
            </div>

            {/* Article Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12">
                {/* 목록으로 돌아가기 버튼 - 기사 위에 배치 */}
                <div className="mb-6">
                    <Link
                        href="/news/collected"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>목록으로 돌아가기</span>
                    </Link>
                </div>

                <article className="bg-gray-800 rounded-2xl p-8 md:p-12">
                    {/* Category and Source */}
                    <div className="flex items-center gap-3 mb-6">
                        <span
                            className={`px-3 py-1 rounded text-sm font-medium ${
                                CATEGORY_COLORS[article.category] || 'bg-gray-500'
                            } text-white`}
                        >
                            {CATEGORY_LABELS[article.category] || article.category}
                        </span>
                        <span className="text-sm text-gray-400">{article.source}</span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(article.publishedAt as string)}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        {article.title}
                    </h1>

                    {/* Image */}
                    {renderImage(article.title, article.imageUrl)}

                    {/* Content */}
                    <div
                        className="prose prose-invert prose-lg max-w-none mb-8
                            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_img]:object-contain
                            [&_p]:text-gray-300 [&_p]:leading-relaxed
                            [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white
                            [&_a]:text-deep-electric-blue [&_a]:hover:underline
                            [&_code]:bg-gray-700 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded
                            [&_pre]:bg-gray-700 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(article.content),
                        }}
                    />

                    {/* Keywords */}
                    {article.keywords && article.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {article.keywords.map((keyword, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                                >
                                    #{keyword}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Source Link */}
                    <div className="border-t border-gray-700 pt-6">
                        <a
                            href={article.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-deep-electric-blue text-white rounded-lg hover:bg-deep-electric-blue/80 transition-colors"
                        >
                            <ExternalLink className="w-5 h-5" />
                            원본 기사 보기
                        </a>
                    </div>
                </article>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-white mb-6">관련 기사</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((related) => (
                                <Link
                                    key={related._id}
                                    href={`/news/collected/${related._id}`}
                                    className="bg-gray-800 rounded-2xl overflow-hidden hover:bg-gray-750 transition-colors group"
                                >
                                    {related.imageUrl && (
                                        <div className="w-full h-32 overflow-hidden">
                                            {related.imageUrl.startsWith('data:') || related.imageUrl.startsWith('https://') ? (
                                                <img
                                                    src={related.imageUrl}
                                                    alt={related.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <Image
                                                    src={related.imageUrl}
                                                    alt={related.title}
                                                    width={400}
                                                    height={128}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            )}
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 group-hover:text-deep-electric-blue transition-colors">
                                            {related.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 line-clamp-2">
                                            {related.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

