/**
 * 기사 관련성 점수 계산 유틸리티
 */
import { logger } from '../logger';
import type { CollectedNewsArticle } from '@/types';

// 매이저 신문사 목록 (우선 수집 대상)
const MAJOR_NEWSPAPERS = [
    '조선일보', 'chosun', 'Chosun',
    '중앙일보', 'joongang', 'JoongAng',
    '동아일보', 'donga', 'Donga',
    '한겨레', 'hani', 'Hani',
    '경향신문', 'khan', 'Khan',
    '매일경제', 'mk', 'Maeil',
    '한국경제', 'hankyung', 'Hankyung',
    '서울신문', 'seoul', 'Seoul',
    '문화일보', 'munhwa', 'Munhwa',
    '세계일보', 'segye', 'Segye',
    '연합뉴스', 'yna', 'Yonhap',
    '뉴시스', 'newsis', 'Newsis',
    '이데일리', 'edaily', 'Edaily',
    '아시아경제', 'asiae', 'Asiae',
    '디지털타임스', 'dt', 'DigitalTimes',
    '전자신문', 'etnews', 'ETNews',
    'ZDNet', 'zdnet',
    'IT조선', 'itchosun',
    '로봇신문', 'robot', 'Robot',
    '로봇타임스', 'robottimes',
    'AI타임스', 'aitimes',
    '교육부', 'Ministry of Education',
    '과학기술정보통신부', 'MSIT',
];

// 신뢰할 수 있는 출처 목록 (기존 + 매이저 신문사)
const TRUSTED_SOURCES = [
    ...MAJOR_NEWSPAPERS,
    '천안아산신문',
    '충청일보',
    '충청투데이',
];

/**
 * 기사의 관련성 점수를 계산합니다.
 * 
 * @param article 기사 데이터
 * @param keywords 검색 키워드 목록
 * @returns 관련성 점수 (0-100)
 */
export function calculateRelevanceScore(
    article: Partial<CollectedNewsArticle>,
    keywords: string[]
): number {
    let score = 0;
    const title = (article.title || '').toLowerCase();
    const content = (article.content || '').toLowerCase();
    const excerpt = (article.excerpt || '').toLowerCase();

    // 1. 제목에 키워드 포함 (최대 30점)
    keywords.forEach((keyword) => {
        const keywordLower = keyword.toLowerCase();
        if (title.includes(keywordLower)) {
            score += 30;
        }
    });

    // 2. 본문에 키워드 포함 (최대 20점)
    keywords.forEach((keyword) => {
        const keywordLower = keyword.toLowerCase();
        const matches = (content.match(new RegExp(keywordLower, 'g')) || []).length;
        score += Math.min(matches * 5, 20);
    });

    // 3. 요약에 키워드 포함 (최대 10점)
    keywords.forEach((keyword) => {
        const keywordLower = keyword.toLowerCase();
        if (excerpt.includes(keywordLower)) {
            score += 10;
        }
    });

    // 4. 출처 신뢰도 (최대 30점) - 매이저 신문사에 높은 점수
    const source = (article.source || '').toLowerCase();
    const sourceUpper = (article.source || '').trim();
    
    // 매이저 신문사 체크
    const isMajorNewspaper = MAJOR_NEWSPAPERS.some((major) => 
        source.includes(major.toLowerCase()) || sourceUpper.includes(major)
    );
    
    if (isMajorNewspaper) {
        score += 30; // 매이저 신문사는 높은 점수
    } else if (TRUSTED_SOURCES.some((trusted) => source.includes(trusted.toLowerCase()))) {
        score += 20; // 기타 신뢰할 수 있는 출처
    }

    // 5. 최근 기사 가산점 (최대 10점)
    if (article.publishedAt) {
        const publishedDate = typeof article.publishedAt === 'string' 
            ? new Date(article.publishedAt) 
            : article.publishedAt;
        const daysSincePublished = 
            (Date.now() - publishedDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSincePublished <= 1) {
            score += 10;
        } else if (daysSincePublished <= 7) {
            score += 7;
        } else if (daysSincePublished <= 30) {
            score += 3;
        }
    }

    // 6. 이미지 존재 여부 (최대 10점)
    if (article.imageUrl) {
        score += 10;
    }

    // 7. 본문 길이 가산점 (최대 10점) - 긴 기사 우선
    const contentText = (article.content || '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#160;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    if (contentText.length >= 2000) {
        score += 10; // 2000자 이상
    } else if (contentText.length >= 1000) {
        score += 7; // 1000자 이상
    } else if (contentText.length >= 500) {
        score += 5; // 500자 이상
    } else if (contentText.length >= 300) {
        score += 3; // 300자 이상
    }

    // 최대 100점으로 제한
    return Math.min(score, 100);
}

/**
 * 관련성 점수에 따라 카테고리를 결정합니다.
 */
export function determineCategory(
    article: Partial<CollectedNewsArticle>,
    score: number
): CollectedNewsArticle['category'] {
    const title = (article.title || '').toLowerCase();
    const content = (article.content || '').toLowerCase();

    // 카테고리별 키워드
    const educationKeywords = ['교육', '학원', '수업', '학생', '학교', '교육부'];
    const technologyKeywords = ['기술', 'AI', '인공지능', '로봇', '드론', '코딩', '프로그래밍'];
    const competitionKeywords = ['대회', '경진', '수상', '우수', '상', '대상'];

    // 키워드 매칭으로 카테고리 결정
    if (competitionKeywords.some((kw) => title.includes(kw) || content.includes(kw))) {
        return 'competition';
    }
    if (educationKeywords.some((kw) => title.includes(kw) || content.includes(kw))) {
        return 'education';
    }
    if (technologyKeywords.some((kw) => title.includes(kw) || content.includes(kw))) {
        return 'technology';
    }

    return 'general';
}

