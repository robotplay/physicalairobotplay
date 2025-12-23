'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

const Footer = dynamic(() => import('@/components/Footer'), {
    loading: () => <div className="py-20" />,
    ssr: true,
});

export default function NewsPage() {
    // 실제로는 데이터베이스나 CMS에서 가져올 데이터
    const newsItems = [
        {
            id: 1,
            category: '공지사항',
            title: '2025년 봄학기 신규 수강생 모집 안내',
            date: '2025.01.15',
            content: '2025년 봄학기 신규 수강생을 모집합니다. Basic Course, Advanced Course, AirRobot Course 모두 모집 중입니다. 자세한 내용은 상담을 통해 안내해드립니다.',
            image: '/img/01.jpeg',
        },
        {
            id: 2,
            category: '대회 소식',
            title: 'IRO 국제로봇올림피아드 수상 소식',
            date: '2025.01.10',
            content: '우리 학원 학생들이 IRO 국제로봇올림피아드에서 우수한 성과를 거두었습니다. 금상 2명, 은상 3명, 동상 5명이 수상했습니다.',
            image: '/img/02.jpeg',
        },
        {
            id: 3,
            category: '교육 정보',
            title: '로봇 코딩 교육의 중요성',
            date: '2025.01.05',
            content: '4차 산업혁명 시대에 로봇 코딩 교육이 왜 중요한지, 그리고 우리 아이들에게 어떤 도움이 되는지에 대해 설명합니다.',
            image: '/img/03.jpeg',
        },
        {
            id: 4,
            category: '수업 스케치',
            title: '2024년 겨울 캠프 후기',
            date: '2024.12.28',
            content: '2024년 겨울 캠프가 성황리에 마무리되었습니다. 학생들의 열정과 성장하는 모습을 사진으로 담았습니다.',
            image: '/img/01.jpeg',
        },
    ];

    return (
        <main className="min-h-screen bg-[#1A1A1A] text-white">
            <div className="pt-20 sm:pt-24 pb-12 sm:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    {/* Header */}
                    <div className="text-center mb-12 sm:mb-16">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
                            소식 및 공지사항
                        </h1>
                        <p className="text-base sm:text-lg text-gray-300">
                            PAR Play의 최신 소식과 교육 정보를 확인하세요
                        </p>
                    </div>

                    {/* News Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {newsItems.map((item) => (
                            <article
                                key={item.id}
                                className="group bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700 hover:border-deep-electric-blue/50 cursor-pointer"
                            >
                                {/* Image */}
                                <div className="relative h-48 sm:h-56 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        quality={85}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-deep-electric-blue text-white text-xs font-semibold rounded-full">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                </div>

                                {/* Content */}
                                <div className="p-6 sm:p-8">
                                    <div className="text-xs sm:text-sm text-gray-400 mb-3">
                                        {item.date}
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-deep-electric-blue transition-colors">
                                        {item.title}
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-300 line-clamp-3">
                                        {item.content}
                                    </p>
                                    <div className="mt-4 text-deep-electric-blue text-sm font-semibold group-hover:translate-x-2 transition-transform">
                                        자세히 보기 →
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Pagination (추후 구현) */}
                    <div className="mt-12 sm:mt-16 text-center">
                        <div className="inline-flex gap-2">
                            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-deep-electric-blue transition-colors">
                                1
                            </button>
                            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                2
                            </button>
                            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                3
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
