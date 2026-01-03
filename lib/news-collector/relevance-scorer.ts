/**
 * 기사 관련성 점수 계산 유틸리티
 */
import { logger } from '../logger';
import type { CollectedNewsArticle } from '@/types';

// 신뢰할 수 있는 출처 목록
const TRUSTED_SOURCES = [
    '천안아산신문',
    '충청일보',
    '충청투데이',
    '로봇신문',
    '로봇타임스',
    'AI타임스',
    '교육부',
    '과학기술정보통신부',
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

    // 4. 출처 신뢰도 (최대 20점)
    const source = (article.source || '').trim();
    if (TRUSTED_SOURCES.some((trusted) => source.includes(trusted))) {
        score += 20;
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

