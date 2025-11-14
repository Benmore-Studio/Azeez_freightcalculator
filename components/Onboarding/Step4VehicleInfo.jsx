"use client";

import React, { useState } from "react";
import { Truck, Bus, Package, Car } from "lucide-react";
import { Select, Input, Button } from "@/components/ui";

export default function Step4VehicleInfo({ initialData, onNext, onPrevious, onSkip }) {
  const [vehicleData, setVehicleData] = useState(
    initialData.vehicleData || {
      type: "",
      vin: "",
      year: "",
      make: "",
      model: "",
      fuelType: "",
      mpg: "",
      equipment: [],
    }
  );

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
    setVehicleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEquipment = (equipment) => {
    setVehicleData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter((e) => e !== equipment)
        : [...prev.equipment, equipment],
    }));
  };

  const handleContinue = () => {
    onNext({ vehicleData });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Information</h3>
        <p className="text-gray-600 text-sm">
          Add your primary vehicle. You can add more vehicles from the dashboard later.
        </p>
      </div>

      {/* Vehicle Type Selection */}
      <div>
        <label className="block font-semibold text-gray-700 mb-3">
          Vehicle Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {vehicleTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange("type", type.value)}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
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

      {/* Vehicle Specifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Vehicle Year"
          placeholder="Select year"
          value={vehicleData.year}
          onChange={(e) => handleInputChange("year", e.target.value)}
          options={Array.from(
            { length: new Date().getFullYear() - 1989 },
            (_, i) => {
              const year = 1990 + i;
              return { value: year, label: year.toString() };
            }
          ).reverse()}
        />

        <Select
          label="Make"
          placeholder="Select make"
          value={vehicleData.make}
          onChange={(e) => handleInputChange("make", e.target.value)}
          options={makes.map((make) => ({ value: make, label: make }))}
        />

        <Input
          label="Model"
          type="text"
          placeholder="e.g., Cascadia"
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
        />

        <Input
          label="VIN (Optional)"
          type="text"
          placeholder="17-digit VIN"
          value={vehicleData.vin}
          onChange={(e) => handleInputChange("vin", e.target.value)}
        />
      </div>

      {/* Equipment Types */}
      <div>
        <label className="block font-semibold text-gray-700 mb-3">
          Equipment Types (Select all that apply)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {equipmentTypes.map((equipment) => (
            <button
              key={equipment}
              type="button"
              onClick={() => toggleEquipment(equipment)}
              className={`px-3 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
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
