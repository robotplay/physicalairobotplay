'use client';

import ScrollAnimation from './ScrollAnimation';
import { Shield, AlertCircle, CheckCircle, HelpCircle, Lock, Users } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
    icon: typeof Shield;
}

export default function SafetyFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs: FAQItem[] = [
        {
            icon: Shield,
            question: '드론 수업, 위험하지 않나요?',
            answer: '네, 안전이 최우선입니다. 모든 드론에는 보호 가드가 장착되어 있으며, 초기에는 시뮬레이터로 충분히 연습한 후 실제 비행을 진행합니다. 실내에서만 수업이 진행되며, 강사 1명당 학생 4명 이하로 소규모 그룹 수업을 진행하여 안전을 보장합니다.',
        },
        {
            icon: Lock,
            question: '사용하는 장비와 소재는 안전한가요?',
            answer: '모든 로봇 키트와 부품은 CE 인증을 받은 안전한 제품만 사용합니다. 작은 부품이 포함된 경우 연령에 맞는 안내를 드리며, 수업 중에는 강사가 직접 지도합니다. 화학 물질이나 위험한 도구는 사용하지 않습니다.',
        },
        {
            icon: Users,
            question: '수업 환경은 쾌적한가요?',
            answer: '넓고 밝은 교실에서 충분한 환기와 적절한 온도를 유지합니다. 각 학생에게 충분한 작업 공간을 제공하며, 정기적으로 소독과 청소를 진행합니다. 화재 안전 시설도 완비되어 있습니다.',
        },
        {
            icon: CheckCircle,
            question: '사고 발생 시 보험은 있나요?',
            answer: '네, 모든 수강생은 실내외 활동 보험에 가입되어 있습니다. 또한 학원 자체 배상책임보험도 보유하고 있어 안심하고 수업에 참여하실 수 있습니다.',
        },
        {
            icon: AlertCircle,
            question: '코로나19 등 감염병 예방 조치는?',
            answer: '체온 측정, 손 소독, 마스크 착용 등 기본 방역 수칙을 철저히 준수합니다. 수업 전후 교실 소독을 진행하며, 학생 간 거리두기를 유지합니다. 발열이나 호흡기 증상이 있는 경우 수업 참여를 제한합니다.',
        },
        {
            icon: HelpCircle,
            question: '초등학생도 안전하게 수업받을 수 있나요?',
            answer: '물론입니다. 초등학생을 위한 별도 커리큘럼이 있으며, 모든 수업은 연령대에 맞게 조정됩니다. 작은 부품 사용 시 보호자 동의를 받고, 강사가 직접 지도합니다. 초등 저학년의 경우 보호자 동반 수업도 가능합니다.',
        },
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="safety" className="py-12 sm:py-16 md:py-20 bg-[#1A1A1A] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20 mb-4 sm:mb-6">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 animate-pulse" />
                            <span className="text-xs sm:text-sm text-green-500 font-semibold">SAFETY & SECURITY</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                            안전이 최우선입니다
                        </h2>
                        <p className="text-base sm:text-lg text-gray-300 mt-4 sm:mt-6">
                            학부모님들이 가장 걱정하시는 안전 문제에 대한<br />
                            <strong className="text-green-500">명확한 답변</strong>을 드립니다.
                        </p>
                    </div>
                </ScrollAnimation>

                <div className="space-y-4 sm:space-y-6">
                    {faqs.map((faq, index) => {
                        const Icon = faq.icon;
                        const isOpen = openIndex === index;
                        
                        return (
                            <ScrollAnimation key={index} direction="up" delay={index * 100}>
                                <div className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-green-500/50 transition-all duration-300">
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full p-6 sm:p-8 text-left flex items-start gap-4 sm:gap-6 hover:bg-gray-750 transition-colors cursor-pointer"
                                    >
                                        <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-green-500 transition-colors">
                                                {faq.question}
                                            </h3>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ${
                                                    isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                                                }`}
                                            >
                                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`flex-shrink-0 text-green-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </ScrollAnimation>
                        );
                    })}
                </div>

                {/* Additional Safety Info */}
                <ScrollAnimation direction="fade" delay={400}>
                    <div className="mt-12 sm:mt-16 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-3xl p-8 sm:p-12 border border-green-500/20">
                        <div className="text-center">
                            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-6 sm:mb-8" />
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                                안전한 교육 환경을 약속합니다
                            </h3>
                            <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10">
                                PAR Play는 단순한 학원이 아닙니다.<br />
                                <strong className="text-green-500">아이들의 안전과 건강</strong>을 최우선으로 생각하는 교육 공간입니다.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                {[
                                    { label: '안전 인증 장비', value: '100%' },
                                    { label: '보험 가입률', value: '100%' },
                                    { label: '안전 사고', value: '0건' },
                                ].map((item, index) => (
                                    <div key={index} className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700">
                                        <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">
                                            {item.value}
                                        </div>
                                        <div className="text-sm sm:text-base text-gray-300">
                                            {item.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
