'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Popup } from '@/types';

export default function PopupManager({ currentPage = '/' }: { currentPage?: string }) {
    const [popups, setPopups] = useState<Popup[]>([]);
    const [visiblePopupId, setVisiblePopupId] = useState<string | null>(null);

    useEffect(() => {
        loadPopups();
    }, [currentPage]);

    const loadPopups = async () => {
        try {
            const response = await fetch(`/api/popups?page=${currentPage}`);
            const result = await response.json();

            if (result.success) {
                const filteredPopups = (result.data.popups || []).filter((popup: Popup) => 
                    shouldShowPopup(popup)
                );
                setPopups(filteredPopups);

                // 가장 높은 우선순위 팝업 표시
                if (filteredPopups.length > 0) {
                    showPopupWithDelay(filteredPopups[0]);
                }
            }
        } catch (error) {
            console.error('Failed to load popups:', error);
        }
    };

    const shouldShowPopup = (popup: Popup): boolean => {
        const key = `popup-${popup.popupId}`;

        switch (popup.showFrequency) {
            case 'once-per-session':
                return !sessionStorage.getItem(key);
            case 'once-per-day':
                const lastShown = localStorage.getItem(key);
                if (!lastShown) return true;
                const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
                return daysSince >= 1;
            case 'once-per-week':
                const lastShownWeek = localStorage.getItem(key);
                if (!lastShownWeek) return true;
                const weeksSince = (Date.now() - parseInt(lastShownWeek)) / (1000 * 60 * 60 * 24 * 7);
                return weeksSince >= 1;
            case 'always':
            default:
                return true;
        }
    };

    const showPopupWithDelay = (popup: Popup) => {
        const delay = popup.trigger === 'delay' ? (popup.triggerValue || 0) * 1000 : 0;

        setTimeout(() => {
            setVisiblePopupId(popup.popupId);
            markPopupShown(popup);
        }, delay);
    };

    const markPopupShown = (popup: Popup) => {
        const key = `popup-${popup.popupId}`;
        const timestamp = Date.now().toString();

        if (popup.showFrequency === 'once-per-session') {
            sessionStorage.setItem(key, timestamp);
        } else {
            localStorage.setItem(key, timestamp);
        }
    };

    const closePopup = () => {
        setVisiblePopupId(null);
    };

    const visiblePopup = popups.find(p => p.popupId === visiblePopupId);

    if (!visiblePopup) return null;

    const positionClasses = {
        center: 'items-center justify-center',
        top: 'items-start justify-center pt-20',
        bottom: 'items-end justify-center pb-20',
        'top-right': 'items-start justify-end p-8',
        'bottom-right': 'items-end justify-end p-8',
    };

    return (
        <div 
            className={`fixed inset-0 z-50 flex ${positionClasses[visiblePopup.position || 'center']} ${
                visiblePopup.type === 'modal' ? 'bg-black/50' : ''
            }`}
            onClick={visiblePopup.type === 'modal' ? closePopup : undefined}
        >
            <div
                className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full mx-4 ${
                    visiblePopup.type === 'banner' ? 'max-w-full' : ''
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>

                {/* Image */}
                {visiblePopup.imageUrl && (
                    <img
                        src={visiblePopup.imageUrl}
                        alt={visiblePopup.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                )}

                {/* Content */}
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {visiblePopup.title}
                    </h2>
                    <div
                        className="text-gray-600 dark:text-gray-300 mb-6"
                        dangerouslySetInnerHTML={{ __html: visiblePopup.content }}
                    />

                    {/* CTA */}
                    {visiblePopup.ctaText && visiblePopup.ctaUrl && (
                        <a
                            href={visiblePopup.ctaUrl}
                            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={closePopup}
                        >
                            {visiblePopup.ctaText}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

