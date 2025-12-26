'use client';

import { useState, useRef } from 'react';
import { Video, Edit, Trash2, Plus, X, Link as LinkIcon, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import RichTextEditor from './RichTextEditor';

export interface CourseData {
    _id: string;
    id: string;
    title: string;
    description: string;
    content: string; // 리치 HTML 콘텐츠
    duration: string;
    students: string;
    level: string;
    thumbnail: string;
    category: string;
    color: string;
    meetingUrl: string;
    platformType: 'zoom' | 'whale';
    schedule: { day: string, time: string }[];
    price: number; // 가격
    createdAt: string;
}

interface OnlineCoursesTabProps {
    courses: CourseData[];
    onRefresh: () => void;
}

const CATEGORIES = [
    { value: 'Basic Course', label: '기초 과정', color: 'from-active-orange to-orange-600' },
    { value: 'Advanced Course', label: '심화 과정', color: 'from-deep-electric-blue to-blue-600' },
    { value: 'AirRobot Course', label: '에어로봇 과정', color: 'from-sky-400 to-blue-600' },
];

const PLATFORMS = [
    { value: 'zoom', label: 'Zoom' },
    { value: 'whale', label: '네이버 웨일온' },
];

export default function OnlineCoursesTab({ courses, onRefresh }: OnlineCoursesTabProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '', // 리치 HTML 콘텐츠
        duration: '4주',
        students: '0명',
        level: '입문',
        category: 'Basic Course',
        color: 'from-active-orange to-orange-600',
        thumbnail: '/img/01.jpeg',
        meetingUrl: '',
        platformType: 'zoom' as 'zoom' | 'whale',
        schedule: [] as { day: string, time: string }[],
        price: 0, // 가격
    });

    const handleCreate = () => {
        setIsCreating(true);
        setFormData({
            title: '',
            description: '',
            content: '',
            duration: '4주',
            students: '0명',
            level: '입문',
            category: 'Basic Course',
            color: 'from-active-orange to-orange-600',
            thumbnail: '/img/01.jpeg',
            meetingUrl: '',
            platformType: 'zoom',
            schedule: [],
            price: 0,
        });
        setSelectedCourse(null);
        setEditingId(null);
    };

    const handleEdit = (item: CourseData) => {
        setEditingId(item._id);
        setFormData({
            title: item.title,
            description: item.description,
            content: item.content || '',
            duration: item.duration,
            students: item.students,
            level: item.level,
            category: item.category,
            color: item.color,
            thumbnail: item.thumbnail,
            meetingUrl: item.meetingUrl || '',
            platformType: item.platformType || 'zoom',
            schedule: item.schedule || [],
            price: item.price || 0,
        });
        setSelectedCourse(null);
        setIsCreating(false);
    };

    const handleCancel = () => {
        setIsCreating(false);
        setEditingId(null);
        setUploadPreview(null);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        try {
            const response = await fetch('/api/news/upload', {
                method: 'POST',
                body: uploadFormData,
            });
            const result = await response.json();
            if (result.success) {
                setFormData({ ...formData, thumbnail: result.path });
                setUploadPreview(null);
                alert('이미지가 업로드되었습니다.');
            }
        } catch {
            alert('업로드 실패');
        } finally {
            setIsUploading(false);
        }
    };

    const addSchedule = () => {
        setFormData({
            ...formData,
            schedule: [...formData.schedule, { day: '월', time: '14:00' }]
        });
    };

    const removeSchedule = (index: number) => {
        const newSchedule = [...formData.schedule];
        newSchedule.splice(index, 1);
        setFormData({ ...formData, schedule: newSchedule });
    };

    const updateSchedule = (index: number, field: 'day' | 'time', value: string) => {
        const newSchedule = [...formData.schedule];
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setFormData({ ...formData, schedule: newSchedule });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/online-courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, id: editingId }),
            });
            const result = await response.json();
            if (result.success) {
                alert(editingId ? '수정되었습니다.' : '추가되었습니다.');
                handleCancel();
                onRefresh();
            }
        } catch {
            alert('저장 실패');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
            const response = await fetch(`/api/online-courses?id=${id}`, { method: 'DELETE' });
            if ((await response.json()).success) {
                alert('삭제되었습니다.');
                onRefresh();
            }
        } catch {
            alert('삭제 실패');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">온라인 강좌 관리 ({courses.length})</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">실시간 화상 강의 및 수강생 권한을 관리합니다</p>
                </div>
                <button onClick={handleCreate} className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-all">
                    <Plus className="w-4 h-4" /> 강좌 추가
                </button>
            </div>

            {(isCreating || editingId) && (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border-2 border-deep-electric-blue">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">강좌 제목 *</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">카테고리 *</label>
                                    <select value={formData.category} onChange={e => {
                                        const cat = CATEGORIES.find(c => c.value === e.target.value);
                                        setFormData({ ...formData, category: e.target.value, color: cat?.color || '' });
                                    }} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                        {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">기간</label>
                                        <input type="text" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">레벨</label>
                                        <input type="text" value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">화상 회의 플랫폼</label>
                                    <select value={formData.platformType} onChange={e => setFormData({ ...formData, platformType: e.target.value as 'zoom' | 'whale' })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                        {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">회의 링크 (Zoom/웨일온 URL)</label>
                                    <div className="flex gap-2">
                                        <LinkIcon className="w-5 h-5 mt-2 text-gray-400" />
                                        <input type="url" value={formData.meetingUrl} onChange={e => setFormData({ ...formData, meetingUrl: e.target.value })} placeholder="https://zoom.us/j/..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">썸네일 이미지</label>
                                    {(uploadPreview || formData.thumbnail) && (
                                        <div className="mb-2 relative h-40 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                                            <Image src={uploadPreview || formData.thumbnail} alt="미리보기" fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="course-img" />
                                        <label htmlFor="course-img" className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-deep-electric-blue transition-colors text-gray-700 dark:text-gray-300">이미지 선택</label>
                                        {fileInputRef.current?.files?.[0] && <button type="button" onClick={handleImageUpload} disabled={isUploading} className="px-4 py-2 bg-deep-electric-blue text-white rounded-lg">{isUploading ? '...' : '업로드'}</button>}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">수업 스케줄</label>
                                        <button type="button" onClick={addSchedule} className="text-xs text-deep-electric-blue font-bold">+ 추가</button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.schedule.map((item, idx) => (
                                            <div key={idx} className="flex gap-2 items-center">
                                                <select value={item.day} onChange={e => updateSchedule(idx, 'day', e.target.value)} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
                                                    {['월','화','수','목','금','토','일'].map(d => <option key={d} value={d}>{d}요일</option>)}
                                                </select>
                                                <input type="time" value={item.time} onChange={e => updateSchedule(idx, 'time', e.target.value)} className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
                                                <button type="button" onClick={() => removeSchedule(idx)} className="text-red-500"><X className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">강좌 간단 소개 (카드 표시용)</label>
                            <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} placeholder="강좌의 간단한 소개를 입력하세요 (한 줄 정도)" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">가격 (원) *</label>
                            <input 
                                type="number" 
                                value={formData.price} 
                                onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} 
                                placeholder="0" 
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" 
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                강좌 상세 내용 * (리치 텍스트 에디터)
                            </label>
                            <RichTextEditor
                                content={formData.content}
                                onChange={(htmlContent) => {
                                    setFormData({ ...formData, content: htmlContent });
                                }}
                                placeholder="강좌의 상세 내용을 입력하세요. 커리큘럼, 수강 대상, 준비물 등을 작성할 수 있습니다."
                                onImageUpload={async (file: File) => {
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
                                    if (result.success) {
                                        return result.path;
                                    } else {
                                        throw new Error(result.error || '이미지 업로드에 실패했습니다.');
                                    }
                                }}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">취소</button>
                            <button type="submit" className="px-6 py-2 bg-deep-electric-blue text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">저장하기</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {courses.length === 0 ? (
                    <div className="lg:col-span-2 text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <Video className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">아직 온라인 강좌가 없습니다</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            새 강좌를 추가해보세요
                        </p>
                    </div>
                ) : (
                    courses.map(course => (
                        <div key={course._id} className={`bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border-2 cursor-pointer hover:shadow-lg transition-all ${selectedCourse?._id === course._id ? 'border-deep-electric-blue' : 'border-gray-100 dark:border-gray-800'}`} onClick={() => setSelectedCourse(course)}>
                            <div className="flex gap-4">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                    <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${course.color} text-white`}>{course.category}</span>
                                        <div className="flex gap-1">
                                            <button onClick={e => { e.stopPropagation(); handleEdit(course); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-blue-500" title="수정"><Edit className="w-4 h-4" /></button>
                                            <button onClick={e => { e.stopPropagation(); handleDelete(course._id); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-red-500" title="삭제"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{course.title}</h3>
                                    <div className="flex gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {course.students}</span>
                                    </div>
                                    {course.meetingUrl && (
                                        <div className="mt-2 text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                                            <Video className="w-3 h-3" /> {course.platformType === 'zoom' ? 'Zoom' : '웨일온'} 링크 설정됨
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

