'use client';

import { MapPin, Phone, Mail, Facebook, Instagram, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import ScrollAnimation from './ScrollAnimation';

export default function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-gray-900 text-white py-20 border-t border-gray-800 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-deep-electric-blue via-active-orange to-neon-purple animate-gradient-slow"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <div className="grid md:grid-cols-3 gap-12">
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
                                    className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-deep-electric-blue transition-all transform hover:scale-110 hover:rotate-12 group/social"
                                >
                                    <Facebook size={20} className="group-hover/social:animate-bounce" />
                                </a>
                                <a
                                    href="https://www.instagram.com/pysical_ai_robotplay/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-neon-purple transition-all transform hover:scale-110 hover:rotate-12 group/social"
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
                                    { icon: MapPin, text: '충청남도 천안시 서북구... (상세 주소)', href: '#' },
                                    { icon: Phone, text: '010-1234-5678', href: 'tel:010-1234-5678' },
                                    { icon: Mail, text: 'contact@robotplay.com', href: 'mailto:contact@robotplay.com' },
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <li
                                            key={index}
                                            className="flex items-start gap-3 text-gray-400 group hover:text-white transition-all cursor-pointer"
                                        >
                                            <Icon size={20} className="mt-1 flex-shrink-0 group-hover:text-deep-electric-blue transition-colors group-hover:scale-110" />
                                            <a href={item.href} className="hover:translate-x-1 transition-transform">
                                                {item.text}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </ScrollAnimation>

                    {/* Map Placeholder */}
                    <ScrollAnimation direction="up" delay={300}>
                        <div className="bg-gray-800 rounded-xl h-48 flex items-center justify-center text-gray-500 relative overflow-hidden group cursor-pointer hover:bg-gray-700 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-deep-electric-blue/20 to-active-orange/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative z-10 group-hover:scale-110 transition-transform">Map Area</span>
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
                    className="fixed bottom-8 right-8 w-14 h-14 bg-deep-electric-blue hover:bg-active-orange text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95 z-50 group"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                </button>
            )}
        </footer>
    );
}
