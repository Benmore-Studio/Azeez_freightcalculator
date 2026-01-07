"use client";

import React, { useState } from "react";
import { Receipt, ChevronDown, ChevronUp, CreditCard, Banknote } from "lucide-react";
import { Card } from "@/components/ui";

export default function TollBreakdown({ tollData }) {
  const [expanded, setExpanded] = useState(false);

  if (!tollData || tollData.totalTolls === 0) {
    return null;
  }

  const {
    totalTolls = 0,
    tollsByState = {},
    cashTolls = 0,
    transponderTolls = 0,
    tollCount = 0,
    tollSource = "none",
  } = tollData;

  const stateEntries = Object.entries(tollsByState).sort((a, b) => b[1] - a[1]);

  // Get source badge
  const getSourceBadge = () => {
    switch (tollSource) {
      case "api":
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
            TollGuru
          </span>
        );
      case "estimate":
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
            Estimated
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 bg-white border-2 border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Receipt className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">Toll Costs</h3>
        </div>
        {getSourceBadge()}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {/* Total Tolls */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 col-span-2 md:col-span-1">
          <p className="text-sm text-blue-800 font-medium mb-1">Total Tolls</p>
          <p className="text-3xl font-bold text-gray-900">
            ${totalTolls.toFixed(2)}
          </p>
          {tollCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {tollCount} toll{tollCount !== 1 ? "s" : ""} on route
            </p>
          )}
        </div>

        {/* Transponder */}
        {transponderTolls > 0 && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="text-green-600" size={16} />
              <p className="text-sm text-green-800 font-medium">Transponder</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              ${transponderTolls.toFixed(2)}
            </p>
          </div>
        )}

        {/* Cash */}
        {cashTolls > 0 && (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <Banknote className="text-orange-600" size={16} />
              <p className="text-sm text-orange-800 font-medium">Cash</p>
            </div>
            <p className="text-xl font-bold text-gray-900">
              ${cashTolls.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* State Breakdown Toggle */}
      {stateEntries.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expanded ? "Hide" : "Show"} breakdown by state
          </button>

          {expanded && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-2">
                {stateEntries.map(([state, amount], idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                  >
                    <span className="font-medium text-gray-900">{state}</span>
                    <span className="text-gray-700">${amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Savings Tip */}
      {transponderTolls > 0 && cashTolls > 0 && transponderTolls < cashTolls && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Tip:</strong> Using a transponder saves you $
            {(cashTolls - transponderTolls).toFixed(2)} on this route.
          </p>
        </div>
      )}
    </Card>
  );
}
