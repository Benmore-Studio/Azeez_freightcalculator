"use client";

import React, { useState } from "react";
import { Select, Input, Button } from "@/components/ui";

export default function Step3CostCalc({ initialData, onNext, onPrevious, onSkip }) {
  const [costData, setCostData] = useState(
    initialData.costData || {
      radio: "default",
      vehicle: "Semitruck",
      milesdriven: 10000,
      frequency: "monthly",
    }
  );

  const handleContinue = () => {
    onNext({ costData });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Calculate Your Cost Per Mile
        </h3>
        <p className="text-gray-600 text-sm">
          Understanding your operating costs helps calculate accurate rates
        </p>
      </div>

      {/* Cost Data Source */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
        <h4 className="font-semibold text-blue-900 mb-3">Cost Data Source</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setCostData((prev) => ({ ...prev, radio: "default" }))
            }
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              costData.radio === "default"
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            <div className="font-semibold text-gray-900 mb-1">
              Use Industry Averages
            </div>
            <p className="text-xs text-gray-600">
              We'll use typical costs for your vehicle type
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setCostData((prev) => ({ ...prev, radio: "unique" }))
            }
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              costData.radio === "unique"
                ? "border-blue-500 bg-blue-100"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            <div className="font-semibold text-gray-900 mb-1">
              Enter My Own Data
            </div>
            <p className="text-xs text-gray-600">
              Use your actual costs from operations
            </p>
          </button>
        </div>
      </div>

      {/* Vehicle Type */}
      <Select
        label="Vehicle Type"
        value={costData.vehicle}
        onChange={(e) =>
          setCostData((prev) => ({ ...prev, vehicle: e.target.value }))
        }
        options={[
          { value: "Semitruck", label: "Semi-Truck/Tractor Trailer" },
          { value: "sprintervan", label: "Sprinter Van" },
          { value: "boxtruck", label: "Straight/Box Truck" },
          { value: "cargovan", label: "Cargo Van" },
        ]}
      />

      {/* Miles Driven */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <label className="block font-semibold text-gray-900 mb-3">
          Miles Driven
        </label>

        {/* Monthly/Annually Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            type="button"
            onClick={() =>
              setCostData((prev) => ({
                ...prev,
                frequency: "monthly",
                milesdriven:
                  prev.frequency === "annually"
                    ? prev.milesdriven / 12
                    : prev.milesdriven,
              }))
            }
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              costData.frequency === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() =>
              setCostData((prev) => ({
                ...prev,
                frequency: "annually",
                milesdriven:
                  prev.frequency === "monthly"
                    ? prev.milesdriven * 12
                    : prev.milesdriven,
              }))
            }
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              costData.frequency === "annually"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Annually
          </button>
        </div>

        <Input
          type="number"
          value={costData.milesdriven}
          onChange={(e) =>
            setCostData((prev) => ({ ...prev, milesdriven: e.target.value }))
          }
          helperText="Approximately 120,000 miles annually (10,000 monthly)"
        />
      </div>

      {/* Estimated Cost Display */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-gray-900">Estimated Cost Per Mile:</h4>
          <p className="text-2xl font-bold text-blue-600">$1.75/mile</p>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          This is an estimate. You can update your exact costs from the dashboard later.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button onClick={onPrevious} variant="outline" size="lg">
          Back
        </Button>
        <div className="flex gap-3">
          <Button onClick={onSkip} variant="secondary" size="lg">
            Skip for Now
          </Button>
          <Button onClick={handleContinue} size="lg">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
