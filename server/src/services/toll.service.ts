import { env } from '../config/env.js';
import { prisma } from './prisma.js';
import crypto from 'crypto';

export interface TollBreakdown {
  totalTolls: number;
  tollsByState: Record<string, number>;
  cashTolls: number;
  transponderTolls: number;
  tollCount: number;
  tollPlazas: TollPlaza[];
}

export interface TollPlaza {
  name: string;
  state: string;
  cashCost: number;
  transponderCost: number;
  lat?: number;
  lng?: number;
}

export interface TollCalculationInput {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  vehicleType: 'car' | '2axle' | '3axle' | '4axle' | '5axle';
  fuelPrice?: number;
}

// Vehicle type mapping for TollGuru API
const VEHICLE_TYPE_MAP: Record<string, string> = {
  car: '2AxlesAuto',
  '2axle': '2AxlesTruck',
  '3axle': '3AxlesTruck',
  '4axle': '4AxlesTruck',
  '5axle': '5AxlesTruck',
};

// Our vehicle types to TollGuru vehicle classes
export const FREIGHT_VEHICLE_MAP: Record<string, string> = {
  semi: '5axle',
  box_truck: '2axle',
  cargo_van: '2axle',
  sprinter: '2axle',
  reefer: '5axle',
};

/**
 * Calculate tolls for a route using TollGuru API
 */
