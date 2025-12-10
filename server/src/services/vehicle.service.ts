import { prisma } from './prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { VehicleType, EquipmentType, FuelType } from '../../../lib/generated/prisma/index.js';

// Vehicle type defaults for new vehicles
const VEHICLE_DEFAULTS: Record<VehicleType, { mpg: number; axleCount: number; payloadCapacity: number }> = {
  semi: { mpg: 6.5, axleCount: 5, payloadCapacity: 45000 },
  box_truck: { mpg: 10, axleCount: 2, payloadCapacity: 10000 },
  cargo_van: { mpg: 18, axleCount: 2, payloadCapacity: 3000 },
  sprinter: { mpg: 20, axleCount: 2, payloadCapacity: 4500 },
  reefer: { mpg: 5.5, axleCount: 5, payloadCapacity: 42000 },
};

export interface CreateVehicleInput {
  name: string;
  vehicleType: VehicleType;
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  equipmentType?: EquipmentType;
  fuelType?: FuelType;
  mpg?: number;
  axleCount?: number;
  hasSleeper?: boolean;
  payloadCapacity?: number;
  grossVehicleWeight?: number;
  isPrimary?: boolean;
}

export interface UpdateVehicleInput extends Partial<CreateVehicleInput> {
  isActive?: boolean;
}

/**
 * Create a new vehicle for a user
 */
export async function createVehicle(userId: string, data: CreateVehicleInput) {
  // Get defaults for the vehicle type
  const defaults = VEHICLE_DEFAULTS[data.vehicleType];

  // If this is the first vehicle or isPrimary is true, handle primary logic
  if (data.isPrimary) {
    // Unset any existing primary vehicle
    await prisma.vehicle.updateMany({
      where: { userId, isPrimary: true },
      data: { isPrimary: false },
    });
  }

  // Check if this is the user's first vehicle
  const existingVehicles = await prisma.vehicle.count({ where: { userId } });
  const shouldBePrimary = data.isPrimary || existingVehicles === 0;

  const vehicle = await prisma.vehicle.create({
    data: {
      userId,
      name: data.name,
      vehicleType: data.vehicleType,
      vin: data.vin,
      year: data.year,
      make: data.make,
      model: data.model,
      equipmentType: data.equipmentType || 'dry_van',
      fuelType: data.fuelType || 'diesel',
      mpg: data.mpg ?? defaults.mpg,
      axleCount: data.axleCount ?? defaults.axleCount,
      hasSleeper: data.hasSleeper ?? false,
      payloadCapacity: data.payloadCapacity ?? defaults.payloadCapacity,
      grossVehicleWeight: data.grossVehicleWeight,
      isPrimary: shouldBePrimary,
    },
  });

  return vehicle;
}

/**
 * Get all vehicles for a user
 */
export async function getUserVehicles(userId: string, includeInactive = false) {
  const where: any = { userId };
  if (!includeInactive) {
    where.isActive = true;
  }

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: [
      { isPrimary: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return vehicles;
}

/**
 * Get a single vehicle by ID
 */
export async function getVehicleById(userId: string, vehicleId: string) {
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      userId,
    },
  });

  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  return vehicle;
}

/**
 * Update a vehicle
 */
export async function updateVehicle(userId: string, vehicleId: string, data: UpdateVehicleInput) {
  // Verify ownership
  const existing = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId },
  });

  if (!existing) {
    throw new ApiError(404, 'Vehicle not found');
  }

  // Handle primary vehicle logic
  if (data.isPrimary === true) {
    await prisma.vehicle.updateMany({
      where: { userId, isPrimary: true, id: { not: vehicleId } },
      data: { isPrimary: false },
    });
  }

  const vehicle = await prisma.vehicle.update({
    where: { id: vehicleId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.vehicleType !== undefined && { vehicleType: data.vehicleType }),
      ...(data.vin !== undefined && { vin: data.vin }),
      ...(data.year !== undefined && { year: data.year }),
      ...(data.make !== undefined && { make: data.make }),
      ...(data.model !== undefined && { model: data.model }),
      ...(data.equipmentType !== undefined && { equipmentType: data.equipmentType }),
      ...(data.fuelType !== undefined && { fuelType: data.fuelType }),
      ...(data.mpg !== undefined && { mpg: data.mpg }),
      ...(data.axleCount !== undefined && { axleCount: data.axleCount }),
      ...(data.hasSleeper !== undefined && { hasSleeper: data.hasSleeper }),
      ...(data.payloadCapacity !== undefined && { payloadCapacity: data.payloadCapacity }),
      ...(data.grossVehicleWeight !== undefined && { grossVehicleWeight: data.grossVehicleWeight }),
      ...(data.isPrimary !== undefined && { isPrimary: data.isPrimary }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  return vehicle;
}

/**
 * Delete a vehicle (soft delete by setting isActive to false)
 */
export async function deleteVehicle(userId: string, vehicleId: string) {
  const existing = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId },
  });

  if (!existing) {
    throw new ApiError(404, 'Vehicle not found');
  }

  // Soft delete
  await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { isActive: false, isPrimary: false },
  });

  // If this was the primary vehicle, set another one as primary
  if (existing.isPrimary) {
    const nextVehicle = await prisma.vehicle.findFirst({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (nextVehicle) {
      await prisma.vehicle.update({
        where: { id: nextVehicle.id },
        data: { isPrimary: true },
      });
    }
  }

  return { message: 'Vehicle deleted successfully' };
}

/**
 * Get vehicle type defaults
 */
export function getVehicleDefaults(vehicleType?: VehicleType) {
  if (vehicleType) {
    return VEHICLE_DEFAULTS[vehicleType];
  }
  return VEHICLE_DEFAULTS;
}

/**
 * Set a vehicle as primary
 */
export async function setVehicleAsPrimary(userId: string, vehicleId: string) {
  const existing = await prisma.vehicle.findFirst({
    where: { id: vehicleId, userId, isActive: true },
  });

  if (!existing) {
    throw new ApiError(404, 'Vehicle not found');
  }

  // Unset any existing primary
  await prisma.vehicle.updateMany({
    where: { userId, isPrimary: true },
    data: { isPrimary: false },
  });

  // Set new primary
  const vehicle = await prisma.vehicle.update({
    where: { id: vehicleId },
    data: { isPrimary: true },
  });

  return vehicle;
}
