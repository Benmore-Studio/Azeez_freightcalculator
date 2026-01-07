import { Router } from 'express';
import * as rewardController from '../controllers/reward.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /api/rewards
 * @desc    Get all rewards/achievements for the current user
 * @access  Protected
 */
router.get('/', authenticate, rewardController.getRewards);

/**
 * @route   GET /api/rewards/stats
 * @desc    Get reward statistics (completion %, counts)
 * @access  Protected
 */
router.get('/stats', authenticate, rewardController.getRewardStats);

/**
 * @route   GET /api/rewards/referral-code
 * @desc    Get user's referral code (creates one if doesn't exist)
 * @access  Protected
 */
router.get('/referral-code', authenticate, rewardController.getReferralCode);

/**
 * @route   GET /api/rewards/referrals
 * @desc    Get referral statistics and history
 * @access  Protected
 */
router.get('/referrals', authenticate, rewardController.getReferralStats);

/**
 * @route   POST /api/rewards/apply-referral
 * @desc    Apply a referral code to the current user's account
 * @access  Protected
 */
router.post('/apply-referral', authenticate, rewardController.applyReferralCode);

/**
 * @route   POST /api/rewards/progress
 * @desc    Update reward progress (mainly for internal/testing use)
 * @access  Protected
 */
router.post('/progress', authenticate, rewardController.updateProgress);

export default router;
