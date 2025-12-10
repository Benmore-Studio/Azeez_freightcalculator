import { VehicleType, EquipmentType, FuelType } from '../../../lib/generated/prisma/index.js';
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
export declare function createVehicle(userId: string, data: CreateVehicleInput): Promise<{
    model: string | null;
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    vin: string | null;
    year: number | null;
    make: string | null;
    vehicleType: import("../../../lib/generated/prisma/index.js").$Enums.VehicleType;
    equipmentType: import("../../../lib/generated/prisma/index.js").$Enums.EquipmentType;
    fuelType: import("../../../lib/generated/prisma/index.js").$Enums.FuelType;
    mpg: import("../../../lib/generated/prisma/runtime/library.js").Decimal | null;
    axleCount: number;
    hasSleeper: boolean;
    payloadCapacity: number | null;
    grossVehicleWeight: number | null;
    isPrimary: boolean;
}>;
/**
 * Get all vehicles for a user
 */
export declare function getUserVehicles(userId: string, includeInactive?: boolean): Promise<{
    model: string | null;
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    vin: string | null;
    year: number | null;
    make: string | null;
    vehicleType: import("../../../lib/generated/prisma/index.js").$Enums.VehicleType;
    equipmentType: import("../../../lib/generated/prisma/index.js").$Enums.EquipmentType;
    fuelType: import("../../../lib/generated/prisma/index.js").$Enums.FuelType;
    mpg: import("../../../lib/generated/prisma/runtime/library.js").Decimal | null;
    axleCount: number;
    hasSleeper: boolean;
    payloadCapacity: number | null;
    grossVehicleWeight: number | null;
    isPrimary: boolean;
}[]>;
/**
 * Get a single vehicle by ID
 */
export declare function getVehicleById(userId: string, vehicleId: string): Promise<{
    model: string | null;
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    vin: string | null;
    year: number | null;
    make: string | null;
    vehicleType: import("../../../lib/generated/prisma/index.js").$Enums.VehicleType;
    equipmentType: import("../../../lib/generated/prisma/index.js").$Enums.EquipmentType;
    fuelType: import("../../../lib/generated/prisma/index.js").$Enums.FuelType;
    mpg: import("../../../lib/generated/prisma/runtime/library.js").Decimal | null;
    axleCount: number;
    hasSleeper: boolean;
    payloadCapacity: number | null;
    grossVehicleWeight: number | null;
    isPrimary: boolean;
}>;
/**
 * Update a vehicle
 */
export declare function updateVehicle(userId: string, vehicleId: string, data: UpdateVehicleInput): Promise<{
    model: string | null;
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    vin: string | null;
    year: number | null;
    make: string | null;
    vehicleType: import("../../../lib/generated/prisma/index.js").$Enums.VehicleType;
    equipmentType: import("../../../lib/generated/prisma/index.js").$Enums.EquipmentType;
    fuelType: import("../../../lib/generated/prisma/index.js").$Enums.FuelType;
    mpg: import("../../../lib/generated/prisma/runtime/library.js").Decimal | null;
    axleCount: number;
    hasSleeper: boolean;
    payloadCapacity: number | null;
    grossVehicleWeight: number | null;
    isPrimary: boolean;
}>;
/**
 * Delete a vehicle (soft delete by setting isActive to false)
 */
export declare function deleteVehicle(userId: string, vehicleId: string): Promise<{
    message: string;
}>;
/**
 * Get vehicle type defaults
 */
export declare function getVehicleDefaults(vehicleType?: VehicleType): {
    mpg: number;
    axleCount: number;
    payloadCapacity: number;
} | Record<import("../../../lib/generated/prisma/index.js").$Enums.VehicleType, {
    mpg: number;
    axleCount: number;
    payloadCapacity: number;
}>;
/**
 * Set a vehicle as primary
 */
export declare function setVehicleAsPrimary(userId: string, vehicleId: string): Promise<{
    model: string | null;
    name: string;
    id: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    vin: string | null;
    year: number | null;
    make: string | null;
    vehicleType: import("../../../lib/generated/prisma/index.js").$Enums.VehicleType;
    equipmentType: import("../../../lib/generated/prisma/index.js").$Enums.EquipmentType;
    fuelType: import("../../../lib/generated/prisma/index.js").$Enums.FuelType;
    mpg: import("../../../lib/generated/prisma/runtime/library.js").Decimal | null;
    axleCount: number;
    hasSleeper: boolean;
    payloadCapacity: number | null;
    grossVehicleWeight: number | null;
    isPrimary: boolean;
}>;
//# sourceMappingURL=vehicle.service.d.ts.map