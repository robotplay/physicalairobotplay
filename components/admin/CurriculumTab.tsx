'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Calendar, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Curriculum, CurriculumWeek } from '@/types';

interface Course {
    _id: string;
    title: string;
}

export default function CurriculumTab() {
    const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null);

    const [formData, setFormData] = useState<{
        courseId: string;
        month: number;
        year: number;
        weeks: CurriculumWeek[];
    }>({
        courseId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        weeks: [
            { week: 1, title: '', description: '', materials: [], videos: [], assignments: [] },
        ],
    });

    useEffect(() => {
        loadCourses();
        loadCurriculums();
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

    const loadCurriculums = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/curriculum', {
                credentials: 'include',
            });
            const result = await response.json();

            if (result.success) {
                setCurriculums(result.data.curriculums || []);
            }
        } catch (error) {
            console.error('커리큘럼 목록 로딩 실패:', error);
            toast.error('커리큘럼 목록을 불러오는데 실패했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (curriculum?: Curriculum) => {
        if (curriculum) {
            setEditingCurriculum(curriculum);
            setFormData({
                courseId: curriculum.courseId,
                month: curriculum.month,
                year: curriculum.year,
                weeks: curriculum.weeks,
            });
        } else {
            setEditingCurriculum(null);
            setFormData({
                courseId: '',
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear(),
                weeks: [
                    { week: 1, title: '', description: '', materials: [], videos: [], assignments: [] },
                ],
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCurriculum(null);
    };

    const handleAddWeek = () => {
        const newWeek: CurriculumWeek = {
            week: formData.weeks.length + 1,
            title: '',
            description: '',
            materials: [],
            videos: [],
            assignments: [],
        };
        setFormData({ ...formData, weeks: [...formData.weeks, newWeek] });
    };

    const handleRemoveWeek = (index: number) => {
        const newWeeks = formData.weeks.filter((_, i) => i !== index);
        // 주차 번호 재정렬
        const reorderedWeeks = newWeeks.map((week, i) => ({ ...week, week: i + 1 }));
        setFormData({ ...formData, weeks: reorderedWeeks });
    };

    const handleWeekChange = (index: number, field: keyof CurriculumWeek, value: string | string[]) => {
        const newWeeks = [...formData.weeks];
        newWeeks[index] = { ...newWeeks[index], [field]: value };
        setFormData({ ...formData, weeks: newWeeks });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.courseId) {
            toast.error('과목을 선택해주세요');
            return;
        }

        try {
            const url = editingCurriculum
                ? `/api/curriculum/${editingCurriculum._id}`
                : '/api/curriculum';

            const method = editingCurriculum ? 'PUT' : 'POST';

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
                toast.success(editingCurriculum ? '커리큘럼이 수정되었습니다' : '커리큘럼이 등록되었습니다');
                handleCloseModal();
                loadCurriculums();
            } else {
                toast.error(result.error || '커리큘럼 저장 실패');
            }
        } catch (error) {
            console.error('커리큘럼 저장 실패:', error);
            toast.error('커리큘럼 저장 중 오류가 발생했습니다');
        }
    };

    const handleDelete = async (curriculumId: string) => {
        if (!confirm('정말 이 커리큘럼을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/curriculum/${curriculumId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await response.json();

            if (result.success) {
                toast.success('커리큘럼이 삭제되었습니다');
                loadCurriculums();
            } else {
                toast.error(result.error || '커리큘럼 삭제 실패');
            }
        } catch (error) {
            console.error('커리큘럼 삭제 실패:', error);
            toast.error('커리큘럼 삭제 중 오류가 발생했습니다');
        }
    };

    const getCourseName = (courseId: string) => {
        const course = courses.find(c => c._id === courseId);
        return course?.title || courseId;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">커리큘럼 관리</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        월별 주차별 수업 계획 관리
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    새 커리큘럼 등록
                </button>
            </div>

            {/* 커리큘럼 목록 */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
                </div>
            ) : curriculums.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        등록된 커리큘럼이 없습니다
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        새로운 커리큘럼을 등록해보세요
                    </p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        커리큘럼 등록하기
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {curriculums.map((curriculum) => (
                        <div
                            key={curriculum._id}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-indigo-600" />
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {getCourseName(curriculum.courseId)}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {curriculum.year}년 {curriculum.month}월
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleOpenModal(curriculum)}
                                        className="p-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(curriculum._id!)}
                                        className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* 주차별 커리큘럼 */}
                            <div className="space-y-3">
                                {curriculum.weeks.map((week) => (
                                    <div
                                        key={week.week}
                                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                    >
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {week.week}주차: {week.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {week.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 커리큘럼 등록/수정 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingCurriculum ? '커리큘럼 수정' : '새 커리큘럼 등록'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* 기본 정보 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        과목 *
                                    </label>
                                    <select
                                        value={formData.courseId}
                                        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                        disabled={!!editingCurriculum}
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
                                        년도 *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                        disabled={!!editingCurriculum}
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
                                        disabled={!!editingCurriculum}
                                    />
                                </div>
                            </div>

                            {/* 주차별 커리큘럼 */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        주차별 커리큘럼
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddWeek}
                                        className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                    >
                                        + 주차 추가
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {formData.weeks.map((week, index) => (
                                        <div
                                            key={index}
                                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3"
                                        >
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {week.week}주차
                                                </h4>
                                                {formData.weeks.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveWeek(index)}
                                                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="주차 제목"
                                                    value={week.title}
                                                    onChange={(e) => handleWeekChange(index, 'title', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <textarea
                                                    placeholder="주차 설명"
                                                    value={week.description}
                                                    onChange={(e) => handleWeekChange(index, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                    rows={2}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="자료 링크 (쉼표로 구분)"
                                                    value={week.materials.join(', ')}
                                                    onChange={(e) =>
                                                        handleWeekChange(
                                                            index,
                                                            'materials',
                                                            e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                />
                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="영상 링크 (쉼표로 구분)"
                                                    value={week.videos.join(', ')}
                                                    onChange={(e) =>
                                                        handleWeekChange(
                                                            index,
                                                            'videos',
                                                            e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                />
                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="과제 (쉼표로 구분)"
                                                    value={week.assignments.join(', ')}
                                                    onChange={(e) =>
                                                        handleWeekChange(
                                                            index,
                                                            'assignments',
                                                            e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                                                        )
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 버튼 */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingCurriculum ? '수정 완료' : '등록하기'}
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

