"use client";

import React from "react";
import { FaCalculator } from "react-icons/fa";

/**
 * RateBreakdown - Shows how the rate was calculated with all multipliers applied
 * Uses real data from the API calculation
 */
export default function RateBreakdown({
  ratePerMile = 0,
  totalMiles = 0,
  recommendedRate = 0,
  costPerMile = 0,
  multipliers = {},
}) {
  // Extract multipliers with defaults
  const {
    weather = 1.0,
    loadType = 1.0,
    freightClass = 1.0,
    services = 1.0,
    weight = 1.0,
    seasonal = 1.0,
    total = 1.0,
  } = multipliers;

  // Helper to format multiplier display
  const formatMultiplier = (value, label) => {
    if (!value || value === 1.0) return null;
    return { value, label };
  };

  // Build list of active multipliers (only show those that affect the rate)
  const activeMultipliers = [
    formatMultiplier(weather, "Weather Conditions"),
    formatMultiplier(loadType, "Load Type"),
    formatMultiplier(freightClass, "Freight Class"),
    formatMultiplier(services, "Service Options"),
    formatMultiplier(weight, "Weight Adjustment"),
    formatMultiplier(seasonal, "Seasonal Demand"),
  ].filter(Boolean);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-100 p-3 rounded-xl">
          <FaCalculator className="text-slate-600 text-lg" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Rate Calculation Breakdown</h2>
          <p className="text-sm text-slate-500">How your rate was calculated</p>
        </div>
      </div>

      {/* Base Calculation */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <span className="text-slate-700">Base Cost Per Mile</span>
          <span className="font-semibold text-slate-900">
            ${costPerMile.toFixed(2)}/mi
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-slate-100">
          <span className="text-slate-700">Total Distance</span>
          <span className="font-semibold text-slate-900">
            {totalMiles.toLocaleString()} miles
          </span>
        </div>
      </div>

      {/* Multipliers Applied */}
      {activeMultipliers.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Multipliers Applied
          </h3>
          <div className="space-y-2">
            {activeMultipliers.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg"
              >
                <span className="text-slate-700">{item.label}</span>
                <span className={`font-semibold ${item.value > 1 ? "text-orange-600" : "text-emerald-600"}`}>
                  × {item.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Total Multiplier */}
          <div className="flex items-center justify-between py-3 mt-3 border-t border-slate-200">
            <span className="font-medium text-slate-700">Combined Multiplier</span>
            <span className="font-bold text-slate-900">× {total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* No multipliers message */}
      {activeMultipliers.length === 0 && (
        <div className="mb-6 py-3 px-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600">
            Standard rate applied - no additional multipliers for this load.
          </p>
        </div>
      )}

      {/* Final Rate */}
      <div className="bg-slate-900 rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Final Rate Per Mile</span>
          <span className="text-xl font-bold text-white">
            ${ratePerMile.toFixed(2)}/mi
          </span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
          <span className="text-lg font-medium text-slate-300">Recommended Rate</span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-400">
            ${recommendedRate.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
