'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, User, MessageSquare, Calendar, X, Trash2, Eye, LogOut, CreditCard, FileText, Newspaper, Video, Users, Settings, TrendingUp, GraduationCap, BarChart3, Trophy, BookOpen, CheckCircle2 } from 'lucide-react';
import ScrollAnimation from '@/components/ScrollAnimation';
import PaymentsTab from '@/components/admin/PaymentsTab';
import RegistrationsTab from '@/components/admin/RegistrationsTab';
import NewsTab from '@/components/admin/NewsTab';
import OnlineCoursesTab, { CourseData } from '@/components/admin/OnlineCoursesTab';
import TeachersTab from '@/components/admin/TeachersTab';
import AccountSettingsTab from '@/components/admin/AccountSettingsTab';
import MarketingTab from '@/components/admin/MarketingTab';
import StudentsTab from '@/components/admin/StudentsTab';
import ParentCommunicationTab from '@/components/admin/ParentCommunicationTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import AttendanceTab from '@/components/admin/AttendanceTab';

interface ConsultationData {
    id: string;
    name: string;
    phone: string;
    email: string;
    course: string;
    message: string;
    timestamp: string;
}

interface PaymentData {
    _id: string;
    paymentId: string;
    orderId: string;
    amount: number;
    orderName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: string;
    paymentMethod: string;
    timestamp: string;
    createdAt: string;
}

interface RegistrationData {
    _id: string;
    id: string;
    studentName: string;
    grade: string;
    parentName: string;
    phone: string;
    email: string;
    program: string;
    programName: string;
    status: string;
    paymentStatus: string;
    timestamp: string;
    createdAt: string;
}

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

