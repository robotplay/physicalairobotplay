'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, UserPlus, Calendar, Trophy } from 'lucide-react';

interface AnalyticsData {
    summary: {
        totalStudents: number;
        activeStudents: number;
        revenue: number;
        newEnrollments: number;
        avgAttendanceRate: number;
        competitionWins: number;
    };
    monthlyData: Array<{
        year: number;
        month: number;
        revenue: number;
        newEnrollments: number;
    }>;
}

export default function AnalyticsTab() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const response = await fetch('/api/analytics');
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-deep-electric-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-600 dark:text-gray-400">데이터를 불러올 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">운영 분석 대시보드</h3>

            {/* 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">전체 학생</h4>
                        <Users className="w-5 h-5 text-deep-electric-blue" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.summary.totalStudents}명</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">매출</h4>
                        <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(data.summary.revenue)}</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">신규 등록</h4>
                        <UserPlus className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.summary.newEnrollments}명</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">평균 출석률</h4>
                        <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.summary.avgAttendanceRate}%</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">대회 수상</h4>
                        <Trophy className="w-5 h-5 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.summary.competitionWins}건</p>
                </div>
            </div>

            {/* 월별 데이터 테이블 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">월별 현황 (최근 12개월)</h4>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">월</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">매출</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">신규 등록</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.monthlyData.map((month, index) => (
                                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                        {month.year}년 {month.month}월
                                    </td>
                                    <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                                        {formatCurrency(month.revenue)}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                                        {month.newEnrollments}명
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

