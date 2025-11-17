"use client";

import React from "react";
import { FaCalculator, FaTruck, FaFileAlt } from "react-icons/fa";
import { Card } from "@/components/ui";
import Link from "next/link";

export default function QuickActions() {
  const actions = [
    {
      icon: FaCalculator,
      title: "Calculate Rate",
      description: "Get accurate rates for your loads",
      href: "/calculator",
      color: "blue",
      primary: true,
    },
    {
      icon: FaTruck,
      title: "Manage Vehicles",
      description: "View and add vehicles",
      href: "/vehicles",
      color: "green",
    },
    {
      icon: FaFileAlt,
      title: "View All Quotes",
      description: "Browse all saved quotes",
      href: "/quotes",
      color: "blue",
    },
  ];

  const getColorClasses = (color, isPrimary) => {
    if (isPrimary) {
      return "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg border-blue-600";
    }

    const colors = {
      blue: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      green: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      purple: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
      gray: "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200",
    };
    return colors[color] || colors.gray;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const colorClasses = getColorClasses(action.color, action.primary);

          const content = (
            <>
              <div className={`p-3 rounded-lg inline-block mb-3 ${
                action.primary
                  ? "bg-white/20"
                  : action.color === "blue" ? "bg-blue-100"
                  : action.color === "green" ? "bg-green-100"
                  : action.color === "purple" ? "bg-purple-100"
                  : "bg-gray-100"
              }`}>
                <Icon className="text-2xl" />
              </div>
              <h3 className="font-semibold text-base mb-1">{action.title}</h3>
              <p className={`text-xs ${action.primary ? "text-blue-100" : "text-gray-600"}`}>
                {action.description}
              </p>
            </>
          );

          const commonClasses = `flex flex-col items-start p-4 rounded-lg border-2 transition-all ${colorClasses}`;

          if (action.href) {
            return (
              <Link key={index} href={action.href} className={commonClasses}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`${commonClasses} text-left`}
            >
              {content}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
