/**
 * 공통 타입 정의
 * 프로젝트 전반에서 사용되는 타입들을 중앙에서 관리
 */

// 학생 관련 타입
export interface StudentCompetition {
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
    members: string[]; // studentId 배열
    teacherId?: string;
    status: 'registered' | 'preparing' | 'completed';
    result?: 'participated' | 'award' | 'winner';
    award?: string;
    photos?: string[];
    review?: string;
}

export interface CompetitionData {
    _id?: string;
    competitionId: string;
    name: string;
    type: 'local' | 'national' | 'international';
    startDate: string | Date;
    endDate: string | Date;
    registrationDeadline: string | Date;
    description: string;
    requirements?: string;
    location?: string;
    teams: CompetitionTeam[];
    maxTeams?: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

// 하위 호환성을 위한 별칭
export type Competition = CompetitionData;

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
    competitions: StudentCompetition[];
    learningNotes?: string;
    portfolio: StudentPortfolio;
    createdAt: string | Date;
    updatedAt: string | Date;
}

// 출석 관련 타입
export interface AttendanceRecord {
    _id?: string | { toString(): string };
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

// News 관련 타입 (별도 파일로 분리 가능)
export interface NewsItem {
    _id: string | { toString(): string };
    id?: string;
    category: string;
    title: string;
    content: string;
    excerpt?: string;
    image?: string;
    authorId?: string;
    authorRole?: 'admin' | 'teacher';
    authorName?: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
    isPublished?: boolean;
}

// 수집된 뉴스 기사 타입
export interface CollectedNewsArticle {
    _id?: string;
    title: string;
    content: string;
    excerpt: string;
    source: string;
    sourceUrl: string;
    imageUrl?: string;
    publishedAt: Date | string;
    collectedAt: Date | string;
    keywords: string[];
    category: 'education' | 'technology' | 'competition' | 'general';
    relevanceScore: number;
    isActive: boolean;
    viewCount: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

// RSS 피드 소스 타입
export interface RSSFeedSource {
    id: string;
    name: string;
    url: string;
    keywords: string[];
    isActive: boolean;
    lastCollected?: Date | string;
}

// 수집 로그 타입
export interface CollectionLog {
    _id?: string;
    startedAt: Date | string;
    completedAt?: Date | string;
    status: 'running' | 'completed' | 'failed';
    sources: string[];
    collected: number;
    duplicates: number;
    failed: number;
    errors?: string[];
    duration?: number; // milliseconds
}

// 커리큘럼 관련 타입
export interface CurriculumWeek {
    week: number;
    title: string;
    description: string;
    materials: string[]; // 자료 링크
    videos: string[]; // 영상 링크
    assignments: string[];
}

export interface Curriculum {
    _id?: string;
    curriculumId: string;
    courseId: string; // online_courses와 연결
    month: number; // 1-12
    year: number;
    weeks: CurriculumWeek[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

// 갤러리 관련 타입
export interface ClassGallery {
    _id?: string;
    galleryId: string;
    courseId: string;
    classDate: Date | string;
    title: string;
    description: string;
    images: string[]; // 이미지 URL 배열
    videos: string[]; // 영상 URL 배열
    tags: string[]; // 태그
    visibility: 'public' | 'parents-only' | 'private';
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

// FAQ 관련 타입
export interface FAQ {
    _id?: string;
    faqId: string;
    category: 'general' | 'enrollment' | 'curriculum' | 'competition' | 'payment';
    question: string;
    answer: string;
    order: number; // 정렬 순서
    isActive: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

// 피드백 관련 타입
export interface StudentFeedback {
    _id?: string;
    feedbackId: string;
    studentId: string;
    teacherId: string;
    courseId: string;
    date: Date | string;
    content: string; // 피드백 내용
    strengths: string[]; // 강점
    improvements: string[]; // 개선점
    nextSteps: string; // 다음 단계
    createdAt?: Date | string;
}

// 뉴스레터 관련 타입
export interface MonthlyNewsletter {
    _id?: string;
    newsletterId: string;
    month: number;
    year: number;
    title: string;
    content: string; // HTML 콘텐츠
    highlights: string[]; // 주요 하이라이트
    studentSpotlights: string[]; // 학생 스포트라이트 (studentId 배열)
    competitionResults: string[]; // 대회 결과
    photos: string[];
    sentAt?: Date | string; // 발송일
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

// 팝업 관련 타입
export interface Popup {
    _id?: string;
    popupId: string;
    title: string;
    content: string;
    type: 'modal' | 'banner' | 'slide-in';
    trigger: 'immediate' | 'delay' | 'exit-intent' | 'scroll';
    triggerValue?: number; // delay(초) 또는 scroll(%)
    targetPages: string[]; // ['/', '/consultation'] 등
    ctaText?: string;
    ctaUrl?: string;
    imageUrl?: string;
    position?: 'center' | 'top' | 'bottom' | 'top-right' | 'bottom-right';
    showFrequency: 'always' | 'once-per-session' | 'once-per-day' | 'once-per-week';
    isActive: boolean;
    priority: number; // 우선순위 (높을수록 먼저 표시)
    startDate?: Date | string;
    endDate?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

// 리드 마그넷 관련 타입
export interface LeadMagnet {
    _id?: string;
    leadMagnetId: string;
    title: string;
    description: string;
    type: 'pdf' | 'video' | 'webinar' | 'checklist' | 'guide';
    fileUrl?: string;
    thumbnailUrl?: string;
    category: 'education' | 'competition' | 'curriculum' | 'parenting';
    downloadCount: number;
    isActive: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

// 리드 (잠재 고객) 관련 타입
export interface Lead {
    _id?: string;
    leadId: string;
    name: string;
    email: string;
    phone?: string;
    source: 'landing-page' | 'popup' | 'lead-magnet' | 'consultation' | 'other';
    sourceDetail?: string; // 어떤 랜딩 페이지, 어떤 리드 마그넷 등
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
    interests: string[]; // ['free-trial', 'competition', 'basic-course']
    notes?: string;
    metadata?: Record<string, any>; // 추가 정보
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

// 전환 이벤트 추적 타입
export interface ConversionEvent {
    _id?: string;
    eventId: string;
    eventType: 'page-view' | 'button-click' | 'form-submit' | 'download' | 'signup';
    eventName: string;
    userId?: string;
    sessionId: string;
    source: string; // 'landing-free-trial', 'popup-promotion' 등
    metadata?: Record<string, any>;
    timestamp: Date | string;
}

