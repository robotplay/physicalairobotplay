import { NextRequest } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/mongodb';
import { verifyToken, hasPermission } from '@/lib/auth';
import { cookies } from 'next/headers';
import {
    successResponse,
    unauthorizedResponse,
    handleMongoError,
} from '@/lib/api-response';
import type { Payment, Student, CompetitionData, CompetitionTeam } from '@/types';

// 권한 체크 헬퍼 함수
async function checkAuth(requiredRole: 'admin' | 'teacher' = 'admin') {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
        return { authorized: false, error: '인증되지 않았습니다.' };
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return { authorized: false, error: '유효하지 않은 토큰입니다.' };
    }

    if (!hasPermission(payload.role, requiredRole)) {
        return { authorized: false, error: '권한이 없습니다.' };
    }

    return { authorized: true, user: payload };
}

// GET - 운영 분석 데이터 조회
export async function GET(request: NextRequest) {
    try {
        const auth = await checkAuth('admin');
        if (!auth.authorized) {
            return unauthorizedResponse(auth.error);
        }

        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear();
        const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null;

        const db = await getDatabase();

        // 학생 수
        const studentsCollection = db.collection(COLLECTIONS.STUDENTS);
        const totalStudents = await studentsCollection.countDocuments({});
        const activeStudents = await studentsCollection.countDocuments({});

        // 결제 데이터
        const paymentsCollection = db.collection(COLLECTIONS.PAYMENTS);
        const payments = await paymentsCollection.find({}).toArray() as unknown as Payment[];
        const revenue = payments
            .filter((p: Payment) => p.status === 'paid')
            .reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);

        // 신규 등록 (이번 달)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newEnrollments = await studentsCollection.countDocuments({
            createdAt: { $gte: startOfMonth },
        });

        // 출석률 평균
        const students = await studentsCollection.find({}).toArray() as unknown as Student[];
        const attendanceRates = students
            .map((s: Student) => s.attendance?.rate || 0)
            .filter((rate: number) => rate > 0);
        const avgAttendanceRate = attendanceRates.length > 0
            ? Math.round(attendanceRates.reduce((a: number, b: number) => a + b, 0) / attendanceRates.length)
            : 0;

        // 대회 수상 건수
        const competitionsCollection = db.collection(COLLECTIONS.COMPETITIONS);
        const competitions = await competitionsCollection.find({}).toArray() as unknown as CompetitionData[];
        let competitionWins = 0;
        competitions.forEach((comp: CompetitionData) => {
            if (comp.teams) {
                comp.teams.forEach((team: CompetitionTeam) => {
                    if (team.result === 'award' || team.result === 'winner') {
                        competitionWins++;
                    }
                });
            }
        });

        // 월별 데이터 (최근 12개월)
        const monthlyData = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const monthPayments = payments.filter((p: Payment) => {
                const paymentDate = new Date(p.createdAt || p.timestamp);
                return paymentDate >= monthStart && paymentDate <= monthEnd;
            });

            monthlyData.push({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                revenue: monthPayments
                    .filter((p: Payment) => p.status === 'paid')
                    .reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0),
                newEnrollments: await studentsCollection.countDocuments({
                    createdAt: { $gte: monthStart, $lte: monthEnd },
                }),
            });
        }

        return successResponse({
            summary: {
                totalStudents,
                activeStudents,
                revenue,
                newEnrollments,
                avgAttendanceRate,
                competitionWins,
            },
            monthlyData,
        });
    } catch (error) {
        return handleMongoError(error);
    }
}

