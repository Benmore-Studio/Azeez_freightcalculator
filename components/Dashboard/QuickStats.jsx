"use client";

import React from "react";
import {
  FaFileAlt,
  FaChartLine,
  FaMapMarkedAlt,
  FaTruckMoving,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

export default function QuickStats() {
  // Mock data - will be replaced with actual data from backend
  const stats = [
    {
      id: 1,
      label: "Total Quotes",
      value: "47",
      change: "+12%",
      changeType: "increase",
      period: "vs last month",
      icon: FaFileAlt,
      color: "blue",
    },
    {
      id: 2,
      label: "Avg Profit Margin",
      value: "26.4%",
      change: "+3.2%",
      changeType: "increase",
      period: "vs last month",
      icon: FaChartLine,
      color: "green",
    },
    {
      id: 3,
      label: "Total Miles",
      value: "48.5K",
      change: "+8%",
      changeType: "increase",
      period: "this month",
      icon: FaTruckMoving,
      color: "purple",
    },
    {
      id: 4,
      label: "Most Profitable Route",
      value: "CHI → LA",
      subValue: "$1,150 profit",
      icon: FaMapMarkedAlt,
      color: "orange",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
      },
      green: {
        bg: "bg-green-100",
        text: "text-green-600",
        border: "border-green-200",
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
      },
      orange: {
        bg: "bg-orange-100",
        text: "text-orange-600",
        border: "border-orange-200",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const colorClasses = getColorClasses(stat.color);

        return (
          <div
            key={stat.id}
            className={`bg-white border-2 ${colorClasses.border} rounded-lg p-5 hover:shadow-md transition-all`}
          >
            {/* Icon */}
            <div className="flex items-start justify-between mb-3">
              <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
                <Icon className={`text-xl ${colorClasses.text}`} />
              </div>

              {/* Change Badge (if applicable) */}
              {stat.change && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                    stat.changeType === "increase"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {stat.changeType === "increase" ? (
                    <FaArrowUp className="text-[10px]" />
                  ) : (
                    <FaArrowDown className="text-[10px]" />
                  )}
                  {stat.change}
                </div>
              )}
            </div>

            {/* Label */}
            <p className="text-sm text-gray-600 font-medium mb-1">{stat.label}</p>

            {/* Value */}
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>

            {/* Sub Value or Period */}
            {stat.subValue && (
              <p className="text-sm text-gray-600">{stat.subValue}</p>
            )}
            {stat.period && (
              <p className="text-xs text-gray-500">{stat.period}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
