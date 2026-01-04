'use client';

import { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Plus,
    Trash2,
    Edit,
    GripVertical,
    Video,
    FileText,
    Link as LinkIcon,
    Save,
    X,
    Youtube,
    Play
} from 'lucide-react';
import { CourseChapter, CourseLesson, CourseResource } from '@/types';

interface CourseLessonsEditorProps {
    chapters: CourseChapter[];
    onChange: (chapters: CourseChapter[]) => void;
}

const VIDEO_TYPES = [
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'vimeo', label: 'Vimeo', icon: Video },
    { value: 'url', label: '직접 URL', icon: LinkIcon },
];

// 고유 ID 생성
const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function CourseLessonsEditor({ chapters, onChange }: CourseLessonsEditorProps) {
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [editingChapter, setEditingChapter] = useState<string | null>(null);
    const [editingLesson, setEditingLesson] = useState<string | null>(null);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const [isAddingChapter, setIsAddingChapter] = useState(false);

    // 챕터 추가
    const addChapter = () => {
        if (!newChapterTitle.trim()) return;

        const newChapter: CourseChapter = {
            chapterId: generateId(),
            title: newChapterTitle.trim(),
            description: '',
            order: chapters.length + 1,
            lessons: [],
        };

        onChange([...chapters, newChapter]);
        setExpandedChapters(prev => new Set([...prev, newChapter.chapterId]));
        setNewChapterTitle('');
        setIsAddingChapter(false);
    };

    // 챕터 삭제
    const deleteChapter = (chapterId: string) => {
        if (!confirm('이 챕터와 모든 레슨이 삭제됩니다. 계속하시겠습니까?')) return;
        onChange(chapters.filter(c => c.chapterId !== chapterId));
    };

    // 챕터 업데이트
    const updateChapter = (chapterId: string, updates: Partial<CourseChapter>) => {
        onChange(chapters.map(c =>
            c.chapterId === chapterId ? { ...c, ...updates } : c
        ));
    };

    // 레슨 추가
    const addLesson = (chapterId: string) => {
        const newLesson: CourseLesson = {
            lessonId: generateId(),
            title: '새 레슨',
            description: '',
            videoType: 'youtube',
            videoUrl: '',
            duration: 10,
            order: chapters.find(c => c.chapterId === chapterId)?.lessons.length || 0 + 1,
            isFree: false,
            resources: [],
        };

        onChange(chapters.map(c =>
            c.chapterId === chapterId
                ? { ...c, lessons: [...c.lessons, newLesson] }
                : c
        ));

        setEditingLesson(newLesson.lessonId);
    };

    // 레슨 삭제
    const deleteLesson = (chapterId: string, lessonId: string) => {
        if (!confirm('이 레슨을 삭제하시겠습니까?')) return;

        onChange(chapters.map(c =>
            c.chapterId === chapterId
                ? { ...c, lessons: c.lessons.filter(l => l.lessonId !== lessonId) }
                : c
        ));
    };

    // 레슨 업데이트
    const updateLesson = (chapterId: string, lessonId: string, updates: Partial<CourseLesson>) => {
        onChange(chapters.map(c =>
            c.chapterId === chapterId
                ? {
                    ...c,
                    lessons: c.lessons.map(l =>
                        l.lessonId === lessonId ? { ...l, ...updates } : l
                    ),
                }
                : c
        ));
    };

    // 첨부 자료 추가
    const addResource = (chapterId: string, lessonId: string) => {
        const newResource: CourseResource = {
            resourceId: generateId(),
            title: '새 자료',
            type: 'pdf',
            url: '',
        };

        updateLesson(chapterId, lessonId, {
            resources: [
                ...(chapters.find(c => c.chapterId === chapterId)?.lessons.find(l => l.lessonId === lessonId)?.resources || []),
                newResource,
            ],
        });
    };

    // 첨부 자료 삭제
    const deleteResource = (chapterId: string, lessonId: string, resourceId: string) => {
        const lesson = chapters.find(c => c.chapterId === chapterId)?.lessons.find(l => l.lessonId === lessonId);
        if (!lesson) return;

        updateLesson(chapterId, lessonId, {
            resources: lesson.resources?.filter(r => r.resourceId !== resourceId) || [],
        });
    };

    // 첨부 자료 업데이트
    const updateResource = (chapterId: string, lessonId: string, resourceId: string, updates: Partial<CourseResource>) => {
        const lesson = chapters.find(c => c.chapterId === chapterId)?.lessons.find(l => l.lessonId === lessonId);
        if (!lesson) return;

        updateLesson(chapterId, lessonId, {
            resources: lesson.resources?.map(r =>
                r.resourceId === resourceId ? { ...r, ...updates } : r
            ) || [],
        });
    };

    // 챕터 토글
    const toggleChapter = (chapterId: string) => {
        setExpandedChapters(prev => {
            const next = new Set(prev);
            if (next.has(chapterId)) {
                next.delete(chapterId);
            } else {
                next.add(chapterId);
            }
            return next;
        });
    };

    // 총 레슨 수 계산
    const totalLessons = chapters.reduce((sum, c) => sum + c.lessons.length, 0);
    const totalDuration = chapters.reduce(
        (sum, c) => sum + c.lessons.reduce((s, l) => s + l.duration, 0),
        0
    );

    return (
        <div className="space-y-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        커리큘럼 관리
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {chapters.length}개 챕터 · {totalLessons}개 레슨 · 총 {Math.floor(totalDuration / 60)}시간 {totalDuration % 60}분
                    </p>
                </div>
                <button
                    onClick={() => setIsAddingChapter(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    챕터 추가
                </button>
            </div>

            {/* 새 챕터 추가 폼 */}
            {isAddingChapter && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newChapterTitle}
                            onChange={e => setNewChapterTitle(e.target.value)}
                            placeholder="챕터 제목 입력"
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            autoFocus
                            onKeyPress={e => e.key === 'Enter' && addChapter()}
                        />
                        <button
                            onClick={addChapter}
                            className="px-4 py-2 bg-deep-electric-blue text-white rounded-lg hover:bg-blue-700"
                        >
                            추가
                        </button>
                        <button
                            onClick={() => {
                                setIsAddingChapter(false);
                                setNewChapterTitle('');
                            }}
                            className="p-2 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* 챕터 없음 */}
            {chapters.length === 0 && !isAddingChapter && (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        아직 커리큘럼이 없습니다
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        챕터를 추가하고 레슨을 구성해보세요
                    </p>
                    <button
                        onClick={() => setIsAddingChapter(true)}
                        className="px-4 py-2 bg-deep-electric-blue text-white rounded-lg hover:bg-blue-700"
                    >
                        첫 챕터 만들기
                    </button>
                </div>
            )}

            {/* 챕터 목록 */}
            <div className="space-y-3">
                {chapters.map((chapter, chapterIndex) => (
                    <div
                        key={chapter.chapterId}
                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                    >
                        {/* 챕터 헤더 */}
                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                            <button onClick={() => toggleChapter(chapter.chapterId)}>
                                {expandedChapters.has(chapter.chapterId) ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>

                            {editingChapter === chapter.chapterId ? (
                                <div className="flex-1 flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={chapter.title}
                                        onChange={e => updateChapter(chapter.chapterId, { title: e.target.value })}
                                        className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => setEditingChapter(null)}
                                        className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                                    >
                                        <Save className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        챕터 {chapterIndex + 1}
                                    </span>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {chapter.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {chapter.lessons.length}개 레슨
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setEditingChapter(chapter.chapterId)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                                    title="챕터 제목 수정"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deleteChapter(chapter.chapterId)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                    title="챕터 삭제"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* 레슨 목록 */}
                        {expandedChapters.has(chapter.chapterId) && (
                            <div className="p-4 space-y-3">
                                {chapter.lessons.map((lesson, lessonIndex) => (
                                    <div
                                        key={lesson.lessonId}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                    >
                                        {/* 레슨 헤더 */}
                                        <div
                                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer"
                                            onClick={() => setEditingLesson(
                                                editingLesson === lesson.lessonId ? null : lesson.lessonId
                                            )}
                                        >
                                            <GripVertical className="w-4 h-4 text-gray-400" />
                                            <Play className="w-4 h-4 text-deep-electric-blue" />
                                            <div className="flex-1">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {lessonIndex + 1}. {lesson.title}
                                                </span>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>{lesson.duration}분</span>
                                                    {lesson.isFree && (
                                                        <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                                                            무료
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteLesson(chapter.chapterId, lesson.lessonId);
                                                }}
                                                className="p-1 text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* 레슨 편집 폼 */}
                                        {editingLesson === lesson.lessonId && (
                                            <div className="p-4 space-y-4 border-t border-gray-200 dark:border-gray-700">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            레슨 제목 *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={lesson.title}
                                                            onChange={e => updateLesson(chapter.chapterId, lesson.lessonId, { title: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            영상 길이 (분)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={lesson.duration}
                                                            onChange={e => updateLesson(chapter.chapterId, lesson.lessonId, { duration: parseInt(e.target.value) || 0 })}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        레슨 설명
                                                    </label>
                                                    <textarea
                                                        value={lesson.description || ''}
                                                        onChange={e => updateLesson(chapter.chapterId, lesson.lessonId, { description: e.target.value })}
                                                        rows={2}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                        placeholder="이 레슨에서 배울 내용을 간단히 설명해주세요"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            비디오 타입
                                                        </label>
                                                        <select
                                                            value={lesson.videoType}
                                                            onChange={e => updateLesson(chapter.chapterId, lesson.lessonId, { videoType: e.target.value as 'youtube' | 'vimeo' | 'url' })}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                        >
                                                            {VIDEO_TYPES.map(type => (
                                                                <option key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            {lesson.videoType === 'youtube' ? 'YouTube URL 또는 ID' :
                                                             lesson.videoType === 'vimeo' ? 'Vimeo URL 또는 ID' : '비디오 URL'}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={lesson.videoUrl}
                                                            onChange={e => updateLesson(chapter.chapterId, lesson.lessonId, { videoUrl: e.target.value })}
                                                            placeholder={
                                                                lesson.videoType === 'youtube' ? 'https://youtube.com/watch?v=... 또는 dQw4w9WgXcQ' :
                                                                lesson.videoType === 'vimeo' ? 'https://vimeo.com/123456789 또는 123456789' :
                                                                'https://...'
                                                            }
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`free-${lesson.lessonId}`}
                                                        checked={lesson.isFree || false}
                                                        onChange={e => updateLesson(chapter.chapterId, lesson.lessonId, { isFree: e.target.checked })}
                                                        className="w-4 h-4 text-deep-electric-blue border-gray-300 rounded focus:ring-deep-electric-blue"
                                                    />
                                                    <label htmlFor={`free-${lesson.lessonId}`} className="text-sm text-gray-700 dark:text-gray-300">
                                                        무료 미리보기 (비로그인 사용자도 볼 수 있음)
                                                    </label>
                                                </div>

                                                {/* 첨부 자료 */}
                                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            첨부 자료
                                                        </label>
                                                        <button
                                                            onClick={() => addResource(chapter.chapterId, lesson.lessonId)}
                                                            className="text-sm text-deep-electric-blue hover:underline"
                                                        >
                                                            + 자료 추가
                                                        </button>
                                                    </div>
                                                    {lesson.resources && lesson.resources.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {lesson.resources.map(resource => (
                                                                <div
                                                                    key={resource.resourceId}
                                                                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                                                >
                                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                                    <input
                                                                        type="text"
                                                                        value={resource.title}
                                                                        onChange={e => updateResource(chapter.chapterId, lesson.lessonId, resource.resourceId, { title: e.target.value })}
                                                                        placeholder="자료 제목"
                                                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                    />
                                                                    <select
                                                                        value={resource.type}
                                                                        onChange={e => updateResource(chapter.chapterId, lesson.lessonId, resource.resourceId, { type: e.target.value as 'pdf' | 'link' | 'file' })}
                                                                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                    >
                                                                        <option value="pdf">PDF</option>
                                                                        <option value="link">링크</option>
                                                                        <option value="file">파일</option>
                                                                    </select>
                                                                    <input
                                                                        type="text"
                                                                        value={resource.url}
                                                                        onChange={e => updateResource(chapter.chapterId, lesson.lessonId, resource.resourceId, { url: e.target.value })}
                                                                        placeholder="URL"
                                                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                                    />
                                                                    <button
                                                                        onClick={() => deleteResource(chapter.chapterId, lesson.lessonId, resource.resourceId)}
                                                                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            첨부 자료가 없습니다
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* 레슨 추가 버튼 */}
                                <button
                                    onClick={() => addLesson(chapter.chapterId)}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 hover:text-deep-electric-blue hover:border-deep-electric-blue transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    레슨 추가
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
