"use client";

import React from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, AlertTriangle, ThermometerSun } from "lucide-react";
import { Card } from "@/components/ui";

export default function WeatherAnalysis({ weatherData }) {
  if (!weatherData) {
    return null;
  }

  const { origin, destination, forecast, routeAlerts, rateImpact, delayRisk } = weatherData;

  // Get weather icon component
  const getWeatherIcon = (iconName) => {
    const icons = {
      'sun': Sun,
      'cloud': Cloud,
      'cloud-rain': CloudRain,
      'cloud-snow': CloudSnow,
      'cloud-lightning': CloudLightning,
      'cloud-fog': CloudFog,
    };
    const IconComponent = icons[iconName] || Sun;
    return <IconComponent size={24} />;
  };

  // Get day name from date
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="p-6 bg-white border-2 border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <CloudRain className="text-blue-600" size={24} />
        <h3 className="text-xl font-bold text-gray-900">Weather Analysis</h3>
      </div>

      {/* Origin & Destination Weather */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Origin */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-semibold mb-2">Origin</p>
          <p className="text-lg font-bold text-gray-900 mb-2">{origin.city}</p>
          <div className="flex items-center gap-3">
            <div className="text-blue-600">
              {getWeatherIcon(origin.icon)}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{origin.temp_f}°F</p>
              <p className="text-sm text-gray-600">{origin.condition}</p>
              <p className="text-xs text-gray-500">Feels like {origin.feels_like}°F</p>
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 font-semibold mb-2">Destination</p>
          <p className="text-lg font-bold text-gray-900 mb-2">{destination.city}</p>
          <div className="flex items-center gap-3">
            <div className="text-green-600">
              {getWeatherIcon(destination.icon)}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{destination.temp_f}°F</p>
              <p className="text-sm text-gray-600">{destination.condition}</p>
              <p className="text-xs text-gray-500">Feels like {destination.feels_like}°F</p>
            </div>
          </div>
        </div>
      </div>

      {/* Route Alerts */}
      {routeAlerts && routeAlerts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-red-600" size={20} />
            <h4 className="font-bold text-gray-900">Route Weather Alerts</h4>
          </div>
          <div className="space-y-3">
            {routeAlerts.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  alert.severity === 'high'
                    ? 'bg-red-50 border-red-300'
                    : alert.severity === 'medium'
                    ? 'bg-orange-50 border-orange-300'
                    : 'bg-yellow-50 border-yellow-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900">{alert.alertType}</p>
                      <span
                        className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                          alert.severity === 'high'
                            ? 'bg-red-600 text-white'
                            : alert.severity === 'medium'
                            ? 'bg-orange-600 text-white'
                            : 'bg-yellow-600 text-white'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{alert.location}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Expected delay: <strong>{alert.delayEstimate}</strong>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5-Day Forecast */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-900 mb-3">5-Day Forecast</h4>
        <div className="grid grid-cols-5 gap-2">
          {forecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border-2 text-center ${
                day.warning
                  ? 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <p className="text-xs font-semibold text-gray-700 mb-2">
                {getDayName(day.date)}
              </p>
              <div className="flex justify-center mb-2 text-gray-600">
                {getWeatherIcon(day.icon)}
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">
                {day.high}° / {day.low}°
              </p>
              <p className="text-xs text-gray-600">{day.condition}</p>
              {day.warning && (
                <AlertTriangle className="mx-auto mt-2 text-red-600" size={16} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rate Impact & Delay Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rate Impact */}
        {rateImpact && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-semibold mb-2">💰 Rate Adjustment Recommended</p>
            <p className="text-lg font-bold text-blue-600 mb-1">
              Add {rateImpact.surchargePercent}% weather surcharge
            </p>
            {rateImpact.surchargeAmount > 0 && (
              <p className="text-sm text-gray-700 mb-2">
                Approx. +${rateImpact.surchargeAmount.toFixed(2)}
              </p>
            )}
            <p className="text-xs text-gray-600">
              <strong>Reason:</strong> {rateImpact.reason}
            </p>
          </div>
        )}

        {/* Delay Risk */}
        <div className={`p-4 rounded-lg border ${
          delayRisk.includes('High')
            ? 'bg-red-50 border-red-200'
            : delayRisk.includes('Medium')
            ? 'bg-orange-50 border-orange-200'
            : 'bg-green-50 border-green-200'
        }`}>
          <p className={`text-sm font-semibold mb-2 ${
            delayRisk.includes('High')
              ? 'text-red-800'
              : delayRisk.includes('Medium')
              ? 'text-orange-800'
              : 'text-green-800'
          }`}>
            ⏱️ Delay Risk Assessment
          </p>
          <p className="text-lg font-bold text-gray-900">{delayRisk}</p>
        </div>
      </div>

      {/* Recommendation Footer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <strong className="text-gray-900">💡 Recommendation:</strong>{' '}
          {rateImpact
            ? `Consider applying a ${rateImpact.surchargePercent}% weather surcharge to your rate quote to account for increased risk and potential delays.`
            : 'Weather conditions look favorable for this route. No rate adjustment needed.'}
        </p>
      </div>
    </Card>
  );
}
