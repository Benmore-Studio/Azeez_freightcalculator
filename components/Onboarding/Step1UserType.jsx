"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";

export default function Step1UserType({ initialData, onNext }) {
  const [userType, setUserType] = useState(initialData.userType || "");

  const userTypes = [
    {
      value: "owner-operator",
      label: "Owner Operator",
      icon: "🚛",
      description: "I own and operate my own truck",
    },
    {
      value: "fleet-manager",
      label: "Fleet Manager",
      icon: "👔",
      description: "I manage a fleet of vehicles",
    },
    {
      value: "dispatcher",
      label: "Dispatcher",
      icon: "📋",
      description: "I coordinate loads and drivers",
    },
  ];

  const handleContinue = () => {
    if (!userType) {
      alert("Please select your role");
      return;
    }
    onNext({ userType });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">What best describes you?</h3>
        <p className="text-gray-600 text-sm">
          This helps us customize your experience and provide relevant features
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {userTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => setUserType(type.value)}
            className={`flex items-start gap-4 p-5 border-2 rounded-lg transition-all text-left ${
              userType === type.value
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-300 hover:border-gray-400 bg-white"
            }`}
          >
            <span className="text-4xl">{type.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-gray-900">{type.label}</span>
                {userType === type.value && (
                  <span className="text-blue-600 font-bold">✓</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{type.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleContinue} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
