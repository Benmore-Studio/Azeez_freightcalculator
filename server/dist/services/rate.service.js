import { prisma } from './prisma.js';
// National average diesel price (fallback)
const DEFAULT_DIESEL_PRICE = 4.00;
// Base rates per mile by vehicle type
const BASE_RATES = {
    semi: 2.50,
    box_truck: 2.00,
    cargo_van: 1.75,
    sprinter: 1.60,
    reefer: 3.00,
};
// Vehicle type defaults for cost calculations
const VEHICLE_DEFAULTS = {
    semi: { mpg: 6.5, maintenanceCpm: 0.35, tireCpm: 0.05 },
    box_truck: { mpg: 10, maintenanceCpm: 0.20, tireCpm: 0.03 },
    cargo_van: { mpg: 18, maintenanceCpm: 0.15, tireCpm: 0.02 },
    sprinter: { mpg: 20, maintenanceCpm: 0.12, tireCpm: 0.02 },
    reefer: { mpg: 5.5, maintenanceCpm: 0.40, tireCpm: 0.06 },
};
// Weather condition multipliers
const WEATHER_MULTIPLIERS = {
    normal: 1.0,
    light_rain: 1.05,
    heavy_rain: 1.15,
    snow: 1.25,
    ice: 1.40,
    extreme_weather: 1.50,
    fog: 1.10,
};
// Load type multipliers
const LOAD_TYPE_MULTIPLIERS = {
    full_truckload: 1.0,
    partial: 0.85,
    ltl: 0.75,
};
// Freight class multipliers (hazmat, etc.)
const FREIGHT_CLASS_MULTIPLIERS = {
    dry_van: 1.0,
    refrigerated: 1.15,
    flatbed: 1.10,
    oversized: 1.35,
    hazmat: 1.50,
    tanker: 1.25,
};
/**
 * Calculate freight rate based on inputs and user settings
 */
export async function calculateRate(userId, input) {
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
    // Total operating cost
    const totalCost = fuelCost + maintenanceCost + tireCost + fixedCostAllocation + serviceFees.total;
    const costPerMile = totalCost / totalMiles;
    // Get multipliers
    const weatherMultiplier = WEATHER_MULTIPLIERS[input.weatherCondition || 'normal'];
    const loadTypeMultiplier = LOAD_TYPE_MULTIPLIERS[input.loadType || 'full_truckload'];
    const freightClassMultiplier = FREIGHT_CLASS_MULTIPLIERS[input.freightClass || 'dry_van'];
    // Service multipliers from user settings
    const serviceMultiplier = calculateServiceMultiplier(input, userSettings);
    const totalMultiplier = weatherMultiplier * loadTypeMultiplier * freightClassMultiplier * serviceMultiplier;
    // Calculate rates
    const baseRate = BASE_RATES[vehicleType];
    const profitMarginRate = userSettings?.profitMargin ? Number(userSettings.profitMargin) : 0.15;
    // Rate per mile with margin
    const targetRatePerMile = (costPerMile / (1 - profitMarginRate)) * totalMultiplier;
    const ratePerMile = Math.max(targetRatePerMile, baseRate * totalMultiplier);
    // Final rates
    const recommendedRate = Math.round(ratePerMile * totalMiles);
    const minRate = Math.round(recommendedRate * 0.85);
    const maxRate = Math.round(recommendedRate * 1.20);
    // Profit calculations
    const estimatedProfit = recommendedRate - totalCost;
    const profitPerMile = estimatedProfit / totalMiles;
    const actualProfitMargin = estimatedProfit / recommendedRate;
    // Estimate drive time (avg 50mph with stops)
    const estimatedDriveHours = totalMiles / 50;
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
            maintenanceCost: Math.round(maintenanceCost * 100) / 100,
            tireCost: Math.round(tireCost * 100) / 100,
            fixedCostAllocation: Math.round(fixedCostAllocation * 100) / 100,
            serviceFees: serviceFees.total,
            totalCost: Math.round(totalCost * 100) / 100,
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
            total: Math.round(totalMultiplier * 100) / 100,
        },
        fuelPriceUsed: fuelPrice,
        estimatedGallons: Math.round(estimatedGallons * 10) / 10,
    };
}
/**
 * Calculate service fees based on selected options
 */
function calculateServiceFees(input, userSettings) {
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
    if (input.requiresLiftgate)
        fees.liftgateFee = liftgateFee;
    if (input.requiresPalletJack)
        fees.palletJackFee = palletJackFee;
    if (input.requiresDriverAssist)
        fees.driverAssistFee = driverAssistFee;
    if (input.requiresWhiteGlove)
        fees.whiteGloveFee = whiteGloveFee;
    if (input.requiresTracking)
        fees.trackingFee = trackingFee;
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
function calculateServiceMultiplier(input, userSettings) {
    let multiplier = 1.0;
    const expediteMultiplier = userSettings?.expediteMultiplier ? Number(userSettings.expediteMultiplier) : 1.30;
    const teamMultiplier = userSettings?.teamMultiplier ? Number(userSettings.teamMultiplier) : 1.50;
    const rushMultiplier = userSettings?.rushMultiplier ? Number(userSettings.rushMultiplier) : 1.50;
    const sameDayMultiplier = userSettings?.sameDayMultiplier ? Number(userSettings.sameDayMultiplier) : 2.00;
    // These are multiplicative, take the highest applicable
    if (input.isSameDay) {
        multiplier = Math.max(multiplier, sameDayMultiplier);
    }
    else if (input.isRush) {
        multiplier = Math.max(multiplier, rushMultiplier);
    }
    else if (input.isExpedite) {
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
async function getFuelPrice(stateCode) {
    if (!stateCode)
        return null;
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
    }
    catch (error) {
        console.error('Error fetching fuel price:', error);
    }
    return null;
}
//# sourceMappingURL=rate.service.js.map