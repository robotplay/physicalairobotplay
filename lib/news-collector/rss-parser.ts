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
            ['enclosure', 'enclosure'],
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
 * URL이 유효한 이미지인지 확인합니다.
 */
function isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    
    // 너무 짧은 URL 제외
    if (url.length < 10) return false;
    
    // 구글 서비스 이미지 제외
    const googleDomains = ['googleusercontent.com', 'gstatic.com', 'google.com/images'];
    if (googleDomains.some(domain => url.includes(domain))) return false;
    
    // data: URL은 허용
    if (url.startsWith('data:image/')) return true;
    
    // http/https URL만 허용
    if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
    
    // 이미지 확장자 확인 (선택적)
    const hasImageExt = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$|#)/i.test(url);
    
    // 너무 작은 이미지 제외 (1x1 픽셀 트래커 등)
    const hasSuspiciousSize = /[?&](w|width|size)=(1|2|3|4|5)(&|$)/i.test(url);
    if (hasSuspiciousSize) return false;
    
    return true;
}

/**
 * Google News 리다이렉션 링크를 추적하여 실제 URL을 반환합니다.
 */
async function resolveActualUrl(url: string): Promise<string> {
    if (!url.includes('news.google.com')) return url;

    try {
        const fetch = (await import('node-fetch')).default;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
            method: 'HEAD', // HEAD 요청으로 더 빠르게
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            redirect: 'follow',
            signal: controller.signal as any,
        });
        
        clearTimeout(timeout);
        
        const finalUrl = response.url;
        if (finalUrl && finalUrl !== url && !finalUrl.includes('news.google.com')) {
            logger.log(`Google News 리다이렉션 해결: ${finalUrl}`);
            return finalUrl;
        }
    } catch (error) {
        logger.warn(`리다이렉션 추적 실패: ${url}`);
    }
    
    return url;
}

/**
 * 기사 본문 페이지에서 이미지를 추출합니다.
 */
