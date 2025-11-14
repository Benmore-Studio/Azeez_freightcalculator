"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import showToast from "@/lib/toast";
import Step1UserType from "./Step1UserType";
import Step2BasicInfo from "./Step2BasicInfo";
import Step3CostCalc from "./Step3CostCalc";
import Step4VehicleInfo from "./Step4VehicleInfo";
import Step5Review from "./Step5Review";

export default function OnboardingModal({ isOpen, onClose, initialData = {} }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    userType: initialData.userType || "",
    name: initialData.name || "",
    email: initialData.email || "",
    phone: "",
    company: "",
    costData: {
      radio: "default",
      vehicle: "Semitruck",
      milesdriven: 10000,
      frequency: "monthly",
    },
    vehicleData: {
      type: "",
      vin: "",
      year: "",
      make: "",
      model: "",
      fuelType: "",
      mpg: "",
      equipment: [],
      endorsements: [],
      otherQualifications: "",
    },
  });

  const totalSteps = 5;

  const handleNext = (data) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSkip = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleComplete = (data) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    console.log("Onboarding completed with data:", { ...onboardingData, ...data });
    // TODO: Save to backend in T7
    // TODO: Redirect to dashboard
    showToast.success("Onboarding complete! Redirecting to dashboard...");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header with Progress */}
        <div className="bg-blue-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome! Let's Get Started</h2>
              <p className="text-blue-100 text-sm mt-1">
                Complete your profile to unlock all features
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-700 rounded-lg p-2 transition-colors"
              title="Save progress and exit"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-blue-300/30 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
            <span className="text-white font-semibold text-sm">
              {currentStep} / {totalSteps}
            </span>
          </div>

          {/* Step Labels */}
          <div className="flex justify-between mt-4 text-xs text-blue-100">
            <span className={currentStep === 1 ? "text-white font-semibold" : ""}>
              User Type
            </span>
            <span className={currentStep === 2 ? "text-white font-semibold" : ""}>
              Basic Info
            </span>
            <span className={currentStep === 3 ? "text-white font-semibold" : ""}>
              Costs
            </span>
            <span className={currentStep === 4 ? "text-white font-semibold" : ""}>
              Vehicle
            </span>
            <span className={currentStep === 5 ? "text-white font-semibold" : ""}>
              Review
            </span>
          </div>
        </div>

        {/* Content Area - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
          {currentStep === 1 && (
            <Step1UserType
              initialData={onboardingData}
              onNext={handleNext}
            />
          )}
          {currentStep === 2 && (
            <Step2BasicInfo
              initialData={onboardingData}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          {currentStep === 3 && (
            <Step3CostCalc
              initialData={onboardingData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSkip={handleSkip}
            />
          )}
          {currentStep === 4 && (
            <Step4VehicleInfo
              initialData={onboardingData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onSkip={handleSkip}
            />
          )}
          {currentStep === 5 && (
            <Step5Review
              data={onboardingData}
              onPrevious={handlePrevious}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
