"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaTruck, FaSearch, FaCheck } from "react-icons/fa";
import { Truck, Package } from "lucide-react";
import { Button, Input, Select, Spinner } from "@/components/ui";
import { vehiclesApi } from "@/lib/api";
import { decodeVin, isValidVinFormat } from "@/lib/vinDecoder";
import { showToast } from "@/lib/toast";

const vehicleTypes = [
  { value: "semi", label: "Semi Truck" },
  { value: "box_truck", label: "Box Truck" },
  { value: "cargo_van", label: "Cargo Van" },
  { value: "sprinter", label: "Sprinter Van" },
  { value: "reefer", label: "Reefer" },
];

const equipmentTypes = [
  { value: "dry_van", label: "Dry Van" },
  { value: "refrigerated", label: "Refrigerated" },
  { value: "flatbed", label: "Flatbed" },
  { value: "step_deck", label: "Step Deck" },
  { value: "lowboy", label: "Lowboy" },
  { value: "tanker", label: "Tanker" },
  { value: "conestoga", label: "Conestoga" },
  { value: "specialized", label: "Specialized" },
];

const fuelTypes = [
  { value: "diesel", label: "Diesel" },
  { value: "gasoline", label: "Gasoline" },
  { value: "cng", label: "CNG" },
  { value: "lng", label: "LNG" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
];

const initialFormData = {
  name: "",
  vehicleType: "",
  year: "",
  make: "",
  model: "",
  vin: "",
  equipmentType: "",
  fuelType: "diesel",
  mpg: "",
};

export default function VehicleModal({ isOpen, onClose, vehicle = null, onSuccess }) {
  const isEditMode = !!vehicle;
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isDecodingVin, setIsDecodingVin] = useState(false);
  const [vinDecoded, setVinDecoded] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes or vehicle changes
  useEffect(() => {
    if (isOpen) {
      if (vehicle) {
        // Edit mode - populate with existing data
        setFormData({
          name: vehicle.name || "",
          vehicleType: vehicle.vehicleType || "",
          year: vehicle.year || "",
          make: vehicle.make || "",
          model: vehicle.model || "",
          vin: vehicle.vin || "",
          equipmentType: vehicle.equipmentType || "",
          fuelType: vehicle.fuelType || "diesel",
          mpg: vehicle.mpg || "",
        });
      } else {
        // Add mode - reset form
        setFormData(initialFormData);
      }
      setErrors({});
      setVinDecoded(false);
    }
  }, [isOpen, vehicle]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    // Reset VIN decoded state if VIN changes
    if (field === "vin") {
      setVinDecoded(false);
    }
  };

  const handleDecodeVin = async () => {
    const vin = formData.vin.trim().toUpperCase();

    if (!vin) {
      showToast.error("Please enter a VIN");
      return;
    }

    if (!isValidVinFormat(vin)) {
      showToast.error("Invalid VIN format. VIN must be 17 characters.");
      return;
    }

    setIsDecodingVin(true);

    try {
      const result = await decodeVin(vin);

      if (result.success) {
        const { data } = result;
        setFormData((prev) => ({
          ...prev,
          vin: vin,
          year: data.year || prev.year,
          make: data.make || prev.make,
          model: data.model || prev.model,
          vehicleType: data.type || prev.vehicleType,
          fuelType: data.fuelType?.toLowerCase() || prev.fuelType,
        }));
        setVinDecoded(true);

        // Build success message with detected info
        const details = [];
        if (data.year) details.push(data.year);
        if (data.make) details.push(data.make);
        if (data.model) details.push(data.model);
        const detailStr = details.length > 0 ? `: ${details.join(" ")}` : "";
        showToast.success(`VIN decoded successfully${detailStr}`);
      } else {
        showToast.error(result.error || "Failed to decode VIN");
      }
    } catch (error) {
      showToast.error("Failed to decode VIN");
    } finally {
      setIsDecodingVin(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vehicle name is required";
    }
    if (!formData.vehicleType) {
      newErrors.vehicleType = "Vehicle type is required";
    }
    if (!formData.equipmentType) {
      newErrors.equipmentType = "Equipment type is required";
    }
    if (formData.mpg && (isNaN(formData.mpg) || Number(formData.mpg) <= 0)) {
      newErrors.mpg = "MPG must be a positive number";
    }
    if (formData.year && (isNaN(formData.year) || Number(formData.year) < 1900 || Number(formData.year) > new Date().getFullYear() + 1)) {
      newErrors.year = "Please enter a valid year";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        vehicleType: formData.vehicleType,
        year: formData.year || null,
        make: formData.make.trim() || null,
        model: formData.model.trim() || null,
        vin: formData.vin.trim().toUpperCase() || null,
        equipmentType: formData.equipmentType,
        fuelType: formData.fuelType,
        mpg: formData.mpg ? Number(formData.mpg) : null,
      };

      if (isEditMode) {
        await vehiclesApi.updateVehicle(vehicle.id, payload);
        showToast.success("Vehicle updated successfully!");
      } else {
        await vehiclesApi.createVehicle(payload);
        showToast.success("Vehicle added successfully!");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Vehicle save error:", error);
      showToast.error(error.message || `Failed to ${isEditMode ? "update" : "add"} vehicle`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Truck className="text-blue-600" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? "Edit Vehicle" : "Add New Vehicle"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* VIN Decoder Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              VIN (Optional) - Auto-fill vehicle details
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter 17-character VIN"
                value={formData.vin}
                onChange={(e) => handleInputChange("vin", e.target.value.toUpperCase())}
                className="flex-1 uppercase"
                maxLength={17}
              />
              <Button
                onClick={handleDecodeVin}
                variant="secondary"
                disabled={isDecodingVin || !formData.vin.trim()}
                icon={isDecodingVin ? <Spinner size="sm" /> : <FaSearch />}
                iconPosition="left"
              >
                {isDecodingVin ? "Decoding..." : "Decode"}
              </Button>
            </div>
            {vinDecoded && (
              <p className="text-sm text-blue-700 mt-2 flex items-center gap-1">
                <FaCheck className="text-blue-600" size={12} /> Vehicle details auto-filled from VIN
              </p>
            )}
          </div>

          {/* Vehicle Name */}
          <div>
            <Input
              label="Vehicle Name *"
              placeholder="e.g., My Semi Truck, Fleet Unit #12"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
            />
          </div>

          {/* Vehicle Type & Equipment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Vehicle Type *"
                placeholder="Select vehicle type"
                value={formData.vehicleType}
                onChange={(e) => handleInputChange("vehicleType", e.target.value)}
                options={vehicleTypes}
                error={errors.vehicleType}
              />
            </div>
            <div>
              <Select
                label="Equipment Type *"
                placeholder="Select equipment type"
                value={formData.equipmentType}
                onChange={(e) => handleInputChange("equipmentType", e.target.value)}
                options={equipmentTypes}
                error={errors.equipmentType}
              />
            </div>
          </div>

          {/* Year, Make, Model */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                label="Year"
                placeholder="e.g., 2022"
                value={formData.year}
                onChange={(e) => handleInputChange("year", e.target.value)}
                error={errors.year}
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>
            <div>
              <Input
                label="Make"
                placeholder="e.g., Freightliner"
                value={formData.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Model"
                placeholder="e.g., Cascadia"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
              />
            </div>
          </div>

          {/* Fuel Type & MPG */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Fuel Type"
                value={formData.fuelType}
                onChange={(e) => handleInputChange("fuelType", e.target.value)}
                options={fuelTypes}
              />
            </div>
            <div>
              <Input
                label="Fuel Economy (MPG)"
                placeholder="e.g., 6.5"
                value={formData.mpg}
                onChange={(e) => handleInputChange("mpg", e.target.value)}
                error={errors.mpg}
                type="number"
                step="0.1"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                {isEditMode ? "Saving..." : "Adding..."}
              </>
            ) : (
              isEditMode ? "Save Changes" : "Add Vehicle"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
