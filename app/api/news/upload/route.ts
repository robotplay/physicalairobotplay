import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// Vercel에서 Sharp를 사용하기 위해 Node.js runtime 명시
export const runtime = 'nodejs';
export const maxDuration = 30; // 최대 실행 시간 30초

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    error: '파일이 제공되지 않았습니다.',
                },
                { status: 400 }
            );
        }

        // 파일 타입 검증
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                {
                    success: false,
                    error: '이미지 파일만 업로드 가능합니다.',
                },
                { status: 400 }
            );
        }

        // 파일 크기 제한 (10MB - 리사이징 전 원본 크기)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                {
                    success: false,
                    error: '파일 크기는 10MB 이하여야 합니다.',
                },
                { status: 400 }
            );
        }

        // 파일을 버퍼로 읽기
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        console.log(`[Image Upload] 파일 타입: ${file.type}, 원본 크기: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);

        // Sharp를 사용하여 이미지 리사이징 및 최적화
        // JPEG, PNG 등 모든 이미지 포맷 지원
        // 최대 크기: 1920x1080, JPEG 포맷, 품질 85%
        let optimizedBuffer: Buffer;
        try {
            // 이미지 메타데이터 확인
            const metadata = await sharp(buffer).metadata();
            console.log(`[Image Upload] 원본 이미지 크기: ${metadata.width}x${metadata.height}, 포맷: ${metadata.format}`);

            optimizedBuffer = await sharp(buffer)
                .resize(1920, 1080, {
                    fit: 'inside', // 비율 유지하면서 1920x1080 이내로 리사이징
                    withoutEnlargement: true, // 원본이 작으면 확대하지 않음
                })
                .jpeg({
                    quality: 85, // JPEG 품질 (85%는 용량과 품질의 좋은 균형)
                    progressive: true, // 프로그레시브 JPEG (로딩 최적화)
                    mozjpeg: true, // mozjpeg 최적화 사용
                })
                .toBuffer();

            const optimizedMetadata = await sharp(optimizedBuffer).metadata();
            console.log(`[Image Upload] 최적화된 이미지 크기: ${optimizedMetadata.width}x${optimizedMetadata.height}, 포맷: ${optimizedMetadata.format}`);
        } catch (sharpError: any) {
            console.error('[Image Upload] Sharp 처리 오류:', sharpError);
            // Sharp 처리 실패 시 원본 이미지 사용 (fallback)
            console.warn('[Image Upload] Sharp 처리 실패, 원본 이미지 사용');
            optimizedBuffer = buffer;
        }

        // 최적화된 이미지를 Base64로 변환
        const base64 = optimizedBuffer.toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64}`;

        // 파일명 생성 (타임스탬프 + 원본 파일명)
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // 특수문자 제거
        const fileName = `${timestamp}_${originalName.replace(/\.[^/.]+$/, '')}.jpg`; // 확장자를 .jpg로 변경

        // 원본 크기와 최적화된 크기 정보
        const originalSize = buffer.length;
        const optimizedSize = optimizedBuffer.length;
        const compressionRatio = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

        // Base64 데이터 URL 반환 (MongoDB에 저장하거나 직접 사용 가능)
        return NextResponse.json({
            success: true,
            path: dataUrl, // Base64 데이터 URL
            fileName: fileName,
            originalSize: originalSize,
            optimizedSize: optimizedSize,
            compressionRatio: compressionRatio,
            message: `이미지가 업로드되었습니다. (최적화: ${compressionRatio}% 용량 감소)`,
        });
    } catch (error: any) {
        console.error('Failed to upload image:', error);
        return NextResponse.json(
            {
                success: false,
                error: '이미지 업로드에 실패했습니다.',
                details: error.message,
            },
            { status: 500 }
        );
    }
}
