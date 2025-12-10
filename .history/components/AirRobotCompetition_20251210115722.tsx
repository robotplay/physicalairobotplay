'use client';

import ScrollAnimation from './ScrollAnimation';
import { Trophy, Globe, Award, Target } from 'lucide-react';
import Image from 'next/image';

export default function AirRobotCompetition() {
    const achievements = [
        {
            icon: Globe,
            title: 'IRO 로봇올림피아드',
            description: '호주 세계대회 시범종목 진행',
            badge: 'Global',
            acronym: 'IRO',
        },
        {
            icon: Trophy,
            title: '에어로봇 종목',
            description: '대회 규정에 맞춘 실전 훈련',
            badge: 'Competition',
        },
        {
            icon: Award,
            title: '과학고/공대 진로',
            description: '입시 및 진로와 연결된 전문 과정',
            badge: 'Career',
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-[#0A1931] via-[#0F1B3A] to-[#0A1931] relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(135, 206, 235, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(135, 206, 235, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <Trophy className="w-6 h-6 text-sky-400" />
                            <h2 className="text-sky-400 font-bold tracking-wider">GLOBAL CHALLENGER</h2>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            글로벌 챌린지
                        </h3>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            IRO 로봇올림피아드 호주 세계대회 시범종목 진행 사실을 통해 공신력을 높입니다.
                        </p>
                    </div>
                </ScrollAnimation>

                {/* Achievements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
                    {achievements.map((achievement, index) => {
                        const Icon = achievement.icon;
                        return (
                            <ScrollAnimation
                                key={index}
                                direction="up"
                                delay={index * 150}
                            >
                                <div className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-sky-400/50 transition-all duration-300 hover:-translate-y-2">
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 bg-sky-500/20 text-sky-400 text-xs font-bold rounded-full border border-sky-500/30">
                                            {achievement.badge}
                                        </span>
                                    </div>

                                    {achievement.acronym ? (
                                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all shadow-lg">
                                            <span className="text-2xl font-black text-white">
                                                {achievement.acronym}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                    )}

                                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                                        {achievement.title}
                                    </h4>
                                    
                                    <p className="text-gray-400 leading-relaxed">
                                        {achievement.description}
                                    </p>
                                </div>
                            </ScrollAnimation>
                        );
                    })}
                </div>

                {/* Science High School Roadmap */}
                <ScrollAnimation direction="fade" delay={400}>
                    <div className="bg-gradient-to-r from-sky-500/20 via-blue-500/20 to-indigo-500/20 rounded-3xl p-8 md:p-12 border border-sky-500/30">
                        <div className="text-center">
                            <Target className="w-12 h-12 text-sky-400 mx-auto mb-4" />
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                                Science High School Roadmap
                            </h3>
                            <p className="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                                이 과정은 단순 취미를 넘어 <strong className="text-sky-400">과학고/공대 진로</strong>와도 연결됩니다.
                                <br />
                                입시 및 진로 로드맵을 통해 전문성을 키워나갑니다.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm">
                                <span className="px-4 py-2 bg-white/10 text-white rounded-full border border-white/20">특목고 진학</span>
                                <span className="px-4 py-2 bg-white/10 text-white rounded-full border border-white/20">공대 진학</span>
                                <span className="px-4 py-2 bg-white/10 text-white rounded-full border border-white/20">항공우주 분야</span>
                                <span className="px-4 py-2 bg-white/10 text-white rounded-full border border-white/20">로봇공학 분야</span>
                            </div>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}

