import dynamic from 'next/dynamic';
import AdvancedCourseHero from '@/components/AdvancedCourseHero';

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


