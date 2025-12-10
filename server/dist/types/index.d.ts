import type { Request } from 'express';
export interface JwtPayload {
    userId: string;
    email: string;
    userType: string;
    iat?: number;
    exp?: number;
}
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export interface UserResponse {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    companyName: string | null;
    userType: string;
    isVerified: boolean;
    onboardingCompleted: boolean;
    onboardingStep: number;
    createdAt: Date;
}
//# sourceMappingURL=index.d.ts.map