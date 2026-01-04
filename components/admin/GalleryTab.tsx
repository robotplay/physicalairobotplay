'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Edit2, Trash2, Calendar, X, Save, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ClassGallery } from '@/types';

interface Course {
    _id: string;
    title: string;
}

export default function GalleryTab() {
    const [galleries, setGalleries] = useState<ClassGallery[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGallery, setEditingGallery] = useState<ClassGallery | null>(null);

    const [formData, setFormData] = useState<{
        courseId: string;
        classDate: string;
        title: string;
        description: string;
        images: string[];
        videos: string[];
        tags: string[];
        visibility: 'public' | 'parents-only' | 'private';
    }>({
        courseId: '',
        classDate: new Date().toISOString().split('T')[0],
        title: '',
        description: '',
        images: [],
        videos: [],
        tags: [],
        visibility: 'public',
    });

    useEffect(() => {
        loadCourses();
        loadGalleries();
    }, []);

    const loadCourses = async () => {
        try {
            const response = await fetch('/api/online-courses', {
                credentials: 'include',
            });
            const result = await response.json();
            if (result.success) {
                setCourses(result.data || []);
            }
        } catch (error) {
            console.error('코스 목록 로딩 실패:', error);
        }
    };

    const loadGalleries = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/gallery', {
                credentials: 'include',
            });
            const result = await response.json();

            if (result.success) {
                setGalleries(result.data.galleries || []);
            }
        } catch (error) {
            console.error('갤러리 목록 로딩 실패:', error);
            toast.error('갤러리 목록을 불러오는데 실패했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (gallery?: ClassGallery) => {
        if (gallery) {
            setEditingGallery(gallery);
            setFormData({
                courseId: gallery.courseId,
                classDate: new Date(gallery.classDate).toISOString().split('T')[0],
                title: gallery.title,
                description: gallery.description,
                images: gallery.images,
                videos: gallery.videos,
                tags: gallery.tags,
                visibility: gallery.visibility,
            });
        } else {
            setEditingGallery(null);
            setFormData({
                courseId: '',
                classDate: new Date().toISOString().split('T')[0],
                title: '',
                description: '',
                images: [],
                videos: [],
                tags: [],
                visibility: 'public',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingGallery(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.courseId || !formData.title) {
            toast.error('필수 정보를 입력해주세요');
            return;
        }

        try {
            const url = editingGallery
                ? `/api/gallery/${editingGallery._id}`
                : '/api/gallery';

            const method = editingGallery ? 'PUT' : 'POST';

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
                toast.success(editingGallery ? '갤러리가 수정되었습니다' : '갤러리가 등록되었습니다');
                handleCloseModal();
                loadGalleries();
            } else {
                toast.error(result.error || '갤러리 저장 실패');
            }
        } catch (error) {
            console.error('갤러리 저장 실패:', error);
            toast.error('갤러리 저장 중 오류가 발생했습니다');
        }
    };

    const handleDelete = async (galleryId: string) => {
        if (!confirm('정말 이 갤러리를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/gallery/${galleryId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await response.json();

            if (result.success) {
                toast.success('갤러리가 삭제되었습니다');
                loadGalleries();
            } else {
                toast.error(result.error || '갤러리 삭제 실패');
            }
        } catch (error) {
            console.error('갤러리 삭제 실패:', error);
            toast.error('갤러리 삭제 중 오류가 발생했습니다');
        }
    };

    const getCourseName = (courseId: string) => {
        const course = courses.find(c => c._id === courseId);
        return course?.title || courseId;
    };

    const getVisibilityLabel = (visibility: string) => {
        const labels: Record<string, string> = {
            public: '전체 공개',
            'parents-only': '학부모만',
            private: '비공개',
        };
        return labels[visibility] || visibility;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">갤러리 관리</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        수업 사진 및 영상 관리
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    새 갤러리 등록
                </button>
            </div>

            {/* 갤러리 목록 */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
                </div>
            ) : galleries.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        등록된 갤러리가 없습니다
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        수업 사진과 영상을 업로드해보세요
                    </p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        갤러리 등록하기
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleries.map((gallery) => (
                        <div
                            key={gallery._id}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* 썸네일 */}
                            <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                {gallery.images.length > 0 ? (
                                    <img
                                        src={gallery.images[0]}
                                        alt={gallery.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="w-16 h-16 text-gray-400" />
                                )}
                            </div>

                            {/* 내용 */}
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300">
                                        {getVisibilityLabel(gallery.visibility)}
                                    </span>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-3 h-3 inline mr-1" />
                                        {new Date(gallery.classDate).toLocaleDateString('ko-KR')}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                    {gallery.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {getCourseName(gallery.courseId)}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <span className="flex items-center gap-1">
                                        <ImageIcon className="w-4 h-4" />
                                        {gallery.images.length}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Video className="w-4 h-4" />
                                        {gallery.videos.length}
                                    </span>
                                </div>

                                {/* 액션 버튼 */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleOpenModal(gallery)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(gallery._id!)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 갤러리 등록/수정 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingGallery ? '갤러리 수정' : '새 갤러리 등록'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* 과목 및 날짜 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        과목 *
                                    </label>
                                    <select
                                        value={formData.courseId}
                                        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="">선택하세요</option>
                                        {courses.map((course) => (
                                            <option key={course._id} value={course._id}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        수업일 *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.classDate}
                                        onChange={(e) => setFormData({ ...formData, classDate: e.target.value })}
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

                            {/* 설명 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    설명
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={3}
                                />
                            </div>

                            {/* 공개 설정 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    공개 설정
                                </label>
                                <select
                                    value={formData.visibility}
                                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'public' | 'parents-only' | 'private' })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="public">전체 공개</option>
                                    <option value="parents-only">학부모만</option>
                                    <option value="private">비공개</option>
                                </select>
                            </div>

                            {/* 이미지 URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    이미지 URL (한 줄에 하나씩)
                                </label>
                                <textarea
                                    value={formData.images.join('\n')}
                                    onChange={(e) => setFormData({ ...formData, images: e.target.value.split('\n').filter(Boolean) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={3}
                                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                />
                            </div>

                            {/* 영상 URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    영상 URL (한 줄에 하나씩)
                                </label>
                                <textarea
                                    value={formData.videos.join('\n')}
                                    onChange={(e) => setFormData({ ...formData, videos: e.target.value.split('\n').filter(Boolean) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={2}
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>

                            {/* 태그 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    태그 (쉼표로 구분)
                                </label>
                                <input
                                    type="text"
                                    value={formData.tags.join(', ')}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="로봇제작, 프로그래밍"
                                />
                            </div>

                            {/* 버튼 */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingGallery ? '수정 완료' : '등록하기'}
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

