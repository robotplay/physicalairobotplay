'use client';

import { useState } from 'react';
import { User, Mail, Phone, Edit, Trash2, Plus, X, Save, GraduationCap, BookOpen, Trophy, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface Student {
    _id: string;
    studentId: string;
    name: string;
    grade: string;
    class?: string; // 반 (예: "월요일 1반", "토요일 대회1반")
    level?: 'basic' | 'advanced' | 'competition'; // 교육수준: 기초, 심화, 대회
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    enrolledCourses: string[];
    attendance: {
        totalClasses: number;
        attendedClasses: number;
        rate: number;
    };
    projects: Array<{
        projectId: string;
        projectName: string;
        completionRate: number;
        status: 'in-progress' | 'completed';
        completedAt?: string;
    }>;
    competitions: Array<{
        competitionId: string;
        competitionName: string;
        year: number;
        month: number;
        result: 'participated' | 'award' | 'winner';
        award?: string;
        teamMembers?: string[];
    }>;
    learningNotes: string;
    portfolio: {
        images: string[];
        videos: string[];
        description: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface StudentsTabProps {
    students: Student[];
    onRefresh: () => void;
}

export default function StudentsTab({ students, onRefresh }: StudentsTabProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [gradeFilter, setGradeFilter] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        class: '',
        level: '' as 'basic' | 'advanced' | 'competition' | '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        learningNotes: '',
    });

    // 필터링된 학생 목록
    const filteredStudents = students.filter((student) => {
        const matchesSearch = 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.parentPhone.includes(searchTerm);
        const matchesGrade = !gradeFilter || student.grade === gradeFilter;
        return matchesSearch && matchesGrade;
    });

    const handleCreate = () => {
        setIsCreating(true);
        setFormData({
            name: '',
            grade: '',
            class: '',
            level: '',
            parentName: '',
            parentPhone: '',
            parentEmail: '',
            learningNotes: '',
        });
        setSelectedStudent(null);
        setEditingId(null);
    };

    const handleEdit = (student: Student) => {
        setEditingId(student._id);
        setFormData({
            name: student.name,
            grade: student.grade,
            class: student.class || '',
            level: student.level || '',
            parentName: student.parentName,
            parentPhone: student.parentPhone,
            parentEmail: student.parentEmail || '',
            learningNotes: student.learningNotes || '',
        });
        setSelectedStudent(null);
        setIsCreating(false);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setFormData({
            name: '',
            grade: '',
            class: '',
            level: '',
            parentName: '',
            parentPhone: '',
            parentEmail: '',
            learningNotes: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.grade || !formData.parentName || !formData.parentPhone) {
            toast.error('필수 항목을 입력해주세요.');
            return;
        }

        const loadingToast = toast.loading(isCreating ? '학생 등록 중...' : '학생 정보 수정 중...');

        try {
            if (isCreating) {
                const response = await fetch('/api/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || `서버 오류: ${response.status}`);
                }

                if (result.success) {
                    toast.success('학생이 등록되었습니다.', { id: loadingToast });
                    handleCancel();
                    await onRefresh();
                } else {
                    toast.error(result.error || '등록에 실패했습니다.', { id: loadingToast });
                }
            } else if (editingId) {
                const response = await fetch(`/api/students/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || `서버 오류: ${response.status}`);
                }

                if (result.success) {
                    toast.success('학생 정보가 수정되었습니다.', { id: loadingToast });
                    handleCancel();
                    await onRefresh();
                } else {
                    toast.error(result.error || '수정에 실패했습니다.', { id: loadingToast });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.', { id: loadingToast });
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`정말 ${name} 학생을 삭제하시겠습니까?`)) {
            return;
        }

        const loadingToast = toast.loading('학생 삭제 중...');

        try {
            const response = await fetch(`/api/students/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `서버 오류: ${response.status}`);
            }

            if (result.success) {
                toast.success('학생이 삭제되었습니다.', { id: loadingToast });
                if (selectedStudent?._id === id) {
                    setSelectedStudent(null);
                }
                await onRefresh();
            } else {
                toast.error(result.error || '삭제에 실패했습니다.', { id: loadingToast });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.', { id: loadingToast });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* 헤더 및 검색 */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        학생 관리 ({filteredStudents.length}명)
                    </h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* 검색 */}
                    <input
                        type="text"
                        placeholder="이름, 학부모명, 전화번호 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                    />
                    {/* 학년 필터 */}
                    <select
                        value={gradeFilter}
                        onChange={(e) => setGradeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                    >
                        <option value="">전체 학년</option>
                        <option value="초1">초1</option>
                        <option value="초2">초2</option>
                        <option value="초3">초3</option>
                        <option value="초4">초4</option>
                        <option value="초5">초5</option>
                        <option value="초6">초6</option>
                        <option value="중1">중1</option>
                        <option value="중2">중2</option>
                        <option value="중3">중3</option>
                        <option value="고1">고1</option>
                        <option value="고2">고2</option>
                        <option value="고3">고3</option>
                    </select>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white rounded-lg transition-all font-semibold"
                    >
                        <Plus className="w-4 h-4" />
                        학생 등록
                    </button>
                </div>
            </div>

            {/* 생성/수정 폼 */}
            {(isCreating || editingId) && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-deep-electric-blue">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {isCreating ? '새 학생 등록' : '학생 정보 수정'}
                        </h3>
                        <button
                            onClick={handleCancel}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    학생 이름 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    학년 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.grade}
                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                                >
                                    <option value="">선택하세요</option>
                                    <option value="초1">초1</option>
                                    <option value="초2">초2</option>
                                    <option value="초3">초3</option>
                                    <option value="초4">초4</option>
                                    <option value="초5">초5</option>
                                    <option value="초6">초6</option>
                                    <option value="중1">중1</option>
                                    <option value="중2">중2</option>
                                    <option value="중3">중3</option>
                                    <option value="고1">고1</option>
                                    <option value="고2">고2</option>
                                    <option value="고3">고3</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    반 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.class}
                                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                                >
                                    <option value="">선택하세요</option>
                                    <optgroup label="월요일">
                                        <option value="월요일 1반">월요일 1반</option>
                                        <option value="월요일 2반">월요일 2반</option>
                                        <option value="월요일 3반">월요일 3반</option>
                                    </optgroup>
                                    <optgroup label="화요일">
                                        <option value="화요일 1반">화요일 1반</option>
                                        <option value="화요일 2반">화요일 2반</option>
                                        <option value="화요일 3반">화요일 3반</option>
                                    </optgroup>
                                    <optgroup label="수요일">
                                        <option value="수요일 1반">수요일 1반</option>
                                        <option value="수요일 2반">수요일 2반</option>
                                        <option value="수요일 3반">수요일 3반</option>
                                    </optgroup>
                                    <optgroup label="목요일">
                                        <option value="목요일 1반">목요일 1반</option>
                                        <option value="목요일 2반">목요일 2반</option>
                                        <option value="목요일 3반">목요일 3반</option>
                                    </optgroup>
                                    <optgroup label="금요일">
                                        <option value="금요일 1반">금요일 1반</option>
                                        <option value="금요일 2반">금요일 2반</option>
                                        <option value="금요일 3반">금요일 3반</option>
                                    </optgroup>
                                    <optgroup label="토요일">
                                        <option value="토요일 대회1반">토요일 대회1반</option>
                                        <option value="토요일 대회2반">토요일 대회2반</option>
                                    </optgroup>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    교육수준 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value as 'basic' | 'advanced' | 'competition' | '' })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                                >
                                    <option value="">선택하세요</option>
                                    <option value="basic">기초</option>
                                    <option value="advanced">심화</option>
                                    <option value="competition">대회</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    학부모 이름 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.parentName}
                                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    학부모 연락처 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.parentPhone}
                                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                    required
                                    placeholder="010-1234-5678"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    학부모 이메일
                                </label>
                                <input
                                    type="email"
                                    value={formData.parentEmail}
                                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                                    placeholder="parent@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    학습 성향 메모
                                </label>
                                <textarea
                                    value={formData.learningNotes}
                                    onChange={(e) => setFormData({ ...formData, learningNotes: e.target.value })}
                                    rows={3}
                                    placeholder="학생의 학습 성향, 특이사항 등을 기록하세요..."
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-semibold"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white rounded-lg transition-all font-semibold"
                            >
                                <Save className="w-4 h-4" />
                                {isCreating ? '등록' : '수정'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 학생 목록 */}
            {filteredStudents.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {searchTerm || gradeFilter ? '검색 결과가 없습니다' : '등록된 학생이 없습니다'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        {searchTerm || gradeFilter ? '다른 검색어를 시도해보세요' : '새 학생을 등록해주세요'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.map((student) => (
                        <div
                            key={student._id}
                            className={`bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 ${
                                selectedStudent?._id === student._id
                                    ? 'border-deep-electric-blue'
                                    : 'border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-electric-blue to-active-orange flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                            {student.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {student.grade}
                                        </p>
                                        {student.class && (
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                {student.class}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(student)}
                                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student._id, student.name)}
                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <Phone className="w-4 h-4 text-deep-electric-blue" />
                                    <span>{student.parentPhone}</span>
                                </div>
                                {student.parentEmail && (
                                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <Mail className="w-4 h-4 text-deep-electric-blue" />
                                        <span className="truncate">{student.parentEmail}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <User className="w-4 h-4 text-deep-electric-blue" />
                                    <span>{student.parentName}</span>
                                </div>

                                {/* 반 및 교육수준 */}
                                <div className="flex gap-2 flex-wrap">
                                    {student.class && (
                                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">
                                            {student.class}
                                        </span>
                                    )}
                                    {student.level && (
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                            student.level === 'basic' 
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : student.level === 'advanced'
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                        }`}>
                                            {student.level === 'basic' ? '기초' : student.level === 'advanced' ? '심화' : '대회'}
                                        </span>
                                    )}
                                </div>

                                {/* 통계 */}
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-3 gap-2">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            <TrendingUp className="w-3 h-3" />
                                            출석률
                                        </div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                                            {student.attendance.rate}%
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            <BookOpen className="w-3 h-3" />
                                            프로젝트
                                        </div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                                            {student.projects.length}개
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            <Trophy className="w-3 h-3" />
                                            대회
                                        </div>
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                                            {student.competitions.length}회
                                        </div>
                                    </div>
                                </div>

                                {student.learningNotes && (
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                            {student.learningNotes}
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedStudent(student)}
                                    className="w-full mt-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-semibold"
                                >
                                    상세 보기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 상세 보기 모달 */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {selectedStudent.name} 학생 상세 정보
                            </h3>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* 기본 정보 */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    기본 정보
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400">학생명</label>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400">학년</label>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.grade}</p>
                                    </div>
                                    {selectedStudent.class && (
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-400">반</label>
                                            <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.class}</p>
                                        </div>
                                    )}
                                    {selectedStudent.level && (
                                        <div>
                                            <label className="text-sm text-gray-600 dark:text-gray-400">교육수준</label>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {selectedStudent.level === 'basic' ? '기초' : selectedStudent.level === 'advanced' ? '심화' : '대회'}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400">학부모명</label>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.parentName}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 dark:text-gray-400">연락처</label>
                                        <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.parentPhone}</p>
                                    </div>
                                    {selectedStudent.parentEmail && (
                                        <div className="col-span-2">
                                            <label className="text-sm text-gray-600 dark:text-gray-400">이메일</label>
                                            <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.parentEmail}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 출석률 */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    출석 현황
                                </h4>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">출석률</span>
                                        <span className="text-lg font-bold text-deep-electric-blue">{selectedStudent.attendance.rate}%</span>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        참석: {selectedStudent.attendance.attendedClasses} / 전체: {selectedStudent.attendance.totalClasses}
                                    </div>
                                </div>
                            </div>

                            {/* 학습 메모 */}
                            {selectedStudent.learningNotes && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                        학습 성향 메모
                                    </h4>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {selectedStudent.learningNotes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* 등록일 */}
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                등록일: {formatDate(selectedStudent.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

