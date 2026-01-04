'use client';

import { useState } from 'react';
import { CheckCircle, Trophy, Target, Users, Clock, ArrowRight, Award, Medal } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CompetitionPrepLandingPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        studentName: '',
        grade: '',
        parentName: '',
        phone: '',
        email: '',
        experience: '',
        targetCompetition: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.parentName,
                    email: formData.email,
                    phone: formData.phone,
                    source: 'landing-page',
                    sourceDetail: 'competition-prep',
                    interests: ['competition'],
                    metadata: {
                        studentName: formData.studentName,
                        grade: formData.grade,
                        experience: formData.experience,
                        targetCompetition: formData.targetCompetition,
                    },
                }),
            });

            await fetch('/api/conversion-events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventType: 'form-submit',
                    eventName: 'competition-prep-signup',
                    source: 'landing-competition-prep',
                    metadata: formData,
                }),
            });

            toast.success('신청이 완료되었습니다!');
            router.push('/landing/competition-prep/thank-you');
        } catch (error) {
            console.error('Competition prep signup error:', error);
            toast.error('신청 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-gray-900">
            {/* Hero */}
            <section className="relative overflow-hidden pt-20 pb-16 px-4">
                <div className="relative max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full mb-6">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm font-semibold text-yellow-400">
                                    대회 수상 특화 프로그램
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                대회 금상,
                                <span className="block text-yellow-400">
                                    우리가 책임집니다!
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8">
                                전국/국제 로봇 대회 금상 30회 이상! 검증된 노하우로 수상을 보장합니다.
                            </p>

                            <div className="space-y-3">
                                {[
                                    '대회별 맞춤 전략 수립',
                                    '1:2 소수 정예 코칭',
                                    '실전 모의 대회 3회 이상',
                                    '수상 시까지 무료 연장 지도',
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                        <span className="text-lg text-gray-200">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-yellow-400 mb-1">30+</div>
                                    <div className="text-sm text-gray-400">금상 수상</div>
                                </div>
                                <div className="text-center border-x border-white/10">
                                    <div className="text-3xl font-bold text-purple-400 mb-1">95%</div>
                                    <div className="text-sm text-gray-400">입상률</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-400 mb-1">100+</div>
                                    <div className="text-sm text-gray-400">수강생</div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                대회 준비반 신청
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="학생 이름"
                                    value={formData.studentName}
                                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                                    required
                                />

                                <select
                                    value={formData.grade}
                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                                    required
                                >
                                    <option value="">학년 선택</option>
                                    <option value="초4">초등 4학년</option>
                                    <option value="초5">초등 5학년</option>
                                    <option value="초6">초등 6학년</option>
                                    <option value="중1">중등 1학년</option>
                                    <option value="중2">중등 2학년</option>
                                    <option value="중3">중등 3학년</option>
                                </select>

                                <input
                                    type="text"
                                    placeholder="학부모 이름"
                                    value={formData.parentName}
                                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                                    required
                                />

                                <input
                                    type="tel"
                                    placeholder="연락처"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                                    required
                                />

                                <input
                                    type="email"
                                    placeholder="이메일"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                                    required
                                />

                                <select
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                                    required
                                >
                                    <option value="">로봇 경험</option>
                                    <option value="beginner">초보 (6개월 미만)</option>
                                    <option value="intermediate">중급 (6개월-1년)</option>
                                    <option value="advanced">고급 (1년 이상)</option>
                                </select>

                                <select
                                    value={formData.targetCompetition}
                                    onChange={(e) => setFormData({ ...formData, targetCompetition: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                                >
                                    <option value="">목표 대회</option>
                                    <option value="wro">WRO 세계로봇대회</option>
                                    <option value="fll">FLL 퍼스트레고리그</option>
                                    <option value="krc">한국로봇경진대회</option>
                                    <option value="other">기타 대회</option>
                                </select>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? '처리 중...' : (
                                        <>
                                            상담 신청하기
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="py-16 px-4 bg-gray-800/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        우리의 성과
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { icon: Award, label: 'WRO 국제대회', count: '금상 5회' },
                            { icon: Medal, label: 'FLL 전국대회', count: '금상 8회' },
                            { icon: Trophy, label: '한국로봇대회', count: '금상 12회' },
                            { icon: Target, label: '지역 대회', count: '금상 15회' },
                        ].map((achievement, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 text-center">
                                <achievement.icon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                                <div className="text-sm text-gray-400 mb-1">{achievement.label}</div>
                                <div className="text-2xl font-bold text-white">{achievement.count}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-indigo-600">
                <div className="max-w-4xl mx-auto text-center">
                    <Trophy className="w-16 h-16 text-white mx-auto mb-4" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        다음 금상 수상의 주인공은 당신입니다!
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        지금 바로 상담 신청하고 대회 준비를 시작하세요.
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-lg hover:bg-gray-100 shadow-xl"
                    >
                        지금 바로 신청하기
                    </button>
                </div>
            </section>
        </div>
    );
}

