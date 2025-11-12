"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus, MapPin, DollarSign, Truck, Package, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Card } from "@/components/ui";
import { getMarketTempDisplay } from "@/lib/mockData/marketIntelligence";

export default function MarketIntelligence({ marketData }) {
  if (!marketData) {
    return null;
  }

  const { origin, destination, returnLoadPotential, topReturnLanes, recommendation } = marketData;

  const originDisplay = getMarketTempDisplay(origin.marketTemperature);
  const destDisplay = getMarketTempDisplay(destination.marketTemperature);

  const getTrendIcon = (trend) => {
    if (trend === 'rising') return <TrendingUp size={16} className="text-green-600" />;
    if (trend === 'falling') return <TrendingDown size={16} className="text-red-600" />;
    return <Minus size={16} className="text-gray-600" />;
  };

  const getTrendLabel = (trend) => {
    if (trend === 'rising') return 'Rising ↑';
    if (trend === 'falling') return 'Falling ↓';
    return 'Stable →';
  };

  const getMarketColor = (temperature) => {
    const colors = {
      'hot': 'border-red-300 bg-red-50',
      'warm': 'border-orange-300 bg-orange-50',
      'balanced': 'border-blue-300 bg-blue-50',
      'cool': 'border-cyan-300 bg-cyan-50',
      'cold': 'border-gray-300 bg-gray-50'
    };
    return colors[temperature] || colors['balanced'];
  };

  const getRecommendationStyle = (action) => {
    if (action === 'accept') return { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900', icon: <CheckCircle size={24} className="text-green-600" /> };
    if (action === 'caution') return { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-900', icon: <AlertCircle size={24} className="text-orange-600" /> };
    return { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900', icon: <Info size={24} className="text-blue-600" /> };
  };

  const recStyle = getRecommendationStyle(recommendation.action);

  return (
    <Card className="p-6 bg-white border-2 border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📊</span>
        <h3 className="text-xl font-bold text-gray-900">Market Intelligence</h3>
      </div>

      {/* Market Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Origin Market */}
        <div className={`p-5 rounded-lg border-2 ${getMarketColor(origin.marketTemperature)}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Origin Market</p>
              <p className="text-lg font-bold text-gray-900">{origin.city}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl mb-1">{originDisplay.emoji}</p>
              <p className="text-xs font-bold text-gray-900">{originDisplay.label}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">Market Temperature</p>
              <p className="text-sm font-medium text-gray-900">{originDisplay.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Truck-to-Load</p>
                <p className="text-lg font-bold text-gray-900">{origin.truckToLoadRatio}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Loads Available</p>
                <p className="text-lg font-bold text-gray-900">{origin.loadsAvailable}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-1">Average Rate</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">${origin.avgRatePerMile}/mile</p>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  {getTrendIcon(origin.rateTrend)}
                  <span className="capitalize">{getTrendLabel(origin.rateTrend)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Destination Market */}
        <div className={`p-5 rounded-lg border-2 ${getMarketColor(destination.marketTemperature)}`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Destination Market</p>
              <p className="text-lg font-bold text-gray-900">{destination.city}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl mb-1">{destDisplay.emoji}</p>
              <p className="text-xs font-bold text-gray-900">{destDisplay.label}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">Market Temperature</p>
              <p className="text-sm font-medium text-gray-900">{destDisplay.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Truck-to-Load</p>
                <p className="text-lg font-bold text-gray-900">{destination.truckToLoadRatio}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Loads Available</p>
                <p className="text-lg font-bold text-gray-900">{destination.loadsAvailable}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-600 mb-1">Average Rate</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">${destination.avgRatePerMile}/mile</p>
                <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  {getTrendIcon(destination.rateTrend)}
                  <span className="capitalize">{getTrendLabel(destination.rateTrend)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Return Load Potential - BIG PROMINENT SECTION */}
      <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Package className="text-blue-600" size={24} />
          <h4 className="text-lg font-bold text-gray-900">Return Load Potential</h4>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-4xl font-bold text-blue-600">
                {returnLoadPotential.score}<span className="text-2xl text-blue-500">/10</span>
              </p>
            </div>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[...Array(10)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(returnLoadPotential.score) ? 'text-blue-600' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-sm font-bold text-blue-900">{returnLoadPotential.rating}</p>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium">{returnLoadPotential.message}</p>
          </div>
        </div>
      </div>

      {/* Top Return Lanes */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Truck className="text-blue-600" size={20} />
          Top Return Lanes from {destination.city}
        </h4>
        <div className="space-y-2">
          {topReturnLanes.map((lane, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={16} className="text-blue-600" />
                    <p className="font-semibold text-gray-900">
                      {destination.city.split(',')[0]} → {lane.destination}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{lane.loads} loads available</span>
                    <span>•</span>
                    <span>{lane.distance} miles</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">${lane.rate}/mi</p>
                  <p className="text-xs text-gray-500">Est. ${(lane.rate * lane.distance).toFixed(0)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation - PROMINENT FINAL SECTION */}
      <div className={`p-5 rounded-lg border-2 ${recStyle.border} ${recStyle.bg}`}>
        <div className="flex items-start gap-3">
          {recStyle.icon}
          <div className="flex-1">
            <h4 className={`text-lg font-bold ${recStyle.text} mb-2`}>💡 Recommendation</h4>
            <p className={`text-base font-medium ${recStyle.text}`}>{recommendation.message}</p>

            {/* Additional context based on recommendation */}
            {recommendation.action === 'accept' && (
              <div className="mt-3 pt-3 border-t border-green-300">
                <p className="text-sm text-green-800">
                  <strong>Why this is a good load:</strong> Strong destination market with high return load potential means you won't deadhead back. Easy to find profitable freight for the return trip.
                </p>
              </div>
            )}

            {recommendation.action === 'caution' && (
              <div className="mt-3 pt-3 border-t border-orange-300">
                <p className="text-sm text-orange-800">
                  <strong>Important considerations:</strong> Limited return loads from this destination. Factor in deadhead costs when calculating your minimum acceptable rate. Consider negotiating a higher rate to cover potential empty miles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
