/**
 * VIN Decoder Service
 * Uses backend API which calls NHTSA (National Highway Traffic Safety Administration)
 * to decode vehicle information from VIN numbers.
 */

import { vinApi } from "./api";

/**
 * Validates VIN format (17 characters, no I, O, Q)
 * @param {string} vin - Vehicle Identification Number
 * @returns {boolean} - Whether the VIN is valid format
 */
export function isValidVinFormat(vin) {
  if (!vin || typeof vin !== "string") return false;

  // VIN must be exactly 17 characters
  if (vin.length !== 17) return false;

  // VIN cannot contain I, O, or Q
  if (/[IOQ]/i.test(vin)) return false;

  // VIN must be alphanumeric
  if (!/^[A-HJ-NPR-Z0-9]+$/i.test(vin)) return false;

  return true;
}

/**
 * Maps backend vehicle type to our app's vehicle type for form selection
 * @param {string} suggestedType - Suggested equipment type from backend
 * @param {string} bodyClass - Body class from NHTSA
 * @returns {string} - Mapped vehicle type for form
 */
function mapVehicleType(suggestedType, bodyClass) {
  // Map backend suggested types to form values
  const typeMap = {
    semi_truck: "semi",
    box_truck: "box_truck",
    cargo_van: "cargo_van",
    pickup_truck: "sprinter",
    other: "",
  };

  if (suggestedType && typeMap[suggestedType]) {
    return typeMap[suggestedType];
  }

  // Fallback to body class analysis
  const body = (bodyClass || "").toLowerCase();
  if (body.includes("truck-tractor") || body.includes("semi")) return "semi";
  if (body.includes("box") || body.includes("straight")) return "box_truck";
  if (body.includes("cargo van")) return "cargo_van";
  if (body.includes("van")) return "sprinter";

  return "";
}

/**
 * Maps fuel type to form value
 * @param {string} fuelType - Fuel type from API
 * @returns {string} - Mapped fuel type for form
 */
function mapFuelType(fuelType) {
  if (!fuelType) return "";

  const fuel = fuelType.toLowerCase();

  if (fuel.includes("diesel")) return "diesel";
  if (fuel.includes("electric")) return "electric";
  if (fuel.includes("hybrid")) return "hybrid";
  if (fuel.includes("cng") || fuel.includes("compressed natural gas")) return "cng";
  if (fuel.includes("lng") || fuel.includes("liquefied natural gas")) return "lng";
  if (fuel.includes("gasoline") || fuel.includes("gas")) return "gasoline";

  return "";
}

/**
 * Decodes a VIN using the backend API
 * @param {string} vin - 17-character Vehicle Identification Number
 * @returns {Promise<Object>} - Decoded vehicle information
 */
export async function decodeVin(vin) {
  // Validate VIN format first
  if (!isValidVinFormat(vin)) {
    return {
      success: false,
      error: "Invalid VIN format. VIN must be 17 characters and cannot contain I, O, or Q.",
    };
  }

  try {
    const data = await vinApi.decode(vin.toUpperCase());

    // Build the decoded vehicle object
    const decodedVehicle = {
      year: data.year || "",
      make: data.make || "",
      model: data.model || "",
      type: mapVehicleType(data.suggestedEquipmentType, data.bodyClass),
      fuelType: mapFuelType(data.fuelType),
      // Additional info that might be useful
      details: {
        vehicleType: data.vehicleType || "",
        bodyClass: data.bodyClass || "",
        engineDisplacement: data.engineDisplacement || "",
        engineCylinders: data.engineCylinders || "",
        driveType: data.driveType || "",
        gvwr: data.gvwr || "",
        manufacturer: data.manufacturer || "",
      },
    };

    // Validate that we got at least some useful data
    if (!decodedVehicle.year && !decodedVehicle.make && !decodedVehicle.model) {
      return {
        success: false,
        error: "Could not decode vehicle information from this VIN",
      };
    }

    return {
      success: true,
      data: decodedVehicle,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to decode VIN",
    };
  }
}

/**
 * Hook-friendly async VIN decoder with loading state
 * Returns an object with decode function and state
 */
export function createVinDecoder() {
  let isLoading = false;
  let error = null;
  let data = null;

  const decode = async (vin) => {
    isLoading = true;
    error = null;
    data = null;

    const result = await decodeVin(vin);

    isLoading = false;

    if (result.success) {
      data = result.data;
    } else {
      error = result.error;
    }

    return result;
  };

  return {
    decode,
    isLoading: () => isLoading,
    getError: () => error,
    getData: () => data,
  };
}
