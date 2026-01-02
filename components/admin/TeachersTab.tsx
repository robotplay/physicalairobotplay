'use client';

import { useState, useRef } from 'react';
import { User, Mail, Phone, Edit, Trash2, Plus, X, Save, Eye, EyeOff, UserCheck, UserX, Image as ImageIcon, Upload, Loader2, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Teacher {
    _id: string;
    id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    teacherId: string;
    status: 'active' | 'inactive';
    image?: string;
    title?: string;
    specialty?: string;
    experience?: string[];
    createdAt: string;
}

interface TeachersTabProps {
    teachers: Teacher[];
    onRefresh: () => void;
}

export default function TeachersTab({ teachers, onRefresh }: TeachersTabProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        image: '',
        title: '',
        specialty: '',
        experience: [] as string[],
    });

    const handleCreate = () => {
        setIsCreating(true);
        setFormData({
            username: '',
            password: '',
            name: '',
            email: '',
            phone: '',
            image: '',
            title: '',
            specialty: '',
            experience: [],
        });
        setUploadPreview(null);
        setSelectedTeacher(null);
        setEditingId(null);
    };

    const handleEdit = (teacher: Teacher) => {
        setEditingId(teacher._id);
        setFormData({
            username: teacher.username,
            password: '', // 비밀번호는 비워둠
            name: teacher.name,
            email: teacher.email,
            phone: teacher.phone,
            image: teacher.image || '',
            title: teacher.title || '',
            specialty: teacher.specialty || '',
            experience: teacher.experience || [],
        });
        setUploadPreview(teacher.image || null);
        setSelectedTeacher(null);
        setIsCreating(false);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setShowPassword(false);
        setUploadPreview(null);
        setFormData({
            username: '',
            password: '',
            name: '',
            email: '',
            phone: '',
            image: '',
            title: '',
            specialty: '',
            experience: [],
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 파일 타입 검증
        if (!file.type.startsWith('image/')) {
            toast.error('이미지 파일만 업로드 가능합니다.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // 파일 크기 검증 (6MB)
        const maxSize = 6 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('파일 크기는 6MB 이하여야 합니다.');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // 미리보기 생성
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                setUploadPreview(reader.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            toast.error('파일을 선택해주세요.');
            return;
        }

        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const loadingToast = toast.loading('이미지 업로드 중...');

        try {
            const response = await fetch('/api/news/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || '업로드 실패');
            }

            const result = await response.json();
            if (result.success) {
                const imageUrl = result.path || result.url || result.data?.path || result.data?.url;
                setFormData({ ...formData, image: imageUrl });
                setUploadPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                toast.success('이미지가 업로드되었습니다.', { id: loadingToast });
            } else {
                throw new Error(result.error || '업로드 실패');
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
            toast.error(error instanceof Error ? error.message : '이미지 업로드 중 오류가 발생했습니다.', { id: loadingToast });
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddExperience = () => {
        setFormData({
            ...formData,
            experience: [...formData.experience, ''],
        });
    };

    const handleRemoveExperience = (index: number) => {
        setFormData({
            ...formData,
            experience: formData.experience.filter((_, i) => i !== index),
        });
    };

    const handleExperienceChange = (index: number, value: string) => {
        const newExperience = [...formData.experience];
        newExperience[index] = value;
        setFormData({
            ...formData,
            experience: newExperience,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.username) {
            toast.error('이름과 아이디는 필수입니다.');
            return;
        }

        if (isCreating && !formData.password) {
            toast.error('비밀번호를 입력해주세요.');
            return;
        }

        const loadingToast = toast.loading(isCreating ? '강사 계정 생성 중...' : '강사 정보 수정 중...');

        try {
            if (isCreating) {
                // 생성
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        role: 'teacher',
                        experience: formData.experience.filter(exp => exp.trim() !== ''),
                    }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || `서버 오류: ${response.status}`);
                }

                if (result.success) {
                    toast.success('강사 계정이 생성되었습니다.', { id: loadingToast });
                    handleCancel();
                    await onRefresh();
                } else {
                    toast.error(result.error || '생성에 실패했습니다.', { id: loadingToast });
                }
            } else if (editingId) {
                // 수정
                const updateData: Record<string, unknown> = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    image: formData.image,
                    title: formData.title,
                    specialty: formData.specialty,
                    experience: formData.experience.filter(exp => exp.trim() !== ''),
                };

                // 비밀번호가 입력된 경우에만 포함
                if (formData.password) {
                    updateData.password = formData.password;
                }

                const response = await fetch(`/api/users/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || `서버 오류: ${response.status}`);
                }

                if (result.success) {
                    toast.success('강사 정보가 수정되었습니다.', { id: loadingToast });
                    handleCancel();
                    await onRefresh();
                } else {
                    toast.error(result.error || '수정에 실패했습니다.', { id: loadingToast });
                }
            }
        } catch (error) {
            console.error('Failed to save teacher:', error);
            const errorMessage = error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.';
            toast.error(`오류: ${errorMessage}`, { id: loadingToast });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 이 강사 계정을 삭제하시겠습니까?\n\n삭제된 강사의 강좌는 유지되지만, 더 이상 로그인할 수 없습니다.')) {
            return;
        }

        const loadingToast = toast.loading('강사 계정 삭제 중...');

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.success) {
                toast.success('강사 계정이 삭제되었습니다.', { id: loadingToast });
                onRefresh();
                if (selectedTeacher?._id === id) {
                    setSelectedTeacher(null);
                }
            } else {
                toast.error(result.error || '삭제에 실패했습니다.', { id: loadingToast });
            }
        } catch (error) {
            console.error('Failed to delete teacher:', error);
            toast.error('삭제 중 오류가 발생했습니다.', { id: loadingToast });
        }
    };

    const handleToggleStatus = async (teacher: Teacher) => {
        const newStatus = teacher.status === 'active' ? 'inactive' : 'active';
        const action = newStatus === 'active' ? '활성화' : '비활성화';

        if (!confirm(`${teacher.name} 강사를 ${action}하시겠습니까?`)) {
            return;
        }

        const loadingToast = toast.loading(`강사 계정 ${action} 중...`);

        try {
            const response = await fetch(`/api/users/${teacher._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success(`강사 계정이 ${action}되었습니다.`, { id: loadingToast });
                onRefresh();
            } else {
                toast.error(result.error || `${action}에 실패했습니다.`, { id: loadingToast });
            }
        } catch (error) {
            console.error('Failed to toggle status:', error);
            toast.error('상태 변경 중 오류가 발생했습니다.', { id: loadingToast });
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        강사 관리 ({teachers.length}명)
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        강사 계정을 생성하고 관리합니다
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    강사 추가
                </button>
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingId) && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-deep-electric-blue">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    로그인 아이디 *
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="teacher01"
                                    disabled={!!editingId} // 수정 시 아이디 변경 불가
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    비밀번호 {isCreating ? '*' : '(변경 시에만 입력)'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder={isCreating ? '비밀번호' : '변경하려면 입력하세요'}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        required={isCreating}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                이름 *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="홍길동"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    이메일
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="teacher@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    연락처
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="010-1234-5678"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* 이미지 업로드 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                프로필 사진
                            </label>
                            
                            {/* 이미지 미리보기 */}
                            {(uploadPreview || formData.image) && (
                                <div className="mb-3 relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900">
                                    {uploadPreview ? (
                                        <img
                                            src={uploadPreview}
                                            alt="미리보기"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : formData.image?.startsWith('data:image/') ? (
                                        <img
                                            src={formData.image}
                                            alt="프로필"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : formData.image?.startsWith('https://') ? (
                                        <img
                                            src={formData.image}
                                            alt="프로필"
                                            className="w-full h-full object-cover"
                                            crossOrigin="anonymous"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            src={formData.image}
                                            alt="프로필"
                                            fill
                                            className="object-cover"
                                            sizes="128px"
                                            onError={() => {
                                                console.error('이미지 로드 실패:', formData.image);
                                            }}
                                        />
                                    )}
                                </div>
                            )}

                            {/* 파일 업로드 */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="teacher-image-upload"
                                    />
                                    <label
                                        htmlFor="teacher-image-upload"
                                        className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 hover:border-deep-electric-blue dark:hover:border-deep-electric-blue transition-colors cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <Upload className="w-4 h-4" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            이미지 선택
                                        </span>
                                    </label>
                                    {fileInputRef.current?.files?.[0] && (
                                        <button
                                            type="button"
                                            onClick={handleImageUpload}
                                            disabled={isUploading}
                                            className="px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    업로드 중...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4" />
                                                    업로드
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    이미지는 자동으로 리사이즈됩니다. (최대 6MB)
                                </p>
                            </div>
                        </div>

                        {/* 전문 분야 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                전문 분야 (예: 창의과학 교육 전문강사)
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="창의과학 교육 전문강사"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* 전문 기술 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                전문 기술 (예: 과학적 사고를 키우는 드론·코딩)
                            </label>
                            <input
                                type="text"
                                value={formData.specialty}
                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                placeholder="과학적 사고를 키우는 드론·코딩"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* 주요 경력 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <GraduationCap className="w-4 h-4 inline mr-1" />
                                주요 경력
                            </label>
                            <div className="space-y-2">
                                {formData.experience.map((exp, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={exp}
                                            onChange={(e) => handleExperienceChange(index, e.target.value)}
                                            placeholder="예: 로봇코딩 - 스크래치 코딩"
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExperience(index)}
                                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddExperience}
                                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 hover:border-deep-electric-blue dark:hover:border-deep-electric-blue transition-colors cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        경력 추가
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4 inline mr-2" />
                                취소
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                                <Save className="w-4 h-4 inline mr-2" />
                                {isCreating ? '생성' : '수정'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Teachers List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {teachers.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                등록된 강사가 없습니다
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                강사 계정을 추가해보세요
                            </p>
                        </div>
                    ) : (
                        teachers.map((teacher) => (
                            <div
                                key={teacher._id}
                                className={`bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                                    selectedTeacher?._id === teacher._id
                                        ? 'border-deep-electric-blue'
                                        : 'border-gray-200 dark:border-gray-700'
                                }`}
                                onClick={() => setSelectedTeacher(teacher)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {teacher.name}
                                            </h3>
                                            <span
                                                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                                    teacher.status === 'active'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-500 text-white'
                                                }`}
                                            >
                                                {teacher.status === 'active' ? '활성' : '비활성'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            @{teacher.username}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            가입일: {formatDate(teacher.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleStatus(teacher);
                                            }}
                                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                                teacher.status === 'active'
                                                    ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'
                                                    : 'hover:bg-green-100 dark:hover:bg-green-900/30 text-green-500'
                                            }`}
                                            title={teacher.status === 'active' ? '비활성화' : '활성화'}
                                        >
                                            {teacher.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(teacher);
                                            }}
                                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Edit className="w-4 h-4 text-blue-500" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(teacher._id);
                                            }}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Detail View */}
                <div className="lg:col-span-1">
                    {selectedTeacher ? (
                        <div className="sticky top-4 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl border-2 border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    강사 정보
                                </h2>
                                <button
                                    onClick={() => setSelectedTeacher(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* 프로필 이미지 */}
                                {selectedTeacher.image && (
                                    <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900">
                                        {selectedTeacher.image.startsWith('data:image/') ? (
                                            <img
                                                src={selectedTeacher.image}
                                                alt={selectedTeacher.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : selectedTeacher.image.startsWith('https://') ? (
                                            <img
                                                src={selectedTeacher.image}
                                                alt={selectedTeacher.name}
                                                className="w-full h-full object-cover"
                                                crossOrigin="anonymous"
                                            />
                                        ) : (
                                            <Image
                                                src={selectedTeacher.image}
                                                alt={selectedTeacher.name}
                                                fill
                                                className="object-cover"
                                                sizes="128px"
                                            />
                                        )}
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {selectedTeacher.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        @{selectedTeacher.username}
                                    </p>
                                    {selectedTeacher.title && (
                                        <p className="text-sm text-deep-electric-blue font-semibold mt-1">
                                            {selectedTeacher.title}
                                        </p>
                                    )}
                                    {selectedTeacher.specialty && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {selectedTeacher.specialty}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    {selectedTeacher.email && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-700 dark:text-gray-300">{selectedTeacher.email}</span>
                                        </div>
                                    )}

                                    {selectedTeacher.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-700 dark:text-gray-300">{selectedTeacher.phone}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            강사 ID: {selectedTeacher.teacherId}
                                        </span>
                                    </div>
                                </div>

                                {/* 주요 경력 */}
                                {selectedTeacher.experience && selectedTeacher.experience.length > 0 && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-deep-electric-blue" />
                                            주요 경력
                                        </h4>
                                        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                            {selectedTeacher.experience.map((exp, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <span className="text-deep-electric-blue mt-0.5">•</span>
                                                    <span>{exp}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        가입일: {formatDate(selectedTeacher.createdAt)}
                                    </p>
                                    <div className="mt-2">
                                        <span
                                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                                selectedTeacher.status === 'active'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-500 text-white'
                                            }`}
                                        >
                                            {selectedTeacher.status === 'active' ? '활성 계정' : '비활성 계정'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="sticky top-4 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                            <User className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                                왼쪽에서 강사를 선택하면<br />
                                상세 정보를 볼 수 있습니다
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

