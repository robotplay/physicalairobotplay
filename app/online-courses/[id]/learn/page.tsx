'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    PlayCircle,
    CheckCircle,
    Lock,
    Clock,
    BookOpen,
    FileText,
    Download,
    Menu,
    X
} from 'lucide-react';
import { OnlineCourse, CourseChapter, CourseLesson, CourseProgress, LessonProgress } from '@/types';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
    loading: () => (
        <div className="w-full aspect-video bg-gray-900 animate-pulse rounded-lg flex items-center justify-center">
            <PlayCircle className="w-16 h-16 text-gray-700" />
        </div>
    ),
    ssr: false,
});

export default function CourseLearningPage() {
    const params = useParams();
    const router = useRouter();

    const [course, setCourse] = useState<OnlineCourse | null>(null);
    const [progress, setProgress] = useState<CourseProgress | null>(null);
    const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
    const [currentChapter, setCurrentChapter] = useState<CourseChapter | null>(null);
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userId, setUserId] = useState<string>('');
    const [hasAccess, setHasAccess] = useState(false);

    // 강좌 데이터 로드
    useEffect(() => {
        const loadCourse = async () => {
            try {
                const resolvedParams = params instanceof Promise ? await params : params;
                const id = resolvedParams.id as string;

                // 강좌 정보 로드
                const courseRes = await fetch(`/api/online-courses/${id}`);
                const courseData = await courseRes.json();

                if (!courseData.success) {
                    router.push('/online-courses');
                    return;
                }

                setCourse(courseData.data);

                // 접근 권한 확인 (localStorage에서 등록 정보 확인)
                const enrollmentData = localStorage.getItem('enrollmentData');
                const userInfo = localStorage.getItem('courseUserInfo');

                if (userInfo) {
                    const { email, name } = JSON.parse(userInfo);
                    setUserId(email);

                    // 진도 로드
                    const progressRes = await fetch(
                        `/api/course-progress?courseId=${id}&userId=${email}`
                    );
                    const progressData = await progressRes.json();

                    if (progressData.success && progressData.data) {
                        setProgress(progressData.data);
                    }

                    setHasAccess(true);
                } else if (enrollmentData) {
                    // 첫 방문 - 사용자 정보 입력 필요
                    const data = JSON.parse(enrollmentData);
                    if (data.courseId === id) {
                        setHasAccess(true);
                        // 임시 ID 설정
                        const tempId = `guest_${Date.now()}`;
                        setUserId(tempId);
                    }
                }

                // 첫 번째 레슨 설정
                if (courseData.data.chapters && courseData.data.chapters.length > 0) {
                    const firstChapter = courseData.data.chapters[0];
                    setCurrentChapter(firstChapter);
                    setExpandedChapters(new Set([firstChapter.chapterId]));

                    if (firstChapter.lessons && firstChapter.lessons.length > 0) {
                        setCurrentLesson(firstChapter.lessons[0]);
                    }
                }
            } catch (error) {
                console.error('Failed to load course:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCourse();
    }, [params, router]);

    // 레슨 선택
    const selectLesson = useCallback((chapter: CourseChapter, lesson: CourseLesson) => {
        setCurrentChapter(chapter);
        setCurrentLesson(lesson);
        setExpandedChapters(prev => new Set([...prev, chapter.chapterId]));

        // 모바일에서는 사이드바 닫기
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, []);

    // 레슨 완료 여부 확인
    const isLessonCompleted = useCallback((lessonId: string): boolean => {
        if (!progress) return false;

        for (const chapter of progress.chapters) {
            const lesson = chapter.lessons.find((l: LessonProgress) => l.lessonId === lessonId);
            if (lesson?.completed) return true;
        }
        return false;
    }, [progress]);

    // 진도 업데이트
    const handleProgress = useCallback(async (progressPercent: number) => {
        if (!course || !currentLesson || !currentChapter || !userId) return;

        try {
            await fetch('/api/course-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: course._id || course.id,
                    lessonId: currentLesson.lessonId,
                    progress: progressPercent,
                    completed: progressPercent >= 90,
                }),
            });
        } catch (error) {
            console.error('Failed to update progress:', error);
        }
    }, [course, currentLesson, currentChapter, userId]);

    // 레슨 완료 처리
    const handleComplete = useCallback(async () => {
        if (!course || !currentLesson || !currentChapter || !userId) return;

        try {
            await fetch('/api/course-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseId: course._id || course.id,
                    courseName: course.title,
                    userId,
                    chapterId: currentChapter.chapterId,
                    lessonId: currentLesson.lessonId,
                    completed: true,
                    totalLessons: course.totalLessons || 0,
                }),
            });

            // 진도 리로드
            const progressRes = await fetch(
                `/api/course-progress?courseId=${course._id || course.id}&userId=${userId}`
            );
            const progressData = await progressRes.json();
            if (progressData.success && progressData.data) {
                setProgress(progressData.data);
            }
        } catch (error) {
            console.error('Failed to complete lesson:', error);
        }
    }, [course, currentLesson, currentChapter, userId]);

    // 다음 레슨으로 이동
    const goToNextLesson = useCallback(() => {
        if (!course || !currentLesson || !currentChapter) return;

        const currentChapterIndex = course.chapters.findIndex(
            ch => ch.chapterId === currentChapter.chapterId
        );
        const currentLessonIndex = currentChapter.lessons.findIndex(
            l => l.lessonId === currentLesson.lessonId
        );

        // 현재 챕터의 다음 레슨
        if (currentLessonIndex < currentChapter.lessons.length - 1) {
            selectLesson(currentChapter, currentChapter.lessons[currentLessonIndex + 1]);
            return;
        }

        // 다음 챕터의 첫 레슨
        if (currentChapterIndex < course.chapters.length - 1) {
            const nextChapter = course.chapters[currentChapterIndex + 1];
            if (nextChapter.lessons.length > 0) {
                selectLesson(nextChapter, nextChapter.lessons[0]);
            }
        }
    }, [course, currentLesson, currentChapter, selectLesson]);

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

    // 분 -> 시:분 포맷
    const formatDuration = (minutes: number): string => {
        if (minutes < 60) return `${minutes}분`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-deep-electric-blue border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">강좌를 찾을 수 없습니다</h2>
                    <Link href="/online-courses" className="text-deep-electric-blue hover:underline">
                        강좌 목록으로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    // 챕터/레슨이 없는 경우
    if (!course.chapters || course.chapters.length === 0) {
        return (
            <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">강좌 콘텐츠 준비 중</h2>
                    <p className="text-gray-400 mb-6">
                        이 강좌의 레슨이 아직 준비되지 않았습니다. 곧 업데이트될 예정입니다.
                    </p>
                    <Link
                        href={`/online-courses/${params.id}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-deep-electric-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        강좌 소개로 돌아가기
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white">
            {/* 헤더 */}
            <header className="fixed top-0 left-0 right-0 h-14 bg-gray-900 border-b border-gray-800 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link
                        href={`/online-courses/${course._id || course.id}`}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">나가기</span>
                    </Link>
                    <div className="w-px h-6 bg-gray-700" />
                    <h1 className="text-sm sm:text-base font-medium truncate max-w-[200px] sm:max-w-none">
                        {course.title}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    {progress && (
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 transition-all"
                                    style={{ width: `${progress.overallProgress}%` }}
                                />
                            </div>
                            <span className="text-sm text-gray-400">
                                {progress.overallProgress}%
                            </span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white"
                    >
                        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            <div className="flex pt-14">
                {/* 메인 콘텐츠 */}
                <main className={`flex-1 transition-all ${isSidebarOpen ? 'lg:mr-80' : ''}`}>
                    <div className="max-w-5xl mx-auto">
                        {/* 비디오 플레이어 */}
                        <div className="bg-black">
                            {currentLesson ? (
                                <VideoPlayer
                                    lesson={currentLesson}
                                    onProgress={handleProgress}
                                    onComplete={handleComplete}
                                />
                            ) : (
                                <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
                                    <p className="text-gray-500">레슨을 선택해주세요</p>
                                </div>
                            )}
                        </div>

                        {/* 레슨 정보 */}
                        <div className="p-6">
                            {currentLesson && (
                                <>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded">
                                            {currentChapter?.title}
                                        </span>
                                        {isLessonCompleted(currentLesson.lessonId) && (
                                            <span className="flex items-center gap-1 text-green-500 text-sm">
                                                <CheckCircle className="w-4 h-4" />
                                                완료
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4">{currentLesson.title}</h2>
                                    {currentLesson.description && (
                                        <p className="text-gray-400 mb-6">{currentLesson.description}</p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDuration(currentLesson.duration)}</span>
                                        </div>
                                    </div>

                                    {/* 첨부 자료 */}
                                    {currentLesson.resources && currentLesson.resources.length > 0 && (
                                        <div className="border-t border-gray-800 pt-6">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <FileText className="w-5 h-5" />
                                                첨부 자료
                                            </h3>
                                            <div className="space-y-2">
                                                {currentLesson.resources.map(resource => (
                                                    <a
                                                        key={resource.resourceId}
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                                                    >
                                                        <Download className="w-5 h-5 text-deep-electric-blue" />
                                                        <span>{resource.title}</span>
                                                        <span className="ml-auto text-xs text-gray-500 uppercase">
                                                            {resource.type}
                                                        </span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 다음 레슨 버튼 */}
                                    <div className="flex justify-end mt-8">
                                        <button
                                            onClick={goToNextLesson}
                                            className="px-6 py-3 bg-deep-electric-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                                        >
                                            다음 레슨
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>

                {/* 사이드바 - 커리큘럼 */}
                <aside
                    className={`fixed top-14 right-0 w-80 h-[calc(100vh-56px)] bg-gray-900 border-l border-gray-800 overflow-y-auto transform transition-transform ${
                        isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    } lg:translate-x-0 z-40`}
                >
                    <div className="p-4 border-b border-gray-800">
                        <h2 className="font-bold text-lg">커리큘럼</h2>
                        {progress && (
                            <p className="text-sm text-gray-400 mt-1">
                                {progress.completedLessons} / {course.totalLessons || 0} 완료
                            </p>
                        )}
                    </div>

                    <div className="divide-y divide-gray-800">
                        {course.chapters.map((chapter, chapterIndex) => (
                            <div key={chapter.chapterId}>
                                {/* 챕터 헤더 */}
                                <button
                                    onClick={() => toggleChapter(chapter.chapterId)}
                                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800 transition-colors"
                                >
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 mb-1">
                                            챕터 {chapterIndex + 1}
                                        </p>
                                        <p className="font-medium">{chapter.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {chapter.lessons.length}개 레슨
                                        </p>
                                    </div>
                                    {expandedChapters.has(chapter.chapterId) ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>

                                {/* 레슨 목록 */}
                                {expandedChapters.has(chapter.chapterId) && (
                                    <div className="bg-gray-800/50">
                                        {chapter.lessons.map((lesson, lessonIndex) => {
                                            const isActive = currentLesson?.lessonId === lesson.lessonId;
                                            const completed = isLessonCompleted(lesson.lessonId);

                                            return (
                                                <button
                                                    key={lesson.lessonId}
                                                    onClick={() => selectLesson(chapter, lesson)}
                                                    className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-800 transition-colors text-left ${
                                                        isActive ? 'bg-gray-800 border-l-2 border-deep-electric-blue' : ''
                                                    }`}
                                                >
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        {completed ? (
                                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                                        ) : isActive ? (
                                                            <PlayCircle className="w-5 h-5 text-deep-electric-blue" />
                                                        ) : (
                                                            <PlayCircle className="w-5 h-5 text-gray-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm ${isActive ? 'text-white' : 'text-gray-300'} truncate`}>
                                                            {lessonIndex + 1}. {lesson.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-gray-500">
                                                                {formatDuration(lesson.duration)}
                                                            </span>
                                                            {lesson.isFree && (
                                                                <span className="text-xs text-green-500">무료</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </aside>
            </div>

            {/* 모바일 오버레이 */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
