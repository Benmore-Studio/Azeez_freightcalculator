import { prisma } from './prisma.js';
import { ApiError } from '../utils/ApiError.js';
import type { VehicleType, LoadType, FreightClass, WeatherCondition } from '../../../lib/generated/prisma/index.js';

// National average diesel price (fallback)
const DEFAULT_DIESEL_PRICE = 4.00;

// Base rates per mile by vehicle type
const BASE_RATES: Record<VehicleType, number> = {
  semi: 2.50,
  box_truck: 2.00,
  cargo_van: 1.75,
  sprinter: 1.60,
  reefer: 3.00,
};

// Vehicle type defaults for cost calculations
const VEHICLE_DEFAULTS: Record<VehicleType, { mpg: number; maintenanceCpm: number; tireCpm: number }> = {
  semi: { mpg: 6.5, maintenanceCpm: 0.35, tireCpm: 0.05 },
  box_truck: { mpg: 10, maintenanceCpm: 0.20, tireCpm: 0.03 },
  cargo_van: { mpg: 18, maintenanceCpm: 0.15, tireCpm: 0.02 },
  sprinter: { mpg: 20, maintenanceCpm: 0.12, tireCpm: 0.02 },
  reefer: { mpg: 5.5, maintenanceCpm: 0.40, tireCpm: 0.06 },
};

// Weather condition multipliers
const WEATHER_MULTIPLIERS: Record<WeatherCondition, number> = {
  normal: 1.0,
  light_rain: 1.05,
  heavy_rain: 1.15,
  snow: 1.25,
  ice: 1.40,
  extreme_weather: 1.50,
  fog: 1.10,
};

// Load type multipliers
const LOAD_TYPE_MULTIPLIERS: Record<LoadType, number> = {
  full_truckload: 1.0,
  partial: 0.85,
  ltl: 0.75,
};

// Freight class multipliers (hazmat, etc.)
const FREIGHT_CLASS_MULTIPLIERS: Record<FreightClass, number> = {
  dry_van: 1.0,
  refrigerated: 1.15,
  flatbed: 1.10,
  oversized: 1.35,
  hazmat: 1.50,
  tanker: 1.25,
};

// Seasonal multipliers (based on trucking industry demand patterns)
const SEASONAL_MULTIPLIERS: Record<string, number> = {
  spring: 1.0,
  summer: 1.05,  // Increased demand for produce, construction
  fall: 1.0,
  winter: 1.15,  // Weather challenges, holiday freight surge
};

// Default DC (Distribution Center) fees
const DEFAULT_DC_FEE = 75;

// Hotel cost per night for multi-day trips (HOS compliance)
const HOTEL_COST_PER_NIGHT = 150;

// Max driving hours per day (HOS regulations)
const MAX_DRIVING_HOURS_PER_DAY = 11;

export interface RateCalculationInput {
  // Route
  originAddress: string;
  originCity?: string;
  originState?: string;
  destinationAddress: string;
  destinationCity?: string;
  destinationState?: string;
  totalMiles: number;
  deadheadMiles?: number;

  // Vehicle
  vehicleId?: string;
  vehicleType: VehicleType;

  // Load details
  loadWeight?: number;
  loadType?: LoadType;
  freightClass?: FreightClass;
  commodityType?: string;

  // Service options
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

  // Distribution Center options
  isDCPickup?: boolean;
  isDCDelivery?: boolean;

  // Conditions
  weatherCondition?: WeatherCondition;
  season?: string;
  fuelPriceOverride?: number;

  // Schedule
  pickupDate?: Date;
  deliveryDate?: Date;
}

export interface RateCalculationResult {
  // Core rates
  recommendedRate: number;
  minRate: number;
  maxRate: number;
  ratePerMile: number;
  costPerMile: number;

  // Cost breakdown
  costBreakdown: {
    fuelCost: number;
    defCost: number;           // NEW: Diesel Exhaust Fluid cost
    maintenanceCost: number;
    tireCost: number;
    fixedCostAllocation: number;
    dcFees: number;            // NEW: Distribution Center fees
    hotelCost: number;         // NEW: Hotel costs for multi-day trips
    serviceFees: number;
    factoringFee: number;      // NEW: Factoring fee applied to final rate
    totalCost: number;
  };

  // Service fees
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

