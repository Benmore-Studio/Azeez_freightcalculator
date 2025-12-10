import type { VehicleType, LoadType, FreightClass, WeatherCondition } from '../../../lib/generated/prisma/index.js';
export interface RateCalculationInput {
    originAddress: string;
    originCity?: string;
    originState?: string;
    destinationAddress: string;
    destinationCity?: string;
    destinationState?: string;
    totalMiles: number;
    deadheadMiles?: number;
    vehicleId?: string;
    vehicleType: VehicleType;
    loadWeight?: number;
    loadType?: LoadType;
    freightClass?: FreightClass;
    commodityType?: string;
    isExpedite?: boolean;
    isTeam?: boolean;
    isReefer?: boolean;
    isRush?: boolean;
    isSameDay?: boolean;
    requiresLiftgate?: boolean;
    requiresPalletJack?: boolean;
    requiresDriverAssist?: boolean;
    requiresWhiteGlove?: boolean;
    requiresTracking?: boolean;
    weatherCondition?: WeatherCondition;
    season?: string;
    fuelPriceOverride?: number;
    pickupDate?: Date;
    deliveryDate?: Date;
}
export interface RateCalculationResult {
    recommendedRate: number;
    minRate: number;
    maxRate: number;
    ratePerMile: number;
    costPerMile: number;
    costBreakdown: {
        fuelCost: number;
        maintenanceCost: number;
        tireCost: number;
        fixedCostAllocation: number;
        serviceFees: number;
        totalCost: number;
    };
    serviceFees: {
        expediteFee: number;
        teamFee: number;
        rushFee: number;
        sameDayFee: number;
        liftgateFee: number;
        palletJackFee: number;
        driverAssistFee: number;
        whiteGloveFee: number;
        trackingFee: number;
        reeferFee: number;
        total: number;
    };
    profitMargin: number;
    estimatedProfit: number;
    profitPerMile: number;
    totalMiles: number;
    deadheadMiles: number;
    loadedMiles: number;
    estimatedDriveHours: number;
    multipliersApplied: {
        weather: number;
        loadType: number;
        freightClass: number;
        services: number;
        total: number;
    };
    fuelPriceUsed: number;
    estimatedGallons: number;
}
/**
 * Calculate freight rate based on inputs and user settings
 */
export declare function calculateRate(userId: string, input: RateCalculationInput): Promise<RateCalculationResult>;
//# sourceMappingURL=rate.service.d.ts.map