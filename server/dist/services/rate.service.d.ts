import type { VehicleType, LoadType, FreightClass, WeatherCondition } from '../../../lib/generated/prisma/index.js';
import { type MarketRateResult } from './market.service.js';
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
    isDCPickup?: boolean;
    isDCDelivery?: boolean;
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
        defCost: number;
        maintenanceCost: number;
        tireCost: number;
        fixedCostAllocation: number;
        dcFees: number;
        hotelCost: number;
        serviceFees: number;
        factoringFee: number;
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
        weight: number;
        seasonal: number;
        total: number;
    };
    fuelPriceUsed: number;
    estimatedGallons: number;
}
/**
 * Enriched rate calculation result with auto-calculated data from external APIs
 */
export interface EnrichedRateResult extends RateCalculationResult {
    routeData: {
        calculatedMiles: number;
        calculatedDuration: number;
        originFormatted: string;
        destinationFormatted: string;
        originLat?: number;
        originLng?: number;
        destinationLat?: number;
        destinationLng?: number;
        statesCrossed: string[];
        milesSource: 'api' | 'user_input' | 'fallback';
        isTruckRoute: boolean;
        routingProvider: 'pcmiler' | 'google' | 'fallback';
    };
    weatherData: {
        origin: {
            condition: string;
            description: string;
            temperature: number;
            windSpeed: number;
            precipitation: number;
        } | null;
        destination: {
            condition: string;
            description: string;
            temperature: number;
            windSpeed: number;
            precipitation: number;
        } | null;
        routeCondition: string;
        riskLevel: string;
        advisories: string[];
        weatherSource: 'api' | 'user_input' | 'default';
    };
    tollData: {
        totalTolls: number;
        tollsByState: Record<string, number>;
        cashTolls: number;
        transponderTolls: number;
        tollCount: number;
        tollSource: 'api' | 'estimate' | 'none';
    };
    marketData: MarketRateResult;
}
/**
 * Input for enriched rate calculation (addresses instead of miles)
 */
export interface EnrichedRateInput {
    origin: string;
    destination: string;
    deadheadMiles?: number;
    vehicleId?: string;
    vehicleType: VehicleType;
    vehicleHeightInches?: number;
    vehicleWeightLbs?: number;
    vehicleLengthFeet?: number;
    vehicleAxles?: number;
    isHazmat?: boolean;
    hazmatType?: 'none' | 'general' | 'explosive' | 'flammable' | 'corrosive' | 'radioactive';
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
    isDCPickup?: boolean;
    isDCDelivery?: boolean;
    weatherCondition?: WeatherCondition;
    season?: string;
    fuelPriceOverride?: number;
    deliveryDate?: Date;
}
/**
 * Calculate enriched freight rate with auto-fetched distance, weather, and tolls
 */
export declare function calculateEnrichedRate(userId: string, input: EnrichedRateInput): Promise<EnrichedRateResult>;
/**
 * Calculate freight rate based on inputs and user settings
 */
export declare function calculateRate(userId: string, input: RateCalculationInput): Promise<RateCalculationResult>;
//# sourceMappingURL=rate.service.d.ts.map