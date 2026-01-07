"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import RateCards from "./RateCards";
import BreakdownSection from "./BreakdownSection";
import RouteInfoCard from "./RouteInfoCard";
import TollBreakdown from "./TollBreakdown";
import RouteAnalysis from "./RouteAnalysis";
import MarketAnalysis from "./MarketAnalysis";
import RateBreakdown from "./RateBreakdown";
import LoadAcceptanceScore from "./LoadAcceptanceScore";
import ProfitCalculator from "./ProfitCalculator";
import WeatherAnalysis from "./WeatherAnalysis";
import MarketIntelligence from "./MarketIntelligence";
import ScheduleFeasibility from "./ScheduleFeasibility";
import { getWeatherForRoute } from "@/lib/mockData/weather";
import { getMarketIntelligence, getMarketTempDisplay } from "@/lib/mockData/marketIntelligence";
import { calculateLoadAcceptanceScore } from "@/lib/mockData/loadAcceptanceScore";

/**
 * Transform API market data to the format expected by MarketIntelligence component
 */
function transformApiMarketData(apiData, origin, destination) {
  const { supplyDemand, returnLoadPotential, marketLow, marketMid, marketHigh, confidence, factors } = apiData;

  // Get trend based on flow direction
  const getRateTrend = (flowDirection) => {
    if (flowDirection === 'headhaul') return 'rising';
    if (flowDirection === 'backhaul') return 'falling';
    return 'stable';
  };

  // Generate recommendation based on market conditions
  const getRecommendation = (flowDirection, returnScore, confidence) => {
    if (flowDirection === 'headhaul' && returnScore >= 6) {
      return {
        action: 'accept',
        message: `Strong market conditions with ${confidence}% confidence. High demand lane with excellent return load potential.`
      };
    }
    if (flowDirection === 'backhaul' || returnScore < 4) {
      return {
        action: 'caution',
        message: `Backhaul lane with limited return loads. Consider negotiating a higher rate to cover potential empty miles.`
      };
    }
    return {
      action: 'consider',
      message: `Balanced market conditions. Rate is within normal range. Consider current demand and your schedule.`
    };
  };

  // Generate mock return lanes based on destination region
  const generateReturnLanes = (destRegion, avgRate) => {
    const lanesByRegion = {
      midwest: [
        { destination: 'Chicago, IL', loads: 45, distance: 280, rate: avgRate * 1.05 },
        { destination: 'Detroit, MI', loads: 32, distance: 450, rate: avgRate * 0.98 },
        { destination: 'Indianapolis, IN', loads: 28, distance: 320, rate: avgRate * 1.02 },
      ],
      southeast: [
        { destination: 'Atlanta, GA', loads: 52, distance: 350, rate: avgRate * 1.08 },
        { destination: 'Charlotte, NC', loads: 38, distance: 420, rate: avgRate * 1.03 },
        { destination: 'Nashville, TN', loads: 41, distance: 380, rate: avgRate * 1.01 },
      ],
      west: [
        { destination: 'Los Angeles, CA', loads: 28, distance: 400, rate: avgRate * 0.92 },
        { destination: 'Phoenix, AZ', loads: 35, distance: 550, rate: avgRate * 0.95 },
        { destination: 'Las Vegas, NV', loads: 22, distance: 280, rate: avgRate * 0.88 },
      ],
      south_central: [
        { destination: 'Dallas, TX', loads: 58, distance: 320, rate: avgRate * 1.06 },
        { destination: 'Houston, TX', loads: 62, distance: 450, rate: avgRate * 1.10 },
        { destination: 'San Antonio, TX', loads: 44, distance: 380, rate: avgRate * 1.04 },
      ],
      northeast: [
        { destination: 'New York, NY', loads: 48, distance: 280, rate: avgRate * 1.12 },
        { destination: 'Philadelphia, PA', loads: 42, distance: 320, rate: avgRate * 1.08 },
        { destination: 'Boston, MA', loads: 35, distance: 450, rate: avgRate * 1.15 },
      ],
    };

    return lanesByRegion[destRegion] || lanesByRegion.midwest;
  };

  const originCity = origin?.split(',')[0] || supplyDemand.originRegionName;
  const destCity = destination?.split(',')[0] || supplyDemand.destinationRegionName;
  const rateTrend = getRateTrend(supplyDemand.flowDirection);

  return {
    origin: {
      city: originCity,
      marketTemperature: supplyDemand.marketTemperature,
      truckToLoadRatio: supplyDemand.truckToLoadRatio.toFixed(2),
      loadsAvailable: Math.round(1000 + Math.random() * 500),
      avgRatePerMile: marketMid.toFixed(2),
      rateTrend,
    },
    destination: {
      city: destCity,
      marketTemperature: supplyDemand.marketTemperature,
      truckToLoadRatio: (supplyDemand.truckToLoadRatio * (supplyDemand.flowDirection === 'backhaul' ? 1.5 : 0.8)).toFixed(2),
      loadsAvailable: returnLoadPotential.loadsAvailable,
      avgRatePerMile: returnLoadPotential.avgReturnRate.toFixed(2),
      rateTrend: supplyDemand.flowDirection === 'backhaul' ? 'falling' : 'stable',
    },
    returnLoadPotential: {
      score: returnLoadPotential.score,
      rating: returnLoadPotential.rating,
      message: returnLoadPotential.score >= 7
        ? `Excellent return load potential from ${destCity}. ${returnLoadPotential.loadsAvailable} loads available daily.`
        : returnLoadPotential.score >= 4
        ? `Moderate return load potential. Plan your next move carefully.`
        : `Limited return loads from this destination. Factor in potential deadhead costs.`,
    },
    topReturnLanes: generateReturnLanes(supplyDemand.destinationRegion, marketMid),
    recommendation: getRecommendation(supplyDemand.flowDirection, returnLoadPotential.score, confidence),
  };
}

