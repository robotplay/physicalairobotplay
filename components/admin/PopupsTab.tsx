'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Popup } from '@/types';

export default function PopupsTab() {
    const [popups, setPopups] = useState<Popup[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
    const [formData, setFormData] = useState<Partial<Popup>>({
        title: '',
        content: '',
        type: 'modal',
        trigger: 'delay',
        triggerValue: 3,
        targetPages: [],
        ctaText: '',
        ctaUrl: '',
        imageUrl: '',
        position: 'center',
        showFrequency: 'once-per-session',
        priority: 1,
        isActive: true,
    });

    useEffect(() => {
        loadPopups();
    }, []);

    const loadPopups = async () => {
        try {
            const response = await fetch('/api/popups?admin=true');
            const result = await response.json();
            if (result.success) {
                setPopups(result.data.popups || []);
            }
        } catch (error) {
            console.error('Failed to load popups:', error);
            toast.error('팝업 목록을 불러오는데 실패했습니다');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingPopup ? `/api/popups/${editingPopup._id}` : '/api/popups';
            const method = editingPopup ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(editingPopup ? '팝업이 수정되었습니다' : '팝업이 추가되었습니다');
                setIsModalOpen(false);
                setEditingPopup(null);
                resetForm();
                loadPopups();
            } else {
                toast.error(result.error || '작업 실패');
            }
        } catch (error) {
            console.error('Popup save error:', error);
            toast.error('저장 중 오류가 발생했습니다');
        }
    };

    const handleEdit = (popup: Popup) => {
        setEditingPopup(popup);
        setFormData({
            title: popup.title,
            content: popup.content,
            type: popup.type,
            trigger: popup.trigger,
            triggerValue: popup.triggerValue,
            targetPages: popup.targetPages,
            ctaText: popup.ctaText,
            ctaUrl: popup.ctaUrl,
            imageUrl: popup.imageUrl,
            position: popup.position,
            showFrequency: popup.showFrequency,
            priority: popup.priority,
            isActive: popup.isActive,
            startDate: popup.startDate,
            endDate: popup.endDate,
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/popups/${id}`, { method: 'DELETE' });
            const result = await response.json();

            if (result.success) {
                toast.success('팝업이 삭제되었습니다');
                loadPopups();
            } else {
                toast.error(result.error || '삭제 실패');
            }
        } catch (error) {
            console.error('Popup delete error:', error);
            toast.error('삭제 중 오류가 발생했습니다');
        }
    };

    const toggleActive = async (popup: Popup) => {
        try {
            const response = await fetch(`/api/popups/${popup._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !popup.isActive }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(popup.isActive ? '팝업이 비활성화되었습니다' : '팝업이 활성화되었습니다');
                loadPopups();
            }
        } catch (error) {
            console.error('Toggle active error:', error);
            toast.error('상태 변경 실패');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            type: 'modal',
            trigger: 'delay',
            triggerValue: 3,
            targetPages: [],
            ctaText: '',
            ctaUrl: '',
            imageUrl: '',
            position: 'center',
            showFrequency: 'once-per-session',
            priority: 1,
            isActive: true,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">팝업 관리</h2>
                    <p className="text-gray-600 mt-1">프로모션 팝업과 배너를 관리합니다</p>
                </div>
                <button
                    onClick={() => {
                        setEditingPopup(null);
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    팝업 추가
                </button>
            </div>

            {/* Popups List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">타입</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">트리거</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">우선순위</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">작업</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {popups.map((popup) => (
                            <tr key={popup._id?.toString()}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {popup.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {popup.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {popup.trigger} {popup.triggerValue ? `(${popup.triggerValue})` : ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {popup.priority}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleActive(popup)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            popup.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {popup.isActive ? '활성' : '비활성'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => toggleActive(popup)}
                                        className="text-gray-600 hover:text-gray-900 mr-3"
                                    >
                                        {popup.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(popup)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(popup._id as string)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {popups.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        등록된 팝업이 없습니다
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                {editingPopup ? '팝업 수정' : '팝업 추가'}
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                                        <textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            rows={4}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">타입</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as Popup['type'] })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="modal">모달</option>
                                            <option value="banner">배너</option>
                                            <option value="slide-in">슬라이드</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">트리거</label>
                                        <select
                                            value={formData.trigger}
                                            onChange={(e) => setFormData({ ...formData, trigger: e.target.value as Popup['trigger'] })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="immediate">즉시</option>
                                            <option value="delay">지연(초)</option>
                                            <option value="exit-intent">이탈 의도</option>
                                            <option value="scroll">스크롤(%)</option>
                                        </select>
                                    </div>

                                    {(formData.trigger === 'delay' || formData.trigger === 'scroll') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">값</label>
                                            <input
                                                type="number"
                                                value={formData.triggerValue}
                                                onChange={(e) => setFormData({ ...formData, triggerValue: parseInt(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CTA 텍스트</label>
                                        <input
                                            type="text"
                                            value={formData.ctaText}
                                            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="지금 신청하기"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CTA URL</label>
                                        <input
                                            type="text"
                                            value={formData.ctaUrl}
                                            onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            placeholder="/landing/free-trial"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
                                        <input
                                            type="number"
                                            value={formData.priority}
                                            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">노출 빈도</label>
                                        <select
                                            value={formData.showFrequency}
                                            onChange={(e) => setFormData({ ...formData, showFrequency: e.target.value as Popup['showFrequency'] })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="always">항상</option>
                                            <option value="once-per-session">세션당 1회</option>
                                            <option value="once-per-day">하루 1회</option>
                                            <option value="once-per-week">주 1회</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setEditingPopup(null);
                                            resetForm();
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        {editingPopup ? '수정' : '추가'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

