/**
 * 뉴스 수집 메인 모듈
 */
import { getDatabase, COLLECTIONS } from '../mongodb';
import { logger } from '../logger';
import { fetchRSSFeed, convertRSSItemToArticle } from './rss-parser';
import { calculateRelevanceScore, determineCategory } from './relevance-scorer';
import { checkDuplicate } from './duplicate-checker';
import { getActiveRSSSources } from './feed-sources';
import { processImageUrl } from './image-processor';
import type { CollectedNewsArticle, CollectionLog, RSSFeedSource } from '@/types';

// 수집 기준 설정
const RELEVANCE_THRESHOLD = 15; // 관련성 점수 임계값 (수집량을 늘리기 위해 낮춤)
const MIN_CONTENT_LENGTH = 100; // 최소 본문 길이 (수집량을 늘리기 위해 낮춤)
const MAX_ARTICLES_PER_FEED = 5; // 한 피드당 최대 수집 개수
const TARGET_COUNT_PER_FEED = 3; // 한 피드당 최소 목표 수집 개수

interface ArticleCandidate {
    article: Partial<CollectedNewsArticle>;
    score: number;
    contentText: string;
}

/**
 * 매이저 신문사 여부를 확인합니다.
 */
function isMajorSource(article: Partial<CollectedNewsArticle>): boolean {
    const sourceName = (article.source || '').toLowerCase();
    const sourceUrl = (article.sourceUrl || '').toLowerCase();
    
    const majorKeywords = [
        '조선일보', 'chosun', '중앙일보', 'joongang', '동아일보', 'donga',
        '한겨레', 'hani', '경향신문', 'khan', '매일경제', 'mk', 'maeil',
        '한국경제', 'hankyung', '서울신문', 'seoul', '문화일보', 'munhwa',
        '세계일보', 'segye', '연합뉴스', 'yna', 'yonhap', '뉴시스', 'newsis',
        '이데일리', 'edaily', '아시아경제', 'asiae', '디지털타임스', 'dt',
        '전자신문', 'etnews', 'zdnet', 'itchosun', '로봇신문', 'robot',
        'robottimes', 'aitimes'
    ];

    return majorKeywords.some(keyword => 
        sourceName.includes(keyword.toLowerCase()) || sourceUrl.includes(keyword.toLowerCase())
    );
}

/**
 * 단일 RSS 피드에서 기사를 수집합니다.
 */
