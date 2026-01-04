'use client';

import { useState } from 'react';
import { CheckCircle, Star, Users, Trophy, Clock, ArrowRight, Zap, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function FreeTrialLandingPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        studentName: '',
        grade: '',
        parentName: '',
        phone: '',
        email: '',
        preferredDate: '',
        interests: [] as string[],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Lead 저장
            const leadResponse = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.parentName,
                    email: formData.email,
                    phone: formData.phone,
                    source: 'landing-page',
                    sourceDetail: 'free-trial',
                    interests: formData.interests,
                    metadata: {
                        studentName: formData.studentName,
                        grade: formData.grade,
                        preferredDate: formData.preferredDate,
                    },
                }),
            });

            // 전환 이벤트 추적
            await fetch('/api/conversion-events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventType: 'form-submit',
                    eventName: 'free-trial-signup',
                    source: 'landing-free-trial',
                    metadata: formData,
                }),
            });

            const result = await leadResponse.json();

            if (result.success) {
                // Google Analytics 이벤트
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'conversion', {
                        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                        'event_category': 'Free Trial',
                        'event_label': 'Signup Complete',
                    });
                }

                toast.success('신청이 완료되었습니다! 곧 연락드리겠습니다.');
                router.push('/landing/free-trial/thank-you');
            } else {
                toast.error('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Free trial signup error:', error);
            toast.error('신청 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest],
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-16 px-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
                <div className="relative max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Headline & Benefits */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full mb-6">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm font-semibold text-yellow-400">
                                    선착순 20명 한정! 지금 신청하세요
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                우리 아이 첫 로봇 코딩,
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                    무료로 시작하세요!
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8">
                                10년 경력 전문 강사와 함께하는 90분 무료 체험 수업으로 
                                AI 시대를 이끌 인재의 첫걸음을 시작하세요.
                            </p>

                            {/* Benefits */}
                            <div className="space-y-4 mb-8">
                                {[
                                    '1:4 소규모 맞춤 수업',
                                    '실제 로봇 제작 & 코딩 체험',
                                    '개인별 학습 성향 분석 리포트 제공',
                                    '수강료 10% 할인 쿠폰 증정',
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                        <span className="text-lg text-gray-200">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Trust Indicators */}
                            <div className="grid grid-cols-3 gap-4 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-400 mb-1">500+</div>
                                    <div className="text-sm text-gray-400">수강생</div>
                                </div>
                                <div className="text-center border-x border-white/10">
                                    <div className="text-3xl font-bold text-purple-400 mb-1">98%</div>
                                    <div className="text-sm text-gray-400">만족도</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-400 mb-1">30+</div>
                                    <div className="text-sm text-gray-400">대회 수상</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Application Form */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-yellow-400">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    무료 체험 신청
                                </h2>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* 학생 이름 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        학생 이름 *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.studentName}
                                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                                        placeholder="홍길동"
                                        required
                                    />
                                </div>

                                {/* 학년 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        학년 *
                                    </label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                                        required
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="초1">초등 1학년</option>
                                        <option value="초2">초등 2학년</option>
                                        <option value="초3">초등 3학년</option>
                                        <option value="초4">초등 4학년</option>
                                        <option value="초5">초등 5학년</option>
                                        <option value="초6">초등 6학년</option>
                                        <option value="중1">중등 1학년</option>
                                        <option value="중2">중등 2학년</option>
                                        <option value="중3">중등 3학년</option>
                                    </select>
                                </div>

                                {/* 학부모 이름 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        학부모 이름 *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.parentName}
                                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                                        placeholder="홍길동"
                                        required
                                    />
                                </div>

                                {/* 연락처 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        연락처 *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                                        placeholder="010-1234-5678"
                                        required
                                    />
                                </div>

                                {/* 이메일 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        이메일 *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>

                                {/* 희망 체험일 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        희망 체험일
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.preferredDate}
                                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                {/* 관심 분야 */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        관심 분야 (복수 선택 가능)
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'basic-course', label: '기초 로봇 코딩' },
                                            { value: 'advanced-course', label: '심화 AI 로봇' },
                                            { value: 'competition', label: '대회 준비' },
                                            { value: 'project', label: '프로젝트 제작' },
                                        ].map((interest) => (
                                            <label key={interest.value} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.interests.includes(interest.value)}
                                                    onChange={() => toggleInterest(interest.value)}
                                                    className="w-5 h-5 text-blue-600 rounded"
                                                />
                                                <span className="text-gray-700">{interest.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {isSubmitting ? (
                                        <>처리 중...</>
                                    ) : (
                                        <>
                                            무료 체험 신청하기
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                {/* Trust Badge */}
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-2">
                                    <Shield className="w-4 h-4" />
                                    <span>개인정보는 안전하게 보호됩니다</span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-16 px-4 bg-gray-800/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        이미 많은 학부모님들이 선택하셨습니다
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: '김OO 학부모님',
                                grade: '초등 4학년',
                                content: '무료 체험 후 바로 등록했어요. 선생님이 정말 친절하고 아이가 너무 좋아합니다!',
                                rating: 5,
                            },
                            {
                                name: '이OO 학부모님',
                                grade: '초등 5학년',
                                content: '로봇 만들기부터 코딩까지, 체계적인 커리큘럼에 감동했습니다. 강력 추천!',
                                rating: 5,
                            },
                            {
                                name: '박OO 학부모님',
                                grade: '초등 6학년',
                                content: '대회 준비반 덕분에 전국대회에서 금상을 받았어요. 감사합니다!',
                                rating: 5,
                            },
                        ].map((review, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-200 mb-4 italic">"{review.content}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                                        {review.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">{review.name}</div>
                                        <div className="text-sm text-gray-400">{review.grade}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Urgency Section */}
            <section className="py-16 px-4 bg-gradient-to-r from-yellow-600 to-orange-600">
                <div className="max-w-4xl mx-auto text-center">
                    <Clock className="w-16 h-16 text-white mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        지금 신청하면 특별 혜택을 받으실 수 있습니다!
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        이번 달 무료 체험은 선착순 20명까지만 가능합니다.
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                    >
                        지금 바로 신청하기
                    </button>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 bg-gray-900">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        자주 묻는 질문
                    </h2>

                    <div className="space-y-4">
                        {[
                            {
                                q: '무료 체험은 정말 무료인가요?',
                                a: '네, 100% 무료입니다. 어떠한 비용도 발생하지 않으며, 체험 후 등록 여부를 자유롭게 결정하실 수 있습니다.',
                            },
                            {
                                q: '체험 수업은 얼마나 진행되나요?',
                                a: '90분 동안 진행되며, 로봇 조립부터 간단한 코딩까지 실제 수업과 동일하게 체험하실 수 있습니다.',
                            },
                            {
                                q: '준비물이 필요한가요?',
                                a: '모든 교구와 재료는 저희가 준비합니다. 편안한 마음으로 오시면 됩니다.',
                            },
                            {
                                q: '학부모도 함께 참관할 수 있나요?',
                                a: '네, 가능합니다. 학부모님께서 수업 과정을 직접 보시고 판단하실 수 있도록 참관을 권장드립니다.',
                            },
                        ].map((faq, index) => (
                            <div key={index} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                                <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                                <p className="text-gray-300">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

