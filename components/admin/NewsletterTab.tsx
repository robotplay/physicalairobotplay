'use client';

import { useState, useEffect } from 'react';
import { Mail, Plus, Edit2, Trash2, X, Save, Calendar, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import type { MonthlyNewsletter } from '@/types';

export default function NewsletterTab() {
    const [newsletters, setNewsletters] = useState<MonthlyNewsletter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNewsletter, setEditingNewsletter] = useState<MonthlyNewsletter | null>(null);

    const [formData, setFormData] = useState<{
        month: number;
        year: number;
        title: string;
        content: string;
        highlights: string[];
        studentSpotlights: string[];
        competitionResults: string[];
        photos: string[];
    }>({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        title: '',
        content: '',
        highlights: [],
        studentSpotlights: [],
        competitionResults: [],
        photos: [],
    });

    useEffect(() => {
        loadNewsletters();
    }, []);

    const loadNewsletters = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/newsletters', {
                credentials: 'include',
            });
            const result = await response.json();

            if (result.success) {
                setNewsletters(result.data.newsletters || []);
            }
        } catch (error) {
            console.error('뉴스레터 목록 로딩 실패:', error);
            toast.error('뉴스레터 목록을 불러오는데 실패했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (newsletter?: MonthlyNewsletter) => {
        if (newsletter) {
            setEditingNewsletter(newsletter);
            setFormData({
                month: newsletter.month,
                year: newsletter.year,
                title: newsletter.title,
                content: newsletter.content,
                highlights: newsletter.highlights,
                studentSpotlights: newsletter.studentSpotlights,
                competitionResults: newsletter.competitionResults,
                photos: newsletter.photos,
            });
        } else {
            setEditingNewsletter(null);
            setFormData({
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                title: '',
                content: '',
                highlights: [],
                studentSpotlights: [],
                competitionResults: [],
                photos: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingNewsletter(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            toast.error('제목과 내용을 입력해주세요');
            return;
        }

        try {
            const url = editingNewsletter
                ? `/api/newsletters/${editingNewsletter._id}`
                : '/api/newsletters';

            const method = editingNewsletter ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || (editingNewsletter ? '뉴스레터가 수정되었습니다' : '뉴스레터가 등록되었습니다'));
                handleCloseModal();
                loadNewsletters();
            } else {
                toast.error(result.error || '뉴스레터 저장 실패');
            }
        } catch (error) {
            console.error('뉴스레터 저장 실패:', error);
            toast.error('뉴스레터 저장 중 오류가 발생했습니다');
        }
    };

    const handleDelete = async (newsletterId: string) => {
        if (!confirm('정말 이 뉴스레터를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/newsletters/${newsletterId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || '뉴스레터가 삭제되었습니다');
                loadNewsletters();
            } else {
                toast.error(result.error || '뉴스레터 삭제 실패');
            }
        } catch (error) {
            console.error('뉴스레터 삭제 실패:', error);
            toast.error('뉴스레터 삭제 중 오류가 발생했습니다');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">뉴스레터 관리</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        월간 뉴스레터 아카이브 관리
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    새 뉴스레터 등록
                </button>
            </div>

            {/* 뉴스레터 목록 */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
                </div>
            ) : newsletters.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                    <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        등록된 뉴스레터가 없습니다
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        월간 뉴스레터를 추가해보세요
                    </p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        뉴스레터 등록하기
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsletters.map((newsletter) => (
                        <div
                            key={newsletter._id}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {newsletter.year}년 {newsletter.month}월
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                {newsletter.title}
                            </h3>

                            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-4">
                                <span>하이라이트: {newsletter.highlights.length}</span>
                                <span>사진: {newsletter.photos.length}</span>
                            </div>

                            {newsletter.sentAt && (
                                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mb-4">
                                    <Send className="w-3 h-3" />
                                    <span>발송됨: {new Date(newsletter.sentAt).toLocaleDateString('ko-KR')}</span>
                                </div>
                            )}

                            {/* 액션 버튼 */}
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => handleOpenModal(newsletter)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDelete(newsletter._id!)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 뉴스레터 등록/수정 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingNewsletter ? '뉴스레터 수정' : '새 뉴스레터 등록'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* 년월 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        년도 *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        월 *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="12"
                                        value={formData.month}
                                        onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* 제목 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    제목 *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            {/* 내용 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    내용 (HTML) *
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={8}
                                    required
                                />
                            </div>

                            {/* 하이라이트 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    주요 하이라이트 (한 줄에 하나씩)
                                </label>
                                <textarea
                                    value={formData.highlights.join('\n')}
                                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value.split('\n').filter(Boolean) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={3}
                                    placeholder="전국 로봇 대회 금상 수상&#10;신규 강좌 개설"
                                />
                            </div>

                            {/* 학생 스포트라이트 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    학생 스포트라이트 (학생 ID, 한 줄에 하나씩)
                                </label>
                                <textarea
                                    value={formData.studentSpotlights.join('\n')}
                                    onChange={(e) => setFormData({ ...formData, studentSpotlights: e.target.value.split('\n').filter(Boolean) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={2}
                                />
                            </div>

                            {/* 대회 결과 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    대회 결과 (한 줄에 하나씩)
                                </label>
                                <textarea
                                    value={formData.competitionResults.join('\n')}
                                    onChange={(e) => setFormData({ ...formData, competitionResults: e.target.value.split('\n').filter(Boolean) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={2}
                                />
                            </div>

                            {/* 사진 URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    사진 URL (한 줄에 하나씩)
                                </label>
                                <textarea
                                    value={formData.photos.join('\n')}
                                    onChange={(e) => setFormData({ ...formData, photos: e.target.value.split('\n').filter(Boolean) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={3}
                                    placeholder="https://example.com/photo1.jpg"
                                />
                            </div>

                            {/* 버튼 */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingNewsletter ? '수정 완료' : '등록하기'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

