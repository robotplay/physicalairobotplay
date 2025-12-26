'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2, Key, Database, User } from 'lucide-react';

export default function SetupPage() {
    const [loading, setLoading] = useState(false);
    const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string } | null>(null);
    const [adminStatus, setAdminStatus] = useState<{ hasAdmin: boolean; count: number } | null>(null);
    const [createResult, setCreateResult] = useState<any>(null);

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        setLoading(true);
        try {
            // DB 연결 확인
            const dbRes = await fetch('/api/verify-mongodb');
            const dbData = await dbRes.json();
            setDbStatus(dbData);

            // 관리자 계정 확인
            const adminRes = await fetch('/api/admin/init');
            const adminData = await adminRes.json();
            setAdminStatus(adminData);
        } catch (error) {
            console.error('Status check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const createAdmin = async () => {
        setLoading(true);
        setCreateResult(null);
        try {
            const res = await fetch('/api/admin/init', { method: 'POST' });
            const data = await res.json();
            setCreateResult(data);
            
            // 성공하면 상태 다시 확인
            if (data.success) {
                setTimeout(checkStatus, 1000);
            }
        } catch (error) {
            console.error('Admin creation failed:', error);
            setCreateResult({ success: false, error: '요청 중 오류가 발생했습니다.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900 p-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        시스템 설정
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        관리자 계정 생성 및 시스템 상태 확인
                    </p>
                </div>

                <div className="space-y-4">
                    {/* DB 연결 상태 */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                데이터베이스 연결
                            </h2>
                        </div>
                        {loading && !dbStatus ? (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>확인 중...</span>
                            </div>
                        ) : dbStatus ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    {dbStatus.connected ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span className={`font-semibold ${dbStatus.connected ? 'text-green-600' : 'text-red-600'}`}>
                                        {dbStatus.connected ? '연결됨' : '연결 실패'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {dbStatus.message}
                                </p>
                            </div>
                        ) : null}
                    </div>

                    {/* 관리자 계정 상태 */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <User className="w-6 h-6 text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                관리자 계정 상태
                            </h2>
                        </div>
                        {loading && !adminStatus ? (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>확인 중...</span>
                            </div>
                        ) : adminStatus ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    {adminStatus.hasAdmin ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-orange-600" />
                                    )}
                                    <span className={`font-semibold ${adminStatus.hasAdmin ? 'text-green-600' : 'text-orange-600'}`}>
                                        {adminStatus.hasAdmin 
                                            ? `관리자 계정 존재 (${adminStatus.adminCount}개)` 
                                            : '관리자 계정 없음'}
                                    </span>
                                </div>
                                {!adminStatus.hasAdmin && (
                                    <button
                                        onClick={createAdmin}
                                        disabled={loading}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                생성 중...
                                            </>
                                        ) : (
                                            <>
                                                <Key className="w-5 h-5" />
                                                초기 관리자 계정 생성
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* 생성 결과 */}
                    {createResult && (
                        <div className={`rounded-xl p-6 shadow-lg border ${
                            createResult.success 
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        }`}>
                            <div className="flex items-center gap-3 mb-3">
                                {createResult.success ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                    <XCircle className="w-6 h-6 text-red-600" />
                                )}
                                <h3 className={`text-lg font-bold ${
                                    createResult.success ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {createResult.success ? '계정 생성 성공!' : '생성 실패'}
                                </h3>
                            </div>
                            
                            {createResult.success && createResult.data ? (
                                <div className="space-y-2 bg-white dark:bg-gray-900 rounded-lg p-4">
                                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">아이디</span>
                                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                                            {createResult.data.username}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">비밀번호</span>
                                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                                            {createResult.data.temporaryPassword}
                                        </span>
                                    </div>
                                    <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                        <p className="text-sm text-orange-800 dark:text-orange-300">
                                            {createResult.data.notice}
                                        </p>
                                    </div>
                                    <a
                                        href="/admin/login"
                                        className="mt-4 block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg text-center transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        관리자 로그인 페이지로 이동 →
                                    </a>
                                </div>
                            ) : (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {createResult.error || createResult.message}
                                </p>
                            )}
                        </div>
                    )}

                    {/* 새로고침 버튼 */}
                    <button
                        onClick={checkStatus}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '확인 중...' : '상태 새로고침'}
                    </button>
                </div>

                {/* 도움말 */}
                <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">
                        💡 도움말
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                        <li>• 데이터베이스가 연결되지 않으면 MongoDB 설정을 확인하세요</li>
                        <li>• 관리자 계정이 없으면 "초기 관리자 계정 생성" 버튼을 클릭하세요</li>
                        <li>• 계정 생성 후 표시된 아이디/비밀번호로 로그인하세요</li>
                        <li>• 보안을 위해 로그인 후 반드시 비밀번호를 변경하세요</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

