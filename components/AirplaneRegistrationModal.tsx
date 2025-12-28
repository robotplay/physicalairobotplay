'use client';

import { useState, useEffect } from 'react';
import { X, Phone, Mail, User, MessageSquare, Send, GraduationCap, Calendar, Plane } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';
import PaymentButton from './PaymentButton';

interface AirplaneRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AirplaneRegistrationModal({ isOpen, onClose }: AirplaneRegistrationModalProps) {
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

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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
            // API 호출로 신청서 저장
            const response = await fetch('/api/airplane-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    program: 'airplane-4weeks',
                    programName: '제어 비행기 4주 특강',
                }),
            });

            if (!response.ok) {
                throw new Error('신청서 전송 실패');
            }

            const result = await response.json();

            // 로컬 스토리지에도 저장 (관리자 페이지용)
            const existing = localStorage.getItem('airplane-registrations');
            const registrations = existing ? JSON.parse(existing) : [];
            registrations.push(result.data);
            localStorage.setItem('airplane-registrations', JSON.stringify(registrations));

            // 다른 탭/창에 업데이트 알림
            window.dispatchEvent(new Event('airplane-registration-updated'));

            setIsSubmitting(false);
            setSubmitStatus('success');
            setRegistrationId(result.data.id);
            setShowPayment(true); // 결제 버튼 표시
        } catch (error) {
            console.error('Failed to submit registration:', error);
            setIsSubmitting(false);
            setSubmitStatus('error');
        }
    };

    if (!isOpen) return null;

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
    ];

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative bg-[#1A1A1A] rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all z-10 group border border-gray-700 cursor-pointer"
                    aria-label="모달 닫기"
                >
                    <X className="w-5 h-5 text-gray-300 group-hover:text-white" />
                </button>

                {/* Header */}
                <div className="sticky top-0 bg-[#1A1A1A] border-b border-gray-700 backdrop-blur-md z-20 px-6 sm:px-8 pt-6 pb-4">
                    <ScrollAnimation direction="fade">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00A3FF] to-[#FF4D4D] flex items-center justify-center shadow-lg">
                                <Plane className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                    제어 비행기 4주 특강 신청
                                </h2>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-300">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-sky-400" />
                                <span>2026. 01. 31 (토)</span>
                            </div>
                            <span className="text-gray-600">•</span>
                            <span>선문대학교 (천안/아산)</span>
                        </div>
                    </ScrollAnimation>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-6">
                    {submitStatus === 'success' && showPayment ? (
                        <div className="space-y-6">
                            {/* Success Message */}
                            <div className="text-center py-8">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                    <Send className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    신청이 완료되었습니다!
                                </h3>
                                <p className="text-gray-300 mb-2">
                                    신청서가 접수되었습니다. 아래 버튼을 클릭하여 결제를 진행해주세요.
                                </p>
                                <p className="text-sm text-green-400">
                                    📱 관리자에게 문자 알림이 전송되었습니다.
                                </p>
                            </div>
                            
                            {/* Payment Button */}
                            <div className="pt-4">
                                <PaymentButton
                                    amount={200000} // 20만원 (4주 특강 가격)
                                    orderName="제어 비행기 4주 특강"
                                    customerName={formData.parentName}
                                    customerEmail={formData.email}
                                    customerPhone={formData.phone}
                                    registrationData={{
                                        ...formData,
                                        program: 'airplane-4weeks',
                                        programName: '제어 비행기 4주 특강',
                                        registrationId: registrationId,
                                    }}
                                    onSuccess={(paymentId) => {
                                        console.log('결제 성공:', paymentId);
                                    }}
                                    onError={(error) => {
                                        console.error('결제 오류:', error);
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full mt-3 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all border border-gray-700 hover:border-gray-600 touch-manipulation cursor-pointer"
                                >
                                    나중에 결제하기
                                </button>
                            </div>
                        </div>
                    ) : submitStatus === 'success' ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                <Send className="w-10 h-10 text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                신청이 완료되었습니다!
                            </h3>
                            <p className="text-gray-300 mb-2">
                                신청서가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.
                            </p>
                            <p className="text-sm text-green-400">
                                📱 관리자에게 문자 알림이 전송되었습니다.
                            </p>
                            <p className="text-xs text-gray-400 mt-4">
                                다음 단계: 결제 안내를 위해 곧 연락드리겠습니다.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Student Name */}
                            <div>
                                <label htmlFor="studentName" className="block text-sm font-semibold text-white mb-2">
                                    <User className="w-4 h-4 inline mr-2 text-gray-300" />
                                    학생 이름 *
                                </label>
                                <input
                                    type="text"
                                    id="studentName"
                                    name="studentName"
                                    required
                                    value={formData.studentName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20 transition-all"
                                    placeholder="학생 이름을 입력해주세요"
                                />
                            </div>

                            {/* Grade */}
                            <div>
                                <label htmlFor="grade" className="block text-sm font-semibold text-white mb-2">
                                    <GraduationCap className="w-4 h-4 inline mr-2 text-gray-300" />
                                    학년 *
                                </label>
                                <select
                                    id="grade"
                                    name="grade"
                                    required
                                    value={formData.grade}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20 transition-all appearance-none cursor-pointer"
                                >
                                    {grades.map((grade) => (
                                        <option key={grade.value} value={grade.value} className="bg-gray-800 text-white">
                                            {grade.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Parent Name */}
                            <div>
                                <label htmlFor="parentName" className="block text-sm font-semibold text-white mb-2">
                                    <User className="w-4 h-4 inline mr-2 text-gray-300" />
                                    보호자 이름 *
                                </label>
                                <input
                                    type="text"
                                    id="parentName"
                                    name="parentName"
                                    required
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20 transition-all"
                                    placeholder="보호자 이름을 입력해주세요"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                                    <Phone className="w-4 h-4 inline mr-2 text-gray-300" />
                                    보호자 연락처 *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20 transition-all"
                                    placeholder="010-1234-5678"
                                />
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
                                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20 transition-all"
                                    placeholder="email@example.com"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                                    <MessageSquare className="w-4 h-4 inline mr-2 text-gray-300" />
                                    특이사항 또는 문의사항
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00A3FF] focus:ring-2 focus:ring-[#00A3FF]/20 transition-all resize-none"
                                    placeholder="특이사항이나 문의사항이 있으시면 입력해주세요"
                                />
                            </div>

                            {/* Submit Button or Payment Button */}
                            {showPayment ? (
                                <div className="pt-4">
                                    <div className="mb-4 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                                        <p className="text-green-400 text-sm font-semibold mb-2">✅ 신청서가 접수되었습니다!</p>
                                        <p className="text-gray-300 text-sm">아래 버튼을 클릭하여 결제를 진행해주세요.</p>
                                    </div>
                                    <PaymentButton
                                        amount={200000} // 20만원 (4주 특강 가격)
                                        orderName="제어 비행기 4주 특강"
                                        customerName={formData.parentName}
                                        customerEmail={formData.email}
                                        customerPhone={formData.phone}
                                        registrationData={{
                                            ...formData,
                                            program: 'airplane-4weeks',
                                            programName: '제어 비행기 4주 특강',
                                            registrationId: registrationId,
                                        }}
                                        onSuccess={(paymentId) => {
                                            console.log('결제 성공:', paymentId);
                                        }}
                                        onError={(error) => {
                                            console.error('결제 오류:', error);
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full mt-3 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all border border-gray-700 hover:border-gray-600 touch-manipulation cursor-pointer"
                                    >
                                        나중에 결제하기
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-4 bg-gradient-to-r from-[#00A3FF] to-[#FF4D4D] hover:from-[#0088DD] hover:to-[#FF3333] text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation shadow-lg hover:shadow-xl cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                전송 중...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                신청서 제출하기
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all border border-gray-700 hover:border-gray-600 touch-manipulation cursor-pointer"
                                    >
                                        취소
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}




