interface TeacherData {
    _id: string;
    id: string;
    username: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    teacherId: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

interface StudentData {
    _id: string;
    studentId: string;
    name: string;
    grade: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    enrolledCourses: string[];
    attendance: {
        totalClasses: number;
        attendedClasses: number;
        rate: number;
    };
    projects: any[];
    competitions: any[];
    learningNotes: string;
    portfolio: {
        images: string[];
        videos: string[];
        description: string;
    };
    createdAt: string;
    updatedAt: string;
}

type TabType = 'consultations' | 'payments' | 'registrations' | 'news' | 'online-courses' | 'teachers' | 'students' | 'attendance' | 'parent-communication' | 'competitions' | 'analytics' | 'marketing' | 'settings';

export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('consultations');
    const [consultations, setConsultations] = useState<ConsultationData[]>([]);
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
    const [news, setNews] = useState<NewsData[]>([]);
    const [onlineCourses, setOnlineCourses] = useState<CourseData[]>([]);
    const [teachers, setTeachers] = useState<TeacherData[]>([]);
    const [students, setStudents] = useState<StudentData[]>([]);
    const [selectedConsultation, setSelectedConsultation] = useState<ConsultationData | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
    const [selectedRegistration, setSelectedRegistration] = useState<RegistrationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // JWT 기반 인증 확인
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me', {
                    credentials: 'include',
                });
                const result = await response.json();
                
                if (result.success && result.user) {
                    // 관리자 권한 확인
                    if (result.user.role === 'admin') {
                        setIsAuthenticated(true);
                    } else {
                        router.push('/admin/login');
                    }
                } else {
                    router.push('/admin/login');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/admin/login');
            }
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        // 로컬 스토리지에서 상담 문의 데이터 불러오기
        const loadConsultations = () => {
            try {
                const stored = localStorage.getItem('consultations');
                if (stored) {
                    const data = JSON.parse(stored);
                    // 최신순으로 정렬
                    const sorted = data.sort((a: ConsultationData, b: ConsultationData) => 
                        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    );
                    setConsultations(sorted);
                }
            } catch (error) {
                console.error('Failed to load consultations:', error);
            }
        };

        // MongoDB에서 결제 내역 불러오기
        const loadPayments = async () => {
            try {
                const response = await fetch('/api/payments', {
                    credentials: 'include',
                });
                const result = await response.json();
                if (result.success) {
                    setPayments(result.data || []);
                }
            } catch (error) {
                console.error('Failed to load payments:', error);
            }
        };

        // MongoDB에서 신청서 불러오기
        const loadRegistrations = async () => {
            try {
                const response = await fetch('/api/airplane-registrations', {
                    credentials: 'include',
                });
                const result = await response.json();
                if (result.success) {
                    setRegistrations(result.data || []);
                }
            } catch (error) {
                console.error('Failed to load registrations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // MongoDB에서 공지사항 불러오기
        const loadNews = async () => {
            try {
                const response = await fetch('/api/news', {
                    credentials: 'include',
                });
                const result = await response.json();
                if (result.success) {
                    setNews(result.data || []);
                }
            } catch (error) {
                console.error('Failed to load news:', error);
            }
        };

        // MongoDB에서 온라인 강좌 불러오기
        const loadOnlineCourses = async () => {
            try {
                const response = await fetch('/api/online-courses', {
                    credentials: 'include',
                });
                const result = await response.json();
                if (result.success) {
                    setOnlineCourses(result.data || []);
                }
            } catch (error) {
                console.error('Failed to load online courses:', error);
            }
        };

        // MongoDB에서 강사 목록 불러오기
        const loadTeachers = async () => {
            try {
                const response = await fetch('/api/users?role=teacher', {
                    credentials: 'include',
                });
                const result = await response.json();
                if (result.success && result.data) {
                    setTeachers(result.data.users || []);
                }
            } catch (error) {
                console.error('Failed to load teachers:', error);
            }
        };

        // MongoDB에서 학생 목록 불러오기
        const loadStudents = async () => {
            try {
                const response = await fetch('/api/students', {
                    credentials: 'include',
                });
                const result = await response.json();
                if (result.success && result.data) {
                    setStudents(result.data.students || []);
                }
            } catch (error) {
                console.error('Failed to load students:', error);
            }
        };

        loadConsultations();
        loadPayments();
        loadRegistrations();
        loadNews();
        loadOnlineCourses();
        loadTeachers();
        loadStudents();

        // 실시간 업데이트를 위한 이벤트 리스너
        const handleStorageChange = () => {
            loadConsultations();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('consultation-updated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('consultation-updated', handleStorageChange);
        };
    }, []);

    const deleteConsultation = (id: string) => {
        if (confirm('정말 이 문의를 삭제하시겠습니까?')) {
            const updated = consultations.filter(c => c.id !== id);
            setConsultations(updated);
            localStorage.setItem('consultations', JSON.stringify(updated));
            if (selectedConsultation?.id === id) {
                setSelectedConsultation(null);
            }
        }
    };

    const getCourseLabel = (course: string) => {
        const labels: Record<string, string> = {
            'basic': 'Basic Course',
            'advanced': 'Advanced Course',
            'airrobot': 'AirRobot Course',
            'all': '전체 과정',
            '': '미선택'
        };
        return labels[course] || course;
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isAuthenticated || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-deep-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">인증 확인 중...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-black pt-24 sm:pt-28 pb-8 sm:pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <ScrollAnimation direction="fade">
                    <div className="mb-8 sm:mb-12">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3 sm:mb-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                    관리자 대시보드
                                </h1>
                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                                    상담 문의 <span className="font-bold text-deep-electric-blue dark:text-sky-400">{consultations.length}건</span> | 
                                    결제 내역 <span className="font-bold text-green-600 dark:text-green-400">{payments.length}건</span> | 
                                    신청서 <span className="font-bold text-purple-600 dark:text-purple-400">{registrations.length}건</span> | 
                                    공지사항 <span className="font-bold text-orange-600 dark:text-orange-400">{news.length}건</span> |
                                    온라인 강좌 <span className="font-bold text-blue-600 dark:text-blue-400">{onlineCourses.length}개</span> |
                                    강사 <span className="font-bold text-indigo-600 dark:text-indigo-400">{teachers.length}명</span> |
                                    학생 <span className="font-bold text-teal-600 dark:text-teal-400">{students.length}명</span>
                                </p>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        await fetch('/api/auth/logout', { 
                                            method: 'POST',
                                            credentials: 'include',
                                        });
                                        router.push('/admin/login');
                                    } catch (error) {
                                        console.error('Logout failed:', error);
                                        router.push('/admin/login');
                                    }
                                }}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                로그아웃
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                            <button
                                onClick={() => {
                                    setActiveTab('consultations');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'consultations'
                                        ? 'border-deep-electric-blue text-deep-electric-blue dark:text-sky-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <MessageSquare className="w-4 h-4" />
                                    상담 문의 ({consultations.length})
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('payments');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'payments'
                                        ? 'border-green-600 text-green-600 dark:text-green-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <CreditCard className="w-4 h-4" />
                                    결제 내역 ({payments.length})
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('registrations');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'registrations'
                                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <FileText className="w-4 h-4" />
                                    신청서 ({registrations.length})
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('news');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'news'
                                        ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <Newspaper className="w-4 h-4" />
                                    공지사항 ({news.length})
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('online-courses');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'online-courses'
                                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <Video className="w-4 h-4" />
                                    온라인 강좌 ({onlineCourses.length})
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('teachers');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'teachers'
                                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <Users className="w-4 h-4" />
                                    강사 관리 ({teachers.length})
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('students');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'students'
                                        ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <GraduationCap className="w-4 h-4" />
                                    학생 관리 ({students.length})
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('attendance');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'attendance'
                                        ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <CheckCircle2 className="w-4 h-4" />
                                    출결 관리
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('parent-communication');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'parent-communication'
                                        ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <Mail className="w-4 h-4" />
                                    학부모 소통
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('competitions');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'competitions'
                                        ? 'border-yellow-600 text-yellow-600 dark:text-yellow-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <Trophy className="w-4 h-4" />
                                    대회 관리
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('analytics');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'analytics'
                                        ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <BarChart3 className="w-4 h-4" />
                                    운영 분석
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('marketing');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'marketing'
                                        ? 'border-pink-600 text-pink-600 dark:text-pink-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <TrendingUp className="w-4 h-4" />
                                    마케팅
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('settings');
                                    setSelectedConsultation(null);
                                    setSelectedPayment(null);
                                    setSelectedRegistration(null);
                                }}
                                className={`flex-shrink-0 px-4 py-2 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'settings'
                                        ? 'border-gray-600 text-gray-600 dark:text-gray-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                    <Settings className="w-4 h-4" />
                                    계정 설정
                                </div>
                            </button>
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Tab Content */}
                {activeTab === 'consultations' && consultations.length === 0 && (
                    <ScrollAnimation direction="fade">
                        <div className="text-center py-16 sm:py-20 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg px-4">
                            <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                아직 접수된 문의가 없습니다
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                                새로운 상담 문의가 접수되면 여기에 표시됩니다
                            </p>
                        </div>
                    </ScrollAnimation>
                )}

                {activeTab === 'consultations' && consultations.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* List */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                            {consultations.map((consultation) => (
                                <div
                                    key={consultation.id}
                                    className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                                        selectedConsultation?.id === consultation.id
                                            ? 'border-deep-electric-blue'
                                            : 'border-gray-200'
                                    }`}
                                    onClick={() => setSelectedConsultation(consultation)}
                                >
                                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-deep-electric-blue to-active-orange flex items-center justify-center">
                                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                                                        {consultation.name}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(consultation.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteConsultation(consultation.id);
                                            }}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                                            aria-label="삭제"
                                        >
                                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-deep-electric-blue" />
                                            <span className="truncate font-medium">{consultation.phone}</span>
                                        </div>
                                        {consultation.email && (
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-deep-electric-blue" />
                                                <span className="truncate font-medium">{consultation.email}</span>
                                            </div>
                                        )}
                                        <div className="inline-block px-2 sm:px-3 py-1 bg-deep-electric-blue/10 dark:bg-deep-electric-blue/20 text-deep-electric-blue dark:text-sky-300 rounded-full text-xs font-semibold">
                                            {getCourseLabel(consultation.course)}
                                        </div>
                                    </div>

                                    {consultation.message && (
                                        <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                                            {consultation.message}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Detail View */}
                        <div className="lg:col-span-1">
                            {selectedConsultation ? (
                                <div className="sticky top-4 sm:top-8 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border-2 border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                            문의 상세
                                        </h2>
                                        <button
                                            onClick={() => setSelectedConsultation(null)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                                            aria-label="닫기"
                                        >
                                            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                                        </button>
                                    </div>

                                    <div className="space-y-4 sm:space-y-6">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                                이름
                                            </label>
                                            <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-deep-electric-blue dark:text-sky-400 flex-shrink-0" />
                                                <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                                                    {selectedConsultation.name}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                                연락처
                                            </label>
                                            <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-deep-electric-blue dark:text-sky-400 flex-shrink-0" />
                                                <a
                                                    href={`tel:${selectedConsultation.phone}`}
                                                    className="text-sm sm:text-base text-gray-900 dark:text-white font-medium cursor-pointer hover:text-deep-electric-blue dark:hover:text-sky-400 transition-colors"
                                                >
                                                    {selectedConsultation.phone}
                                                </a>
                                            </div>
                                        </div>

                                        {selectedConsultation.email && (
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                                    이메일
                                                </label>
                                                <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-deep-electric-blue dark:text-sky-400 flex-shrink-0" />
                                                    <a
                                                        href={`mailto:${selectedConsultation.email}`}
                                                        className="text-sm sm:text-base text-gray-900 dark:text-white font-medium cursor-pointer hover:text-deep-electric-blue dark:hover:text-sky-400 transition-colors break-all"
                                                    >
                                                        {selectedConsultation.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                                관심 과정
                                            </label>
                                            <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <span className="inline-block px-2 sm:px-3 py-1 bg-deep-electric-blue dark:bg-sky-500 text-white rounded-full text-xs sm:text-sm font-semibold">
                                                    {getCourseLabel(selectedConsultation.course)}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                                문의 내용
                                            </label>
                                            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                                                    {selectedConsultation.message}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                                접수 시간
                                            </label>
                                            <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-deep-electric-blue dark:text-sky-400 flex-shrink-0" />
                                                <span className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium">
                                                    {formatDate(selectedConsultation.timestamp)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <a
                                                href={`tel:${selectedConsultation.phone}`}
                                                className="flex-1 px-3 sm:px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg transition-all text-center touch-manipulation cursor-pointer"
                                            >
                                                전화하기
                                            </a>
                                            {selectedConsultation.email && (
                                                <a
                                                    href={`mailto:${selectedConsultation.email}`}
                                                    className="flex-1 px-3 sm:px-4 py-2 bg-active-orange hover:bg-orange-600 text-white text-sm sm:text-base font-semibold rounded-lg transition-all text-center touch-manipulation cursor-pointer"
                                                >
                                                    이메일
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="sticky top-4 sm:top-8 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                                    <Eye className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                                        왼쪽에서 문의를 선택하면<br className="hidden sm:block" />상세 내용을 볼 수 있습니다
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <PaymentsTab
                        payments={payments}
                        selectedPayment={selectedPayment}
                        onSelectPayment={setSelectedPayment}
                    />
                )}

                {activeTab === 'registrations' && (
                    <RegistrationsTab
                        registrations={registrations}
                        selectedRegistration={selectedRegistration}
                        onSelectRegistration={setSelectedRegistration}
                    />
                )}

                {activeTab === 'news' && (
                    <NewsTab
                        news={news}
                        onRefresh={async () => {
                            try {
                                const response = await fetch('/api/news', {
                                    credentials: 'include',
                                });
                                const result = await response.json();
                                if (result.success) {
                                    setNews(result.data || []);
                                }
                            } catch (error) {
                                console.error('Failed to refresh news:', error);
                            }
                        }}
                    />
                )}

                {activeTab === 'online-courses' && (
                    <OnlineCoursesTab
                        courses={onlineCourses}
                        onRefresh={async () => {
                            try {
                                const response = await fetch('/api/online-courses', {
                                    credentials: 'include',
                                });
                                const result = await response.json();
                                if (result.success) {
                                    setOnlineCourses(result.data || []);
                                }
                            } catch (error) {
                                console.error('Failed to refresh online courses:', error);
                            }
                        }}
                    />
                )}

                {activeTab === 'teachers' && (
                    <TeachersTab
                        teachers={teachers}
                        onRefresh={async () => {
                            try {
                                const response = await fetch('/api/users?role=teacher', {
                                    credentials: 'include',
                                });
                                const result = await response.json();
                                if (result.success && result.data) {
                                    setTeachers(result.data.users || []);
                                }
                            } catch (error) {
                                console.error('Failed to refresh teachers:', error);
                            }
                        }}
                    />
                )}

                {activeTab === 'students' && (
                    <StudentsTab
                        students={students}
                        onRefresh={async () => {
                            try {
                                const response = await fetch('/api/students', {
                                    credentials: 'include',
                                });
                                const result = await response.json();
                                if (result.success && result.data) {
                                    setStudents(result.data.students || []);
                                }
                            } catch (error) {
                                console.error('Failed to refresh students:', error);
                            }
                        }}
                    />
                )}

                {activeTab === 'attendance' && (
                    <AttendanceTab />
                )}

                {activeTab === 'parent-communication' && (
                    <ParentCommunicationTab />
                )}

                {activeTab === 'analytics' && (
                    <AnalyticsTab />
                )}

                {activeTab === 'marketing' && (
                    <MarketingTab />
                )}

                {activeTab === 'settings' && (
                    <AccountSettingsTab />
                )}
            </div>
        </main>
    );
}

