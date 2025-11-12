"use client";

import React, { useState } from "react";
import { FaTrophy, FaStar, FaCopy, FaGift, FaCheckCircle } from "react-icons/fa";
import { Target, Truck, Gift } from "lucide-react";
import { Card, Button } from "@/components/ui";

export default function RewardsOverview() {
  const [copied, setCopied] = useState(false);

  // Mock data - will be replaced with actual data from backend
  const rewardsData = {
    currentLevel: "Silver",
    levelNumber: 2,
    points: 1250,
    pointsToNextLevel: 500,
    totalPointsForNextLevel: 1750,
    referralCode: "FREIGHT2024XYZ",
    referralCount: 3,
    recentAchievements: [
      { id: 1, title: "First Quote", iconType: "target", date: "2024-10-15" },
      { id: 2, title: "5 Vehicles Added", iconType: "truck", date: "2024-10-20" },
      { id: 3, title: "First Referral", iconType: "gift", date: "2024-10-28" },
    ],
  };

  const levels = [
    { name: "Bronze", color: "from-orange-400 to-orange-600", minPoints: 0 },
    { name: "Silver", color: "from-gray-300 to-gray-500", minPoints: 1000 },
    { name: "Gold", color: "from-yellow-400 to-yellow-600", minPoints: 2500 },
    { name: "Platinum", color: "from-purple-400 to-purple-600", minPoints: 5000 },
  ];

  const currentLevelData = levels.find((l) => l.name === rewardsData.currentLevel);
  const progressPercentage =
    (rewardsData.points / rewardsData.totalPointsForNextLevel) * 100;

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(rewardsData.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 bg-white border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Rewards & Level
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            You're earning points with every action!
          </p>
        </div>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </div>

      {/* Level & Points */}
      <div className="bg-white rounded-lg p-5 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`px-3 py-1 rounded-full bg-gradient-to-r ${currentLevelData?.color} text-white font-bold text-sm`}
              >
                {rewardsData.currentLevel}
              </div>
              <span className="text-xs text-gray-500">Level {rewardsData.levelNumber}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {rewardsData.points.toLocaleString()}{" "}
              <span className="text-sm font-normal text-gray-600">points</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Next Level</p>
            <p className="text-lg font-bold text-blue-600">
              {rewardsData.pointsToNextLevel} pts
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {Math.round(progressPercentage)}% to Gold Level
          </p>
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <FaGift className="text-green-600" />
          <h3 className="font-bold text-gray-900">Referral Program</h3>
        </div>
        <p className="text-sm text-gray-700 mb-3">
          Share your code and earn <strong>100 points</strong> per referral!
        </p>

        <div className="flex gap-2">
          <div className="flex-1 bg-white border-2 border-gray-300 rounded-md px-3 py-2 font-mono text-sm font-bold text-gray-900">
            {rewardsData.referralCode}
          </div>
          <Button
            size="sm"
            variant={copied ? "secondary" : "primary"}
            icon={copied ? <FaCheckCircle /> : <FaCopy />}
            iconPosition="left"
            onClick={handleCopyReferralCode}
            className={copied ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        <p className="text-xs text-gray-600 mt-2">
          {rewardsData.referralCount} successful referral{rewardsData.referralCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Recent Achievements */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          Recent Achievements
        </h3>
        <div className="space-y-2">
          {rewardsData.recentAchievements.map((achievement) => {
            const AchievementIcon =
              achievement.iconType === "target" ? Target :
              achievement.iconType === "truck" ? Truck :
              Gift;

            return (
              <div
                key={achievement.id}
                className="flex items-center gap-3 bg-white rounded-md p-3 border border-gray-200"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <AchievementIcon className="text-blue-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {achievement.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(achievement.date).toLocaleDateString()}
                  </p>
                </div>
                <FaCheckCircle className="text-green-500" />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
