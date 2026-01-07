"use client";

import React from "react";
import { MapPin, Clock, Route, Map, Truck, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui";

export default function RouteInfoCard({ routeData, origin, destination }) {
  if (!routeData) {
    return null;
  }

  const {
    miles,
    duration,
    statesCrossed = [],
    milesSource,
    routingProvider,
  } = routeData;

  // Format duration in hours and minutes
  const formatDuration = (hours) => {
    if (!hours || isNaN(hours)) return "N/A";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} hr`;
    return `${h} hr ${m} min`;
  };

  // Get source badge based on routing provider
  const getSourceBadge = () => {
    // Check routingProvider first (from backend)
    if (routingProvider === "pcmiler") {
      return (
        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded flex items-center gap-1">
          <Truck size={12} />
          PC*MILER (Truck-Legal)
        </span>
      );
    }
    if (routingProvider === "google") {
      return (
        <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded flex items-center gap-1">
          <AlertTriangle size={12} />
          Google Maps (Not Truck-Verified)
        </span>
      );
    }
    // Fallback to milesSource for backwards compatibility
    switch (milesSource) {
      case "api":
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
            Live Data
          </span>
        );
      case "fallback":
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
          <Route className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold text-gray-900">Route Details</h3>
        </div>
        {getSourceBadge()}
      </div>

      {/* Origin to Destination */}
      <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <p className="text-sm text-gray-600">Origin</p>
          </div>
          <p className="font-semibold text-gray-900 pl-5">{origin || "N/A"}</p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-20 h-0.5 bg-gray-300 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
              <Map className="text-gray-400" size={16} />
            </div>
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="flex items-center gap-2 mb-2 justify-end">
            <p className="text-sm text-gray-600">Destination</p>
            <div className="w-3 h-3 bg-green-600 rounded-full" />
          </div>
          <p className="font-semibold text-gray-900 pr-5">{destination || "N/A"}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Distance */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="text-blue-600" size={16} />
            <p className="text-sm text-blue-800 font-medium">Total Distance</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {miles ? miles.toLocaleString() : "0"} <span className="text-sm font-normal text-gray-600">mi</span>
          </p>
        </div>

        {/* Duration */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="text-green-600" size={16} />
            <p className="text-sm text-green-800 font-medium">Est. Drive Time</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatDuration(duration)}
          </p>
        </div>

        {/* Route Endpoints */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <Route className="text-gray-600" size={16} />
            <p className="text-sm text-gray-700 font-medium">Route Endpoints</p>
          </div>
          {statesCrossed.length >= 2 ? (
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 text-sm font-bold bg-blue-100 text-blue-700 rounded">
                {statesCrossed[0]}
              </span>
              <span className="text-gray-400">→</span>
              <span className="px-3 py-1 text-sm font-bold bg-green-100 text-green-700 rounded">
                {statesCrossed[statesCrossed.length - 1]}
              </span>
            </div>
          ) : statesCrossed.length === 1 ? (
            <span className="px-3 py-1 text-sm font-bold bg-blue-100 text-blue-700 rounded">
              {statesCrossed[0]}
            </span>
          ) : (
            <p className="text-lg font-bold text-gray-500">N/A</p>
          )}
        </div>
      </div>
    </Card>
  );
}
