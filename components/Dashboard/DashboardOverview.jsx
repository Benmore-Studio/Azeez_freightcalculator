"use client";

import React from "react";
import QuickStats from "./QuickStats";
import QuickActions from "./QuickActions";
import RecentQuotes from "./RecentQuotes";
import ProfileProgress from "./ProfileProgress";

export default function DashboardOverview({ userName = "John" }) {
  // Mock user data - will be replaced with actual data from backend/auth
  const userData = {
    name: userName,
    profileCompletion: 60, // Percentage
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Welcome Header - No background */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {userData.name}!
          </h1>
          <p className="text-gray-600">
            Welcome back to your dashboard. Here's your business overview.
          </p>
        </div>

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

        {/* Recent Quotes */}
        <div className="mb-8">
          <RecentQuotes />
        </div>
      </div>
    </div>
  );
}
