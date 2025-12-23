'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Hero from "@/components/Hero";

// Lazy load components below the fold for better initial load
const History = dynamic(() => import("@/components/History"), {
  loading: () => <div className="py-20" />,
});
const About = dynamic(() => import("@/components/About"), {
  loading: () => <div className="py-20" />,
});
const EnhancedRoadmap = dynamic(() => import("@/components/EnhancedRoadmap"), {
  loading: () => <div className="py-20" />,
});
const Program = dynamic(() => import("@/components/Program"), {
  loading: () => <div className="py-20" />,
});
const Teachers = dynamic(() => import("@/components/Teachers"), {
  loading: () => <div className="py-20" />,
});
const SuccessStories = dynamic(() => import("@/components/SuccessStories"), {
  loading: () => <div className="py-20" />,
});
const OnlineCourses = dynamic(() => import("@/components/OnlineCourses"), {
  loading: () => <div className="py-20" />,
});
const Showcase = dynamic(() => import("@/components/Showcase"), {
  loading: () => <div className="py-20" />,
});
const News = dynamic(() => import("@/components/News"), {
  loading: () => <div className="py-20" />,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="py-20" />,
});

export default function Home() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Handle hash navigation after page load
    const handleHashScroll = () => {
      if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const scrollToElement = () => {
          const element = document.getElementById(hash);
          if (element) {
            const headerOffset = 80; // Header height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            return true;
          }
          return false;
        };

        // Try immediately
        if (!scrollToElement()) {
          // If element not found, wait a bit longer for dynamic components to load
          setTimeout(() => {
            if (!scrollToElement()) {
              // Try one more time after a longer delay
              setTimeout(scrollToElement, 500);
            }
          }, 300);
        }
      }
    };

    // Run on mount with delay to ensure all components are rendered
    const timer = setTimeout(() => {
      handleHashScroll();
    }, 100);
    
    window.addEventListener('hashchange', handleHashScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white">
      <Hero />
      <History />
      <About />
      <EnhancedRoadmap />
      <Program />
      <Teachers />
      <SuccessStories />
      <OnlineCourses />
      <Showcase />
      <News />
      <Footer />
    </main>
  );
}
