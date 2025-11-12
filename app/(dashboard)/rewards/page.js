"use client";

import React, { useState } from "react";
import { FaTrophy, FaStar, FaCopy, FaGift, FaCheckCircle } from "react-icons/fa";
import { Target, Truck, Gift } from "lucide-react";
import { Card, Button } from "@/components/ui";

export default function RewardsPage() {
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
    allAchievements: [
      { id: 1, title: "First Quote", iconType: "target", date: "2024-10-15", points: 50, completed: true },
      { id: 2, title: "5 Vehicles Added", iconType: "truck", date: "2024-10-20", points: 100, completed: true },
      { id: 3, title: "First Referral", iconType: "gift", date: "2024-10-28", points: 100, completed: true },
      { id: 4, title: "10 Quotes Calculated", iconType: "target", date: null, points: 75, completed: false },
      { id: 5, title: "Complete Profile", iconType: "target", date: null, points: 50, completed: false },
      { id: 6, title: "5 Referrals", iconType: "gift", date: null, points: 250, completed: false },
    ],
  };

  const levels = [
    { name: "Bronze", color: "from-orange-400 to-orange-600", minPoints: 0, maxPoints: 999 },
    { name: "Silver", color: "from-gray-300 to-gray-500", minPoints: 1000, maxPoints: 2499 },
    { name: "Gold", color: "from-yellow-400 to-yellow-600", minPoints: 2500, maxPoints: 4999 },
    { name: "Platinum", color: "from-purple-400 to-purple-600", minPoints: 5000, maxPoints: null },
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
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
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
                      className={`px-4 py-2 rounded-full bg-gradient-to-r ${currentLevelData?.color} text-white font-bold text-lg`}
                    >
                      {rewardsData.currentLevel}
                    </div>
                    <span className="text-sm text-gray-500">Level {rewardsData.levelNumber}</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {rewardsData.points.toLocaleString()}{" "}
                    <span className="text-base font-normal text-gray-600">points</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Next Level</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {rewardsData.pointsToNextLevel} pts
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round(progressPercentage)}% to Gold Level
                </p>
              </div>

              {/* All Levels */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">All Levels</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {levels.map((level) => (
                    <div
                      key={level.name}
                      className={`p-3 rounded-lg border-2 ${
                        level.name === rewardsData.currentLevel
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div
                        className={`px-3 py-1 rounded-full bg-gradient-to-r ${level.color} text-white font-bold text-sm mb-2`}
                      >
                        {level.name}
                      </div>
                      <p className="text-xs text-gray-600">
                        {level.minPoints.toLocaleString()}{level.maxPoints ? `  - ${level.maxPoints.toLocaleString()}` : "+"} pts
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
                Achievements
              </h2>

              <div className="space-y-3">
                {rewardsData.allAchievements.map((achievement) => {
                  const AchievementIcon =
                    achievement.iconType === "target" ? Target :
                    achievement.iconType === "truck" ? Truck :
                    Gift;

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
                            : "Not completed yet"}
                        </p>
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
                  {rewardsData.referralCode}
                </div>
                <Button
                  size="sm"
                  variant={copied ? "secondary" : "primary"}
                  icon={copied ? <FaCheckCircle /> : <FaCopy />}
                  iconPosition="left"
                  onClick={handleCopyReferralCode}
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
                  {rewardsData.referralCount}
                </p>
                <p className="text-xs text-gray-600">
                  successful referral{rewardsData.referralCount !== 1 ? "s" : ""}
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