async function fetchArticleImageFromPage(url: string): Promise<string | undefined> {
    if (!url || !url.startsWith('http')) return undefined;

    try {
        logger.log(`페이지 이미지 분석 시작: ${url}`);
        
        const fetch = (await import('node-fetch')).default;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10초로 증가

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            signal: controller.signal as any,
        });

        clearTimeout(timeout);

        if (!response.ok) {
            logger.warn(`페이지 응답 실패 (${response.status}): ${url}`);
            return undefined;
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const candidates: string[] = [];

        // 1. Open Graph 이미지 (가장 정확)
        const metaTags = [
            'meta[property="og:image"]',
            'meta[property="og:image:url"]',
            'meta[name="og:image"]',
            'meta[property="twitter:image"]',
            'meta[name="twitter:image"]',
            'meta[property="twitter:image:src"]',
            'meta[itemprop="image"]',
            'link[rel="image_src"]',
        ];

        for (const selector of metaTags) {
            const content = $(selector).attr('content') || $(selector).attr('href');
            if (content && isValidImageUrl(content)) {
                candidates.push(content);
                logger.log(`메타 태그에서 이미지 발견: ${content.substring(0, 80)}`);
            }
        }

        // 2. 본문의 주요 이미지
        const imgSelectors = [
            'article img',
            '.article img',
            '#article_body img',
            '.post-content img',
            '.story-content img',
            '.entry-content img',
            '.news-content img',
            '.article-body img',
            'figure img',
        ];

        for (const selector of imgSelectors) {
            $(selector).each((_, el) => {
                const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-original');
                if (src) {
                    let fullSrc = src;
                    // 상대 경로 처리
                    if (fullSrc.startsWith('//')) {
                        fullSrc = 'https:' + fullSrc;
                    } else if (fullSrc.startsWith('/')) {
                        const urlObj = new URL(url);
                        fullSrc = urlObj.origin + fullSrc;
                    }
                    
                    if (isValidImageUrl(fullSrc)) {
                        candidates.push(fullSrc);
                    }
                }
            });
        }

        // 중복 제거 및 첫 번째 유효한 이미지 반환
        const uniqueCandidates = [...new Set(candidates)];
        if (uniqueCandidates.length > 0) {
            logger.log(`페이지에서 이미지 수집 성공: ${uniqueCandidates[0].substring(0, 80)}`);
            return uniqueCandidates[0];
        }

        logger.warn(`페이지에서 이미지를 찾지 못함: ${url}`);
        return undefined;
    } catch (error) {
        logger.error(`페이지 이미지 추출 중 오류: ${url}`, error);
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

        // Google News의 경우 리다이렉션 해결
        const items: RSSItem[] = [];
        for (const item of feed.items) {
            let articleLink = item.link || '';
            
            if (articleLink.includes('news.google.com')) {
                articleLink = await resolveActualUrl(articleLink);
            }
            
            items.push({
                title: item.title || '',
                link: articleLink,
                pubDate: item.pubDate,
                content: item.content || item.contentSnippet || '',
                contentSnippet: item.contentSnippet || '',
                contentEncoded: (item as any).contentEncoded || (item as any)['content:encoded'],
                mediaContent: (item as any).mediaContent || (item as any)['media:content'],
                mediaThumbnail: (item as any).mediaThumbnail || (item as any)['media:thumbnail'],
                enclosure: item.enclosure,
            });
        }

        logger.log(`RSS 피드에서 ${items.length}개 항목 수집 완료`);
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

    // 1. media:thumbnail
    if (item.mediaThumbnail && isValidImageUrl(item.mediaThumbnail)) {
        logger.log(`media:thumbnail 발견`);
        return item.mediaThumbnail.trim();
    }

    // 2. media:content
    if (item.mediaContent && isValidImageUrl(item.mediaContent)) {
        logger.log(`media:content 발견`);
        return item.mediaContent.trim();
    }

    // 3. enclosure
    if (item.enclosure?.url && isValidImageUrl(item.enclosure.url)) {
        logger.log(`enclosure 발견`);
        return item.enclosure.url.trim();
    }

    // 4. content에서 img 태그 추출
    const content = item.contentEncoded || item.content || '';
    if (content) {
        const imgPatterns = [
            /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
            /<img[^>]+data-src=["']([^"']+)["'][^>]*>/gi,
        ];

        for (const pattern of imgPatterns) {
            const matches = [...content.matchAll(pattern)];
            for (const match of matches) {
                if (match[1]) {
                    let imgUrl = match[1].trim();
                    if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
                    if (isValidImageUrl(imgUrl)) {
                        logger.log(`content에서 이미지 발견`);
                        return imgUrl;
                    }
                }
            }
        }
    }

    logger.log(`RSS에서 이미지를 찾지 못함`);
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
    
    // 2. RSS에 이미지가 없으면 실제 페이지 분석 (필수)
    if (!imageUrl && item.link) {
        logger.log(`RSS에 이미지 없음, 페이지 분석 시작: ${item.title}`);
        imageUrl = await fetchArticleImageFromPage(item.link);
    }
    
    if (imageUrl) {
        logger.log(`최종 이미지 URL: ${imageUrl.substring(0, 100)}`);
    } else {
        logger.warn(`이미지를 찾지 못함: ${item.title}`);
    }
    
    // 본문 내용
    const rawContent = item.contentEncoded || item.content || item.contentSnippet || '';
    
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
                'hankyung.com': '한국경제',
                'seoul.co.kr': '서울신문',
                'yna.co.kr': '연합뉴스',
                'newsis.com': '뉴시스',
                'edaily.co.kr': '이데일리',
                'asiae.co.kr': '아시아경제',
                'dt.co.kr': '디지털타임스',
                'etnews.com': '전자신문',
                'zdnet.co.kr': 'ZDNet',
                'itchosun.com': 'IT조선',
                'it.chosun.com': 'IT조선',
                'robotnews.co.kr': '로봇신문',
                'irobotnews.com': '로봇신문',
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
