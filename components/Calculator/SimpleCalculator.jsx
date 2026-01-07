"use client";

import React, { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { LuWeight } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { FaCalculator, FaInfoCircle } from "react-icons/fa";
import { Input, Select, Button, Card } from "@/components/ui";
import { showToast } from "@/lib/toast";
import Link from "next/link";

export default function SimpleCalculator() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
    equipment: "",
  });

  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCalculate = () => {
    // Validation
    if (!formData.origin || !formData.destination || !formData.weight || !formData.equipment) {
      showToast.error("Please fill in all fields");
      return;
    }

    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      // Industry average cost per mile
      const industryAvgCostPerMile = 1.75;

      // Rough distance estimate (this will be replaced with actual API in T16)
      // For now, use a random estimate between 500-2000 miles
      const estimatedMiles = Math.floor(Math.random() * 1500) + 500;

      // Equipment multipliers
      const equipmentMultipliers = {
        "dry-van": 1.0,
        "refrigerated": 1.3,
        "flatbed": 1.2,
        "tanker": 1.4,
        "oversized": 1.5,
      };

      const multiplier = equipmentMultipliers[formData.equipment] || 1.0;

      // Weight factor (charge more for heavier loads)
      const weightFactor = parseFloat(formData.weight) > 40000 ? 1.1 : 1.0;

      // Calculate rate
      const ratePerMile = industryAvgCostPerMile * multiplier * weightFactor;
      const totalRate = ratePerMile * estimatedMiles;

      setResult({
        totalRate: totalRate.toFixed(2),
        ratePerMile: ratePerMile.toFixed(2),
        miles: estimatedMiles,
      });

      setIsCalculating(false);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      origin: "",
      destination: "",
      weight: "",
      equipment: "",
    });
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card variant="elevated" className="overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6">
          <div className="flex items-center gap-3 mb-2">
            <FaCalculator className="text-white text-2xl" />
            <h2 className="text-2xl font-bold text-white">Quick Rate Calculator</h2>
          </div>
          <p className="text-blue-100 text-sm">
            Get an instant ballpark estimate in seconds - no signup required
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Origin & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Pickup Location"
              type="text"
              placeholder="Chicago, IL or 60601"
              value={formData.origin}
              onChange={(e) => handleInputChange("origin", e.target.value)}
              icon={<IoLocationOutline />}
              helperText="Enter city, state or ZIP code"
            />
            <Input
              label="Delivery Location"
              type="text"
              placeholder="Los Angeles, CA or 90001"
              value={formData.destination}
              onChange={(e) => handleInputChange("destination", e.target.value)}
              icon={<IoLocationOutline />}
              helperText="Enter city, state or ZIP code"
            />
          </div>

          {/* Weight & Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Weight (lbs)"
              type="number"
              placeholder="e.g., 45000"
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              icon={<LuWeight size={20} />}
              helperText="Total weight of the load"
            />
            <Select
              label="Equipment Type"
              placeholder="Select equipment"
              value={formData.equipment}
              onChange={(e) => handleInputChange("equipment", e.target.value)}
              options={[
                { value: "dry-van", label: "Dry Van" },
                { value: "refrigerated", label: "Refrigerated (Reefer)" },
                { value: "flatbed", label: "Flatbed" },
                { value: "tanker", label: "Tanker" },
                { value: "oversized", label: "Oversized/Heavy Haul" },
              ]}
              helperText="Type of trailer needed"
            />
          </div>

          {/* Disclaimer */}
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-md">
            <div className="flex gap-3">
              <FaInfoCircle className="text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-orange-800">
                  Estimate based on industry averages
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  This is a ballpark estimate using industry-standard rates. For accurate rates based
                  on YOUR specific costs, vehicle details, and operating expenses, please create a free account.
                </p>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleCalculate}
              size="lg"
              disabled={isCalculating}
              className="w-full md:w-auto min-w-[200px]"
              icon={<FaCalculator />}
              iconPosition="left"
            >
              {isCalculating ? "Calculating..." : "Calculate Rate"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <Card variant="elevated" className="mt-6 border-2 border-green-200">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TbTruckDelivery className="text-green-600 text-2xl" />
              <h3 className="text-xl font-bold text-gray-900">Estimated Rate</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Rate</p>
                <p className="text-3xl font-bold text-green-600">${result.totalRate}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Per Mile</p>
                <p className="text-2xl font-semibold text-gray-900">${result.ratePerMile}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Distance (est.)</p>
                <p className="text-2xl font-semibold text-gray-900">{result.miles} mi</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                Want accurate rates based on YOUR costs?
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                Create a free account to calculate rates using your actual vehicle specs, fuel costs,
                and operating expenses. Save quotes, track vehicles, and get precise profit margins.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Free Account
                  </Button>
                </Link>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Calculate Another
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
