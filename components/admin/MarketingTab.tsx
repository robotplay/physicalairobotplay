'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, Users, TrendingUp, BarChart3, Plus, Eye, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Subscriber {
    _id: string;
    email: string;
    name: string;
    status: string;
    subscribedAt: string;
}

interface Campaign {
    _id: string;
    type: string;
    title: string;
    recipientCount: number;
    status: string;
    successCount?: number;
    failedCount?: number;
    createdAt: string;
    sentAt?: string;
}

interface SocialPost {
    _id: string;
    contentType: string;
    title: string;
    platforms: string[];
    status: string;
    createdAt: string;
    postedAt?: string;
}

export default function MarketingTab() {
    const [activeSubTab, setActiveSubTab] = useState<'newsletter' | 'campaigns' | 'social'>('newsletter');
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [showSubscriberModal, setShowSubscriberModal] = useState(false);
    
    // 캠페인 폼 상태
    const [campaignForm, setCampaignForm] = useState({
        type: 'newsletter',
        title: '',
        content: '',
        description: '',
        imageUrl: '',
        ctaText: '',
        ctaUrl: '',
        recipientType: 'all',
        testEmails: '',
    });

    useEffect(() => {
        loadData();
    }, [activeSubTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeSubTab === 'newsletter') {
                const response = await fetch('/api/newsletter/subscribers');
                const result = await response.json();
                if (result.success) {
                    setSubscribers(result.data.subscribers || []);
                }
            } else if (activeSubTab === 'campaigns') {
                const response = await fetch('/api/marketing/campaigns');
                const result = await response.json();
                if (result.success) {
                    setCampaigns(result.data.campaigns || []);
                }
            } else if (activeSubTab === 'social') {
                const response = await fetch('/api/marketing/social');
                const result = await response.json();
                if (result.success) {
                    setSocialPosts(result.data.posts || []);
                }
            }
        } catch (error) {
            console.error('데이터 로드 오류:', error);
            toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload: any = {
                type: campaignForm.type,
                title: campaignForm.title,
                content: campaignForm.content,
                recipientType: campaignForm.recipientType,
            };

            if (campaignForm.type === 'promotion') {
                payload.description = campaignForm.description;
                payload.imageUrl = campaignForm.imageUrl;
                payload.ctaText = campaignForm.ctaText;
                payload.ctaUrl = campaignForm.ctaUrl;
            }

            if (campaignForm.recipientType === 'test') {
                payload.testEmails = campaignForm.testEmails.split(',').map((e) => e.trim()).filter(Boolean);
            }

            const response = await fetch('/api/marketing/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                toast.success('캠페인이 생성되었습니다.');
                setShowCampaignModal(false);
                setCampaignForm({
                    type: 'newsletter',
                    title: '',
                    content: '',
                    description: '',
                    imageUrl: '',
                    ctaText: '',
                    ctaUrl: '',
                    recipientType: 'all',
                    testEmails: '',
                });
                loadData();
            } else {
                toast.error(result.error || '캠페인 생성에 실패했습니다.');
            }
        } catch (error) {
            console.error('캠페인 생성 오류:', error);
            toast.error('캠페인 생성 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const activeSubscribers = subscribers.filter((s) => s.status === 'active').length;

    return (
        <div className="space-y-6">
            {/* 서브 탭 */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveSubTab('newsletter')}
                    className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                        activeSubTab === 'newsletter'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        뉴스레터 구독자 ({activeSubscribers})
                    </div>
                </button>
                <button
                    onClick={() => setActiveSubTab('campaigns')}
                    className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                        activeSubTab === 'campaigns'
                            ? 'border-green-600 text-green-600 dark:text-green-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        이메일 캠페인 ({campaigns.length})
                    </div>
                </button>
                <button
                    onClick={() => setActiveSubTab('social')}
                    className={`px-4 py-2 font-semibold transition-colors border-b-2 ${
                        activeSubTab === 'social'
                            ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                            : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        소셜 미디어 ({socialPosts.length})
                    </div>
                </button>
            </div>

            {/* 뉴스레터 구독자 */}
            {activeSubTab === 'newsletter' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">구독자 목록</h3>
                        <button
                            onClick={() => setShowSubscriberModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            수동 추가
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                            <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
                        </div>
                    ) : subscribers.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg">
                            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">구독자가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">이메일</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">이름</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">상태</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">구독일</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {subscribers.map((subscriber) => (
                                            <tr key={subscriber._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{subscriber.email}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{subscriber.name || '-'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        subscriber.status === 'active'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}>
                                                        {subscriber.status === 'active' ? '활성' : '구독 취소'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(subscriber.subscribedAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 이메일 캠페인 */}
            {activeSubTab === 'campaigns' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">캠페인 목록</h3>
                        <button
                            onClick={() => setShowCampaignModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            새 캠페인
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
                            <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg">
                            <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">캠페인이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {campaigns.map((campaign) => (
                                <div key={campaign._id} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{campaign.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {campaign.type === 'newsletter' ? '뉴스레터' : '프로모션'}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 text-sm rounded-full ${
                                            campaign.status === 'completed'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : campaign.status === 'sending'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                            {campaign.status === 'completed' ? '완료' : campaign.status === 'sending' ? '발송 중' : '실패'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">수신자</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{campaign.recipientCount.toLocaleString()}명</p>
                                        </div>
                                        {campaign.successCount !== undefined && (
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">성공</p>
                                                <p className="font-bold text-green-600 dark:text-green-400">{campaign.successCount.toLocaleString()}건</p>
                                            </div>
                                        )}
                                        {campaign.failedCount !== undefined && (
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">실패</p>
                                                <p className="font-bold text-red-600 dark:text-red-400">{campaign.failedCount.toLocaleString()}건</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-gray-500 dark:text-gray-400">생성일</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{formatDate(campaign.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 소셜 미디어 */}
            {activeSubTab === 'social' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">소셜 미디어 포스트</h3>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
                            <p className="text-gray-600 dark:text-gray-400">로딩 중...</p>
                        </div>
                    ) : socialPosts.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg">
                            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">소셜 미디어 포스트가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {socialPosts.map((post) => (
                                <div key={post._id} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{post.title}</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{post.contentType}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-sm rounded-full ${
                                            post.status === 'posted'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                            {post.status === 'posted' ? '게시됨' : '대기 중'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">플랫폼:</span>
                                        {post.platforms.map((platform) => (
                                            <span key={platform} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs">
                                                {platform}
                                            </span>
                                        ))}
                                        <span className="ml-auto text-gray-500 dark:text-gray-400">
                                            {formatDate(post.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 캠페인 생성 모달 */}
            {showCampaignModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">새 캠페인 생성</h3>
                            <button
                                onClick={() => setShowCampaignModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateCampaign} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">캠페인 타입</label>
                                <select
                                    value={campaignForm.type}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="newsletter">뉴스레터</option>
                                    <option value="promotion">프로모션</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">제목</label>
                                <input
                                    type="text"
                                    value={campaignForm.title}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">내용</label>
                                <textarea
                                    value={campaignForm.content}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, content: e.target.value })}
                                    rows={8}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    required
                                />
                            </div>

                            {campaignForm.type === 'promotion' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">설명</label>
                                        <textarea
                                            value={campaignForm.description}
                                            onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">이미지 URL</label>
                                        <input
                                            type="url"
                                            value={campaignForm.imageUrl}
                                            onChange={(e) => setCampaignForm({ ...campaignForm, imageUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CTA 텍스트</label>
                                        <input
                                            type="text"
                                            value={campaignForm.ctaText}
                                            onChange={(e) => setCampaignForm({ ...campaignForm, ctaText: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CTA URL</label>
                                        <input
                                            type="url"
                                            value={campaignForm.ctaUrl}
                                            onChange={(e) => setCampaignForm({ ...campaignForm, ctaUrl: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">수신자</label>
                                <select
                                    value={campaignForm.recipientType}
                                    onChange={(e) => setCampaignForm({ ...campaignForm, recipientType: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    required
                                >
                                    <option value="all">모든 구독자</option>
                                    <option value="test">테스트 이메일</option>
                                </select>
                            </div>

                            {campaignForm.recipientType === 'test' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">테스트 이메일 (쉼표로 구분)</label>
                                    <input
                                        type="text"
                                        value={campaignForm.testEmails}
                                        onChange={(e) => setCampaignForm({ ...campaignForm, testEmails: e.target.value })}
                                        placeholder="email1@example.com, email2@example.com"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCampaignModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                                >
                                    {isLoading ? '생성 중...' : '캠페인 생성'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

