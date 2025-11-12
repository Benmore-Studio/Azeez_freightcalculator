"use client";

import React, { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, CloudSnow, CloudRain, CloudLightning } from "lucide-react";
import { Card } from "@/components/ui";

export default function WeatherBanner({ weatherData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!weatherData || !weatherData.hasAlerts) {
    return null; // No weather alerts, don't show banner
  }

  const { routeAlerts, delayRisk, rateImpact } = weatherData;
  const mainAlert = routeAlerts[0];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-300 text-red-900';
      case 'medium':
        return 'bg-orange-50 border-orange-300 text-orange-900';
      default:
        return 'bg-yellow-50 border-yellow-300 text-yellow-900';
    }
  };

  const getAlertIcon = (alertType) => {
    if (alertType.includes('Snow') || alertType.includes('Winter')) {
      return <CloudSnow size={24} />;
    }
    if (alertType.includes('Storm') || alertType.includes('Thunder')) {
      return <CloudLightning size={24} />;
    }
    if (alertType.includes('Rain')) {
      return <CloudRain size={24} />;
    }
    return <AlertTriangle size={24} />;
  };

  return (
    <Card className={`p-4 border-2 ${getSeverityColor(mainAlert.severity)} mb-6`}>
      {/* Header - Always Visible */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getAlertIcon(mainAlert.alertType)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-base">Weather Alert Detected</h4>
              <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded uppercase">
                {mainAlert.severity}
              </span>
            </div>
            <p className="text-sm font-medium mb-1">{mainAlert.alertType}</p>
            <p className="text-sm">{mainAlert.message}</p>
            <p className="text-xs mt-2 opacity-75">
              Expected delay: {mainAlert.delayEstimate}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 ml-3 p-2 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-current border-opacity-20 space-y-3">
          {/* Delay Risk */}
          <div>
            <p className="text-xs font-semibold uppercase mb-1 opacity-75">Delay Risk</p>
            <p className="text-sm font-medium">{delayRisk}</p>
          </div>

          {/* Rate Impact */}
          {rateImpact && (
            <div>
              <p className="text-xs font-semibold uppercase mb-1 opacity-75">Recommended Rate Adjustment</p>
              <p className="text-sm font-bold">
                Add {rateImpact.surchargePercent}% weather surcharge
              </p>
              <p className="text-xs mt-1">Reason: {rateImpact.reason}</p>
            </div>
          )}

          {/* Additional Alerts */}
          {routeAlerts.length > 1 && (
            <div>
              <p className="text-xs font-semibold uppercase mb-2 opacity-75">
                Additional Alerts ({routeAlerts.length - 1})
              </p>
              <div className="space-y-2">
                {routeAlerts.slice(1).map((alert, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-medium">{alert.location}</p>
                    <p className="text-xs opacity-75">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div className="pt-2 border-t border-current border-opacity-20">
            <p className="text-sm font-medium">
              💡 <strong>Recommendation:</strong> Consider adjusting pickup/delivery times or applying a weather surcharge to your rate.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
