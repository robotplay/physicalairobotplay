/**
 * News 관련 타입 정의
 */

import { ObjectId } from 'mongodb';

export interface NewsItem {
    _id: ObjectId | string;
    id?: string;
    category: string;
    title: string;
    content: string;
    excerpt?: string;
    image?: string;
    authorId?: ObjectId | string;
    authorRole?: 'admin' | 'teacher';
    authorName?: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
    isPublished?: boolean;
}

export interface NewsFilter {
    category?: string;
    isPublished?: boolean;
}

export interface NewsSortOption {
    createdAt: 1 | -1;
}

export interface NewsQueryParams {
    category?: string;
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
}

