'use client';

import { MapPin, Phone, Mail, Facebook, Instagram, ArrowUp, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import ScrollAnimation from './ScrollAnimation';

export default function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-gray-900 text-white py-12 sm:py-16 md:py-20 border-t border-gray-800 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-deep-electric-blue via-active-orange to-neon-purple animate-gradient-slow"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
                    {/* Brand */}
                    <ScrollAnimation direction="up" delay={100}>
                        <div className="group">
                            <h2 className="text-2xl font-bold mb-6 group-hover:text-deep-electric-blue transition-colors">Physical AI Robot Play</h2>
                            <p className="text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors">
                                우리는 아이들이 기술의 소비자가 아닌,<br />
                                창조자가 되길 바랍니다.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-deep-electric-blue transition-all transform hover:scale-110 hover:rotate-12 group/social cursor-pointer"
                                    aria-label="페이스북 페이지"
                                >
                                    <Facebook size={20} className="group-hover/social:animate-bounce" />
                                </a>
                                <a
                                    href="https://www.instagram.com/pysical_ai_robotplay/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-neon-purple transition-all transform hover:scale-110 hover:rotate-12 group/social cursor-pointer"
                                    aria-label="인스타그램 페이지"
                                >
                                    <Instagram size={20} className="group-hover/social:animate-bounce" />
                                </a>
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Contact */}
                    <ScrollAnimation direction="up" delay={200}>
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-gray-200">Contact Us</h3>
                            <ul className="space-y-4">
                                {[
                                    { icon: Phone, text: '041-566-5345', href: 'tel:041-566-5345' },
                                    { icon: Mail, text: 'hkj5345@gmail.com', href: 'mailto:hkj5345@gmail.com' },
                                    { icon: FileText, text: '사업자등록번호: 326-81-03489', href: null },
                                    { icon: FileText, text: '사업자명 주식회사 에이아이씨티', href: null },
                                    { icon: MapPin, text: '충청남도 아산시 탕정면 선문로221번길 70, 405호', href: 'https://www.google.com/maps/search/?api=1&query=충청남도+아산시+탕정면+선문로221번길+70' },
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <li
                                            key={index}
                                            className={`flex items-start gap-3 text-gray-400 group hover:text-white transition-all ${item.href ? 'cursor-pointer' : ''}`}
                                        >
                                            <Icon size={20} className="mt-1 flex-shrink-0 group-hover:text-deep-electric-blue transition-colors group-hover:scale-110" />
                                            {item.href ? (
                                                <a href={item.href} className="hover:translate-x-1 transition-transform cursor-pointer">
                                                    {item.text}
                                                </a>
                                            ) : (
                                                <span className="hover:translate-x-1 transition-transform">
                                                    {item.text}
                                                </span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </ScrollAnimation>

                    {/* Map */}
                    <ScrollAnimation direction="up" delay={300}>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold mb-4 text-gray-200">Location</h3>
                            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl group hover:shadow-2xl transition-all">
                                <div className="relative w-full h-48 sm:h-64 overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps?q=충청남도+천안시+서북구+불당동+불당34길+3-15+202호+불당동+탑프라자&output=embed&zoom=17&hl=ko"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="w-full h-full"
                                        title="Physical AI Robot Play 위치"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>
                                <div className="p-4 bg-gray-800/50 backdrop-blur-sm">
                                    <div className="flex items-start gap-2 text-sm text-gray-300">
                                        <MapPin className="w-4 h-4 text-deep-electric-blue flex-shrink-0 mt-0.5" />
                                        <span className="leading-relaxed">충청남도 천안시 서북구 불당동<br />불당34길 3-15 202호 불당동 탑프라자 로봇플레이</span>
                                    </div>
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=충청남도+천안시+서북구+불당동+불당34길+3-15+202호+불당동+탑프라자"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-flex items-center gap-2 text-xs text-deep-electric-blue hover:text-active-orange transition-colors cursor-pointer"
                                    >
                                        지도에서 크게 보기 →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>
                </div>

                <ScrollAnimation direction="fade" delay={400}>
                    <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} Physical AI Robot Play. All rights reserved.
                    </div>
                </ScrollAnimation>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-deep-electric-blue hover:bg-active-orange text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95 z-50 group cursor-pointer"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                </button>
            )}
        </footer>
    );
}
