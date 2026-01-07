"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Truck, Bus, Package, Car, Search, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Select, Input, Button } from "@/components/ui";
import { decodeVin, isValidVinFormat } from "@/lib/vinDecoder";

// Map Step 3 vehicle values to Step 4 values
const vehicleTypeMapping = {
  "Semitruck": "semitruck",
  "sprintervan": "sprintervan",
  "boxtruck": "boxtruck",
  "cargovan": "cargovan",
};

// Default MPG values by vehicle type (based on DOE, NACFE, and BTS data)
// Sources:
// - Semi Truck: NACFE Fleet Fuel Study 2024 (national average 6.9 MPG)
// - Box Truck: DOE mid-range for medium trucks (8-10 MPG)
// - Sprinter Van: EPA diesel sprinter average (18-22 MPG)
// - Cargo Van: EPA full-size van average (14-18 MPG)
const defaultMpgByType = {
  semitruck: "6.9",
  boxtruck: "9",
  sprintervan: "19",
  cargovan: "16",
};

export default function Step4VehicleInfo({ initialData, onNext, onPrevious, onSkip }) {
  // Pre-fill vehicle type from Step 3's cost data if available
  const prefilledType = initialData.costData?.vehicle
    ? vehicleTypeMapping[initialData.costData.vehicle] || ""
    : "";

  const [vehicleData, setVehicleData] = useState(
    initialData.vehicleData || {
      type: prefilledType,
      vin: "",
      year: "",
      make: "",
      model: "",
      fuelType: "Diesel",
      mpg: prefilledType ? defaultMpgByType[prefilledType] || "" : "",
      equipment: [],
    }
  );

  // Sync vehicle type from Step 3 when initialData changes
  useEffect(() => {
    if (initialData.costData?.vehicle && !vehicleData.type) {
      const mappedType = vehicleTypeMapping[initialData.costData.vehicle];
      if (mappedType) {
        setVehicleData((prev) => ({
          ...prev,
          type: mappedType,
          // Also set default MPG if not already set
          mpg: prev.mpg || defaultMpgByType[mappedType] || prev.mpg,
        }));
      }
    }
  }, [initialData.costData?.vehicle]);

  // VIN decoder state
  const [vinDecoding, setVinDecoding] = useState(false);
  const [vinDecodeResult, setVinDecodeResult] = useState(null); // { success: true/false, message: string }

  const vehicleTypes = [
    { value: "semitruck", label: "Semi Truck Tractor", icon: Truck },
    { value: "sprintervan", label: "Sprinter Van", icon: Bus },
    { value: "boxtruck", label: "Box Truck", icon: Package },
    { value: "cargovan", label: "Cargo Van", icon: Car },
  ];

  const makes = [
    "Freightliner",
    "Peterbilt",
    "Kenworth",
    "Volvo",
    "International",
    "Mack",
    "Western Star",
    "Mercedes",
    "Ford",
    "RAM",
    "Chevrolet",
  ];

  const fuelTypes = ["Gasoline", "Diesel", "CNG", "LNG", "Electric", "Hybrid"];

  // Memoize year options to avoid regenerating on every render
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1989 }, (_, i) => {
      const year = 1990 + i;
      return { value: year, label: year.toString() };
    }).reverse();
  }, []);

  const equipmentTypes = [
    "Dry Van",
    "Refrigerated",
    "Flatbed",
    "Step Deck",
    "Lowboy",
    "Tanker",
    "Conestoga",
    "Specialized",
  ];

  const handleInputChange = (field, value) => {
    setVehicleData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-populate default MPG when vehicle type changes (if MPG is empty)
      if (field === "type" && !prev.mpg && defaultMpgByType[value]) {
        updated.mpg = defaultMpgByType[value];
      }

      return updated;
    });
  };

  const toggleEquipment = (equipment) => {
    setVehicleData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter((e) => e !== equipment)
        : [...prev.equipment, equipment],
    }));
  };

  // Handle VIN decode
  const handleDecodeVin = async () => {
    const vin = vehicleData.vin?.trim().toUpperCase();

    if (!vin) {
      setVinDecodeResult({ success: false, message: "Please enter a VIN number" });
      return;
    }

    if (!isValidVinFormat(vin)) {
      setVinDecodeResult({
        success: false,
        message: "Invalid VIN format. Must be 17 characters without I, O, or Q.",
      });
      return;
    }

    setVinDecoding(true);
    setVinDecodeResult(null);

    const result = await decodeVin(vin);

    setVinDecoding(false);

    if (result.success) {
      // Auto-populate the fields
      setVehicleData((prev) => ({
        ...prev,
        year: result.data.year || prev.year,
        make: result.data.make || prev.make,
        model: result.data.model || prev.model,
        type: result.data.type || prev.type,
        fuelType: result.data.fuelType || prev.fuelType,
      }));
      setVinDecodeResult({
        success: true,
        message: `Found: ${result.data.year} ${result.data.make} ${result.data.model}`,
      });
    } else {
      setVinDecodeResult({ success: false, message: result.error });
    }
  };

  const handleContinue = () => {
    onNext({ vehicleData });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Your Primary Vehicle</h3>
        <p className="text-gray-600 text-sm">
          Enter details about your main truck. This helps us calculate accurate fuel costs and rates.
          You can add more vehicles from the dashboard later.
        </p>
      </div>

      {/* Vehicle Type Selection */}
      <div>
        <label className="block font-semibold text-gray-700 mb-2">
          Vehicle Type
        </label>
        <p className="text-xs text-gray-500 mb-3">
          {prefilledType ? "Pre-selected from your previous choice. Change if needed." : "What type of truck do you drive?"}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {vehicleTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange("type", type.value)}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                  vehicleData.type === type.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  vehicleData.type === type.value ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  <IconComponent className={`${
                    vehicleData.type === type.value ? "text-blue-600" : "text-gray-600"
                  }`} size={20} />
                </div>
                <span className="font-medium text-sm">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIN Auto-Fill Section - Show first as the easy option */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="block font-semibold text-gray-900 mb-1">
          Quick Fill with VIN (Optional)
        </label>
        <p className="text-xs text-gray-600 mb-3">
          Have your VIN handy? Enter it and we'll auto-fill the details below.
        </p>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="17-digit VIN (found on dashboard or door jamb)"
              value={vehicleData.vin}
              onChange={(e) => {
                handleInputChange("vin", e.target.value.toUpperCase());
                setVinDecodeResult(null);
              }}
              maxLength={17}
            />
          </div>
          <Button
            type="button"
            onClick={handleDecodeVin}
            disabled={vinDecoding || !vehicleData.vin}
            variant="secondary"
            className="whitespace-nowrap"
          >
            {vinDecoding ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Decoding...
              </>
            ) : (
              <>
                <Search className="mr-2" size={16} />
                Decode
              </>
            )}
          </Button>
        </div>
        {vinDecodeResult && (
          <div
            className={`mt-2 p-2 rounded-lg flex items-center gap-2 text-sm ${
              vinDecodeResult.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {vinDecodeResult.success ? (
              <CheckCircle size={16} className="flex-shrink-0" />
            ) : (
              <AlertCircle size={16} className="flex-shrink-0" />
            )}
            <span>{vinDecodeResult.message}</span>
          </div>
        )}
      </div>

      {/* Vehicle Specifications - Manual entry or verify VIN results */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-1">Vehicle Details</h4>
        <p className="text-xs text-gray-500 mb-4">
          {vinDecodeResult?.success
            ? "Verify the auto-filled details below, or make corrections if needed"
            : "Enter manually, or use VIN above to auto-fill"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Year"
            placeholder="Select year"
            value={vehicleData.year}
            onChange={(e) => handleInputChange("year", e.target.value)}
            options={yearOptions}
          />

          <Select
            label="Make (Manufacturer)"
            placeholder="Select make"
            value={vehicleData.make}
            onChange={(e) => handleInputChange("make", e.target.value)}
            options={makes.map((make) => ({ value: make, label: make }))}
          />

          <Input
            label="Model"
            type="text"
            placeholder="e.g., Cascadia, 579, T680"
            value={vehicleData.model}
            onChange={(e) => handleInputChange("model", e.target.value)}
          />

          <Select
            label="Fuel Type"
            placeholder="Select fuel type"
            value={vehicleData.fuelType}
            onChange={(e) => handleInputChange("fuelType", e.target.value)}
            options={fuelTypes.map((fuel) => ({ value: fuel, label: fuel }))}
          />

          <Input
            label="Average MPG"
            type="number"
            placeholder="e.g., 6.5"
            value={vehicleData.mpg}
            onChange={(e) => handleInputChange("mpg", e.target.value)}
            helperText={
              vehicleData.type && vehicleData.mpg === defaultMpgByType[vehicleData.type]
                ? `Industry average for this vehicle type (DOE/NACFE data). Adjust if yours differs.`
                : "Your truck's fuel economy (used to estimate fuel costs)"
            }
          />
        </div>
      </div>

      {/* Trailer/Equipment Type */}
      <div>
        <label className="block font-semibold text-gray-700 mb-1">
          Trailer Type
        </label>
        <p className="text-xs text-gray-500 mb-3">
          What type of trailer(s) do you haul? Select all that apply.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {equipmentTypes.map((equipment) => (
            <button
              key={equipment}
              type="button"
              onClick={() => toggleEquipment(equipment)}
              className={`px-3 py-2 border-2 rounded-lg text-sm font-medium transition-colors ${
                vehicleData.equipment.includes(equipment)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {equipment}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button onClick={onPrevious} variant="outline" size="lg">
          Back
        </Button>
        <div className="flex gap-3">
          <Button onClick={onSkip} variant="secondary" size="lg">
            Skip for Now
          </Button>
          <Button onClick={handleContinue} size="lg">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
