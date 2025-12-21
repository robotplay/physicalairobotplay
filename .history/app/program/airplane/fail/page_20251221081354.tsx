'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailPage() {
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const errorParam = searchParams.get('error');
        setError(errorParam);
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-[#1A1A1A] rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-700">
                    {/* Error Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
                            <XCircle className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
                        결제에 실패했습니다
                    </h1>

                    {/* Error Message */}
                    <div className="text-center mb-8">
                        <p className="text-gray-300 text-lg mb-2">
                            결제 처리 중 문제가 발생했습니다.
                        </p>
                        {error && (
                            <p className="text-red-400 text-sm mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                                {decodeURIComponent(error)}
                            </p>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
                        <h2 className="text-white font-semibold mb-4">다시 시도해주세요</h2>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>카드 정보를 다시 확인해주세요.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>인터넷 연결을 확인해주세요.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>문제가 계속되면 고객센터로 문의해주세요.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/program/airplane"
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-[#00A3FF] to-[#FF4D4D] hover:from-[#0088DD] hover:to-[#FF3333] text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            <RefreshCw className="w-5 h-5" />
                            다시 시도하기
                        </Link>
                        <Link
                            href="/"
                            className="flex-1 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all border border-gray-700 hover:border-gray-600 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            홈으로 가기
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
