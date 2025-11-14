"use client";

import React from "react";
import { FaTruck, FaMapMarkerAlt } from "react-icons/fa";
import { MdShowChart } from "react-icons/md";

export default function RouteAnalysis({ data, formatRatio, getMarketConditionColor, getRatioColor }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <MdShowChart className="text-blue-600 text-xl sm:text-2xl" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Route & Market Analysis</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Lane Region Analysis Header */}
        <div className="flex items-center gap-2 pb-3 sm:pb-4 border-b border-gray-200">
          <FaTruck className="text-blue-600 text-lg sm:text-xl" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Lane Region Analysis</h3>
        </div>

        {/* Pickup and Delivery Regions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Pickup Region */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-semibold">
              <FaMapMarkerAlt className="text-sm sm:text-base" />
              <h4 className="text-base sm:text-lg">Pickup Region: {data?.routeAnalysis?.pickup?.region}</h4>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm sm:text-base text-gray-700 font-medium">Truck-to-Freight Ratio:</span>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold self-start ${getRatioColor(data?.routeAnalysis?.pickup?.truckToFreightRatio)}`}>
                  {formatRatio(data?.routeAnalysis?.pickup?.truckToFreightRatio)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm sm:text-base text-gray-700 font-medium">Market Condition:</span>
                <span className={`text-base sm:text-lg font-bold ${getMarketConditionColor(data?.routeAnalysis?.pickup?.marketCondition)}`}>
                  {data?.routeAnalysis?.pickup?.marketCondition}
                </span>
              </div>

              <div className="pt-2 border-t border-blue-200">
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold">Rate Negotiation:</span>{" "}
                  {data?.routeAnalysis?.pickup?.rateNegotiation}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Region */}
          <div className="bg-blue-50 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-semibold">
              <FaMapMarkerAlt className="text-sm sm:text-base" />
              <h4 className="text-base sm:text-lg">Delivery Region: {data?.routeAnalysis?.delivery?.region}</h4>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm sm:text-base text-gray-700 font-medium">Truck-to-Freight Ratio:</span>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold self-start ${getRatioColor(data?.routeAnalysis?.delivery?.truckToFreightRatio)}`}>
                  {formatRatio(data?.routeAnalysis?.delivery?.truckToFreightRatio)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <span className="text-sm sm:text-base text-gray-700 font-medium">Market Condition:</span>
                <span className={`text-base sm:text-lg font-bold ${getMarketConditionColor(data?.routeAnalysis?.delivery?.marketCondition)}`}>
                  {data?.routeAnalysis?.delivery?.marketCondition}
                </span>
              </div>

              <div className="pt-2 border-t border-blue-200 space-y-1 sm:space-y-2">
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold">Next Load Potential:</span>{" "}
                  {data?.routeAnalysis?.delivery?.nextLoadPotential}
                </p>
                <p className="text-xs sm:text-sm text-gray-700">
                  <span className="font-semibold">Available Loads:</span>{" "}
                  <span className="text-blue-700 font-bold">{data?.routeAnalysis?.delivery?.availableLoads} loads</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
