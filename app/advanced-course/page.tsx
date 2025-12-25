import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import AdvancedCourseHero from '@/components/AdvancedCourseHero';

export const metadata: Metadata = {
  title: "Advanced Course - AI 비전 로봇 심화 과정",
  description: "Python, C++, 라즈베리파이, OpenCV를 활용한 실전 AI 로봇 개발 과정. IRO, FIRA 국제 대회 준비 및 현업 개발자 수준의 기술 습득.",
  keywords: ["AI 로봇", "Python 로봇", "OpenCV", "라즈베리파이", "IRO", "FIRA", "로봇 대회", "천안 로봇 심화"],
  openGraph: {
    title: "Advanced Course - AI 비전 로봇 심화 과정 | 피지컬 AI 로봇플레이",
    description: "Python, C++, 라즈베리파이, OpenCV를 활용한 실전 AI 로봇 개발 과정. IRO, FIRA 국제 대회 준비.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advanced Course - AI 비전 로봇 심화 과정",
    description: "Python, C++, 라즈베리파이, OpenCV를 활용한 실전 AI 로봇 개발",
  },
};

// Lazy load components for better performance
const AdvancedCourseOverview = dynamic(() => import('@/components/AdvancedCourseOverview'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const TechPillars = dynamic(() => import('@/components/TechPillars'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const ProjectGallery = dynamic(() => import('@/components/ProjectGallery'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const AdvancedCourseCTA = dynamic(() => import('@/components/AdvancedCourseCTA'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

export default function AdvancedCoursePage() {
  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white">
      <AdvancedCourseHero />
      <AdvancedCourseOverview />
      <TechPillars />
      <ProjectGallery />
      <AdvancedCourseCTA />
      <Footer />
    </main>
  );
}


