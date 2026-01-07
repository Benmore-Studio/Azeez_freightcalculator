export declare const REWARD_TYPES: {
    readonly FIRST_QUOTE: "first_quote";
    readonly QUOTES_5: "quotes_5";
    readonly QUOTES_25: "quotes_25";
    readonly QUOTES_100: "quotes_100";
    readonly FIRST_BOOKING: "first_booking";
    readonly BOOKINGS_10: "bookings_10";
    readonly PROFILE_COMPLETE: "profile_complete";
    readonly VEHICLE_ADDED: "vehicle_added";
    readonly REFERRAL_SENT: "referral_sent";
    readonly REFERRAL_COMPLETED: "referral_completed";
};
/**
 * Get all rewards for a user (creates default rewards if none exist)
 */
export declare function getRewards(userId: string): Promise<{
    percentComplete: number;
    id: string;
    createdAt: Date;
    userId: string;
    rewardType: string;
    rewardName: string;
    description: string | null;
    currentProgress: number;
    targetProgress: number;
    isCompleted: boolean;
    metadata: import("../../../lib/generated/prisma/runtime/library.js").JsonValue;
    earnedAt: Date | null;
}[]>;
/**
 * Initialize default rewards for a user
 */
export declare function initializeUserRewards(userId: string): Promise<void>;
/**
 * Update progress for a specific reward type
 */
export declare function updateRewardProgress(userId: string, rewardType: string, progressIncrement?: number): Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    rewardType: string;
    rewardName: string;
    description: string | null;
    currentProgress: number;
    targetProgress: number;
    isCompleted: boolean;
    metadata: import("../../../lib/generated/prisma/runtime/library.js").JsonValue;
    earnedAt: Date | null;
} | {
    justCompleted: boolean;
    id: string;
    createdAt: Date;
    userId: string;
    rewardType: string;
    rewardName: string;
    description: string | null;
    currentProgress: number;
    targetProgress: number;
    isCompleted: boolean;
    metadata: import("../../../lib/generated/prisma/runtime/library.js").JsonValue;
    earnedAt: Date | null;
}>;
/**
 * Get reward statistics for a user
 */
export declare function getRewardStats(userId: string): Promise<{
    completedCount: number;
    totalCount: number;
    completionPercentage: number;
    overallProgress: number;
}>;
/**
 * Generate or get existing referral code for a user
 */
export declare function getReferralCode(userId: string): Promise<{
    code: string;
    createdAt: Date;
}>;
/**
 * Get referral statistics for a user
 */
export declare function getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    pendingCount: number;
    completedCount: number;
    totalEarned: number;
    referrals: {
        code: string;
        status: string;
        referredName: string | null;
        completedAt: Date | null;
        rewardEarned: number;
    }[];
}>;
/**
 * Apply a referral code during signup
 */
export declare function applyReferralCode(referredUserId: string, referralCode: string): Promise<{
    success: boolean;
    referrerId: string;
}>;
//# sourceMappingURL=reward.service.d.ts.map