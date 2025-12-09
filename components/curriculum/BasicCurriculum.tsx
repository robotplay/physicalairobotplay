'use client';

import ScrollAnimation from '../ScrollAnimation';
import { Zap, Eye, Rocket } from 'lucide-react';

export default function BasicCurriculum() {
  const weeks = [
    {
      period: '1-4주',
      title: 'Hello, Robot!',
      subtitle: '입출력과 제어',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      topics: [
        '아두이노 커피보드 구조 이해 및 LED 제어',
        '버튼과 부저를 활용한 신호등/악기 만들기',
        '엠블록과 보드 연결 및 기본 통신 원리',
      ],
    },
    {
      period: '5-8주',
      title: 'Sensing the World',
      subtitle: '센서 활용',
      icon: Eye,
      color: 'from-orange-500 to-red-500',
      topics: [
        '초음파 센서로 거리 측정하기 (장애물 감지)',
        '조도 센서와 소리 센서를 활용한 스마트 가로등',
        '서보 모터 제어를 통한 로봇 관절 움직임 이해',
      ],
    },
    {
      period: '9-12주',
      title: 'Mission & Driving',
      subtitle: '기본 주행',
      icon: Rocket,
      color: 'from-purple-500 to-pink-500',
      topics: [
        'DC 모터 구동 원리 및 로봇 자동차 조립',
        '라인 트레이싱(Line Tracing) 알고리즘 기초',
        '[미니 대회] 정해진 코스 완주하기',
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <ScrollAnimation direction="fade">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            피지컬 컴퓨팅의 첫걸음
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4">
            센서와 로봇의 대화
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 bg-active-orange/10 text-active-orange rounded-full border border-active-orange/20">
              아두이노 커피보드
            </span>
            <span className="px-4 py-2 bg-active-orange/10 text-active-orange rounded-full border border-active-orange/20">
              엠블록 (mBlock 5)
            </span>
            <span className="px-4 py-2 bg-active-orange/10 text-active-orange rounded-full border border-active-orange/20">
              블록 코딩 기초
            </span>
          </div>
        </div>
      </ScrollAnimation>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-active-orange via-deep-electric-blue to-neon-purple"></div>

        <div className="space-y-8 sm:space-y-12">
          {weeks.map((week, index) => {
            const Icon = week.icon;
            return (
              <ScrollAnimation key={index} direction="right" delay={index * 150}>
                <div className="relative flex items-start gap-4 sm:gap-6 md:gap-8">
                  {/* Timeline Dot */}
                  <div className="hidden md:flex flex-shrink-0 items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 border-4 border-active-orange shadow-lg z-10">
                    <Icon className="w-7 h-7 text-active-orange" />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-800 hover:border-active-orange/50 transition-all hover:-translate-y-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`md:hidden flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${week.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs sm:text-sm font-bold text-active-orange bg-active-orange/10 px-3 py-1 rounded-full">
                            {week.period}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {week.subtitle}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {week.title}
                        </h3>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {week.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-active-orange mt-2"></span>
                          <span className="text-sm sm:text-base leading-relaxed">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </div>
  );
}
