/**
 * RSS 피드 파싱 유틸리티
 */
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
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
 * 기사 본문 페이지에서 이미지를 추출합니다. (Open Graph 등)
 */
async function fetchArticleImageFromPage(url: string): Promise<string | undefined> {
    if (!url || !url.startsWith('http')) return undefined;

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
        });

        if (!response.ok) return undefined;

        const html = await response.text();
        const $ = cheerio.load(html);

        // 1. Open Graph 이미지 (가장 정확함)
        const ogImage = $('meta[property="og:image"]').attr('content') || 
                        $('meta[name="og:image"]').attr('content') ||
                        $('meta[property="twitter:image"]').attr('content');
        if (ogImage) {
            logger.log(`페이지 분석에서 og:image 발견: ${ogImage}`);
            return ogImage;
        }

        // 2. 본문의 첫 번째 이미지
        let mainImage: string | undefined = undefined;
        $('article img, .article img, #article_body img, .post-content img').each((_, el) => {
            const src = $(el).attr('src');
            if (src && src.startsWith('http')) {
                mainImage = src;
                return false; // break
            }
        });

        if (mainImage) {
            logger.log(`페이지 분석에서 본문 이미지 발견: ${mainImage}`);
            return mainImage;
        }

        return undefined;
    } catch (error) {
        logger.error(`페이지 이미지 추출 실패 (${url}):`, error);
        return undefined;
    }
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

        const items: RSSItem[] = feed.items.map((item) => {
            // Google News의 경우 실제 기사 URL 추출
            let articleLink = item.link || '';
            if (articleLink.includes('news.google.com')) {
                try {
                    const url = new URL(articleLink);
                    const actualUrl = url.searchParams.get('url');
                    if (actualUrl) {
                        articleLink = actualUrl;
                        logger.log(`Google News 링크에서 실제 URL 추출: ${actualUrl}`);
                    }
                } catch {
                    // URL 파싱 실패 시 원본 링크 사용
                }
            }
            
            return {
                title: item.title || '',
                link: articleLink,
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
            };
        });

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
        const url = item.mediaThumbnail.trim();
        if (url && url.length > 0) return url;
    }

    // 2. mediaContent
    if (item.mediaContent) {
        const url = item.mediaContent.trim();
        if (url && url.length > 0) return url;
    }

    // 3. enclosure (이미지 타입인 경우)
    if (item.enclosure) {
        const url = item.enclosure.url?.trim();
        if (url && url.length > 0) {
            const isImageType = item.enclosure.type?.startsWith('image/') || 
                               /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url);
            if (isImageType) return url;
        }
    }

    // 4. content에서 이미지 태그 추출
    if (item.content || item.contentEncoded) {
        const content = item.content || item.contentEncoded || '';
        const imgMatch = content.match(/<img[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/i);
        if (imgMatch && imgMatch[1]) {
            let imageUrl = imgMatch[1].trim();
            if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
            return imageUrl;
        }
    }

    return undefined;
}

/**
 * RSS 항목을 CollectedNewsArticle 형식으로 변환합니다.
 */
export async function convertRSSItemToArticle(
    item: RSSItem,
    source: RSSFeedSource,
    keywords: string[]
): Promise<Partial<CollectedNewsArticle>> {
    const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
    
    // 1. RSS에서 이미지 추출 시도
    let imageUrl = extractImageUrl(item);
    
    // 2. RSS에 이미지가 없으면 실제 페이지 분석
    if (!imageUrl && item.link) {
        imageUrl = await fetchArticleImageFromPage(item.link);
    }
    
    // 본문 내용 우선순위: contentEncoded > content > contentSnippet
    const rawContent = item.contentEncoded || item.content || item.contentSnippet || '';
    
    // HTML 태그 제거하여 순수 텍스트 추출
    const contentText = rawContent
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
    
    // excerpt 생성
    const excerptLength = Math.min(500, Math.max(300, contentText.length));
    const excerpt = contentText.length > excerptLength 
        ? contentText.substring(0, excerptLength) + '...' 
        : contentText;

    // 출처명 추출
    let extractedSource = source.name;
    if (item.link) {
        try {
            const url = new URL(item.link);
            const hostname = url.hostname.toLowerCase();
            
            const sourceMap: Record<string, string> = {
                'chosun.com': '조선일보',
                'joongang.co.kr': '중앙일보',
                'donga.com': '동아일보',
                'hani.co.kr': '한겨레',
                'khan.co.kr': '경향신문',
                'mk.co.kr': '매일경제',
                'maeil.com': '매일경제',
                'hankyung.com': '한국경제',
                'seoul.co.kr': '서울신문',
                'munhwa.com': '문화일보',
                'segye.com': '세계일보',
                'yna.co.kr': '연합뉴스',
                'yonhapnews.co.kr': '연합뉴스',
                'newsis.com': '뉴시스',
                'edaily.co.kr': '이데일리',
                'asiae.co.kr': '아시아경제',
                'dt.co.kr': '디지털타임스',
                'etnews.com': '전자신문',
                'zdnet.co.kr': 'ZDNet',
                'itchosun.com': 'IT조선',
                'robotnews.co.kr': '로봇신문',
                'robot': '로봇신문',
                'robottimes': '로봇타임스',
                'aitimes': 'AI타임스'
            };

            for (const [domain, name] of Object.entries(sourceMap)) {
                if (hostname.includes(domain)) {
                    extractedSource = name;
                    break;
                }
            }
        } catch {
            // ignore
        }
    }

    return {
        title: item.title || '제목 없음',
        content: rawContent,
        excerpt,
        source: extractedSource,
        sourceUrl: item.link || '',
        imageUrl,
        publishedAt,
        collectedAt: new Date(),
        keywords,
        category: 'general',
        relevanceScore: 0,
        isActive: true,
        viewCount: 0,
    };
}
