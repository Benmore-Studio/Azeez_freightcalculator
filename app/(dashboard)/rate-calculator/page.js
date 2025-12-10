"use client";

import React, { useState, useEffect } from "react";
import { Spinner } from "@/components/ui";
import FullCalculator from "@/components/Calculator/FullCalculator";
import { vehiclesApi } from "@/lib/api";
import { showToast } from "@/lib/toast";

export default function DashboardCalculatorPage() {
  const [savedVehicles, setSavedVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const vehicles = await vehiclesApi.getVehicles();
      // Transform to format expected by calculator
      const transformedVehicles = vehicles.map((v) => ({
        id: v.id,
        name: v.name,
        type: v.vehicleType,
        year: v.year,
        make: v.make,
        model: v.model,
        mpg: v.mpg ? Number(v.mpg) : null,
        equipmentType: v.equipmentType,
        isPrimary: v.isPrimary,
      }));
      setSavedVehicles(transformedVehicles);
    } catch (error) {
      console.error("Failed to load vehicles:", error);
      showToast.error("Failed to load vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading calculator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Rate Calculator
          </h1>
          <p className="text-gray-600">
            Calculate accurate freight rates using your personalized operating costs and saved vehicles.
          </p>
        </div>
        <FullCalculator savedVehicles={savedVehicles} savedTrips={[]} />
      </div>
    </div>
  );
}
