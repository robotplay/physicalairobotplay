'use client';

import ScrollAnimation from './ScrollAnimation';
import { Heart, Award, Target, TrendingUp, Sparkles, Users } from 'lucide-react';
import Image from 'next/image';

export default function MomsView() {
    const benefits = [
        {
            icon: Target,
            techTerm: 'Python/C++',
            benefit: '논리적 사고력과 문제 해결 능력을 키워주는 언어',
            description: '단순히 코딩을 배우는 것이 아니라, 복잡한 문제를 단계별로 분석하고 해결하는 사고력을 기릅니다. 이는 수학, 과학뿐만 아니라 모든 과목과 일상생활에서도 도움이 됩니다.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: Award,
            techTerm: '자율주행/비전인식',
            benefit: '미래 AI 시대를 리드할 핵심 소양',
            description: '로봇이 스스로 판단하고 움직이는 원리를 배우며, 미래 직업에 필요한 AI·로봇 기술의 기초를 다집니다. 단순 사용자가 아닌 창조자가 됩니다.',
            color: 'from-purple-500 to-pink-500',
        },
        {
            icon: TrendingUp,
            techTerm: '대회 수상',
            benefit: '아이의 자존감을 높이고 입시 포트폴리오 완성',
            description: '국제 대회에서의 성과는 아이에게 자신감을 주고, 대학 입시와 진로 선택에 실질적인 도움이 됩니다. 단순 성적이 아닌, 실력과 열정을 증명하는 기회입니다.',
            color: 'from-orange-500 to-red-500',
        },
        {
            icon: Sparkles,
            techTerm: '창의적 프로젝트',
            benefit: '상상력이 현실이 되는 경험',
            description: '아이의 아이디어가 실제로 작동하는 로봇이 되는 과정에서 성취감과 자신감을 얻습니다. 게임이나 유튜브가 아닌, 스스로 만든 작품에 자랑스러워하는 아이를 보게 됩니다.',
            color: 'from-green-500 to-teal-500',
        },
    ];

    const parentTestimonials = [
        {
            name: '김○○ 학부모',
            child: '초등학교 5학년',
            course: 'Basic Course',
            quote: '게임만 하던 아이가 코딩을 하더니 집중력이 달라졌어요. 로봇이 움직일 때마다 환하게 웃는 모습을 보니 정말 다행입니다.',
            image: '/img/01.jpeg',
        },
        {
            name: '이○○ 학부모',
            child: '중학교 2학년',
            course: 'Advanced Course',
            quote: 'IRO 대회에서 수상한 후 아이의 눈이 달라졌어요. "엄마, 나도 할 수 있어!"라는 자신감이 생긴 게 가장 큰 변화입니다.',
            image: '/img/02.jpeg',
        },
        {
            name: '박○○ 학부모',
            child: '초등학교 4학년',
            course: 'AirRobot Course',
            quote: '드론 수업이 위험하지 않을까 걱정했는데, 안전 가드와 체계적인 교육으로 안심하고 보낼 수 있었어요. 아이도 너무 좋아합니다.',
            image: '/img/03.jpeg',
        },
    ];

    return (
        <section id="moms-view" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#1A1A1A] to-gray-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 right-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                {/* Hero Section */}
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-12 sm:mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full border border-pink-500/20 mb-4 sm:mb-6">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 animate-pulse" />
                            <span className="text-xs sm:text-sm text-pink-500 font-semibold">MOM'S VIEW</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                            왜 PAR Play를<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
                                선택해야 할까요?
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-300 mt-4 sm:mt-6">
                            기술 용어가 아닌, <strong className="text-pink-500">"우리 아이가 어떻게 변하는지"</strong>를 먼저 보여드립니다.
                        </p>
                    </div>
                </ScrollAnimation>

                {/* Benefits Grid */}
                <ScrollAnimation direction="fade" delay={100}>
                    <div className="mb-12 sm:mb-16 md:mb-20">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
                            기술이 아닌 <span className="text-pink-500">혜택</span>을 드립니다
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <ScrollAnimation
                                        key={index}
                                        direction="up"
                                        delay={index * 150}
                                    >
                                        <div className="group relative bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700 hover:border-pink-500/50">
                                            {/* Animated background blob */}
                                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${benefit.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-all duration-700 group-hover:scale-150 group-hover:opacity-20`}></div>
                                            
                                            <div className="relative z-10">
                                                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                                </div>
                                                <div className="mb-3">
                                                    <span className="text-xs sm:text-sm text-gray-400 font-semibold uppercase tracking-wider">
                                                        {benefit.techTerm}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-pink-500 transition-colors">
                                                    {benefit.benefit}
                                                </h4>
                                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                                                    {benefit.description}
                                                </p>
                                            </div>
                                        </div>
                                    </ScrollAnimation>
                                );
                            })}
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Parent Testimonials */}
                <ScrollAnimation direction="fade" delay={200}>
                    <div className="mb-8 sm:mb-12">
                        <div className="text-center mb-8 sm:mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 mb-4">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                                <span className="text-xs sm:text-sm text-purple-500 font-semibold">PARENT TESTIMONIALS</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                학부모님들의 <span className="text-purple-500">생생한 후기</span>
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {parentTestimonials.map((testimonial, index) => (
                                <ScrollAnimation key={index} direction="up" delay={index * 150}>
                                    <div className="group relative bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700">
                                        {/* Image */}
                                        <div className="relative h-48 sm:h-56 overflow-hidden">
                                            <Image
                                                src={testimonial.image}
                                                alt={`${testimonial.name}의 후기`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                quality={85}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 sm:p-8">
                                            <div className="mb-4">
                                                <h4 className="text-lg sm:text-xl font-bold text-white">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-purple-500 font-semibold">
                                                    {testimonial.child} · {testimonial.course}
                                                </p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -top-2 -left-2 text-4xl text-pink-500/20 font-serif">"</div>
                                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed relative z-10">
                                                    {testimonial.quote}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </ScrollAnimation>

                {/* Call to Action */}
                <ScrollAnimation direction="fade" delay={300}>
                    <div className="relative bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl p-8 sm:p-12 md:p-16 border border-pink-500/20">
                        <div className="text-center max-w-4xl mx-auto">
                            <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-pink-500 mx-auto mb-6 sm:mb-8" />
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                                우리 아이의 변화를<br />
                                직접 확인해보세요
                            </h3>
                            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10">
                                기술 용어보다 중요한 것은 <strong className="text-pink-500">아이의 성장</strong>입니다.<br />
                                PAR Play는 아이의 잠재력을 이끌어내는 교육을 약속합니다.
                            </p>
                            <a
                                href="#consultation"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-base sm:text-lg"
                            >
                                <Heart className="w-5 h-5" />
                                무료 상담 신청하기
                            </a>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}
