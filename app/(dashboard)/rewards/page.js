"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaTrophy, FaStar, FaCopy, FaGift, FaCheckCircle } from "react-icons/fa";
import { Target, Truck, Gift, Users, Calculator } from "lucide-react";
import { Card, Button, Spinner } from "@/components/ui";
import { rewardsApi } from "@/lib/api";

export default function RewardsPage() {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [referralCode, setReferralCode] = useState("");
  const [referralStats, setReferralStats] = useState({ completedCount: 0 });
  const [rewardStats, setRewardStats] = useState({ completedCount: 0, totalCount: 0 });

  const loadRewardsData = useCallback(async () => {
    try {
      // Fetch all rewards data in parallel
      const [rewardsData, statsData, referralData, referralStatsData] = await Promise.all([
        rewardsApi.getRewards(),
        rewardsApi.getRewardStats(),
        rewardsApi.getReferralCode(),
        rewardsApi.getReferralStats(),
      ]);

      // Transform rewards to achievements format
      const transformedAchievements = rewardsData.map((reward) => ({
        id: reward.id,
        title: reward.rewardName,
        description: reward.description,
        iconType: getIconType(reward.rewardType),
        date: reward.earnedAt,
        points: getPointsForReward(reward.rewardType),
        completed: reward.isCompleted,
        progress: reward.currentProgress,
        target: reward.targetProgress,
        percentComplete: reward.percentComplete,
      }));

      setAchievements(transformedAchievements);
      setRewardStats(statsData);
      setReferralCode(referralData.code);
      setReferralStats(referralStatsData);
    } catch (error) {
      console.error("Failed to load rewards:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRewardsData();
  }, [loadRewardsData]);

  // Map reward type to icon
  const getIconType = (rewardType) => {
    const iconMap = {
      first_quote: "calculator",
      quotes_5: "calculator",
      quotes_25: "calculator",
      quotes_100: "calculator",
      first_booking: "truck",
      bookings_10: "truck",
      profile_complete: "target",
      vehicle_added: "truck",
      referral_sent: "gift",
      referral_completed: "users",
    };
    return iconMap[rewardType] || "target";
  };

  // Map reward type to points
  const getPointsForReward = (rewardType) => {
    const pointsMap = {
      first_quote: 50,
      quotes_5: 75,
      quotes_25: 150,
      quotes_100: 300,
      first_booking: 100,
      bookings_10: 250,
      profile_complete: 50,
      vehicle_added: 100,
      referral_sent: 25,
      referral_completed: 100,
    };
    return pointsMap[rewardType] || 50;
  };

  // Calculate total points from completed achievements
  const calculateTotalPoints = () => {
    return achievements
      .filter((a) => a.completed)
      .reduce((sum, a) => sum + a.points, 0);
  };

  const totalPoints = calculateTotalPoints();

  const levels = [
    { name: "Bronze", color: "bg-orange-500", minPoints: 0, maxPoints: 499 },
    { name: "Silver", color: "bg-gray-400", minPoints: 500, maxPoints: 999 },
    { name: "Gold", color: "bg-yellow-500", minPoints: 1000, maxPoints: 1999 },
    { name: "Platinum", color: "bg-blue-600", minPoints: 2000, maxPoints: null },
  ];

  // Determine current level based on points
  const getCurrentLevel = () => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (totalPoints >= levels[i].minPoints) {
        return { level: levels[i], index: i };
      }
    }
    return { level: levels[0], index: 0 };
  };

  const { level: currentLevelData, index: levelIndex } = getCurrentLevel();
  const nextLevel = levels[levelIndex + 1];
  const pointsToNextLevel = nextLevel ? nextLevel.minPoints - totalPoints : 0;
  const progressPercentage = nextLevel
    ? ((totalPoints - currentLevelData.minPoints) / (nextLevel.minPoints - currentLevelData.minPoints)) * 100
    : 100;

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get icon component for achievement
  const getIconComponent = (iconType) => {
    const icons = {
      target: Target,
      truck: Truck,
      gift: Gift,
      calculator: Calculator,
      users: Users,
    };
    return icons[iconType] || Target;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaTrophy className="text-yellow-500" size={36} />
            Rewards & Achievements
          </h1>
          <p className="text-gray-600">
            Track your progress and earn rewards for using Cargo Credible
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level & Points Card */}
            <Card className="p-6 bg-white border-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Level</h2>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`px-4 py-2 rounded-full ${currentLevelData?.color} text-white font-bold text-lg`}
                    >
                      {currentLevelData?.name}
                    </div>
                    <span className="text-sm text-gray-500">Level {levelIndex + 1}</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalPoints.toLocaleString()}{" "}
                    <span className="text-base font-normal text-gray-600">points</span>
                  </p>
                </div>
                {nextLevel && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Next Level</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {pointsToNextLevel} pts
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, progressPercentage)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {nextLevel
                    ? `${Math.round(progressPercentage)}% to ${nextLevel.name} Level`
                    : "Maximum level reached!"}
                </p>
              </div>

              {/* All Levels */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">All Levels</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {levels.map((level, idx) => (
                    <div
                      key={level.name}
                      className={`p-3 rounded-lg border-2 ${
                        level.name === currentLevelData?.name
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div
                        className={`px-3 py-1 rounded-full ${level.color} text-white font-bold text-sm mb-2 inline-block`}
                      >
                        {level.name}
                      </div>
                      <p className="text-xs text-gray-600">
                        {level.minPoints.toLocaleString()}{level.maxPoints ? ` - ${level.maxPoints.toLocaleString()}` : "+"} pts
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Achievements Card */}
            <Card className="p-6 bg-white border-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                Achievements ({rewardStats.completedCount}/{rewardStats.totalCount})
              </h2>

              <div className="space-y-3">
                {achievements.map((achievement) => {
                  const AchievementIcon = getIconComponent(achievement.iconType);

                  return (
                    <div
                      key={achievement.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                        achievement.completed
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className={`p-3 rounded-lg ${
                        achievement.completed ? "bg-green-100" : "bg-gray-200"
                      }`}>
                        <AchievementIcon
                          className={achievement.completed ? "text-green-600" : "text-gray-400"}
                          size={24}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {achievement.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {achievement.completed
                            ? `Completed ${new Date(achievement.date).toLocaleDateString()}`
                            : achievement.target > 1
                              ? `Progress: ${achievement.progress}/${achievement.target}`
                              : achievement.description}
                        </p>
                        {!achievement.completed && achievement.target > 1 && (
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${achievement.percentComplete}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {achievement.completed ? (
                          <FaCheckCircle className="text-green-500 text-2xl" />
                        ) : (
                          <p className="text-sm font-bold text-gray-600">
                            +{achievement.points} pts
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Referral Card */}
            <Card className="p-6 bg-green-50 border-2 border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <FaGift className="text-green-600 text-xl" />
                <h3 className="font-bold text-gray-900 text-lg">Referral Program</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Share your code and earn <strong>100 points</strong> per referral!
              </p>

              <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-white border-2 border-gray-300 rounded-md px-3 py-3 font-mono text-sm font-bold text-gray-900">
                  {referralCode || "Loading..."}
                </div>
                <Button
                  size="sm"
                  variant={copied ? "secondary" : "primary"}
                  icon={copied ? <FaCheckCircle /> : <FaCopy />}
                  iconPosition="left"
                  onClick={handleCopyReferralCode}
                  disabled={!referralCode}
                  className={copied ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>

              <div className="pt-4 border-t border-green-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Your Referral Stats
                </p>
                <p className="text-2xl font-bold text-green-600 mb-1">
                  {referralStats.completedCount}
                </p>
                <p className="text-xs text-gray-600">
                  successful referral{referralStats.completedCount !== 1 ? "s" : ""}
                </p>
              </div>
            </Card>

            {/* How to Earn Points */}
            <Card className="p-6 bg-white border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">How to Earn Points</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>50 pts</strong> - Calculate your first quote</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>100 pts</strong> - Add a vehicle</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>50 pts</strong> - Complete your profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>100 pts</strong> - Refer a friend</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span><strong>75 pts</strong> - Calculate 10 quotes</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
