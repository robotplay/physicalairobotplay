'use client';

import { useState, useEffect } from 'react';
import { X, Phone, Mail, User, MessageSquare, Send } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';
import { trackConsultation } from '@/lib/analytics';

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        course: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
            // API 호출로 상담 문의 저장 및 문자 전송
            const response = await fetch('/api/consultations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
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
            trackConsultation('submit', 'modal');
            
            // 3초 후 폼 초기화 및 모달 닫기
            setTimeout(() => {
                setFormData({ name: '', phone: '', email: '', course: '', message: '' });
                setSubmitStatus('idle');
                onClose();
            }, 3000);
        } catch (error) {
            console.error('Failed to save consultation:', error);
            setIsSubmitting(false);
            setSubmitStatus('error');
        }
    };

    if (!isOpen) return null;

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
                            <div className="w-12 h-12 rounded-xl bg-active-orange flex items-center justify-center shadow-lg">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                                    상담 문의하기
                                </h2>
                            </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            궁금한 점이 있으시면 언제든지 문의해주세요. 빠르게 답변드리겠습니다.
                        </p>
                    </ScrollAnimation>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-6">
                    {submitStatus === 'success' ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                <Send className="w-10 h-10 text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                문의가 접수되었습니다!
                            </h3>
                            <p className="text-gray-300 mb-2">
                                빠른 시일 내에 연락드리겠습니다.
                            </p>
                            <p className="text-sm text-green-400">
                                📱 관리자에게 문자 알림이 전송되었습니다.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                                    <User className="w-4 h-4 inline mr-2 text-gray-300" />
                                    이름 *
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
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                                    <Mail className="w-4 h-4 inline mr-2 text-gray-300" />
                                    이메일
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
                            </div>

                            {/* Course Selection */}
                            <div>
                                <label htmlFor="course" className="block text-sm font-semibold text-white mb-2">
                                    관심 과정
                                </label>
                                <select
                                    id="course"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-active-orange focus:ring-2 focus:ring-active-orange/20 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-gray-800 text-gray-300">과정을 선택해주세요</option>
                                    <option value="basic" className="bg-gray-800 text-white">Basic Course</option>
                                    <option value="advanced" className="bg-gray-800 text-white">Advanced Course</option>
                                    <option value="airrobot" className="bg-gray-800 text-white">AirRobot Course</option>
                                    <option value="all" className="bg-gray-800 text-white">전체 과정</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                                    문의 내용 *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800/50 text-white placeholder:text-gray-500 focus:outline-none focus:border-active-orange focus:ring-2 focus:ring-active-orange/20 transition-all resize-none"
                                    placeholder="문의하실 내용을 입력해주세요"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-4 bg-gradient-to-r from-deep-electric-blue to-active-orange hover:from-blue-700 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation shadow-lg hover:shadow-xl cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            전송 중...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            문의하기
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
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

