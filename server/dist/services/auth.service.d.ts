import type { UserResponse } from '../types/index.js';
export interface RegisterInput {
    email: string;
    password: string;
    name: string;
    phone?: string;
    companyName?: string;
    userType?: 'owner_operator' | 'fleet_manager' | 'dispatcher';
}
export interface LoginInput {
    email: string;
    password: string;
}
export declare function register(input: RegisterInput): Promise<{
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
}>;
export declare function login(input: LoginInput): Promise<{
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
}>;
export declare function refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare function getCurrentUser(userId: string): Promise<UserResponse>;
export declare function deleteAccount(userId: string): Promise<void>;
export interface UpdateProfileInput {
    name?: string;
    phone?: string;
    companyName?: string;
    onboardingCompleted?: boolean;
}
export declare function updateProfile(userId: string, input: UpdateProfileInput): Promise<UserResponse>;
//# sourceMappingURL=auth.service.d.ts.map