  // Profit
  profitMargin: number;
  estimatedProfit: number;
  profitPerMile: number;

  // Route info
  totalMiles: number;
  deadheadMiles: number;
  loadedMiles: number;
  estimatedDriveHours: number;

  // Multipliers applied
  multipliersApplied: {
    weather: number;
    loadType: number;
    freightClass: number;
    services: number;
    weight: number;      // NEW: Weight adjustment multiplier
    seasonal: number;    // NEW: Seasonal demand multiplier
    total: number;
  };

  // Fuel
  fuelPriceUsed: number;
  estimatedGallons: number;
}

/**
 * Calculate freight rate based on inputs and user settings
 */
export async function calculateRate(
  userId: string,
  input: RateCalculationInput
): Promise<RateCalculationResult> {
  // Get user settings (or use defaults)
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  // Get vehicle data if vehicleId provided
  let vehicleData = null;
  if (input.vehicleId) {
    vehicleData = await prisma.vehicle.findFirst({
      where: { id: input.vehicleId, userId },
    });
  }

  // Determine vehicle type and specs
  const vehicleType = vehicleData?.vehicleType || input.vehicleType;
  const vehicleDefaults = VEHICLE_DEFAULTS[vehicleType];

  const mpg = vehicleData?.mpg ? Number(vehicleData.mpg) : vehicleDefaults.mpg;
  const maintenanceCpm = userSettings?.maintenanceCpm
    ? Number(userSettings.maintenanceCpm)
    : vehicleDefaults.maintenanceCpm;
  const tireCpm = userSettings?.tireCpm
    ? Number(userSettings.tireCpm)
    : vehicleDefaults.tireCpm;

  // Calculate distances
  const totalMiles = input.totalMiles;
  const deadheadMiles = input.deadheadMiles || 0;
  const loadedMiles = totalMiles - deadheadMiles;

  // Get fuel price
  const fuelPrice = input.fuelPriceOverride || await getFuelPrice(input.originState) || DEFAULT_DIESEL_PRICE;

  // Calculate base costs
  const fuelCostPerMile = fuelPrice / mpg;
  const fuelCost = fuelCostPerMile * totalMiles;
  const maintenanceCost = maintenanceCpm * totalMiles;
  const tireCost = tireCpm * totalMiles;

  // DEF (Diesel Exhaust Fluid) cost - vehicles consume ~1 gallon per 400 miles
  const defPricePerGallon = userSettings?.defPricePerGallon
    ? Number(userSettings.defPricePerGallon)
    : 3.50;
  const defCost = (totalMiles / 400) * defPricePerGallon;

  // Fixed cost allocation (per mile based on annual miles)
  const annualMiles = userSettings?.annualMiles || 100000;
  const annualInsurance = userSettings?.annualInsurance ? Number(userSettings.annualInsurance) : 12000;
  const monthlyPayment = userSettings?.monthlyVehiclePayment ? Number(userSettings.monthlyVehiclePayment) : 1500;
  const annualLicensing = userSettings?.annualLicensing ? Number(userSettings.annualLicensing) : 2500;
  const monthlyOverhead = userSettings?.monthlyOverhead ? Number(userSettings.monthlyOverhead) : 500;

  const annualFixedCosts = annualInsurance + (monthlyPayment * 12) + annualLicensing + (monthlyOverhead * 12);
  const fixedCostPerMile = annualFixedCosts / annualMiles;
  const fixedCostAllocation = fixedCostPerMile * totalMiles;

  // Calculate service fees
  const serviceFees = calculateServiceFees(input, userSettings);

  // DC (Distribution Center) fees - $75 per DC stop
  const dcFees = (input.isDCPickup ? DEFAULT_DC_FEE : 0) + (input.isDCDelivery ? DEFAULT_DC_FEE : 0);

  // Hotel cost estimation for multi-day trips (HOS compliance)
  // Drivers can only drive 11 hours per day, trips longer require overnight stays
  const estimatedDriveHours = totalMiles / 50; // avg 50mph with stops
  const overnightStays = Math.floor(estimatedDriveHours / MAX_DRIVING_HOURS_PER_DAY);
  const hotelCost = overnightStays * HOTEL_COST_PER_NIGHT;

  // Total operating cost
  const totalCost = fuelCost + defCost + maintenanceCost + tireCost + fixedCostAllocation + dcFees + hotelCost + serviceFees.total;
  const costPerMile = totalCost / totalMiles;

  // Get multipliers
  const weatherMultiplier = WEATHER_MULTIPLIERS[input.weatherCondition || 'normal'];
  const loadTypeMultiplier = LOAD_TYPE_MULTIPLIERS[input.loadType || 'full_truckload'];
  const freightClassMultiplier = FREIGHT_CLASS_MULTIPLIERS[input.freightClass || 'dry_van'];

  // Weight adjustment multiplier - loads over 10,000 lbs incur additional cost
  // Formula: 1.0 + (weight - 10000) * 0.00002 for weights over 10k
  const loadWeight = input.loadWeight || 0;
  const weightMultiplier = loadWeight > 10000
    ? 1.0 + (loadWeight - 10000) * 0.00002
    : 1.0;

  // Seasonal multiplier - based on industry demand patterns
  const season = (input.season || 'fall').toLowerCase();
  const seasonalMultiplier = SEASONAL_MULTIPLIERS[season] || 1.0;

  // Service multipliers from user settings
  const serviceMultiplier = calculateServiceMultiplier(input, userSettings);

  const totalMultiplier = weatherMultiplier * loadTypeMultiplier * freightClassMultiplier * weightMultiplier * seasonalMultiplier * serviceMultiplier;

  // Calculate rates
  const baseRate = BASE_RATES[vehicleType];
  const profitMarginRate = userSettings?.profitMargin ? Number(userSettings.profitMargin) : 0.15;

  // Rate per mile with margin
  const targetRatePerMile = (costPerMile / (1 - profitMarginRate)) * totalMultiplier;
  const ratePerMile = Math.max(targetRatePerMile, baseRate * totalMultiplier);

  // Pre-factoring rates
  const preFactoringRate = Math.round(ratePerMile * totalMiles);

  // Apply factoring fee to final rate (factoring companies charge 2-5% of invoice)
  const factoringRate = userSettings?.factoringRate ? Number(userSettings.factoringRate) : 0.03;
  const factoringFee = Math.round(preFactoringRate * factoringRate);

  // Final rates (factoring fee added to cover the cost of quick payment)
  const recommendedRate = preFactoringRate + factoringFee;
  const minRate = Math.round(recommendedRate * 0.85);
  const maxRate = Math.round(recommendedRate * 1.20);

  // Profit calculations (factoring is a cost, so subtract from profit)
  const totalCostWithFactoring = totalCost + factoringFee;
  const estimatedProfit = recommendedRate - totalCostWithFactoring;
  const profitPerMile = estimatedProfit / totalMiles;
  const actualProfitMargin = estimatedProfit / recommendedRate;

  // Fuel calculations
  const estimatedGallons = totalMiles / mpg;

  return {
    recommendedRate,
    minRate,
    maxRate,
    ratePerMile: Math.round(ratePerMile * 100) / 100,
    costPerMile: Math.round(costPerMile * 100) / 100,

    costBreakdown: {
      fuelCost: Math.round(fuelCost * 100) / 100,
      defCost: Math.round(defCost * 100) / 100,
      maintenanceCost: Math.round(maintenanceCost * 100) / 100,
      tireCost: Math.round(tireCost * 100) / 100,
      fixedCostAllocation: Math.round(fixedCostAllocation * 100) / 100,
      dcFees: Math.round(dcFees * 100) / 100,
      hotelCost: Math.round(hotelCost * 100) / 100,
      serviceFees: serviceFees.total,
      factoringFee: Math.round(factoringFee * 100) / 100,
      totalCost: Math.round(totalCostWithFactoring * 100) / 100,
    },

    serviceFees,

    profitMargin: Math.round(actualProfitMargin * 100) / 100,
    estimatedProfit: Math.round(estimatedProfit * 100) / 100,
    profitPerMile: Math.round(profitPerMile * 100) / 100,

    totalMiles,
    deadheadMiles,
    loadedMiles,
    estimatedDriveHours: Math.round(estimatedDriveHours * 10) / 10,

    multipliersApplied: {
      weather: weatherMultiplier,
      loadType: loadTypeMultiplier,
      freightClass: freightClassMultiplier,
      services: serviceMultiplier,
      weight: Math.round(weightMultiplier * 1000) / 1000,
      seasonal: seasonalMultiplier,
      total: Math.round(totalMultiplier * 100) / 100,
    },

    fuelPriceUsed: fuelPrice,
    estimatedGallons: Math.round(estimatedGallons * 10) / 10,
  };
}

