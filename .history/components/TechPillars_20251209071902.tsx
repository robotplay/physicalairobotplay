'use client';

import { Code2, Eye, Navigation, Bot } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';
import { useState } from 'react';

export default function TechPillars() {
    const pillars = [
        {
            number: '01',
            icon: Code2,
            title: 'Professional Coding',
            subtitle: 'Python / C++',
            headline: '진짜 개발자의 언어를 배우다',
            description: '드래그 앤 드롭을 졸업하고, 텍스트 코딩의 세계로 진입합니다. 데이터 처리와 알고리즘 구현에 최적화된 Python과 하드웨어 제어의 핵심인 C++를 통해 정교한 로봇 제어 능력을 습득합니다.',
            keywords: ['#라이브러리활용', '#객체지향', '#알고리즘최적화'],
            color: 'from-deep-electric-blue to-cyan-500',
            bgColor: 'from-blue-900/20 to-cyan-900/20',
            code: `# Python Example
import numpy as np
import cv2

class RobotController:
    def __init__(self):
        self.speed = 0.5
    
    def process_sensor(self, data):
        return np.mean(data)`,
        },
        {
            number: '02',
            icon: Eye,
            title: 'AI Vision & Modeling',
            subtitle: 'The Eyes of AI',
            headline: '로봇에게 시각 지능을 부여하다',
            description: '카메라를 통해 들어온 시각 정보를 분석합니다. 사물 인식(Object Detection), 얼굴 인식, 색상 추적 등 AI 모델링을 통해 로봇이 주변 환경을 이해하고 데이터를 학습하는 과정을 실습합니다.',
            keywords: ['#OpenCV', '#머신러닝', '#딥러닝기초'],
            color: 'from-neon-purple to-pink-500',
            bgColor: 'from-purple-900/20 to-pink-900/20',
            code: `# Computer Vision
import cv2

def detect_object(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    return edges`,
        },
        {
            number: '03',
            icon: Navigation,
            title: 'Autonomous Mission',
            subtitle: 'The Action',
            headline: '스스로 판단하는 자율주행 미션',
            description: '입력된 코드가 아닌, 상황에 따라 변하는 데이터를 바탕으로 로봇이 스스로 경로를 탐색합니다. 미로 탈출, 재난 구조 시뮬레이션 등 복잡한 복합 미션을 수행하며 문제 해결 능력을 극대화합니다.',
            keywords: ['#자율주행', '#SLAM', '#센서퓨전'],
            color: 'from-active-orange to-red-500',
            bgColor: 'from-orange-900/20 to-red-900/20',
            code: `// C++ Autonomous Navigation
class AutonomousRobot {
    void navigate() {
        while (!reachedGoal()) {
            updateSensors();
            planPath();
            execute();
        }
    }
}`,
        },
    ];

    return (
        <section className="py-20 bg-black relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(157, 0, 255, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(157, 0, 255, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-16">
                        <h2 className="text-neon-purple font-bold tracking-wider mb-2">THE 3 PILLARS OF TECHNOLOGY</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            전문 기술의 기둥
                        </h3>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            현업 개발자 수준의 기술을 단계별로 마스터합니다
                        </p>
                    </div>
                </ScrollAnimation>

                    <div className="space-y-10 sm:space-y-12 md:space-y-16">
                    {pillars.map((pillar, index) => {
                        const Icon = pillar.icon;
                        const isEven = index % 2 === 0;
                        
                        return (
                            <ScrollAnimation
                                key={index}
                                direction={isEven ? 'right' : 'left'}
                                delay={index * 200}
                            >
                                <div className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-800 active:border-neon-purple/50 hover:border-neon-purple/50 transition-all duration-500 active:-translate-y-1 hover:-translate-y-2 ${
                                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                                }`}>
                                    {/* Background gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${pillar.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                    
                                    <div className={`relative z-10 grid md:grid-cols-2 gap-0 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                                        {/* Left: Image/Visual */}
                                        <div className={`relative h-64 md:h-auto bg-gradient-to-br ${pillar.bgColor} border-r border-gray-800 ${isEven ? '' : 'md:border-l md:border-r-0'}`}>
                                            <div className="w-full h-full flex items-center justify-center p-8">
                                                <div className="text-center">
                                                    <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all shadow-[0_0_30px_rgba(157,0,255,0.3)]`}>
                                                        <Icon className="w-12 h-12 text-white" />
                                                    </div>
                                                    <div className="text-6xl font-black text-gray-800 group-hover:text-gray-700 transition-colors">
                                                        {pillar.number}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Content */}
                                        <div className="p-8 md:p-12 bg-black/40 backdrop-blur-sm">
                                            <div className="mb-4">
                                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    {pillar.subtitle}
                                                </span>
                                                <h4 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-purple group-hover:to-deep-electric-blue transition-all">
                                                    {pillar.headline}
                                                </h4>
                                            </div>
                                            
                                            <p className="text-gray-300 leading-relaxed mb-6">
                                                {pillar.description}
                                            </p>

                                            {/* Keywords */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {pillar.keywords.map((keyword, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-gray-900 text-gray-400 text-xs rounded-full border border-gray-800 hover:border-neon-purple/50 transition-colors"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Code snippet */}
                                            <div className="bg-black rounded-lg p-4 border border-gray-800 font-mono text-xs text-green-400 overflow-x-auto">
                                                <pre className="whitespace-pre-wrap">
                                                    {pillar.code}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollAnimation>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}


