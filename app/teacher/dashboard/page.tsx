'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Video, Newspaper, User, BookOpen, Users as UsersIcon } from 'lucide-react';
import ScrollAnimation from '@/components/ScrollAnimation';
import OnlineCoursesTab, { CourseData } from '@/components/admin/OnlineCoursesTab';
import NewsTab from '@/components/admin/NewsTab';

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

interface UserData {
    _id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    teacherId: string;
    status: string;
}

type TabType = 'courses' | 'news';

export default function TeacherDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('courses');
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [news, setNews] = useState<NewsData[]>([]);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me');
                const result = await response.json();

                if (result.success && result.user.role === 'teacher') {
                    setCurrentUser(result.user);
                    setIsAuthenticated(true);
                } else {
                    router.push('/teacher/login');
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                router.push('/teacher/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        if (!isAuthenticated || !currentUser) return;

        const loadCourses = async () => {
            try {
                const response = await fetch('/api/online-courses');
                const result = await response.json();
                if (result.success) {
                    // 자신이 생성한 강좌만 필터링
                    const myCourses = result.data.filter(
                        (course: CourseData & { teacherId?: string }) => 
                            course.teacherId === currentUser.teacherId
                    );
                    setCourses(myCourses || []);
                }
            } catch (error) {
                console.error('Failed to load courses:', error);
            }
        };

        const loadNews = async () => {
            try {
                const response = await fetch('/api/news');
                const result = await response.json();
                if (result.success) {
                    // 자신이 작성한 게시글만 필터링
                    const myNews = result.data.filter(
                        (item: NewsData & { authorId?: string }) => 
                            item.authorId === currentUser._id
                    );
                    setNews(myNews || []);
                }
            } catch (error) {
                console.error('Failed to load news:', error);
            }
        };

        loadCourses();
        loadNews();
    }, [isAuthenticated, currentUser]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/teacher/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-deep-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">인증 확인 중...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !currentUser) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pt-24 sm:pt-28 pb-8 sm:pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <ScrollAnimation direction="fade">
                    <div className="mb-8 sm:mb-12">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3 sm:mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-deep-electric-blue to-active-orange flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                            {currentUser.name} 강사님
                                        </h1>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            @{currentUser.username}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-3">
                                    <div className="flex items-center gap-2">
                                        <Video className="w-4 h-4 text-blue-600" />
                                        <span>내 강좌 <span className="font-bold text-blue-600 dark:text-blue-400">{courses.length}개</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Newspaper className="w-4 h-4 text-orange-600" />
                                        <span>내 게시글 <span className="font-bold text-orange-600 dark:text-orange-400">{news.length}건</span></span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                로그아웃
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('courses')}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'courses'
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <BookOpen className="w-4 h-4" />
                                    내 강좌 ({courses.length})
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('news')}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'news'
                                        ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <Newspaper className="w-4 h-4" />
                                    내 게시글 ({news.length})
                                </div>
                            </button>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Tab Content */}
                {activeTab === 'courses' && (
                    <OnlineCoursesTab
                        courses={courses}
                        onRefresh={async () => {
                            try {
                                const response = await fetch('/api/online-courses');
                                const result = await response.json();
                                if (result.success) {
                                    const myCourses = result.data.filter(
                                        (course: CourseData & { teacherId?: string }) => 
                                            course.teacherId === currentUser.teacherId
                                    );
                                    setCourses(myCourses || []);
                                }
                            } catch (error) {
                                console.error('Failed to refresh courses:', error);
                            }
                        }}
                    />
                )}

                {activeTab === 'news' && (
                    <NewsTab
                        news={news}
                        onRefresh={async () => {
                            try {
                                const response = await fetch('/api/news');
                                const result = await response.json();
                                if (result.success) {
                                    const myNews = result.data.filter(
                                        (item: NewsData & { authorId?: string }) => 
                                            item.authorId === currentUser._id
                                    );
                                    setNews(myNews || []);
                                }
                            } catch (error) {
                                console.error('Failed to refresh news:', error);
                            }
                        }}
                    />
                )}
            </div>
        </main>
    );
}

