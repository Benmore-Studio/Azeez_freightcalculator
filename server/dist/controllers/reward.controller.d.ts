import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';
/**
 * Get all rewards for the current user
 * GET /api/rewards
 */
export declare function getRewards(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get reward statistics
 * GET /api/rewards/stats
 */
export declare function getRewardStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get user's referral code
 * GET /api/rewards/referral-code
 */
export declare function getReferralCode(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get referral statistics
 * GET /api/rewards/referrals
 */
export declare function getReferralStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Apply a referral code (used during signup)
 * POST /api/rewards/apply-referral
 */
export declare function applyReferralCode(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
/**
 * Manually update reward progress (for testing/admin)
 * POST /api/rewards/progress
 */
export declare function updateProgress(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=reward.controller.d.ts.map