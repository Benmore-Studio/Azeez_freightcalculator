"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaDollarSign, FaTruck, FaCheckCircle, FaArrowRight, FaPhone } from "react-icons/fa";
import { UserCircle } from "lucide-react";
import { Card, Button } from "@/components/ui";

export default function ProfileProgress({
  completionPercentage = 0,
  completionStatus = {}
}) {
  const router = useRouter();

  // Only show this component if profile is not 100% complete
  if (completionPercentage >= 100) return null;

  // Define all possible sections with their completion status
  const allSections = [
    {
      id: "profile",
      title: "Complete Profile Info",
      description: "Add your phone number and personal details",
      icon: UserCircle,
      action: "Update Profile",
      route: "/profile",
      isComplete: completionStatus.hasName && completionStatus.hasPhone,
    },
    {
      id: "settings",
      title: "Add Operating Costs",
      description: "Enter your real costs for accurate rate calculations",
      icon: FaDollarSign,
      action: "Add Costs",
      route: "/profile",
      isComplete: completionStatus.hasSettings,
    },
    {
      id: "vehicles",
      title: "Register Your Vehicles",
      description: "Add vehicle details for personalized calculations",
      icon: FaTruck,
      action: "Add Vehicle",
      route: "/vehicles",
      isComplete: completionStatus.hasVehicles,
    },
  ];

  // Filter to only show incomplete sections
  const incompleteSections = allSections.filter(section => !section.isComplete);

  // If everything is complete, don't show
  if (incompleteSections.length === 0) return null;

  return (
    <Card className="p-6 bg-orange-50 border-2 border-orange-200 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-xl">
            <FaUser className="text-orange-500 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Complete Your Profile</h2>
            <p className="text-sm text-slate-600">
              Unlock accurate rate calculations
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Profile Completion</span>
          <span className="text-sm font-bold text-orange-600">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Incomplete Sections */}
      <div className="space-y-3 mb-4">
        {incompleteSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="bg-white rounded-xl p-4 border-2 border-slate-200 hover:border-orange-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="bg-slate-100 p-2.5 rounded-xl">
                  <Icon className="text-slate-600 text-lg" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm mb-0.5">
                    {section.title}
                  </h3>
                  <p className="text-xs text-slate-500">{section.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(section.route)}
                  className="flex-shrink-0"
                >
                  {section.action}
                  <FaArrowRight className="ml-1.5" size={10} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed Items (show what's done) */}
      {allSections.some(s => s.isComplete) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {allSections.filter(s => s.isComplete).map((section) => (
            <span
              key={section.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium"
            >
              <FaCheckCircle size={10} />
              {section.title.replace("Add ", "").replace("Register ", "").replace("Complete ", "")}
            </span>
          ))}
        </div>
      )}

      {/* Benefits */}
      <div className="bg-white rounded-xl p-4 border border-orange-200">
        <p className="text-sm font-semibold text-slate-900 mb-2">
          Complete your profile to unlock:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={12} />
            <span>Personalized rate calculations</span>
          </li>
          <li className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={12} />
            <span>Accurate profit tracking</span>
          </li>
          <li className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={12} />
            <span>Save vehicle data</span>
          </li>
          <li className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={12} />
            <span>Bonus reward points</span>
          </li>
        </ul>
      </div>
    </Card>
  );
}
