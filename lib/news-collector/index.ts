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

const RELEVANCE_THRESHOLD = 50; // 관련성 점수 임계값

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

        for (const item of items) {
            try {
                // RSS 항목을 기사 형식으로 변환
                const article = convertRSSItemToArticle(item, source, source.keywords);

                // 중복 체크
                const isDuplicate = await checkDuplicate(article);
                if (isDuplicate) {
                    result.duplicates++;
                    continue;
                }

                // 관련성 점수 계산
                const relevanceScore = calculateRelevanceScore(article, source.keywords);

                // 임계값 미만이면 스킵
                if (relevanceScore < RELEVANCE_THRESHOLD) {
                    logger.log(`관련성 점수 부족 (${relevanceScore}): ${article.title}`);
                    continue;
                }

                // 카테고리 결정
                const category = determineCategory(article, relevanceScore);

                // 이미지 처리 (있는 경우)
                let processedImageUrl = article.imageUrl;
                if (article.imageUrl) {
                    try {
                        processedImageUrl = await processImageUrl(article.imageUrl);
                        logger.log(`이미지 처리 완료: ${article.imageUrl} → ${processedImageUrl.substring(0, 50)}...`);
                    } catch (imageError) {
                        logger.warn(`이미지 처리 실패, 원본 URL 사용: ${article.imageUrl}`, imageError);
                        // 이미지 처리 실패해도 기사는 저장 (원본 URL 사용)
                    }
                }

                // 최종 기사 데이터
                const finalArticle: CollectedNewsArticle = {
                    ...article,
                    imageUrl: processedImageUrl,
                    relevanceScore,
                    category,
                } as CollectedNewsArticle;

                // MongoDB에 저장
                const db = await getDatabase();
                const collection = db.collection(COLLECTIONS.COLLECTED_NEWS);
                
                // _id 제거 (MongoDB가 자동 생성)
                const { _id, ...articleData } = finalArticle;
                
                await collection.insertOne({
                    ...articleData,
                    publishedAt: finalArticle.publishedAt instanceof Date 
                        ? finalArticle.publishedAt 
                        : new Date(finalArticle.publishedAt),
                    collectedAt: finalArticle.collectedAt instanceof Date 
                        ? finalArticle.collectedAt 
                        : new Date(finalArticle.collectedAt),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                result.collected++;
                logger.log(`기사 수집 완료: ${finalArticle.title} (점수: ${relevanceScore})`);
            } catch (error) {
                result.failed++;
                const errorMessage = error instanceof Error ? error.message : String(error);
                result.errors.push(`기사 처리 실패: ${item.title} - ${errorMessage}`);
                logger.error(`기사 처리 실패: ${item.title}`, error);
            }
        }

        logger.log(`RSS 피드 수집 완료: ${source.name} - 수집: ${result.collected}, 중복: ${result.duplicates}, 실패: ${result.failed}`);
    } catch (error) {
        result.failed++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        result.errors.push(`RSS 피드 수집 실패: ${source.name} - ${errorMessage}`);
        logger.error(`RSS 피드 수집 실패: ${source.name}`, error);
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

        logger.log(`뉴스 수집 시작: ${activeSources.length}개 피드`);

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
        const { _id, ...logData } = log;
        await logsCollection.insertOne({
            ...logData,
            startedAt: log.startedAt instanceof Date ? log.startedAt : new Date(log.startedAt),
            completedAt: log.completedAt instanceof Date ? log.completedAt : new Date(log.completedAt),
        });

        logger.log(`뉴스 수집 완료: 수집 ${log.collected}개, 중복 ${log.duplicates}개, 실패 ${log.failed}개 (소요 시간: ${log.duration}ms)`);
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

