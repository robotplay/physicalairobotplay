import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import AirRobotHero from '@/components/AirRobotHero';

export const metadata: Metadata = {
  title: "AirRobot Course - 드론 코딩 전문 과정",
  description: "항공 역학과 알고리즘을 활용한 드론 제어 전문 과정. 드론 조종부터 자율 비행 프로그래밍까지 체계적인 교육.",
  keywords: ["드론 코딩", "드론 교육", "항공 로봇", "자율 비행", "드론 프로그래밍", "천안 드론 교육"],
  openGraph: {
    title: "AirRobot Course - 드론 코딩 전문 과정 | 피지컬 AI 로봇플레이",
    description: "항공 역학과 알고리즘을 활용한 드론 제어 전문 과정. 드론 조종부터 자율 비행 프로그래밍까지.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AirRobot Course - 드론 코딩 전문 과정",
    description: "항공 역학과 알고리즘을 활용한 드론 제어 전문 과정",
  },
};

// Lazy load components for better performance
const AirRobotOverview = dynamic(() => import('@/components/AirRobotOverview'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const AirRobotCurriculum = dynamic(() => import('@/components/AirRobotCurriculum'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const AirRobotShowcase = dynamic(() => import('@/components/AirRobotShowcase'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const AirRobotCompetition = dynamic(() => import('@/components/AirRobotCompetition'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const AirRobotCTA = dynamic(() => import('@/components/AirRobotCTA'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

export default function AirRobotCoursePage() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white">
      <AirRobotHero />
      <AirRobotOverview />
      <AirRobotCurriculum />
      <AirRobotShowcase />
      <AirRobotCompetition />
      <AirRobotCTA />
      <Footer />
    </main>
  );
}

