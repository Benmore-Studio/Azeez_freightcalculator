"use client";

import React, { useState } from "react";
import { IoLocationOutline, IoNewspaperOutline } from "react-icons/io5";
import { HiOutlineCube } from "react-icons/hi2";
import { TiWeatherCloudy } from "react-icons/ti";
import { Save, ArrowLeft } from "lucide-react";
import { Button, ProgressBar } from "@/components/ui";
import Ratestepicon from "@/components/RateCalc/Ratestepicon";
import RatecalclocationEnhanced from "./RatecalclocationEnhanced";
import Ratecalcloaddetails from "@/components/RateCalc/Ratecalcloaddetails";
import Ratecalcservice from "@/components/RateCalc/Ratecalcservice";
import RateCalcConditions from "@/components/RateCalc/RateCalcConditions";
import Quote from "@/components/quote/quote";

export default function FullCalculator({ savedVehicles = [], savedTrips = [] }) {
  const [stage, setStage] = useState("Location");
  const [showQuote, setShowQuote] = useState(false);
  const [calculationData, setCalculationData] = useState(null);

  const handleCalculationComplete = (data) => {
    setCalculationData(data);
    setShowQuote(true);
  };

  const handleNewCalculation = () => {
    setShowQuote(false);
    setStage("Location");
    setCalculationData(null);
  };

  const handleSaveQuote = () => {
    // TODO: Implement save quote to backend in T11
    console.log("Quote saved! (Will be connected to backend in T11)");
    console.log("Saving quote:", calculationData);
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
            icon={<Save size={20} />}
            iconPosition="left"
          >
            Save This Quote
          </Button>
          <Button
            onClick={handleNewCalculation}
            size="lg"
            variant="secondary"
            icon={<ArrowLeft size={20} />}
            iconPosition="left"
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
