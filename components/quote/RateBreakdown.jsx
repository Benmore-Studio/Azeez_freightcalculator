"use client";

import React from "react";
import { FaSave, FaChartBar, FaChartLine, FaCalendarAlt, FaShareAlt } from "react-icons/fa";
import { Button } from "@/components/ui";

export default function RateBreakdown({
  baseRate = 1.75,
  miles = 0,
  loadTypeMultiplier = 1.0,
  urgencyMultiplier = 1.0,
  driverTypeMultiplier = 1.0,
  onSaveQuote,
  onCompareRates,
  onMarketAnalysis,
  onScheduleLoad,
  onShareQuote
}) {
  const baseRateTotal = baseRate * miles;
  const totalRate = baseRateTotal * loadTypeMultiplier * urgencyMultiplier * driverTypeMultiplier;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8">
      {/* Breakdown Header */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Detailed Rate Breakdown</h2>

      {/* Rate Items */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-3 border-b border-gray-100 gap-1 sm:gap-2">
          <span className="text-sm sm:text-base text-gray-700">
            Base Rate (${baseRate.toFixed(2)}/mile × {miles} miles)
          </span>
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            ${baseRateTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
          <span className="text-sm sm:text-base text-gray-700">Load Type (dry)</span>
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            × {loadTypeMultiplier.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
          <span className="text-sm sm:text-base text-gray-700">Urgency (standard)</span>
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            × {urgencyMultiplier.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
          <span className="text-sm sm:text-base text-gray-700">Driver Type (solo)</span>
          <span className="text-base sm:text-lg font-semibold text-gray-900">
            × {driverTypeMultiplier.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Total Rate */}
      <div className="flex items-center justify-between py-3 sm:py-4 border-t-2 border-gray-300 mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Total Rate</h3>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">${totalRate.toFixed(2)}</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 sm:space-y-4">
        {/* Top Row - 4 Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Button
            onClick={onSaveQuote}
            size="lg"
            icon={<FaSave />}
            iconPosition="left"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Save Quote
          </Button>

          <Button
            onClick={onCompareRates}
            size="lg"
            icon={<FaChartBar />}
            iconPosition="left"
          >
            Compare Rates
          </Button>

          <Button
            onClick={onMarketAnalysis}
            size="lg"
            icon={<FaChartLine />}
            iconPosition="left"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Market Analysis
          </Button>

          <Button
            onClick={onScheduleLoad}
            size="lg"
            icon={<FaCalendarAlt />}
            iconPosition="left"
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Schedule Load
          </Button>
        </div>

        {/* Bottom Row - Share Button Centered */}
        <div className="flex justify-center">
          <Button
            onClick={onShareQuote}
            size="lg"
            icon={<FaShareAlt />}
            iconPosition="left"
            className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto sm:min-w-[200px]"
          >
            Share Quote
          </Button>
        </div>
      </div>
    </div>
  );
}
