"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaWeight,
  FaCalendarAlt,
  FaTruck,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaCalculator,
  FaDollarSign,
  FaClock,
  FaRoad,
  FaGasPump,
} from "react-icons/fa";
import { Card, Button, Input, Spinner } from "@/components/ui";
import { quotesApi } from "@/lib/api";
import { showToast } from "@/lib/toast";

export default function QuickQuotePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [quote, setQuote] = useState(null);

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
    deliveryDate: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.origin.trim() !== "" &&
      formData.destination.trim() !== "" &&
      formData.weight !== "" &&
      parseFloat(formData.weight) > 0 &&
      formData.deliveryDate !== ""
    );
  };

  const handleCalculate = async () => {
    if (!isFormValid()) {
      showToast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setQuote(null);

    try {
      // Use defaults for all other fields
      const requestData = {
        origin: formData.origin,
        destination: formData.destination,
        weight: parseFloat(formData.weight),
        deliveryDate: formData.deliveryDate,
        // Defaults for quick quote
        vehicleType: "semi",
        loadType: "full_load",
        freightClass: "general",
        weatherConditions: "normal",
        deadheadMiles: 0,
        specialServices: [],
        // Let the backend estimate these
        totalMiles: 0, // Will be calculated or estimated
      };

      const response = await quotesApi.calculateQuote(requestData);
      setQuote(response);
    } catch (error) {
      console.error("Error calculating quote:", error);
      showToast.error("Failed to calculate quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuote = async () => {
    if (!quote) return;

    try {
      await quotesApi.createQuote({
        ...quote,
        origin: formData.origin,
        destination: formData.destination,
        weight: parseFloat(formData.weight),
        deliveryDate: formData.deliveryDate,
      });
      showToast.success("Quote saved successfully");
      router.push("/quotes");
    } catch (error) {
      console.error("Error saving quote:", error);
      showToast.error("Failed to save quote");
    }
  };

  const handleCustomize = () => {
    // Pass data to full calculator via query params
    const params = new URLSearchParams({
      origin: formData.origin,
      destination: formData.destination,
      weight: formData.weight,
      deliveryDate: formData.deliveryDate,
    });
    router.push(`/rate-calculator?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Centered form container - narrower for focused form experience */}
        <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCalculator className="text-blue-600 text-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Quick Quote
          </h1>
          <p className="text-gray-600">
            Get a fast rate estimate in seconds
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 bg-white border-2 border-gray-200 mb-6">
          <div className="space-y-5">
            {/* Origin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Origin
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600" />
                <Input
                  type="text"
                  placeholder="City, State or ZIP code"
                  value={formData.origin}
                  onChange={(e) => handleInputChange("origin", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Destination
              </label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" />
                <Input
                  type="text"
                  placeholder="City, State or ZIP code"
                  value={formData.destination}
                  onChange={(e) => handleInputChange("destination", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Weight & Date Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Weight (lbs)
                </label>
                <div className="relative">
                  <FaWeight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="e.g. 40000"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Delivery Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Delivery Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <Button
              onClick={handleCalculate}
              disabled={!isFormValid() || isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  Calculate Rate
                  <FaArrowRight className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Quote Result */}
        {quote && (
          <Card className="p-6 bg-white border-2 border-blue-200 shadow-md">
            {/* Main Rate Display */}
            <div className="text-center pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Estimated Rate</p>
              <p className="text-4xl font-bold text-gray-900">
                ${quote.recommendedRate?.toLocaleString() || "—"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ${quote.ratePerMile?.toFixed(2) || "—"}/mile
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-b border-gray-200">
              <div className="text-center">
                <FaRoad className="text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-semibold text-gray-900">
                  {quote.totalMiles?.toLocaleString() || "—"}
                </p>
                <p className="text-xs text-gray-500">Miles</p>
              </div>
              <div className="text-center">
                <FaClock className="text-gray-400 mx-auto mb-1" />
                <p className="text-lg font-semibold text-gray-900">
                  {quote.estimatedDriveHours?.toFixed(1) || "—"}
                </p>
                <p className="text-xs text-gray-500">Hours</p>
              </div>
              <div className="text-center">
                <FaDollarSign className="text-green-600 mx-auto mb-1" />
                <p className="text-lg font-semibold text-green-600">
                  ${quote.estimatedProfit?.toLocaleString() || "—"}
                </p>
                <p className="text-xs text-gray-500">Est. Profit</p>
              </div>
            </div>

            {/* Expandable Breakdown */}
            <div className="pt-4">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex items-center justify-between w-full text-left py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <span>View Cost Breakdown</span>
                {showBreakdown ? (
                  <FaChevronUp className="text-gray-400" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>

              {showBreakdown && quote.costBreakdown && (
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Fuel Cost</span>
                    <span className="font-medium">${quote.costBreakdown.fuelCost?.toFixed(2)}</span>
                  </div>
                  {quote.costBreakdown.defCost > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">DEF Cost</span>
                      <span className="font-medium">${quote.costBreakdown.defCost?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Maintenance</span>
                    <span className="font-medium">${quote.costBreakdown.maintenanceCost?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Tires</span>
                    <span className="font-medium">${quote.costBreakdown.tireCost?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-600">Fixed Costs</span>
                    <span className="font-medium">${quote.costBreakdown.fixedCostAllocation?.toFixed(2)}</span>
                  </div>
                  {quote.costBreakdown.hotelCost > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">Hotel Cost</span>
                      <span className="font-medium">${quote.costBreakdown.hotelCost?.toFixed(2)}</span>
                    </div>
                  )}
                  {quote.costBreakdown.factoringFee > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-gray-100">
                      <span className="text-gray-600">Factoring Fee</span>
                      <span className="font-medium">${quote.costBreakdown.factoringFee?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 font-semibold">
                    <span className="text-gray-900">Total Cost</span>
                    <span>${quote.costBreakdown.totalCost?.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Rate Range */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Rate Range</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Min: <span className="font-medium">${quote.minRate?.toLocaleString()}</span>
                </span>
                <span className="text-gray-600">
                  Max: <span className="font-medium">${quote.maxRate?.toLocaleString()}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleCustomize}>
                <FaTruck className="mr-2" />
                Customize
              </Button>
              <Button onClick={handleSaveQuote}>
                Save Quote
              </Button>
            </div>
          </Card>
        )}

        {/* Helper Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need more options?{" "}
          <button
            onClick={() => router.push("/rate-calculator")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Use Full Calculator
          </button>
        </p>
        </div>
      </div>
    </div>
  );
}
