import dynamic from 'next/dynamic';
import BasicCourseHero from '@/components/BasicCourseHero';

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
    <main className="min-h-screen bg-white">
      <BasicCourseHero />
      <CourseOverview />
      <CurriculumRoadmap />
      <LearningOutcomes />
      <BasicCourseCTA />
      <Footer />
    </main>
  );
}


