'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, Image, Mail, Plus, X, Save, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';

interface FAQ {
    _id: string;
    faqId: string;
    category: 'general' | 'enrollment' | 'curriculum' | 'competition' | 'payment';
    question: string;
    answer: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Gallery {
    _id: string;
    galleryId: string;
    courseId: string;
    classDate: string;
    title: string;
    description: string;
    images: string[];
    videos: string[];
    tags: string[];
    visibility: 'public' | 'parents-only' | 'private';
    createdAt: string;
}

interface Newsletter {
    _id: string;
    newsletterId: string;
    month: number;
    year: number;
    title: string;
    content: string;
    highlights: string[];
    studentSpotlights: string[];
    competitionResults: string[];
    photos: string[];
    sentAt: string;
    createdAt: string;
}

type SubTabType = 'faq' | 'gallery' | 'newsletter';

export default function ParentCommunicationTab() {
    const [activeSubTab, setActiveSubTab] = useState<SubTabType>('faq');
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [isCreatingFAQ, setIsCreatingFAQ] = useState(false);
    const [isCreatingGallery, setIsCreatingGallery] = useState(false);
    const [isCreatingNewsletter, setIsCreatingNewsletter] = useState(false);
    const [editingFAQId, setEditingFAQId] = useState<string | null>(null);
    const [editingNewsletterId, setEditingNewsletterId] = useState<string | null>(null);
    const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);

    // FAQ 폼 데이터
    const [faqForm, setFaqForm] = useState({
        category: 'general' as FAQ['category'],
        question: '',
        answer: '',
        order: 0,
        isActive: true,
    });

    // Gallery 폼 데이터
    const [galleryForm, setGalleryForm] = useState({
        courseId: '',
        classDate: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        images: [] as string[],
        videos: [] as string[],
        tags: [] as string[],
        visibility: 'public' as Gallery['visibility'],
    });