export default function Quote({ quoteData }) {
  // Default data structure if no data is passed
  const data = quoteData || {
    recommendedRate: {
      total: 0.0,
      perMile: NaN,
      miles: 0,
      label: "Competitive",
    },
    spotMarketRate: {
      total: 0.0,
      perMile: NaN,
      label: "Current Market",
    },
    contractRate: {
      total: 0.0,
      perMile: NaN,
      label: "Competitive",
    },
    breakdown: {
      fuelCost: 0,
      defCost: 0,
      maintenanceCost: 0,
      tireCost: 0,
      fixedCosts: 0,
      dcFees: 0,
      hotelCost: 0,
      serviceFees: 0,
      factoringFee: 0,
      tollCost: 0,
      totalCost: 0,
      costPerMile: 0,
    },
    multipliers: {
      weather: 1.0,
      loadType: 1.0,
      freightClass: 1.0,
      services: 1.0,
      weight: 1.0,
      seasonal: 1.0,
      total: 1.0,
    },
    routeAnalysis: {
      pickup: {
        region: "Northeast",
        truckToFreightRatio: 0.5,
        marketCondition: "Hot",
        rateNegotiation: "Negotiate higher rates (carrier advantage)",
      },
      delivery: {
        region: "Northeast",
        truckToFreightRatio: 0.5,
        marketCondition: "Hot",
        nextLoadPotential: "High (easy to find next load)",
        availableLoads: 85,
      },
    },
    marketAnalysis: {
      loadBoardStats: {
        truckToLoadRatio: 1.22,
        marketTrend: "Falling",
        averageRate: 3.45,
        loadVolume: 507,
        totalLoadsInDestination: 416,
        destinationRadius: 100,
      },
      nextMoneyLanes: [
        { id: 1, miles: 789, loadsAvailable: 21, ratePerMile: 3.41 },
        { id: 2, miles: 755, loadsAvailable: 13, ratePerMile: 2.96 },
        { id: 3, miles: 879, loadsAvailable: 13, ratePerMile: 2.77 },
      ],
    },
    bookingInfo: {
      calculatedRate: 0.0,
      confirmationTime: "1 business hour",
    },
  };

  // Extract enriched data from quoteData (from API) or use defaults
  const origin = quoteData?.origin || "Chicago, IL";
  const destination = quoteData?.destination || "Los Angeles, CA";
  const mockRate = data.recommendedRate.total || 3500;
  const mockDeadheadMiles = quoteData?.deadheadMiles || 25;
  const mockTotalMiles = data.recommendedRate.miles || 2015;

  // Extract enriched route/weather/toll data from API response
  const routeData = quoteData?.routeData || null;
  const apiWeatherData = quoteData?.weatherData || null;
  const tollData = quoteData?.tollData || null;
  const scheduleData = quoteData?.scheduleData || null;

  // Schedule feasibility data - assume pickup is "now" if not specified
  const getScheduleProps = () => {
    if (!scheduleData?.deliveryDate) return null;

    // Format today as pickup date
    const today = new Date();
    const pickupDate = today.toISOString().split('T')[0];
    const pickupTime = "08:00"; // Assume early morning pickup

    // Format delivery time from window
    const deliveryTimeMap = {
      morning: "10:00",
      afternoon: "14:00",
      evening: "18:00",
    };
    const deliveryTime = deliveryTimeMap[scheduleData.deliveryTime] || "14:00";

    return {
      pickupDate,
      pickupTime,
      deliveryDate: scheduleData.deliveryDate,
      deliveryTime,
      estimatedDriveHours: scheduleData.estimatedDriveHours || routeData?.duration,
      totalMiles: scheduleData.totalMiles || routeData?.miles || mockTotalMiles,
    };
  };

  const scheduleFeasibilityProps = getScheduleProps();

  // Calculate total costs from breakdown if available
  const breakdownCosts = data.breakdown;
  const calculatedTotalCosts = breakdownCosts?.totalCost || (
    (breakdownCosts?.fuelCost || 0) +
    (breakdownCosts?.defCost || 0) +
    (breakdownCosts?.maintenanceCost || 0) +
    (breakdownCosts?.tireCost || 0) +
    (breakdownCosts?.fixedCosts || 0) +
    (breakdownCosts?.dcFees || 0) +
    (breakdownCosts?.hotelCost || 0) +
    (breakdownCosts?.tollCost || 0) +
    (breakdownCosts?.serviceFees || 0) +
    (breakdownCosts?.factoringFee || 0)
  );
  const mockTotalCosts = calculatedTotalCosts || 2450;

  // Use API weather data if available, otherwise fall back to mock
  const weatherData = apiWeatherData || getWeatherForRoute(origin, destination);

  // Use API market data if available, otherwise fall back to mock
  const apiMarketData = quoteData?.marketData;
  const marketIntelData = apiMarketData
    ? transformApiMarketData(apiMarketData, origin, destination)
    : getMarketIntelligence(origin, destination);

  // Generate profit data from actual API results or mock
  const profitFromApi = quoteData?.profit;
  // API returns profitMargin as decimal (0.15), convert to percentage (15)
  const apiProfitMarginPercent = profitFromApi?.margin ? profitFromApi.margin * 100 : null;
  const calculatedProfitMargin = ((mockRate - mockTotalCosts) / mockRate) * 100;

  const profitData = {
    revenue: mockRate,
    totalCosts: mockTotalCosts,
    netProfit: profitFromApi?.total || (mockRate - mockTotalCosts),
    profitMargin: apiProfitMarginPercent || calculatedProfitMargin,
    totalMiles: mockTotalMiles,
    costBreakdown: {
      fuelCost: breakdownCosts?.fuelCost || 0,
      maintenance: breakdownCosts?.maintenanceCost || 0,
      fixedCosts: breakdownCosts?.fixedCosts || 0,
      tollsAndFees: (breakdownCosts?.tollCost || 0) + (breakdownCosts?.serviceFees || 0),
      defAndTires: (breakdownCosts?.defCost || 0) + (breakdownCosts?.tireCost || 0),
      hotelCost: breakdownCosts?.hotelCost || 0,
      factoringFee: breakdownCosts?.factoringFee || 0,
    }
  };

  // Calculate load acceptance score
  const loadScoreData = calculateLoadAcceptanceScore({
    rate: mockRate,
    totalCosts: mockTotalCosts,
    profitMargin: profitData.profitMargin,
    marketData: marketIntelData,
    deadheadMiles: mockDeadheadMiles,
    totalMiles: mockTotalMiles,
    weatherData: weatherData
  });

  // Utility Functions
  const formatCurrency = (value) => {
    if (value === undefined || value === null || isNaN(value)) return "$0.00";
    return `$${value.toFixed(2)}`;
  };

  const formatRatio = (ratio) => {
    if (ratio === undefined || ratio === null || isNaN(ratio)) return "N/A";
    return `${ratio.toFixed(1)}:1`;
  };

  const getMarketConditionColor = (condition) => {
    if (!condition) return "text-gray-600";
    switch (condition.toLowerCase()) {
      case "hot":
        return "text-blue-600";
      case "warm":
        return "text-orange-600";
      case "cold":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getRatioColor = (ratio) => {
    if (ratio === undefined || ratio === null || isNaN(ratio)) return "bg-gray-100 text-gray-700";
    if (ratio <= 0.5) return "bg-blue-100 text-blue-700";
    if (ratio <= 1.0) return "bg-orange-100 text-orange-700";
    return "bg-gray-200 text-gray-700";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4 sm:pb-6">
        <FaCheckCircle className="text-emerald-500 text-2xl sm:text-3xl" />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Rate Calculation Complete</h1>
      </div>

      {/* Load Acceptance Score - THE INSTANT DECISION */}
      <LoadAcceptanceScore scoreData={loadScoreData} />

      {/* Rate Cards */}
      <RateCards data={data} formatCurrency={formatCurrency} />

      {/* Route Details - AUTO-CALCULATED FROM API */}
      <RouteInfoCard
        routeData={routeData}
        origin={origin}
        destination={destination}
      />

      {/* Toll Breakdown - AUTO-CALCULATED FROM API */}
      <TollBreakdown tollData={tollData} />

      {/* Schedule Feasibility - HOS COMPLIANCE CHECK */}
      {scheduleFeasibilityProps && (
        <ScheduleFeasibility {...scheduleFeasibilityProps} />
      )}

      {/* Profit Calculator - PROFITABILITY VISUALIZATION */}
      <ProfitCalculator profitData={profitData} />

      {/* Breakdown Section */}
      <BreakdownSection data={data} formatCurrency={formatCurrency} />

      {/* Weather Analysis - ROUTE CONDITIONS & RISK */}
      <WeatherAnalysis weatherData={weatherData} />

      {/* Market Intelligence - COMPREHENSIVE MARKET ANALYSIS */}
      <MarketIntelligence marketData={marketIntelData} />

      {/* Route & Market Analysis (Legacy) */}
      <RouteAnalysis
        data={data}
        formatRatio={formatRatio}
        getMarketConditionColor={getMarketConditionColor}
        getRatioColor={getRatioColor}
      />

      {/* Market Analysis & Next Money Lanes (Legacy) */}
      <MarketAnalysis data={data} />

      {/* Rate Calculation Breakdown - Shows multipliers applied */}
      <RateBreakdown
        ratePerMile={data?.recommendedRate?.perMile || 0}
        totalMiles={data?.recommendedRate?.miles || 0}
        recommendedRate={data?.recommendedRate?.total || 0}
        costPerMile={data?.breakdown?.costPerMile || 0}
        multipliers={data?.multipliers || {}}
      />
    </div>
  );
}
