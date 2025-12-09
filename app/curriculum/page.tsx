import dynamic from 'next/dynamic';
import CurriculumHero from '@/components/CurriculumHero';

// Lazy load components for better performance
const CurriculumTabs = dynamic(() => import('@/components/CurriculumTabs'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const CompetitionRoadmap = dynamic(() => import('@/components/CompetitionRoadmap'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="py-20" />,
  ssr: true,
});

export default function CurriculumPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <CurriculumHero />
      <CurriculumTabs />
      <CompetitionRoadmap />
      <Footer />
    </main>
  );
}
