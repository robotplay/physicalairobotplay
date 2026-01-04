'use client';

import { useEffect } from 'react';
import { CheckCircle, Phone, Mail, Calendar, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';

export default function ThankYouPage() {
    useEffect(() => {
        // Google Analytics 전환 이벤트
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'conversion', {
                'send_to': 'AW-CONVERSION_ID/THANK_YOU_LABEL',
            });
        }

        // Facebook Pixel 전환 이벤트
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Lead');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-3xl w-full">
                {/* Success Message */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-6">
                        <CheckCircle className="w-16 h-16 text-green-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        신청이 완료되었습니다!
                    </h1>
                    <p className="text-xl text-gray-300">
                        곧 담당자가 연락드릴 예정입니다.
                    </p>
                </div>

                {/* Next Steps */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">다음 단계</h2>
                    <div className="space-y-4">
                        {[
                            {
                                icon: Phone,
                                title: '1단계: 담당자 연락',
                                desc: '영업일 기준 24시간 이내에 연락드립니다.',
                            },
                            {
                                icon: Calendar,
                                title: '2단계: 일정 확정',
                                desc: '무료 체험 수업 일정을 조율합니다.',
                            },
                            {
                                icon: CheckCircle,
                                title: '3단계: 체험 수업',
                                desc: '90분 동안 로봇 코딩을 직접 체험합니다.',
                            },
                        ].map((step, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <step.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                                    <p className="text-gray-300">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <a
                        href="tel:1234-5678"
                        className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
                    >
                        <Phone className="w-6 h-6 text-blue-400" />
                        <div>
                            <div className="text-sm text-gray-400">전화 문의</div>
                            <div className="font-semibold text-white">1234-5678</div>
                        </div>
                    </a>
                    <a
                        href="mailto:contact@parplay.co.kr"
                        className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
                    >
                        <Mail className="w-6 h-6 text-purple-400" />
                        <div>
                            <div className="text-sm text-gray-400">이메일 문의</div>
                            <div className="font-semibold text-white">contact@parplay.co.kr</div>
                        </div>
                    </a>
                </div>

                {/* Lead Magnet Offer */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8">
                    <div className="flex items-start gap-4">
                        <Download className="w-12 h-12 text-white flex-shrink-0" />
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                무료 가이드북을 받아보세요!
                            </h3>
                            <p className="text-white/90 mb-4">
                                "우리 아이 로봇 코딩 시작 가이드" PDF를 무료로 다운로드하세요.
                            </p>
                            <Link
                                href="/lead-magnets/robot-coding-guide"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                지금 다운로드
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}

