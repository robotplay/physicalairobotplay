'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Phone, Mail, User, MessageSquare, Send, ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import PaymentButton from '@/components/PaymentButton';
import Image from 'next/image';
import Link from 'next/link';

interface EnrollmentData {
    courseId: string;
    courseTitle: string;
    coursePrice: number;
    courseCategory: string;
    courseThumbnail: string;
}

export default function PaymentPage() {
    const router = useRouter();
    const [enrollmentData, setEnrollmentData] = useState<EnrollmentData | null>(null);
    const [formData, setFormData] = useState({
        studentName: '',
        grade: '',
        parentName: '',
        phone: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [registrationId, setRegistrationId] = useState<string | null>(null);
    const [showPayment, setShowPayment] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // localStorage에서 강좌 정보 가져오기
        const stored = localStorage.getItem('enrollmentData');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                setEnrollmentData(data);
            } catch (error) {
                console.error('Failed to parse enrollment data:', error);
                router.push('/#courses');
            }
        } else {
            // 강좌 정보가 없으면 강좌 목록으로 리다이렉트
            router.push('/#courses');
        }
        setIsLoading(false);
    }, [router]);

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
            // 온라인 강좌 신청 API 호출
            const response = await fetch('/api/online-enrollments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    courseId: enrollmentData?.courseId,
                    courseTitle: enrollmentData?.courseTitle,
                }),
            });

            if (!response.ok) {
                throw new Error('신청서 전송 실패');
            }

            const result = await response.json();

            setIsSubmitting(false);
            setSubmitStatus('success');
            setRegistrationId(result.data?.id || result.id);
            setShowPayment(true); // 결제 버튼 표시
        } catch (error) {
            console.error('Failed to submit enrollment:', error);
            setIsSubmitting(false);
            setSubmitStatus('error');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#1A1A1A] text-white">
                <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="text-center py-20">
                            <Loader2 className="w-16 h-16 text-deep-electric-blue animate-spin mx-auto mb-4" />
                            <p className="text-gray-400">로딩 중...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!enrollmentData) {
        return (
            <main className="min-h-screen bg-[#1A1A1A] text-white">
                <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-bold text-white mb-4">강좌 정보를 찾을 수 없습니다</h2>
                            <p className="text-gray-400 mb-8">강좌 상세 페이지에서 다시 신청해주세요.</p>
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

    const grades = [
        { value: '', label: '학년을 선택해주세요' },
        { value: '초3', label: '초등학교 3학년' },
        { value: '초4', label: '초등학교 4학년' },
        { value: '초5', label: '초등학교 5학년' },
        { value: '초6', label: '초등학교 6학년' },
        { value: '중1', label: '중학교 1학년' },
        { value: '중2', label: '중학교 2학년' },
        { value: '중3', label: '중학교 3학년' },
        { value: '고1', label: '고등학교 1학년' },
        { value: '고2', label: '고등학교 2학년' },
        { value: '고3', label: '고등학교 3학년' },
        { value: '성인', label: '성인' },
    ];

    return (
        <main className="min-h-screen bg-[#1A1A1A] text-white">
            <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
                    {/* Back Button */}
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-deep-electric-blue transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>이전 페이지로</span>
                        </button>
                    </div>

                    {/* Course Info Card */}
                    <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
                        <div className="flex gap-4">
                            {enrollmentData.courseThumbnail && (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={enrollmentData.courseThumbnail}
                                        alt={enrollmentData.courseTitle}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-white mb-2">{enrollmentData.courseTitle}</h2>
                                <p className="text-gray-400 mb-4">{enrollmentData.courseCategory}</p>
                                <div className="text-3xl font-bold text-deep-electric-blue">
                                    {enrollmentData.coursePrice === 0 ? '무료' : `₩${formatPrice(enrollmentData.coursePrice)}`}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    {!showPayment ? (
                        <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700">
                            <h3 className="text-2xl font-bold text-white mb-6">강좌 신청서</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            수강생 이름 *
                                        </label>
                                        <input
                                            type="text"
                                            name="studentName"
                                            value={formData.studentName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-deep-electric-blue"
                                            placeholder="수강생 이름을 입력하세요"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            학년 *
                                        </label>
                                        <select
                                            name="grade"
                                            value={formData.grade}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-deep-electric-blue"
                                        >
                                            {grades.map((grade) => (
                                                <option key={grade.value} value={grade.value}>
                                                    {grade.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        보호자 이름 *
                                    </label>
                                    <input
                                        type="text"
                                        name="parentName"
                                        value={formData.parentName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-deep-electric-blue"
                                        placeholder="보호자 이름을 입력하세요"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            연락처 *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-deep-electric-blue"
                                            placeholder="010-1234-5678"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            이메일 *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-deep-electric-blue"
                                            placeholder="example@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                                        <MessageSquare className="w-4 h-4 inline mr-2" />
                                        문의사항 (선택)
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-deep-electric-blue"
                                        placeholder="문의사항이 있으시면 입력해주세요"
                                    />
                                </div>

                                {submitStatus === 'error' && (
                                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                                        <p className="text-red-400 text-sm">신청서 제출에 실패했습니다. 다시 시도해주세요.</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-deep-electric-blue to-active-orange hover:from-blue-700 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            제출 중...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            신청서 제출하기
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* Payment Section */
                        <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700">
                            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                                <p className="text-green-400 text-sm font-semibold mb-2">✅ 신청서가 접수되었습니다!</p>
                                <p className="text-gray-300 text-sm">아래 버튼을 클릭하여 결제를 진행해주세요.</p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white mb-4">결제 정보</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">강좌명</span>
                                        <span className="text-white font-semibold">{enrollmentData.courseTitle}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">결제 금액</span>
                                        <span className="text-2xl font-bold text-deep-electric-blue">
                                            {enrollmentData.coursePrice === 0 ? '무료' : `₩${formatPrice(enrollmentData.coursePrice)}`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <PaymentButton
                                amount={enrollmentData.coursePrice}
                                orderName={enrollmentData.courseTitle}
                                customerName={formData.parentName}
                                customerEmail={formData.email}
                                customerPhone={formData.phone}
                                registrationData={{
                                    ...formData,
                                    courseId: enrollmentData.courseId,
                                    courseTitle: enrollmentData.courseTitle,
                                    registrationId: registrationId,
                                }}
                                onSuccess={(paymentId) => {
                                    console.log('결제 성공:', paymentId);
                                    // 결제 성공 후 강좌 상세 페이지로 리다이렉트
                                    router.push(`/online-courses/${enrollmentData.courseId}?payment=success`);
                                }}
                                onError={(error) => {
                                    console.error('결제 오류:', error);
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

