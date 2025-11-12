"use client";

import React from "react";
import { FaTruck, FaGasPump, FaTools, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Truck, Package } from "lucide-react";
import { Card, Button } from "@/components/ui";

export default function SavedVehicles() {
  // Mock data - will be replaced with actual data from backend
  const vehicles = [
    {
      id: 1,
      name: "Main Truck",
      type: "Semi Truck",
      year: 2020,
      make: "Freightliner",
      model: "Cascadia",
      mpg: 6.5,
      fuelType: "Diesel",
      equipment: ["Dry Van", "Refrigerated"],
      iconType: "truck",
    },
    {
      id: 2,
      name: "Backup Van",
      type: "Sprinter Van",
      year: 2021,
      make: "Mercedes",
      model: "Sprinter 2500",
      mpg: 18.0,
      fuelType: "Diesel",
      equipment: ["Cargo Van"],
      iconType: "van",
    },
  ];

  const handleEdit = (vehicleId) => {
    console.log(`Edit vehicle ${vehicleId} - modal to be implemented`);
    // TODO: Implement edit vehicle modal
  };

  const handleDelete = (vehicleId) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      console.log(`Delete vehicle ${vehicleId} - to be implemented`);
      // TODO: Implement delete vehicle functionality
    }
  };

  const handleAddVehicle = () => {
    console.log("Add vehicle modal - to be implemented");
    // TODO: Implement add vehicle modal
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Your Vehicles</h2>
          <p className="text-sm text-gray-600 mt-1">
            {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Button
          size="sm"
          icon={<FaPlus />}
          iconPosition="left"
          onClick={handleAddVehicle}
        >
          Add Vehicle
        </Button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-3">
            <FaTruck className="mx-auto text-5xl" />
          </div>
          <p className="text-gray-600 font-medium mb-1">No vehicles yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Add your first vehicle to get accurate rate calculations
          </p>
          <Button size="sm" onClick={handleAddVehicle}>
            Add Your First Vehicle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => {
            const VehicleIcon = vehicle.iconType === "van" ? Package : Truck;
            return (
              <div
                key={vehicle.id}
                className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition-all group relative"
              >
                {/* Vehicle Icon/Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <VehicleIcon className="text-blue-600" size={28} />
                  </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(vehicle.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit vehicle"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete vehicle"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 text-lg">{vehicle.name}</h3>
                <p className="text-sm text-gray-700 font-medium">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-600 pt-2">
                  <div className="flex items-center gap-1.5">
                    <FaGasPump className="text-gray-400" />
                    <span>{vehicle.mpg} MPG</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaTools className="text-gray-400" />
                    <span>{vehicle.equipment.length} equipment</span>
                  </div>
                </div>

                {/* Equipment Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {vehicle.equipment.map((equip, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                    >
                      {equip}
                    </span>
                  ))}
                </div>

                {/* Fuel Type Badge */}
                <div className="pt-2">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {vehicle.fuelType}
                  </span>
                </div>
              </div>

              {/* Quick Action Button */}
              <button className="w-full mt-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md font-medium text-sm transition-colors">
                Use in Calculator
              </button>
            </div>
          );
          })}
        </div>
      )}
    </Card>
  );
}
