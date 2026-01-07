import { z } from 'zod';
import * as authService from '../services/auth.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { ApiError } from '../utils/ApiError.js';
// Validation schemas
export const registerSchema = z
    .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().optional(),
    // Accept both camelCase and snake_case for compatibility
    companyName: z.string().optional(),
    company_name: z.string().optional(),
    userType: z.enum(['owner_operator', 'fleet_manager', 'dispatcher']).optional(),
    user_type: z.enum(['owner_operator', 'fleet_manager', 'dispatcher']).optional(),
})
    .transform((data) => ({
    email: data.email,
    password: data.password,
    name: data.name,
    phone: data.phone,
    companyName: data.companyName || data.company_name,
    userType: data.userType || data.user_type,
}));
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});
export const refreshSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});
// Controller functions
export async function register(req, res, next) {
    try {
        const validatedData = registerSchema.parse(req.body);
        const result = await authService.register(validatedData);
        sendCreated(res, result, 'Account created successfully');
    }
    catch (error) {
        next(error);
    }
}
export async function login(req, res, next) {
    try {
        const validatedData = loginSchema.parse(req.body);
        const result = await authService.login(validatedData);
        sendSuccess(res, result, 'Login successful');
    }
    catch (error) {
        next(error);
    }
}
export async function refresh(req, res, next) {
    try {
        const { refreshToken } = refreshSchema.parse(req.body);
        const tokens = await authService.refreshAccessToken(refreshToken);
        sendSuccess(res, tokens, 'Token refreshed successfully');
    }
    catch (error) {
        next(error);
    }
}
export async function me(req, res, next) {
    try {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required');
        }
        const user = await authService.getCurrentUser(req.user.userId);
        sendSuccess(res, user);
    }
    catch (error) {
        next(error);
    }
}
export async function logout(_req, res, next) {
    try {
        // In a production app, you might want to:
        // 1. Add the token to a blacklist
        // 2. Clear refresh tokens from database
        // For now, we just acknowledge the logout
        sendSuccess(res, null, 'Logged out successfully');
    }
    catch (error) {
        next(error);
    }
}
export async function deleteAccount(req, res, next) {
    try {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required');
        }
        await authService.deleteAccount(req.user.userId);
        sendSuccess(res, null, 'Account deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
const updateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    onboardingCompleted: z.boolean().optional(),
});
export async function updateProfile(req, res, next) {
    try {
        if (!req.user) {
            throw ApiError.unauthorized('Authentication required');
        }
        const validatedData = updateProfileSchema.parse(req.body);
        const user = await authService.updateProfile(req.user.userId, validatedData);
        sendSuccess(res, { user }, 'Profile updated successfully');
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            next(ApiError.badRequest('Validation error: ' + error.errors.map(e => e.message).join(', ')));
            return;
        }
        next(error);
    }
}
//# sourceMappingURL=auth.controller.js.map