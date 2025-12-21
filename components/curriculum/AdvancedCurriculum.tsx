'use client';

import ScrollAnimation from '../ScrollAnimation';
import { Car, Hand, Users } from 'lucide-react';

interface AdvancedCurriculumProps {
  subTab: 'driving' | 'arm' | 'humanoid';
}

export default function AdvancedCurriculum({ subTab }: AdvancedCurriculumProps) {
  const tracks = {
    driving: {
      title: 'Real AI Engineering: 시각을 가진 지능형 로봇',
      subtitle: '자율주행 (Autonomous Driving)',
      icon: Car,
      color: 'from-deep-electric-blue to-cyan-500',
      duration: '8주',
      goal: 'FIRA 자율주행 챌린지 대비 기초',
      tools: ['Python', 'C++', 'OpenCV', 'Raspberry Pi', 'Pi Camera'],
      weeks: [
        {
          period: '1-2주',
          title: '환경 세팅 및 기초',
          topics: [
            '라즈베리파이 OS 세팅 및 리눅스 기초',
            'Python 기초 문법',
          ],
        },
        {
          period: '3-4주',
          title: '비전 시스템 구축',
          topics: [
            'Pi Camera 연동 및 OpenCV 기초',
            '이미지 캡처, 흑백 변환',
          ],
        },
        {
          period: '5-6주',
          title: '차선 인식 및 주행',
          topics: [
            '차선 인식(Lane Detection) 알고리즘',
            '코너 주행 구현',
          ],
        },
        {
          period: '7-8주',
          title: '신호등 인식 및 완주',
          topics: [
            '신호등(색상) 인식 및 정지/출발 로직',
            '자율주행 트랙 완주',
          ],
        },
      ],
    },
    arm: {
      title: '산업용 스마트 팩토리 및 미션 수행 로봇',
      subtitle: '물체 탐지 로봇팔 (Object Detection Arm)',
      icon: Hand,
      color: 'from-neon-purple to-pink-500',
      duration: '8주',
      goal: '산업용 스마트 팩토리 및 미션 수행 로봇 구현',
      tools: ['Python', 'OpenCV', 'Kinematics', 'Coordinate Transform'],
      weeks: [
        {
          period: '1-2주',
          title: '로봇팔 운동학',
          topics: [
            '다관절 로봇팔의 운동학(Kinematics) 이해',
            '로봇팔 제어 기초',
          ],
        },
        {
          period: '3-4주',
          title: '비전 인식 기초',
          topics: [
            'OpenCV를 활용한 색상(Color) 인식',
            '도형(Shape) 인식',
          ],
        },
        {
          period: '5-6주',
          title: '좌표 변환',
          topics: [
            '좌표 변환 (카메라 화면 좌표 → 로봇팔 물리 좌표)',
          ],
        },
        {
          period: '7-8주',
          title: 'Pick & Place 미션',
          topics: [
            '특정 물체 추적(Tracking)',
            'Pick & Place 미션 수행',
          ],
        },
      ],
    },
    humanoid: {
      title: 'IRO / FIRA 휴머노이드 종목 출전',
      subtitle: 'AI 휴머노이드 (AI Humanoid)',
      icon: Users,
      color: 'from-active-orange to-red-500',
      duration: '12주',
      goal: 'IRO / FIRA 휴머노이드 종목 출전',
      tools: ['Python', 'C++', 'ROS', 'AI Vision', 'Humanoid Kinematics'],
      weeks: [
        {
          period: '1-4주',
          title: '보행 알고리즘',
          topics: [
            '휴머노이드 보행 알고리즘 분석',
            '안정적인 걷기, 무게중심 제어',
          ],
        },
        {
          period: '5-8주',
          title: 'AI 비전 융합',
          topics: [
            '공 인식',
            '골대 인식',
            '얼굴 인식',
          ],
        },
        {
          period: '9-12주',
          title: '실전 미션',
          topics: [
            '[실전] 재난 구조 미션',
            '로봇 축구(Soccer) 알고리즘 구현',
          ],
        },
      ],
    },
  };

  const track = tracks[subTab];
  const Icon = track.icon;

  return (
    <div className="max-w-5xl mx-auto">
      <ScrollAnimation direction="fade">
        <div className="text-center mb-8 sm:mb-12">
          <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${track.color} mb-4`}>
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {track.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4">
            {track.subtitle} · {track.duration}
          </p>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6">
            목표: {track.goal}
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
            {track.tools.map((tool, i) => (
              <span key={i} className="px-3 py-1.5 bg-deep-electric-blue/10 text-deep-electric-blue rounded-full border border-deep-electric-blue/20">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </ScrollAnimation>

      {/* Timeline */}
      <div className="relative">
        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-deep-electric-blue via-neon-purple to-active-orange"></div>

        <div className="space-y-8 sm:space-y-12">
          {track.weeks.map((week, index) => (
            <ScrollAnimation key={index} direction="right" delay={index * 150}>
              <div className="relative flex items-start gap-4 sm:gap-6 md:gap-8">
                {/* Timeline Dot */}
                <div className={`hidden md:flex flex-shrink-0 items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 border-4 border-deep-electric-blue shadow-lg z-10`}>
                  <span className="text-xl font-bold text-deep-electric-blue">{index + 1}</span>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-800 hover:border-deep-electric-blue/50 transition-all hover:-translate-y-1">
                  <div className="mb-4">
                    <span className="text-xs sm:text-sm font-bold text-deep-electric-blue bg-deep-electric-blue/10 px-3 py-1 rounded-full">
                      {week.period}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {week.title}
                  </h3>

                  <ul className="space-y-3">
                    {week.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-deep-electric-blue mt-2"></span>
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




























