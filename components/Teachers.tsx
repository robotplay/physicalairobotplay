'use client';

import ScrollAnimation from './ScrollAnimation';
import { Award, Mail, Phone, MapPin, GraduationCap, Rocket, Code, Plane } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

interface Skill {
    name: string;
    level: number;
}

interface SkillBarsProps {
    skills: Skill[];
}

function SkillBars({ skills }: SkillBarsProps) {
    const [animatedLevels, setAnimatedLevels] = useState<number[]>(skills.map(() => 0));
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                    // Animate each skill bar with delay
                    skills.forEach((skill, index) => {
                        setTimeout(() => {
                            setAnimatedLevels((prev) => {
                                const newLevels = [...prev];
                                newLevels[index] = skill.level;
                                return newLevels;
                            });
                        }, index * 200);
                    });
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [skills, isVisible]);

    return (
        <div ref={ref} className="mb-4 sm:mb-6 space-y-2">
            <h5 className="text-xs font-semibold text-gray-700">
                <Code className="w-3 h-3 sm:w-4 sm:h-4 text-deep-electric-blue" />
                기술 숙련도
            </h5>
            {skills.map((skill, i) => (
                <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-300">
                        <span>{skill.name}</span>
                        <span className="font-semibold text-deep-electric-blue transition-all duration-1000">
                            {animatedLevels[i]}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200">
                        <div
                            className="bg-gradient-to-r from-deep-electric-blue to-active-orange h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ 
                                width: `${animatedLevels[i]}%`,
                                transition: 'width 1s ease-out'
                            }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface Teacher {
    name: string;
    title: string;
    specialty: string;
    phone?: string;
    email?: string;
    address?: string;
    qualifications?: string[];
    skills?: { name: string; level: number }[];
    experience?: string[];
    image?: string;
}

export default function Teachers() {
    const teachers: Teacher[] = [
        {
            name: '정숙형',
            title: '창의과학 교육 전문강사',
            specialty: '과학적 사고를 키우는 드론·코딩',
            image: '/img/jsp.png',
            skills: [
                { name: 'Scratch Coding', level: 95 },
                { name: 'AI Drone Coding', level: 100 },
                { name: 'Creative Science', level: 85 },
                { name: 'Teaching Expertise', level: 100 },
            ],
            experience: [
                '로봇코딩 - 스크래치 코딩',
                'AI드론 항공코딩 - 코딩드론 에어로봇',
                '(주)NEU 엔터테인먼트 - 로봇 SW강사',
                '(사)KICT 기업인협회 - 교육 및 컨설팅 매니저',
                '천안 신대초등학교 늘봄수업 - 초등창의과학',
                '2025 월드로보페스타 심사위원',
                '호서대학교 유학생 대상 로봇코딩교육',
                'STEAMCUP AI 로봇대회 운영진',
            ],
        },
        {
            name: '하성산',
            title: '로봇 교육 전문강사',
            specialty: '피지컬 AI 로봇 프로그래밍',
        },
        {
            name: '이은성',
            title: '코딩 교육 전문강사',
            specialty: '블록 코딩 및 텍스트 코딩',
        },
        {
            name: '최은주',
            title: '로봇 교육 전문강사',
            specialty: '로봇 구조 및 센서 활용',
        },
        {
            name: '강희정',
            title: 'AI 교육 전문강사',
            specialty: 'AI 비전 및 머신러닝',
        },
        {
            name: '이지은',
            title: '코딩 교육 전문강사',
            specialty: 'Python/C++ 프로그래밍',
        },
        {
            name: '정세나',
            title: '로봇 교육 전문강사',
            specialty: '자율주행 및 미션 수행',
        },
        {
            name: '정은아',
            title: '드론 교육 전문강사',
            specialty: '항공 역학 및 드론 제어',
        },
        {
            name: '김미정',
            title: '창의과학 교육 전문강사',
            specialty: 'STEAM 교육 및 프로젝트 기반 학습',
        },
    ];

    return (
        <section id="teachers" className="py-12 sm:py-16 md:py-20 bg-[#1A1A1A]">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-deep-electric-blue rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-active-orange rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <ScrollAnimation direction="fade">
                    <div className="text-center mb-10 sm:mb-16">
                        <h2 className="text-deep-electric-blue font-bold tracking-wider mb-2 text-sm sm:text-base">OUR TEACHERS</h2>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                            아이들의 꿈을 현실로 만드는<br />
                            전문 강사진
                        </h3>
                        <p className="text-gray-300">
                            경험과 열정으로 아이들의 미래를 만들어가는 전문 교육진입니다
                        </p>
                    </div>
                </ScrollAnimation>

                {/* Teachers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {teachers.map((teacher, index) => (
                        <ScrollAnimation
                            key={index}
                            direction="up"
                            delay={index * 100}
                        >
                            <div className="group relative bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700 hover:border-deep-electric-blue/50">
                                {/* Animated background blob */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-deep-electric-blue/10 rounded-bl-full -mr-8 -mt-8 transition-all duration-700 group-hover:scale-150 group-hover:bg-deep-electric-blue/20"></div>
                                
                                {/* Shine effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </div>

                                <div className="relative z-10">
                                    {/* Profile Image */}
                                    {teacher.image ? (
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 border-4 border-white">
                                            <Image
                                                src={teacher.image}
                                                alt={teacher.name}
                                                width={112}
                                                height={112}
                                                className="w-full h-full object-cover"
                                                priority={index === 0}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-deep-electric-blue to-active-orange flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                            {teacher.name.charAt(0)}
                                        </div>
                                    )}

                                    {/* Teacher Info */}
                                    <div className="text-center mb-4 sm:mb-6">
                                        <h4 className="text-xl sm:text-2xl font-bold text-white">
                                            {teacher.name}
                                        </h4>
                                        <p className="text-sm sm:text-base text-deep-electric-blue font-semibold mb-2">
                                            {teacher.title}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-300">
                                            {teacher.specialty}
                                        </p>
                                    </div>

                                    {/* Contact Info */}
                                    {(teacher.phone || teacher.email || teacher.address) && (
                                        <div className="space-y-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                                            {teacher.phone && (
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-deep-electric-blue flex-shrink-0" />
                                                    <span className="truncate">{teacher.phone}</span>
                                                </div>
                                            )}
                                            {teacher.email && (
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-deep-electric-blue flex-shrink-0" />
                                                    <span className="truncate">{teacher.email}</span>
                                                </div>
                                            )}
                                            {teacher.address && (
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-deep-electric-blue flex-shrink-0" />
                                                    <span className="truncate text-xs">{teacher.address}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Skills */}
                                    {teacher.skills && teacher.skills.length > 0 && (
                                        <SkillBars skills={teacher.skills} />
                                    )}

                                    {/* Qualifications */}
                                    {teacher.qualifications && teacher.qualifications.length > 0 && (
                                        <div className="mb-4 sm:mb-6">
                                            <h5 className="text-xs font-semibold text-gray-300">
                                                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-deep-electric-blue" />
                                                자격증
                                            </h5>
                                            <ul className="space-y-1 text-xs text-gray-300">
                                                {teacher.qualifications.map((qual, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="text-deep-electric-blue mt-0.5">•</span>
                                                        <span>{qual}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Experience Preview */}
                                    {teacher.experience && teacher.experience.length > 0 && (
                                        <div className="border-t border-gray-700">
                                            <h5 className="text-xs font-semibold text-gray-300">
                                                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-deep-electric-blue" />
                                                주요 경력
                                            </h5>
                                            <ul className="space-y-1 text-xs text-gray-300">
                                                {teacher.experience.slice(0, 3).map((exp, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="text-active-orange mt-0.5">•</span>
                                                        <span className="line-clamp-2">{exp}</span>
                                                    </li>
                                                ))}
                                                {teacher.experience.length > 3 && (
                                                    <li className="text-deep-electric-blue text-xs font-semibold mt-2">
                                                        +{teacher.experience.length - 3}개 더 보기
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollAnimation>
                    ))}
                </div>
            </div>
        </section>
    );
}

