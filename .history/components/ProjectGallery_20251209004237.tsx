'use client';

import ScrollAnimation from './ScrollAnimation';
import { Play, Award, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function ProjectGallery() {
    const projects = [
        {
            title: '신호등 인식 자율주행',
            description: '카메라로 신호등을 인식하고 자동으로 멈추는 자동차 로봇',
            tech: 'Python + OpenCV + AI Vision',
            image: '🚦',
        },
        {
            title: '물체 탐지 로봇 팔',
            description: '특정 물건을 찾아 집어오는 지능형 로봇 팔 시스템',
            tech: 'C++ + Computer Vision + Robotics',
            image: '🤖',
        },
        {
            title: '미로 탈출 자율주행',
            description: 'SLAM 기술을 활용한 미로 탐색 및 탈출 로봇',
            tech: 'Python + SLAM + Path Planning',
            image: '🧭',
        },
    ];

    return (
        <section className="py-20 bg-[#1A1A1A] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <Award className="w-6 h-6 text-neon-purple" />
                            <h2 className="text-neon-purple font-bold tracking-wider">STUDENT PROJECTS</h2>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Future Innovators
                        </h3>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            제미나이 3를 활용해 코드 오류를 수정하고 완성한 학생 작품입니다.
                        </p>
                    </div>
                </ScrollAnimation>

                <div className="grid md:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ScrollAnimation
                            key={index}
                            direction="up"
                            delay={index * 150}
                        >
                            <div className="group relative bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-neon-purple/50 transition-all duration-300 hover:-translate-y-2">
                                {/* Project visual */}
                                <div className="relative h-48 bg-gradient-to-br from-neon-purple/20 via-deep-electric-blue/20 to-black flex items-center justify-center overflow-hidden">
                                    <div className="text-8xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all">
                                        {project.image}
                                    </div>
                                    
                                    {/* Play overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform">
                                            <Play className="w-8 h-8 text-white ml-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-neon-purple" />
                                        <span className="text-xs text-gray-500 uppercase tracking-wider">Project #{index + 1}</span>
                                    </div>
                                    
                                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-neon-purple transition-colors">
                                        {project.title}
                                    </h4>
                                    
                                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.split(' + ').map((tech, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-gray-900 text-gray-400 text-xs rounded border border-gray-800"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    );
}


