/**
 * NHTSA VIN Decode Service
 *
 * Provides vehicle information lookup using the free NHTSA vPIC API.
 * No API key required. Rate limit: 5 requests per second.
 *
 * API Documentation: https://vpic.nhtsa.dot.gov/api/
 */

const NHTSA_API_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

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
  gvwr: string | null; // Gross Vehicle Weight Rating
  gcwr: string | null; // Gross Combined Weight Rating
  wheelBase: string | null;
  numberOfDoors: number | null;
  plantCountry: string | null;
  plantCity: string | null;
  manufacturer: string | null;
  errorCode: string | null;
  errorText: string | null;
}

/**
 * NHTSA API response structure
 */
interface NHTSAResponse {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: Array<{
    Variable: string;
    VariableId: number;
    Value: string | null;
    ValueId: string | null;
  }>;
}

/**
 * Map NHTSA variable names to our interface fields
 */
const VARIABLE_MAP: Record<string, keyof VehicleInfo> = {
  'Model Year': 'year',
  'Make': 'make',
  'Model': 'model',
  'Trim': 'trim',
  'Vehicle Type': 'vehicleType',
  'Body Class': 'bodyClass',
  'Drive Type': 'driveType',
  'Fuel Type - Primary': 'fuelType',
  'Engine Number of Cylinders': 'engineCylinders',
  'Displacement (L)': 'engineDisplacement',
  'Transmission Style': 'transmissionType',
  'Gross Vehicle Weight Rating From': 'gvwr',
  'Gross Combined Weight Rating From': 'gcwr',
  'Wheel Base (inches) From': 'wheelBase',
  'Doors': 'numberOfDoors',
  'Plant Country': 'plantCountry',
  'Plant City': 'plantCity',
  'Manufacturer Name': 'manufacturer',
  'Error Code': 'errorCode',
  'Error Text': 'errorText',
};

/**
 * Validate VIN format (17 characters, no I, O, Q)
 */
export function validateVIN(vin: string): { valid: boolean; error?: string } {
  if (!vin) {
    return { valid: false, error: 'VIN is required' };
  }

  const cleanVIN = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (cleanVIN.length !== 17) {
    return { valid: false, error: 'VIN must be exactly 17 characters' };
  }

  if (/[IOQ]/.test(cleanVIN)) {
    return { valid: false, error: 'VIN cannot contain letters I, O, or Q' };
  }

  return { valid: true };
}

/**
 * Decode a VIN using NHTSA API
 */
