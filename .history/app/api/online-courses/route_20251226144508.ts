import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - 온라인 강좌 목록 조회
export async function GET(request: NextRequest) {
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

        const formattedCourses = courses.map((item: any) => ({
            ...item,
            id: item._id.toString(),
            _id: item._id.toString(),
        }));

        return NextResponse.json({
            success: true,
            data: formattedCourses,
            count: formattedCourses.length,
        });
    } catch (error: any) {
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

        const body = await request.json();
        const { id, title, description, duration, level, category, color, thumbnail, meetingUrl, platformType, schedule } = body;

        if (!title || !category) {
            return NextResponse.json(
                { success: false, error: '제목과 카테고리는 필수입니다.' },
                { status: 400 }
            );
        }

        const courseData = {
            title,
            description,
            duration,
            level,
            category,
            color,
            thumbnail: thumbnail || '/img/01.jpeg',
            meetingUrl: meetingUrl || '',
            platformType: platformType || 'zoom',
            schedule: schedule || [], // [{ day: '월', time: '14:00' }]
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
    } catch (error: any) {
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
    } catch (error: any) {
        console.error('Failed to delete online course:', error);
        return NextResponse.json(
            { success: false, error: '강좌 삭제에 실패했습니다.' },
            { status: 500 }
        );
    }
}

