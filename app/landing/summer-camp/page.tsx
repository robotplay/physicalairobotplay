'use client';

import { useState } from 'react';
import { CheckCircle, Star, Users, Calendar, Clock, ArrowRight, Sun, Code, Award, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SummerCampLandingPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        studentName: '',
        grade: '',
        parentName: '',
        phone: '',
        email: '',
        program: 'basic',
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
                    sourceDetail: 'summer-camp',
                    interests: [formData.program],
                    metadata: {
                        studentName: formData.studentName,
                        grade: formData.grade,
                    },
                }),
            });

            await fetch('/api/conversion-events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventType: 'form-submit',
                    eventName: 'summer-camp-signup',
                    source: 'landing-summer-camp',
                    metadata: formData,
                }),
            });

            toast.success('신청이 완료되었습니다!');
            router.push('/landing/summer-camp/thank-you');
        } catch (error) {
            console.error('Summer camp signup error:', error);
            toast.error('신청 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-900 via-red-900 to-gray-900">
            {/* Hero */}
            <section className="relative overflow-hidden pt-20 pb-16 px-4">
                <div className="relative max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/50 rounded-full mb-6">
                                <Sun className="w-5 h-5 text-orange-400" />
                                <span className="text-sm font-semibold text-orange-400">
                                    2025 여름 특별 프로그램
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                이번 여름,
                                <span className="block text-orange-400">
                                    AI 로봇과 함께!
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8">
                                4주 집중 프로그램으로 로봇 제작부터 AI까지 완성하세요.
                            </p>

                            <div className="space-y-3">
                                {[
                                    '매일 3시간 집중 수업',
                                    '프로젝트 완성 & 발표',
                                    '대회 출전 기회',
                                    '조기 등록 30% 할인',
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-400" />
                                        <span className="text-lg text-gray-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                여름 프로그램 신청
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
                                    <option value="초3">초등 3학년</option>
                                    <option value="초4">초등 4학년</option>
                                    <option value="초5">초등 5학년</option>
                                    <option value="초6">초등 6학년</option>
                                    <option value="중1">중등 1학년</option>
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
                                    value={formData.program}
                                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900"
                                >
                                    <option value="basic">기초 로봇 (4주)</option>
                                    <option value="advanced">심화 AI 로봇 (4주)</option>
                                    <option value="competition">대회 준비 (6주)</option>
                                </select>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-lg rounded-lg hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? '처리 중...' : (
                                        <>
                                            지금 신청하기
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs */}
            <section className="py-16 px-4 bg-gray-800/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">
                        프로그램 소개
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Code,
                                title: '기초 로봇 (4주)',
                                price: '₩480,000',
                                features: ['로봇 조립 기초', '블록 코딩', '센서 활용', '간단한 프로젝트'],
                            },
                            {
                                icon: Award,
                                title: '심화 AI 로봇 (4주)',
                                price: '₩580,000',
                                features: ['AI 이론', '음성인식', '이미지 처리', '실전 프로젝트'],
                            },
                            {
                                icon: Trophy,
                                title: '대회 준비 (6주)',
                                price: '₩720,000',
                                features: ['대회 규정 분석', '팀 프로젝트', '발표 연습', '대회 출전'],
                            },
                        ].map((program, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20">
                                <program.icon className="w-12 h-12 text-orange-400 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">{program.title}</h3>
                                <div className="text-3xl font-bold text-orange-400 mb-4">{program.price}</div>
                                <ul className="space-y-2">
                                    {program.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-gray-300">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-red-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        5월 31일까지 조기 등록 시 30% 할인!
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        선착순 30명까지만 할인 적용됩니다.
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-lg hover:bg-gray-100 shadow-xl"
                    >
                        지금 바로 신청하기
                    </button>
                </div>
            </section>
        </div>
    );
}