/**
 * Calculate service fees based on selected options
 */
function calculateServiceFees(input: RateCalculationInput, userSettings: any) {
  const fees = {
    expediteFee: 0,
    teamFee: 0,
    rushFee: 0,
    sameDayFee: 0,
    liftgateFee: 0,
    palletJackFee: 0,
    driverAssistFee: 0,
    whiteGloveFee: 0,
    trackingFee: 0,
    reeferFee: 0,
    total: 0,
  };

  // Get fee rates from user settings or use defaults
  const liftgateFee = userSettings?.liftgateFee ? Number(userSettings.liftgateFee) : 75;
  const palletJackFee = userSettings?.palletJackFee ? Number(userSettings.palletJackFee) : 50;
  const driverAssistFee = userSettings?.driverAssistFee ? Number(userSettings.driverAssistFee) : 100;
  const whiteGloveFee = userSettings?.whiteGloveFee ? Number(userSettings.whiteGloveFee) : 250;
  const trackingFee = userSettings?.trackingFee ? Number(userSettings.trackingFee) : 25;

  if (input.requiresLiftgate) fees.liftgateFee = liftgateFee;
  if (input.requiresPalletJack) fees.palletJackFee = palletJackFee;
  if (input.requiresDriverAssist) fees.driverAssistFee = driverAssistFee;
  if (input.requiresWhiteGlove) fees.whiteGloveFee = whiteGloveFee;
  if (input.requiresTracking) fees.trackingFee = trackingFee;

  // Reefer fee (based on estimated hours)
  if (input.isReefer) {
    const estimatedHours = input.totalMiles / 50;
    const reeferFuelPerHour = userSettings?.reeferFuelPerHour ? Number(userSettings.reeferFuelPerHour) : 1.5;
    const reeferMaintenancePerHour = userSettings?.reeferMaintenancePerHour ? Number(userSettings.reeferMaintenancePerHour) : 25;
    fees.reeferFee = Math.round((reeferFuelPerHour + reeferMaintenancePerHour) * estimatedHours);
  }

  fees.total = fees.liftgateFee + fees.palletJackFee + fees.driverAssistFee +
    fees.whiteGloveFee + fees.trackingFee + fees.reeferFee;

  return fees;
}

