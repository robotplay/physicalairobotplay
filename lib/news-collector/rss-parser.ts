/**
 * RSS 피드 파싱 유틸리티
 */
import Parser from 'rss-parser';
import { logger } from '../logger';
import type { RSSFeedSource, CollectedNewsArticle } from '@/types';

const parser = new Parser({
    customFields: {
        item: [
            ['content:encoded', 'contentEncoded'],
            ['media:content', 'mediaContent'],
            ['media:thumbnail', 'mediaThumbnail'],
        ],
    },
});

export interface RSSItem {
    title: string;
    link: string;
    pubDate?: string;
    content?: string;
    contentSnippet?: string;
    contentEncoded?: string;
    mediaContent?: string;
    mediaThumbnail?: string;
    enclosure?: {
        url: string;
        type?: string;
    };
}

/**
 * RSS 피드에서 기사 목록을 가져옵니다.
 */
export async function fetchRSSFeed(feedUrl: string): Promise<RSSItem[]> {
    try {
        logger.log(`RSS 피드 수집 시작: ${feedUrl}`);
        
        const feed = await parser.parseURL(feedUrl);
        
        if (!feed.items || feed.items.length === 0) {
            logger.warn(`RSS 피드에 항목이 없습니다: ${feedUrl}`);
            return [];
        }

        const items: RSSItem[] = feed.items.map((item) => ({
            title: item.title || '',
            link: item.link || '',
            pubDate: item.pubDate,
            content: item.content || item.contentSnippet || '',
            contentSnippet: item.contentSnippet || '',
            contentEncoded: (item as unknown as { contentEncoded?: string }).contentEncoded,
            mediaContent: (item as unknown as { mediaContent?: string }).mediaContent,
            mediaThumbnail: (item as unknown as { mediaThumbnail?: string }).mediaThumbnail,
            enclosure: item.enclosure ? {
                url: item.enclosure.url || '',
                type: item.enclosure.type,
            } : undefined,
        }));

        logger.log(`RSS 피드에서 ${items.length}개 항목 수집 완료: ${feedUrl}`);
        return items;
    } catch (error) {
        logger.error(`RSS 피드 수집 실패: ${feedUrl}`, error);
        throw error;
    }
}

/**
 * RSS 항목에서 이미지 URL을 추출합니다.
 */
export function extractImageUrl(item: RSSItem): string | undefined {
    // 1. mediaThumbnail 우선
    if (item.mediaThumbnail) {
        return item.mediaThumbnail;
    }

    // 2. mediaContent
    if (item.mediaContent) {
        return item.mediaContent;
    }

    // 3. enclosure (이미지 타입인 경우)
    if (item.enclosure && item.enclosure.type?.startsWith('image/')) {
        return item.enclosure.url;
    }

    // 4. content에서 이미지 태그 추출
    if (item.content || item.contentEncoded) {
        const content = item.content || item.contentEncoded || '';
        const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch && imgMatch[1]) {
            return imgMatch[1];
        }
    }

    return undefined;
}

/**
 * RSS 항목을 CollectedNewsArticle 형식으로 변환합니다.
 */
export function convertRSSItemToArticle(
    item: RSSItem,
    source: RSSFeedSource,
    keywords: string[]
): Partial<CollectedNewsArticle> {
    const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
    const imageUrl = extractImageUrl(item);
    
    // content에서 HTML 태그 제거하여 excerpt 생성
    const contentText = (item.content || item.contentEncoded || item.contentSnippet || '')
        .replace(/<[^>]*>/g, '')
        .trim();
    const excerpt = contentText.length > 200 
        ? contentText.substring(0, 200) + '...' 
        : contentText;

    return {
        title: item.title || '제목 없음',
        content: item.content || item.contentEncoded || item.contentSnippet || '',
        excerpt,
        source: source.name,
        sourceUrl: item.link || '',
        imageUrl,
        publishedAt,
        collectedAt: new Date(),
        keywords,
        category: 'general', // 기본값, 나중에 관련성 점수로 결정
        relevanceScore: 0, // 나중에 계산
        isActive: true,
        viewCount: 0,
    };
}

