'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ScrollAnimation from './ScrollAnimation';
import BasicCurriculum from './curriculum/BasicCurriculum';
import AdvancedCurriculum from './curriculum/AdvancedCurriculum';
import AirRobotCurriculum from './curriculum/AirRobotCurriculum';

export default function CurriculumTabs() {
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab') as 'basic' | 'advanced' | 'airrobot' | null;
  
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'airrobot'>(
    tabParam && ['basic', 'advanced', 'airrobot'].includes(tabParam) ? tabParam : 'basic'
  );
  const [advancedSubTab, setAdvancedSubTab] = useState<'driving' | 'arm' | 'humanoid'>('driving');

  useEffect(() => {
    if (tabParam && ['basic', 'advanced', 'airrobot'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Main Tabs */}
        <ScrollAnimation direction="fade">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 bg-gray-100 dark:bg-gray-900 rounded-2xl p-2 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab('basic')}
              className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all transform ${
                activeTab === 'basic'
                  ? 'bg-active-orange text-white shadow-lg scale-105'
                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-active-orange active:scale-95'
              } touch-manipulation`}
            >
              Basic Course
              <span className="block text-xs mt-1 opacity-75">12주</span>
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all transform ${
                activeTab === 'advanced'
                  ? 'bg-deep-electric-blue text-white shadow-lg scale-105'
                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-deep-electric-blue active:scale-95'
              } touch-manipulation`}
            >
              Advanced Course
              <span className="block text-xs mt-1 opacity-75">28주 (3개 트랙)</span>
            </button>
            <button
              onClick={() => setActiveTab('airrobot')}
              className={`flex-1 px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all transform ${
                activeTab === 'airrobot'
                  ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-sky-500 active:scale-95'
              } touch-manipulation`}
            >
              Air Robot Course
              <span className="block text-xs mt-1 opacity-75">4주</span>
            </button>
          </div>
        </ScrollAnimation>

        {/* Advanced Sub Tabs */}
        {activeTab === 'advanced' && (
          <ScrollAnimation direction="fade" delay={100}>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8 sm:mb-12 max-w-3xl mx-auto">
              <button
                onMouseEnter={() => setAdvancedSubTab('driving')}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all transform ${
                  advancedSubTab === 'driving'
                    ? 'bg-deep-electric-blue text-white shadow-md scale-105'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-95'
                } touch-manipulation`}
              >
                🚗 자율주행 (8주)
              </button>
              <button
                onMouseEnter={() => setAdvancedSubTab('arm')}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all transform ${
                  advancedSubTab === 'arm'
                    ? 'bg-deep-electric-blue text-white shadow-md scale-105'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-95'
                } touch-manipulation`}
              >
                🤖 물체 탐지 로봇팔 (8주)
              </button>
              <button
                onMouseEnter={() => setAdvancedSubTab('humanoid')}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all transform ${
                  advancedSubTab === 'humanoid'
                    ? 'bg-deep-electric-blue text-white shadow-md scale-105'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-95'
                } touch-manipulation`}
              >
                👤 AI 휴머노이드 (12주)
              </button>
            </div>
          </ScrollAnimation>
        )}

        {/* Curriculum Content */}
        <div className="min-h-[600px]">
          {activeTab === 'basic' && <BasicCurriculum />}
          {activeTab === 'advanced' && (
            <AdvancedCurriculum subTab={advancedSubTab} />
          )}
          {activeTab === 'airrobot' && <AirRobotCurriculum />}
        </div>
      </div>
    </section>
  );
}
