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
export declare const FREIGHT_VEHICLE_MAP: Record<string, string>;
/**
 * Calculate tolls for a route using TollGuru API
 */
export declare function calculateTolls(input: TollCalculationInput): Promise<TollBreakdown | null>;
/**
 * Calculate tolls using a simple estimate (fallback when API unavailable)
 * Based on average toll rates per state
 */
export declare function estimateTollsFallback(distanceMiles: number, statesCrossed: string[]): TollBreakdown;
//# sourceMappingURL=toll.service.d.ts.map