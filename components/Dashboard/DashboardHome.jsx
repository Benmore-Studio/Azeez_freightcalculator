"use client";

import React from "react";
import { FaSmile } from "react-icons/fa";
import QuickActions from "./QuickActions";
import QuickStats from "./QuickStats";
import SavedQuotes from "./SavedQuotes";
import SavedVehicles from "./SavedVehicles";
import RewardsOverview from "./RewardsOverview";
import ProfileProgress from "./ProfileProgress";

export default function DashboardHome({ userName = "Driver" }) {
  // Mock user data - will be replaced with actual data from backend/auth
  const userData = {
    name: userName,
    profileCompletion: 60, // Percentage
    lastLogin: new Date().toLocaleDateString(),
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Welcome Header */}
      <div className="bg-blue-600 text-white py-8 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <FaSmile className="text-3xl text-yellow-300" />
            <h1 className="text-3xl sm:text-4xl font-bold">
              {getGreeting()}, {userData.name}!
            </h1>
          </div>
          <p className="text-blue-100 text-sm sm:text-base">
            Welcome back to your dashboard. Here's what's happening with your freight business.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quick Stats Row */}
        <div className="mb-8">
          <QuickStats />
        </div>

        {/* Profile Progress (only shows if not 100% complete) */}
        {userData.profileCompletion < 100 && (
          <div className="mb-8">
            <ProfileProgress completionPercentage={userData.profileCompletion} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Main Grid Layout - 2 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Takes up 2/3 on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Saved Quotes */}
            <SavedQuotes />

            {/* Saved Vehicles */}
            <SavedVehicles />
          </div>

          {/* Right Column - Takes up 1/3 on large screens */}
          <div className="lg:col-span-1">
            {/* Rewards Overview */}
            <RewardsOverview />
          </div>
        </div>

        {/* Additional Info Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Last login: {userData.lastLogin} • Need help?{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}
