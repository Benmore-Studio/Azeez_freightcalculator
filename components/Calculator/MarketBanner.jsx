"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui";
import { getMarketTempDisplay } from "@/lib/mockData/marketIntelligence";

export default function MarketBanner({ marketData }) {
  if (!marketData) {
    return null;
  }

  const { origin, destination, returnLoadPotential, recommendation } = marketData;

  const originDisplay = getMarketTempDisplay(origin.marketTemperature);
  const destDisplay = getMarketTempDisplay(destination.marketTemperature);

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return <TrendingUp size={16} className="text-green-600" />;
    if (trend === 'falling') return <TrendingDown size={16} className="text-red-600" />;
    return <Minus size={16} className="text-gray-600" />;
  };

  const getRecommendationColor = (action) => {
    if (action === 'accept') return 'bg-green-50 border-green-300 text-green-900';
    if (action === 'caution') return 'bg-orange-50 border-orange-300 text-orange-900';
    return 'bg-blue-50 border-blue-300 text-blue-900';
  };

  const getRecommendationIcon = (action) => {
    if (action === 'accept') return <CheckCircle size={20} className="text-green-600" />;
    if (action === 'caution') return <AlertCircle size={20} className="text-orange-600" />;
    return <AlertCircle size={20} className="text-blue-600" />;
  };

  return (
    <Card className="p-4 bg-white border-2 border-gray-200 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📊</span>
        <h4 className="font-bold text-gray-900">Market Intelligence</h4>
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Origin Market */}
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold mb-2">Origin</p>
          <p className="text-sm font-bold text-gray-900 mb-2">{origin.city}</p>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{originDisplay.emoji}</span>
            <span className="text-sm font-bold text-gray-900">{originDisplay.label}</span>
            <span className="text-xs text-gray-600">(Ratio: {origin.truckToLoadRatio})</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Rate: ${origin.avgRatePerMile}/mi</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(origin.rateTrend)}
              <span className="text-gray-600 capitalize">{origin.rateTrend}</span>
            </div>
          </div>
        </div>

        {/* Destination Market */}
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold mb-2">Destination</p>
          <p className="text-sm font-bold text-gray-900 mb-2">{destination.city}</p>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{destDisplay.emoji}</span>
            <span className="text-sm font-bold text-gray-900">{destDisplay.label}</span>
            <span className="text-xs text-gray-600">(Ratio: {destination.truckToLoadRatio})</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Rate: ${destination.avgRatePerMile}/mi</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(destination.rateTrend)}
              <span className="text-gray-600 capitalize">{destination.rateTrend}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Return Load Potential */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-800 font-semibold mb-1">Return Load Potential</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">
                {returnLoadPotential.score}/10
              </span>
              <span className="text-sm font-medium text-blue-900">
                {returnLoadPotential.rating}
              </span>
            </div>
          </div>
          <div className="flex">
            {[...Array(Math.floor(returnLoadPotential.score))].map((_, i) => (
              <span key={i} className="text-blue-600">⭐</span>
            ))}
          </div>
        </div>
        <p className="text-xs text-blue-800 mt-2">{returnLoadPotential.message}</p>
      </div>

      {/* Recommendation */}
      <div className={`p-3 rounded-lg border-2 ${getRecommendationColor(recommendation.action)}`}>
        <div className="flex items-start gap-2">
          {getRecommendationIcon(recommendation.action)}
          <div className="flex-1">
            <p className="text-sm font-bold mb-1">💡 Recommendation</p>
            <p className="text-sm">{recommendation.message}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
