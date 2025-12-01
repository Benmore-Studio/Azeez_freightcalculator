"use client";

import React, { useState } from "react";
import { DollarSign, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui";

export default function ProfitCalculator({ profitData }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!profitData) {
    return null;
  }

  const {
    revenue,
    totalCosts,
    netProfit,
    profitMargin,
    totalMiles,
    costBreakdown,
    profitRating // poor, fair, good, excellent
  } = profitData;

  // Calculate cost per mile
  const costPerMile = totalMiles > 0 ? totalCosts / totalMiles : 0;

  // Calculate percentages for visual bar
  const revenuePercent = 100;
  const costPercent = (totalCosts / revenue) * 100;
  const profitPercent = (netProfit / revenue) * 100;

  // Get color coding based on profit margin
  const getProfitColor = () => {
    if (profitMargin < 10) return {
      bg: 'bg-red-100',
      border: 'border-red-300',
      text: 'text-red-700',
      label: 'Low Profit ⚠️',
      message: 'Below industry standard - Consider negotiating higher rate'
    };
    if (profitMargin < 20) return {
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      text: 'text-orange-700',
      label: 'Fair Profit',
      message: 'Acceptable margin - Covers costs with modest profit'
    };
    if (profitMargin < 30) return {
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      text: 'text-blue-700',
      label: 'Good Profit ✓',
      message: 'Healthy margin - This is a profitable load'
    };
    return {
      bg: 'bg-green-100',
      border: 'border-green-300',
      text: 'text-green-700',
      label: 'Excellent Profit ✓✓',
      message: 'Outstanding margin - Highly profitable load'
    };
  };

  const profitColor = getProfitColor();

  // Calculate largest cost items for summary
  const topCosts = Object.entries(costBreakdown || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Card className={`p-6 bg-white border-2 ${profitColor.border}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="text-green-600" size={24} />
        <h3 className="text-xl font-bold text-gray-900">Trip Profitability</h3>
      </div>

      {/* Main Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-semibold mb-1">Revenue</p>
          <p className="text-2xl font-bold text-blue-600">
            ${revenue.toLocaleString()}
          </p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 font-semibold mb-1">Total Costs</p>
          <p className="text-2xl font-bold text-gray-900">
            ${totalCosts.toLocaleString()}
          </p>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-semibold mb-1">Cost Per Mile</p>
          <p className="text-2xl font-bold text-blue-600">
            ${costPerMile.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">{totalMiles.toLocaleString()} miles</p>
        </div>

        <div className={`text-center p-4 ${profitColor.bg} rounded-lg border ${profitColor.border}`}>
          <p className={`text-sm ${profitColor.text} font-semibold mb-1`}>Net Profit</p>
          <p className={`text-2xl font-bold ${profitColor.text}`}>
            ${netProfit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Visual Bar Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">Profit Breakdown</p>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full font-bold text-lg ${profitColor.bg} ${profitColor.text}`}>
              {profitMargin.toFixed(1)}% margin
            </span>
            <span className="text-sm font-medium text-gray-600">{profitColor.label}</span>
          </div>
        </div>

        {/* Horizontal Bar */}
        <div className="relative h-16 bg-gray-200 rounded-lg overflow-hidden">
          {/* Costs portion */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold transition-all duration-500"
            style={{ width: `${costPercent}%` }}
          >
            {costPercent > 15 && <span>Costs ({costPercent.toFixed(0)}%)</span>}
          </div>

          {/* Profit portion */}
          <div
            className={`absolute top-0 h-full flex items-center justify-center text-white font-bold transition-all duration-500 ${
              profitMargin < 10 ? 'bg-gradient-to-r from-red-500 to-red-600' :
              profitMargin < 20 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              profitMargin < 30 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
              'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ left: `${costPercent}%`, width: `${profitPercent}%` }}
          >
            {profitPercent > 10 && <span>Profit ({profitPercent.toFixed(0)}%)</span>}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-gray-700">Costs: ${totalCosts.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${
              profitMargin < 10 ? 'bg-red-600' :
              profitMargin < 20 ? 'bg-orange-600' :
              profitMargin < 30 ? 'bg-blue-600' :
              'bg-green-600'
            }`}></div>
            <span className="text-gray-700">Profit: ${netProfit.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Toggle */}
      {costBreakdown && (
        <div className="mb-6">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <span className="font-semibold text-gray-900">
              {showBreakdown ? 'Hide' : 'Show'} Cost Breakdown
            </span>
            {showBreakdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {showBreakdown && (
            <div className="mt-3 space-y-2">
              {Object.entries(costBreakdown).map(([category, amount]) => {
                const percent = (amount / totalCosts) * 100;
                return (
                  <div key={category} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="font-bold text-gray-900">${amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-600">{percent.toFixed(0)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Recommendation Message */}
      <div className={`p-4 rounded-lg ${profitColor.bg} border ${profitColor.border}`}>
        <div className="flex items-start gap-3">
          {profitMargin >= 20 ? (
            <TrendingUp className="text-green-600 flex-shrink-0" size={24} />
          ) : (
            <DollarSign className="text-orange-600 flex-shrink-0" size={24} />
          )}
          <div>
            <p className={`font-bold ${profitColor.text} mb-1`}>
              {profitMargin >= 20 ? '✓ This is a PROFITABLE load' : '⚠️ Margin Warning'}
            </p>
            <p className={`text-sm ${profitColor.text}`}>
              {profitColor.message}
            </p>
            {profitMargin < 15 && (
              <p className={`text-sm ${profitColor.text} mt-2`}>
                <strong>Tip:</strong> Industry standard is 15-25% profit margin. Consider negotiating a rate of at least ${(totalCosts * 1.15).toFixed(2)} to achieve a healthy margin.
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
