"use client";

import React, { useState, useEffect } from "react";
import { IoLocationOutline, IoNewspaperOutline } from "react-icons/io5";
import { HiOutlineCube } from "react-icons/hi2";
import { TiWeatherCloudy } from "react-icons/ti";
import { Save, ArrowLeft, Settings, CheckCircle } from "lucide-react";
import { Button, ProgressBar, Spinner } from "@/components/ui";
import Ratestepicon from "@/components/RateCalc/Ratestepicon";
import RatecalclocationEnhanced from "./RatecalclocationEnhanced";
import Ratecalcloaddetails from "@/components/RateCalc/Ratecalcloaddetails";
import Ratecalcservice from "@/components/RateCalc/Ratecalcservice";
import RateCalcConditions from "@/components/RateCalc/RateCalcConditions";
import Quote from "@/components/quote/quote";
import { useAppContext } from "@/context/AppContext";
import { quotesApi } from "@/lib/api";
import { showToast } from "@/lib/toast";

export default function FullCalculator({ savedVehicles = [], savedTrips = [] }) {
  const {
    resetCalculatorData,
    userSettings,
    fetchUserSettings,
    hasCustomSettings,
    settingsLoading
  } = useAppContext();
  const [stage, setStage] = useState("Location");
  const [showQuote, setShowQuote] = useState(false);
  const [calculationData, setCalculationData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user settings on mount
  useEffect(() => {
    if (!userSettings) {
      fetchUserSettings();
    }
  }, [userSettings, fetchUserSettings]);

  const handleCalculationComplete = (data) => {
    setCalculationData(data);
    setShowQuote(true);
  };

  const handleNewCalculation = () => {
    setShowQuote(false);
    setStage("Location");
    setCalculationData(null);
    resetCalculatorData();
  };

  const handleSaveQuote = async () => {
    if (!calculationData?._calculatorData || !calculationData?._apiResult) {
      showToast.error("No quote data to save");
      return;
    }

    setIsSaving(true);

    try {
      const calcData = calculationData._calculatorData;
      const apiResult = calculationData._apiResult;

      // Build save payload
      const savePayload = {
        origin: calcData.origin,
        destination: calcData.destination,
        vehicleType: calcData.vehicleType,
        vehicleId: calcData.vehicleId,
        loadType: calcData.loadType,
        weight: calcData.weight,
        freightClass: calcData.freightClass,
        weatherConditions: calcData.weatherConditions,
        fuelPrice: calcData.fuelPrice,
        deadheadMiles: calcData.deadheadMiles,
        specialServices: calcData.specialEquipment || [],
        // Customer info (optional)
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        notes: "",
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

  const handlePreviousStage = () => {
    const stages = ["Location", "Load Details", "Service", "Conditions"];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex > 0) {
      setStage(stages[currentIndex - 1]);
    }
  };

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

  const stagePercentage = {
    Location: 25,
    "Load Details": 50,
    Service: 75,
    Conditions: 100,
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Sticky Progress Section */}
      <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200">
        <ProgressBar
          value={stagePercentage[stage]}
          max={100}
          size="sm"
          className="rounded-none"
        />

        {/* Settings Status Badge */}
        {settingsLoading ? (
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 border-b border-gray-200">
            <Spinner size="sm" />
            <span className="text-sm text-gray-600">Loading your settings...</span>
          </div>
        ) : hasCustomSettings() ? (
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 border-b border-blue-200">
            <CheckCircle size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Using your custom settings</span>
            <a href="/profile" className="text-xs text-blue-600 hover:text-blue-800 underline ml-2">
              Edit
            </a>
          </div>
        ) : userSettings ? (
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 border-b border-gray-200">
            <Settings size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">Using industry defaults</span>
            <a href="/profile" className="text-xs text-blue-600 hover:text-blue-800 underline ml-2">
              Customize
            </a>
          </div>
        ) : null}

        <div className="flex flex-wrap justify-between gap-2 p-4 bg-gray-50">
          <Ratestepicon Icon={IoLocationOutline} text="Location" currentStage={stage} />
          <Ratestepicon Icon={HiOutlineCube} text="Load Details" currentStage={stage} />
          <Ratestepicon Icon={IoNewspaperOutline} text="Service" currentStage={stage} />
          <Ratestepicon Icon={TiWeatherCloudy} text="Conditions" currentStage={stage} />
        </div>
      </div>

      {stage === "Location" && (
        <RatecalclocationEnhanced
          setStage={setStage}
          savedVehicles={savedVehicles}
          savedTrips={savedTrips}
        />
      )}
      {stage === "Load Details" && (
        <Ratecalcloaddetails setStage={setStage} onPrevious={handlePreviousStage} />
      )}
      {stage === "Service" && (
        <Ratecalcservice setStage={setStage} onPrevious={handlePreviousStage} />
      )}
      {stage === "Conditions" && (
        <RateCalcConditions
          setStage={setStage}
          onPrevious={handlePreviousStage}
          onComplete={handleCalculationComplete}
        />
      )}
    </div>
  );
}
