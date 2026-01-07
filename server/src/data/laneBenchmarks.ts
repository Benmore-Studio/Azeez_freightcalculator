/**
 * Lane Rate Benchmarks
 *
 * Industry-standard freight rates by lane (origin region -> destination region).
 * Based on 2024 market data averages from major freight indices.
 *
 * Rates are in $/mile for dry van equipment.
 * Equipment premiums and seasonal adjustments applied separately.
 */

export type FreightRegion =
  | 'northeast'
  | 'southeast'
  | 'midwest'
  | 'southwest'
  | 'west'
  | 'pacific_northwest'
  | 'mountain'
  | 'south_central';

export interface RateBenchmark {
  low: number;   // 25th percentile $/mile
  mid: number;   // 50th percentile (median) $/mile
  high: number;  // 75th percentile $/mile
}

/**
 * Lane benchmark rates by origin -> destination region
 * Rates reflect typical dry van spot market conditions
 */
export const LANE_BENCHMARKS: Record<FreightRegion, Record<FreightRegion, RateBenchmark>> = {
  // MIDWEST (IL, OH, MI, IN, WI, MN, IA, MO)
  midwest: {
    northeast: { low: 2.15, mid: 2.50, high: 2.90 },      // Strong demand
    southeast: { low: 1.85, mid: 2.15, high: 2.55 },      // Balanced
    midwest: { low: 1.70, mid: 2.00, high: 2.35 },        // Intra-region
    southwest: { low: 1.75, mid: 2.10, high: 2.50 },      // Moderate
    west: { low: 2.20, mid: 2.55, high: 3.00 },           // High demand (CA)
    pacific_northwest: { low: 2.10, mid: 2.45, high: 2.85 },
    mountain: { low: 1.90, mid: 2.25, high: 2.65 },
    south_central: { low: 1.80, mid: 2.10, high: 2.50 },  // TX balanced
  },

  // NORTHEAST (NY, NJ, PA, MA, CT, NH, VT, ME, RI)
  northeast: {
    northeast: { low: 1.85, mid: 2.20, high: 2.60 },      // Intra-region
    southeast: { low: 2.00, mid: 2.35, high: 2.75 },      // Southbound flow
    midwest: { low: 1.90, mid: 2.25, high: 2.65 },        // Westbound
    southwest: { low: 2.05, mid: 2.40, high: 2.85 },
    west: { low: 2.30, mid: 2.70, high: 3.20 },           // Long haul premium
    pacific_northwest: { low: 2.25, mid: 2.65, high: 3.10 },
    mountain: { low: 2.10, mid: 2.45, high: 2.90 },
    south_central: { low: 2.00, mid: 2.35, high: 2.80 },
  },

  // SOUTHEAST (FL, GA, NC, SC, VA, TN, AL, MS)
  southeast: {
    northeast: { low: 2.25, mid: 2.60, high: 3.05 },      // Northbound premium
    southeast: { low: 1.65, mid: 1.95, high: 2.30 },      // Intra-region (lots of trucks)
    midwest: { low: 1.95, mid: 2.30, high: 2.70 },
    southwest: { low: 1.85, mid: 2.20, high: 2.60 },
    west: { low: 2.15, mid: 2.50, high: 2.95 },
    pacific_northwest: { low: 2.20, mid: 2.55, high: 3.00 },
    mountain: { low: 2.00, mid: 2.35, high: 2.75 },
    south_central: { low: 1.75, mid: 2.05, high: 2.45 },
  },

  // SOUTHWEST (AZ, NV, NM)
  southwest: {
    northeast: { low: 2.10, mid: 2.45, high: 2.90 },
    southeast: { low: 1.95, mid: 2.30, high: 2.70 },
    midwest: { low: 2.00, mid: 2.35, high: 2.75 },
    southwest: { low: 1.60, mid: 1.90, high: 2.25 },      // Intra-region
    west: { low: 1.85, mid: 2.15, high: 2.55 },           // Short to CA
    pacific_northwest: { low: 2.05, mid: 2.40, high: 2.80 },
    mountain: { low: 1.70, mid: 2.00, high: 2.40 },
    south_central: { low: 1.80, mid: 2.10, high: 2.50 },
  },

  // WEST (CA)
  west: {
    northeast: { low: 1.75, mid: 2.10, high: 2.50 },      // Backhaul (cheap out of CA)
    southeast: { low: 1.70, mid: 2.00, high: 2.40 },      // Backhaul
    midwest: { low: 1.65, mid: 1.95, high: 2.35 },        // Backhaul
    southwest: { low: 1.55, mid: 1.85, high: 2.20 },      // Short backhaul
    west: { low: 1.80, mid: 2.15, high: 2.55 },           // Intra-CA
    pacific_northwest: { low: 1.90, mid: 2.25, high: 2.65 }, // Northbound
    mountain: { low: 1.60, mid: 1.90, high: 2.30 },       // Backhaul
    south_central: { low: 1.65, mid: 1.95, high: 2.35 },  // TX backhaul
  },

  // PACIFIC NORTHWEST (WA, OR)
  pacific_northwest: {
    northeast: { low: 2.00, mid: 2.35, high: 2.75 },
    southeast: { low: 1.95, mid: 2.30, high: 2.70 },
    midwest: { low: 1.90, mid: 2.25, high: 2.65 },
    southwest: { low: 1.85, mid: 2.20, high: 2.60 },
    west: { low: 2.10, mid: 2.45, high: 2.90 },           // Southbound to CA
    pacific_northwest: { low: 1.70, mid: 2.00, high: 2.40 }, // Intra-region
    mountain: { low: 1.80, mid: 2.15, high: 2.55 },
    south_central: { low: 1.95, mid: 2.30, high: 2.70 },
  },

  // MOUNTAIN (CO, UT, WY, MT, ID)
  mountain: {
    northeast: { low: 2.05, mid: 2.40, high: 2.85 },
    southeast: { low: 1.90, mid: 2.25, high: 2.65 },
    midwest: { low: 1.85, mid: 2.20, high: 2.60 },
    southwest: { low: 1.80, mid: 2.15, high: 2.55 },
    west: { low: 2.00, mid: 2.35, high: 2.75 },           // To CA
    pacific_northwest: { low: 1.85, mid: 2.20, high: 2.60 },
    mountain: { low: 1.65, mid: 1.95, high: 2.35 },       // Intra-region
    south_central: { low: 1.80, mid: 2.15, high: 2.55 },
  },

  // SOUTH CENTRAL (TX, OK, AR, LA)
  south_central: {
    northeast: { low: 2.20, mid: 2.55, high: 3.00 },      // Long haul from TX
    southeast: { low: 1.95, mid: 2.30, high: 2.70 },
    midwest: { low: 2.00, mid: 2.35, high: 2.75 },        // Northbound
    southwest: { low: 1.85, mid: 2.20, high: 2.60 },
    west: { low: 2.10, mid: 2.45, high: 2.90 },           // TX to CA premium
    pacific_northwest: { low: 2.15, mid: 2.50, high: 2.95 },
    mountain: { low: 1.90, mid: 2.25, high: 2.65 },
    south_central: { low: 1.60, mid: 1.90, high: 2.25 },  // Intra-TX (lots of trucks)
  },
};

