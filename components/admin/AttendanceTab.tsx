'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Users, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface Student {
    _id: string;
    studentId: string;
    name: string;
    grade: string;
    class?: string;
}

interface AttendanceRecord {
    _id?: string;
    studentId: string;
    studentName: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
}

export default function AttendanceTab() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});
    const [loading, setLoading] = useState(false);

    // 반 목록
    const classOptions = [
        '월요일 1반', '월요일 2반', '월요일 3반',
        '화요일 1반', '화요일 2반', '화요일 3반',
        '수요일 1반', '수요일 2반', '수요일 3반',
        '목요일 1반', '목요일 2반', '목요일 3반',
        '금요일 1반', '금요일 2반', '금요일 3반',
        '토요일 대회1반', '토요일 대회2반',
    ];

    useEffect(() => {
        if (selectedClass) {
            loadStudents();
            loadAttendanceRecords();
        }
    }, [selectedClass, selectedDate]);

    const loadStudents = async () => {
        try {
            const response = await fetch('/api/students');
            const result = await response.json();
            if (result.success) {
                const classStudents = result.data.students.filter(
                    (s: Student) => s.class === selectedClass
                );
                setStudents(classStudents);

                // 초기 출석 상태 설정
                const initialRecords: Record<string, AttendanceRecord> = {};
                classStudents.forEach((student: Student) => {
                    initialRecords[student.studentId] = {
                        studentId: student.studentId,
                        studentName: student.name,
                        status: 'present',
                    };
                });
                setAttendanceRecords(initialRecords);
            }
        } catch (error) {
            console.error('Failed to load students:', error);
        }
    };

    const loadAttendanceRecords = async () => {
        try {
            const response = await fetch(
                `/api/attendance?classDate=${selectedDate}&class=${encodeURIComponent(selectedClass)}`
            );
            const result = await response.json();
            if (result.success && result.data.records.length > 0) {
                const records: Record<string, AttendanceRecord> = {};
                result.data.records.forEach((r: any) => {
                    records[r.studentId] = {
                        _id: r._id,
                        studentId: r.studentId,
                        studentName: r.studentName,
                        status: r.status,
                        notes: r.notes,
                    };
                });
                setAttendanceRecords(records);
            }
        } catch (error) {
            console.error('Failed to load attendance records:', error);
        }
    };

    const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
        setAttendanceRecords((prev) => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                studentId,
                studentName: prev[studentId]?.studentName || students.find(s => s.studentId === studentId)?.name || '',
                status,
            },
        }));
    };

    const handleSave = async () => {
        if (!selectedClass) {
            toast.error('반을 선택해주세요.');
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('출석 기록 저장 중...');

        try {
            const records = Object.values(attendanceRecords).map((record) => ({
                studentId: record.studentId,
                status: record.status,
                notes: record.notes || '',
            }));

            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    classDate: selectedDate,
                    studentClass: selectedClass,
                    records,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || '저장 실패');
            }

            toast.success('출석 기록이 저장되었습니다.', { id: loadingToast });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : '오류가 발생했습니다.', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string, isSelected: boolean = false) => {
        const baseClasses = isSelected ? 'w-5 h-5' : 'w-4 h-4';
        switch (status) {
            case 'present':
                return <CheckCircle className={`${baseClasses} ${isSelected ? 'text-green-700 dark:text-green-300' : 'text-green-600 dark:text-green-500'}`} />;
            case 'absent':
                return <XCircle className={`${baseClasses} ${isSelected ? 'text-red-700 dark:text-red-300' : 'text-red-600 dark:text-red-500'}`} />;
            case 'late':
                return <Clock className={`${baseClasses} ${isSelected ? 'text-yellow-700 dark:text-yellow-300' : 'text-yellow-600 dark:text-yellow-500'}`} />;
            case 'excused':
                return <Clock className={`${baseClasses} ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-blue-600 dark:text-blue-500'}`} />;
            default:
                return <CheckCircle className={`${baseClasses} text-gray-400`} />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'present':
                return '출석';
            case 'absent':
                return '결석';
            case 'late':
                return '지각';
            case 'excused':
                return '조퇴';
            default:
                return '출석';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">출결 관리</h3>
                <div className="flex gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                    />
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-deep-electric-blue focus:border-transparent"
                    >
                        <option value="">반 선택</option>
                        {classOptions.map((cls) => (
                            <option key={cls} value={cls}>
                                {cls}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={handleSave}
                        disabled={!selectedClass || loading}
                        className="flex items-center gap-2 px-4 py-2 bg-deep-electric-blue hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-all font-semibold"
                    >
                        <Save className="w-4 h-4" />
                        저장
                    </button>
                </div>
            </div>

            {!selectedClass ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">반을 선택해주세요</p>
                </div>
            ) : students.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">해당 반에 등록된 학생이 없습니다</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {selectedDate} - {selectedClass}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            총 {students.length}명
                        </p>
                    </div>

                    <div className="space-y-3">
                        {students.map((student) => {
                            const record = attendanceRecords[student.studentId] || {
                                studentId: student.studentId,
                                studentName: student.name,
                                status: 'present' as const,
                            };

                            return (
                                <div
                                    key={student.studentId}
                                    className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deep-electric-blue to-active-orange flex items-center justify-center">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-gray-900 dark:text-white">
                                                    {student.name}
                                                </h5>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {student.grade}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {(['present', 'absent', 'late', 'excused'] as const).map((status) => {
                                            const isSelected = record.status === status;
                                            return (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(student.studentId, status)}
                                                    className={`px-4 py-2.5 rounded-lg transition-all font-semibold text-sm flex items-center gap-1.5 ${
                                                        isSelected
                                                            ? status === 'present'
                                                                ? 'bg-green-500 dark:bg-green-600 text-white border-2 border-green-600 dark:border-green-500 shadow-lg shadow-green-500/30 scale-105'
                                                                : status === 'absent'
                                                                ? 'bg-red-500 dark:bg-red-600 text-white border-2 border-red-600 dark:border-red-500 shadow-lg shadow-red-500/30 scale-105'
                                                                : status === 'late'
                                                                ? 'bg-yellow-500 dark:bg-yellow-600 text-white border-2 border-yellow-600 dark:border-yellow-500 shadow-lg shadow-yellow-500/30 scale-105'
                                                                : 'bg-blue-500 dark:bg-blue-600 text-white border-2 border-blue-600 dark:border-blue-500 shadow-lg shadow-blue-500/30 scale-105'
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-transparent opacity-60'
                                                    }`}
                                                >
                                                    {getStatusIcon(status, isSelected)}
                                                    <span>{getStatusLabel(status)}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

