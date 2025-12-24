import { NextRequest, NextResponse } from 'next/server';

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

        // Base64로 변환
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        // 파일명 생성 (타임스탬프 + 원본 파일명)
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_'); // 특수문자 제거
        const fileName = `${timestamp}_${originalName}`;

        // Base64 데이터 URL 반환 (MongoDB에 저장하거나 직접 사용 가능)
        // 프로덕션에서는 외부 스토리지 사용 권장, 현재는 Base64 사용
        return NextResponse.json({
            success: true,
            path: dataUrl, // Base64 데이터 URL
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
