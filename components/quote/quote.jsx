"use client";

import React from "react";
import { FaCheckCircle, FaShareAlt } from "react-icons/fa";
import { Button } from "@/components/ui";
import RateCards from "./RateCards";
import BreakdownSection from "./BreakdownSection";
import RouteAnalysis from "./RouteAnalysis";
import MarketAnalysis from "./MarketAnalysis";
import BrokerVerification from "./BrokerVerification";
import BookingSection from "./BookingSection";
import RateBreakdown from "./RateBreakdown";
import LoadAcceptanceScore from "./LoadAcceptanceScore";
import ProfitCalculator from "./ProfitCalculator";
import WeatherAnalysis from "./WeatherAnalysis";
import MarketIntelligence from "./MarketIntelligence";
import { getWeatherForRoute } from "@/lib/mockData/weather";
import { getMarketIntelligence } from "@/lib/mockData/marketIntelligence";
import { calculateLoadAcceptanceScore } from "@/lib/mockData/loadAcceptanceScore";

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
      baseRate: 0.0,
      fuelSurcharge: 0.0,
      deadheadCost: 0.0,
      costPerMile: 1.75,
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

  // Generate mock data for new components
  // In production, these would come from the calculator results
  const mockOrigin = quoteData?.origin || "Chicago, IL";
  const mockDestination = quoteData?.destination || "Los Angeles, CA";
  const mockRate = data.recommendedRate.total || 3500;
  const mockTotalCosts = 2450;
  const mockDeadheadMiles = quoteData?.deadheadMiles || 25;
  const mockTotalMiles = data.recommendedRate.miles || 2015;

  // Generate weather data
  const weatherData = getWeatherForRoute(mockOrigin, mockDestination);

  // Generate market intelligence data
  const marketIntelData = getMarketIntelligence(mockOrigin, mockDestination);

  // Generate profit data
  const profitData = {
    revenue: mockRate,
    totalCosts: mockTotalCosts,
    netProfit: mockRate - mockTotalCosts,
    profitMargin: ((mockRate - mockTotalCosts) / mockRate) * 100,
    costBreakdown: {
      fuelCost: 890.50,
      driverPay: 750.00,
      maintenance: 220.00,
      insurance: 185.00,
      tollsAndFees: 145.00,
      deadheadCost: 125.50,
      other: 134.00
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

  // Event Handlers
  const handleShareQuote = () => {
    console.log("Share quote clicked");
  };

  const handleReportIssue = () => {
    console.log("Report issue clicked");
  };

  const handleViewBookingPolicies = () => {
    console.log("View booking policies clicked");
  };

  const handleSelectLane = (laneId) => {
    console.log("Lane selected:", laneId);
  };

  const handleSaveQuote = () => {
    console.log("Save quote clicked");
  };

  const handleCompareRates = () => {
    console.log("Compare rates clicked");
  };

  const handleMarketAnalysis = () => {
    console.log("Market analysis clicked");
  };

  const handleScheduleLoad = () => {
    console.log("Schedule load clicked");
  };

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
        return "text-green-600";
      case "warm":
        return "text-yellow-600";
      case "cold":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getRatioColor = (ratio) => {
    if (ratio === undefined || ratio === null || isNaN(ratio)) return "bg-gray-100 text-gray-700";
    if (ratio <= 0.5) return "bg-green-100 text-green-700";
    if (ratio <= 1.0) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4 sm:pb-6">
        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-green-500 text-2xl sm:text-3xl" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rate Calculation Complete</h1>
        </div>
        <Button
          onClick={handleShareQuote}
          variant="outline"
          size="md"
          icon={<FaShareAlt />}
          iconPosition="left"
          className="w-full sm:w-auto"
        >
          Share Quote
        </Button>
      </div>

      {/* Load Acceptance Score - THE INSTANT DECISION */}
      <LoadAcceptanceScore scoreData={loadScoreData} />

      {/* Rate Cards */}
      <RateCards data={data} formatCurrency={formatCurrency} />

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
      <MarketAnalysis data={data} handleSelectLane={handleSelectLane} />

      {/* Broker Verification */}
      <BrokerVerification handleReportIssue={handleReportIssue} />

      {/* Book This Load */}
      <BookingSection
        data={data}
        formatCurrency={formatCurrency}
        handleViewBookingPolicies={handleViewBookingPolicies}
      />

      {/* Detailed Rate Breakdown */}
      <RateBreakdown
        baseRate={1.75}
        miles={data?.recommendedRate?.miles || 0}
        loadTypeMultiplier={1.0}
        urgencyMultiplier={1.0}
        driverTypeMultiplier={1.0}
        onSaveQuote={handleSaveQuote}
        onCompareRates={handleCompareRates}
        onMarketAnalysis={handleMarketAnalysis}
        onScheduleLoad={handleScheduleLoad}
        onShareQuote={handleShareQuote}
      />
    </div>
  );
}
