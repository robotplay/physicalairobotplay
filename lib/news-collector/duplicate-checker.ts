/**
 * 중복 기사 체크 유틸리티
 */
import { getDatabase, COLLECTIONS } from '../mongodb';
import { logger } from '../logger';
import { compareTwoStrings } from 'string-similarity';
import type { CollectedNewsArticle } from '@/types';

/**
 * URL 기반으로 중복 기사를 확인합니다.
 */
export async function checkDuplicateByUrl(sourceUrl: string): Promise<boolean> {
    try {
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.COLLECTED_NEWS);
        
        const existing = await collection.findOne({ sourceUrl });
        return !!existing;
    } catch (error) {
        logger.error('중복 체크 실패 (URL)', error);
        return false; // 에러 시 중복이 아닌 것으로 처리
    }
}

/**
 * 제목 유사도로 중복 기사를 확인합니다.
 * 유사도가 0.8 이상이면 중복으로 간주합니다.
 */
export async function checkDuplicateByTitle(
    title: string,
    threshold: number = 0.8
): Promise<boolean> {
    try {
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.COLLECTED_NEWS);
        
        // 최근 30일 내 기사만 확인
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentArticles = await collection
            .find({
                publishedAt: { $gte: thirtyDaysAgo },
            })
            .toArray();

        for (const article of recentArticles) {
            const similarity = compareTwoStrings(
                title.toLowerCase(),
                (article.title || '').toLowerCase()
            );
            
            if (similarity >= threshold) {
                logger.log(`중복 기사 발견 (유사도: ${similarity.toFixed(2)}): ${title}`);
                return true;
            }
        }

        return false;
    } catch (error) {
        logger.error('중복 체크 실패 (제목)', error);
        return false;
    }
}

/**
 * 종합적으로 중복을 확인합니다.
 */
export async function checkDuplicate(article: Partial<CollectedNewsArticle>): Promise<boolean> {
    if (!article.sourceUrl) {
        return false;
    }

    // 1. URL 기반 중복 체크
    const isDuplicateByUrl = await checkDuplicateByUrl(article.sourceUrl);
    if (isDuplicateByUrl) {
        return true;
    }

    // 2. 제목 유사도 기반 중복 체크
    if (article.title) {
        const isDuplicateByTitle = await checkDuplicateByTitle(article.title);
        if (isDuplicateByTitle) {
            return true;
        }
    }

    return false;
}

