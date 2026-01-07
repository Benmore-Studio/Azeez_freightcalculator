"use client";

import React, { useState, useEffect } from "react";
import { Truck, UserCog, ClipboardList } from "lucide-react";
import showToast from "@/lib/toast";
import { Button } from "@/components/ui";

export default function Step1UserType({ initialData, onNext }) {
  const [userType, setUserType] = useState(initialData.userType || "");

  // Sync when initialData changes (e.g., from signup prefill)
  useEffect(() => {
    if (initialData.userType) {
      setUserType(initialData.userType);
    }
  }, [initialData.userType]);

  const userTypes = [
    {
      value: "owner-operator",
      label: "Owner Operator",
      icon: Truck,
      description: "I own and operate my own truck",
    },
    {
      value: "fleet-manager",
      label: "Fleet Manager",
      icon: UserCog,
      description: "I manage a fleet of vehicles",
    },
    {
      value: "dispatcher",
      label: "Dispatcher",
      icon: ClipboardList,
      description: "I coordinate loads and drivers",
    },
  ];

  const handleContinue = () => {
    if (!userType) {
      showToast.error("Please select your role");
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
        {userTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => setUserType(type.value)}
              className={`flex items-start gap-4 p-5 border-2 rounded-lg transition-all text-left ${
                userType === type.value
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className={`p-3 rounded-lg ${
                userType === type.value ? "bg-blue-100" : "bg-gray-100"
              }`}>
                <IconComponent className={`${
                  userType === type.value ? "text-blue-600" : "text-gray-600"
                }`} size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg text-gray-900">{type.label}</span>
                  {userType === type.value && (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleContinue} size="lg">
          Continue
        </Button>
      </div>
    </div>
  );
}
