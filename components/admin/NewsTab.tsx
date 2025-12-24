'use client';

import { useState, useRef } from 'react';
import { Newspaper, Calendar, Edit, Trash2, Plus, X, Save, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface NewsData {
    _id: string;
    id: string;
    category: string;
    title: string;
    content: string;
    excerpt: string;
    image: string;
    createdAt: string;
    updatedAt?: string;
}

interface NewsTabProps {
    news: NewsData[];
    onRefresh: () => void;
}

const CATEGORIES = [
    { value: '공지사항', label: '공지사항', color: 'bg-blue-500' },
    { value: '대회 소식', label: '대회 소식', color: 'bg-purple-500' },
    { value: '교육 정보', label: '교육 정보', color: 'bg-green-500' },
    { value: '수업 스케치', label: '수업 스케치', color: 'bg-orange-500' },
];

export default function NewsTab({ news, onRefresh }: NewsTabProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedNews, setSelectedNews] = useState<NewsData | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        category: '공지사항',
        title: '',
        content: '',
        excerpt: '',
        image: '/img/01.jpeg',
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleCreate = () => {
        setIsCreating(true);
        setFormData({
            category: '공지사항',
            title: '',
            content: '',
            excerpt: '',
            image: '/img/01.jpeg',
        });
        setSelectedNews(null);
        setEditingId(null);
    };

    const handleEdit = (item: NewsData) => {
        setEditingId(item._id);
        setFormData({
            category: item.category,
            title: item.title,
            content: item.content,
            excerpt: item.excerpt || item.content.substring(0, 150) + '...',
            image: item.image,
        });
        setSelectedNews(null);
        setIsCreating(false);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setUploadPreview(null);
        setFormData({
            category: '공지사항',
            title: '',
            content: '',
            excerpt: '',
            image: '/img/01.jpeg',
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 미리보기 생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) {
            alert('파일을 선택해주세요.');
            return;
        }

        // 파일 타입 검증 (Photos 앱에서 드래그한 파일은 타입이 없을 수 있음)
        const fileName = file.name?.toLowerCase() || '';
        const fileExtension = fileName.split('.').pop() || '';
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'heic', 'heif'];
        
        if (!file.type?.startsWith('image/') && !validExtensions.includes(fileExtension)) {
            alert(`이미지 파일만 업로드 가능합니다.\n\n파일명: ${file.name}\n감지된 타입: ${file.type || '없음'}\n확장자: ${fileExtension || '없음'}\n\n지원 포맷: JPEG, PNG, WebP, GIF, BMP, HEIC\n\nPhotos 앱에서 드래그한 파일의 경우, 파일을 먼저 저장한 후 업로드해주세요.`);
            return;
        }

        // 파일 크기 검증 (4MB로 제한 - Vercel 제한 고려)
        const maxSize = 4 * 1024 * 1024; // 4MB
        if (file.size > maxSize) {
            alert(`파일 크기는 4MB 이하여야 합니다.\n\n현재 파일 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB\n\n이미지를 압축하거나 더 작은 파일을 선택해주세요.`);
            return;
        }

        // 파일이 비어있는지 확인
        if (file.size === 0) {
            alert('파일이 비어있습니다. 다른 이미지를 선택해주세요.');
            return;
        }

        setIsUploading(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);

            const response = await fetch('/api/news/upload', {
                method: 'POST',
                body: uploadFormData,
            });

            // 응답 상태 확인
            if (!response.ok) {
                // HTTP 에러 응답 처리
                let errorMessage = `서버 오류 (${response.status}): ${response.statusText}`;
                try {
                    const errorText = await response.text();
                    if (errorText) {
                        try {
                            const errorJson = JSON.parse(errorText);
                            errorMessage = errorJson.error || errorJson.details || errorMessage;
                        } catch {
                            // JSON이 아니면 텍스트 그대로 사용
                            errorMessage = errorText.length > 200 ? errorText.substring(0, 200) + '...' : errorText;
                        }
                    }
                } catch (e) {
                    // 응답 읽기 실패
                    console.error('응답 읽기 실패:', e);
                }
                
                throw new Error(errorMessage);
            }

            // JSON 응답 파싱
            let result;
            try {
                const responseText = await response.text();
                if (!responseText) {
                    throw new Error('서버에서 응답이 없습니다.');
                }
                result = JSON.parse(responseText);
            } catch (parseError: any) {
                console.error('JSON 파싱 오류:', parseError);
                throw new Error(`서버 응답을 읽을 수 없습니다: ${parseError.message}\n\n파일이 너무 크거나 서버 설정 문제일 수 있습니다.`);
            }

            if (result.success) {
                setFormData({ ...formData, image: result.path });
                setUploadPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                // 상세한 업로드 결과 메시지 표시
                const message = result.message || '이미지가 업로드되었습니다.';
                const details = result.isOptimized 
                    ? `\n원본: ${(result.originalSize / 1024 / 1024).toFixed(2)}MB → 최적화: ${(result.optimizedSize / 1024 / 1024).toFixed(2)}MB`
                    : `\n원본 포맷 유지: ${(result.originalSize / 1024 / 1024).toFixed(2)}MB`;
                alert(message + details);
            } else {
                // 상세한 에러 메시지 표시
                const errorMsg = result.error || result.details || '업로드에 실패했습니다.';
                alert(`이미지 업로드 실패\n\n${errorMsg}\n\n파일명: ${file.name}\n크기: ${(file.size / 1024 / 1024).toFixed(2)}MB\n\n문제가 계속되면:\n1. 파일을 먼저 저장한 후 업로드\n2. 다른 이미지 파일로 시도\n3. 브라우저 콘솔 확인`);
                console.error('업로드 실패:', result);
            }
        } catch (error: any) {
            console.error('Failed to upload image:', error);
            const errorMsg = error?.message || '알 수 없는 오류';
            alert(`이미지 업로드 중 오류가 발생했습니다.\n\n${errorMsg}\n\n파일명: ${file.name}\n\nPhotos 앱에서 드래그한 파일의 경우, 파일을 먼저 저장한 후 업로드해주세요.`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.content) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        try {
            if (isCreating) {
                // 생성
                const response = await fetch('/api/news', {
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
                    alert('공지사항이 작성되었습니다.');
                    handleCancel();
                    await onRefresh();
                } else {
                    alert(result.error || result.details || '작성에 실패했습니다.');
                    console.error('API 응답:', result);
                }
            } else if (editingId) {
                // 수정
                const response = await fetch(`/api/news/${editingId}`, {
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
                    alert('공지사항이 수정되었습니다.');
                    handleCancel();
                    await onRefresh();
                } else {
                    alert(result.error || result.details || '수정에 실패했습니다.');
                    console.error('API 응답:', result);
                }
            }
        } catch (error) {
            console.error('Failed to save news:', error);
            const errorMessage = error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.';
            alert(`오류: ${errorMessage}\n\n자세한 내용은 브라우저 콘솔을 확인해주세요.`);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch(`/api/news/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.success) {
                alert('공지사항이 삭제되었습니다.');
                onRefresh();
                if (selectedNews?._id === id) {
                    setSelectedNews(null);
                }
            } else {
                alert(result.error || '삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to delete news:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        공지사항 관리 ({news.length}건)
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        MongoDB에 저장된 공지사항을 관리합니다
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            try {
                                const response = await fetch('/api/news/test');
                                const result = await response.json();
                                alert(`MongoDB 연결 상태:\n${JSON.stringify(result, null, 2)}`);
                            } catch (error) {
                                alert('연결 테스트 실패');
                            }
                        }}
                        className="px-3 py-2 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors cursor-pointer"
                        title="MongoDB 연결 테스트"
                    >
                        연결 테스트
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        새 공지사항 작성
                    </button>
                </div>
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingId) && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-deep-electric-blue">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    카테고리 *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    required
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    이미지
                                </label>
                                
                                {/* 이미지 미리보기 */}
                                {(uploadPreview || formData.image) && (
                                    <div className="mb-3 relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                                        {uploadPreview ? (
                                            // 업로드 전 미리보기 (base64)
                                            <img
                                                src={uploadPreview}
                                                alt="미리보기"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : formData.image?.startsWith('data:image/') ? (
                                            // Base64 이미지
                                            <img
                                                src={formData.image}
                                                alt="미리보기"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            // 일반 이미지 URL
                                            <Image
                                                src={formData.image}
                                                alt="미리보기"
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                unoptimized={formData.image?.startsWith('/uploads/')}
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
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
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

                                    {/* 이미지 URL 직접 입력 (대체 옵션) */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="/img/01.jpeg 또는 /uploads/news/..."
                                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const images = ['/img/01.jpeg', '/img/02.jpeg', '/img/03.jpeg'];
                                                const randomImage = images[Math.floor(Math.random() * images.length)];
                                                setFormData({ ...formData, image: randomImage });
                                            }}
                                            className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                                            title="기본 이미지 선택"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        이미지를 업로드하거나 URL을 직접 입력할 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                제목 *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="공지사항 제목을 입력하세요"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                요약 (선택)
                            </label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="공지사항 요약을 입력하세요 (자동 생성 가능)"
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                내용 *
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => {
                                    setFormData({ ...formData, content: e.target.value });
                                    // 자동으로 요약 생성
                                    if (!formData.excerpt && e.target.value.length > 0) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            content: e.target.value,
                                            excerpt: e.target.value.substring(0, 150) + '...',
                                        }));
                                    }
                                }}
                                placeholder="공지사항 내용을 입력하세요"
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                required
                            />
                        </div>

                        <div className="flex gap-2 justify-end">
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
                                {isCreating ? '작성' : '수정'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* News List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* List */}
                <div className="lg:col-span-2 space-y-4">
                    {news.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                            <Newspaper className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                아직 공지사항이 없습니다
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                새 공지사항을 작성해보세요
                            </p>
                        </div>
                    ) : (
                        news.map((item) => (
                            <div
                                key={item._id}
                                className={`bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                                    selectedNews?._id === item._id
                                        ? 'border-deep-electric-blue'
                                        : 'border-gray-200 dark:border-gray-700'
                                }`}
                                onClick={() => setSelectedNews(item)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${
                                                    CATEGORIES.find((c) => c.value === item.category)?.color || 'bg-gray-500'
                                                }`}
                                            >
                                                {item.category}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(item.createdAt)}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                            {item.excerpt || item.content.substring(0, 100) + '...'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEdit(item);
                                            }}
                                            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <Edit className="w-4 h-4 text-blue-500" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item._id);
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
                    {selectedNews ? (
                        <div className="sticky top-4 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl border-2 border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                    상세 내용
                                </h2>
                                <button
                                    onClick={() => setSelectedNews(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-900">
                                    {selectedNews.image?.startsWith('data:image/') ? (
                                        // Base64 이미지
                                        <img
                                            src={selectedNews.image}
                                            alt={selectedNews.title}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        // 일반 이미지 URL
                                        <Image
                                            src={selectedNews.image}
                                            alt={selectedNews.title}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            unoptimized={selectedNews.image?.startsWith('/uploads/')}
                                        />
                                    )}
                                </div>

                                <div>
                                    <span
                                        className={`inline-block px-3 py-1 text-white text-xs font-semibold rounded-full ${
                                            CATEGORIES.find((c) => c.value === selectedNews.category)?.color || 'bg-gray-500'
                                        }`}
                                    >
                                        {selectedNews.category}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {selectedNews.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {selectedNews.content}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Calendar className="w-4 h-4" />
                                    <span>작성일: {formatDate(selectedNews.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="sticky top-4 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                            <Newspaper className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                                왼쪽에서 공지사항을 선택하면<br />
                                상세 내용을 볼 수 있습니다
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

