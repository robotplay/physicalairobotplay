/**
 * RSS 피드 소스 관리
 */
import type { RSSFeedSource } from '@/types';

/**
 * 기본 RSS 피드 소스 목록
 * 이미지가 포함된 실제 언론사 RSS만 사용
 */
export const DEFAULT_RSS_SOURCES: RSSFeedSource[] = [
    // 연합뉴스 IT (이미지 포함 확률 높음)
    {
        id: 'yonhap-it',
        name: '연합뉴스',
        url: 'https://www.yna.co.kr/rss/internet.xml',
        keywords: ['로봇', 'AI', '인공지능', '교육', '기술', '드론'],
        isActive: true,
    },
    // ZDNet Korea (이미지 포함)
    {
        id: 'zdnet-all',
        name: 'ZDNet',
        url: 'https://www.zdnet.co.kr/rss/allnews.xml',
        keywords: ['로봇', 'AI', '인공지능', '드론', '기술', '교육'],
        isActive: true,
    },
    // 전자신문 로봇/AI (이미지 포함)
    {
        id: 'etnews-robot',
        name: '전자신문',
        url: 'https://www.etnews.com/rss/S1N1.xml',
        keywords: ['로봇', 'AI', '인공지능', '교육', 'IT', '드론'],
        isActive: true,
    },
    // 로봇신문 (로봇 전문 매체, 이미지 포함)
    {
        id: 'robot-news',
        name: '로봇신문',
        url: 'https://www.irobotnews.com/rss/allArticle.xml',
        keywords: ['로봇', 'AI', '인공지능', '교육', '대회', '드론'],
        isActive: true,
    },
    // 디지털타임스 (이미지 포함)
    {
        id: 'dt-it',
        name: '디지털타임스',
        url: 'https://www.dt.co.kr/rss/technology.xml',
        keywords: ['로봇', 'AI', '인공지능', '기술', '교육'],
        isActive: true,
    },
    // Google News는 비활성화 (이미지 없음)
    {
        id: 'google-news-backup',
        name: 'Google News',
        url: 'https://news.google.com/rss/search?q=Physical+AI+Robot+OR+%EB%A1%9C%EB%B4%87+%EA%B5%90%EC%9C%A1&hl=ko&gl=KR&ceid=KR:ko',
        keywords: ['Physical AI Robot', '로봇 교육', 'AI 로봇'],
        isActive: false, // 비활성화
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
