'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Image, Mail, LogOut, Calendar, Trophy, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

interface Student {
    _id: string;
    studentId: string;
    name: string;
    grade: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    portfolio: {
        images: string[];
        videos: string[];
        description: string;
    };
    competitions: any[];
    attendance: {
        totalClasses: number;
        attendedClasses: number;
        rate: number;
    };
}

export default function ParentPortalPage() {
    const router = useRouter();
    const [student, setStudent] = useState<Student | null>(null);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [newsletters, setNewsletters] = useState<any[]>([]);
    const [galleries, setGalleries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me');
            const result = await response.json();

            if (result.success && result.user && result.user.role === 'parent') {
                setIsAuthenticated(true);
                loadData(result.user.studentId);
            } else {
                router.push('/parent-portal/login');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            router.push('/parent-portal/login');
        } finally {
            setLoading(false);
        }
    };

    const loadData = async (studentId: string) => {
        try {
            // 학생 정보
            const studentsResponse = await fetch('/api/students');
            const studentsResult = await studentsResponse.json();
            if (studentsResult.success) {
                const foundStudent = studentsResult.data.students.find(
                    (s: Student) => s.studentId === studentId
                );
                if (foundStudent) {
                    setStudent(foundStudent);
                }
            }

            // FAQ
            const faqResponse = await fetch('/api/faq?isActive=true');
            const faqResult = await faqResponse.json();
            if (faqResult.success) {
                setFaqs(faqResult.data.faqs || []);
            }

            // 뉴스레터
            const newsletterResponse = await fetch('/api/newsletters');
            const newsletterResult = await newsletterResponse.json();
            if (newsletterResult.success) {
                setNewsletters(newsletterResult.data.newsletters || []);
            }

            // 갤러리 (학부모용)
            const galleryResponse = await fetch('/api/gallery?visibility=parents-only');
            const galleryResult = await galleryResponse.json();
            if (galleryResult.success) {
                setGalleries(galleryResult.data.galleries || []);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/parent-portal/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
                <div className="w-16 h-16 border-4 border-deep-electric-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated || !student) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pt-24 sm:pt-28 pb-8 sm:pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {student.name} 학생 포털
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {student.grade} | 학부모: {student.parentName}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-semibold"
                        >
                            <LogOut className="w-4 h-4" />
                            로그아웃
                        </button>
                    </div>
                </div>

                {/* 통계 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-5 h-5 text-deep-electric-blue" />
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">출석률</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {student.attendance.rate}%
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {student.attendance.attendedClasses} / {student.attendance.totalClasses} 수업
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <Trophy className="w-5 h-5 text-yellow-600" />
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">대회 참가</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {student.competitions.length}회
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <Image className="w-5 h-5 text-purple-600" />
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">포트폴리오</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {student.portfolio.images.length + student.portfolio.videos.length}개
                        </p>
                    </div>
                </div>

                {/* 포트폴리오 */}
                {student.portfolio.images.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">포트폴리오</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {student.portfolio.images.map((img, index) => (
                                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img src={img} alt={`포트폴리오 ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FAQ */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">자주 묻는 질문</h2>
                    <div className="space-y-4">
                        {faqs.slice(0, 5).map((faq) => (
                            <div key={faq._id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 뉴스레터 */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">월간 뉴스레터</h2>
                    <div className="space-y-4">
                        {newsletters.slice(0, 3).map((newsletter) => (
                            <div key={newsletter._id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {newsletter.year}년 {newsletter.month}월 - {newsletter.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {newsletter.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

