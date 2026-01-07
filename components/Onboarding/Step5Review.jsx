"use client";

import React from "react";
import { CheckCircle2, User, Truck, DollarSign, Loader2 } from "lucide-react";
import { Button, Spinner } from "@/components/ui";

export default function Step5Review({ data, onPrevious, onComplete, isSaving = false }) {
  const getUserTypeLabel = (value) => {
    const types = {
      "owner-operator": "Owner Operator",
      "fleet-manager": "Fleet Manager",
      dispatcher: "Dispatcher",
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
          <div className="bg-blue-100 p-4 rounded-full">
            <CheckCircle2 className="text-blue-600" size={48} />
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
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="text-blue-600" size={20} />
            </div>
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
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <DollarSign className="text-blue-600" size={20} />
              </div>
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
                    : "Custom (set in Profile)"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Data */}
        {hasVehicleData && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Truck className="text-blue-600" size={20} />
              </div>
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
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-5 text-center">
            <p className="text-sm text-orange-800">
              You skipped cost and vehicle information. You can add these details
              from your dashboard at any time.
            </p>
          </div>
        )}
      </div>

      {/* Next Steps Preview */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-5">
        <h4 className="font-semibold text-gray-900 mb-3">What's Next?</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Access your personalized dashboard</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Calculate rates with your specific data</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Save quotes and track your vehicles</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Earn rewards and unlock features</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button onClick={onPrevious} variant="outline" size="lg" disabled={isSaving}>
          Back
        </Button>
        <Button
          onClick={() => onComplete({})}
          size="lg"
          className="px-8"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            "Complete Setup & Go to Dashboard"
          )}
        </Button>
      </div>
    </div>
  );
}
