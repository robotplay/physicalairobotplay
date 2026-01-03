'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Play, Clock, CheckCircle2, XCircle, AlertCircle, ExternalLink, Eye, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { CollectedNewsArticle, CollectionLog } from '@/types';

interface CollectionStatus {
    lastRun: string | null;
    nextRun: string;
    totalCollected: number;
    last24Hours: number;
}

export default function CollectedNewsTab() {
    const [articles, setArticles] = useState<CollectedNewsArticle[]>([]);
    const [status, setStatus] = useState<CollectionStatus | null>(null);
    const [isCollecting, setIsCollecting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const categories = [
        { value: 'all', label: '전체' },
        { value: 'education', label: '교육' },
        { value: 'technology', label: '기술' },
        { value: 'competition', label: '대회' },
        { value: 'general', label: '일반' },
    ];

    const loadArticles = async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '20',
                admin: 'true', // 관리자 모드: 모든 기사 조회 (삭제된 것 포함)
            });

            if (selectedCategory !== 'all') {
                params.append('category', selectedCategory);
            }

            // 캐시 무시하여 최신 데이터 가져오기
            const response = await fetch(`/api/collected-news?${params.toString()}`, {
                cache: 'no-store',
                credentials: 'include',
            });
            const result = await response.json();

            if (result.success) {
                setArticles(result.data.articles || []);
                setTotalPages(result.data.pagination.totalPages || 1);
                setTotal(result.data.pagination.total || 0);
            }
        } catch (error) {
            console.error('Failed to load articles:', error);
            toast.error('기사 목록을 불러오는데 실패했습니다.');
        }
    };

    const loadStatus = async () => {
        try {
            const response = await fetch('/api/news/collect/status');
            const result = await response.json();

            if (result.success) {
                setStatus(result.data);
            }
        } catch (error) {
            console.error('Failed to load status:', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await Promise.all([loadArticles(), loadStatus()]);
            setIsLoading(false);
        };
        loadData();
    }, [currentPage, selectedCategory]);

    const handleCollect = async () => {
        setIsCollecting(true);
        try {
            const response = await fetch('/api/news/collect', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(
                    `수집 완료: ${result.data.collected}개 수집, ${result.data.duplicates}개 중복, ${result.data.failed}개 실패`
                );
                await Promise.all([loadArticles(), loadStatus()]);
            } else {
                toast.error(result.error || '뉴스 수집에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to collect news:', error);
            toast.error('뉴스 수집 중 오류가 발생했습니다.');
        } finally {
            setIsCollecting(false);
        }
    };

    const handleToggleActive = async (articleId: string, isActive: boolean) => {
        try {
            const response = await fetch(`/api/collected-news/${articleId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: !isActive }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(isActive ? '기사를 비활성화했습니다.' : '기사를 활성화했습니다.');
                await loadArticles();
            } else {
                toast.error(result.error || '기사 상태 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to toggle article:', error);
            toast.error('기사 상태 변경 중 오류가 발생했습니다.');
        }
    };

    const handleDelete = async (articleId: string) => {
        if (!confirm('이 기사를 삭제하시겠습니까?')) {
            return;
        }

        try {
            // Optimistic Update: UI에서 즉시 제거
            const articleToDelete = articles.find(a => a._id === articleId);
            const updatedArticles = articles.filter(a => a._id !== articleId);
            setArticles(updatedArticles);
            setTotal(prev => Math.max(0, prev - 1));

            const response = await fetch(`/api/collected-news/${articleId}`, {
                method: 'DELETE',
                credentials: 'include',
                cache: 'no-store',
            });

            const result = await response.json();

            if (result.success) {
                toast.success('기사를 삭제했습니다.');
                // 삭제 성공 후 목록 새로고침 (캐시 무시)
                await loadArticles();
            } else {
                // 실패 시 롤백
                if (articleToDelete) {
                    setArticles(articles);
                    setTotal(prev => prev + 1);
                }
                toast.error(result.error || '기사 삭제에 실패했습니다.');
                // 실패해도 목록 새로고침하여 최신 상태 유지
                await loadArticles();
            }
        } catch (error) {
            console.error('Failed to delete article:', error);
            // 에러 발생 시에도 롤백
            setArticles(articles);
            toast.error('기사 삭제 중 오류가 발생했습니다.');
            // 에러 발생 시에도 목록 새로고침
            await loadArticles();
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '없음';
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">수집 상태</h3>
                    <button
                        onClick={handleCollect}
                        disabled={isCollecting}
                        className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue text-white rounded-lg hover:bg-deep-electric-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isCollecting ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                수집 중...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4" />
                                수동 수집
                            </>
                        )}
                    </button>
                </div>

                {status && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">마지막 수집</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatDate(status.lastRun)}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">다음 수집</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {formatDate(status.nextRun)}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">전체 수집</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {status.totalCollected.toLocaleString()}개
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-blue-500" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">최근 24시간</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {status.last24Hours.toLocaleString()}개
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">카테고리:</span>
                    <div className="flex gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => {
                                    setSelectedCategory(category.value);
                                    setCurrentPage(1);
                                }}
                                className={`px-3 py-1 rounded text-sm transition-colors ${
                                    selectedCategory === category.value
                                        ? 'bg-deep-electric-blue text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                    <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                        총 {total.toLocaleString()}개
                    </div>
                </div>
            </div>

            {/* Articles List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
                </div>
            ) : articles.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <p className="text-gray-600 dark:text-gray-400">수집된 기사가 없습니다.</p>
                </div>
            ) : (
                <>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            제목
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            출처
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            카테고리
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            발행일
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            조회수
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            상태
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            작업
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {articles.map((article) => (
                                        <tr key={article._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {article.imageUrl && (
                                                        <img
                                                            src={article.imageUrl}
                                                            alt={article.title}
                                                            className="w-12 h-12 object-cover rounded"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                                            {article.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                            {article.excerpt}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {article.source}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                    {categories.find((c) => c.value === article.category)?.label ||
                                                        article.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(article.publishedAt as string)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                {article.viewCount.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                {article.isActive ? (
                                                    <span className="px-2 py-1 text-xs rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                                        활성
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                        비활성
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={`/news/collected/${article._id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                                        title="보기"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                    <a
                                                        href={article.sourceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                                                        title="원본 보기"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => handleToggleActive(article._id!, article.isActive)}
                                                        className={`p-1 rounded ${
                                                            article.isActive
                                                                ? 'text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                                                : 'text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                        }`}
                                                        title={article.isActive ? '비활성화' : '활성화'}
                                                    >
                                                        {article.isActive ? (
                                                            <XCircle className="w-4 h-4" />
                                                        ) : (
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(article._id!)}
                                                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                        title="삭제"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                다음
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

