/**
 * Region Mappings
 *
 * Maps US states to freight regions and provides supply/demand indicators
 * for calculating lane imbalances and market conditions.
 */
import { FreightRegion } from './laneBenchmarks.js';
/**
 * State to region mapping
 * All 50 US states mapped to 8 freight regions
 */
export declare const STATE_TO_REGION: Record<string, FreightRegion>;
/**
 * Region supply/demand characteristics
 * Used to determine lane imbalances and market temperature
 */
export interface RegionCharacteristics {
    name: string;
    outboundStrength: number;
    inboundStrength: number;
    truckPopulation: number;
    majorMarkets: string[];
    industries: string[];
}
export declare const REGION_CHARACTERISTICS: Record<FreightRegion, RegionCharacteristics>;
/**
 * Flow direction and imbalance calculation
 */
export type FlowDirection = 'headhaul' | 'backhaul' | 'balanced';
export interface FlowAnalysis {
    direction: FlowDirection;
    imbalanceScore: number;
    truckToLoadRatio: number;
    marketTemperature: 'hot' | 'warm' | 'balanced' | 'cool' | 'cold';
}
/**
 * Calculate flow direction between two regions
 */
export declare function calculateFlowDirection(originRegion: FreightRegion, destRegion: FreightRegion): FlowAnalysis;
/**
 * Return load potential by destination region
 * Score 1-10 indicating likelihood of finding a profitable return load
 */
export declare const RETURN_LOAD_POTENTIAL: Record<FreightRegion, {
    score: number;
    rating: string;
    avgLoadsPerDay: number;
}>;
/**
 * Get region from state code
 */
export declare function getRegionFromState(stateCode: string): FreightRegion | null;
/**
 * Get region display name
 */
export declare function getRegionDisplayName(region: FreightRegion): string;
//# sourceMappingURL=regionMappings.d.ts.map