"use client";

import React from "react";

export default function RateCards({ data, formatCurrency }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* Recommended Rate */}
      <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border-l-4 border-blue-500">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-1">
              Recommended Rate
            </h3>
          </div>
          <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">
            {data?.recommendedRate?.label}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-blue-700">
              {formatCurrency(data?.recommendedRate?.total)}
            </span>
            <span className="text-sm sm:text-base text-gray-600 font-medium">Total</span>
          </div>
          <p className="text-blue-600 text-xs sm:text-sm">
            {formatCurrency(data?.recommendedRate?.perMile)}/mile × {data?.recommendedRate?.miles} miles
          </p>
        </div>
      </div>

      {/* Spot Market Rate */}
      <div className="bg-purple-50 rounded-xl p-4 sm:p-6 border-l-4 border-purple-500">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-purple-900 mb-1">
              Spot Market Rate
            </h3>
            <p className="text-xs sm:text-sm text-purple-600">{data?.spotMarketRate?.label}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-purple-700">
              {formatCurrency(data?.spotMarketRate?.total)}
            </span>
            <span className="text-sm sm:text-base text-gray-600 font-medium">Total</span>
          </div>
          <p className="text-purple-600 text-xs sm:text-sm">
            {formatCurrency(data?.spotMarketRate?.perMile)}/mile
          </p>
        </div>
      </div>

      {/* Contract Rate */}
      <div className="bg-teal-50 rounded-xl p-4 sm:p-6 border-l-4 border-teal-500">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-teal-900 mb-1">
              Contract Rate
            </h3>
          </div>
          <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">
            {data?.contractRate?.label}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-teal-700">
              {formatCurrency(data?.contractRate?.total)}
            </span>
            <span className="text-sm sm:text-base text-gray-600 font-medium">Total</span>
          </div>
          <p className="text-teal-600 text-xs sm:text-sm">
            {formatCurrency(data?.contractRate?.perMile)}/mile
          </p>
        </div>
      </div>
    </div>
  );
}
