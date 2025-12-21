'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [paymentId, setPaymentId] = useState<string | null>(null);

    useEffect(() => {
        const id = searchParams.get('paymentId');
        setPaymentId(id);
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-[#1A1A1A] rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-700">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
                        결제가 완료되었습니다! 🎉
                    </h1>

                    {/* Message */}
                    <div className="text-center mb-8">
                        <p className="text-gray-300 text-lg mb-2">
                            제어 비행기 4주 특강 신청이 완료되었습니다.
                        </p>
                        {paymentId && (
                            <p className="text-gray-400 text-sm">
                                결제 번호: <span className="font-mono text-gray-300">{paymentId}</span>
                            </p>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
                        <h2 className="text-white font-semibold mb-4">다음 단계</h2>
                        <ul className="space-y-3 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>신청서가 접수되었습니다.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>결제가 완료되었습니다.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-blue-400 mt-1">→</span>
                                <span>곧 담당자가 연락드리겠습니다.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            className="flex-1 px-6 py-4 bg-gradient-to-r from-[#00A3FF] to-[#FF4D4D] hover:from-[#0088DD] hover:to-[#FF3333] text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            <Home className="w-5 h-5" />
                            홈으로 가기
                        </Link>
                        <Link
                            href="/program/airplane"
                            className="flex-1 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all border border-gray-700 hover:border-gray-600 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            상세 페이지 보기
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