    // Newsletter 폼 데이터
    const [newsletterForm, setNewsletterForm] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        title: '',
        content: '',
        highlights: [] as string[],
        studentSpotlights: [] as string[],
        competitionResults: [] as string[],
        photos: [] as string[],
    });

    useEffect(() => {
        loadFAQs();
        loadGalleries();
        loadNewsletters();
    }, []);

    const loadFAQs = async () => {
        try {
            const response = await fetch('/api/faq');
            const result = await response.json();
            if (result.success) {
                setFaqs(result.data.faqs || []);
            }
        } catch (error) {
            console.error('Failed to load FAQs:', error);
        }
    };

    const loadGalleries = async () => {
        try {
            const response = await fetch('/api/gallery');
            const result = await response.json();
            if (result.success) {
                setGalleries(result.data.galleries || []);
            }
        } catch (error) {
            console.error('Failed to load galleries:', error);
        }
    };

    const loadNewsletters = async () => {
        try {
            const response = await fetch('/api/newsletters');
            const result = await response.json();
            if (result.success) {
                setNewsletters(result.data.newsletters || []);
            }
        } catch (error) {
            console.error('Failed to load newsletters:', error);
        }
    };

    // FAQ 핸들러
    const handleCreateFAQ = () => {
        setIsCreatingFAQ(true);
        setFaqForm({
            category: 'general',
            question: '',
            answer: '',
            order: 0,
            isActive: true,
        });
        setEditingFAQId(null);
    };

    const handleEditFAQ = (faq: FAQ) => {
        setEditingFAQId(faq._id);
        setFaqForm({
            category: faq.category,
            question: faq.question,
            answer: faq.answer,
            order: faq.order,
            isActive: faq.isActive,
        });
        setIsCreatingFAQ(false);
    };

    const handleSubmitFAQ = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!faqForm.question || !faqForm.answer) {
            toast.error('질문과 답변을 입력해주세요.');
            return;
        }

        const loadingToast = toast.loading(isCreatingFAQ ? 'FAQ 추가 중...' : 'FAQ 수정 중...');

        try {
            const url = isCreatingFAQ ? '/api/faq' : `/api/faq/${editingFAQId}`;
            const method = isCreatingFAQ ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(faqForm),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || '요청 실패');
            }

            toast.success(isCreatingFAQ ? 'FAQ가 추가되었습니다.' : 'FAQ가 수정되었습니다.', { id: loadingToast });
            setIsCreatingFAQ(false);
            setEditingFAQId(null);
            setFaqForm({
                category: 'general',
                question: '',
                answer: '',
                order: 0,
                isActive: true,
            });
            await loadFAQs();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.', { id: loadingToast });
        }
    };

    const handleDeleteFAQ = async (id: string) => {
        if (!confirm('정말 이 FAQ를 삭제하시겠습니까?')) return;

        const loadingToast = toast.loading('FAQ 삭제 중...');
        try {
            const response = await fetch(`/api/faq/${id}`, { method: 'DELETE' });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || '삭제 실패');
            }

            toast.success('FAQ가 삭제되었습니다.', { id: loadingToast });
            await loadFAQs();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.', { id: loadingToast });
        }
    };

    // Gallery 핸들러
    const handleCreateGallery = () => {
        setIsCreatingGallery(true);
        setGalleryForm({
            courseId: '',
            classDate: new Date().toISOString().split('T')[0],
            title: '',
            description: '',
            images: [],
            videos: [],
            tags: [],
            visibility: 'public',
        });
    };

    const handleSubmitGallery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!galleryForm.courseId || !galleryForm.title) {
            toast.error('과목과 제목을 입력해주세요.');
            return;
        }

        const loadingToast = toast.loading('갤러리 항목 추가 중...');
        try {
            const response = await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(galleryForm),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || '추가 실패');
            }

            toast.success('갤러리 항목이 추가되었습니다.', { id: loadingToast });
            setIsCreatingGallery(false);
            setGalleryForm({
                courseId: '',
                classDate: new Date().toISOString().split('T')[0],
                title: '',
                description: '',
                images: [],
                videos: [],
                tags: [],
                visibility: 'public',
            });
            await loadGalleries();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.', { id: loadingToast });
        }
    };

    const handleDeleteGallery = async (id: string) => {
        if (!confirm('정말 이 갤러리 항목을 삭제하시겠습니까?')) return;

        const loadingToast = toast.loading('갤러리 항목 삭제 중...');
        try {
            const response = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || '삭제 실패');
            }

            toast.success('갤러리 항목이 삭제되었습니다.', { id: loadingToast });
            await loadGalleries();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.', { id: loadingToast });
        }
    };

    // Newsletter 핸들러
    const handleCreateNewsletter = () => {
        setIsCreatingNewsletter(true);
        const now = new Date();
        setNewsletterForm({
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            title: '',
            content: '',
            highlights: [],
            studentSpotlights: [],
            competitionResults: [],
            photos: [],
        });
    };

    const handleSubmitNewsletter = async (e: React.FormEvent) => {
        e.preventDefault();
        // HTML 태그를 제거한 순수 텍스트로 검증
        const textContent = newsletterForm.content.replace(/<[^>]*>/g, '').trim();
        if (!newsletterForm.title || !textContent) {
            toast.error('제목과 내용을 입력해주세요.');
            return;
        }

        const isEditing = !!editingNewsletterId;
        const loadingToast = toast.loading(isEditing ? '뉴스레터 수정 중...' : '뉴스레터 생성 중...');
        try {
            const url = isEditing ? `/api/newsletters/${editingNewsletterId}` : '/api/newsletters';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(newsletterForm),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || (isEditing ? '수정 실패' : '생성 실패'));
            }

            toast.success(isEditing ? '뉴스레터가 수정되었습니다.' : '뉴스레터가 생성되었습니다.', { id: loadingToast });
            setIsCreatingNewsletter(false);
            setEditingNewsletterId(null);
            const now = new Date();
            setNewsletterForm({
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                title: '',
                content: '',
                highlights: [],
                studentSpotlights: [],
                competitionResults: [],
                photos: [],
            });
            await loadNewsletters();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.', { id: loadingToast });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ko-KR');
    };

    return (
        <div className="space-y-6">
            {/* 서브 탭 */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveSubTab('faq')}
                    className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                        activeSubTab === 'faq'
                            ? 'border-deep-electric-blue text-deep-electric-blue dark:text-sky-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        FAQ ({faqs.length})
                    </div>
                </button>
                <button
                    onClick={() => setActiveSubTab('gallery')}
                    className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                        activeSubTab === 'gallery'
                            ? 'border-deep-electric-blue text-deep-electric-blue dark:text-sky-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        갤러리 ({galleries.length})
                    </div>
                </button>
                <button
                    onClick={() => setActiveSubTab('newsletter')}
                    className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                        activeSubTab === 'newsletter'
                            ? 'border-deep-electric-blue text-deep-electric-blue dark:text-sky-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        뉴스레터 ({newsletters.length})
                    </div>
                </button>
            </div>

            {/* FAQ 탭 */}
            {activeSubTab === 'faq' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">FAQ 관리</h3>
                        <button
                            onClick={handleCreateFAQ}
                            className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white rounded-lg transition-all font-semibold"
                        >
                            <Plus className="w-4 h-4" />
                            FAQ 추가
                        </button>
                    </div>

                    {(isCreatingFAQ || editingFAQId) && (
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-deep-electric-blue">
                            <form onSubmit={handleSubmitFAQ} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            카테고리
                                        </label>
                                        <select
                                            value={faqForm.category}
                                            onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value as FAQ['category'] })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        >
                                            <option value="general">일반</option>
                                            <option value="enrollment">등록</option>
                                            <option value="curriculum">커리큘럼</option>
                                            <option value="competition">대회</option>
                                            <option value="payment">결제</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            순서
                                        </label>
                                        <input
                                            type="number"
                                            value={faqForm.order}
                                            onChange={(e) => setFaqForm({ ...faqForm, order: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            질문 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={faqForm.question}
                                            onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            답변 <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={faqForm.answer}
                                            onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={faqForm.isActive}
                                                onChange={(e) => setFaqForm({ ...faqForm, isActive: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">활성화</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCreatingFAQ(false);
                                            setEditingFAQId(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white rounded-lg transition-all font-semibold"
                                    >
                                        <Save className="w-4 h-4" />
                                        저장
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-3">
                        {faqs.map((faq) => (
                            <div
                                key={faq._id}
                                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 bg-deep-electric-blue/10 text-deep-electric-blue rounded text-xs font-semibold">
                                                {faq.category}
                                            </span>
                                            {!faq.isActive && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">비활성</span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditFAQ(faq)}
                                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFAQ(faq._id)}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Gallery 탭 */}
            {activeSubTab === 'gallery' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">수업 갤러리</h3>
                        <button
                            onClick={handleCreateGallery}
                            className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white rounded-lg transition-all font-semibold"
                        >
                            <Plus className="w-4 h-4" />
                            갤러리 추가
                        </button>
                    </div>

                    {isCreatingGallery && (
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-deep-electric-blue">
                            <form onSubmit={handleSubmitGallery} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            과목 ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={galleryForm.courseId}
                                            onChange={(e) => setGalleryForm({ ...galleryForm, courseId: e.target.value })}
                                            required
                                            placeholder="course-id"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            수업일 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={galleryForm.classDate}
                                            onChange={(e) => setGalleryForm({ ...galleryForm, classDate: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            제목 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={galleryForm.title}
                                            onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            설명
                                        </label>
                                        <textarea
                                            value={galleryForm.description}
                                            onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            공개 범위
                                        </label>
                                        <select
                                            value={galleryForm.visibility}
                                            onChange={(e) => setGalleryForm({ ...galleryForm, visibility: e.target.value as Gallery['visibility'] })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        >
                                            <option value="public">공개</option>
                                            <option value="parents-only">학부모만</option>
                                            <option value="private">비공개</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreatingGallery(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white rounded-lg transition-all font-semibold"
                                    >
                                        <Save className="w-4 h-4" />
                                        저장
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {galleries.map((gallery) => (
                            <div
                                key={gallery._id}
                                className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{gallery.title}</h4>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                            {formatDate(gallery.classDate)}
                                        </p>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                                            {gallery.visibility}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteGallery(gallery._id)}
                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                                {gallery.images.length > 0 && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        이미지 {gallery.images.length}개
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Newsletter 탭 */}
            {activeSubTab === 'newsletter' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">월간 뉴스레터</h3>
                        <button
                            onClick={handleCreateNewsletter}
                            className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white rounded-lg transition-all font-semibold"
                        >
                            <Plus className="w-4 h-4" />
                            뉴스레터 생성
                        </button>
                    </div>

                    {isCreatingNewsletter && (
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-deep-electric-blue">
                            <form onSubmit={handleSubmitNewsletter} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            연도
                                        </label>
                                        <input
                                            type="number"
                                            value={newsletterForm.year}
                                            onChange={(e) => setNewsletterForm({ ...newsletterForm, year: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            월
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={newsletterForm.month}
                                            onChange={(e) => setNewsletterForm({ ...newsletterForm, month: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            제목 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={newsletterForm.title}
                                            onChange={(e) => setNewsletterForm({ ...newsletterForm, title: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            내용 <span className="text-red-500">*</span> (리치 텍스트 에디터)
                                        </label>
                                        <RichTextEditor
                                            content={newsletterForm.content}
                                            onChange={(htmlContent) => {
                                                setNewsletterForm({ ...newsletterForm, content: htmlContent });
                                            }}
                                            placeholder="뉴스레터 내용을 입력하세요. 여러 이미지를 삽입할 수 있습니다."
                                            onImageUpload={async (file: File) => {
                                                // 이미지 업로드 API 호출 (뉴스레터용)
                                                const uploadFormData = new FormData();
                                                uploadFormData.append('file', file);

                                                const response = await fetch('/api/news/upload', {
                                                    method: 'POST',
                                                    body: uploadFormData,
                                                });

                                                if (!response.ok) {
                                                    throw new Error('이미지 업로드 실패');
                                                }

                                                const result = await response.json();
                                                return result.url || result.data?.url || '';
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreatingNewsletter(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white rounded-lg transition-all font-semibold"
                                    >
                                        <Save className="w-4 h-4" />
                                        생성
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4">
                        {newsletters.map((newsletter) => (
                            <div
                                key={newsletter._id}
                                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                                            {newsletter.year}년 {newsletter.month}월 - {newsletter.title}
                                        </h4>
                                        <div 
                                            className="text-sm text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none"
                                            style={{ 
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                            dangerouslySetInnerHTML={{ __html: newsletter.content }}
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                            발송일: {formatDate(newsletter.sentAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

