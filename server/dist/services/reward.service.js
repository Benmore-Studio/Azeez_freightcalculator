import { prisma } from './prisma.js';
import { ApiError } from '../utils/ApiError.js';
import crypto from 'crypto';
// Reward type definitions
export const REWARD_TYPES = {
    FIRST_QUOTE: 'first_quote',
    QUOTES_5: 'quotes_5',
    QUOTES_25: 'quotes_25',
    QUOTES_100: 'quotes_100',
    FIRST_BOOKING: 'first_booking',
    BOOKINGS_10: 'bookings_10',
    PROFILE_COMPLETE: 'profile_complete',
    VEHICLE_ADDED: 'vehicle_added',
    REFERRAL_SENT: 'referral_sent',
    REFERRAL_COMPLETED: 'referral_completed',
};
// Reward definitions with targets
const REWARD_DEFINITIONS = {
    [REWARD_TYPES.FIRST_QUOTE]: {
        name: 'First Calculator',
        description: 'Calculate your first freight rate',
        targetProgress: 1,
    },
    [REWARD_TYPES.QUOTES_5]: {
        name: 'Getting Started',
        description: 'Calculate 5 freight rates',
        targetProgress: 5,
    },
    [REWARD_TYPES.QUOTES_25]: {
        name: 'Rate Expert',
        description: 'Calculate 25 freight rates',
        targetProgress: 25,
    },
    [REWARD_TYPES.QUOTES_100]: {
        name: 'Rate Master',
        description: 'Calculate 100 freight rates',
        targetProgress: 100,
    },
    [REWARD_TYPES.FIRST_BOOKING]: {
        name: 'First Load',
        description: 'Book your first load',
        targetProgress: 1,
    },
    [REWARD_TYPES.BOOKINGS_10]: {
        name: 'Regular Hauler',
        description: 'Book 10 loads',
        targetProgress: 10,
    },
    [REWARD_TYPES.PROFILE_COMPLETE]: {
        name: 'Profile Pro',
        description: 'Complete your profile setup',
        targetProgress: 1,
    },
    [REWARD_TYPES.VEHICLE_ADDED]: {
        name: 'Fleet Builder',
        description: 'Add a vehicle to your fleet',
        targetProgress: 1,
    },
    [REWARD_TYPES.REFERRAL_SENT]: {
        name: 'Sharing is Caring',
        description: 'Send your first referral',
        targetProgress: 1,
    },
    [REWARD_TYPES.REFERRAL_COMPLETED]: {
        name: 'Network Builder',
        description: 'Have a referral sign up',
        targetProgress: 1,
    },
};
/**
 * Get all rewards for a user (creates default rewards if none exist)
 */
export async function getRewards(userId) {
    // First, ensure user has all reward types initialized
    await initializeUserRewards(userId);
    const rewards = await prisma.userReward.findMany({
        where: { userId },
        orderBy: [
            { isCompleted: 'asc' },
            { currentProgress: 'desc' },
        ],
    });
    return rewards.map(reward => ({
        ...reward,
        percentComplete: Math.min(100, Math.round((reward.currentProgress / reward.targetProgress) * 100)),
    }));
}
/**
 * Initialize default rewards for a user
 */
export async function initializeUserRewards(userId) {
    const existingRewards = await prisma.userReward.findMany({
        where: { userId },
        select: { rewardType: true },
    });
    const existingTypes = new Set(existingRewards.map(r => r.rewardType));
    // Create any missing reward types
    const rewardsToCreate = Object.entries(REWARD_DEFINITIONS)
        .filter(([type]) => !existingTypes.has(type))
        .map(([type, def]) => ({
        userId,
        rewardType: type,
        rewardName: def.name,
        description: def.description,
        targetProgress: def.targetProgress,
        currentProgress: 0,
        isCompleted: false,
    }));
    if (rewardsToCreate.length > 0) {
        await prisma.userReward.createMany({
            data: rewardsToCreate,
        });
    }
}
/**
 * Update progress for a specific reward type
 */
