'use client';

import { useState, useEffect } from 'react';
import { Trophy, Plus, Edit2, Trash2, Users, Calendar, MapPin, Award, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import type { CompetitionData, CompetitionTeam } from '@/types';

// Form data type (dates as strings for form inputs)
interface CompetitionFormData {
    name?: string;
    type?: 'local' | 'national' | 'international';
    startDate?: string;
    endDate?: string;
    registrationDeadline?: string;
    description?: string;
    requirements?: string;
    location?: string;
    maxTeams?: number;
    status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    teams?: CompetitionTeam[];
}

export default function CompetitionsTab() {
    const [competitions, setCompetitions] = useState<CompetitionData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompetition, setEditingCompetition] = useState<CompetitionData | null>(null);

    const [formData, setFormData] = useState<CompetitionFormData>({
        name: '',
        type: 'local',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        description: '',
        requirements: '',
        location: '',
        maxTeams: 0,
        status: 'upcoming',
        teams: [],
    });

    useEffect(() => {
        loadCompetitions();
    }, []);

    const loadCompetitions = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/competitions', {
                credentials: 'include',
            });
            const result = await response.json();

            if (result.success) {
                setCompetitions(result.data.competitions || []);
            }
        } catch (error) {
            console.error('대회 목록 로딩 실패:', error);
            toast.error('대회 목록을 불러오는데 실패했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (competition?: CompetitionData) => {
        if (competition) {
            setEditingCompetition(competition);
            setFormData({
                name: competition.name,
                type: competition.type,
                startDate: new Date(competition.startDate).toISOString().split('T')[0],
                endDate: new Date(competition.endDate).toISOString().split('T')[0],
                registrationDeadline: new Date(competition.registrationDeadline).toISOString().split('T')[0],
                description: competition.description,
                requirements: competition.requirements || '',
                location: competition.location || '',
                maxTeams: competition.maxTeams || 0,
                status: competition.status,
                teams: competition.teams || [],
            });
        } else {
            setEditingCompetition(null);
            setFormData({
                name: '',
                type: 'local',
                startDate: '',
                endDate: '',
                registrationDeadline: '',
                description: '',
                requirements: '',
                location: '',
                maxTeams: 0,
                status: 'upcoming',
                teams: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCompetition(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingCompetition
                ? `/api/competitions/${editingCompetition._id}`
                : '/api/competitions';
            
            const method = editingCompetition ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(editingCompetition ? '대회가 수정되었습니다' : '대회가 등록되었습니다');
                handleCloseModal();
                loadCompetitions();
            } else {
                toast.error(result.error || '대회 저장 실패');
            }
        } catch (error) {
            console.error('대회 저장 실패:', error);
            toast.error('대회 저장 중 오류가 발생했습니다');
        }
    };

    const handleDelete = async (competitionId: string) => {
        if (!confirm('정말 이 대회를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/competitions/${competitionId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await response.json();

            if (result.success) {
                toast.success('대회가 삭제되었습니다');
                loadCompetitions();
            } else {
                toast.error(result.error || '대회 삭제 실패');
            }
        } catch (error) {
            console.error('대회 삭제 실패:', error);
            toast.error('대회 삭제 중 오류가 발생했습니다');
        }
    };

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            local: '지역',
            national: '전국',
            international: '국제',
        };
        return labels[type] || type;
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            upcoming: '예정',
            ongoing: '진행중',
            completed: '종료',
            cancelled: '취소',
        };
        return labels[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return colors[status] || '';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">대회 관리</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        로봇 대회 등록 및 관리
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    새 대회 등록
                </button>
            </div>

            {/* 대회 목록 */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">로딩 중...</p>
                </div>
            ) : competitions.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                    <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        등록된 대회가 없습니다
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        새로운 대회를 등록해보세요
                    </p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        대회 등록하기
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {competitions.map((competition) => (
                        <div
                            key={competition._id}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                        >
                            <div className="p-6">
                                {/* 상태 및 타입 배지 */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(competition.status)}`}>
                                        {getStatusLabel(competition.status)}
                                    </span>
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                        {getTypeLabel(competition.type)}
                                    </span>
                                </div>

                                {/* 대회명 */}
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                    {competition.name}
                                </h3>

                                {/* 정보 */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(competition.startDate).toLocaleDateString('ko-KR')} ~{' '}
                                        {new Date(competition.endDate).toLocaleDateString('ko-KR')}
                                    </div>
                                    {competition.location && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                            {competition.location}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Users className="w-4 h-4" />
                                        팀: {competition.teams?.length || 0}
                                        {competition.maxTeams ? ` / ${competition.maxTeams}` : ''}
                                    </div>
                                </div>

                                {/* 액션 버튼 */}
                                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => handleOpenModal(competition)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(competition._id!)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 대회 등록/수정 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingCompetition ? '대회 수정' : '새 대회 등록'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* 대회명 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    대회명 *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            {/* 대회 타입 및 상태 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        대회 타입 *
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="local">지역</option>
                                        <option value="national">전국</option>
                                        <option value="international">국제</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        상태
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="upcoming">예정</option>
                                        <option value="ongoing">진행중</option>
                                        <option value="completed">종료</option>
                                        <option value="cancelled">취소</option>
                                    </select>
                                </div>
                            </div>

                            {/* 날짜 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        시작일 *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        종료일 *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        신청 마감일 *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.registrationDeadline}
                                        onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* 장소 및 최대 팀 수 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        장소
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="예: 서울 코엑스"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        최대 팀 수
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.maxTeams}
                                        onChange={(e) => setFormData({ ...formData, maxTeams: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        min="0"
                                        placeholder="0 = 무제한"
                                    />
                                </div>
                            </div>

                            {/* 설명 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    대회 설명 *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={4}
                                    required
                                />
                            </div>

                            {/* 참가 요건 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    참가 요건
                                </label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows={3}
                                    placeholder="예: 초등학생 이상, 팀 당 2-4명"
                                />
                            </div>

                            {/* 버튼 */}
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingCompetition ? '수정 완료' : '등록하기'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

