"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Truck,
  Route,
  Package,
  Calendar,
  Clock,
  Zap,
  Users,
  Settings,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { FaTruck, FaRoute } from "react-icons/fa6";
import { TbCube } from "react-icons/tb";
import { MdCallSplit } from "react-icons/md";
import {
  Input,
  Select,
  Button,
  Checkbox,
  CollapsibleSection,
} from "@/components/ui";
import { useAppContext } from "@/context/AppContext";

/**
 * RouteAndLoad - Stage 1 of the simplified 2-stage calculator
 * Consolidates: Location, Load Details, Service Options
 */
export default function RouteAndLoad({
  onNext,
  savedVehicles = [],
  savedTrips = [],
}) {
  const { calculatorData, updateCalculatorData, userSettings } = useAppContext();

  // Core required fields
  const [formData, setFormData] = useState({
    origin: calculatorData.origin || "",
    destination: calculatorData.destination || "",
    vehicleId: calculatorData.vehicleId || "",
    equipmentType: calculatorData.equipmentType || "dry_van",
    weight: calculatorData.weight || "",
    deliveryDate: calculatorData.deliveryDate || "",
    deliveryTime: calculatorData.deliveryTime || "morning",
  });

  // Service options (with smart defaults)
  const [serviceOptions, setServiceOptions] = useState({
    deliveryUrgency: calculatorData.deliveryUrgency || "standard",
    driverType: calculatorData.driverType || "solo",
    specialEquipment: calculatorData.specialEquipment || [],
  });

  // Advanced options (rarely needed)
  const [advancedOptions, setAdvancedOptions] = useState({
    deadheadMiles: calculatorData.deadheadMiles || "",
    loadType: calculatorData.loadType || "full_load",
    distributionCenter: calculatorData.distributionCenter || false,
    freightClass: calculatorData.freightClass || "general",
    requiresEndorsement: calculatorData.requiresEndorsement || false,
    militaryAccess: calculatorData.militaryAccess || false,
  });

  // Get selected vehicle data
  const selectedVehicle = useMemo(() => {
    if (!formData.vehicleId) return null;
    return savedVehicles.find((v) => v.id === parseInt(formData.vehicleId));
  }, [formData.vehicleId, savedVehicles]);

  // Auto-fill equipment from vehicle
  useEffect(() => {
    const equipment = selectedVehicle?.equipmentType || selectedVehicle?.equipment;
    if (equipment) {
      const equipmentMap = {
        "Dry Van": "dry_van",
        "Refrigerated": "refrigerated",
        "Flatbed": "flatbed",
        "dry-van": "dry_van",
        "dry_van": "dry_van",
        "reefer": "refrigerated",
        "refrigerated": "refrigerated",
        "flatbed": "flatbed",
      };
      const mappedEquipment = equipmentMap[equipment] || equipment;
      setFormData((prev) => ({ ...prev, equipmentType: mappedEquipment }));
    }
  }, [selectedVehicle]);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle service option changes
  const handleServiceChange = (field, value) => {
    setServiceOptions((prev) => ({ ...prev, [field]: value }));
  };

  // Handle special equipment toggle
  const toggleSpecialEquipment = (item) => {
    setServiceOptions((prev) => {
      const current = prev.specialEquipment;
      if (current.includes(item)) {
        return { ...prev, specialEquipment: current.filter((i) => i !== item) };
      }
      return { ...prev, specialEquipment: [...current, item] };
    });
  };

  // Handle advanced option changes
  const handleAdvancedChange = (field, value) => {
    setAdvancedOptions((prev) => ({ ...prev, [field]: value }));
  };

  // Get trip to auto-fill origin/destination
  const handleTripSelect = (tripId) => {
    const trip = savedTrips.find((t) => t.id === parseInt(tripId));
    if (trip) {
      setFormData((prev) => ({
        ...prev,
        origin: trip.origin,
        destination: trip.destination,
      }));
    }
  };

  // Validate required fields
  const canProceed = useMemo(() => {
    return formData.origin.trim() && formData.destination.trim();
  }, [formData.origin, formData.destination]);

  // Count selected service options for badge
  const serviceOptionsCount = useMemo(() => {
    let count = 0;
    if (serviceOptions.deliveryUrgency !== "standard") count++;
    if (serviceOptions.driverType !== "solo") count++;
    if (serviceOptions.specialEquipment.length > 0) count += serviceOptions.specialEquipment.length;
    return count;
  }, [serviceOptions]);

  // Count advanced options for badge
  const advancedOptionsCount = useMemo(() => {
    let count = 0;
    if (advancedOptions.deadheadMiles) count++;
    if (advancedOptions.loadType !== "full_load") count++;
    if (advancedOptions.distributionCenter) count++;
    if (advancedOptions.freightClass !== "general") count++;
    if (advancedOptions.requiresEndorsement) count++;
    if (advancedOptions.militaryAccess) count++;
    return count;
  }, [advancedOptions]);

  // Get user's custom multipliers if available
  const urgencyMultipliers = useMemo(() => {
    if (userSettings?.expediteMultiplier) {
      return {
        standard: 1.0,
        express: userSettings.expediteMultiplier || 1.15,
        rush: userSettings.rushMultiplier || 1.30,
        same_day: userSettings.sameDayMultiplier || 1.50,
      };
    }
    return { standard: 1.0, express: 1.15, rush: 1.30, same_day: 1.50 };
  }, [userSettings]);

  const teamMultiplier = userSettings?.teamMultiplier || 1.50;

  // Handle form submission
  const handleSubmit = () => {
    // Map vehicle type (handle both dash and underscore formats)
    const vehicleTypeMap = {
      "semi-truck": "semi_truck",
      "semi_truck": "semi_truck",
      "sprinter-van": "sprinter_van",
      "sprinter_van": "sprinter_van",
      "box-truck": "box_truck",
      "box_truck": "box_truck",
      "cargo-van": "cargo_van",
      "cargo_van": "cargo_van",
    };

    const vehicleType = selectedVehicle
      ? vehicleTypeMap[selectedVehicle.type] || selectedVehicle.type || "semi_truck"
      : "semi_truck";

    // Save all data to context
    updateCalculatorData({
      // Core fields
      origin: formData.origin,
      destination: formData.destination,
      vehicleId: formData.vehicleId ? parseInt(formData.vehicleId) : null,
      vehicleType,
      equipmentType: formData.equipmentType,
      weight: parseInt(formData.weight) || 0,
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      // Service options
      deliveryUrgency: serviceOptions.deliveryUrgency,
      driverType: serviceOptions.driverType,
      specialEquipment: serviceOptions.specialEquipment,
      // Advanced options
      deadheadMiles: parseInt(advancedOptions.deadheadMiles) || 0,
      loadType: advancedOptions.loadType,
      distributionCenter: advancedOptions.distributionCenter,
      freightClass: advancedOptions.freightClass,
      requiresEndorsement: advancedOptions.requiresEndorsement,
      militaryAccess: advancedOptions.militaryAccess,
    });

    onNext();
  };

  return (
    <div className="p-4 space-y-6">
      {/* ===== VEHICLE DISPLAY ===== */}
      {selectedVehicle ? (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Truck className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Calculating for:</p>
              <p className="text-lg font-bold text-gray-900">
                {selectedVehicle.name}
                {selectedVehicle.year && ` (${selectedVehicle.year} ${selectedVehicle.make || ""} ${selectedVehicle.model || ""})`}
              </p>
              <div className="flex flex-wrap gap-4 mt-1 text-sm">
                {selectedVehicle.mpg && (
                  <span className="text-gray-600">
                    <span className="font-medium">MPG:</span>{" "}
                    <span className="text-blue-700 font-bold">{selectedVehicle.mpg}</span>
                  </span>
                )}
                {(selectedVehicle.equipmentType || selectedVehicle.equipment) && (
                  <span className="text-gray-600">
                    <span className="font-medium">Equipment:</span>{" "}
                    <span className="text-gray-900 font-bold">{selectedVehicle.equipmentType || selectedVehicle.equipment}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Truck className="text-gray-400" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">No Vehicle Selected</p>
              <p className="text-sm text-gray-500">
                Select a vehicle below for personalized rate calculations
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===== VEHICLE & TRIP SELECTORS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Select
          label="Your Vehicles"
          placeholder="Select a saved vehicle"
          value={formData.vehicleId}
          onChange={(e) => handleChange("vehicleId", e.target.value)}
          options={savedVehicles.map((v) => ({
            value: v.id,
            label: `${v.name}${v.mpg ? ` (${v.mpg} MPG)` : ""}`,
          }))}
          icon={<FaTruck className="text-blue-600" />}
        />
        <Select
          label="Recent Routes"
          placeholder="Load a saved route"
          value=""
          onChange={(e) => handleTripSelect(e.target.value)}
          options={savedTrips.map((t) => ({
            value: t.id,
            label: `${t.origin} → ${t.destination}`,
          }))}
          icon={<FaRoute className="text-blue-600" />}
        />
      </div>

      {/* ===== ROUTE SECTION ===== */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900">Route</h3>
          <span className="text-red-500 text-sm">*Required</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Origin"
            placeholder="Chicago, IL or 60601"
            value={formData.origin}
            onChange={(e) => handleChange("origin", e.target.value)}
            helperText="City, state or ZIP code"
            required
          />
          <Input
            label="Destination"
            placeholder="Los Angeles, CA or 90001"
            value={formData.destination}
            onChange={(e) => handleChange("destination", e.target.value)}
            helperText="City, state or ZIP code"
            required
          />
        </div>
      </div>

      {/* ===== LOAD & SCHEDULE SECTION ===== */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Package className="text-blue-600" size={20} />
          <h3 className="font-semibold text-gray-900">Load & Schedule</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Equipment Type"
            value={formData.equipmentType}
            onChange={(e) => handleChange("equipmentType", e.target.value)}
            options={[
              { value: "dry_van", label: "Dry Van" },
              { value: "refrigerated", label: "Refrigerated" },
              { value: "flatbed", label: "Flatbed" },
            ]}
            helperText={selectedVehicle ? "From vehicle" : ""}
          />
          <Input
            label="Load Weight"
            type="number"
            placeholder="25000"
            value={formData.weight}
            onChange={(e) => handleChange("weight", e.target.value)}
            helperText="Pounds (optional)"
          />
          <Input
            label="Delivery Date"
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => handleChange("deliveryDate", e.target.value)}
            helperText="For weather forecast"
          />
          <Select
            label="Delivery Window"
            value={formData.deliveryTime}
            onChange={(e) => handleChange("deliveryTime", e.target.value)}
            options={[
              { value: "morning", label: "Morning (8AM-12PM)" },
              { value: "afternoon", label: "Afternoon (12PM-5PM)" },
              { value: "evening", label: "Evening (5PM-9PM)" },
            ]}
          />
        </div>
      </div>

      {/* ===== SERVICE OPTIONS (Collapsible) ===== */}
      <CollapsibleSection
        title="Service Options"
        description="Urgency, driver type, special equipment"
        icon={<Zap size={18} />}
        badge={serviceOptionsCount > 0 ? `${serviceOptionsCount} selected` : "Optional"}
        badgeColor={serviceOptionsCount > 0 ? "blue" : "gray"}
      >
        <div className="space-y-4">
          {/* Urgency */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Delivery Urgency</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: "standard", label: "Standard", mult: urgencyMultipliers.standard },
                { value: "express", label: "Express", mult: urgencyMultipliers.express },
                { value: "rush", label: "Rush", mult: urgencyMultipliers.rush },
                { value: "same_day", label: "Same Day", mult: urgencyMultipliers.same_day },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleServiceChange("deliveryUrgency", opt.value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    serviceOptions.deliveryUrgency === opt.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900">{opt.label}</p>
                  {opt.mult !== 1.0 && (
                    <p className="text-xs text-blue-600 mt-0.5">+{Math.round((opt.mult - 1) * 100)}%</p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Driver Type */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Driver Type</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleServiceChange("driverType", "solo")}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  serviceOptions.driverType === "solo"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-medium text-gray-900">Solo Driver</p>
                <p className="text-xs text-gray-500">Base rate</p>
              </button>
              <button
                type="button"
                onClick={() => handleServiceChange("driverType", "team")}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  serviceOptions.driverType === "team"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-medium text-gray-900">Team Drivers</p>
                <p className="text-xs text-blue-600">+{Math.round((teamMultiplier - 1) * 100)}%</p>
              </button>
            </div>
          </div>

          {/* Special Equipment */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Special Equipment</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: "liftgate", label: "Liftgate", fee: "$75" },
                { id: "pallet_jack", label: "Pallet Jack", fee: "$50" },
                { id: "straps", label: "Straps", fee: "" },
                { id: "tarps", label: "Tarps", fee: "" },
                { id: "temp_monitoring", label: "Temp Monitor", fee: "$25" },
                { id: "ramps", label: "Ramps", fee: "" },
                { id: "chains", label: "Chains", fee: "" },
                { id: "e_track", label: "E-Track", fee: "" },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                    serviceOptions.specialEquipment.includes(item.id)
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={serviceOptions.specialEquipment.includes(item.id)}
                    onChange={() => toggleSpecialEquipment(item.id)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    {item.fee && <p className="text-xs text-gray-500">{item.fee}</p>}
                  </div>
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      serviceOptions.specialEquipment.includes(item.id)
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {serviceOptions.specialEquipment.includes(item.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ===== ADVANCED OPTIONS (Collapsible) ===== */}
      <CollapsibleSection
        title="Advanced Options"
        description="Deadhead, load type, special requirements"
        icon={<Settings size={18} />}
        badge={advancedOptionsCount > 0 ? `${advancedOptionsCount} set` : "Optional"}
        badgeColor={advancedOptionsCount > 0 ? "orange" : "gray"}
      >
        <div className="space-y-4">
          {/* Deadhead & Load Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Deadhead Miles to Pickup"
              type="number"
              placeholder="0"
              value={advancedOptions.deadheadMiles}
              onChange={(e) => handleAdvancedChange("deadheadMiles", e.target.value)}
              helperText="Empty miles to reach pickup"
            />
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Load Type</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleAdvancedChange("loadType", "full_load")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    advancedOptions.loadType === "full_load"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <TbCube size={18} className="text-blue-600" />
                  <span className="text-sm font-medium">Full Load</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvancedChange("loadType", "ltl")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    advancedOptions.loadType === "ltl"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <MdCallSplit size={18} className="text-blue-600" />
                  <span className="text-sm font-medium">LTL/Partial</span>
                </button>
              </div>
            </div>
          </div>

          {/* Freight Class */}
          <Select
            label="Freight Class"
            value={advancedOptions.freightClass}
            onChange={(e) => handleAdvancedChange("freightClass", e.target.value)}
            options={[
              { value: "general", label: "General Freight (Dry Van)" },
              { value: "refrigerated", label: "Refrigerated (+15%)" },
              { value: "hazmat", label: "Hazardous Materials (+50%)" },
              { value: "oversized", label: "Oversized (+35%)" },
            ]}
          />

          {/* Special Requirements */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Special Requirements</p>
            <div className="space-y-2">
              <Checkbox
                label="Distribution Center Pickup/Delivery"
                description="Additional $75 fee for DC handling"
                checked={advancedOptions.distributionCenter}
                onChange={(e) => handleAdvancedChange("distributionCenter", e.target.checked)}
              />
              <Checkbox
                label="Requires Endorsement (Hazmat, Tanker)"
                description="Load requires special driver certifications"
                checked={advancedOptions.requiresEndorsement}
                onChange={(e) => handleAdvancedChange("requiresEndorsement", e.target.checked)}
              />
              <Checkbox
                label="Military/Restricted Access"
                description="Pickup or delivery at military or restricted facility"
                checked={advancedOptions.militaryAccess}
                onChange={(e) => handleAdvancedChange("militaryAccess", e.target.checked)}
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ===== NAVIGATION ===== */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button
          onClick={handleSubmit}
          size="lg"
          disabled={!canProceed}
          icon={<ChevronRight size={20} />}
          iconPosition="right"
        >
          Review & Calculate
        </Button>
      </div>
    </div>
  );
}
