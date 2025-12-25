import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import BasicCourseHero from '@/components/BasicCourseHero';

export const metadata: Metadata = {
  title: "Basic Course - 로봇 코딩 기초 과정",
  description: "아두이노와 엠블록으로 시작하는 로봇 코딩 입문 과정. 초등학생부터 중학생까지 논리적 사고력과 창의력을 키우는 체계적인 커리큘럼.",
  keywords: ["로봇 코딩 기초", "아두이노 교육", "엠블록", "초등 코딩", "블록 코딩", "천안 로봇교육"],
  openGraph: {
    title: "Basic Course - 로봇 코딩 기초 과정 | 피지컬 AI 로봇플레이",
    description: "아두이노와 엠블록으로 시작하는 로봇 코딩 입문 과정. 초등학생부터 중학생까지 논리적 사고력과 창의력을 키웁니다.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Basic Course - 로봇 코딩 기초 과정",
    description: "아두이노와 엠블록으로 시작하는 로봇 코딩 입문 과정",
  },
};

// Lazy load components for better performance
const CourseOverview = dynamic(() => import('@/components/CourseOverview'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const CurriculumRoadmap = dynamic(() => import('@/components/CurriculumRoadmap'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const LearningOutcomes = dynamic(() => import('@/components/LearningOutcomes'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const BasicCourseCTA = dynamic(() => import('@/components/BasicCourseCTA'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

export default function BasicCoursePage() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white">
      <BasicCourseHero />
      <CourseOverview />
      <CurriculumRoadmap />
      <LearningOutcomes />
      <BasicCourseCTA />
      <Footer />
    </main>
  );
}


