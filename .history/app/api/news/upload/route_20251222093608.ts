import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

        // 파일 크기 제한 (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                {
                    success: false,
                    error: '파일 크기는 5MB 이하여야 합니다.',
                },
                { status: 400 }
            );
        }

        // 업로드 디렉토리 생성
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'news');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // 파일명 생성 (타임스탬프 + 원본 파일명)
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // 특수문자 제거
        const fileName = `${timestamp}_${originalName}`;
        const filePath = join(uploadDir, fileName);

        // 파일 저장
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // 웹에서 접근 가능한 경로 반환
        const publicPath = `/uploads/news/${fileName}`;

        return NextResponse.json({
            success: true,
            path: publicPath,
            fileName: fileName,
            message: '이미지가 업로드되었습니다.',
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
