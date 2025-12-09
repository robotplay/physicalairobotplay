'use client';

import ScrollAnimation from './ScrollAnimation';
import { Globe, Award } from 'lucide-react';
import Image from 'next/image';

export default function CompetitionRoadmap() {
  const competitions = [
    {
      name: '국제로봇올림피아드',
      acronym: 'IRO',
      logo: '/img/iroc.png',
      color: 'from-yellow-500 to-orange-500',
      description: '창의적 미션 수행과 AI 휴머노이드 AI 자율주행 대회 출전을 목표로 하는 과정',
      categories: ['창의 미션', 'AI 자율주행', 'AI 휴봇'],
    },
    {
      name: 'FIRA RoboWorld Cup',
      acronym: 'FIRA',
      icon: Globe,
      logo: undefined,
      color: 'from-blue-500 to-cyan-500',
      description: '자율주행 자동차, 로봇 축구 등 고난이도 AI 미션',
      categories: ['자율주행', '로봇 축구', 'AI 비전 미션'],
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-deep-electric-blue/5 via-active-orange/5 to-neon-purple/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-96 h-96 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-active-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <ScrollAnimation direction="fade">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-deep-electric-blue to-neon-purple text-white rounded-full mb-4">
              <Award className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm font-bold">IRO/FIRA 대회 준비반</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              당신의 코드가 세계 무대로
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              모든 커리큘럼은 국제 대회 출전을 목표로 설계되었습니다
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {competitions.map((competition, index) => {
            const Icon = competition.logo ? null : competition.icon;
            return (
              <ScrollAnimation key={index} direction="up" delay={index * 150}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-800 hover:border-deep-electric-blue/50 transition-all hover:-translate-y-2">
                  {competition.logo ? (
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-yellow-50 p-3 mb-4 border-2 border-yellow-300 dark:border-yellow-200 shadow-lg">
                      <Image
                        src={competition.logo}
                        alt={`${competition.name} 로고`}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${competition.color} mb-4`}>
                      {Icon && <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />}
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {competition.name}
                  </h3>
                  <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r bg-gradient-to-br from-deep-electric-blue to-neon-purple mb-3">
                    {competition.acronym}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">
                    {competition.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {competition.categories.map((category, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-700"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>

        <ScrollAnimation direction="fade" delay={300}>
          <div className="mt-12 text-center">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-deep-electric-blue to-neon-purple text-white rounded-full font-bold text-sm sm:text-base shadow-lg">
              이 커리큘럼을 수료하면 대회 출전 준비 완료!
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
}
