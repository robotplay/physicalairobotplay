import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// 캐싱 설정: 30분 (1800초)
export const revalidate = 1800;

// GET - 온라인 강좌 목록 조회
export async function GET() {
    try {
        if (!process.env.MONGODB_URI) {
            return NextResponse.json({
                success: true,
                data: [],
                count: 0,
                message: 'MongoDB가 설정되지 않았습니다.',
            });
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.ONLINE_COURSES);

        const courses = await collection.find({}).sort({ createdAt: -1 }).toArray();

        const formattedCourses = courses.map((item: { _id: ObjectId; [key: string]: unknown }) => ({
            ...item,
            id: item._id.toString(),
            _id: item._id.toString(),
        }));

        const response = NextResponse.json({
            success: true,
            data: formattedCourses,
            count: formattedCourses.length,
        });

        // Cache-Control 헤더 추가
        response.headers.set(
            'Cache-Control',
            'public, s-maxage=1800, stale-while-revalidate=3600'
        );

        return response;
    } catch (error) {
        console.error('Failed to fetch online courses:', error);
        return NextResponse.json(
            { success: false, error: '강좌를 불러오는데 실패했습니다.' },
            { status: 500 }
        );
    }
}

// POST - 온라인 강좌 추가/수정
export async function POST(request: NextRequest) {
    try {
        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.ONLINE_COURSES);
        const usersCollection = db.collection(COLLECTIONS.USERS);

        const body = await request.json();
        const {
            id, title, description, content, duration, level, category, color, thumbnail,
            meetingUrl, platformType, schedule, price, students, capacity, teacherId,
            chapters, totalLessons, totalDuration, isPublished, whatYouWillLearn, requirements
        } = body;

        if (!title || !category) {
            return NextResponse.json(
                { success: false, error: '제목과 카테고리는 필수입니다.' },
                { status: 400 }
            );
        }

        // teacherId가 있으면 강사 정보 조회
        let teacherName = undefined;
        if (teacherId) {
            const teacher = await usersCollection.findOne({ teacherId });
            if (teacher) {
                teacherName = teacher.name as string;
            }
        }

        const courseData = {
            title,
            description,
            content: content || '', // 리치 HTML 콘텐츠
            duration,
            students: students || '0명',
            capacity: capacity || 4, // 정원
            level,
            category,
            color,
            thumbnail: thumbnail || '/img/01.jpeg',
            meetingUrl: meetingUrl || '',
            platformType: platformType || 'zoom',
            schedule: schedule || [], // [{ day: '월', time: '14:00' }]
            price: price || 0, // 가격
            teacherId: teacherId || undefined, // 강사 ID
            teacherName: teacherName || undefined, // 강사 이름
            // 비디오 강좌 필드
            chapters: chapters || [], // 챕터/레슨 구조
            totalLessons: totalLessons || 0, // 총 레슨 수
            totalDuration: totalDuration || 0, // 총 영상 시간 (분)
            isPublished: isPublished !== false, // 공개 여부 (기본: 공개)
            whatYouWillLearn: whatYouWillLearn || [], // 학습 목표
            requirements: requirements || [], // 수강 요건
            updatedAt: new Date(),
        };

        if (id) {
            // 수정
            if (!ObjectId.isValid(id)) {
                return NextResponse.json({ success: false, error: '유효하지 않은 ID입니다.' }, { status: 400 });
            }
            await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: courseData }
            );
            return NextResponse.json({ success: true, message: '강좌가 수정되었습니다.' });
        } else {
            // 추가
            const result = await collection.insertOne({
                ...courseData,
                createdAt: new Date(),
            });
            return NextResponse.json({
                success: true,
                data: { ...courseData, _id: result.insertedId.toString() },
                message: '강좌가 추가되었습니다.',
            });
        }
    } catch (error) {
        console.error('Failed to save online course:', error);
        return NextResponse.json(
            { success: false, error: '강좌 저장에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE - 온라인 강좌 삭제
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ success: false, error: '유효한 ID가 필요합니다.' }, { status: 400 });
        }

        const db = await getDatabase();
        const collection = db.collection(COLLECTIONS.ONLINE_COURSES);

        await collection.deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ success: true, message: '강좌가 삭제되었습니다.' });
    } catch (error) {
        console.error('Failed to delete online course:', error);
        return NextResponse.json(
            { success: false, error: '강좌 삭제에 실패했습니다.' },
            { status: 500 }
        );
    }
}