export async function updateRewardProgress(userId, rewardType, progressIncrement = 1) {
    const reward = await prisma.userReward.findFirst({
        where: {
            userId,
            rewardType,
        },
    });
    if (!reward) {
        // Initialize rewards if not found
        await initializeUserRewards(userId);
        return updateRewardProgress(userId, rewardType, progressIncrement);
    }
    if (reward.isCompleted) {
        return reward; // Already completed
    }
    const newProgress = reward.currentProgress + progressIncrement;
    const isNowCompleted = newProgress >= reward.targetProgress;
    const updatedReward = await prisma.userReward.update({
        where: { id: reward.id },
        data: {
            currentProgress: newProgress,
            isCompleted: isNowCompleted,
            earnedAt: isNowCompleted ? new Date() : null,
        },
    });
    return {
        ...updatedReward,
        justCompleted: isNowCompleted && !reward.isCompleted,
    };
}
/**
 * Get reward statistics for a user
 */
export async function getRewardStats(userId) {
    await initializeUserRewards(userId);
    const rewards = await prisma.userReward.findMany({
        where: { userId },
    });
    const completed = rewards.filter(r => r.isCompleted).length;
    const total = rewards.length;
    const totalProgress = rewards.reduce((sum, r) => {
        return sum + Math.min(r.currentProgress / r.targetProgress, 1);
    }, 0);
    return {
        completedCount: completed,
        totalCount: total,
        completionPercentage: Math.round((completed / total) * 100),
        overallProgress: Math.round((totalProgress / total) * 100),
    };
}
/**
 * Generate or get existing referral code for a user
 */
export async function getReferralCode(userId) {
    // Check for existing referral
    let referral = await prisma.referral.findFirst({
        where: {
            referrerId: userId,
            referredId: null, // Unused referral code
        },
        orderBy: { createdAt: 'desc' },
    });
    // If no unused code exists, create one
    if (!referral) {
        const code = generateReferralCode();
        referral = await prisma.referral.create({
            data: {
                referrerId: userId,
                referralCode: code,
                status: 'pending',
            },
        });
    }
    return {
        code: referral.referralCode,
        createdAt: referral.createdAt,
    };
}
/**
 * Get referral statistics for a user
 */
export async function getReferralStats(userId) {
    const referrals = await prisma.referral.findMany({
        where: { referrerId: userId },
        include: {
            referred: {
                select: {
                    name: true,
                    createdAt: true,
                },
            },
        },
    });
    const pendingCount = referrals.filter(r => r.status === 'pending' && !r.referredId).length;
    const completedCount = referrals.filter(r => r.status === 'completed' || r.referredId).length;
    const totalEarned = referrals.reduce((sum, r) => sum + Number(r.rewardEarned), 0);
    return {
        totalReferrals: referrals.length,
        pendingCount,
        completedCount,
        totalEarned,
        referrals: referrals.map(r => ({
            code: r.referralCode,
            status: r.status,
            referredName: r.referred?.name || null,
            completedAt: r.completedAt,
            rewardEarned: Number(r.rewardEarned),
        })),
    };
}
/**
 * Apply a referral code during signup
 */
export async function applyReferralCode(referredUserId, referralCode) {
    const referral = await prisma.referral.findUnique({
        where: { referralCode: referralCode.toUpperCase() },
    });
    if (!referral) {
        throw ApiError.notFound('Invalid referral code');
    }
    if (referral.referredId) {
        throw ApiError.badRequest('This referral code has already been used');
    }
    if (referral.referrerId === referredUserId) {
        throw ApiError.badRequest('You cannot use your own referral code');
    }
    // Update the referral record
    await prisma.referral.update({
        where: { id: referral.id },
        data: {
            referredId: referredUserId,
            status: 'completed',
            completedAt: new Date(),
            rewardEarned: 10.00, // $10 referral bonus (configurable)
        },
    });
    // Update referrer's reward progress
    await updateRewardProgress(referral.referrerId, REWARD_TYPES.REFERRAL_COMPLETED, 1);
    return { success: true, referrerId: referral.referrerId };
}
/**
 * Generate a unique referral code
 */
function generateReferralCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding ambiguous chars
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars[crypto.randomInt(chars.length)];
    }
    return code;
}
//# sourceMappingURL=reward.service.js.map