'use client';

import { Sparkles, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CurriculumHero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative h-[60vh] min-h-[400px] sm:min-h-[500px] flex items-center justify-center overflow-hidden pt-16 sm:pt-20 bg-gradient-to-br from-deep-electric-blue/10 via-active-orange/5 to-neon-purple/10">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-96 h-96 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-active-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className={`relative z-[10] text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full border border-deep-electric-blue/20 mb-6 animate-fade-in">
          <BookOpen className="w-4 h-4 text-deep-electric-blue animate-spin-slow" aria-hidden="true" />
          <span className="text-sm text-deep-electric-blue font-semibold">CURRICULUM ROADMAP</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2">
          <span className="block text-gray-900">
            단계별 성장의 로드맵,
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-deep-electric-blue via-active-orange to-neon-purple animate-gradient">
            전체 커리큘럼
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-600">
          IRO·FIRA 세계 대회 출전을 목표로 하는<br className="hidden sm:block" />
          체계적인 피지컬 AI 로봇 교육 과정
        </p>

        {/* Global Standard Competition Track Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-deep-electric-blue to-neon-purple text-white rounded-full shadow-lg animate-fade-in-delay">
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm font-bold">Global Standard Competition Track</span>
        </div>
      </div>
    </section>
  );
}
