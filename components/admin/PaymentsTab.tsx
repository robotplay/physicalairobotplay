'use client';

import { CreditCard, Phone, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface PaymentData {
    _id: string;
    paymentId: string;
    orderId: string;
    amount: number;
    orderName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: string;
    paymentMethod: string;
    timestamp: string;
    createdAt: string;
}

interface PaymentsTabProps {
    payments: PaymentData[];
    selectedPayment: PaymentData | null;
    onSelectPayment: (payment: PaymentData | null) => void;
}

export default function PaymentsTab({ payments, selectedPayment, onSelectPayment }: PaymentsTabProps) {
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

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('ko-KR').format(amount) + '원';
    };

    if (payments.length === 0) {
        return (
            <div className="text-center py-16 sm:py-20 bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-lg px-4">
                <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    아직 결제 내역이 없습니다
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    새로운 결제가 완료되면 여기에 표시됩니다
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* List */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {payments.map((payment) => (
                    <div
                        key={payment._id}
                        className={`bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 ${
                            selectedPayment?._id === payment._id
                                ? 'border-green-600'
                                : 'border-gray-200'
                        }`}
                        onClick={() => onSelectPayment(payment)}
                    >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                                            {payment.customerName}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(payment.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {payment.status === 'completed' ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                <span className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                                    {formatAmount(payment.amount)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                                <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-green-600" />
                                <span className="truncate font-medium">{payment.customerPhone}</span>
                            </div>
                            {payment.customerEmail && (
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-green-600" />
                                    <span className="truncate font-medium">{payment.customerEmail}</span>
                                </div>
                            )}
                            <div className="inline-block px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                                {payment.orderName}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail View */}
            <div className="lg:col-span-1">
                {selectedPayment ? (
                    <div className="sticky top-4 sm:top-8 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-xl border-2 border-gray-200 dark:border-gray-700">
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    결제 금액
                                </label>
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {formatAmount(selectedPayment.amount)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    결제 상태
                                </label>
                                <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    {selectedPayment.status === 'completed' ? (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold">
                                            <CheckCircle className="w-4 h-4" />
                                            완료
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-semibold">
                                            <XCircle className="w-4 h-4" />
                                            {selectedPayment.status}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    결제 ID
                                </label>
                                <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <span className="text-xs font-mono text-gray-900 dark:text-white">
                                        {selectedPayment.paymentId}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    주문명
                                </label>
                                <div className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {selectedPayment.orderName}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    고객 정보
                                </label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <a
                                            href={`tel:${selectedPayment.customerPhone}`}
                                            className="text-sm text-gray-900 dark:text-white font-medium cursor-pointer hover:text-green-600 transition-colors"
                                        >
                                            {selectedPayment.customerPhone}
                                        </a>
                                    </div>
                                    {selectedPayment.customerEmail && (
                                        <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
                                            <a
                                                href={`mailto:${selectedPayment.customerEmail}`}
                                                className="text-sm text-gray-900 dark:text-white font-medium cursor-pointer hover:text-green-600 transition-colors break-all"
                                            >
                                                {selectedPayment.customerEmail}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    결제 시간
                                </label>
                                <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium">
                                        {formatDate(selectedPayment.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="sticky top-4 sm:top-8 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-lg border-2 border-gray-200 dark:border-gray-700">
                        <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                            왼쪽에서 결제 내역을 선택하면<br className="hidden sm:block" />상세 내용을 볼 수 있습니다
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}










