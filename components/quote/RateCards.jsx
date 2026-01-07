"use client";

import React from "react";

export default function RateCards({ data, formatCurrency }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* Recommended Rate - Primary */}
      <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border-l-4 border-blue-500">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-1">
              Recommended Rate
            </h3>
            <p className="text-xs sm:text-sm text-blue-600">Your target price</p>
          </div>
          <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">
            Best Value
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

      {/* Maximum Rate - High end */}
      <div className="bg-emerald-50 rounded-xl p-4 sm:p-6 border-l-4 border-emerald-500">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-emerald-900 mb-1">
              Maximum Rate
            </h3>
            <p className="text-xs sm:text-sm text-emerald-600">Hot market ceiling (+20%)</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-emerald-700">
              {formatCurrency(data?.spotMarketRate?.total)}
            </span>
            <span className="text-sm sm:text-base text-gray-600 font-medium">Total</span>
          </div>
          <p className="text-emerald-600 text-xs sm:text-sm">
            {formatCurrency(data?.spotMarketRate?.perMile)}/mile
          </p>
        </div>
      </div>

      {/* Minimum Rate - Floor price */}
      <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border-l-4 border-slate-400">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">
              Minimum Rate
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">Your floor price (-15%)</p>
          </div>
          <span className="px-2 sm:px-3 py-1 bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">
            Break-even
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-slate-700">
              {formatCurrency(data?.contractRate?.total)}
            </span>
            <span className="text-sm sm:text-base text-gray-600 font-medium">Total</span>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm">
            {formatCurrency(data?.contractRate?.perMile)}/mile
          </p>
        </div>
      </div>
    </div>
  );
}
