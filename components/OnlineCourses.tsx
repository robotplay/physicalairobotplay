'use client';

import { useState, useEffect } from 'react';
import ScrollAnimation from './ScrollAnimation';
import { Play, Clock, Users, Award, ArrowRight, BookOpen, Video, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Course {
    id: string;
    _id: string;
    title: string;
    description: string;
    duration: string;
    students: string;
    level: string;
    thumbnail: string;
    category: string;
    color: string;
}

export default function OnlineCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('/api/online-courses');
                const result = await response.json();
                if (result.success && result.data.length > 0) {
                    setCourses(result.data);
                } else {
                    // 데이터가 없으면 기본 데이터 사용
                    setCourses([
                        {
                            id: '1',
                            _id: '1',
                            title: '로봇 코딩 기초 완전정복',
                            description: '블록 코딩부터 시작하는 로봇 프로그래밍의 첫걸음',
                            duration: '4주',
                            students: '120명',
                            level: '입문',
                            thumbnail: '/img/01.jpeg',
                            category: 'Basic Course',
                            color: 'from-active-orange to-orange-600',
                        },
                        {
                            id: '2',
                            _id: '2',
                            title: 'AI 비전 인식 프로젝트',
                            description: 'OpenCV와 Python으로 배우는 실전 AI 비전 시스템',
                            duration: '6주',
                            students: '85명',
                            level: '중급',
                            thumbnail: '/img/02.jpeg',
                            category: 'Advanced Course',
                            color: 'from-deep-electric-blue to-blue-600',
                        },
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center bg-[#1A1A1A]">
                <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
            </div>
        );
    }

    return (
        <section id="courses" className="section-padding bg-[#1A1A1A]">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-active-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-10 sm:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon-purple/10 rounded-full border border-neon-purple/20 mb-4 sm:mb-6">
                            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-neon-purple animate-pulse" aria-hidden="true" />
                            <span className="text-xs sm:text-sm text-neon-purple font-semibold">ONLINE COURSES</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                            언제 어디서나<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-deep-electric-blue to-active-orange">
                                온라인으로 배우는 로봇 교육
                            </span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-300">
                            체계적인 커리큘럼과 실전 프로젝트로 실력을 키워보세요
                        </p>
                    </div>
                </ScrollAnimation>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
                    {courses.map((course, index) => (
                        <ScrollAnimation key={course.id} direction="up" delay={index * 150}>
                            <div className="group relative bg-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700">
                                {/* Thumbnail */}
                                <div className="relative h-48 sm:h-56 overflow-hidden">
                                    <Image
                                        src={course.thumbnail}
                                        alt={course.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        quality={85}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    
                                    {/* Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all cursor-pointer">
                                            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="white" aria-hidden="true" />
                                        </div>
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1.5 bg-gradient-to-r ${course.color} text-white text-xs sm:text-sm font-bold rounded-full backdrop-blur-sm`}>
                                            {course.category}
                                        </span>
                                    </div>

                                    {/* Level Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-xs sm:text-sm font-semibold rounded-full border border-white/20">
                                            {course.level}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 sm:p-8">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-deep-electric-blue transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-300">
                                        {course.description}
                                    </p>

                                    {/* Course Info */}
                                    <div className="flex flex-wrap items-center gap-4 mb-6 text-xs sm:text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" aria-hidden="true" />
                                            <span>{course.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" aria-hidden="true" />
                                            <span>{course.students} 수강</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" aria-hidden="true" />
                                            <span>실전 프로젝트</span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <Link
                                        href={`/curriculum?tab=${course.category.toLowerCase().replace(' course', '')}`}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-deep-electric-blue to-active-orange hover:from-blue-700 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group/btn touch-manipulation cursor-pointer"
                                    >
                                        강의 보기
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>

                {/* CTA Section */}
                <ScrollAnimation direction="fade" delay={600}>
                    <div className="mt-12 sm:mt-16 text-center">
                        <div className="inline-block bg-gradient-to-r from-deep-electric-blue/10 via-active-orange/10 to-neon-purple/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-deep-electric-blue/20">
                            <Award className="w-12 h-12 sm:w-16 sm:h-16 text-deep-electric-blue mx-auto mb-4 sm:mb-6" aria-hidden="true" />
                            <h3 className="text-2xl sm:text-3xl font-bold text-white">
                                더 많은 강의가 궁금하신가요?
                            </h3>
                            <p className="text-base sm:text-lg text-gray-300">
                                전체 커리큘럼을 확인하고 맞는 과정을 선택해보세요
                            </p>
                            <Link
                                href="/curriculum"
                                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-deep-electric-blue hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation cursor-pointer"
                            >
                                전체 커리큘럼 보기
                                <ArrowRight className="w-5 h-5" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </ScrollAnimation>
            </div>
        </section>
    );
}

