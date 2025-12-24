'use client';

import { FileText, Phone, Mail, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';

interface RegistrationData {
    _id: string;
    id: string;
    studentName: string;
    grade: string;
    parentName: string;
    phone: string;
    email: string;
    program: string;
    programName: string;
    status: string;
    paymentStatus: string;
    timestamp: string;
    createdAt: string;
}

interface RegistrationsTabProps {
    registrations: RegistrationData[];
    selectedRegistration: RegistrationData | null;
    onSelectRegistration: (registration: RegistrationData | null) => void;
}

export default function RegistrationsTab({ registrations, selectedRegistration, onSelectRegistration }: RegistrationsTabProps) {
    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { label: string; color: string; icon: any }> = {
            'pending': { label: '대기중', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300', icon: Clock },
            'paid': { label: '결제완료', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: CheckCircle },
            'completed': { label: '완료', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', icon: CheckCircle },
            'cancelled': { label: '취소', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: XCircle },
        };
        return badges[status] || badges['pending'];
    };

    const getPaymentStatusBadge = (paymentStatus: string) => {
        const badges: Record<string, { label: string; color: string }> = {
            'unpaid': { label: '미결제', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' },
            'paid': { label: '결제완료', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
            'refunded': { label: '환불', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
        };
        return badges[paymentStatus] || badges['unpaid'];
    };

    if (registrations.length === 0) {
        return (
            <div className="text-center py-16 sm:py-20 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg px-4">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    아직 신청서가 없습니다
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    새로운 신청서가 접수되면 여기에 표시됩니다
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* List */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {registrations.map((registration) => {
                    const statusBadge = getStatusBadge(registration.status);
                    const paymentBadge = getPaymentStatusBadge(registration.paymentStatus);
                    const StatusIcon = statusBadge.icon;

                    return (
                        <div
                            key={registration._id}
                            className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                                selectedRegistration?._id === registration._id
                                    ? 'border-purple-600'
                                    : 'border-gray-200'
                            }`}
                            onClick={() => onSelectRegistration(registration)}
                        >
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                                                {registration.studentName} ({registration.grade})
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(registration.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusBadge.color}`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {statusBadge.label}
                                    </span>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${paymentBadge.color}`}>
                                        {paymentBadge.label}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                                    <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-purple-600" />
                                    <span className="truncate font-medium">보호자: {registration.parentName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-purple-600" />
                                    <span className="truncate font-medium">{registration.phone}</span>
                                </div>
                                {registration.email && (
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-purple-600" />
                                        <span className="truncate font-medium">{registration.email}</span>
                                    </div>
                                )}
                                <div className="inline-block px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                                    {registration.programName}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail View */}
            <div className="lg:col-span-1">
                {selectedRegistration ? (
                    <div className="sticky top-4 sm:top-8 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border-2 border-gray-200 dark:border-gray-700">
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    학생 정보
                                </label>
                                <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                                        {selectedRegistration.studentName} ({selectedRegistration.grade})
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    프로그램
                                </label>
                                <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {selectedRegistration.programName}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    상태
                                </label>
                                <div className="flex gap-2">
                                    {(() => {
                                        const statusBadge = getStatusBadge(selectedRegistration.status);
                                        const StatusIcon = statusBadge.icon;
                                        return (
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${statusBadge.color}`}>
                                                <StatusIcon className="w-4 h-4" />
                                                {statusBadge.label}
                                            </span>
                                        );
                                    })()}
                                    {(() => {
                                        const paymentBadge = getPaymentStatusBadge(selectedRegistration.paymentStatus);
                                        return (
                                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${paymentBadge.color}`}>
                                                {paymentBadge.label}
                                            </span>
                                        );
                                    })()}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    보호자 정보
                                </label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <User className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                                            {selectedRegistration.parentName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <Phone className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                        <a
                                            href={`tel:${selectedRegistration.phone}`}
                                            className="text-sm text-gray-900 dark:text-white font-medium cursor-pointer hover:text-purple-600 transition-colors"
                                        >
                                            {selectedRegistration.phone}
                                        </a>
                                    </div>
                                    {selectedRegistration.email && (
                                        <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <Mail className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                            <a
                                                href={`mailto:${selectedRegistration.email}`}
                                                className="text-sm text-gray-900 dark:text-white font-medium cursor-pointer hover:text-purple-600 transition-colors break-all"
                                            >
                                                {selectedRegistration.email}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    접수 시간
                                </label>
                                <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium">
                                        {formatDate(selectedRegistration.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="sticky top-4 sm:top-8 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                        <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                            왼쪽에서 신청서를 선택하면<br className="hidden sm:block" />상세 내용을 볼 수 있습니다
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}