export async function calculateTolls(input: TollCalculationInput): Promise<TollBreakdown | null> {
  const apiKey = env.apiKeys.toll;

  if (!apiKey) {
    console.warn('TOLL_API_KEY not configured');
    return null;
  }

  // Check cache first
  const cached = await getCachedTolls(input);
  if (cached) {
    return cached;
  }

  try {
    // TollGuru Route API
    const url = 'https://apis.tollguru.com/toll/v2/complete-polyline-from-mapping-service';

    const vehicleClass = VEHICLE_TYPE_MAP[input.vehicleType] || '5AxlesTruck';

    const requestBody = {
      from: {
        lat: input.originLat,
        lng: input.originLng,
      },
      to: {
        lat: input.destLat,
        lng: input.destLng,
      },
      vehicleType: vehicleClass,
      departure_time: Math.floor(Date.now() / 1000),
      fuelPrice: input.fuelPrice || 4.00,
      fuelEfficiency: {
        city: 6.5,
        highway: 8.0,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('TollGuru API error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();

    // Parse TollGuru response
    const breakdown = parseTollGuruResponse(data);

    // Cache the result
    if (breakdown) {
      await cacheTolls(breakdown, input);
    }

    return breakdown;
  } catch (error) {
    console.error('Error calculating tolls:', error);
    return null;
  }
}

/**
 * Parse TollGuru API response into our format
 */
function parseTollGuruResponse(data: any): TollBreakdown | null {
  try {
    const routes = data.routes || [];
    if (routes.length === 0) {
      return {
        totalTolls: 0,
        tollsByState: {},
        cashTolls: 0,
        transponderTolls: 0,
        tollCount: 0,
        tollPlazas: [],
      };
    }

    // Use the first (fastest) route
    const route = routes[0];
    const tolls = route.costs?.tag || route.costs?.cash || 0;
    const cashTolls = route.costs?.cash || tolls;
    const transponderTolls = route.costs?.tag || tolls;

    // Extract toll plazas
    const tollPlazas: TollPlaza[] = [];
    const tollsByState: Record<string, number> = {};

    const tollDetails = route.tolls || [];
    for (const toll of tollDetails) {
      const state = toll.state || 'Unknown';
      const cashCost = toll.cashCost || toll.tagCost || 0;
      const transponderCost = toll.tagCost || toll.cashCost || 0;

      tollPlazas.push({
        name: toll.name || 'Toll Plaza',
        state,
        cashCost,
        transponderCost,
        lat: toll.lat,
        lng: toll.lng,
      });

      // Aggregate by state
      tollsByState[state] = (tollsByState[state] || 0) + transponderCost;
    }

    return {
      totalTolls: Math.round(transponderTolls * 100) / 100,
      tollsByState,
      cashTolls: Math.round(cashTolls * 100) / 100,
      transponderTolls: Math.round(transponderTolls * 100) / 100,
      tollCount: tollPlazas.length,
      tollPlazas,
    };
  } catch (error) {
    console.error('Error parsing TollGuru response:', error);
    return null;
  }
}

/**
 * Generate cache keys for toll calculation
 */
function generateCacheKeys(input: TollCalculationInput): { originHash: string; destinationHash: string } {
  const originKey = `${input.originLat.toFixed(3)},${input.originLng.toFixed(3)}`;
  const destKey = `${input.destLat.toFixed(3)},${input.destLng.toFixed(3)}`;
  return {
    originHash: crypto.createHash('md5').update(originKey).digest('hex'),
    destinationHash: crypto.createHash('md5').update(destKey).digest('hex'),
  };
}

/**
 * Map our vehicle type to axle count
 */
function getAxleCount(vehicleType: string): number {
  const axleCounts: Record<string, number> = {
    car: 2,
    '2axle': 2,
    '3axle': 3,
    '4axle': 4,
    '5axle': 5,
  };
  return axleCounts[vehicleType] || 5;
}

/**
 * Map our vehicle type string to Prisma VehicleType enum
 */
function mapVehicleType(vehicleType: string): 'semi' | 'box_truck' | 'cargo_van' | 'sprinter' | 'reefer' {
  const mapping: Record<string, 'semi' | 'box_truck' | 'cargo_van' | 'sprinter' | 'reefer'> = {
    '5axle': 'semi',
    '4axle': 'semi',
    '3axle': 'box_truck',
    '2axle': 'cargo_van',
    car: 'cargo_van',
  };
  return mapping[vehicleType] || 'semi';
}

/**
 * Get cached toll calculation
 */
async function getCachedTolls(input: TollCalculationInput): Promise<TollBreakdown | null> {
  try {
    const { originHash, destinationHash } = generateCacheKeys(input);
    const axleCount = getAxleCount(input.vehicleType);
    const vehicleType = mapVehicleType(input.vehicleType);

    const cached = await prisma.tollCache.findFirst({
      where: {
        originHash,
        destinationHash,
        vehicleType,
        axleCount,
        expiresAt: { gt: new Date() },
      },
    });

    if (cached && cached.routeData) {
      return cached.routeData as unknown as TollBreakdown;
    }
  } catch (error) {
    console.error('Error reading toll cache:', error);
  }
  return null;
}

/**
 * Cache toll calculation result
 */
async function cacheTolls(
  breakdown: TollBreakdown,
  input: TollCalculationInput
): Promise<void> {
  try {
    // Cache for 7 days (tolls don't change frequently)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { originHash, destinationHash } = generateCacheKeys(input);
    const axleCount = getAxleCount(input.vehicleType);
    const vehicleType = mapVehicleType(input.vehicleType);

    await prisma.tollCache.upsert({
      where: {
        originHash_destinationHash_vehicleType_axleCount: {
          originHash,
          destinationHash,
          vehicleType,
          axleCount,
        },
      },
      update: {
        tollAmount: breakdown.totalTolls,
        tollCount: breakdown.tollCount,
        routeData: breakdown as any,
        fetchedAt: new Date(),
        expiresAt,
      },
      create: {
        originHash,
        destinationHash,
        vehicleType,
        axleCount,
        tollAmount: breakdown.totalTolls,
        tollCount: breakdown.tollCount,
        routeData: breakdown as any,
        fetchedAt: new Date(),
        expiresAt,
      },
    });
  } catch (error) {
    console.error('Error caching tolls:', error);
  }
}

/**
 * Calculate tolls using a simple estimate (fallback when API unavailable)
 * Based on average toll rates per state
 */
export function estimateTollsFallback(
  distanceMiles: number,
  statesCrossed: string[]
): TollBreakdown {
  // Average toll rates per mile by state (approximate)
  const STATE_TOLL_RATES: Record<string, number> = {
    // High toll states
    NJ: 0.15,
    NY: 0.12,
    PA: 0.10,
    MA: 0.10,
    IL: 0.08,
    OH: 0.07,
    FL: 0.06,
    TX: 0.05,
    CA: 0.05,
    // Moderate toll states
    IN: 0.04,
    KS: 0.04,
    OK: 0.04,
    WV: 0.03,
    ME: 0.03,
    // Low/no toll states default
    default: 0.02,
  };

  let totalTolls = 0;
  const tollsByState: Record<string, number> = {};

  if (statesCrossed.length === 0) {
    // If no states provided, use a conservative estimate
    totalTolls = distanceMiles * 0.03;
  } else {
    // Assume equal distance through each state
    const milesPerState = distanceMiles / statesCrossed.length;

    for (const state of statesCrossed) {
      const rate = STATE_TOLL_RATES[state] || STATE_TOLL_RATES.default;
      const stateToll = Math.round(milesPerState * rate * 100) / 100;
      tollsByState[state] = stateToll;
      totalTolls += stateToll;
    }
  }

  return {
    totalTolls: Math.round(totalTolls * 100) / 100,
    tollsByState,
    cashTolls: Math.round(totalTolls * 1.1 * 100) / 100, // Cash typically 10% higher
    transponderTolls: Math.round(totalTolls * 100) / 100,
    tollCount: 0,
    tollPlazas: [],
  };
}
