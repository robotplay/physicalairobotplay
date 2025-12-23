'use client';

import { MessageCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ChatButton() {
    const [isOpen, setIsOpen] = useState(false);

    // 카카오톡 채널 URL
    // 환경 변수에서 가져오거나 직접 설정
    // 카카오톡 채널 관리자 페이지에서 채널 URL을 복사하여 설정하세요
    const kakaoChannelUrl = process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL || 'https://pf.kakao.com/_your_channel_id';
    
    // 네이버 톡톡 URL
    // 네이버 톡톡 관리자 페이지에서 채널 URL을 복사하여 설정하세요
    const naverTalkUrl = process.env.NEXT_PUBLIC_NAVER_TALK_URL || 'https://talk.naver.com/your_channel_id';

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95 z-50 group cursor-pointer"
                aria-label="상담 채널 열기"
            >
                <MessageCircle className="w-7 h-7 group-hover:animate-bounce" />
            </button>

            {/* Chat Options Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Panel */}
                    <div className="fixed bottom-24 right-6 w-64 sm:w-72 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 z-50 animate-slide-up">
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">상담 채널</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                aria-label="닫기"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            {/* 카카오톡 상담 */}
                            <a
                                href={kakaoChannelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer group"
                            >
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm">카카오톡 상담</div>
                                    <div className="text-xs text-gray-700">실시간 1:1 상담</div>
                                </div>
                            </a>

                            {/* 네이버 톡톡 */}
                            <a
                                href={naverTalkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer group"
                            >
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 2C6.48 2 2 5.58 2 10c0 2.5 1.5 4.75 3.88 6.25L4 22l6.5-1.75C11.5 20.5 11.75 20.5 12 20.5c5.52 0 10-3.58 10-8S17.52 2 12 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm">네이버 톡톡</div>
                                    <div className="text-xs text-white/80">빠른 상담 응대</div>
                                </div>
                            </a>

                            {/* 전화 상담 */}
                            <a
                                href="tel:041-566-5345"
                                className="flex items-center gap-3 p-4 bg-deep-electric-blue hover:bg-blue-700 text-white rounded-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer group"
                            >
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm">전화 상담</div>
                                    <div className="text-xs text-white/80">041-566-5345</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
