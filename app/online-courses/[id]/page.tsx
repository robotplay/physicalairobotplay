'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Calendar, ArrowLeft, Video, Clock, Users, Award, CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const Footer = dynamic(() => import('@/components/Footer'), {
    loading: () => <div className="py-20" />,
    ssr: true,
});

interface CourseItem {
    _id: string;
    id: string;
    title: string;
    description: string;
    content: string;
    duration: string;
    students: string;
    level: string;
    thumbnail: string;
    category: string;
    color: string;
    meetingUrl: string;
    platformType: 'zoom' | 'whale';
    schedule: { day: string; time: string }[];
    price: number;
    createdAt: string;
}

const CATEGORY_COLORS: Record<string, string> = {
    'Basic Course': 'from-active-orange to-orange-600',
    'Advanced Course': 'from-deep-electric-blue to-blue-600',
    'AirRobot Course': 'from-sky-400 to-blue-600',
};

export default function OnlineCourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<CourseItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const resolvedParams = params instanceof Promise ? await params : params;
                const id = resolvedParams.id as string;

                if (!id) {
                    setError('강좌 ID가 없습니다.');
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(`/api/online-courses/${id}`);
                const result = await response.json();

                if (result.success) {
                    setCourse(result.data);
                } else {
                    setError(result.error || '강좌를 불러올 수 없습니다.');
                }
            } catch (error) {
                console.error('Failed to load course:', error);
                setError('강좌를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadCourse();
    }, [params]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const handleEnroll = () => {
        if (!course) return;

        // 결제 페이지로 이동하면서 강좌 정보 전달
        const enrollmentData = {
            courseId: course._id,
            courseTitle: course.title,
            coursePrice: course.price,
            courseCategory: course.category,
            courseThumbnail: course.thumbnail,
        };

        // localStorage에 저장
        localStorage.setItem('enrollmentData', JSON.stringify(enrollmentData));

        // 결제 페이지로 이동
        router.push('/payment');
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#1A1A1A] text-white">
                <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="text-center py-20">
                            <div className="w-16 h-16 border-4 border-deep-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">로딩 중...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error || !course) {
        return (
            <main className="min-h-screen bg-[#1A1A1A] text-white">
                <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="text-center py-20">
                            <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">강좌를 찾을 수 없습니다</h2>
                            <p className="text-gray-400 mb-8">{error || '요청하신 강좌가 존재하지 않습니다.'}</p>
                            <Link
                                href="/#courses"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-deep-electric-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                강좌 목록으로 돌아가기
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#1A1A1A] text-white">
            <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Link
                            href="/#courses"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-deep-electric-blue transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>강좌 목록으로 돌아가기</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <article className="bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
                                {/* Thumbnail */}
                                {course.thumbnail && (
                                    <div className="relative w-full aspect-video overflow-hidden bg-gray-900">
                                        <Image
                                            src={course.thumbnail}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                                            quality={90}
                                            unoptimized={course.thumbnail.startsWith('/uploads/')}
                                        />
                                        <div className="absolute top-6 left-6">
                                            <span className={`px-4 py-2 bg-gradient-to-r ${CATEGORY_COLORS[course.category] || 'bg-gray-500'} text-white text-sm font-bold rounded-full`}>
                                                {course.category}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6 sm:p-8 md:p-12">
                                    {/* Header */}
                                    <div className="mb-6 pb-6 border-b border-gray-700">
                                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                                            {course.title}
                                        </h1>
                                        <p className="text-lg text-gray-300 mb-4">{course.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{course.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                <span>{course.students} 수강</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4" />
                                                <span>{course.level}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>등록일: {formatDate(course.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-deep-electric-blue prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:my-8 prose-img:mx-auto prose-img:max-w-full prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300 prose-blockquote:text-gray-400 prose-blockquote:border-gray-600">
                                        <div
                                            className="text-base sm:text-lg leading-relaxed [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-8 [&_iframe]:max-w-full"
                                            dangerouslySetInnerHTML={{ __html: course.content }}
                                        />
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Sidebar - Enrollment Card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-gray-800 rounded-2xl p-6 shadow-xl border-2 border-gray-700">
                                <div className="mb-6">
                                    <div className="text-4xl font-bold text-white mb-2">
                                        {course.price === 0 ? '무료' : `₩${formatPrice(course.price)}`}
                                    </div>
                                    {course.price > 0 && (
                                        <p className="text-sm text-gray-400">부가세 포함</p>
                                    )}
                                </div>

                                {/* Course Info */}
                                <div className="space-y-4 mb-6 pb-6 border-b border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">기간</span>
                                        <span className="text-white font-semibold">{course.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">레벨</span>
                                        <span className="text-white font-semibold">{course.level}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">수강생</span>
                                        <span className="text-white font-semibold">{course.students}</span>
                                    </div>
                                    {course.platformType && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">플랫폼</span>
                                            <span className="text-white font-semibold flex items-center gap-1">
                                                <Video className="w-4 h-4" />
                                                {course.platformType === 'zoom' ? 'Zoom' : '네이버 웨일온'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Schedule */}
                                {course.schedule && course.schedule.length > 0 && (
                                    <div className="mb-6 pb-6 border-b border-gray-700">
                                        <h3 className="text-lg font-bold text-white mb-3">수업 스케줄</h3>
                                        <div className="space-y-2">
                                            {course.schedule.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4 text-deep-electric-blue" />
                                                    <span className="text-gray-300">
                                                        {item.day}요일 {item.time}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Features */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span>실시간 화상 수업</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span>강의 자료 제공</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span>실습 프로젝트 포함</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span>수료증 발급</span>
                                    </div>
                                </div>

                                {/* Enroll Button */}
                                <button
                                    onClick={handleEnroll}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-deep-electric-blue to-active-orange hover:from-blue-700 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    지금 신청하기
                                </button>

                                <p className="text-xs text-gray-400 text-center mt-4">
                                    결제 후 즉시 수강 가능합니다
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}


