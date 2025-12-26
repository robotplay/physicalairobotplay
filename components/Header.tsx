'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

// Logo component with fallback
function LogoWithFallback() {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Try different image formats and paths
    // Add version query to bypass browser cache
    const cacheBuster = '?v=2';
    const imageSources = [
        `/img/logo11.png${cacheBuster}`,
        `/img/logo.png${cacheBuster}`,
        `/logo.png${cacheBuster}`,
    ];

    const [currentSrcIndex, setCurrentSrcIndex] = useState(0);

    const handleError = () => {
        if (currentSrcIndex < imageSources.length - 1) {
            setCurrentSrcIndex(currentSrcIndex + 1);
        } else {
            setImageError(true);
        }
    };

    const handleLoad = () => {
        setImageLoaded(true);
    };

    if (imageError) {
        // Text fallback - will be styled by parent based on scroll state
        return (
            <div className="flex items-center gap-2">
                <div className="text-2xl sm:text-3xl font-black text-deep-electric-blue">
                    PAR
                </div>
                <div className="hidden sm:block text-xs leading-tight">
                    <div className="text-deep-electric-blue">Physical AI Robot</div>
                    <div className="text-active-orange font-semibold">Coding</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Image
                src={imageSources[currentSrcIndex]}
                alt="PAR Physical AI RobotCoding"
                width={200}
                height={60}
                className={`h-full w-auto object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                priority
                onError={handleError}
                onLoad={handleLoad}
                style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}
            />
            {!imageLoaded && (
                <div className="absolute inset-0 flex items-center gap-2 animate-pulse">
                    <div className="text-2xl sm:text-3xl font-black text-deep-electric-blue">
                        PAR
                    </div>
                    <div className="hidden sm:block text-xs leading-tight">
                        <div className="text-deep-electric-blue">Physical AI Robot</div>
                        <div className="text-active-orange font-semibold">Coding</div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    
    // 드롭다운 닫기 지연을 위한 타이머
    const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            // 컴포넌트 언마운트 시 타이머 정리
            if (dropdownTimerRef.current) {
                clearTimeout(dropdownTimerRef.current);
            }
        };
    }, []);

    // 드롭다운 열기 (지연 취소)
    const handleDropdownEnter = () => {
        if (dropdownTimerRef.current) {
            clearTimeout(dropdownTimerRef.current);
            dropdownTimerRef.current = null;
        }
        setIsDropdownOpen(true);
    };

    // 드롭다운 닫기 (지연 적용)
    const handleDropdownLeave = () => {
        dropdownTimerRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 200); // 200ms 지연
    };

    // 새로운 메뉴 구조
    const dropdownItems = [
        { name: 'PAR 소개', href: '/#about' },
        { name: '커리큘럼', href: '/#roadmap' },
        { name: '강사진', href: '/#teachers' },
        { name: '성공 사례', href: '/#success' },
        { name: '공지&소식', href: '/#news' },
    ];

    const mainNavItems = [
        { name: '온라인캠프', href: '/#courses' },
        { name: '마이 강의실', href: '/my-classroom' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-[#1A1A1A]/95 backdrop-blur-md shadow-lg border-b border-gray-700'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 group transition-transform hover:scale-105"
                    >
                        {/* Logo Image with Fallback */}
                        <div className="relative h-12 sm:h-14 w-auto flex-shrink-0">
                            <LogoWithFallback />
                        </div>
                    </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
                            {/* PAR 드롭다운 메뉴 */}
                            <div 
                                className="relative group"
                                onMouseEnter={handleDropdownEnter}
                                onMouseLeave={handleDropdownLeave}
                            >
                                <button
                                    className={`flex items-center gap-1 font-semibold transition-all text-base xl:text-lg whitespace-nowrap cursor-pointer ${
                                        isScrolled
                                            ? 'text-gray-300 hover:text-deep-electric-blue'
                                            : 'text-white hover:text-deep-electric-blue'
                                    }`}
                                >
                                    PAR
                                    <ChevronDown 
                                        className={`w-4 h-4 transition-transform duration-300 ${
                                            isDropdownOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                    />
                                </button>

                                {/* 드롭다운 메뉴 */}
                                <div 
                                    className={`
                                        absolute top-full left-0 mt-1 w-48
                                        bg-[#1A1A1A]/98 backdrop-blur-xl rounded-xl shadow-2xl
                                        border border-gray-700/50
                                        transition-all duration-300 ease-out origin-top
                                        ${isDropdownOpen 
                                            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                                            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                                        }
                                    `}
                                    onMouseEnter={handleDropdownEnter}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <div className="py-2">
                                        {dropdownItems.map((item, index) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`
                                                    block px-4 py-3 text-sm font-medium
                                                    text-gray-300 hover:text-white hover:bg-deep-electric-blue/20
                                                    transition-all duration-200 cursor-pointer
                                                    ${index === 0 ? 'rounded-t-xl' : ''}
                                                    ${index === dropdownItems.length - 1 ? 'rounded-b-xl' : ''}
                                                    border-l-4 border-transparent hover:border-deep-electric-blue
                                                `}
                                                onClick={(e) => {
                                                    setIsDropdownOpen(false);
                                                    const hash = item.href.split('#')[1];
                                                    
                                                    if (pathname !== '/') {
                                                        e.preventDefault();
                                                        router.push(item.href);
                                                        
                                                        const scrollToSection = (attempts = 0) => {
                                                            setTimeout(() => {
                                                                const element = document.getElementById(hash);
                                                                if (element) {
                                                                    const headerOffset = 80;
                                                                    const elementPosition = element.getBoundingClientRect().top;
                                                                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                                                    
                                                                    window.scrollTo({
                                                                        top: offsetPosition,
                                                                        behavior: 'smooth'
                                                                    });
                                                                } else if (attempts < 10 && hash) {
                                                                    scrollToSection(attempts + 1);
                                                                }
                                                            }, attempts === 0 ? 500 : 200);
                                                        };
                                                        
                                                        if (hash) {
                                                            scrollToSection();
                                                        }
                                                    } else {
                                                        if (hash && typeof window !== 'undefined') {
                                                            e.preventDefault();
                                                            
                                                            const scrollToSection = (attempts = 0) => {
                                                                setTimeout(() => {
                                                                    const element = document.getElementById(hash);
                                                                    if (element) {
                                                                        const headerOffset = 80;
                                                                        const elementPosition = element.getBoundingClientRect().top;
                                                                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                                                        
                                                                        window.scrollTo({
                                                                            top: offsetPosition,
                                                                            behavior: 'smooth'
                                                                        });
                                                                    } else if (attempts < 10) {
                                                                        scrollToSection(attempts + 1);
                                                                    }
                                                                }, attempts === 0 ? 100 : 200);
                                                            };
                                                            
                                                            scrollToSection();
                                                        }
                                                    }
                                                }}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 메인 메뉴 아이템 */}
                            {mainNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center font-semibold transition-all text-base xl:text-lg whitespace-nowrap cursor-pointer ${
                                        isScrolled
                                            ? 'text-gray-300 hover:text-deep-electric-blue'
                                            : 'text-white hover:text-deep-electric-blue'
                                    }`}
                                    onClick={(e) => {
                                        const hash = item.href.split('#')[1];
                                        
                                        if (pathname !== '/' && hash) {
                                            e.preventDefault();
                                            router.push(item.href);
                                            
                                            const scrollToSection = (attempts = 0) => {
                                                setTimeout(() => {
                                                    const element = document.getElementById(hash);
                                                    if (element) {
                                                        const headerOffset = 80;
                                                        const elementPosition = element.getBoundingClientRect().top;
                                                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                                        
                                                        window.scrollTo({
                                                            top: offsetPosition,
                                                            behavior: 'smooth'
                                                        });
                                                    } else if (attempts < 10) {
                                                        scrollToSection(attempts + 1);
                                                    }
                                                }, attempts === 0 ? 500 : 200);
                                            };
                                            
                                            scrollToSection();
                                        } else if (hash && typeof window !== 'undefined') {
                                            e.preventDefault();
                                            
                                            const scrollToSection = (attempts = 0) => {
                                                setTimeout(() => {
                                                    const element = document.getElementById(hash);
                                                    if (element) {
                                                        const headerOffset = 80;
                                                        const elementPosition = element.getBoundingClientRect().top;
                                                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                                        
                                                        window.scrollTo({
                                                            top: offsetPosition,
                                                            behavior: 'smooth'
                                                        });
                                                    } else if (attempts < 10) {
                                                        scrollToSection(attempts + 1);
                                                    }
                                                }, attempts === 0 ? 100 : 200);
                                            };
                                            
                                            scrollToSection();
                                        }
                                    }}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* 코스 배너 버튼 */}
                            <Link
                                href="/basic-course"
                                className="flex items-center justify-center px-4 py-2.5 xl:px-5 xl:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 text-sm xl:text-base whitespace-nowrap touch-manipulation cursor-pointer shadow-lg hover:shadow-xl"
                            >
                                Basic Course
                            </Link>
                            <Link
                                href="/advanced-course"
                                className="flex items-center justify-center px-4 py-2.5 xl:px-5 xl:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 text-sm xl:text-base whitespace-nowrap touch-manipulation cursor-pointer shadow-lg hover:shadow-xl"
                            >
                                Advanced Course
                            </Link>
                            <Link
                                href="/airrobot-course"
                                className="flex items-center justify-center px-4 py-2.5 xl:px-5 xl:py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 text-sm xl:text-base whitespace-nowrap touch-manipulation cursor-pointer shadow-lg hover:shadow-xl"
                            >
                                AirRobot Course
                            </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className={`lg:hidden transition-colors touch-manipulation p-2 cursor-pointer ${
                            isScrolled
                                ? 'text-gray-300 active:text-deep-electric-blue hover:text-deep-electric-blue'
                                : 'text-white active:text-deep-electric-blue hover:text-deep-electric-blue'
                        }`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="메뉴 열기"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className={`lg:hidden py-4 border-t ${
                            isScrolled ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            {/* PAR 아코디언 메뉴 */}
                            <div className="mb-2">
                                <button
                                    onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                                    className={`w-full flex items-center justify-between py-3 px-4 font-semibold transition-all cursor-pointer ${
                                        isScrolled
                                            ? 'text-gray-300 hover:text-deep-electric-blue'
                                            : 'text-white hover:text-deep-electric-blue'
                                    }`}
                                >
                                    <span>PAR</span>
                                    <ChevronDown 
                                        className={`w-5 h-5 transition-transform duration-300 ${
                                            isMobileDropdownOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                    />
                                </button>
                                
                                {/* 아코디언 콘텐츠 */}
                                <div 
                                    className={`
                                        overflow-hidden transition-all duration-300 ease-in-out
                                        ${isMobileDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                    `}
                                >
                                    <div className="bg-gray-800/50 rounded-lg mx-2 mb-2">
                                        {dropdownItems.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`block py-3 px-4 text-sm transition-colors cursor-pointer border-l-4 border-transparent hover:border-deep-electric-blue hover:bg-deep-electric-blue/10 ${
                                                    isScrolled
                                                        ? 'text-gray-300 hover:text-white'
                                                        : 'text-gray-200 hover:text-white'
                                                }`}
                                                onClick={(e) => {
                                                    setIsMobileMenuOpen(false);
                                                    setIsMobileDropdownOpen(false);
                                                    const hash = item.href.split('#')[1];
                                                    
                                                    if (pathname !== '/') {
                                                        e.preventDefault();
                                                        router.push(item.href);
                                                        
                                                        const scrollToSection = (attempts = 0) => {
                                                            setTimeout(() => {
                                                                const element = document.getElementById(hash);
                                                                if (element) {
                                                                    const headerOffset = 80;
                                                                    const elementPosition = element.getBoundingClientRect().top;
                                                                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                                                    
                                                                    window.scrollTo({
                                                                        top: offsetPosition,
                                                                        behavior: 'smooth'
                                                                    });
                                                                } else if (attempts < 10 && hash) {
                                                                    scrollToSection(attempts + 1);
                                                                }
                                                            }, attempts === 0 ? 500 : 200);
                                                        };
                                                        
                                                        if (hash) {
                                                            scrollToSection();
                                                        }
                                                    } else {
                                                        if (hash && typeof window !== 'undefined') {
                                                            e.preventDefault();
                                                            
                                                            const scrollToSection = (attempts = 0) => {
                                                                setTimeout(() => {
                                                                    const element = document.getElementById(hash);
                                                                    if (element) {
                                                                        const headerOffset = 80;
                                                                        const elementPosition = element.getBoundingClientRect().top;
                                                                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                                                        
                                                                        window.scrollTo({
                                                                            top: offsetPosition,
                                                                            behavior: 'smooth'
                                                                        });
                                                                    } else if (attempts < 10) {
                                                                        scrollToSection(attempts + 1);
                                                                    }
                                                                }, attempts === 0 ? 100 : 200);
                                                            };
                                                            
                                                            scrollToSection();
                                                        }
                                                    }
                                                }}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 메인 메뉴 아이템 */}
                            {mainNavItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block py-3 px-4 font-semibold transition-colors cursor-pointer ${
                                        isScrolled
                                            ? 'text-gray-300 hover:text-deep-electric-blue'
                                            : 'text-white hover:text-deep-electric-blue'
                                    }`}
                                    onClick={(e) => {
                                        setIsMobileMenuOpen(false);
                                        const hash = item.href.split('#')[1];
                                        
                                        if (pathname !== '/' && hash) {
                                            e.preventDefault();
                                            router.push(item.href);
                                            
                                            const scrollToSection = (attempts = 0) => {
                                                setTimeout(() => {
                                                    const element = document.getElementById(hash);
                                                    if (element) {
                                                        const headerOffset = 80;
                                                        const elementPosition = element.getBoundingClientRect().top;
                                                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                                        
                                                        window.scrollTo({
                                                            top: offsetPosition,
                                                            behavior: 'smooth'
                                                        });
                                                    } else if (attempts < 10) {
                                                        scrollToSection(attempts + 1);
                                                    }
                                                }, attempts === 0 ? 500 : 200);
                                            };
                                            
                                            scrollToSection();
                                        } else if (hash && typeof window !== 'undefined') {
                                            e.preventDefault();
                                            
                                            const scrollToSection = (attempts = 0) => {
                                                setTimeout(() => {
                                                    const element = document.getElementById(hash);
                                                    if (element) {
                                                        const headerOffset = 80;
                                                        const elementPosition = element.getBoundingClientRect().top;
                                                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                                        
                                                        window.scrollTo({
                                                            top: offsetPosition,
                                                            behavior: 'smooth'
                                                        });
                                                    } else if (attempts < 10) {
                                                        scrollToSection(attempts + 1);
                                                    }
                                                }, attempts === 0 ? 100 : 200);
                                            };
                                            
                                            scrollToSection();
                                        }
                                    }}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* 코스 배너 버튼 */}
                            <div className={`pt-4 mt-2 space-y-3 border-t ${
                                isScrolled ? 'border-gray-700' : 'border-gray-200'
                            }`}>
                                <Link
                                    href="/basic-course"
                                    className="block w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all text-center cursor-pointer shadow-lg"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        if (typeof window !== 'undefined') {
                                            setTimeout(() => {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }, 100);
                                        }
                                    }}
                                >
                                    Basic Course
                                </Link>
                                <Link
                                    href="/advanced-course"
                                    className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all text-center cursor-pointer shadow-lg"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        if (typeof window !== 'undefined') {
                                            setTimeout(() => {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }, 100);
                                        }
                                    }}
                                >
                                    Advanced Course
                                </Link>
                                <Link
                                    href="/airrobot-course"
                                    className="block w-full px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all text-center cursor-pointer shadow-lg"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        if (typeof window !== 'undefined') {
                                            setTimeout(() => {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }, 100);
                                        }
                                    }}
                                >
                                    AirRobot Course
                                </Link>
                            </div>
                        </div>
                    )}
            </div>
        </header>
    );
}

