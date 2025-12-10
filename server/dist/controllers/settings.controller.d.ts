import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../types/index.js';
export declare const updateSettingsSchema: z.ZodEffects<z.ZodObject<{
    annualInsurance: z.ZodOptional<z.ZodNumber>;
    annual_insurance: z.ZodOptional<z.ZodNumber>;
    monthlyVehiclePayment: z.ZodOptional<z.ZodNumber>;
    monthly_vehicle_payment: z.ZodOptional<z.ZodNumber>;
    annualMiles: z.ZodOptional<z.ZodNumber>;
    annual_miles: z.ZodOptional<z.ZodNumber>;
    annualLicensing: z.ZodOptional<z.ZodNumber>;
    annual_licensing: z.ZodOptional<z.ZodNumber>;
    monthlyOverhead: z.ZodOptional<z.ZodNumber>;
    monthly_overhead: z.ZodOptional<z.ZodNumber>;
    maintenanceCpm: z.ZodOptional<z.ZodNumber>;
    maintenance_cpm: z.ZodOptional<z.ZodNumber>;
    tireCpm: z.ZodOptional<z.ZodNumber>;
    tire_cpm: z.ZodOptional<z.ZodNumber>;
    factoringRate: z.ZodOptional<z.ZodNumber>;
    factoring_rate: z.ZodOptional<z.ZodNumber>;
    profitMargin: z.ZodOptional<z.ZodNumber>;
    profit_margin: z.ZodOptional<z.ZodNumber>;
    expediteMultiplier: z.ZodOptional<z.ZodNumber>;
    expedite_multiplier: z.ZodOptional<z.ZodNumber>;
    teamMultiplier: z.ZodOptional<z.ZodNumber>;
    team_multiplier: z.ZodOptional<z.ZodNumber>;
    rushMultiplier: z.ZodOptional<z.ZodNumber>;
    rush_multiplier: z.ZodOptional<z.ZodNumber>;
    sameDayMultiplier: z.ZodOptional<z.ZodNumber>;
    same_day_multiplier: z.ZodOptional<z.ZodNumber>;
    detentionRatePerHour: z.ZodOptional<z.ZodNumber>;
    detention_rate_per_hour: z.ZodOptional<z.ZodNumber>;
    driverAssistFee: z.ZodOptional<z.ZodNumber>;
    driver_assist_fee: z.ZodOptional<z.ZodNumber>;
    whiteGloveFee: z.ZodOptional<z.ZodNumber>;
    white_glove_fee: z.ZodOptional<z.ZodNumber>;
    trackingFee: z.ZodOptional<z.ZodNumber>;
    tracking_fee: z.ZodOptional<z.ZodNumber>;
    specialEquipmentFee: z.ZodOptional<z.ZodNumber>;
    special_equipment_fee: z.ZodOptional<z.ZodNumber>;
    liftgateFee: z.ZodOptional<z.ZodNumber>;
    liftgate_fee: z.ZodOptional<z.ZodNumber>;
    palletJackFee: z.ZodOptional<z.ZodNumber>;
    pallet_jack_fee: z.ZodOptional<z.ZodNumber>;
    defPricePerGallon: z.ZodOptional<z.ZodNumber>;
    def_price_per_gallon: z.ZodOptional<z.ZodNumber>;
    reeferMaintenancePerHour: z.ZodOptional<z.ZodNumber>;
    reefer_maintenance_per_hour: z.ZodOptional<z.ZodNumber>;
    reeferFuelPerHour: z.ZodOptional<z.ZodNumber>;
    reefer_fuel_per_hour: z.ZodOptional<z.ZodNumber>;
    defaultDeadheadMiles: z.ZodOptional<z.ZodNumber>;
    default_deadhead_miles: z.ZodOptional<z.ZodNumber>;
    useIndustryDefaults: z.ZodOptional<z.ZodBoolean>;
    use_industry_defaults: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    annualInsurance?: number | undefined;
    monthlyVehiclePayment?: number | undefined;
    annualMiles?: number | undefined;
    annualLicensing?: number | undefined;
    monthlyOverhead?: number | undefined;
    maintenanceCpm?: number | undefined;
    tireCpm?: number | undefined;
    factoringRate?: number | undefined;
    profitMargin?: number | undefined;
    expediteMultiplier?: number | undefined;
    teamMultiplier?: number | undefined;
    rushMultiplier?: number | undefined;
    sameDayMultiplier?: number | undefined;
    detentionRatePerHour?: number | undefined;
    driverAssistFee?: number | undefined;
    whiteGloveFee?: number | undefined;
    trackingFee?: number | undefined;
    specialEquipmentFee?: number | undefined;
    liftgateFee?: number | undefined;
    palletJackFee?: number | undefined;
    defPricePerGallon?: number | undefined;
    reeferMaintenancePerHour?: number | undefined;
    reeferFuelPerHour?: number | undefined;
    useIndustryDefaults?: boolean | undefined;
    defaultDeadheadMiles?: number | undefined;
    annual_insurance?: number | undefined;
    monthly_vehicle_payment?: number | undefined;
    annual_miles?: number | undefined;
    annual_licensing?: number | undefined;
    monthly_overhead?: number | undefined;
    maintenance_cpm?: number | undefined;
    tire_cpm?: number | undefined;
    factoring_rate?: number | undefined;
    profit_margin?: number | undefined;
    expedite_multiplier?: number | undefined;
    team_multiplier?: number | undefined;
    rush_multiplier?: number | undefined;
    same_day_multiplier?: number | undefined;
    detention_rate_per_hour?: number | undefined;
    driver_assist_fee?: number | undefined;
    white_glove_fee?: number | undefined;
    tracking_fee?: number | undefined;
    special_equipment_fee?: number | undefined;
    liftgate_fee?: number | undefined;
    pallet_jack_fee?: number | undefined;
    def_price_per_gallon?: number | undefined;
    reefer_maintenance_per_hour?: number | undefined;
    reefer_fuel_per_hour?: number | undefined;
    default_deadhead_miles?: number | undefined;
    use_industry_defaults?: boolean | undefined;
}, {
    annualInsurance?: number | undefined;
    monthlyVehiclePayment?: number | undefined;
    annualMiles?: number | undefined;
    annualLicensing?: number | undefined;
    monthlyOverhead?: number | undefined;
    maintenanceCpm?: number | undefined;
    tireCpm?: number | undefined;
    factoringRate?: number | undefined;
    profitMargin?: number | undefined;
    expediteMultiplier?: number | undefined;
    teamMultiplier?: number | undefined;
    rushMultiplier?: number | undefined;
    sameDayMultiplier?: number | undefined;
    detentionRatePerHour?: number | undefined;
    driverAssistFee?: number | undefined;
    whiteGloveFee?: number | undefined;
    trackingFee?: number | undefined;
    specialEquipmentFee?: number | undefined;
    liftgateFee?: number | undefined;
    palletJackFee?: number | undefined;
    defPricePerGallon?: number | undefined;
    reeferMaintenancePerHour?: number | undefined;
    reeferFuelPerHour?: number | undefined;
    useIndustryDefaults?: boolean | undefined;
    defaultDeadheadMiles?: number | undefined;
    annual_insurance?: number | undefined;
    monthly_vehicle_payment?: number | undefined;
    annual_miles?: number | undefined;
    annual_licensing?: number | undefined;
    monthly_overhead?: number | undefined;
    maintenance_cpm?: number | undefined;
    tire_cpm?: number | undefined;
    factoring_rate?: number | undefined;
    profit_margin?: number | undefined;
    expedite_multiplier?: number | undefined;
    team_multiplier?: number | undefined;
    rush_multiplier?: number | undefined;
    same_day_multiplier?: number | undefined;
    detention_rate_per_hour?: number | undefined;
    driver_assist_fee?: number | undefined;
    white_glove_fee?: number | undefined;
    tracking_fee?: number | undefined;
    special_equipment_fee?: number | undefined;
    liftgate_fee?: number | undefined;
    pallet_jack_fee?: number | undefined;
    def_price_per_gallon?: number | undefined;
    reefer_maintenance_per_hour?: number | undefined;
    reefer_fuel_per_hour?: number | undefined;
    default_deadhead_miles?: number | undefined;
    use_industry_defaults?: boolean | undefined;
}>, {
    annualInsurance: number | undefined;
    monthlyVehiclePayment: number | undefined;
    annualMiles: number | undefined;
    annualLicensing: number | undefined;
    monthlyOverhead: number | undefined;
    maintenanceCpm: number | undefined;
    tireCpm: number | undefined;
    factoringRate: number | undefined;
    profitMargin: number | undefined;
    expediteMultiplier: number | undefined;
    teamMultiplier: number | undefined;
    rushMultiplier: number | undefined;
    sameDayMultiplier: number | undefined;
    detentionRatePerHour: number | undefined;
    driverAssistFee: number | undefined;
    whiteGloveFee: number | undefined;
    trackingFee: number | undefined;
    specialEquipmentFee: number | undefined;
    liftgateFee: number | undefined;
    palletJackFee: number | undefined;
    defPricePerGallon: number | undefined;
    reeferMaintenancePerHour: number | undefined;
    reeferFuelPerHour: number | undefined;
    defaultDeadheadMiles: number | undefined;
    useIndustryDefaults: boolean | undefined;
}, {
    annualInsurance?: number | undefined;
    monthlyVehiclePayment?: number | undefined;
    annualMiles?: number | undefined;
    annualLicensing?: number | undefined;
    monthlyOverhead?: number | undefined;
    maintenanceCpm?: number | undefined;
    tireCpm?: number | undefined;
    factoringRate?: number | undefined;
    profitMargin?: number | undefined;
    expediteMultiplier?: number | undefined;
    teamMultiplier?: number | undefined;
    rushMultiplier?: number | undefined;
    sameDayMultiplier?: number | undefined;
    detentionRatePerHour?: number | undefined;
    driverAssistFee?: number | undefined;
    whiteGloveFee?: number | undefined;
    trackingFee?: number | undefined;
    specialEquipmentFee?: number | undefined;
    liftgateFee?: number | undefined;
    palletJackFee?: number | undefined;
    defPricePerGallon?: number | undefined;
    reeferMaintenancePerHour?: number | undefined;
    reeferFuelPerHour?: number | undefined;
    useIndustryDefaults?: boolean | undefined;
    defaultDeadheadMiles?: number | undefined;
    annual_insurance?: number | undefined;
    monthly_vehicle_payment?: number | undefined;
    annual_miles?: number | undefined;
    annual_licensing?: number | undefined;
    monthly_overhead?: number | undefined;
    maintenance_cpm?: number | undefined;
    tire_cpm?: number | undefined;
    factoring_rate?: number | undefined;
    profit_margin?: number | undefined;
    expedite_multiplier?: number | undefined;
    team_multiplier?: number | undefined;
    rush_multiplier?: number | undefined;
    same_day_multiplier?: number | undefined;
    detention_rate_per_hour?: number | undefined;
    driver_assist_fee?: number | undefined;
    white_glove_fee?: number | undefined;
    tracking_fee?: number | undefined;
    special_equipment_fee?: number | undefined;
    liftgate_fee?: number | undefined;
    pallet_jack_fee?: number | undefined;
    def_price_per_gallon?: number | undefined;
    reefer_maintenance_per_hour?: number | undefined;
    reefer_fuel_per_hour?: number | undefined;
    default_deadhead_miles?: number | undefined;
    use_industry_defaults?: boolean | undefined;
}>;
export declare const resetDefaultsSchema: z.ZodEffects<z.ZodObject<{
    vehicleType: z.ZodOptional<z.ZodEnum<["semi", "box_truck", "cargo_van", "sprinter", "reefer"]>>;
    vehicle_type: z.ZodOptional<z.ZodEnum<["semi", "box_truck", "cargo_van", "sprinter", "reefer"]>>;
}, "strip", z.ZodTypeAny, {
    vehicleType?: "semi" | "box_truck" | "cargo_van" | "sprinter" | "reefer" | undefined;
    vehicle_type?: "semi" | "box_truck" | "cargo_van" | "sprinter" | "reefer" | undefined;
}, {
    vehicleType?: "semi" | "box_truck" | "cargo_van" | "sprinter" | "reefer" | undefined;
    vehicle_type?: "semi" | "box_truck" | "cargo_van" | "sprinter" | "reefer" | undefined;
}>, {
    vehicleType: "semi" | "box_truck" | "cargo_van" | "sprinter" | "reefer" | undefined;
}, {
    vehicleType?: "semi" | "box_truck" | "cargo_van" | "sprinter" | "reefer" | undefined;
    vehicle_type?: "semi" | "box_truck" | "cargo_van" | "sprinter" | "reefer" | undefined;
}>;
/**
 * Get current user settings
 * @route GET /api/settings
 */
export declare function getSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * Update user settings
 * @route PUT /api/settings
 */
export declare function updateSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * Reset settings to industry defaults
 * @route POST /api/settings/reset-defaults
 */
export declare function resetDefaults(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
/**
 * Get industry defaults (optionally for a specific vehicle type)
 * @route GET /api/settings/defaults
 */
export declare function getDefaults(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=settings.controller.d.ts.map