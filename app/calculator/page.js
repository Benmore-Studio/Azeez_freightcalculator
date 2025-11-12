"use client";
import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import { Container } from "@/components/ui";
import SimpleCalculator from "@/components/Calculator/SimpleCalculator";
import FullCalculator from "@/components/Calculator/FullCalculator";
import { getVehiclesForCalculator, getTripsForCalculator } from "@/lib/mockData/vehicles";

export default function CalculatorPage() {
  // TODO: Replace with actual auth check from AuthContext when backend is ready
  // For now, defaulting to false (SimpleCalculator for anonymous users)
  const isAuthenticated = false; // Will be: const { isAuthenticated } = useAuth();

  // Get saved vehicles and trips for calculator
  const savedVehicles = getVehiclesForCalculator();
  const savedTrips = getTripsForCalculator();

  // Anonymous users get SimpleCalculator with Navbar
  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <Container>
          <div className="py-8">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Free Rate Calculator
              </h1>
              <p className="text-gray-600">
                Get instant ballpark freight rate estimates based on industry averages.
                Sign up for accurate rates based on your actual operating costs.
              </p>
            </div>
            <SimpleCalculator />
          </div>
        </Container>
      </>
    );
  }

  // Logged-in users get FullCalculator (no navbar, will be accessed through dashboard)
  return (
    <>
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
          <FullCalculator savedVehicles={savedVehicles} savedTrips={savedTrips} />
        </div>
      </div>
    </>
  );
}
