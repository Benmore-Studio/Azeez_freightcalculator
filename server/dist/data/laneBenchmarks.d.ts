/**
 * Lane Rate Benchmarks
 *
 * Industry-standard freight rates by lane (origin region -> destination region).
 * Based on 2024 market data averages from major freight indices.
 *
 * Rates are in $/mile for dry van equipment.
 * Equipment premiums and seasonal adjustments applied separately.
 */
export type FreightRegion = 'northeast' | 'southeast' | 'midwest' | 'southwest' | 'west' | 'pacific_northwest' | 'mountain' | 'south_central';
export interface RateBenchmark {
    low: number;
    mid: number;
    high: number;
}
/**
 * Lane benchmark rates by origin -> destination region
 * Rates reflect typical dry van spot market conditions
 */
export declare const LANE_BENCHMARKS: Record<FreightRegion, Record<FreightRegion, RateBenchmark>>;
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
export declare const DISTANCE_CURVES: DistanceCurve[];
/**
 * Equipment type premiums over dry van base rate
 */
export type EquipmentCategory = 'dry_van' | 'reefer' | 'flatbed' | 'specialized';
export declare const EQUIPMENT_PREMIUMS: Record<EquipmentCategory, {
    multiplier: number;
    label: string;
}>;
/**
 * Seasonal multipliers
 * Based on typical freight market patterns
 */
export type SeasonType = 'produce_season' | 'holiday_peak' | 'q1_slow' | 'summer_steady' | 'normal';
export interface SeasonalPeriod {
    months: number[];
    multiplier: number;
    label: string;
}
export declare const SEASONAL_PERIODS: SeasonalPeriod[];
/**
 * Get seasonal multiplier for a given date
 */
export declare function getSeasonalMultiplier(date?: Date): {
    multiplier: number;
    label: string;
};
/**
 * Get distance curve multiplier
 */
export declare function getDistanceMultiplier(miles: number): {
    multiplier: number;
    label: string;
};
/**
 * Get equipment premium multiplier
 */
export declare function getEquipmentMultiplier(vehicleType: string, freightClass?: string): {
    multiplier: number;
    label: string;
    category: EquipmentCategory;
};
/**
 * Default benchmark for unknown lanes
 */
export declare const DEFAULT_BENCHMARK: RateBenchmark;
//# sourceMappingURL=laneBenchmarks.d.ts.map