"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  Truck,
  Package,
  Calendar,
  Route,
  Cloud,
  Fuel,
  DollarSign,
  TrendingUp,
  Clock,
  Edit3,
  CheckCircle2,
  ArrowLeft,
  Search,
} from "lucide-react";
import { Button, Spinner } from "@/components/ui";
import { useAppContext } from "@/context/AppContext";
import { quotesApi } from "@/lib/api";
import { showToast } from "@/lib/toast";

/**
 * ReviewAndCalculate - Stage 2 of the simplified 2-stage calculator
 * Shows summary of inputs, what APIs will auto-calculate, and triggers calculation
 */
export default function ReviewAndCalculate({
  onBack,
  onComplete,
  savedVehicles = [],
}) {
  const { calculatorData, userSettings } = useAppContext();
  const [isCalculating, setIsCalculating] = useState(false);

  // Get selected vehicle data
  const selectedVehicle = useMemo(() => {
    if (!calculatorData.vehicleId) return null;
    return savedVehicles.find((v) => v.id === calculatorData.vehicleId);
  }, [calculatorData.vehicleId, savedVehicles]);

  // Format delivery date for display
  const formattedDeliveryDate = useMemo(() => {
    if (!calculatorData.deliveryDate) return "Not specified";
    const date = new Date(calculatorData.deliveryDate);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [calculatorData.deliveryDate]);

  // Format delivery time window
  const deliveryTimeLabel = {
    morning: "Morning (8AM-12PM)",
    afternoon: "Afternoon (12PM-5PM)",
    evening: "Evening (5PM-9PM)",
  }[calculatorData.deliveryTime] || "Not specified";

  // Format equipment type
  const equipmentLabel = {
    dry_van: "Dry Van",
    refrigerated: "Refrigerated",
    flatbed: "Flatbed",
  }[calculatorData.equipmentType] || calculatorData.equipmentType;

  // Format urgency
  const urgencyLabel = {
    standard: "Standard",
    express: "Express (+15%)",
    rush: "Rush (+30%)",
    same_day: "Same Day (+50%)",
  }[calculatorData.deliveryUrgency] || "Standard";

  // Format driver type
  const driverLabel = calculatorData.driverType === "team" ? "Team Drivers (+50%)" : "Solo Driver";

  // Format special equipment
  const specialEquipmentLabels = {
    liftgate: "Liftgate",
    pallet_jack: "Pallet Jack",
    straps: "Straps",
    tarps: "Tarps",
    temp_monitoring: "Temp Monitor",
    ramps: "Ramps",
    chains: "Chains",
    e_track: "E-Track",
  };

  // Handle calculate rate
  const handleCalculate = async () => {
    setIsCalculating(true);

    // Map frontend vehicle types to API enum values
    const vehicleTypeToApi = {
      "semi_truck": "semi",
      "semi": "semi",
      "sprinter_van": "sprinter",
      "sprinter": "sprinter",
      "box_truck": "box_truck",
      "cargo_van": "cargo_van",
      "reefer": "reefer",
    };

    try {
      // Build API payload
      const apiPayload = {
        // Route (addresses - API calculates distance)
        origin: calculatorData.origin,
        destination: calculatorData.destination,
        deadheadMiles: calculatorData.deadheadMiles || 0,

        // Vehicle
        vehicleType: vehicleTypeToApi[calculatorData.vehicleType] || "semi",
        // Only include vehicleId if it's a valid string (UUID)
        ...(calculatorData.vehicleId && typeof calculatorData.vehicleId === 'string'
          ? { vehicleId: calculatorData.vehicleId }
          : {}),

        // Load details
        loadWeight: calculatorData.weight || 0,
        loadType: calculatorData.loadType === "full_load" ? "full_truckload" : (calculatorData.loadType || "full_truckload"),
        freightClass: calculatorData.freightClass === "general" ? "dry_van" : (calculatorData.freightClass || "dry_van"),

        // Service options
        isExpedite: calculatorData.deliveryUrgency === "express",
        isRush: calculatorData.deliveryUrgency === "rush",
        isSameDay: calculatorData.deliveryUrgency === "same_day",
        isTeam: calculatorData.driverType === "team",
        isReefer: calculatorData.equipmentType === "refrigerated",
        requiresLiftgate: calculatorData.specialEquipment?.includes("liftgate"),
        requiresPalletJack: calculatorData.specialEquipment?.includes("pallet_jack"),
        requiresDriverAssist: false,
        requiresWhiteGlove: false,
        requiresTracking: calculatorData.specialEquipment?.includes("temp_monitoring"),

        // DC options
        isDCPickup: calculatorData.distributionCenter || false,
        isDCDelivery: false,

        // Schedule (for weather forecast) - only include if set
        ...(calculatorData.deliveryDate ? { deliveryDate: calculatorData.deliveryDate } : {}),
      };

      // Call the enriched API
      const result = await quotesApi.calculateEnrichedRate(apiPayload);

      // Transform API result to quote format
      const quoteData = {
        // Basic info
        origin: result.routeData?.originFormatted || calculatorData.origin,
        destination: result.routeData?.destinationFormatted || calculatorData.destination,
        deadheadMiles: calculatorData.deadheadMiles,

        // Route data (auto-calculated)
        routeData: {
          miles: result.routeData?.calculatedMiles || result.totalMiles,
          duration: result.routeData?.calculatedDuration || result.estimatedDriveHours,
          statesCrossed: result.routeData?.statesCrossed || [],
          milesSource: result.routeData?.milesSource || "unknown",
        },

        // Weather data (auto-fetched)
        weatherData: {
          origin: result.weatherData?.origin,
          destination: result.weatherData?.destination,
          routeCondition: result.weatherData?.routeCondition || "normal",
          riskLevel: result.weatherData?.riskLevel || "low",
          advisories: result.weatherData?.advisories || [],
          weatherSource: result.weatherData?.weatherSource || "default",
        },

        // Toll data (auto-calculated)
        tollData: {
          totalTolls: result.tollData?.totalTolls || 0,
          tollsByState: result.tollData?.tollsByState || {},
          tollCount: result.tollData?.tollCount || 0,
          tollSource: result.tollData?.tollSource || "none",
        },

        // Rate data
        recommendedRate: {
          total: result.recommendedRate,
          perMile: result.ratePerMile,
          miles: result.totalMiles,
          label: "Recommended",
        },
        spotMarketRate: {
          total: result.maxRate,
          perMile: result.maxRate / result.totalMiles,
          label: "Market High",
        },
        contractRate: {
          total: result.minRate,
          perMile: result.minRate / result.totalMiles,
          label: "Competitive",
        },

        // Cost breakdown
        breakdown: {
          fuelCost: result.costBreakdown?.fuelCost || 0,
          defCost: result.costBreakdown?.defCost || 0,
          maintenanceCost: result.costBreakdown?.maintenanceCost || 0,
          tireCost: result.costBreakdown?.tireCost || 0,
          fixedCosts: result.costBreakdown?.fixedCostAllocation || 0,
          dcFees: result.costBreakdown?.dcFees || 0,
          hotelCost: result.costBreakdown?.hotelCost || 0,
          serviceFees: result.costBreakdown?.serviceFees || 0,
          factoringFee: result.costBreakdown?.factoringFee || 0,
          tollCost: result.tollData?.totalTolls || 0,
          totalCost: result.costBreakdown?.totalCost || 0,
          costPerMile: result.costPerMile || 1.75,
        },
        serviceFees: result.serviceFees || {},
        multipliers: result.multipliersApplied || {},

        // Profit data
        profit: {
          margin: result.profitMargin,
          total: result.estimatedProfit,
          perMile: result.profitPerMile,
        },

        // Schedule feasibility data
        scheduleData: {
          deliveryDate: calculatorData.deliveryDate,
          deliveryTime: calculatorData.deliveryTime,
          estimatedDriveHours: result.routeData?.calculatedDuration || result.estimatedDriveHours,
          totalMiles: result.totalMiles,
        },

        // Route analysis
        routeAnalysis: {
          pickup: {
            region: result.routeData?.statesCrossed?.[0] || "Unknown",
            truckToFreightRatio: 0.5,
            marketCondition: "Warm",
            rateNegotiation: "Market rate",
          },
          delivery: {
            region: result.routeData?.statesCrossed?.[result.routeData?.statesCrossed?.length - 1] || "Unknown",
            truckToFreightRatio: 0.5,
            marketCondition: "Warm",
            nextLoadPotential: "Good",
            availableLoads: 50,
          },
        },

        // Market analysis (to be replaced with API data when available)
        marketAnalysis: {
          loadBoardStats: {
            truckToLoadRatio: 1.22,
            marketTrend: "Stable",
            averageRate: result.ratePerMile,
            loadVolume: 500,
            totalLoadsInDestination: 400,
            destinationRadius: 100,
          },
          nextMoneyLanes: [
            { id: 1, miles: 750, loadsAvailable: 20, ratePerMile: 3.25 },
            { id: 2, miles: 650, loadsAvailable: 15, ratePerMile: 3.00 },
            { id: 3, miles: 850, loadsAvailable: 12, ratePerMile: 2.85 },
          ],
        },

        // Booking info
        bookingInfo: {
          calculatedRate: result.recommendedRate,
          confirmationTime: "1 business hour",
        },

        // Raw data for saving
        _apiResult: result,
        _calculatorData: calculatorData,
      };

      onComplete(quoteData);
    } catch (error) {
      console.error("Rate calculation error:", error);
      showToast.error(error.message || "Failed to calculate rate. Please check your addresses.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* ===== SUMMARY HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Review Your Quote</h2>
          <p className="text-sm text-gray-500">Verify your details before calculating</p>
        </div>
        <Button variant="secondary" size="sm" onClick={onBack} icon={<Edit3 size={16} />}>
          Edit Details
        </Button>
      </div>

      {/* ===== INPUT SUMMARY ===== */}
      <div className="bg-white border-2 border-gray-200 rounded-lg divide-y divide-gray-100">
        {/* Route */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="text-blue-600" size={18} />
            <h3 className="font-semibold text-gray-900">Route</h3>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <span className="text-gray-700">{calculatorData.origin || "Not specified"}</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-600 rounded-full" />
              <span className="text-gray-700">{calculatorData.destination || "Not specified"}</span>
            </div>
          </div>
          {calculatorData.deadheadMiles > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              + {calculatorData.deadheadMiles} deadhead miles to pickup
            </p>
          )}
        </div>

        {/* Vehicle & Load */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="text-blue-600" size={18} />
            <h3 className="font-semibold text-gray-900">Vehicle & Load</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Vehicle</p>
              <p className="font-medium text-gray-900">
                {selectedVehicle?.name || "Default (Semi)"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Equipment</p>
              <p className="font-medium text-gray-900">{equipmentLabel}</p>
            </div>
            <div>
              <p className="text-gray-500">Weight</p>
              <p className="font-medium text-gray-900">
                {calculatorData.weight ? `${calculatorData.weight.toLocaleString()} lbs` : "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Load Type</p>
              <p className="font-medium text-gray-900">
                {calculatorData.loadType === "ltl" ? "LTL/Partial" : "Full Load"}
              </p>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-blue-600" size={18} />
            <h3 className="font-semibold text-gray-900">Schedule</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Delivery Date</p>
              <p className="font-medium text-gray-900">{formattedDeliveryDate}</p>
            </div>
            <div>
              <p className="text-gray-500">Time Window</p>
              <p className="font-medium text-gray-900">{deliveryTimeLabel}</p>
            </div>
            <div>
              <p className="text-gray-500">Urgency</p>
              <p className="font-medium text-gray-900">{urgencyLabel}</p>
            </div>
            <div>
              <p className="text-gray-500">Driver</p>
              <p className="font-medium text-gray-900">{driverLabel}</p>
            </div>
          </div>
        </div>

        {/* Special Equipment (if any) */}
        {calculatorData.specialEquipment?.length > 0 && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="text-blue-600" size={18} />
              <h3 className="font-semibold text-gray-900">Special Equipment</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {calculatorData.specialEquipment.map((item) => (
                <span
                  key={item}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                >
                  {specialEquipmentLabels[item] || item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== AUTO-CALCULATED DATA INFO ===== */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900">What We'll Calculate For You</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: Route, label: "Distance", desc: "Google Maps" },
            { icon: Clock, label: "Drive Time", desc: "With traffic" },
            { icon: Cloud, label: "Weather", desc: "Live conditions" },
            { icon: Fuel, label: "Fuel Prices", desc: "Regional rates" },
            { icon: DollarSign, label: "Tolls", desc: "By state" },
            { icon: TrendingUp, label: "Market", desc: "Auto-detected" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="bg-white p-1.5 rounded">
                <item.icon className="text-blue-600" size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CALCULATE BUTTON ===== */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="secondary"
          size="lg"
          onClick={onBack}
          icon={<ArrowLeft size={20} />}
          disabled={isCalculating}
        >
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleCalculate}
          icon={isCalculating ? <Spinner size="sm" /> : <Search size={20} />}
          iconPosition="left"
          disabled={isCalculating}
        >
          {isCalculating ? "Calculating..." : "Calculate My Rate"}
        </Button>
      </div>

      {/* ===== CALCULATION INFO ===== */}
      {isCalculating && (
        <div className="text-center text-sm text-gray-500">
          Fetching live data from Google Maps, Weather, Fuel, and Toll APIs...
        </div>
      )}
    </div>
  );
}
