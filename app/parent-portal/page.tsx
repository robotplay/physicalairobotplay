'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Image, Mail, LogOut, Calendar, Trophy, BookOpen, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface Student {
    _id: string;
    studentId: string;
    name: string;
    grade: string;
    class?: string;
    level?: string;
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
    projects: any[];
}

interface AttendanceRecord {
    _id: string;
    classDate: string;
    studentClass: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
}

interface Feedback {
    _id: string;
    date: string;
    content: string;
    strengths: string[];
    improvements: string[];
    nextSteps: string;
    teacherName?: string;
}

export default function ParentPortalPage() {
    const router = useRouter();
    const [student, setStudent] = useState<Student | null>(null);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [newsletters, setNewsletters] = useState<any[]>([]);
    const [galleries, setGalleries] = useState<any[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'feedback' | 'portfolio'>('overview');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            console.log('Checking authentication...');
            const response = await fetch('/api/auth/me', {
                credentials: 'include', // 쿠키 포함
            });
            
            console.log('Auth response status:', response.status);
            const result = await response.json();
            console.log('Auth response result:', result);

            if (result.success && result.user && result.user.role === 'parent' && result.user.studentId) {
                console.log('Authentication successful, loading data...');
                setIsAuthenticated(true);
                await loadData(result.user.studentId);
                setLoading(false);
                return;
            }
            
            console.log('Authentication failed, redirecting to login...');
            // 인증 실패 시 로그인 페이지로 리다이렉트
            window.location.href = '/parent-portal/login';
        } catch (error) {
            console.error('Auth check failed:', error);
            // 에러 발생 시 로그인 페이지로 리다이렉트
            window.location.href = '/parent-portal/login';
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
                } else {
                    console.error('Student not found:', studentId);
                    window.location.href = '/parent-portal/login';
                    return;
                }
            } else {
                console.error('Failed to load students:', studentsResult.error);
                window.location.href = '/parent-portal/login';
                return;
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

            // 출석 기록 (최근 1개월)
            const now = new Date();
            const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const attendanceResponse = await fetch(`/api/attendance?studentId=${studentId}&month=${month}`);
            const attendanceResult = await attendanceResponse.json();
            if (attendanceResult.success) {
                setAttendanceRecords(attendanceResult.data.records || []);
            }

            // 강사 피드백
            const feedbackResponse = await fetch(`/api/student-feedback?studentId=${studentId}`);
            const feedbackResult = await feedbackResponse.json();
            if (feedbackResult.success) {
                setFeedbacks(feedbackResult.data.feedbacks || []);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
            // 데이터 로드 실패 시 로그인 페이지로 리다이렉트
            window.location.href = '/parent-portal/login';
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
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-deep-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">인증 중...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !student) {
        // 인증되지 않았거나 학생 정보가 없으면 로그인 페이지로 리다이렉트
        if (typeof window !== 'undefined') {
            window.location.href = '/parent-portal/login';
        }
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">로그인 페이지로 이동 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* 상단 고정 헤더 */}
            <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                {student.name} 학생 포털
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {student.grade} | 학부모: {student.parentName}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-semibold text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 탭 메뉴 */}
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                            activeTab === 'overview'
                                ? 'border-deep-electric-blue text-deep-electric-blue dark:text-sky-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        전체보기
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                            activeTab === 'attendance'
                                ? 'border-deep-electric-blue text-deep-electric-blue dark:text-sky-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        출석 내역
                    </button>
                    <button
                        onClick={() => setActiveTab('feedback')}
                        className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                            activeTab === 'feedback'
                                ? 'border-deep-electric-blue text-deep-electric-blue dark:text-sky-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        강사 피드백
                    </button>
                    <button
                        onClick={() => setActiveTab('portfolio')}
                        className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                            activeTab === 'portfolio'
                                ? 'border-deep-electric-blue text-deep-electric-blue dark:text-sky-400'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        포트폴리오
                    </button>
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
                            <MessageSquare className="w-5 h-5 text-purple-600" />
                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">강사 피드백</h3>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {feedbacks.length}건
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

                {/* 전체보기 탭 */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* 최근 출석 내역 */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">최근 출석 내역</h2>
                            {attendanceRecords.length === 0 ? (
                                <p className="text-gray-600 dark:text-gray-400">출석 기록이 없습니다.</p>
                            ) : (
                                <div className="space-y-2">
                                    {attendanceRecords.slice(0, 5).map((record) => (
                                        <div key={record._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                {record.status === 'present' && <CheckCircle className="w-5 h-5 text-green-600" />}
                                                {record.status === 'absent' && <XCircle className="w-5 h-5 text-red-600" />}
                                                {(record.status === 'late' || record.status === 'excused') && <Clock className="w-5 h-5 text-yellow-600" />}
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        {new Date(record.classDate).toLocaleDateString('ko-KR')}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{record.studentClass}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                record.status === 'present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                record.status === 'absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                            }`}>
                                                {record.status === 'present' ? '출석' : record.status === 'absent' ? '결석' : record.status === 'late' ? '지각' : '조퇴'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 최근 피드백 */}
                        {feedbacks.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">최근 강사 피드백</h2>
                                <div className="space-y-4">
                                    {feedbacks.slice(0, 2).map((feedback) => (
                                        <div key={feedback._id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(feedback.date).toLocaleDateString('ko-KR')}
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{feedback.content}</p>
                                            {feedback.strengths.length > 0 && (
                                                <div className="mt-2">
                                                    <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">강점</p>
                                                    <ul className="text-xs text-gray-600 dark:text-gray-400">
                                                        {feedback.strengths.map((s, i) => (
                                                            <li key={i}>• {s}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 출석 내역 탭 */}
                {activeTab === 'attendance' && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">출석 상세 내역</h2>
                        {attendanceRecords.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">출석 기록이 없습니다.</p>
                        ) : (
                            <div className="space-y-2">
                                {attendanceRecords.map((record) => (
                                    <div key={record._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <div className="flex items-center gap-4">
                                            {record.status === 'present' && <CheckCircle className="w-6 h-6 text-green-600" />}
                                            {record.status === 'absent' && <XCircle className="w-6 h-6 text-red-600" />}
                                            {(record.status === 'late' || record.status === 'excused') && <Clock className="w-6 h-6 text-yellow-600" />}
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {new Date(record.classDate).toLocaleDateString('ko-KR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        weekday: 'long',
                                                    })}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{record.studentClass}</p>
                                                {record.notes && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{record.notes}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                            record.status === 'present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                            record.status === 'absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                        }`}>
                                            {record.status === 'present' ? '출석' : record.status === 'absent' ? '결석' : record.status === 'late' ? '지각' : '조퇴'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 강사 피드백 탭 */}
                {activeTab === 'feedback' && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">강사 피드백</h2>
                        {feedbacks.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">아직 피드백이 없습니다.</p>
                        ) : (
                            <div className="space-y-6">
                                {feedbacks.map((feedback) => (
                                    <div key={feedback._id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                {new Date(feedback.date).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                {feedback.content}
                                            </p>
                                        </div>
                                        {feedback.strengths.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">💪 강점</p>
                                                <ul className="space-y-1">
                                                    {feedback.strengths.map((s, i) => (
                                                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300">• {s}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {feedback.improvements.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">📈 개선점</p>
                                                <ul className="space-y-1">
                                                    {feedback.improvements.map((i, idx) => (
                                                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">• {i}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {feedback.nextSteps && (
                                            <div>
                                                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">🎯 다음 단계</p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{feedback.nextSteps}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 포트폴리오 탭 */}
                {activeTab === 'portfolio' && (
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">포트폴리오</h2>
                        {student.portfolio.images.length === 0 && student.portfolio.videos.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">포트폴리오가 없습니다.</p>
                        ) : (
                            <div>
                                {student.portfolio.images.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">로봇 사진</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {student.portfolio.images.map((img, index) => (
                                                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 group cursor-pointer">
                                                    <img src={img} alt={`포트폴리오 ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {student.portfolio.videos.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">영상</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {student.portfolio.videos.map((video, index) => (
                                                <div key={index} className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                    <video src={video} controls className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 전체보기 탭에만 FAQ와 뉴스레터 표시 */}
                {activeTab === 'overview' && (
                    <>
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
                    </>
                )}
            </main>
        </div>
    );
}

