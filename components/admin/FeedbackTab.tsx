'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Edit2, Trash2, X, Save, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import type { StudentFeedback } from '@/types';

interface Student {
    _id: string;
    name: string;
}

interface Course {
    _id: string;
    title: string;
}

export default function FeedbackTab() {
    const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState<StudentFeedback | null>(null);

    const [formData, setFormData] = useState<{
        studentId: string;
        teacherId: string;
        courseId: string;
        date: string;
        content: string;
        strengths: string[];
        improvements: string[];
        nextSteps: string;
    }>({
        studentId: '',
        teacherId: '',
        courseId: '',
        date: new Date().toISOString().split('T')[0],
        content: '',
        strengths: [],
        improvements: [],
        nextSteps: '',
    });

    useEffect(() => {
        loadStudents();
        loadCourses();
        loadFeedbacks();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await fetch('/api/students', {
                credentials: 'include',
            });
            const result = await response.json();
            if (result.success && result.data) {
                setStudents(result.data.students || []);
            }
        } catch (error) {
            console.error('학생 목록 로딩 실패:', error);
        }
    };

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

    const loadFeedbacks = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/student-feedback', {
                credentials: 'include',
            });
            const result = await response.json();

            if (result.success) {
                setFeedbacks(result.data.feedbacks || []);
            }
        } catch (error) {
            console.error('피드백 목록 로딩 실패:', error);
            toast.error('피드백 목록을 불러오는데 실패했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (feedback?: StudentFeedback) => {
        if (feedback) {
            setEditingFeedback(feedback);
            setFormData({
                studentId: feedback.studentId,
                teacherId: feedback.teacherId,
                courseId: feedback.courseId,
                date: new Date(feedback.date).toISOString().split('T')[0],
                content: feedback.content,
                strengths: feedback.strengths,
                improvements: feedback.improvements,
                nextSteps: feedback.nextSteps,
            });
        } else {
            setEditingFeedback(null);
            setFormData({
                studentId: '',
                teacherId: '',
                courseId: '',
                date: new Date().toISOString().split('T')[0],
                content: '',
                strengths: [],
                improvements: [],
                nextSteps: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingFeedback(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.studentId || !formData.courseId || !formData.content) {
            toast.error('필수 정보를 입력해주세요');
            return;
        }

        try {
            const url = editingFeedback
                ? `/api/student-feedback/${editingFeedback._id}`
                : '/api/student-feedback';

            const method = editingFeedback ? 'PUT' : 'POST';

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
                toast.success(result.message || (editingFeedback ? '피드백이 수정되었습니다' : '피드백이 등록되었습니다'));
                handleCloseModal();
                loadFeedbacks();
            } else {
                toast.error(result.error || '피드백 저장 실패');
            }
        } catch (error) {
            console.error('피드백 저장 실패:', error);
            toast.error('피드백 저장 중 오류가 발생했습니다');
        }
    };

    const handleDelete = async (feedbackId: string) => {
        if (!confirm('정말 이 피드백을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/student-feedback/${feedbackId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || '피드백이 삭제되었습니다');
                loadFeedbacks();
            } else {
                toast.error(result.error || '피드백 삭제 실패');
            }
        } catch (error) {
            console.error('피드백 삭제 실패:', error);
            toast.error('피드백 삭제 중 오류가 발생했습니다');
        }
    };

    const getStudentName = (studentId: string) => {
        const student = students.find(s => s._id === studentId);
        return student?.name || '알 수 없음';
    };

    const getCourseName = (courseId: string) => {
        const course = courses.find(c => c._id === courseId);
        return course?.title || '알 수 없음';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">피드백 관리</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        학생 개별 피드백 관리
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    새 피드백 등록
                </button>
            </div>

            {/* 피드백 목록 */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
                </div>
            ) : feedbacks.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        등록된 피드백이 없습니다
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        학생 피드백을 추가해보세요
                    </p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        피드백 등록하기
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {feedbacks.map((feedback) => (
                        <div
                            key={feedback._id}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <User className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {getStudentName(feedback.studentId)}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {getCourseName(feedback.courseId)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(feedback.date).toLocaleDateString('ko-KR')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(feedback)}
                                            className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(feedback._id!)}
                                            className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">피드백</p>
                                    <p className="text-gray-900 dark:text-white">{feedback.content}</p>
                                </div>

                                {feedback.strengths.length > 0 && (
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <p className="text-sm text-green-800 dark:text-green-300 font-medium mb-2">강점</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {feedback.strengths.map((strength, index) => (
                                                <li key={index} className="text-green-700 dark:text-green-400">{strength}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {feedback.improvements.length > 0 && (
                                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                        <p className="text-sm text-orange-800 dark:text-orange-300 font-medium mb-2">개선점</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {feedback.improvements.map((improvement, index) => (
                                                <li key={index} className="text-orange-700 dark:text-orange-400">{improvement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {feedback.nextSteps && (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">다음 단계</p>
                                        <p className="text-blue-700 dark:text-blue-400">{feedback.nextSteps}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 피드백 등록/수정 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingFeedback ? '피드백 수정' : '새 피드백 등록'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* 학생, 과목, 날짜 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        학생 *
                                    </label>
                                    <select
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="">선택하세요</option>
                                        {students.map((student) => (
                                            <option key={student._id} value={student._id}>
                                                {student.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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
                                        날짜 *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* 피드백 내용 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    피드백 내용 *
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={4}
                                    required
                                />
                            </div>

                            {/* 강점 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    강점 (한 줄에 하나씩)
                                </label>
                                <textarea
                                    value={formData.strengths.join('\n')}
                                    onChange={(e) => setFormData({ ...formData, strengths: e.target.value.split('\n').filter(Boolean) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={3}
                                    placeholder="협업 능력이 뛰어남&#10;창의적인 문제 해결"
                                />
                            </div>

                            {/* 개선점 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    개선점 (한 줄에 하나씩)
                                </label>
                                <textarea
                                    value={formData.improvements.join('\n')}
                                    onChange={(e) => setFormData({ ...formData, improvements: e.target.value.split('\n').filter(Boolean) })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={3}
                                    placeholder="집중력 향상 필요&#10;시간 관리 개선"
                                />
                            </div>

                            {/* 다음 단계 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    다음 단계
                                </label>
                                <textarea
                                    value={formData.nextSteps}
                                    onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={2}
                                    placeholder="다음 프로젝트에서 리더 역할 맡아보기"
                                />
                            </div>

                            {/* 버튼 */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingFeedback ? '수정 완료' : '등록하기'}
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

