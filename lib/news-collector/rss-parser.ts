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
    logger.log(`이미지 추출 시작: ${item.title}`);
    
    // 1. mediaThumbnail 우선
    if (item.mediaThumbnail) {
        const url = item.mediaThumbnail.trim();
        if (url && url.length > 0) {
            logger.log(`mediaThumbnail 발견: ${url}`);
            return url;
        }
    }

    // 2. mediaContent
    if (item.mediaContent) {
        const url = item.mediaContent.trim();
        if (url && url.length > 0) {
            logger.log(`mediaContent 발견: ${url}`);
            return url;
        }
    }

    // 3. enclosure (이미지 타입인 경우)
    if (item.enclosure) {
        const url = item.enclosure.url?.trim();
        if (url && url.length > 0) {
            // 타입이 명시되지 않았어도 URL이 이미지 확장자면 사용
            const isImageType = item.enclosure.type?.startsWith('image/') || 
                               /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url);
            if (isImageType) {
                logger.log(`enclosure 이미지 발견: ${url}`);
                return url;
            }
        }
    }

    // 4. content에서 이미지 태그 추출 (더 정확한 정규식)
    if (item.content || item.contentEncoded) {
        const content = item.content || item.contentEncoded || '';
        
        // 여러 이미지 태그 패턴 시도 (더 정확하게)
        const imgPatterns = [
            // 표준 img 태그 (src 속성)
            /<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/i,
            // src 속성만 있는 경우
            /<img[^>]+src\s*=\s*["']([^"']+)["']/i,
            // 따옴표 없는 경우
            /<img[^>]+src\s*=\s*([^\s>]+)/i,
            // 이미지 확장자 명시적 매칭
            /src\s*=\s*["']([^"']+\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?[^"']*)?)["']/i,
            // data-src, data-lazy-src 등 lazy loading 속성
            /<img[^>]+(?:data-src|data-lazy-src|data-original)\s*=\s*["']([^"']+)["']/i,
        ];
        
        // 첫 번째 이미지만 추출 (가장 큰 이미지 우선)
        let bestImageUrl: string | null = null;
        let bestImageSize = 0;
        
        for (const pattern of imgPatterns) {
            const matches = content.matchAll(new RegExp(pattern.source, 'gi'));
            for (const match of matches) {
                if (match[1]) {
                    let imageUrl = match[1].trim();
                    
                    // HTML 엔티티 디코딩
                    imageUrl = imageUrl
                        .replace(/&amp;/g, '&')
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, "'")
                        .replace(/&#x27;/g, "'")
                        .replace(/&#x2F;/g, '/');
                    
                    // 상대 URL을 절대 URL로 변환
                    if (imageUrl.startsWith('//')) {
                        imageUrl = 'https:' + imageUrl;
                    } else if (imageUrl.startsWith('/')) {
                        // 상대 경로인 경우 원본 링크의 도메인 사용
                        try {
                            const url = new URL(item.link);
                            imageUrl = url.origin + imageUrl;
                        } catch {
                            // URL 파싱 실패 시 그대로 사용
                        }
                    } else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('data:')) {
                        // 상대 경로인 경우
                        try {
                            const baseUrl = new URL(item.link);
                            imageUrl = new URL(imageUrl, baseUrl.origin).href;
                        } catch {
                            // URL 파싱 실패 시 그대로 사용
                        }
                    }
                    
                    // 유효한 URL인지 확인
                    if (imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:'))) {
                        // 이미지 크기 정보가 있으면 사용 (width, height 속성)
                        const imgTag = match[0];
                        const widthMatch = imgTag.match(/width\s*=\s*["']?(\d+)["']?/i);
                        const heightMatch = imgTag.match(/height\s*=\s*["']?(\d+)["']?/i);
                        const imageSize = (widthMatch ? parseInt(widthMatch[1]) : 0) * (heightMatch ? parseInt(heightMatch[1]) : 0);
                        
                        // 더 큰 이미지 우선 선택
                        if (!bestImageUrl || imageSize > bestImageSize) {
                            bestImageUrl = imageUrl;
                            bestImageSize = imageSize;
                        }
                    }
                }
            }
        }
        
        if (bestImageUrl) {
            logger.log(`content에서 이미지 추출 (크기: ${bestImageSize}): ${bestImageUrl}`);
            return bestImageUrl;
        }
    }

    // 5. Google News 특수 처리 - 링크에서 실제 기사 URL 추출 시도
    if (item.link && item.link.includes('news.google.com')) {
        try {
            // Google News 링크는 보통 실제 기사 URL을 포함함
            const url = new URL(item.link);
            const articleUrl = url.searchParams.get('url');
            if (articleUrl) {
                logger.log(`Google News에서 실제 기사 URL 추출: ${articleUrl}`);
                // 실제 기사 URL은 나중에 스크래핑할 수 있지만, 지금은 링크만 반환
                // 이미지는 실제 기사 페이지에서 추출해야 함
            }
        } catch {
            // URL 파싱 실패
        }
        logger.log(`Google News 링크 감지: ${item.link}`);
    }

    logger.log(`이미지 URL을 찾을 수 없음: ${item.title}`);
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
    
    // 본문 내용 우선순위: contentEncoded > content > contentSnippet
    // contentEncoded는 보통 전체 기사 내용을 포함
    const rawContent = item.contentEncoded || item.content || item.contentSnippet || '';
    
    // HTML 태그 제거하여 순수 텍스트 추출
    const contentText = rawContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // 스크립트 제거
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // 스타일 제거
        .replace(/<[^>]*>/g, '') // HTML 태그 제거
        .replace(/&nbsp;/g, ' ') // &nbsp;를 공백으로
        .replace(/&amp;/g, '&') // HTML 엔티티 디코딩
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#160;/g, ' ')
        .replace(/\s+/g, ' ') // 연속된 공백을 하나로
        .trim();
    
    // excerpt 생성 (더 길게 - 300-500자)
    const excerptLength = Math.min(500, Math.max(300, contentText.length));
    const excerpt = contentText.length > excerptLength 
        ? contentText.substring(0, excerptLength) + '...' 
        : contentText;

    return {
        title: item.title || '제목 없음',
        content: rawContent, // 원본 HTML 내용 저장
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

