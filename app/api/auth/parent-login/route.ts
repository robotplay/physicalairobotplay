import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { studentId, parentPhone } = body;

        if (!studentId || !parentPhone) {
            return NextResponse.json(
                { success: false, error: '학생 ID와 학부모 연락처를 입력해주세요.' },
                { status: 400 }
            );
        }

        // MongoDB에서 학생 조회
        const db = await getDatabase();
        const studentsCollection = db.collection(COLLECTIONS.STUDENTS);
        
        const student = await studentsCollection.findOne({ 
            studentId,
            parentPhone 
        });

        if (!student) {
            return NextResponse.json(
                { success: false, error: '학생 정보를 찾을 수 없습니다. 학생 ID와 학부모 연락처를 확인해주세요.' },
                { status: 401 }
            );
        }

        // JWT 토큰 생성 (학부모용)
        const token = await createToken({
            userId: student._id.toString(),
            username: `parent-${student.studentId}`,
            role: 'parent',
            name: student.parentName,
            studentId: student.studentId,
        });

        // 쿠키에 토큰 저장
        const cookieStore = await cookies();
        cookieStore.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30일
            path: '/', // 모든 경로에서 접근 가능
        });

        return NextResponse.json({
            success: true,
            message: '로그인 성공',
            user: {
                studentId: student.studentId,
                studentName: student.name,
                parentName: student.parentName,
            },
        });
    } catch (error) {
        console.error('Parent login error:', error);
        return NextResponse.json(
            { success: false, error: '로그인 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

