import { z } from 'zod';
import * as rewardService from '../services/reward.service.js';
import { sendSuccess } from '../utils/response.js';
import { ApiError } from '../utils/ApiError.js';
/**
 * Get all rewards for the current user
 * GET /api/rewards
 */
export async function getRewards(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const rewards = await rewardService.getRewards(userId);
        return sendSuccess(res, rewards);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get reward statistics
 * GET /api/rewards/stats
 */
export async function getRewardStats(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const stats = await rewardService.getRewardStats(userId);
        return sendSuccess(res, stats);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get user's referral code
 * GET /api/rewards/referral-code
 */
export async function getReferralCode(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const referral = await rewardService.getReferralCode(userId);
        return sendSuccess(res, referral);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get referral statistics
 * GET /api/rewards/referrals
 */
export async function getReferralStats(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const stats = await rewardService.getReferralStats(userId);
        return sendSuccess(res, stats);
    }
    catch (error) {
        next(error);
    }
}
// Validation schema for applying referral code
const applyReferralSchema = z.object({
    referralCode: z.string().min(1, 'Referral code is required').max(20),
});
/**
 * Apply a referral code (used during signup)
 * POST /api/rewards/apply-referral
 */
export async function applyReferralCode(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const { referralCode } = applyReferralSchema.parse(req.body);
        const result = await rewardService.applyReferralCode(userId, referralCode);
        return sendSuccess(res, result, 'Referral code applied successfully');
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')));
        }
        next(error);
    }
}
// Validation schema for updating progress (internal use)
const updateProgressSchema = z.object({
    rewardType: z.string().min(1),
    increment: z.number().int().positive().optional(),
});
/**
 * Manually update reward progress (for testing/admin)
 * POST /api/rewards/progress
 */
export async function updateProgress(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const { rewardType, increment = 1 } = updateProgressSchema.parse(req.body);
        const result = await rewardService.updateRewardProgress(userId, rewardType, increment);
        return sendSuccess(res, result);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')));
        }
        next(error);
    }
}
//# sourceMappingURL=reward.controller.js.map