import React from 'react';
import Image from 'next/image';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      {/* 배경 이미지 및 오버레이 */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
          alt="학원 메인 배경"
          fill
          className="object-cover object-center opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col justify-center h-screen max-h-[800px]">
        <div className="lg:w-2/3">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-500/20 text-orange-400 text-sm font-semibold mb-6 border border-orange-500/30">
            2025년 특강 수강생 모집 중 🔥
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            성적의 한계를 뛰어넘는 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">
              안티 그래비티 학습법
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
            더 이상 혼자 고민하지 마세요. 온라인과 오프라인이 결합된 하이브리드 교육으로
            아이의 잠재력을 200% 끌어올립니다. 지금 무료 레벨 테스트를 받아보세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg shadow-orange-600/20">
              무료 상담 신청하기
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold backdrop-blur-sm transition-all border border-white/10">
              <PlayCircle className="w-5 h-5" />
              온라인 특강 맛보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;