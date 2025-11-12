"use client";

import React, { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { FaArrowRightLong, FaTruck, FaRoute } from "react-icons/fa6";
import { FaInfoCircle } from "react-icons/fa";
import { TbLocation, TbCube } from "react-icons/tb";
import { MdCallSplit } from "react-icons/md";
import { Input, Select, Button, Checkbox } from "@/components/ui";

export default function RatecalclocationEnhanced({ setStage, savedVehicles = [], savedTrips = [] }) {
  const [loadtype, setLoadtype] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedTrip, setSelectedTrip] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    deadheadMiles: "",
  });

  // Handle vehicle selection
  const handleVehicleSelect = (e) => {
    const vehicleId = e.target.value;
    setSelectedVehicle(vehicleId);

    if (vehicleId) {
      const vehicle = savedVehicles.find((v) => v.id === parseInt(vehicleId));
      if (vehicle) {
        // Pre-fill equipment type based on vehicle
        console.log("Selected vehicle:", vehicle);
        setSelectedEquipment(vehicle.equipment || "");
      }
    } else {
      setSelectedEquipment("");
    }
  };

  // Handle trip selection
  const handleTripSelect = (e) => {
    const tripId = e.target.value;
    setSelectedTrip(tripId);

    if (tripId) {
      const trip = savedTrips.find((t) => t.id === parseInt(tripId));
      if (trip) {
        setFormData((prev) => ({
          ...prev,
          origin: trip.origin,
          destination: trip.destination,
        }));
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getSelectedVehicle = () => {
    if (!selectedVehicle) return null;
    return savedVehicles.find((v) => v.id === parseInt(selectedVehicle));
  };

  const selectedVehicleData = getSelectedVehicle();

  return (
    <div className="p-4">
      {/* Vehicle & Trip Selectors - Two Column on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Saved Vehicle Selector */}
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FaTruck className="text-blue-600 text-xl" />
            <h3 className="font-bold text-gray-900">Your Vehicles</h3>
          </div>
          <Select
            label="Select Your Vehicle (Optional)"
            placeholder="Choose from your saved vehicles"
            value={selectedVehicle}
            onChange={handleVehicleSelect}
            options={savedVehicles.map((vehicle) => ({
              value: vehicle.id,
              label: `${vehicle.name} - ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.mpg} MPG)`,
            }))}
          />
          {selectedVehicleData && (
            <div className="mt-3 bg-blue-50 rounded-md p-3 border border-blue-300">
              <div className="flex items-center gap-2 text-sm">
                <FaInfoCircle className="text-blue-600" />
                <span className="font-medium text-gray-900">
                  Using: {selectedVehicleData.name} • {selectedVehicleData.mpg} MPG
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Saved Trip Selector */}
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <FaRoute className="text-blue-600 text-xl" />
            <h3 className="font-bold text-gray-900">Recent Routes</h3>
          </div>
          <Select
            label="Load Previous Trip (Optional)"
            placeholder="Select a saved route"
            value={selectedTrip}
            onChange={handleTripSelect}
            options={savedTrips.map((trip) => ({
              value: trip.id,
              label: `${trip.name} - ${trip.origin} → ${trip.destination} (Used ${trip.usageCount}x)`,
            }))}
          />
        </div>
      </div>

      {/* Location Details Header */}
      <div className="flex gap-3 items-center mb-4">
        <IoLocationOutline size={25} className="text-blue-600" />
        <p className="text-xl font-semibold text-neutral-900">Location Details</p>
      </div>

      {/* Origin & Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Origin"
          type="text"
          placeholder="Chicago, IL or 60601"
          value={formData.origin}
          onChange={(e) => handleInputChange("origin", e.target.value)}
          helperText="Enter city, state or ZIP code"
          icon={<IoLocationOutline />}
        />
        <Input
          label="Destination"
          type="text"
          placeholder="Los Angeles, CA or 90001"
          value={formData.destination}
          onChange={(e) => handleInputChange("destination", e.target.value)}
          helperText="Enter city, state or ZIP code"
          icon={<IoLocationOutline />}
        />
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        <Checkbox label="Airport Pickup" />
        <Checkbox label="Airport Delivery" />
        <Checkbox label="Requires TSA Clearance" />
      </div>

      {/* Deadhead Miles & Load Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <FaArrowRightLong className="text-neutral-600" />
            <p className="font-semibold text-neutral-900">Deadhead Miles To Pickup</p>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0"
              value={formData.deadheadMiles}
              onChange={(e) => handleInputChange("deadheadMiles", e.target.value)}
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="sm"
              icon={<TbLocation size={18} />}
              iconPosition="left"
              className="whitespace-nowrap"
            >
              Use Location
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-semibold text-neutral-900">Load Type</p>
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => setLoadtype("Full Load")}
              className={`flex items-center px-3 py-2 gap-2 border-2 justify-center rounded-md cursor-pointer transition-all ${
                loadtype === "Full Load"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <TbCube size={18} className="text-blue-600" />
              <p className="text-sm">Full Load</p>
            </div>
            <div
              onClick={() => setLoadtype("LTL (Partial)")}
              className={`flex items-center px-3 py-2 gap-2 border-2 justify-center rounded-md cursor-pointer transition-all ${
                loadtype === "LTL (Partial)"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <MdCallSplit size={18} className="text-blue-600" />
              <p className="text-sm">LTL Partial</p>
            </div>
          </div>
        </div>
      </div>

      {/* LTL Notice */}
      {loadtype === "LTL (Partial)" && (
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <Checkbox
            label="Dedicated truck required for LTL pickup"
            description="If checked, the truck will be dedicated to your load only, at a higher rate."
          />
        </div>
      )}

      {/* Equipment Selection */}
      <div className="bg-white border-2 border-blue-200 p-4 rounded-lg mt-4">
        <Select
          label="Select Equipment for this load"
          placeholder="Choose equipment type"
          value={selectedEquipment}
          onChange={(e) => setSelectedEquipment(e.target.value)}
          options={[
            { value: "dry-van", label: "Dry Van" },
            { value: "refrigerated", label: "Refrigerated" },
            { value: "flatbed", label: "Flatbed" },
          ]}
          helperText={
            selectedVehicleData
              ? `Pre-filled from ${selectedVehicleData.name}`
              : "Selecting the right equipment helps calculate the most accurate rate"
          }
        />
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={() => setStage("Load Details")}
          size="lg"
        >
          Next: Load Details
        </Button>
      </div>
    </div>
  );
}