/**
 * Calculate service multiplier based on expedite/team/rush options
 */
function calculateServiceMultiplier(input: RateCalculationInput, userSettings: any): number {
  let multiplier = 1.0;

  const expediteMultiplier = userSettings?.expediteMultiplier ? Number(userSettings.expediteMultiplier) : 1.30;
  const teamMultiplier = userSettings?.teamMultiplier ? Number(userSettings.teamMultiplier) : 1.50;
  const rushMultiplier = userSettings?.rushMultiplier ? Number(userSettings.rushMultiplier) : 1.50;
  const sameDayMultiplier = userSettings?.sameDayMultiplier ? Number(userSettings.sameDayMultiplier) : 2.00;

  // These are multiplicative, take the highest applicable
  if (input.isSameDay) {
    multiplier = Math.max(multiplier, sameDayMultiplier);
  } else if (input.isRush) {
    multiplier = Math.max(multiplier, rushMultiplier);
  } else if (input.isExpedite) {
    multiplier = Math.max(multiplier, expediteMultiplier);
  }

  // Team is additive
  if (input.isTeam) {
    multiplier *= teamMultiplier;
  }

  return multiplier;
}

/**
 * Get fuel price for a state (from cache or default)
 */
async function getFuelPrice(stateCode?: string): Promise<number | null> {
  if (!stateCode) return null;

  try {
    const cached = await prisma.fuelPriceCache.findFirst({
      where: {
        stateCode: stateCode.toUpperCase(),
        fuelType: 'diesel',
        expiresAt: { gt: new Date() },
      },
      orderBy: { fetchedAt: 'desc' },
    });

    if (cached) {
      return Number(cached.pricePerGallon);
    }
  } catch (error) {
    console.error('Error fetching fuel price:', error);
  }

  return null;
}
