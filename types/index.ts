/**
 * 공통 타입 정의
 * 프로젝트 전반에서 사용되는 타입들을 중앙에서 관리
 */

// 학생 관련 타입
export interface Competition {
    competitionId: string;
    competitionName: string;
    year: number;
    month: number;
    result: 'participated' | 'award' | 'winner';
    award?: string;
    teamMembers?: string[];
}

export interface Project {
    projectId: string;
    projectName: string;
    completionRate: number;
    status: 'in-progress' | 'completed';
    completedAt?: string;
}

export interface StudentAttendance {
    totalClasses: number;
    attendedClasses: number;
    rate: number;
}

export interface StudentPortfolio {
    images: string[];
    videos: string[];
    description: string;
}

// 결제 관련 타입
export interface Payment {
    _id?: string;
    paymentId: string;
    orderId: string;
    amount: number;
    orderName: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: 'paid' | 'pending' | 'failed' | 'cancelled';
    paymentMethod: string;
    timestamp: string;
    createdAt: string | Date;
}

// 대회 관련 타입
export interface CompetitionTeam {
    teamId: string;
    teamName: string;
    members: string[];
    result: 'participated' | 'award' | 'winner';
    award?: string;
}

export interface CompetitionData {
    _id?: string;
    competitionId: string;
    competitionName: string;
    year: number;
    month: number;
    teams?: CompetitionTeam[];
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

// 학생 데이터 타입
export interface Student {
    _id: string;
    studentId: string;
    name: string;
    grade: string;
    class?: string;
    level?: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    enrolledCourses: string[];
    attendance: StudentAttendance;
    projects: Project[];
    competitions: Competition[];
    learningNotes?: string;
    portfolio: StudentPortfolio;
    createdAt: string | Date;
    updatedAt: string | Date;
}

// 출석 관련 타입
export interface AttendanceRecord {
    _id?: string;
    studentId: string;
    studentClass: string;
    classDate: Date | string;
    status: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
    recordedBy?: string;
    recordedAt?: Date | string;
    studentName?: string;
    studentGrade?: string;
}

export interface AttendanceQuery {
    studentId?: string;
    classDate?: {
        $gte: Date;
        $lte: Date;
    };
    studentClass?: string;
}

// MongoDB 쿼리 타입
export interface MongoQuery {
    [key: string]: unknown;
}

