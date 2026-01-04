/**
 * RSS 피드 소스 관리
 */
import type { RSSFeedSource } from '@/types';

/**
 * 기본 RSS 피드 소스 목록
 * Google News 대신 실제 언론사 RSS를 사용하여 이미지 수집 성공률 향상
 */
export const DEFAULT_RSS_SOURCES: RSSFeedSource[] = [
    // Google News (보조)
    {
        id: 'google-news-physical-ai-robot',
        name: 'Google News - Physical AI Robot',
        url: 'https://news.google.com/rss/search?q=Physical+AI+Robot+OR+%EB%A1%9C%EB%B4%87+%EA%B5%90%EC%9C%A1+OR+AI+%EB%A1%9C%EB%B4%87&hl=ko&gl=KR&ceid=KR:ko',
        keywords: ['Physical AI Robot', '로봇 교육', 'AI 로봇', '로봇플레이', '로봇 코딩'],
        isActive: true,
    },
    // 연합뉴스 IT/과학
    {
        id: 'yonhap-it-science',
        name: '연합뉴스 - IT/과학',
        url: 'https://www.yna.co.kr/rss/itscience.xml',
        keywords: ['로봇', 'AI', '인공지능', '교육', '기술'],
        isActive: true,
    },
    // ZDNet Korea
    {
        id: 'zdnet-korea',
        name: 'ZDNet Korea',
        url: 'https://www.zdnet.co.kr/rss/news.xml',
        keywords: ['로봇', 'AI', '인공지능', '드론', '기술'],
        isActive: true,
    },
    // 전자신문
    {
        id: 'etnews',
        name: '전자신문',
        url: 'https://www.etnews.com/rss/S1N14.xml',
        keywords: ['로봇', 'AI', '인공지능', '교육', 'IT'],
        isActive: true,
    },
    // IT조선
    {
        id: 'it-chosun',
        name: 'IT조선',
        url: 'https://it.chosun.com/site/data/rss/rss.xml',
        keywords: ['로봇', 'AI', '인공지능', '기술', 'IT'],
        isActive: true,
    },
];

/**
 * 활성화된 RSS 피드 소스만 반환합니다.
 */
export function getActiveRSSSources(): RSSFeedSource[] {
    return DEFAULT_RSS_SOURCES.filter((source) => source.isActive);
}

/**
 * 특정 ID의 RSS 피드 소스를 찾습니다.
 */
export function findRSSSourceById(id: string): RSSFeedSource | undefined {
    return DEFAULT_RSS_SOURCES.find((source) => source.id === id);
}
