'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Phone, Mail, User, MessageSquare, Send, CheckCircle, Clock, Award, Users, BookOpen, Sparkles } from 'lucide-react';
import { trackConsultation } from '@/lib/analytics';
import ScrollAnimation from '@/components/ScrollAnimation';

function ConsultationPageContent() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        course: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [utmSource, setUtmSource] = useState<string | null>(null);

    // URL 파라미터에서 광고 추적 정보 가져오기
    useEffect(() => {
        const source = searchParams.get('utm_source') || searchParams.get('source') || null;
        setUtmSource(source);
        
        // 상담 페이지 접근 추적
        trackConsultation('open', source || 'direct');
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // UTM 소스 정보를 메시지에 추가
            const messageWithSource = utmSource 
                ? `${formData.message}\n\n[광고 유입: ${utmSource}]`
                : formData.message;

            const response = await fetch('/api/consultations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    message: messageWithSource,
                }),
            });

            if (!response.ok) {
                throw new Error('상담 문의 전송 실패');
            }

            const result = await response.json();
            const consultationData = result.data;

            // 로컬 스토리지에도 저장 (관리자 페이지용)
            const existing = localStorage.getItem('consultations');
            const consultations = existing ? JSON.parse(existing) : [];
            
            consultations.push(consultationData);
            localStorage.setItem('consultations', JSON.stringify(consultations));

            // 다른 탭/창에 업데이트 알림
            window.dispatchEvent(new Event('consultation-updated'));

            setIsSubmitting(false);
            setSubmitStatus('success');
            
            // Track successful consultation submission
            trackConsultation('submit', utmSource || 'consultation-page');
            
            // 5초 후 폼 초기화
            setTimeout(() => {
                setFormData({ name: '', phone: '', email: '', course: '', message: '' });
                setSubmitStatus('idle');
            }, 5000);
        } catch (error) {
            console.error('Failed to save consultation:', error);
            setIsSubmitting(false);
            setSubmitStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] via-[#1F1F1F] to-[#1A1A1A] text-white">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 px-4 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-deep-electric-blue/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-active-orange/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center">
                    <ScrollAnimation direction="fade">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-active-orange/10 border border-active-orange/30 mb-6">
                            <Sparkles className="w-4 h-4 text-active-orange" />
                            <span className="text-sm font-semibold text-active-orange">무료 상담 예약</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-humanoid-white via-active-orange to-deep-electric-blue">
                                아이의 미래를 위한
                            </span>
                            <span className="block mt-2">첫 번째 상담</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            전문 상담사와 함께 아이에게 맞는 교육 과정을 찾아보세요.<br />
                            <span className="text-active-orange font-semibold">무료 상담</span>으로 시작하세요.
                        </p>
                    </ScrollAnimation>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 px-4 bg-[#1F1F1F]/50">
                <div className="max-w-6xl mx-auto">
                    <ScrollAnimation direction="fade">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                            왜 피지컬 AI를 선택해야 할까요?
                        </h2>
                    </ScrollAnimation>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: Award,
                                title: '국제 대회 수상',
                                description: 'IRO, FIRA 등 국제 대회에서 우수한 성과',
                            },
                            {
                                icon: Users,
                                title: '전문 강사진',
                                description: '경험이 풍부한 전문 강사들의 체계적 교육',
                            },
                            {
                                icon: BookOpen,
                                title: '체계적 커리큘럼',
                                description: 'Basic부터 Advanced까지 단계별 학습',
                            },
                            {
                                icon: Clock,
                                title: '빠른 상담 응답',
                                description: '24시간 이내 전문 상담사 연락',
                            },
                        ].map((benefit, index) => (
                            <ScrollAnimation key={index} direction="fade" delay={index * 100}>
                                <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 hover:border-active-orange/50 transition-all hover:transform hover:scale-105">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-deep-electric-blue to-active-orange flex items-center justify-center mb-4">
                                        <benefit.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                                </div>
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </section>

            {/* Consultation Form Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <ScrollAnimation direction="fade">
                        <div className="bg-[#1A1A1A] rounded-3xl p-8 md:p-12 border border-gray-800 shadow-2xl">
                            {submitStatus === 'success' ? (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                        <CheckCircle className="w-12 h-12 text-green-400" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4">
                                        상담 예약이 완료되었습니다! 🎉
                                    </h3>
                                    <p className="text-gray-300 mb-2 text-lg">
                                        빠른 시일 내에 전문 상담사가 연락드리겠습니다.
                                    </p>
                                    <p className="text-sm text-green-400 mt-4">
                                        📱 관리자에게 문자 알림이 전송되었습니다.
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        평일 기준 24시간 이내 연락드립니다.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-8">
                                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                            무료 상담 신청하기
                                        </h2>
                                        <p className="text-gray-400 text-lg">
                                            아래 양식을 작성해주시면 전문 상담사가 빠르게 연락드립니다.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Name */}
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                                                <User className="w-4 h-4 inline mr-2 text-gray-300" />
                                                보호자 이름 *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:border-active-orange focus:ring-2 focus:ring-active-orange/20 transition-all"
                                                placeholder="이름을 입력해주세요"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                                                <Phone className="w-4 h-4 inline mr-2 text-gray-300" />
                                                연락처 *
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:border-active-orange focus:ring-2 focus:ring-active-orange/20 transition-all"
                                                placeholder="010-1234-5678"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">상담사가 연락드릴 번호입니다</p>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                                                <Mail className="w-4 h-4 inline mr-2 text-gray-300" />
                                                이메일 (선택)
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:border-active-orange focus:ring-2 focus:ring-active-orange/20 transition-all"
                                                placeholder="email@example.com"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">상담 확인 이메일을 받으실 수 있습니다</p>
                                        </div>

                                        {/* Course Selection */}
                                        <div>
                                            <label htmlFor="course" className="block text-sm font-semibold text-white mb-2">
                                                관심 과정 (선택)
                                            </label>
                                            <select
                                                id="course"
                                                name="course"
                                                value={formData.course}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-active-orange focus:ring-2 focus:ring-active-orange/20 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-gray-800 text-gray-300">과정을 선택해주세요</option>
                                                <option value="basic" className="bg-gray-800 text-white">Basic Course - 기초 과정</option>
                                                <option value="advanced" className="bg-gray-800 text-white">Advanced Course - 고급 과정</option>
                                                <option value="airrobot" className="bg-gray-800 text-white">AirRobot Course - 드론 과정</option>
                                                <option value="all" className="bg-gray-800 text-white">전체 과정 상담</option>
                                            </select>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                                                <MessageSquare className="w-4 h-4 inline mr-2 text-gray-300" />
                                                문의 내용 *
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                required
                                                rows={6}
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:border-active-orange focus:ring-2 focus:ring-active-orange/20 transition-all resize-none"
                                                placeholder="예: 아이의 나이, 관심사, 궁금한 점 등을 자유롭게 작성해주세요"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="pt-6">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full px-8 py-4 bg-gradient-to-r from-deep-electric-blue to-active-orange hover:from-blue-700 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-lg"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        전송 중...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5" />
                                                        무료 상담 신청하기
                                                    </>
                                                )}
                                            </button>
                                            {submitStatus === 'error' && (
                                                <p className="text-red-400 text-sm mt-2 text-center">
                                                    전송 중 오류가 발생했습니다. 다시 시도해주세요.
                                                </p>
                                            )}
                                        </div>
                                    </form>

                                    {/* Trust Indicators */}
                                    <div className="mt-8 pt-8 border-t border-gray-800">
                                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span>무료 상담</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span>24시간 이내 응답</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                                <span>개인정보 보호</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="py-16 px-4 bg-[#1F1F1F]/50">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollAnimation direction="fade">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">다른 방법으로 문의하기</h2>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <a
                                href="tel:010-0000-0000"
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-[#1A1A1A] rounded-xl border border-gray-800 hover:border-active-orange transition-all hover:transform hover:scale-105"
                            >
                                <Phone className="w-5 h-5 text-active-orange" />
                                <span className="font-semibold">전화 상담</span>
                            </a>
                            <a
                                href="https://pf.kakao.com/_RuUyn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-[#1A1A1A] rounded-xl border border-gray-800 hover:border-active-orange transition-all hover:transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FEE500">
                                    <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
                                </svg>
                                <span className="font-semibold">카카오톡 채널</span>
                            </a>
                        </div>
                    </ScrollAnimation>
                </div>
            </section>
        </div>
    );
}

export default function ConsultationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-b from-[#1A1A1A] via-[#1F1F1F] to-[#1A1A1A] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-active-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">페이지를 불러오는 중...</p>
                </div>
            </div>
        }>
            <ConsultationPageContent />
        </Suspense>
    );
}

