/**
 * RSS 피드 소스 관리
 */
import type { RSSFeedSource } from '@/types';

/**
 * 기본 RSS 피드 소스 목록
 */
export const DEFAULT_RSS_SOURCES: RSSFeedSource[] = [
    {
        id: 'google-news-physical-ai-robot',
        name: 'Google News - Physical AI Robot',
        url: 'https://news.google.com/rss/search?q=Physical+AI+Robot+OR+%EB%A1%9C%EB%B4%87+%EA%B5%90%EC%9C%A1+OR+AI+%EB%A1%9C%EB%B4%87&hl=ko&gl=KR&ceid=KR:ko',
        keywords: ['Physical AI Robot', '로봇 교육', 'AI 로봇', '로봇플레이', '로봇 코딩'],
        isActive: true,
    },
    {
        id: 'google-news-robot-education',
        name: 'Google News - 로봇 교육',
        url: 'https://news.google.com/rss/search?q=%EB%A1%9C%EB%B4%87+%EA%B5%90%EC%9C%A1+OR+%EC%BD%94%EB%94%A9+%EA%B5%90%EC%9C%A1+OR+STEAM+%EA%B5%90%EC%9C%A1&hl=ko&gl=KR&ceid=KR:ko',
        keywords: ['로봇 교육', '코딩 교육', 'STEAM 교육', '로봇플레이'],
        isActive: true,
    },
    {
        id: 'google-news-robot-competition',
        name: 'Google News - 로봇 대회',
        url: 'https://news.google.com/rss/search?q=%EB%A1%9C%EB%B4%87+%EB%8C%80%ED%9A%8C+OR+%EB%A1%9C%EB%B4%87+%EA%B2%BD%EC%A7%84+OR+%EB%93%9C%EB%A1%A0+%EB%8C%80%ED%9A%8C&hl=ko&gl=KR&ceid=KR:ko',
        keywords: ['로봇 대회', '로봇 경진', '드론 대회', '로봇플레이'],
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

