/**
 * NHTSA VIN Decode Service
 *
 * Provides vehicle information lookup using the free NHTSA vPIC API.
 * No API key required. Rate limit: 5 requests per second.
 *
 * API Documentation: https://vpic.nhtsa.dot.gov/api/
 */
/**
 * Decoded vehicle information from VIN
 */
export interface VehicleInfo {
    vin: string;
    year: number | null;
    make: string | null;
    model: string | null;
    trim: string | null;
    vehicleType: string | null;
    bodyClass: string | null;
    driveType: string | null;
    fuelType: string | null;
    engineCylinders: number | null;
    engineDisplacement: string | null;
    transmissionType: string | null;
    gvwr: string | null;
    gcwr: string | null;
    wheelBase: string | null;
    numberOfDoors: number | null;
    plantCountry: string | null;
    plantCity: string | null;
    manufacturer: string | null;
    errorCode: string | null;
    errorText: string | null;
}
/**
 * Validate VIN format (17 characters, no I, O, Q)
 */
export declare function validateVIN(vin: string): {
    valid: boolean;
    error?: string;
};
/**
 * Decode a VIN using NHTSA API
 */
export declare function decodeVIN(vin: string): Promise<VehicleInfo>;
/**
 * Decode VIN with model year hint (more accurate for older vehicles)
 */
export declare function decodeVINWithYear(vin: string, modelYear: number): Promise<VehicleInfo>;
/**
 * Get available vehicle makes for a specific year
 */
export declare function getVehicleMakes(year: number): Promise<string[]>;
/**
 * Map NHTSA vehicle type to our internal equipment types
 */
export declare function mapToEquipmentType(vehicleInfo: VehicleInfo): string;
//# sourceMappingURL=vin.service.d.ts.map