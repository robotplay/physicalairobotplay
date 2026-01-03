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
const RELEVANCE_THRESHOLD = 30; // 관련성 점수 임계값
const MIN_CONTENT_LENGTH = 300; // 최소 본문 길이 (글자 수)
const MAX_ARTICLES_PER_FEED = 3; // 피드당 최대 수집 개수 (무조건 3개 추출 목표)
const FALLBACK_RELEVANCE_THRESHOLD = 20; // 후보 부족 시 완화된 임계값
const FALLBACK_MIN_CONTENT_LENGTH = 200; // 후보 부족 시 완화된 본문 길이

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

        // 모든 기사를 처리하고 점수를 계산한 후 정렬
        const candidateArticles: Array<{
            article: Partial<CollectedNewsArticle>;
            relevanceScore: number;
            contentText: string;
        }> = [];

        // 1차 필터링: 엄격한 기준으로 후보 수집
        for (const item of items) {
            try {
                // RSS 항목을 기사 형식으로 변환
                const article = convertRSSItemToArticle(item, source, source.keywords);

                // 매이저 신문사 출처 체크 (실제 기사 URL에서 도메인 확인)
                const sourceUrl = article.sourceUrl || item.link || '';
                const sourceName = (article.source || '').toLowerCase();
                
                // 실제 기사 URL에서 도메인 추출하여 매이저 신문사 확인
                let isMajorNewspaper = false;
                try {
                    const url = new URL(sourceUrl);
                    const hostname = url.hostname.toLowerCase();
                    
                    // 매이저 신문사 도메인 체크
                    const majorNewspaperDomains = [
                        'chosun.com', 'joongang.co.kr', 'donga.com',
                        'hani.co.kr', 'khan.co.kr', 'mk.co.kr', 'maeil.com',
                        'hankyung.com', 'seoul.co.kr', 'munhwa.com',
                        'segye.com', 'yna.co.kr', 'yonhapnews.co.kr',
                        'newsis.com', 'edaily.co.kr', 'asiae.co.kr',
                        'dt.co.kr', 'etnews.com', 'zdnet.co.kr',
                        'itchosun.com', 'robotnews.co.kr', 'robottimes',
                        'aitimes',
                    ];
                    
                    isMajorNewspaper = majorNewspaperDomains.some(domain => 
                        hostname.includes(domain)
                    );
                    
                    if (isMajorNewspaper) {
                        logger.log(`매이저 신문사 도메인 확인: ${hostname} - ${article.title}`);
                    }
                } catch {
                    // URL 파싱 실패 시 source 이름으로 체크
                    const majorNewspaperKeywords = [
                        '조선일보', 'chosun', '중앙일보', 'joongang',
                        '동아일보', 'donga', '한겨레', 'hani',
                        '경향신문', 'khan', '매일경제', 'mk', 'maeil',
                        '한국경제', 'hankyung', '서울신문', 'seoul',
                        '문화일보', 'munhwa', '세계일보', 'segye',
                        '연합뉴스', 'yna', 'yonhap', '뉴시스', 'newsis',
                        '이데일리', 'edaily', '아시아경제', 'asiae',
                        '디지털타임스', 'dt', 'digitaltimes',
                        '전자신문', 'etnews', 'zdnet', 'it조선', 'itchosun',
                        '로봇신문', 'robot', '로봇타임스', 'robottimes',
                        'ai타임스', 'aitimes',
                    ];
                    
                    isMajorNewspaper = majorNewspaperKeywords.some(major => 
                        sourceName.includes(major.toLowerCase())
                    );
                }

                if (!isMajorNewspaper) {
                    logger.log(`매이저 신문사가 아님, 스킵: ${article.source} (${sourceUrl}) - ${article.title}`);
                    continue;
                }

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
                
                // 본문 길이 체크 (300자 이상)
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

                // 임계값 미만이면 스킵
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

        // 후보가 부족하면 완화된 기준으로 재수집
        if (candidateArticles.length < MAX_ARTICLES_PER_FEED) {
            logger.log(`후보 기사 부족 (${candidateArticles.length}개), 완화된 기준으로 재수집 시도`);
            
            const fallbackCandidates: Array<{
                article: Partial<CollectedNewsArticle>;
                relevanceScore: number;
                contentText: string;
            }> = [];

            for (const item of items) {
                try {
                    // 이미 후보에 포함된 기사는 스킵
                    const existingCandidate = candidateArticles.find(
                        c => c.article.sourceUrl === item.link
                    );
                    if (existingCandidate) {
                        continue;
                    }

                    // RSS 항목을 기사 형식으로 변환
                    const article = convertRSSItemToArticle(item, source, source.keywords);

                    // 매이저 신문사 출처 체크 (완화된 기준에서도 필수) - 실제 기사 URL에서 도메인 확인
                    const sourceUrl = article.sourceUrl || item.link || '';
                    const sourceName = (article.source || '').toLowerCase();
                    
                    let isMajorNewspaper = false;
                    try {
                        const url = new URL(sourceUrl);
                        const hostname = url.hostname.toLowerCase();
                        
                        const majorNewspaperDomains = [
                            'chosun.com', 'joongang.co.kr', 'donga.com',
                            'hani.co.kr', 'khan.co.kr', 'mk.co.kr', 'maeil.com',
                            'hankyung.com', 'seoul.co.kr', 'munhwa.com',
                            'segye.com', 'yna.co.kr', 'yonhapnews.co.kr',
                            'newsis.com', 'edaily.co.kr', 'asiae.co.kr',
                            'dt.co.kr', 'etnews.com', 'zdnet.co.kr',
                            'itchosun.com', 'robotnews.co.kr', 'robottimes',
                            'aitimes',
                        ];
                        
                        isMajorNewspaper = majorNewspaperDomains.some(domain => 
                            hostname.includes(domain)
                        );
                    } catch {
                        // URL 파싱 실패 시 source 이름으로 체크
                        const majorNewspaperKeywords = [
                            '조선일보', 'chosun', '중앙일보', 'joongang',
                            '동아일보', 'donga', '한겨레', 'hani',
                            '경향신문', 'khan', '매일경제', 'mk', 'maeil',
                            '한국경제', 'hankyung', '서울신문', 'seoul',
                            '문화일보', 'munhwa', '세계일보', 'segye',
                            '연합뉴스', 'yna', 'yonhap', '뉴시스', 'newsis',
                            '이데일리', 'edaily', '아시아경제', 'asiae',
                            '디지털타임스', 'dt', 'digitaltimes',
                            '전자신문', 'etnews', 'zdnet', 'it조선', 'itchosun',
                            '로봇신문', 'robot', '로봇타임스', 'robottimes',
                            'ai타임스', 'aitimes',
                        ];
                        
                        isMajorNewspaper = majorNewspaperKeywords.some(major => 
                            sourceName.includes(major.toLowerCase())
                        );
                    }

                    if (!isMajorNewspaper) {
                        continue;
                    }

                    // 본문 길이 체크 (완화된 기준)
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
                    
                    // 완화된 본문 길이 체크
                    if (contentText.length < FALLBACK_MIN_CONTENT_LENGTH) {
                        continue;
                    }

                    // 중복 체크
                    const isDuplicate = await checkDuplicate(article);
                    if (isDuplicate) {
                        continue;
                    }

                    // 관련성 점수 계산
                    const relevanceScore = calculateRelevanceScore(article, source.keywords);

                    // 완화된 임계값 체크
                    if (relevanceScore < FALLBACK_RELEVANCE_THRESHOLD) {
                        continue;
                    }

                    // 완화된 후보에 추가
                    fallbackCandidates.push({
                        article,
                        relevanceScore,
                        contentText,
                    });

                    logger.log(`완화된 기준 후보 추가: ${article.title} (점수: ${relevanceScore}, 본문: ${contentText.length}자)`);
                } catch (error) {
                    // 에러는 무시하고 계속 진행
                    logger.error(`완화된 기준 기사 처리 실패: ${item.title}`, error);
                }
            }

            // 완화된 후보를 기존 후보에 추가
            candidateArticles.push(...fallbackCandidates);
            logger.log(`완화된 기준으로 추가 후보 ${fallbackCandidates.length}개 확보, 총 ${candidateArticles.length}개`);
        }

        // 관련성 점수 높은 순으로 정렬
        candidateArticles.sort((a, b) => b.relevanceScore - a.relevanceScore);

        // 상위 3개만 선택 (무조건 3개 추출 목표)
        const selectedArticles = candidateArticles.slice(0, MAX_ARTICLES_PER_FEED);

        logger.log(`후보 기사 ${candidateArticles.length}개 중 상위 ${selectedArticles.length}개 선택 (임계값: ${RELEVANCE_THRESHOLD}점 이상, 본문: ${MIN_CONTENT_LENGTH}자 이상)`);
        
        if (selectedArticles.length === 0) {
            logger.warn(`수집 가능한 기사가 없습니다: ${source.name} (관련성 점수 ${RELEVANCE_THRESHOLD} 이상, 본문 ${MIN_CONTENT_LENGTH}자 이상 필요)`);
        } else if (selectedArticles.length < MAX_ARTICLES_PER_FEED) {
            logger.warn(`목표 수집 개수(${MAX_ARTICLES_PER_FEED}개) 미달: ${selectedArticles.length}개만 수집됨`);
        }

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
        
        if (result.collected === 0 && candidateArticles.length === 0) {
            logger.warn(`RSS 피드에서 수집 가능한 기사가 없습니다: ${source.name} (관련성 점수 ${RELEVANCE_THRESHOLD} 이상, 본문 ${MIN_CONTENT_LENGTH}자 이상 필요)`);
        }
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