/**
 * Distance-based rate curves
 * Shorter hauls command higher $/mile due to fixed costs per trip
 */
export interface DistanceCurve {
  minMiles?: number;
  maxMiles?: number;
  multiplier: number;
  label: string;
}

export const DISTANCE_CURVES: DistanceCurve[] = [
  { maxMiles: 150, multiplier: 1.50, label: 'Local' },           // Very short: +50%
  { minMiles: 151, maxMiles: 250, multiplier: 1.35, label: 'Short Haul' },  // +35%
  { minMiles: 251, maxMiles: 500, multiplier: 1.15, label: 'Regional' },    // +15%
  { minMiles: 501, maxMiles: 800, multiplier: 1.05, label: 'Mid-Range' },   // +5%
  { minMiles: 801, maxMiles: 1200, multiplier: 1.00, label: 'Standard' },   // Baseline
  { minMiles: 1201, maxMiles: 1800, multiplier: 0.95, label: 'Long Haul' }, // -5%
  { minMiles: 1801, multiplier: 0.90, label: 'Super Long' },     // -10%
];

/**
 * Equipment type premiums over dry van base rate
 */
export type EquipmentCategory = 'dry_van' | 'reefer' | 'flatbed' | 'specialized';

export const EQUIPMENT_PREMIUMS: Record<EquipmentCategory, { multiplier: number; label: string }> = {
  dry_van: { multiplier: 1.00, label: 'Dry Van (Base)' },
  reefer: { multiplier: 1.20, label: 'Refrigerated (+20%)' },
  flatbed: { multiplier: 1.15, label: 'Flatbed (+15%)' },
  specialized: { multiplier: 1.45, label: 'Specialized (+45%)' },
};