async function collectFromFeed(source: RSSFeedSource): Promise<{
    collected: number;
    duplicates: number;
    failed: number;
    errors: string[];
}> {
    const result = {
        collected: 0,
        duplicates: 0,
        failed: 0,
        errors: [] as string[],
    };

    try {
        logger.log(`RSS 피드 수집 시작: ${source.name} (${source.url})`);

        // RSS 피드 가져오기
        const items = await fetchRSSFeed(source.url);
        
        logger.log(`RSS 피드에서 ${items.length}개 항목 수신: ${source.name}`);
        
        if (items.length === 0) {
            logger.warn(`RSS 피드에 항목이 없습니다: ${source.name}`);
            return result;
        }

        const majorCandidates: ArticleCandidate[] = [];
        const otherCandidates: ArticleCandidate[] = [];

        // 1. 모든 항목에 대해 점수 계산 및 분류
        for (const item of items) {
            try {
                const article = await convertRSSItemToArticle(item, source, source.keywords);
                
                // 본문 텍스트 추출 (길이 체크용)
                const contentText = (article.content || '')
                    .replace(/<[^>]*>/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();

                if (contentText.length < 50) continue; // 너무 짧은 내용은 무시

                // 중복 체크
                if (await checkDuplicate(article)) {
                    result.duplicates++;
                    continue;
                }

                // 점수 계산
                const score = calculateRelevanceScore(article, source.keywords);
                article.relevanceScore = score;

                // 분류
                if (isMajorSource(article)) {
                    majorCandidates.push({ article, score, contentText });
                } else if (score >= RELEVANCE_THRESHOLD && contentText.length >= MIN_CONTENT_LENGTH) {
                    otherCandidates.push({ article, score, contentText });
                }
            } catch (err) {
                logger.error(`항목 처리 오류: ${item.title}`, err);
            }
        }

        // 2. 점수 순 정렬
        majorCandidates.sort((a, b) => b.score - a.score);
        otherCandidates.sort((a, b) => b.score - a.score);

        // 3. 최종 선택 (매이저 우선 + 부족분 보충)
        let finalSelection = [...majorCandidates.slice(0, MAX_ARTICLES_PER_FEED)];
        
        if (finalSelection.length < TARGET_COUNT_PER_FEED) {
            const needed = TARGET_COUNT_PER_FEED - finalSelection.length;
            const extra = otherCandidates.slice(0, needed);
            finalSelection = [...finalSelection, ...extra];
            if (extra.length > 0) {
                logger.log(`${source.name}: 일반 기사 ${extra.length}개로 목표 수량 보충`);
            }
        }

        logger.log(`${source.name}: 최종 ${finalSelection.length}개 기사 선택 완료`);

        // 4. 선택된 기사 저장
        const db = await getDatabase();
        const newsCollection = db.collection(COLLECTIONS.COLLECTED_NEWS);

        for (const selected of finalSelection) {
            try {
                const article = selected.article;
                
                // 카테고리 결정
                article.category = determineCategory(article, selected.score);

                // 이미지 처리
                if (article.imageUrl && article.imageUrl.trim() !== '') {
                    try {
                        const processedUrl = await processImageUrl(article.imageUrl);
                        article.imageUrl = processedUrl;
                    } catch (imageErr) {
                        logger.warn(`이미지 처리 실패, 원본 유지: ${article.title}`, imageErr);
                    }
                }

                // DB 저장 (기존에 이미 중복 체크를 했으므로 insert)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _id, ...articleData } = article;
                await newsCollection.insertOne({
                    ...articleData,
                    publishedAt: article.publishedAt instanceof Date ? article.publishedAt : new Date(article.publishedAt),
                    collectedAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                
                result.collected++;
                logger.log(`기사 수집 저장 성공: ${article.title} (${article.source})`);
            } catch (err) {
                result.failed++;
                logger.error(`기사 저장 오류: ${selected.article.title}`, err);
            }
        }

    } catch (error) {
        logger.error(`피드 수집 중 치명적 오류: ${source.name}`, error);
        result.errors.push(`${source.name} 수집 실패`);
    }

    return result;
}

/**
 * 모든 활성 RSS 피드에서 기사를 수집합니다.
 */
export async function collectNewsArticles(sources?: RSSFeedSource[]): Promise<CollectionLog> {
    const startTime = Date.now();
    const log: CollectionLog = {
        startedAt: new Date(),
        status: 'running',
        sources: [],
        collected: 0,
        duplicates: 0,
        failed: 0,
        errors: [],
    };

    try {
        const activeSources = sources || getActiveRSSSources();
        log.sources = activeSources.map((s) => s.id);

        logger.log(`전체 뉴스 수집 시작: ${activeSources.length}개 피드`);

        for (const source of activeSources) {
            const result = await collectFromFeed(source);
            log.collected += result.collected;
            log.duplicates += result.duplicates;
            log.failed += result.failed;
            if (result.errors.length > 0) {
                log.errors?.push(...result.errors);
            }
        }

        log.status = 'completed';
        log.completedAt = new Date();
        log.duration = Date.now() - startTime;

        // 수집 로그 저장
        const db = await getDatabase();
        const logsCollection = db.collection(COLLECTIONS.COLLECTION_LOGS);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...logData } = log;
        await logsCollection.insertOne(logData);

        logger.log(`전체 뉴스 수집 완료: 수집 ${log.collected}개, 중복 ${log.duplicates}개, 실패 ${log.failed}개`);
    } catch (error) {
        log.status = 'failed';
        log.completedAt = new Date();
        log.duration = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : String(error);
        log.errors?.push(`전체 수집 실패: ${errorMessage}`);
        logger.error('뉴스 수집 실패', error);
    }

    return log;
}
