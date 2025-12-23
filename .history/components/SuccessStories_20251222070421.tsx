'use client';

import ScrollAnimation from './ScrollAnimation';
import { Award, Trophy, Star, Target, TrendingUp, Users, Heart } from 'lucide-react';
import Image from 'next/image';

export default function SuccessStories() {
    const achievements = [
        {
            icon: Trophy,
            title: 'IRO 국제로봇올림피아드',
            description: '세계 무대에서 인정받은 실력',
            count: '다수 수상',
            color: 'from-yellow-400 to-orange-500',
        },
        {
            icon: Award,
            title: 'FIRA 로봇월드컵',
            description: '글로벌 경쟁력 입증',
            count: '국제 대회 출전',
            color: 'from-blue-400 to-purple-500',
        },
        {
            icon: Star,
            title: '대통령상 수상',
            description: '최고의 영예',
            count: '2020년',
            color: 'from-red-400 to-pink-500',
        },
        {
            icon: Target,
            title: '전국 대회',
            description: '지속적인 성장',
            count: '연속 수상',
            color: 'from-green-400 to-teal-500',
        },
    ];

    const studentStories = [
        {
            name: '김○○ 학생',
            course: 'Advanced Course',
            achievement: 'IRO 국제로봇올림피아드 금상',
            story: '처음에는 로봇이 어떻게 움직이는지도 몰랐는데, 선생님의 체계적인 교육 덕분에 세계 대회에서 수상할 수 있었습니다. 코딩이 재미있어졌어요!',
            image: '/img/01.jpeg',
            parentQuote: '게임만 하던 아이가 코딩을 하더니 집중력이 달라졌어요. 로봇이 움직일 때마다 환하게 웃는 모습을 보니 정말 다행입니다.',
        },
        {
            name: '이○○ 학생',
            course: 'AirRobot Course',
            achievement: 'FIRA 드론 경진대회 우수상',
            story: '드론을 직접 제어하고 비행시키는 것이 정말 신기했습니다. 항공 역학을 배우면서 과학에 대한 관심이 커졌어요.',
            image: '/img/02.jpeg',
            parentQuote: 'IRO 대회에서 수상한 후 아이의 눈이 달라졌어요. "엄마, 나도 할 수 있어!"라는 자신감이 생긴 게 가장 큰 변화입니다.',
        },
        {
            name: '박○○ 학생',
            course: 'Basic Course → Advanced Course',
            achievement: '전국 청소년 로봇올림피아드 대상',
            story: 'Basic Course부터 시작해서 Advanced Course까지 수강했습니다. 단계별로 배우니까 이해가 잘 되고, 프로젝트를 완성할 때마다 뿌듯했어요.',
            image: '/img/03.jpeg',
            parentQuote: '드론 수업이 위험하지 않을까 걱정했는데, 안전 가드와 체계적인 교육으로 안심하고 보낼 수 있었어요. 아이도 너무 좋아합니다.',
        },
    ];

    return (
        <section id="success" className="section-padding bg-[#1A1A1A]">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-active-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-10 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-active-orange/10 rounded-full border border-active-orange/20 mb-4 sm:mb-6">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-active-orange animate-pulse" aria-hidden="true" />
                            <span className="text-xs sm:text-sm text-active-orange font-semibold">SUCCESS STORIES</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                            아이들의 성공이<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep-electric-blue via-active-orange to-neon-purple">
                                우리의 자랑입니다
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-300">
                            세계 무대에서 인정받은 우리 학생들의 성과를 소개합니다
                        </p>
                    </div>
                </ScrollAnimation>

                {/* Achievements Grid */}
                <ScrollAnimation direction="fade" delay={100}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
                        {achievements.map((achievement, index) => {
                            const Icon = achievement.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700 hover:border-deep-electric-blue/50"
                                >
                                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${achievement.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-deep-electric-blue transition-colors">
                                        {achievement.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-300 mb-2">
                                        {achievement.description}
                                    </p>
                                    <p className="text-xs sm:text-sm font-semibold text-active-orange">
                                        {achievement.count}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </ScrollAnimation>

                {/* Student Stories */}
                <ScrollAnimation direction="fade" delay={200}>
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-deep-electric-blue/10 rounded-full border border-deep-electric-blue/20 mb-4">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-deep-electric-blue" aria-hidden="true" />
                            <span className="text-xs sm:text-sm text-deep-electric-blue font-semibold">STUDENT TESTIMONIALS</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                            학생들의 생생한 후기
                        </h3>
                    </div>
                </ScrollAnimation>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {studentStories.map((story, index) => (
                        <ScrollAnimation key={index} direction="up" delay={index * 150}>
                            <div className="group relative bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700">
                                {/* Image */}
                                <div className="relative h-48 sm:h-56 overflow-hidden">
                                    <Image
                                        src={story.image}
                                        alt={`${story.name}의 성공 사례`}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        quality={85}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                                            <TrendingUp className="w-4 h-4 text-white" aria-hidden="true" />
                                            <span className="text-xs sm:text-sm text-white font-semibold">{story.achievement}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 sm:p-8">
                                    <div className="mb-4">
                                        <h4 className="text-xl sm:text-2xl font-bold text-white">
                                            {story.name}
                                        </h4>
                                        <p className="text-sm sm:text-base text-deep-electric-blue font-semibold">
                                            {story.course}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-sm sm:text-base text-gray-300 italic">
                                            "{story.story}"
                                        </p>
                                    </div>
                                    {story.parentQuote && (
                                        <div className="border-t border-gray-700 pt-4 mt-4">
                                            <div className="flex items-start gap-2">
                                                <Heart className="w-4 h-4 text-pink-500 flex-shrink-0 mt-1" />
                                                <div>
                                                    <div className="text-xs text-gray-400 mb-1">학부모님 후기</div>
                                                    <p className="text-xs sm:text-sm text-gray-300">
                                                        "{story.parentQuote}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    );
}

