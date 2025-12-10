"use client";

import React, { useState, useEffect } from "react";
import { FaGasPump, FaTools, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Truck, Package, Star } from "lucide-react";
import { Card, Button, Spinner } from "@/components/ui";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { showToast } from "@/lib/toast";
import { vehiclesApi } from "@/lib/api";
import { useRouter } from "next/navigation";

// Map vehicle types to display names and icons
const vehicleTypeMap = {
  semi: { display: "Semi Truck", icon: "truck" },
  box_truck: { display: "Box Truck", icon: "truck" },
  cargo_van: { display: "Cargo Van", icon: "van" },
  sprinter: { display: "Sprinter Van", icon: "van" },
  reefer: { display: "Reefer", icon: "truck" },
};

const fuelTypeMap = {
  diesel: "Diesel",
  gasoline: "Gasoline",
  cng: "CNG",
  lng: "LNG",
  electric: "Electric",
  hybrid: "Hybrid",
};

const equipmentTypeMap = {
  dry_van: "Dry Van",
  refrigerated: "Refrigerated",
  flatbed: "Flatbed",
  step_deck: "Step Deck",
  lowboy: "Lowboy",
  tanker: "Tanker",
  conestoga: "Conestoga",
  specialized: "Specialized",
};

export default function VehiclesPage() {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, vehicleId: null });
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch vehicles on mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const data = await vehiclesApi.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      showToast.error("Failed to load vehicles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (vehicleId) => {
    showToast.info("Edit modal coming soon");
    // TODO: Open edit modal with vehicle data
  };

  const handleDelete = (vehicleId) => {
    setDeleteConfirm({ isOpen: true, vehicleId });
  };

  const confirmDelete = async () => {
    try {
      await vehiclesApi.deleteVehicle(deleteConfirm.vehicleId);
      setVehicles(vehicles.filter((v) => v.id !== deleteConfirm.vehicleId));
      showToast.success("Vehicle deleted successfully");
    } catch (error) {
      console.error("Failed to delete vehicle:", error);
      showToast.error("Failed to delete vehicle");
    } finally {
      setDeleteConfirm({ isOpen: false, vehicleId: null });
    }
  };

  const handleAddVehicle = () => {
    showToast.info("Add vehicle modal coming soon");
    // TODO: Open add vehicle modal
  };

  const handleUseInCalculator = (vehicleId) => {
    router.push(`/calculator?vehicleId=${vehicleId}`);
  };

  const handleSetPrimary = async (vehicleId) => {
    try {
      await vehiclesApi.setVehicleAsPrimary(vehicleId);
      await fetchVehicles(); // Refresh to get updated primary status
      showToast.success("Primary vehicle updated");
    } catch (error) {
      console.error("Failed to set primary vehicle:", error);
      showToast.error("Failed to update primary vehicle");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading vehicles...</p>
        </div>
      </div>
    );
  }

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
              const typeInfo = vehicleTypeMap[vehicle.vehicleType] || { display: vehicle.vehicleType, icon: "truck" };
              const VehicleIcon = typeInfo.icon === "van" ? Package : Truck;

              return (
                <Card
                  key={vehicle.id}
                  className={`p-6 bg-white border-2 hover:shadow-md transition-all group relative ${
                    vehicle.isPrimary ? "border-blue-400" : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  {/* Primary Badge */}
                  {vehicle.isPrimary && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      <Star size={12} fill="currentColor" />
                      Primary
                    </div>
                  )}

                  {/* Vehicle Icon/Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-100 p-4 rounded-lg">
                      <VehicleIcon className="text-blue-600" size={32} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!vehicle.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(vehicle.id)}
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                          title="Set as primary"
                        >
                          <Star size={16} />
                        </button>
                      )}
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
                      {vehicle.year ? `${vehicle.year} ` : ""}{vehicle.make || ""} {vehicle.model || ""}
                    </p>
                    <p className="text-xs text-gray-600">{typeInfo.display}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 pt-2">
                      {vehicle.mpg && (
                        <div className="flex items-center gap-1.5">
                          <FaGasPump className="text-gray-400" />
                          <span>{Number(vehicle.mpg).toFixed(1)} MPG</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <FaTools className="text-gray-400" />
                        <span>{equipmentTypeMap[vehicle.equipmentType] || vehicle.equipmentType}</span>
                      </div>
                    </div>

                    {/* Equipment Tag */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {equipmentTypeMap[vehicle.equipmentType] || vehicle.equipmentType}
                      </span>
                    </div>

                    {/* Fuel Type Badge */}
                    <div className="pt-2">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        {fuelTypeMap[vehicle.fuelType] || vehicle.fuelType}
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