export async function decodeVIN(vin: string): Promise<VehicleInfo> {
  const validation = validateVIN(vin);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const cleanVIN = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const url = `${NHTSA_API_BASE}/DecodeVin/${cleanVIN}?format=json`;

  console.log(`[VINService] Decoding VIN: ${cleanVIN}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NHTSA API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as NHTSAResponse;

    if (!data.Results || data.Results.length === 0) {
      throw new Error('No results returned from NHTSA API');
    }

    // Initialize with nulls
    const vehicleInfo: VehicleInfo = {
      vin: cleanVIN,
      year: null,
      make: null,
      model: null,
      trim: null,
      vehicleType: null,
      bodyClass: null,
      driveType: null,
      fuelType: null,
      engineCylinders: null,
      engineDisplacement: null,
      transmissionType: null,
      gvwr: null,
      gcwr: null,
      wheelBase: null,
      numberOfDoors: null,
      plantCountry: null,
      plantCity: null,
      manufacturer: null,
      errorCode: null,
      errorText: null,
    };

    // Map results to our interface
    for (const result of data.Results) {
      const fieldName = VARIABLE_MAP[result.Variable];
      if (fieldName && result.Value) {
        const value = result.Value.trim();
        if (value && value !== 'Not Applicable') {
          // Handle numeric fields
          if (fieldName === 'year' || fieldName === 'engineCylinders' || fieldName === 'numberOfDoors') {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue)) {
              (vehicleInfo as any)[fieldName] = numValue;
            }
          } else {
            (vehicleInfo as any)[fieldName] = value;
          }
        }
      }
    }

    // Check for errors in the decode
    if (vehicleInfo.errorCode && vehicleInfo.errorCode !== '0') {
      console.warn(`[VINService] VIN decode warning: ${vehicleInfo.errorText}`);
    }

    // Log success
    if (vehicleInfo.year && vehicleInfo.make && vehicleInfo.model) {
      console.log(`[VINService] Decoded: ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`);
    } else {
      console.log(`[VINService] Partial decode - some fields missing`);
    }

    return vehicleInfo;
  } catch (error) {
    console.error('[VINService] Error decoding VIN:', error);
    throw error;
  }
}

/**
 * Decode VIN with model year hint (more accurate for older vehicles)
 */
export async function decodeVINWithYear(vin: string, modelYear: number): Promise<VehicleInfo> {
  const validation = validateVIN(vin);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const cleanVIN = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const url = `${NHTSA_API_BASE}/DecodeVin/${cleanVIN}?format=json&modelyear=${modelYear}`;

  console.log(`[VINService] Decoding VIN: ${cleanVIN} (year hint: ${modelYear})`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NHTSA API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as NHTSAResponse;

    if (!data.Results || data.Results.length === 0) {
      throw new Error('No results returned from NHTSA API');
    }

    // Initialize with nulls
    const vehicleInfo: VehicleInfo = {
      vin: cleanVIN,
      year: null,
      make: null,
      model: null,
      trim: null,
      vehicleType: null,
      bodyClass: null,
      driveType: null,
      fuelType: null,
      engineCylinders: null,
      engineDisplacement: null,
      transmissionType: null,
      gvwr: null,
      gcwr: null,
      wheelBase: null,
      numberOfDoors: null,
      plantCountry: null,
      plantCity: null,
      manufacturer: null,
      errorCode: null,
      errorText: null,
    };

    // Map results to our interface
    for (const result of data.Results) {
      const fieldName = VARIABLE_MAP[result.Variable];
      if (fieldName && result.Value) {
        const value = result.Value.trim();
        if (value && value !== 'Not Applicable') {
          if (fieldName === 'year' || fieldName === 'engineCylinders' || fieldName === 'numberOfDoors') {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue)) {
              (vehicleInfo as any)[fieldName] = numValue;
            }
          } else {
            (vehicleInfo as any)[fieldName] = value;
          }
        }
      }
    }

    return vehicleInfo;
  } catch (error) {
    console.error('[VINService] Error decoding VIN with year:', error);
    throw error;
  }
}

/**
 * Get available vehicle makes for a specific year
 */
export async function getVehicleMakes(year: number): Promise<string[]> {
  const url = `${NHTSA_API_BASE}/GetMakesForVehicleType/truck?format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NHTSA API error: ${response.status}`);
    }

    const data = (await response.json()) as { Results?: Array<{ MakeName: string }> };
    return data.Results?.map((r) => r.MakeName).filter(Boolean) || [];
  } catch (error) {
    console.error('[VINService] Error fetching makes:', error);
    return [];
  }
}

/**
 * Map NHTSA vehicle type to our internal equipment types
 */
export function mapToEquipmentType(vehicleInfo: VehicleInfo): string {
  const bodyClass = vehicleInfo.bodyClass?.toLowerCase() || '';
  const vehicleType = vehicleInfo.vehicleType?.toLowerCase() || '';

  // Check for truck types
  if (bodyClass.includes('truck-tractor') || bodyClass.includes('semi')) {
    return 'semi_truck';
  }
  if (bodyClass.includes('straight truck') || bodyClass.includes('box truck')) {
    return 'box_truck';
  }
  if (bodyClass.includes('cargo van') || bodyClass.includes('van')) {
    return 'cargo_van';
  }
  if (bodyClass.includes('pickup')) {
    return 'pickup_truck';
  }
  if (vehicleType.includes('truck')) {
    // Check GVWR for classification
    const gvwr = vehicleInfo.gvwr;
    if (gvwr) {
      const weight = parseInt(gvwr.replace(/[^0-9]/g, ''), 10);
      if (weight >= 26001) return 'semi_truck';
      if (weight >= 14001) return 'box_truck';
      if (weight >= 10001) return 'cargo_van';
      return 'pickup_truck';
    }
    return 'box_truck'; // Default for trucks
  }

  return 'other';
}
