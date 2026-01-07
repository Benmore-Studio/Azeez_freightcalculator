export interface FuelPriceResult {
    pricePerGallon: number;
    region: string;
    lastUpdated: Date;
    source: 'api' | 'cache' | 'fallback';
}
/**
 * Get fuel price for a specific state
 */
export declare function getFuelPriceForState(stateCode: string): Promise<FuelPriceResult>;
/**
 * Get weighted average fuel price for a route crossing multiple states
 */
export declare function getRouteFuelPrice(statesCrossed: string[]): Promise<FuelPriceResult>;
/**
 * Update fuel prices for all PADD regions (for cron job)
 */
export declare function updateAllFuelPrices(): Promise<{
    updated: number;
    failed: number;
}>;
/**
 * Get national average fuel price (for display/fallback)
 */
export declare function getNationalAverageFuelPrice(): Promise<FuelPriceResult>;
//# sourceMappingURL=fuel.service.d.ts.map