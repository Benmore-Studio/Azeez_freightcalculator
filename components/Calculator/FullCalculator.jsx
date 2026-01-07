"use client";

import React, { useState, useEffect } from "react";
import { MapPin, CheckCircle, Save, ArrowLeft, Settings } from "lucide-react";
import { Button, ProgressBar, Spinner } from "@/components/ui";
import RouteAndLoad from "./RouteAndLoad";
import ReviewAndCalculate from "./ReviewAndCalculate";
import Quote from "@/components/quote/quote";
import { useAppContext } from "@/context/AppContext";
import { quotesApi } from "@/lib/api";
import { showToast } from "@/lib/toast";

/**
 * FullCalculator - Main calculator component with 2-stage flow
 *
 * Stage 1: Route & Load - Collect all inputs (consolidated from previous 4 stages)
 * Stage 2: Review & Calculate - Summary, auto-fetch preview, calculate button
 * Results: Quote display with save option
 */
export default function FullCalculator({ savedVehicles = [], savedTrips = [] }) {
  const {
    resetCalculatorData,
    userSettings,
    fetchUserSettings,
    hasCustomSettings,
    settingsLoading,
  } = useAppContext();

  const [stage, setStage] = useState(1); // 1 = Route & Load, 2 = Review & Calculate
  const [showQuote, setShowQuote] = useState(false);
  const [calculationData, setCalculationData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user settings on mount
  useEffect(() => {
    if (!userSettings) {
      fetchUserSettings();
    }
  }, [userSettings, fetchUserSettings]);

  // Handle calculation complete - show results
  const handleCalculationComplete = (data) => {
    setCalculationData(data);
    setShowQuote(true);
  };

  // Start new calculation - reset everything
  const handleNewCalculation = () => {
    setShowQuote(false);
    setStage(1);
    setCalculationData(null);
    resetCalculatorData();
  };

  // Save quote to database
  const handleSaveQuote = async () => {
    if (!calculationData?._calculatorData || !calculationData?._apiResult) {
      showToast.error("No quote data to save");
      return;
    }

    setIsSaving(true);

    try {
      const calcData = calculationData._calculatorData;
      const apiResult = calculationData._apiResult;

      // Map frontend vehicle types to API enum values
      const vehicleTypeMap = {
        semi_truck: "semi",
        semi: "semi",
        sprinter_van: "sprinter",
        sprinter: "sprinter",
        box_truck: "box_truck",
        cargo_van: "cargo_van",
        reefer: "reefer",
      };

      // Map frontend freight class to API enum values
      const freightClassMap = {
        general: "dry_van",
        dry_van: "dry_van",
        refrigerated: "refrigerated",
        flatbed: "flatbed",
        oversized: "oversized",
        hazmat: "hazmat",
        tanker: "tanker",
      };

      // Build save payload with proper field names and mappings
      const savePayload = {
        // Route - required fields
        originAddress: calcData.origin,
        destinationAddress: calcData.destination,
        totalMiles: apiResult.totalMiles || calculationData.routeData?.miles || 0,
        deadheadMiles: calcData.deadheadMiles || 0,

        // Vehicle - with proper mapping
        vehicleType: vehicleTypeMap[calcData.vehicleType] || "semi",
        // Only include vehicleId if it's a valid string
        ...(calcData.vehicleId && typeof calcData.vehicleId === "string"
          ? { vehicleId: calcData.vehicleId }
          : {}),

        // Load details - with proper mapping
        loadWeight: calcData.weight || undefined,
        loadType: calcData.loadType === "full_load" ? "full_truckload" : (calcData.loadType || "full_truckload"),
        freightClass: freightClassMap[calcData.freightClass] || freightClassMap[calcData.equipmentType] || "dry_van",

        // Service options
        isExpedite: calcData.deliveryUrgency === "express",
        isRush: calcData.deliveryUrgency === "rush",
        isSameDay: calcData.deliveryUrgency === "same_day",
        isTeam: calcData.driverType === "team",
        isReefer: calcData.equipmentType === "refrigerated",
        requiresLiftgate: calcData.specialEquipment?.includes("liftgate"),
        requiresPalletJack: calcData.specialEquipment?.includes("pallet_jack"),
      };

      const savedQuote = await quotesApi.createQuote(savePayload);
      showToast.success("Quote saved successfully!");
      console.log("Quote saved:", savedQuote);
    } catch (error) {
      console.error("Save quote error:", error);
      showToast.error(error.message || "Failed to save quote");
    } finally {
      setIsSaving(false);
    }
  };

  // Show quote results
  if (showQuote) {
    return (
      <div className="mt-6">
        <Quote quoteData={calculationData} />

        {/* Save Quote & New Calculation Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 mb-6">
          <Button
            onClick={handleSaveQuote}
            size="lg"
            icon={isSaving ? <Spinner size="sm" /> : <Save size={20} />}
            iconPosition="left"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save This Quote"}
          </Button>
          <Button
            onClick={handleNewCalculation}
            size="lg"
            variant="secondary"
            icon={<ArrowLeft size={20} />}
            iconPosition="left"
            disabled={isSaving}
          >
            New Calculation
          </Button>
        </div>
      </div>
    );
  }

  // Stage labels for progress indicator
  const stages = [
    { number: 1, label: "Route & Load", icon: MapPin },
    { number: 2, label: "Review & Calculate", icon: CheckCircle },
  ];

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Sticky Progress Section */}
      <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200 shadow-sm">
        {/* Progress Bar */}
        <ProgressBar
          value={stage === 1 ? 50 : 100}
          max={100}
          size="sm"
          className="rounded-none"
        />

        {/* Settings Status Badge */}
        {settingsLoading ? (
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 border-b border-blue-100">
            <Spinner size="sm" />
            <span className="text-sm text-blue-700">Loading your settings...</span>
          </div>
        ) : hasCustomSettings() ? (
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 border-b border-blue-200">
            <CheckCircle size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Using your custom settings
            </span>
            <a
              href="/profile"
              className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
            >
              Edit
            </a>
          </div>
        ) : userSettings ? (
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-orange-50 border-b border-orange-200">
            <Settings size={16} className="text-orange-600" />
            <span className="text-sm text-orange-700">Using industry defaults</span>
            <a
              href="/profile"
              className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
            >
              Customize your settings
            </a>
          </div>
        ) : null}

        {/* Stage Indicator */}
        <div className="flex justify-center gap-8 p-4 bg-gray-50">
          {stages.map((s) => {
            const Icon = s.icon;
            const isActive = stage === s.number;
            const isComplete = stage > s.number;

            return (
              <div
                key={s.number}
                className={`flex items-center gap-2 ${
                  isActive
                    ? "text-blue-600"
                    : isComplete
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isActive
                      ? "border-blue-600 bg-blue-50"
                      : isComplete
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Icon size={16} />
                  )}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:inline ${
                    isActive ? "text-blue-600" : isComplete ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Content */}
      {stage === 1 && (
        <RouteAndLoad
          onNext={() => setStage(2)}
          savedVehicles={savedVehicles}
          savedTrips={savedTrips}
        />
      )}
      {stage === 2 && (
        <ReviewAndCalculate
          onBack={() => setStage(1)}
          onComplete={handleCalculationComplete}
          savedVehicles={savedVehicles}
        />
      )}
    </div>
  );
}
