import dynamic from 'next/dynamic';
import AirRobotHero from '@/components/AirRobotHero';

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

