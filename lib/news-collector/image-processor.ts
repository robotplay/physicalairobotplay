/**
 * 이미지 다운로드 및 처리 유틸리티
 * RSS 피드에서 추출한 이미지 URL을 다운로드하고 최적화하여 Vercel Blob Storage에 업로드
 */
import sharp from 'sharp';
import { put } from '@vercel/blob';
import { logger } from '../logger';

// Vercel Blob Storage 사용 여부
const USE_BLOB_STORAGE = process.env.BLOB_READ_WRITE_TOKEN ? true : false;

// 최대 이미지 크기 (5MB)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// 이미지 다운로드 타임아웃 (10초)
const DOWNLOAD_TIMEOUT = 10000;

/**
 * URL에서 이미지를 다운로드합니다.
 */
async function downloadImage(imageUrl: string): Promise<Buffer> {
    try {
        // node-fetch를 사용하여 이미지 다운로드
        const fetch = (await import('node-fetch')).default;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT);

        try {
            const response = await fetch(imageUrl, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Referer': 'https://www.google.com/',
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.startsWith('image/')) {
                throw new Error(`이미지가 아닙니다: ${contentType}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            if (buffer.length === 0) {
                throw new Error('다운로드된 이미지가 비어있습니다');
            }

            if (buffer.length > MAX_IMAGE_SIZE) {
                throw new Error(`이미지 크기가 너무 큽니다: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);
            }

            logger.log(`이미지 다운로드 완료: ${imageUrl} (${(buffer.length / 1024).toFixed(2)}KB)`);
            return buffer;
        } catch (fetchError) {
            clearTimeout(timeoutId);
            throw fetchError;
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`이미지 다운로드 실패: ${imageUrl}`, error);
        throw new Error(`이미지 다운로드 실패: ${errorMessage}`);
    }
}

/**
 * 이미지를 최적화합니다.
 * - 최대 크기: 1920x1080
 * - 포맷: JPEG
 * - 품질: 85%
 */
async function optimizeImage(buffer: Buffer): Promise<Buffer> {
    try {
        const metadata = await sharp(buffer).metadata();
        logger.log(`이미지 최적화 시작: ${metadata.width}x${metadata.height}, 포맷: ${metadata.format}`);

        let sharpInstance = sharp(buffer);

        // PNG 또는 투명도가 있는 이미지인 경우 흰색 배경으로 합성
        if (metadata.format === 'png' || metadata.hasAlpha) {
            sharpInstance = sharpInstance.flatten({ background: { r: 255, g: 255, b: 255 } });
        }

        const optimizedBuffer = await sharpInstance
            .resize(1920, 1080, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .jpeg({
                quality: 85,
                progressive: true,
                mozjpeg: true,
            })
            .toBuffer();

        const optimizedMetadata = await sharp(optimizedBuffer).metadata();
        const compressionRatio = ((1 - optimizedBuffer.length / buffer.length) * 100).toFixed(1);
        
        logger.log(
            `이미지 최적화 완료: ${optimizedMetadata.width}x${optimizedMetadata.height}, ` +
            `용량: ${(buffer.length / 1024).toFixed(2)}KB → ${(optimizedBuffer.length / 1024).toFixed(2)}KB ` +
            `(${compressionRatio}% 감소)`
        );

        return optimizedBuffer;
    } catch (error) {
        logger.error('이미지 최적화 실패', error);
        // 최적화 실패 시 원본 반환
        return buffer;
    }
}

/**
 * Vercel Blob Storage에 이미지를 업로드합니다.
 */
async function uploadToBlob(buffer: Buffer, originalUrl: string): Promise<string> {
    if (!USE_BLOB_STORAGE) {
        throw new Error('Vercel Blob Storage가 설정되지 않았습니다');
    }

    try {
        // 파일명 생성 (타임스탬프 + URL 해시)
        const timestamp = Date.now();
        const urlHash = Buffer.from(originalUrl).toString('base64').substring(0, 16).replace(/[^a-zA-Z0-9]/g, '');
        const fileName = `collected-news/${timestamp}_${urlHash}.jpg`;
        
        const blob = await put(fileName, buffer, {
            access: 'public',
            contentType: 'image/jpeg',
        });

        logger.log(`Vercel Blob Storage 업로드 완료: ${blob.url}`);
        return blob.url;
    } catch (error) {
        logger.error('Vercel Blob Storage 업로드 실패', error);
        throw error;
    }
}

/**
 * 이미지 URL을 처리합니다.
 * 1. 이미지 다운로드
 * 2. 이미지 최적화
 * 3. Vercel Blob Storage에 업로드
 * 
 * @param imageUrl 원본 이미지 URL
 * @returns CDN URL 또는 원본 URL (실패 시)
 */
export async function processImageUrl(imageUrl: string): Promise<string> {
    // 유효한 URL인지 확인
    if (!imageUrl || !imageUrl.startsWith('http')) {
        logger.warn(`유효하지 않은 이미지 URL: ${imageUrl}`);
        return imageUrl; // 원본 URL 반환
    }

    // data: URL은 그대로 반환 (이미 Base64)
    if (imageUrl.startsWith('data:')) {
        logger.log(`Base64 이미지 감지, 그대로 사용: ${imageUrl.substring(0, 50)}...`);
        return imageUrl;
    }

    try {
        // 1. 이미지 다운로드
        const buffer = await downloadImage(imageUrl);

        // 2. 이미지 최적화
        const optimizedBuffer = await optimizeImage(buffer);

        // 3. Vercel Blob Storage에 업로드
        if (USE_BLOB_STORAGE) {
            try {
                const cdnUrl = await uploadToBlob(optimizedBuffer, imageUrl);
                return cdnUrl;
            } catch (blobError) {
                logger.warn('Blob Storage 업로드 실패, 원본 URL 사용', blobError);
                return imageUrl; // 실패 시 원본 URL 반환
            }
        } else {
            logger.warn('Vercel Blob Storage가 설정되지 않음, 원본 URL 사용');
            return imageUrl; // Blob Storage 미설정 시 원본 URL 반환
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.warn(`이미지 처리 실패, 원본 URL 사용: ${imageUrl} (${errorMessage})`);
        return imageUrl; // 실패 시 원본 URL 반환
    }
}

/**
 * 여러 이미지 URL을 일괄 처리합니다.
 */
export async function processImageUrls(imageUrls: string[]): Promise<string[]> {
    const results = await Promise.allSettled(
        imageUrls.map((url) => processImageUrl(url))
    );

    return results.map((result, index) => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            logger.error(`이미지 처리 실패: ${imageUrls[index]}`, result.reason);
            return imageUrls[index]; // 실패 시 원본 URL 반환
        }
    });
}

