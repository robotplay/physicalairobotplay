'use client';

import { useState, useEffect } from 'react';
import { Video, Clock, User, Phone, LogOut, ArrowRight, Calendar, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import ScrollAnimation from '@/components/ScrollAnimation';
import Image from 'next/image';

interface Course {
    id: string;
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    meetingUrl: string;
    platformType: 'zoom' | 'whale';
    schedule: { day: string, time: string }[];
    category: string;
    color: string;
}

export default function MyClassroom() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        // 서버 시간과 동기화하기 위해 1분마다 업데이트
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/online-enrollments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customerName, customerPhone }),
            });

            const result = await response.json();
            if (result.success) {
                setCourses(result.courses);
                setIsLoggedIn(true);
                // 로컬 스토리지에 세션 저장 (선택 사항)
                localStorage.setItem('student-session', JSON.stringify({ customerName, customerPhone }));
            } else {
                setError(result.error || '인증에 실패했습니다. 정보를 확인해주세요.');
            }
        } catch (err) {
            setError('서버 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const session = localStorage.getItem('student-session');
        if (session) {
            const { customerName: name, customerPhone: phone } = JSON.parse(session);
            setCustomerName(name);
            setCustomerPhone(phone);
            // 자동 로그인 시도 가능
        }
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCourses([]);
        localStorage.removeItem('student-session');
    };

    const checkIsActive = (schedule: { day: string, time: string }[]) => {
        if (!currentTime) return { active: false, message: '시간 확인 중...' };
        if (!schedule || schedule.length === 0) return { active: false, message: '수업 일정이 설정되지 않았습니다.' };

        const now = currentTime;
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const currentDay = days[now.getDay()];

        for (const s of schedule) {
            if (s.day === currentDay) {
                const [hour, minute] = s.time.split(':').map(Number);
                const startTime = new Date(now);
                startTime.setHours(hour, minute, 0, 0);

                const diff = (startTime.getTime() - now.getTime()) / (1000 * 60);

                if (diff <= 10 && diff >= -90) { // 수업 10분 전부터 90분 동안 활성화
                    return { active: true, message: '지금 입장 가능합니다!' };
                }
                
                if (diff > 10) {
                    return { active: false, message: `오늘 ${s.time} 수업 (시작 ${Math.floor(diff)}분 전)` };
                }
            }
        }

        return { active: false, message: '현재 수업 시간이 아닙니다.' };
    };

    if (!isLoggedIn) {
        return (
            <main className="min-h-screen bg-[#1A1A1A] pt-32 pb-20 px-4">
                <div className="max-w-md mx-auto">
                    <ScrollAnimation direction="up">
                        <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon-purple/30">
                                    <Video className="w-8 h-8 text-neon-purple" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2">마이 강의실 로그인</h1>
                                <p className="text-gray-400 text-sm">결제 시 입력하신 정보를 입력해주세요</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">수강생/보호자 성함</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={e => setCustomerName(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all outline-none"
                                            placeholder="홍길동"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">전화번호</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={e => setCustomerPhone(e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-neon-purple focus:border-transparent transition-all outline-none"
                                            placeholder="010-1234-5678"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm border border-red-400/20">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-neon-purple to-deep-electric-blue text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '로그인 하기'}
                                </button>
                            </form>
                        </div>
                    </ScrollAnimation>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#1A1A1A] pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-deep-electric-blue">
                                {customerName}님,
                            </span> 반갑습니다! 👋
                        </h1>
                        <p className="text-gray-400">수업 10분 전부터 입장 버튼이 활성화됩니다.</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-all border border-gray-700 self-start md:self-center"
                    >
                        <LogOut className="w-4 h-4" /> 로그아웃
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {courses.length === 0 ? (
                        <div className="md:col-span-2 text-center py-20 bg-gray-800/50 rounded-3xl border border-gray-700/50">
                            <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">수강 중인 온라인 강좌가 없습니다.</h3>
                            <p className="text-gray-500 mt-2">새로운 강좌를 신청해보세요!</p>
                        </div>
                    ) : (
                        courses.map((course) => {
                            const { active, message } = checkIsActive(course.schedule);
                            return (
                                <ScrollAnimation key={course._id} direction="up">
                                    <div className="bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 shadow-xl group hover:border-neon-purple/50 transition-all flex flex-col h-full">
                                        <div className="relative h-48 sm:h-56">
                                            <Image src={course.thumbnail} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent" />
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-3 py-1 bg-gradient-to-r ${course.color} text-white text-xs font-bold rounded-full`}>
                                                    {course.category}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                                            <p className="text-gray-400 text-sm mb-6 flex-1">{course.description}</p>
                                            
                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center gap-3 text-sm text-gray-300 bg-gray-900/50 p-3 rounded-xl">
                                                    <Calendar className="w-4 h-4 text-neon-purple" />
                                                    <span>수업 일정: {course.schedule.map(s => `${s.day} ${s.time}`).join(', ')}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-300 bg-gray-900/50 p-3 rounded-xl">
                                                    <Clock className="w-4 h-4 text-deep-electric-blue" />
                                                    <span className={active ? "text-neon-purple font-bold animate-pulse" : ""}>{message}</span>
                                                </div>
                                            </div>

                                            <button
                                                disabled={!active || !course.meetingUrl}
                                                onClick={() => window.open(course.meetingUrl, '_blank')}
                                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                                                    active && course.meetingUrl
                                                        ? 'bg-gradient-to-r from-neon-purple to-deep-electric-blue text-white shadow-lg hover:shadow-neon-purple/20'
                                                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                }`}
                                            >
                                                {active ? (
                                                    <>
                                                        강의실 입장하기 <ExternalLink className="w-5 h-5" />
                                                    </>
                                                ) : (
                                                    '입장 대기 중'
                                                )}
                                            </button>
                                            {!course.meetingUrl && active && (
                                                <p className="text-xs text-red-400 text-center mt-2">회의 링크가 등록되지 않았습니다. 관리자에게 문의하세요.</p>
                                            )}
                                        </div>
                                    </div>
                                </ScrollAnimation>
                            );
                        })
                    )}
                </div>

                <div className="mt-16 bg-gradient-to-r from-neon-purple/10 to-deep-electric-blue/10 rounded-3xl p-8 border border-white/5 text-center">
                    <Award className="w-12 h-12 text-neon-purple mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">학습 가이드</h3>
                    <p className="text-gray-400 text-sm max-w-2xl mx-auto">
                        수업 전 웨일온 또는 Zoom 앱이 설치되어 있는지 확인해주세요. 실습 키트가 필요한 수업의 경우 미리 준비해주시기 바랍니다.
                    </p>
                </div>
            </div>
        </main>
    );
}

