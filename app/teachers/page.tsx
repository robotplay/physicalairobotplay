'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Teacher {
    _id: string;
    name: string;
    title?: string;
    specialty?: string;
    phone?: string;
    email?: string;
    address?: string;
    qualifications?: string[];
    experience?: string[];
    image?: string;
    status?: 'active' | 'inactive';
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedTeachers, setExpandedTeachers] = useState<Set<string>>(new Set());

    // 이름의 가운데 글자를 *로 마스킹하는 함수
    const maskName = (name: string): string => {
        if (name.length <= 1) return name;
        if (name.length === 2) {
            return name[0] + '*';
        }
        const firstChar = name[0];
        const lastChar = name[name.length - 1];
        const middleChars = '*'.repeat(name.length - 2);
        return firstChar + middleChars + lastChar;
    };

    useEffect(() => {
        const loadTeachers = async () => {
            try {
                const response = await fetch('/api/users?role=teacher');
                const result = await response.json();
                if (result.success && result.data) {
                    const activeTeachers = (result.data.users || [])
                        .filter((teacher: Teacher) => teacher.status === 'active')
                        .sort((a: Teacher, b: Teacher) => {
                            const dateA = new Date((a as { createdAt?: string }).createdAt || 0).getTime();
                            const dateB = new Date((b as { createdAt?: string }).createdAt || 0).getTime();
                            return dateB - dateA;
                        });
                    setTeachers(activeTeachers);
                }
            } catch (error) {
                console.error('Failed to load teachers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTeachers();
    }, []);

    const toggleExperience = (teacherId: string) => {
        setExpandedTeachers((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(teacherId)) {
                newSet.delete(teacherId);
            } else {
                newSet.add(teacherId);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-[#1A1A1A] pt-20 sm:pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-16">
                    <h1 className="text-deep-electric-blue font-bold tracking-wider mb-2 text-sm sm:text-base">OUR TEACHERS</h1>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                        아이들의 꿈을 현실로 만드는<br />
                        전문 강사진
                    </h2>
                    <p className="text-gray-300">
                        경험과 열정으로 아이들의 미래를 만들어가는 전문 교육진입니다
                    </p>
                </div>

                {/* Teachers Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-700"></div>
                                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : teachers.length === 0 ? (
                    <div className="text-center py-16">
                        <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">등록된 강사가 없습니다.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {teachers.map((teacher) => (
                            <div
                                key={teacher._id}
                                className="group relative bg-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700 hover:border-deep-electric-blue/50"
                            >
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
                                            {teacher.image.startsWith('data:image/') ? (
                                                <img
                                                    src={teacher.image}
                                                    alt={maskName(teacher.name)}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : teacher.image.startsWith('https://') ? (
                                                <img
                                                    src={teacher.image}
                                                    alt={maskName(teacher.name)}
                                                    className="w-full h-full object-cover"
                                                    crossOrigin="anonymous"
                                                />
                                            ) : (
                                                <Image
                                                    src={teacher.image}
                                                    alt={maskName(teacher.name)}
                                                    width={112}
                                                    height={112}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-deep-electric-blue to-active-orange flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                            {maskName(teacher.name).charAt(0)}
                                        </div>
                                    )}

                                    {/* Teacher Info */}
                                    <div className="text-center mb-4 sm:mb-6">
                                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                                            {maskName(teacher.name)}
                                        </h3>
                                        <p className="text-sm sm:text-base text-deep-electric-blue font-semibold mb-2">
                                            {teacher.title || '전문강사'}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-300">
                                            {teacher.specialty || ''}
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

                                    {/* Qualifications */}
                                    {teacher.qualifications && teacher.qualifications.length > 0 && (
                                        <div className="mb-4 sm:mb-6">
                                            <h5 className="text-xs font-semibold text-gray-300 mb-2">
                                                <Award className="w-3 h-3 sm:w-4 sm:h-4 text-deep-electric-blue inline mr-1" />
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

                                    {/* 강좌 신청 배너 */}
                                    <div className="mb-4 sm:mb-6">
                                        <a
                                            href="#consultation"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const consultationButton = document.querySelector('[aria-label*="상담"], [aria-label*="문의"]');
                                                if (consultationButton) {
                                                    (consultationButton as HTMLElement).click();
                                                }
                                            }}
                                            className="block w-full px-4 py-3 bg-gradient-to-r from-deep-electric-blue via-active-orange to-deep-electric-blue bg-[length:200%_100%] hover:bg-[length:100%_100%] text-white font-bold rounded-xl transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-center cursor-pointer relative overflow-hidden group"
                                        >
                                            <span className="relative z-10 text-sm sm:text-base block">
                                                {maskName(teacher.name)} 선생님 강좌 신청
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                        </a>
                                    </div>

                                    {/* Experience Preview */}
                                    {teacher.experience && teacher.experience.length > 0 && (
                                        <div className="border-t border-gray-700">
                                            <h5 className="text-xs font-semibold text-gray-300 mb-2">
                                                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 text-deep-electric-blue inline mr-1" />
                                                주요 경력
                                            </h5>
                                            <ul className="space-y-1 text-xs text-gray-300">
                                                {(expandedTeachers.has(teacher._id) ? teacher.experience : teacher.experience.slice(0, 3)).map((exp, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="text-active-orange mt-0.5">•</span>
                                                        <span className="line-clamp-2">{exp}</span>
                                                    </li>
                                                ))}
                                                {teacher.experience.length > 3 && (
                                                    <li>
                                                        <button
                                                            onClick={() => toggleExperience(teacher._id)}
                                                            className="text-deep-electric-blue hover:text-active-orange text-xs font-semibold mt-2 transition-colors cursor-pointer flex items-center gap-1"
                                                        >
                                                            {expandedTeachers.has(teacher._id) ? (
                                                                <>
                                                                    <span>접기</span>
                                                                    <span>▲</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <span>+{teacher.experience.length - 3}개 더 보기</span>
                                                                    <span>▼</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Back to Home */}
                <div className="text-center mt-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                    >
                        ← 홈으로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}

