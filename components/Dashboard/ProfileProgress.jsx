"use client";

import React from "react";
import { FaUser, FaDollarSign, FaTruck, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { Card, Button } from "@/components/ui";

export default function ProfileProgress({ completionPercentage = 60 }) {
  // Only show this component if profile is not 100% complete
  if (completionPercentage >= 100) return null;

  const incompleteSections = [
    {
      id: 1,
      title: "Add Cost Information",
      description: "Calculate your cost per mile for accurate rates",
      icon: FaDollarSign,
      color: "green",
      action: "Add Costs",
      completed: false,
    },
    {
      id: 2,
      title: "Register Your Vehicles",
      description: "Add vehicle details for personalized calculations",
      icon: FaTruck,
      color: "blue",
      action: "Add Vehicle",
      completed: false,
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: "bg-green-100 text-green-600",
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <Card className="p-6 bg-orange-50 border-2 border-orange-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-full">
            <FaUser className="text-orange-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="text-sm text-gray-600">
              Unlock all features and get better rates
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Profile Completion</span>
          <span className="text-sm font-bold text-orange-600">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-orange-600 h-3 rounded-full transition-all duration-500"
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
              className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-orange-300 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getColorClasses(section.color)}`}>
                  <Icon className="text-lg" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {section.title}
                  </h3>
                  <p className="text-xs text-gray-600">{section.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<FaArrowRight />}
                  iconPosition="right"
                  onClick={() => console.log(`${section.action} - to be implemented`)}
                >
                  {section.action}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-lg p-4 border border-orange-200">
        <p className="text-sm font-semibold text-gray-900 mb-2">
          Complete your profile to unlock:
        </p>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
            <span>Personalized rate calculations</span>
          </li>
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
            <span>Accurate profit margin tracking</span>
          </li>
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
            <span>Save and reuse vehicle data</span>
          </li>
          <li className="flex items-start gap-2">
            <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
            <span>Bonus rewards points</span>
          </li>
        </ul>
      </div>
    </Card>
  );
}
