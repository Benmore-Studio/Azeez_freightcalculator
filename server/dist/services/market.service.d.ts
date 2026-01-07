/**
 * Market Rate Service
 *
 * Calculates market-based freight rates using lane benchmarks,
 * equipment premiums, seasonal adjustments, and supply/demand factors.
 *
 * Provides ~70-85% accuracy compared to real-time load board data.
 */
import { FreightRegion } from '../data/laneBenchmarks.js';
/**
 * Input for market rate calculation
 */
export interface MarketRateInput {
    originState: string;
    destinationState: string;
    originCity?: string;
    destinationCity?: string;
    totalMiles: number;
    vehicleType?: string;
    freightClass?: string;
    pickupDate?: Date | string;
}
/**
 * Factor applied to the calculation
 */
export interface MarketFactor {
    name: string;
    multiplier: number;
    description: string;
}
/**
 * Return load potential assessment
 */
export interface ReturnLoadPotential {
    score: number;
    rating: string;
    loadsAvailable: number;
    avgReturnRate: number;
}
/**
 * Supply/demand analysis for the lane
 */
export interface SupplyDemandAnalysis {
    originRegion: FreightRegion;
    destinationRegion: FreightRegion;
    originRegionName: string;
    destinationRegionName: string;
    flowDirection: 'headhaul' | 'backhaul' | 'balanced';
    truckToLoadRatio: number;
    marketTemperature: 'hot' | 'warm' | 'balanced' | 'cool' | 'cold';
    imbalanceScore: number;
}
/**
 * Complete market rate result
 */
export interface MarketRateResult {
    marketLow: number;
    marketMid: number;
    marketHigh: number;
    totalLow: number;
    totalMid: number;
    totalHigh: number;
    confidence: number;
    confidenceLabel: 'high' | 'medium' | 'low';
    confidenceReason: string;
    factors: MarketFactor[];
    totalMultiplier: number;
    supplyDemand: SupplyDemandAnalysis;
    returnLoadPotential: ReturnLoadPotential;
    ratePosition: 'below_market' | 'at_market' | 'above_market';
    marketSpread: number;
}
/**
 * Calculate market rate for a given lane
 */
export declare function calculateMarketRate(input: MarketRateInput): Promise<MarketRateResult>;
/**
 * Compare a given rate against market benchmarks
 */
export declare function compareToMarket(rate: number, miles: number, marketResult: MarketRateResult): {
    position: 'below_market' | 'at_market' | 'above_market';
    percentile: number;
    recommendation: string;
};
//# sourceMappingURL=market.service.d.ts.map