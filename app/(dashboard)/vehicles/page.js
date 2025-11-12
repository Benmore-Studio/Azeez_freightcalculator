"use client";

import React, { useState } from "react";
import { FaGasPump, FaTools, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Truck, Package } from "lucide-react";
import { Card, Button } from "@/components/ui";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { showToast } from "@/lib/toast";

export default function VehiclesPage() {
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, vehicleId: null });

  // Mock data - will be replaced with actual data from backend
  const [vehicles, setVehicles] = useState([
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
    {
      id: 3,
      name: "Secondary Truck",
      type: "Semi Truck",
      year: 2019,
      make: "Volvo",
      model: "VNL 760",
      mpg: 6.8,
      fuelType: "Diesel",
      equipment: ["Flatbed", "Dry Van"],
      iconType: "truck",
    },
  ]);

  const handleEdit = (vehicleId) => {
    showToast.info("Edit modal coming soon");
    // TODO: Open edit modal with vehicle data
  };

  const handleDelete = (vehicleId) => {
    setDeleteConfirm({ isOpen: true, vehicleId });
  };

  const confirmDelete = () => {
    setVehicles(vehicles.filter((v) => v.id !== deleteConfirm.vehicleId));
    showToast.success("Vehicle deleted successfully");
    // TODO: Delete vehicle from backend
  };

  const handleAddVehicle = () => {
    showToast.info("Add vehicle modal coming soon");
    // TODO: Open add vehicle modal
  };

  const handleUseInCalculator = (vehicleId) => {
    showToast.info("Calculator integration coming soon");
    // TODO: Navigate to calculator with vehicle pre-selected
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Your Vehicles
            </h1>
            <p className="text-gray-600">
              Manage your fleet ({vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} registered)
            </p>
          </div>
          <Button
            icon={<FaPlus />}
            iconPosition="left"
            onClick={handleAddVehicle}
          >
            Add Vehicle
          </Button>
        </div>

        {/* Vehicles Grid */}
        {vehicles.length === 0 ? (
          <Card className="p-12 text-center bg-white border-2 border-gray-200">
            <div className="text-gray-400 mb-3">
              <Truck className="mx-auto" size={64} />
            </div>
            <p className="text-gray-600 font-medium mb-1">No vehicles yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Add your first vehicle to get accurate rate calculations
            </p>
            <Button onClick={handleAddVehicle}>
              Add Your First Vehicle
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => {
              const VehicleIcon = vehicle.iconType === "van" ? Package : Truck;

              return (
                <Card
                  key={vehicle.id}
                  className="p-6 bg-white border-2 border-gray-200 hover:border-blue-200 hover:shadow-md transition-all group relative"
                >
                  {/* Vehicle Icon/Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <VehicleIcon className="text-blue-600" size={32} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(vehicle.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit vehicle"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete vehicle"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-gray-900 text-xl">{vehicle.name}</h3>
                    <p className="text-sm text-gray-700 font-medium">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-xs text-gray-600">{vehicle.type}</p>

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
                  <button
                    onClick={() => handleUseInCalculator(vehicle.id)}
                    className="w-full mt-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium text-sm transition-colors"
                  >
                    Use in Calculator
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, vehicleId: null })}
        onConfirm={confirmDelete}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
