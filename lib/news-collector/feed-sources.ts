/**
 * RSS 피드 소스 관리
 */
import type { RSSFeedSource } from '@/types';

/**
 * 기본 RSS 피드 소스 목록
 * 국내외 주요 언론사의 이미지 포함 RSS 피드
 */
export const DEFAULT_RSS_SOURCES: RSSFeedSource[] = [
    // === 국내 매체 ===
    
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

    // === 해외 매체 (로봇/AI 전문) ===
    
    // IEEE Spectrum - Robotics (세계 최고 로봇/엔지니어링 매체)
    {
        id: 'ieee-robotics',
        name: 'IEEE Spectrum',
        url: 'https://spectrum.ieee.org/feeds/feed.rss',
        keywords: ['robot', 'robotics', 'AI', 'automation', 'drone', 'physical AI'],
        isActive: true,
    },
    // TechCrunch - AI (세계 최대 기술 매체)
    {
        id: 'techcrunch-ai',
        name: 'TechCrunch',
        url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
        keywords: ['AI', 'robot', 'robotics', 'machine learning', 'automation'],
        isActive: true,
    },
    // VentureBeat - AI (AI 전문)
    {
        id: 'venturebeat-ai',
        name: 'VentureBeat',
        url: 'https://venturebeat.com/category/ai/feed/',
        keywords: ['AI', 'robot', 'robotics', 'machine learning', 'automation', 'physical AI'],
        isActive: true,
    },
    // MIT Technology Review (MIT 기술 리뷰)
    {
        id: 'mit-tech-review',
        name: 'MIT Technology Review',
        url: 'https://www.technologyreview.com/feed/',
        keywords: ['robot', 'AI', 'robotics', 'automation', 'technology', 'innovation'],
        isActive: true,
    },
    // The Verge - Science (기술/과학)
    {
        id: 'verge-science',
        name: 'The Verge',
        url: 'https://www.theverge.com/rss/index.xml',
        keywords: ['robot', 'AI', 'robotics', 'technology', 'science', 'automation'],
        isActive: true,
    },
    // Wired - AI (세계적 기술 매거진)
    {
        id: 'wired-ai',
        name: 'Wired',
        url: 'https://www.wired.com/feed/tag/ai/latest/rss',
        keywords: ['AI', 'robot', 'robotics', 'artificial intelligence', 'automation'],
        isActive: true,
    },
    // Engadget (기술 리뷰)
    {
        id: 'engadget',
        name: 'Engadget',
        url: 'https://www.engadget.com/rss.xml',
        keywords: ['robot', 'AI', 'robotics', 'technology', 'gadget', 'drone'],
        isActive: true,
    },
    // Ars Technica (기술 뉴스)
    {
        id: 'arstechnica',
        name: 'Ars Technica',
        url: 'https://feeds.arstechnica.com/arstechnica/index',
        keywords: ['robot', 'AI', 'robotics', 'technology', 'science'],
        isActive: true,
    },

    // === 백업 (비활성) ===
    
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
