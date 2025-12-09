'use client';

import ScrollAnimation from '../ScrollAnimation';
import { Plane } from 'lucide-react';

export default function AirRobotCurriculum() {
  const weeks = [
    {
      period: '1주',
      title: '비행 원리 및 안전',
      topics: [
        '드론의 비행 원리(양력, 추력) 이해',
        '안전 수칙 학습',
        '기초 호버링 실습',
      ],
    },
    {
      period: '2주',
      title: '패턴 비행',
      topics: [
        '블록 코딩을 이용한 패턴 비행',
        '이륙, 착륙, 도형 그리기',
      ],
    },
    {
      period: '3주',
      title: '장애물 통과 미션',
      topics: [
        '장애물 통과 미션',
        '공중 곡예 비행 알고리즘',
      ],
    },
    {
      period: '4주',
      title: '팀 챌린지',
      topics: [
        '[Team Challenge] 드론 이어달리기',
        '정밀 착륙 미션',
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <ScrollAnimation direction="fade">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Sky High Tech
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4">
            드론 제어와 항공 역학
          </p>
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600">
            <Plane className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-4 py-2 bg-sky-400/10 text-sky-600 rounded-full border border-sky-400/20">
              교육용 코딩 드론
            </span>
            <span className="px-4 py-2 bg-sky-400/10 text-sky-600 rounded-full border border-sky-400/20">
              시뮬레이터
            </span>
            <span className="px-4 py-2 bg-sky-400/10 text-sky-600 rounded-full border border-sky-400/20">
              항공 역학 이해
            </span>
          </div>
        </div>
      </ScrollAnimation>

      {/* Timeline */}
      <div className="relative">
        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600"></div>

        <div className="space-y-8 sm:space-y-12">
          {weeks.map((week, index) => (
            <ScrollAnimation key={index} direction="right" delay={index * 150}>
              <div className="relative flex items-start gap-4 sm:gap-6 md:gap-8">
                {/* Timeline Dot */}
                <div className="hidden md:flex flex-shrink-0 items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 border-4 border-sky-400 shadow-lg z-10">
                  <span className="text-xl font-bold text-sky-600">{index + 1}</span>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-800 hover:border-sky-400/50 transition-all hover:-translate-y-1">
                  <div className="mb-4">
                    <span className="text-xs sm:text-sm font-bold text-sky-600 bg-sky-400/10 px-3 py-1 rounded-full">
                      {week.period}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {week.title}
                  </h3>

                  <ul className="space-y-3">
                    {week.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-sky-400 mt-2"></span>
                        <span className="text-sm sm:text-base leading-relaxed">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </div>
  );
}
