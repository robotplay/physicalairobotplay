'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, X, Save, ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import type { FAQ } from '@/types';

const categories = [
    { value: 'general', label: '일반' },
    { value: 'enrollment', label: '등록' },
    { value: 'curriculum', label: '커리큘럼' },
    { value: 'competition', label: '대회' },
    { value: 'payment', label: '결제' },
];

export default function FAQTab() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

    const [formData, setFormData] = useState<{
        category: string;
        question: string;
        answer: string;
        order: number;
        isActive: boolean;
    }>({
        category: 'general',
        question: '',
        answer: '',
        order: 1,
        isActive: true,
    });

    useEffect(() => {
        loadFaqs();
    }, []);

    const loadFaqs = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/faq', {
                credentials: 'include',
            });
            const result = await response.json();

            if (result.success) {
                setFaqs(result.data.faqs || []);
            }
        } catch (error) {
            console.error('FAQ 목록 로딩 실패:', error);
            toast.error('FAQ 목록을 불러오는데 실패했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (faq?: FAQ) => {
        if (faq) {
            setEditingFaq(faq);
            setFormData({
                category: faq.category,
                question: faq.question,
                answer: faq.answer,
                order: faq.order,
                isActive: faq.isActive,
            });
        } else {
            setEditingFaq(null);
            const maxOrder = faqs.length > 0 ? Math.max(...faqs.map(f => f.order)) : 0;
            setFormData({
                category: 'general',
                question: '',
                answer: '',
                order: maxOrder + 1,
                isActive: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.question || !formData.answer) {
            toast.error('질문과 답변을 입력해주세요');
            return;
        }

        try {
            const url = editingFaq
                ? `/api/faq/${editingFaq._id}`
                : '/api/faq';

            const method = editingFaq ? 'PUT' : 'POST';

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
                toast.success(result.message || (editingFaq ? 'FAQ가 수정되었습니다' : 'FAQ가 등록되었습니다'));
                handleCloseModal();
                loadFaqs();
            } else {
                toast.error(result.error || 'FAQ 저장 실패');
            }
        } catch (error) {
            console.error('FAQ 저장 실패:', error);
            toast.error('FAQ 저장 중 오류가 발생했습니다');
        }
    };

    const handleDelete = async (faqId: string) => {
        if (!confirm('정말 이 FAQ를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/faq/${faqId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || 'FAQ가 삭제되었습니다');
                loadFaqs();
            } else {
                toast.error(result.error || 'FAQ 삭제 실패');
            }
        } catch (error) {
            console.error('FAQ 삭제 실패:', error);
            toast.error('FAQ 삭제 중 오류가 발생했습니다');
        }
    };

    const handleReorder = async (faqId: string, direction: 'up' | 'down') => {
        const currentIndex = faqs.findIndex(f => f._id === faqId);
        if (currentIndex === -1) return;

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= faqs.length) return;

        const currentFaq = faqs[currentIndex];
        const targetFaq = faqs[targetIndex];

        try {
            // 순서 교환
            await fetch(`/api/faq/${currentFaq._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ order: targetFaq.order }),
            });

            await fetch(`/api/faq/${targetFaq._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ order: currentFaq.order }),
            });

            loadFaqs();
        } catch (error) {
            console.error('순서 변경 실패:', error);
            toast.error('순서 변경 중 오류가 발생했습니다');
        }
    };

    const getCategoryLabel = (category: string) => {
        const cat = categories.find(c => c.value === category);
        return cat?.label || category;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">FAQ 관리</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        자주 묻는 질문 관리
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    새 FAQ 등록
                </button>
            </div>

            {/* FAQ 목록 */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
                </div>
            ) : faqs.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                    <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        등록된 FAQ가 없습니다
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        자주 묻는 질문을 추가해보세요
                    </p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        FAQ 등록하기
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={faq._id}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                        >
                            <div className="flex items-start gap-4">
                                {/* 순서 조절 */}
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => handleReorder(faq._id!, 'up')}
                                        disabled={index === 0}
                                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleReorder(faq._id!, 'down')}
                                        disabled={index === faqs.length - 1}
                                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* 내용 */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                                            {getCategoryLabel(faq.category)}
                                        </span>
                                        {!faq.isActive && (
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                비활성
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-500">
                                            #{faq.order}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                        {faq.answer}
                                    </p>
                                </div>

                                {/* 액션 버튼 */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleOpenModal(faq)}
                                        className="p-2 text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq._id!)}
                                        className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FAQ 등록/수정 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingFaq ? 'FAQ 수정' : '새 FAQ 등록'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* 카테고리 및 순서 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        카테고리 *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        순서
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        min="1"
                                    />
                                </div>
                            </div>

                            {/* 질문 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    질문 *
                                </label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            {/* 답변 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    답변 *
                                </label>
                                <textarea
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={6}
                                    required
                                />
                            </div>

                            {/* 활성화 */}
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-emerald-600 rounded"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">활성화</span>
                                </label>
                            </div>

                            {/* 버튼 */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingFaq ? '수정 완료' : '등록하기'}
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