/**
 * Seasonal multipliers
 * Based on typical freight market patterns
 */
export type SeasonType = 'produce_season' | 'holiday_peak' | 'q1_slow' | 'summer_steady' | 'normal';

export interface SeasonalPeriod {
  months: number[];  // 1-12
  multiplier: number;
  label: string;
}

export const SEASONAL_PERIODS: SeasonalPeriod[] = [
  { months: [1, 2], multiplier: 0.88, label: 'Q1 Slow Season' },           // Jan-Feb slowest
  { months: [3], multiplier: 0.95, label: 'Early Spring' },                 // March picking up
  { months: [4, 5, 6], multiplier: 1.12, label: 'Produce Season' },        // Apr-Jun produce rush
  { months: [7, 8, 9], multiplier: 1.02, label: 'Summer Steady' },         // Jul-Sep stable
  { months: [10], multiplier: 1.08, label: 'Fall Ramp-Up' },               // October building
  { months: [11, 12], multiplier: 1.22, label: 'Holiday Peak' },           // Nov-Dec peak season
];

/**
 * Get seasonal multiplier for a given date
 */
export function getSeasonalMultiplier(date?: Date): { multiplier: number; label: string } {
  const month = date ? date.getMonth() + 1 : new Date().getMonth() + 1;

  for (const period of SEASONAL_PERIODS) {
    if (period.months.includes(month)) {
      return { multiplier: period.multiplier, label: period.label };
    }
  }

  return { multiplier: 1.0, label: 'Normal' };
}

/**
 * Get distance curve multiplier
 */
export function getDistanceMultiplier(miles: number): { multiplier: number; label: string } {
  for (const curve of DISTANCE_CURVES) {
    const minOk = curve.minMiles === undefined || miles >= curve.minMiles;
    const maxOk = curve.maxMiles === undefined || miles <= curve.maxMiles;

    if (minOk && maxOk) {
      return { multiplier: curve.multiplier, label: curve.label };
    }
  }

  // Default for very long hauls
  return { multiplier: 0.90, label: 'Super Long' };
}

/**
 * Get equipment premium multiplier
 */
export function getEquipmentMultiplier(
  vehicleType: string,
  freightClass?: string
): { multiplier: number; label: string; category: EquipmentCategory } {
  // Map vehicle/freight class to equipment category
  const vt = vehicleType?.toLowerCase() || '';
  const fc = freightClass?.toLowerCase() || '';

  if (fc.includes('refrigerated') || fc.includes('reefer') || vt.includes('reefer')) {
    return { ...EQUIPMENT_PREMIUMS.reefer, category: 'reefer' };
  }

  if (fc.includes('flatbed') || fc.includes('step_deck') || fc.includes('lowboy')) {
    return { ...EQUIPMENT_PREMIUMS.flatbed, category: 'flatbed' };
  }

  if (fc.includes('oversized') || fc.includes('hazmat') || fc.includes('tanker') || fc.includes('specialized')) {
    return { ...EQUIPMENT_PREMIUMS.specialized, category: 'specialized' };
  }

  return { ...EQUIPMENT_PREMIUMS.dry_van, category: 'dry_van' };
}

/**
 * Default benchmark for unknown lanes
 */
export const DEFAULT_BENCHMARK: RateBenchmark = {
  low: 1.85,
  mid: 2.20,
  high: 2.60,
};
