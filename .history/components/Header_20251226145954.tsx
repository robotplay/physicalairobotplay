'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

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

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'PAR 소개', href: '/#about' },
        { name: '커리큘럼', href: '/#roadmap' },
        { name: '강사진', href: '/#teachers' },
        { name: '성공 사례', href: '/#success' },
        { name: '온라인 특강', href: '/#courses' },
        { name: '소식', href: '/#news' },
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
                        <nav className="hidden lg:flex items-center gap-3 xl:gap-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center font-medium transition-colors text-sm xl:text-base whitespace-nowrap cursor-pointer ${
                                        isScrolled
                                            ? 'text-gray-300 active:text-deep-electric-blue hover:text-deep-electric-blue'
                                            : 'text-white active:text-deep-electric-blue hover:text-deep-electric-blue'
                                    }`}
                                    onClick={(e) => {
                                        const hash = item.href.split('#')[1];
                                        
                                        // If we're not on the home page, navigate first
                                        if (pathname !== '/') {
                                            e.preventDefault();
                                            
                                            // Navigate using Next.js router
                                            router.push(item.href);
                                            
                                            // Wait for navigation and component load, then scroll
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
                                                        // Retry up to 10 times for dynamic components
                                                        scrollToSection(attempts + 1);
                                                    }
                                                }, attempts === 0 ? 500 : 200);
                                            };
                                            
                                            if (hash) {
                                                scrollToSection();
                                            }
                                        } else {
                                            // If we're on the home page, scroll to the section
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
                                                            // Retry up to 10 times for dynamic components
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
                            <Link
                                href="/basic-course"
                                className="px-3 py-1.5 xl:px-4 xl:py-2 bg-active-orange active:bg-orange-600 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all transform active:scale-95 hover:scale-105 text-xs xl:text-sm touch-manipulation cursor-pointer"
                            >
                                Basic Course
                            </Link>
                            <Link
                                href="/advanced-course"
                                className="px-3 py-1.5 xl:px-4 xl:py-2 bg-deep-electric-blue active:bg-blue-700 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform active:scale-95 hover:scale-105 text-xs xl:text-sm touch-manipulation cursor-pointer"
                            >
                                Advanced Course
                            </Link>
                            <Link
                                href="/airrobot-course"
                                className="px-3 py-1.5 xl:px-4 xl:py-2 bg-gradient-to-r from-sky-400 to-blue-600 active:from-sky-500 active:to-blue-700 hover:from-sky-500 hover:to-blue-700 text-white font-semibold rounded-lg transition-all transform active:scale-95 hover:scale-105 text-xs xl:text-sm touch-manipulation cursor-pointer"
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
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block py-3 transition-colors px-4 cursor-pointer ${
                                    isScrolled
                                        ? 'text-gray-300 hover:text-deep-electric-blue'
                                        : 'text-white hover:text-deep-electric-blue'
                                }`}
                                onClick={(e) => {
                                    setIsMobileMenuOpen(false);
                                    const hash = item.href.split('#')[1];
                                    
                                    // If we're not on the home page, navigate first
                                    if (pathname !== '/') {
                                        e.preventDefault();
                                        
                                        // Navigate using Next.js router
                                        router.push(item.href);
                                        
                                        // Wait for navigation and component load, then scroll
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
                                                    // Retry up to 10 times for dynamic components
                                                    scrollToSection(attempts + 1);
                                                }
                                            }, attempts === 0 ? 500 : 200);
                                        };
                                        
                                        if (hash) {
                                            scrollToSection();
                                        }
                                    } else {
                                        // If we're on the home page, scroll to the section
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
                                                        // Retry up to 10 times for dynamic components
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
                        <div className={`pt-4 space-y-2 border-t ${
                            isScrolled ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                            <Link
                                href="/basic-course"
                                className="block w-full px-4 py-2 bg-active-orange hover:bg-orange-600 text-white font-semibold rounded-lg transition-all text-center cursor-pointer"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    // Ensure smooth navigation
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
                                className="block w-full px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-center cursor-pointer"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    // Ensure smooth navigation
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
                                className="block w-full px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-500 hover:to-blue-700 text-white font-semibold rounded-lg transition-all text-center cursor-pointer"
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    // Ensure smooth navigation
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

