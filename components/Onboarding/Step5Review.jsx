"use client";

import React from "react";
import { FaCheckCircle, FaUser, FaTruck, FaDollarSign } from "react-icons/fa";
import { Button } from "@/components/ui";

export default function Step5Review({ data, onPrevious, onComplete }) {
  const getUserTypeLabel = (value) => {
    const types = {
      "owner-operator": "Owner Operator 🚛",
      "fleet-manager": "Fleet Manager 👔",
      dispatcher: "Dispatcher 📋",
    };
    return types[value] || value;
  };

  const hasVehicleData = data.vehicleData?.type || data.vehicleData?.year;
  const hasCostData = data.costData?.vehicle || data.costData?.milesdriven;

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <FaCheckCircle className="text-green-600 text-5xl" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h3>
        <p className="text-gray-600 text-sm">
          Review your information below and complete your profile
        </p>
      </div>

      {/* Profile Summary Cards */}
      <div className="space-y-4">
        {/* User Type & Basic Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <FaUser className="text-blue-600" />
            <h4 className="font-semibold text-gray-900">Profile Information</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium text-gray-900">
                {getUserTypeLabel(data.userType)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium text-gray-900">{data.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{data.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-900">
                {data.phone || "Not provided"}
              </span>
            </div>
            {data.company && (
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium text-gray-900">{data.company}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cost Data */}
        {hasCostData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <FaDollarSign className="text-green-600" />
              <h4 className="font-semibold text-gray-900">Cost Information</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle Type:</span>
                <span className="font-medium text-gray-900">
                  {data.costData?.vehicle || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Miles Driven:</span>
                <span className="font-medium text-gray-900">
                  {data.costData?.milesdriven?.toLocaleString() || "0"} /{" "}
                  {data.costData?.frequency || "monthly"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost Source:</span>
                <span className="font-medium text-gray-900">
                  {data.costData?.radio === "default"
                    ? "Industry Averages"
                    : "Custom Data"}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-300">
                <span className="text-gray-700 font-semibold">
                  Estimated Cost/Mile:
                </span>
                <span className="font-bold text-green-700 text-lg">$1.75</span>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Data */}
        {hasVehicleData && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <FaTruck className="text-purple-600" />
              <h4 className="font-semibold text-gray-900">Vehicle Information</h4>
            </div>
            <div className="space-y-2 text-sm">
              {data.vehicleData?.type && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {data.vehicleData.type}
                  </span>
                </div>
              )}
              {(data.vehicleData?.year ||
                data.vehicleData?.make ||
                data.vehicleData?.model) && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium text-gray-900">
                    {[
                      data.vehicleData.year,
                      data.vehicleData.make,
                      data.vehicleData.model,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </span>
                </div>
              )}
              {data.vehicleData?.fuelType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type:</span>
                  <span className="font-medium text-gray-900">
                    {data.vehicleData.fuelType}
                  </span>
                </div>
              )}
              {data.vehicleData?.mpg && (
                <div className="flex justify-between">
                  <span className="text-gray-600">MPG:</span>
                  <span className="font-medium text-gray-900">
                    {data.vehicleData.mpg}
                  </span>
                </div>
              )}
              {data.vehicleData?.equipment?.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Equipment:</span>
                  <span className="font-medium text-gray-900">
                    {data.vehicleData.equipment.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skipped Sections Notice */}
        {!hasCostData && !hasVehicleData && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 text-center">
            <p className="text-sm text-yellow-800">
              You skipped cost and vehicle information. You can add these details
              from your dashboard at any time.
            </p>
          </div>
        )}
      </div>

      {/* Next Steps Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-5">
        <h4 className="font-semibold text-gray-900 mb-3">What's Next?</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Access your personalized dashboard</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Calculate rates with your specific data</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Save quotes and track your vehicles</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">✓</span>
            <span>Earn rewards and unlock features</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button onClick={onPrevious} variant="outline" size="lg">
          Back
        </Button>
        <Button onClick={() => onComplete({})} size="lg" className="px-8">
          Complete Setup & Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
