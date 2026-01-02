'use client';

import { MapPin, Phone, Mail, Facebook, Instagram, ArrowUp, FileText, Mail as MailIcon, Check } from "lucide-react";
import { useState, useEffect } from "react";
import ScrollAnimation from './ScrollAnimation';
import toast from 'react-hot-toast';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsOfServiceModal from './TermsOfServiceModal';

export default function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterName, setNewsletterName] = useState('');
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

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

    const handleNewsletterSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            toast.error('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        setIsSubscribing(true);
        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newsletterEmail,
                    name: newsletterName || undefined,
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('뉴스레터 구독이 완료되었습니다!');
                setNewsletterEmail('');
                setNewsletterName('');
            } else {
                toast.error(result.error || '구독에 실패했습니다.');
            }
        } catch (error) {
            console.error('뉴스레터 구독 오류:', error);
            toast.error('구독 처리 중 오류가 발생했습니다.');
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <footer className="bg-gray-900 text-white py-12 sm:py-16 md:py-20 border-t border-gray-800 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-deep-electric-blue via-active-orange to-neon-purple animate-gradient-slow"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
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
                                    { icon: MapPin, text: '충청남도 천안시 서북구 불당동 불당34길 3-15 202호 불당동 탑프라자 로봇플레이', href: 'https://www.google.com/maps/search/?api=1&query=충청남도+천안시+서북구+불당동+불당34길+3-15+202호+불당동+탑프라자' },
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

                    {/* Newsletter */}
                    <ScrollAnimation direction="up" delay={300}>
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-gray-200">뉴스레터 구독</h3>
                            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                                최신 소식과 교육 정보를 이메일로 받아보세요.
                            </p>
                            <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
                                <input
                                    type="text"
                                    value={newsletterName}
                                    onChange={(e) => setNewsletterName(e.target.value)}
                                    placeholder="이름 (선택)"
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent transition-all"
                                />
                                <input
                                    type="email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="이메일 주소"
                                    required
                                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubscribing}
                                    className="w-full px-4 py-2.5 bg-gradient-to-r from-deep-electric-blue to-active-orange hover:from-blue-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubscribing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            구독 중...
                                        </>
                                    ) : (
                                        <>
                                            <MailIcon className="w-4 h-4" />
                                            구독하기
                                        </>
                                    )}
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-3">
                                언제든지 구독을 취소할 수 있습니다.
                            </p>
                        </div>
                    </ScrollAnimation>

                    {/* Map */}
                    <ScrollAnimation direction="up" delay={400}>
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold mb-4 text-gray-200">Location</h3>
                            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl group hover:shadow-2xl transition-all">
                                <div className="relative w-full h-48 sm:h-64 overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps?q=36.8063138,127.1051818&output=embed&zoom=17&hl=ko"
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
                                        href="https://www.google.com/maps/place/%EB%A1%9C%EB%B4%87%ED%94%8C%EB%A0%88%EC%9D%B4%ED%95%99%EC%9B%90/data=!3m1!4b1!4m6!3m5!1s0x357b27f1581ac50f:0xf4cc11247843af2!8m2!3d36.8063138!4d127.1051818!16s%2Fg%2F11ghrgthln?entry=ttu"
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

                <ScrollAnimation direction="fade" delay={500}>
                    <div className="border-t border-gray-800 mt-16 pt-8">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-gray-400 text-sm mb-4">
                            <button
                                onClick={() => setIsTermsModalOpen(true)}
                                className="hover:text-white transition-colors cursor-pointer"
                            >
                                이용약관
                            </button>
                            <span className="hidden sm:inline text-gray-600">|</span>
                            <button
                                onClick={() => setIsPrivacyModalOpen(true)}
                                className="hover:text-white transition-colors cursor-pointer"
                            >
                                개인정보처리방침
                            </button>
                        </div>
                        <div className="text-center text-gray-600 text-sm">
                            &copy; {new Date().getFullYear()} Physical AI Robot Play. All rights reserved.
                        </div>
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

            {/* Privacy Policy Modal */}
            <PrivacyPolicyModal 
                isOpen={isPrivacyModalOpen} 
                onClose={() => setIsPrivacyModalOpen(false)} 
            />

            {/* Terms of Service Modal */}
            <TermsOfServiceModal 
                isOpen={isTermsModalOpen} 
                onClose={() => setIsTermsModalOpen(false)} 
            />
        </footer>
    );
}
