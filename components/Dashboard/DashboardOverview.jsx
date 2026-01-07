"use client";

import React, { useState, useEffect } from "react";
import QuickStats from "./QuickStats";
import QuickActions from "./QuickActions";
import RecentQuotes from "./RecentQuotes";
import ProfileProgress from "./ProfileProgress";
import { useAuth } from "@/context/AuthContext";
import { settingsApi, vehiclesApi } from "@/lib/api";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [completionStatus, setCompletionStatus] = useState({
    hasName: false,
    hasPhone: false,
    hasOnboarding: false,
    hasSettings: false,
    hasVehicles: false,
  });

  // Get user's first name for greeting
  const firstName = user?.name?.split(' ')[0] || "there";

  // Calculate profile completion from user data
  useEffect(() => {
    calculateProfileCompletion();
  }, [user]);

  const calculateProfileCompletion = async () => {
    let completedItems = 0;
    const totalItems = 5; // name, phone, settings, vehicle, onboarding

    const status = {
      hasName: false,
      hasPhone: false,
      hasOnboarding: false,
      hasSettings: false,
      hasVehicles: false,
    };

    // 1. Has name
    if (user?.name) {
      completedItems++;
      status.hasName = true;
    }

    // 2. Has phone
    if (user?.phone) {
      completedItems++;
      status.hasPhone = true;
    }

    // 3. Onboarding completed
    if (user?.onboardingCompleted) {
      completedItems++;
      status.hasOnboarding = true;
    }

    // 4. Check for settings (async)
    try {
      const settings = await settingsApi.getSettings();
      if (settings) {
        // Check if user has meaningful settings (either custom or explicitly set values)
        const hasCustomCosts = !settings.useIndustryDefaults;
        const hasKeyValues = settings.annualInsurance > 0 ||
                            settings.monthlyVehiclePayment > 0 ||
                            settings.profitMargin > 0;

        if (hasCustomCosts || hasKeyValues) {
          // User has customized their costs or has meaningful values
          completedItems++;
          status.hasSettings = true;
        } else {
          // At least has settings initialized
          completedItems += 0.5;
        }
      }
    } catch {
      // No settings yet
    }

    // 5. Check for vehicles (async)
    try {
      const vehicles = await vehiclesApi.getVehicles();
      if (vehicles && vehicles.length > 0) {
        completedItems++;
        status.hasVehicles = true;
      }
    } catch {
      // No vehicles yet
    }

    setCompletionStatus(status);
    setProfileCompletion(Math.round((completedItems / totalItems) * 100));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-slate-600">
            Here's your business overview for today.
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="mb-8">
          <QuickStats />
        </div>

        {/* Profile Progress (only shows if not 100% complete) */}
        {profileCompletion < 100 && (
          <div className="mb-8">
            <ProfileProgress
              completionPercentage={profileCompletion}
              completionStatus={completionStatus}
            />
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
