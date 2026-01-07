"use client";

import React from "react";
import { FaGasPump, FaTruck, FaTools, FaBuilding, FaReceipt } from "react-icons/fa";

/**
 * BreakdownSection - Shows the cost breakdown from the rate calculation
 * Uses real data from the API
 */
export default function BreakdownSection({ data, formatCurrency }) {
  const breakdown = data?.breakdown || {};

  // Primary cost items to display
  const costItems = [
    {
      label: "Fuel Cost",
      value: breakdown.fuelCost,
      icon: FaGasPump,
      color: "text-orange-500",
    },
    {
      label: "Fixed Costs",
      value: breakdown.fixedCosts,
      icon: FaBuilding,
      color: "text-slate-500",
    },
    {
      label: "Maintenance",
      value: breakdown.maintenanceCost,
      icon: FaTools,
      color: "text-slate-500",
    },
    {
      label: "Service Fees",
      value: breakdown.serviceFees,
      icon: FaReceipt,
      color: "text-slate-500",
    },
  ];

  // Additional costs (shown in secondary row if they exist)
  const additionalCosts = [
    { label: "DEF", value: breakdown.defCost },
    { label: "Tires", value: breakdown.tireCost },
    { label: "DC Fees", value: breakdown.dcFees },
    { label: "Hotel", value: breakdown.hotelCost },
    { label: "Tolls", value: breakdown.tollCost },
    { label: "Factoring", value: breakdown.factoringFee },
  ].filter(item => item.value && item.value > 0);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-100 p-3 rounded-xl">
          <FaTruck className="text-slate-600 text-lg" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cost Breakdown</h2>
          <p className="text-sm text-slate-500">Your operating costs for this trip</p>
        </div>
      </div>

      {/* Primary Costs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
        {costItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-slate-50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`${item.color} text-sm`} />
                <h4 className="text-xs sm:text-sm text-slate-600 font-medium">{item.label}</h4>
              </div>
              <p className="text-lg sm:text-xl font-bold text-slate-900">
                {formatCurrency(item.value)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional Costs (if any) */}
      {additionalCosts.length > 0 && (
        <div className="border-t border-slate-200 pt-4">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Additional Costs
          </h4>
          <div className="flex flex-wrap gap-3">
            {additionalCosts.map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
                <span className="text-sm text-slate-600">{item.label}:</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Cost Summary */}
      <div className="mt-4 pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-slate-600">Total Operating Cost</span>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(breakdown.totalCost)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-slate-600">Cost Per Mile</span>
          <p className="text-2xl font-bold text-orange-500">
            {formatCurrency(breakdown.costPerMile)}/mi
          </p>
        </div>
      </div>
    </div>
  );
}
