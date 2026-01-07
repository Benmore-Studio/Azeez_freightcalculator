"use client";

import React, { useMemo } from "react";
import { Clock, CheckCircle, AlertTriangle, XCircle, Truck, Coffee, MapPin } from "lucide-react";
import { Card } from "@/components/ui";

/**
 * ScheduleFeasibility - Analyzes if the pickup/delivery schedule is feasible
 * based on driving time, HOS regulations, and loading/unloading times
 */
export default function ScheduleFeasibility({
  pickupDate,
  pickupTime,
  deliveryDate,
  deliveryTime,
  estimatedDriveHours = 0,
  totalMiles = 0,
}) {
  const analysis = useMemo(() => {
    // Parse dates and times
    const parseDateTime = (dateStr, timeStr) => {
      if (!dateStr || !timeStr) return null;

      // Handle various date formats
      let dateParts;
      if (dateStr.includes("/")) {
        // Handle DD/MM/YYYY or MM/DD/YYYY format
        dateParts = dateStr.split("/");
        if (dateParts[0].length === 4) {
          // YYYY/MM/DD
          return new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]} ${timeStr}`);
        } else if (parseInt(dateParts[0]) > 12) {
          // DD/MM/YYYY
          return new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]} ${timeStr}`);
        } else {
          // MM/DD/YYYY
          return new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]} ${timeStr}`);
        }
      }
      return new Date(`${dateStr} ${timeStr}`);
    };

    const pickupDateTime = parseDateTime(pickupDate, pickupTime);
    const deliveryDateTime = parseDateTime(deliveryDate, deliveryTime);

    if (!pickupDateTime || !deliveryDateTime || isNaN(pickupDateTime) || isNaN(deliveryDateTime)) {
      return null;
    }

    // Calculate available time in hours
    const availableTimeMs = deliveryDateTime - pickupDateTime;
    const availableHours = availableTimeMs / (1000 * 60 * 60);

    if (availableHours <= 0) {
      return {
        feasible: false,
        status: "invalid",
        message: "Delivery must be after pickup",
        availableHours: 0,
        requiredHours: 0,
        bufferHours: 0,
      };
    }

    // HOS (Hours of Service) regulations for truck drivers:
    // - 11 hours max driving per day
    // - 14 hours max on-duty per day
    // - 10 hours off-duty required between shifts
    // - 70 hours max in 8 days (rolling)

    // Calculate required time components
    const loadingTime = 2; // 2 hours for loading at pickup
    const unloadingTime = 2; // 2 hours for unloading at delivery
    const drivingHours = estimatedDriveHours || (totalMiles / 50); // Estimate 50 mph average if not provided

    // Calculate driving days needed (11 hours max per day)
    const maxDrivingPerDay = 11;
    const drivingDays = Math.ceil(drivingHours / maxDrivingPerDay);

    // Rest periods needed (10 hours between each driving day after first)
    const restPeriods = Math.max(0, drivingDays - 1);
    const restHours = restPeriods * 10;

    // Fuel/break stops (roughly 30 min every 4 hours of driving)
    const fuelStops = Math.floor(drivingHours / 4);
    const fuelStopHours = fuelStops * 0.5;

    // Total required hours
    const requiredHours = loadingTime + drivingHours + restHours + fuelStopHours + unloadingTime;

    // Buffer calculation
    const bufferHours = availableHours - requiredHours;

    // Determine feasibility status
    let status, feasible, message, severity;

    if (bufferHours >= 8) {
      status = "excellent";
      feasible = true;
      severity = "success";
      message = "Plenty of time with comfortable buffer for unexpected delays.";
    } else if (bufferHours >= 4) {
      status = "good";
      feasible = true;
      severity = "success";
      message = "Schedule is feasible with reasonable buffer time.";
    } else if (bufferHours >= 1) {
      status = "tight";
      feasible = true;
      severity = "warning";
      message = "Schedule is tight. Minor delays could cause issues.";
    } else if (bufferHours >= 0) {
      status = "risky";
      feasible = true;
      severity = "warning";
      message = "Very little margin for error. Consider extending delivery window.";
    } else {
      status = "infeasible";
      feasible = false;
      severity = "error";
      message = "Schedule is not feasible. Need more time for safe delivery.";
    }

    return {
      feasible,
      status,
      severity,
      message,
      availableHours: Math.round(availableHours * 10) / 10,
      requiredHours: Math.round(requiredHours * 10) / 10,
      bufferHours: Math.round(bufferHours * 10) / 10,
      breakdown: {
        loadingTime,
        drivingHours: Math.round(drivingHours * 10) / 10,
        restHours,
        fuelStopHours: Math.round(fuelStopHours * 10) / 10,
        unloadingTime,
      },
      drivingDays,
    };
  }, [pickupDate, pickupTime, deliveryDate, deliveryTime, estimatedDriveHours, totalMiles]);

  // Don't render if we can't calculate
  if (!analysis) {
    return null;
  }

  // Get styling based on severity
  const getSeverityStyles = () => {
    switch (analysis.severity) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: <CheckCircle className="text-green-600" size={24} />,
          headerText: "text-green-800",
          badge: "bg-green-100 text-green-700",
        };
      case "warning":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          icon: <AlertTriangle className="text-orange-600" size={24} />,
          headerText: "text-orange-800",
          badge: "bg-orange-100 text-orange-700",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <XCircle className="text-red-600" size={24} />,
          headerText: "text-red-800",
          badge: "bg-red-100 text-red-700",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: <Clock className="text-gray-600" size={24} />,
          headerText: "text-gray-800",
          badge: "bg-gray-100 text-gray-700",
        };
    }
  };

  const styles = getSeverityStyles();

  // Format hours for display
  const formatHours = (hours) => {
    if (hours < 0) return "N/A";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h} hr`;
    return `${h} hr ${m} min`;
  };

  return (
    <div className={`rounded-lg border-2 ${styles.border} ${styles.bg} p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {styles.icon}
          <h4 className={`font-bold ${styles.headerText}`}>Schedule Analysis</h4>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles.badge}`}>
          {analysis.feasible ? "Feasible" : "Not Feasible"}
        </span>
      </div>

      {/* Status Message */}
      <p className={`text-sm ${styles.headerText} mb-4`}>{analysis.message}</p>

      {/* Time Breakdown */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
          <p className="text-xs text-gray-600 mb-1">Required</p>
          <p className="text-lg font-bold text-gray-900">{formatHours(analysis.requiredHours)}</p>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200 text-center">
          <p className="text-xs text-gray-600 mb-1">Available</p>
          <p className="text-lg font-bold text-blue-600">{formatHours(analysis.availableHours)}</p>
        </div>
        <div className={`rounded-lg p-3 border text-center ${
          analysis.bufferHours >= 4
            ? "bg-green-100 border-green-200"
            : analysis.bufferHours >= 0
              ? "bg-orange-100 border-orange-200"
              : "bg-red-100 border-red-200"
        }`}>
          <p className="text-xs text-gray-600 mb-1">Buffer</p>
          <p className={`text-lg font-bold ${
            analysis.bufferHours >= 4
              ? "text-green-700"
              : analysis.bufferHours >= 0
                ? "text-orange-700"
                : "text-red-700"
          }`}>
            {analysis.bufferHours >= 0 ? formatHours(analysis.bufferHours) : `- ${formatHours(Math.abs(analysis.bufferHours))}`}
          </p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-3">
        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Time Breakdown</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-700">
              <MapPin size={14} className="text-green-600" />
              Loading at pickup
            </span>
            <span className="font-medium text-gray-900">{formatHours(analysis.breakdown.loadingTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-700">
              <Truck size={14} className="text-blue-600" />
              Driving time
            </span>
            <span className="font-medium text-gray-900">{formatHours(analysis.breakdown.drivingHours)}</span>
          </div>
          {analysis.breakdown.restHours > 0 && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-700">
                <Coffee size={14} className="text-orange-600" />
                Required rest ({analysis.drivingDays - 1} overnight)
              </span>
              <span className="font-medium text-gray-900">{formatHours(analysis.breakdown.restHours)}</span>
            </div>
          )}
          {analysis.breakdown.fuelStopHours > 0 && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-700">
                <Coffee size={14} className="text-gray-500" />
                Fuel/break stops
              </span>
              <span className="font-medium text-gray-900">{formatHours(analysis.breakdown.fuelStopHours)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-gray-700">
              <MapPin size={14} className="text-red-600" />
              Unloading at delivery
            </span>
            <span className="font-medium text-gray-900">{formatHours(analysis.breakdown.unloadingTime)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between font-semibold">
            <span className="text-gray-900">Total Required</span>
            <span className="text-gray-900">{formatHours(analysis.requiredHours)}</span>
          </div>
        </div>
      </div>

      {/* HOS Note */}
      {analysis.drivingDays > 1 && (
        <p className="text-xs text-gray-500 mt-3">
          Based on DOT Hours of Service: 11-hour driving limit per day with 10-hour rest between shifts.
        </p>
      )}
    </div>
  );
}
