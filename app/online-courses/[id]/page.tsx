'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    Play, 
    Lock, 
    CheckCircle, 
    Clock, 
    BookOpen, 
    Award, 
    Star,
    ChevronDown,
    ChevronUp,
    Download
} from 'lucide-react';
import Image from 'next/image';
import VideoPlayer from '@/components/VideoPlayer';
import toast from 'react-hot-toast';

interface CourseResource {
    resourceId: string;
    title: string;
    type: 'pdf' | 'video' | 'link' | 'file';
    url: string;
}

interface CourseLesson {
    lessonId: string;
    title: string;
    description?: string;
    videoType: 'youtube' | 'vimeo' | 'url';
    videoUrl: string;
    duration: number;
    order: number;
    isFree?: boolean;
    resources?: CourseResource[];
}

interface CourseChapter {
    chapterId: string;
    title: string;
    description?: string;
    order: number;
    lessons: CourseLesson[];
}

interface Course {
    _id: string;
    title: string;
    description: string;
    content: string;
    thumbnail: string;
    level: string;
    duration: string;
    price: number;
    students: string;
    capacity: number;
    chapters: CourseChapter[];
    totalLessons: number;
    totalDuration: number;
    whatYouWillLearn?: string[];
    requirements?: string[];
    isPublished: boolean;
}

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
    const [isEnrolled] = useState(false);

    useEffect(() => {
        loadCourse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    const loadCourse = async () => {
        try {
            const response = await fetch(`/api/online-courses/${params.id}`);
            const result = await response.json();

            if (result.success) {
                setCourse(result.data);
                // 첫 번째 무료 레슨 자동 선택
                const firstFreeLesson = result.data.chapters
                    ?.flatMap((ch: CourseChapter) => ch.lessons)
                    ?.find((lesson: CourseLesson) => lesson.isFree);
                if (firstFreeLesson) {
                    setSelectedLesson(firstFreeLesson);
                }
                // 첫 번째 챕터 자동 확장
                if (result.data.chapters?.[0]) {
                    setExpandedChapters(new Set([result.data.chapters[0].chapterId]));
                }
            } else {
                toast.error('강좌를 불러올 수 없습니다');
            }
        } catch (error) {
            console.error('Failed to load course:', error);
            toast.error('강좌를 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const toggleChapter = (chapterId: string) => {
        setExpandedChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) {
                newSet.delete(chapterId);
            } else {
                newSet.add(chapterId);
            }
            return newSet;
        });
    };

    const selectLesson = (lesson: CourseLesson) => {
        if (!lesson.isFree && !isEnrolled) {
            toast.error('이 레슨은 수강 등록 후 이용 가능합니다');
            return;
        }
        setSelectedLesson(lesson);
    };

    const handleEnroll = () => {
        // 결제 페이지로 이동
        router.push(`/payment?course=${course?._id}&type=online-course`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">강좌를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">강좌를 찾을 수 없습니다</p>
                    <button
                        onClick={() => router.push('/my-classroom')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        온라인 강좌 목록으로
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Video Player Section */}
            <div className="bg-black">
                <div className="max-w-7xl mx-auto">
                    {selectedLesson ? (
                        <VideoPlayer
                            lesson={selectedLesson}
                            onComplete={() => {
                                toast.success('레슨을 완료했습니다!');
                            }}
                        />
                    ) : (
                        <div className="aspect-video flex items-center justify-center bg-gray-900">
                            <div className="text-center text-white">
                                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">왼쪽 목록에서 레슨을 선택하세요</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Course Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Course Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    width={120}
                                    height={80}
                                    className="rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {course.title}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                                        {course.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {course.totalDuration}분
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            {course.totalLessons}개 레슨
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Award className="w-4 h-4" />
                                            {course.level}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Enrollment CTA */}
                            {!isEnrolled && (
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm opacity-90 mb-1">수강료</p>
                                            <p className="text-3xl font-bold">
                                                ₩{course.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleEnroll}
                                            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            수강 신청하기
                                        </button>
                                    </div>
                                    <p className="text-sm opacity-90 mt-3">
                                        💡 무료 미리보기로 먼저 체험해보세요!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Selected Lesson Info */}
                        {selectedLesson && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {selectedLesson.title}
                                </h2>
                                {selectedLesson.description && (
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                        {selectedLesson.description}
                                    </p>
                                )}
                                
                                {/* Lesson Resources */}
                                {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <Download className="w-5 h-5" />
                                            첨부 자료
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedLesson.resources.map((resource) => (
                                                <a
                                                    key={resource.resourceId}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <Download className="w-4 h-4 text-blue-600" />
                                                    <span className="text-gray-900 dark:text-white">
                                                        {resource.title}
                                                    </span>
                                                    <span className="text-xs text-gray-500 ml-auto">
                                                        {resource.type.toUpperCase()}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* What You'll Learn */}
                        {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-yellow-500" />
                                    학습 목표
                                </h2>
                                <ul className="space-y-2">
                                    {course.whatYouWillLearn.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Requirements */}
                        {course.requirements && course.requirements.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    수강 요건
                                </h2>
                                <ul className="space-y-2">
                                    {course.requirements.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Course Content */}
                        {course.content && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    강좌 소개
                                </h2>
                                <div
                                    className="prose dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: course.content }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Chapter List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg sticky top-4">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="font-bold text-gray-900 dark:text-white">
                                    강좌 목차
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {course.totalLessons}개 레슨 • {course.totalDuration}분
                                </p>
                            </div>

                            <div className="max-h-[600px] overflow-y-auto">
                                {course.chapters.map((chapter) => (
                                    <div key={chapter.chapterId} className="border-b border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => toggleChapter(chapter.chapterId)}
                                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <div className="flex-1 text-left">
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {chapter.title}
                                                </h3>
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

                                        {expandedChapters.has(chapter.chapterId) && (
                                            <div className="bg-gray-50 dark:bg-gray-900">
                                                {chapter.lessons.map((lesson) => {
                                                    const isLocked = !lesson.isFree && !isEnrolled;
                                                    const isSelected = selectedLesson?.lessonId === lesson.lessonId;

                                                    return (
                                                        <button
                                                            key={lesson.lessonId}
                                                            onClick={() => selectLesson(lesson)}
                                                            disabled={isLocked}
                                                            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                                                                isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600' : ''
                                                            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            <div className="flex-shrink-0 mt-1">
                                                                {isLocked ? (
                                                                    <Lock className="w-4 h-4 text-gray-400" />
                                                                ) : (
                                                                    <Play className="w-4 h-4 text-blue-600" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 text-left">
                                                                <p className={`text-sm font-medium ${
                                                                    isSelected ? 'text-blue-600' : 'text-gray-900 dark:text-white'
                                                                }`}>
                                                                    {lesson.title}
                                                                </p>
                                                                <div className="flex items-center gap-3 mt-1">
                                                                    <span className="text-xs text-gray-500">
                                                                        {lesson.duration}분
                                                                    </span>
                                                                    {lesson.isFree && (
                                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                                                            무료
                                                                        </span>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
