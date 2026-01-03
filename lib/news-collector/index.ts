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

const RELEVANCE_THRESHOLD = 50; // 관련성 점수 임계값 (엄격하게 검사)
const MIN_CONTENT_LENGTH = 500; // 최소 본문 길이 (글자 수) - 충분히 긴 기사만 수집
const MAX_ARTICLES_PER_FEED = 3; // 피드당 최대 수집 개수 (점수 높은 순)

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

        // 모든 기사를 처리하고 점수를 계산한 후 정렬
        const candidateArticles: Array<{
            article: Partial<CollectedNewsArticle>;
            relevanceScore: number;
            contentText: string;
        }> = [];

        for (const item of items) {
            try {
                // RSS 항목을 기사 형식으로 변환
                const article = convertRSSItemToArticle(item, source, source.keywords);

                // 본문 길이 체크 (HTML 태그 제거 후 순수 텍스트 길이)
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
                
                // 본문 길이 체크 (500자 이상 필수)
                if (contentText.length < MIN_CONTENT_LENGTH) {
                    logger.log(`본문이 너무 짧음 (${contentText.length}자 < ${MIN_CONTENT_LENGTH}자): ${article.title}`);
                    continue;
                }

                // 중복 체크
                const isDuplicate = await checkDuplicate(article);
                if (isDuplicate) {
                    result.duplicates++;
                    continue;
                }

                // 관련성 점수 계산
                const relevanceScore = calculateRelevanceScore(article, source.keywords);

                // 임계값 미만이면 스킵 (엄격하게 검사)
                if (relevanceScore < RELEVANCE_THRESHOLD) {
                    logger.log(`관련성 점수 부족 (${relevanceScore} < ${RELEVANCE_THRESHOLD}): ${article.title}`);
                    continue;
                }

                // 후보 기사에 추가
                candidateArticles.push({
                    article,
                    relevanceScore,
                    contentText,
                });

                logger.log(`후보 기사 추가: ${article.title} (점수: ${relevanceScore}, 본문: ${contentText.length}자)`);
            } catch (error) {
                result.failed++;
                const errorMessage = error instanceof Error ? error.message : String(error);
                result.errors.push(`기사 처리 실패: ${item.title} - ${errorMessage}`);
                logger.error(`기사 처리 실패: ${item.title}`, error);
            }
        }

        // 관련성 점수 높은 순으로 정렬
        candidateArticles.sort((a, b) => b.relevanceScore - a.relevanceScore);

        // 상위 3개만 선택
        const selectedArticles = candidateArticles.slice(0, MAX_ARTICLES_PER_FEED);

        logger.log(`후보 기사 ${candidateArticles.length}개 중 상위 ${selectedArticles.length}개 선택`);

        // 선택된 기사들 저장
        for (const candidate of selectedArticles) {
            try {
                const article = candidate.article;

                // 카테고리 결정
                const category = determineCategory(article, candidate.relevanceScore);

                // 이미지 처리 (있는 경우) - 정확하게 추출
                let processedImageUrl: string | undefined = article.imageUrl;
                if (article.imageUrl && article.imageUrl.trim() !== '') {
                    const originalImageUrl = article.imageUrl.trim();
                    logger.log(`이미지 처리 시작: ${originalImageUrl.substring(0, 100)}`);
                    try {
                        // 이미지 처리 시도 (최대 5초 타임아웃)
                        const processPromise = processImageUrl(originalImageUrl);
                        const timeoutPromise = new Promise<string>((_, reject) => 
                            setTimeout(() => reject(new Error('이미지 처리 타임아웃')), 5000)
                        );
                        
                        processedImageUrl = await Promise.race([processPromise, timeoutPromise]);
                        logger.log(`이미지 처리 완료: ${originalImageUrl.substring(0, 50)}... → ${processedImageUrl.substring(0, 50)}...`);
                    } catch (imageError) {
                        logger.warn(`이미지 처리 실패, 원본 URL 사용: ${originalImageUrl}`, imageError);
                        // 이미지 처리 실패해도 기사는 저장 (원본 URL 사용)
                        processedImageUrl = originalImageUrl; // 원본 URL 유지
                    }
                } else {
                    logger.log(`이미지 URL이 없음: ${article.title}`);
                    processedImageUrl = undefined;
                }

                // 최종 기사 데이터
                const finalArticle: CollectedNewsArticle = {
                    ...article,
                    imageUrl: processedImageUrl,
                    relevanceScore: candidate.relevanceScore,
                    category,
                } as CollectedNewsArticle;

                // MongoDB에 저장
                const db = await getDatabase();
                const collection = db.collection(COLLECTIONS.COLLECTED_NEWS);
                
                // _id 제거 (MongoDB가 자동 생성)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                logger.log(`기사 수집 완료: ${finalArticle.title} (점수: ${candidate.relevanceScore}, 본문: ${candidate.contentText.length}자)`);
            } catch (error) {
                result.failed++;
                const errorMessage = error instanceof Error ? error.message : String(error);
                result.errors.push(`기사 저장 실패: ${candidate.article.title} - ${errorMessage}`);
                logger.error(`기사 저장 실패: ${candidate.article.title}`, error);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

