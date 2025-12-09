import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import * as settingsService from '../services/settings.service.js';
import { sendSuccess } from '../utils/response.js';
import { ApiError } from '../utils/ApiError.js';
import type { AuthenticatedRequest } from '../types/index.js';

// Validation schema for updating settings
export const updateSettingsSchema = z.object({
  // Fixed costs
  annualInsurance: z.number().positive('Annual insurance must be positive').optional(),
  annual_insurance: z.number().positive('Annual insurance must be positive').optional(),
  monthlyVehiclePayment: z.number().min(0, 'Monthly vehicle payment cannot be negative').optional(),
  monthly_vehicle_payment: z.number().min(0, 'Monthly vehicle payment cannot be negative').optional(),
  annualMiles: z.number().int().positive('Annual miles must be a positive integer').optional(),
  annual_miles: z.number().int().positive('Annual miles must be a positive integer').optional(),
  annualLicensing: z.number().min(0, 'Annual licensing cannot be negative').optional(),
  annual_licensing: z.number().min(0, 'Annual licensing cannot be negative').optional(),
  monthlyOverhead: z.number().min(0, 'Monthly overhead cannot be negative').optional(),
  monthly_overhead: z.number().min(0, 'Monthly overhead cannot be negative').optional(),

  // Variable costs (per mile)
  maintenanceCpm: z.number().min(0, 'Maintenance CPM cannot be negative').max(5, 'Maintenance CPM seems too high').optional(),
  maintenance_cpm: z.number().min(0, 'Maintenance CPM cannot be negative').max(5, 'Maintenance CPM seems too high').optional(),
  tireCpm: z.number().min(0, 'Tire CPM cannot be negative').max(1, 'Tire CPM seems too high').optional(),
  tire_cpm: z.number().min(0, 'Tire CPM cannot be negative').max(1, 'Tire CPM seems too high').optional(),

  // Financial rates (as decimals, e.g., 0.03 for 3%)
  factoringRate: z.number().min(0, 'Factoring rate cannot be negative').max(0.2, 'Factoring rate cannot exceed 20%').optional(),
  factoring_rate: z.number().min(0, 'Factoring rate cannot be negative').max(0.2, 'Factoring rate cannot exceed 20%').optional(),
  profitMargin: z.number().min(0, 'Profit margin cannot be negative').max(1, 'Profit margin cannot exceed 100%').optional(),
  profit_margin: z.number().min(0, 'Profit margin cannot be negative').max(1, 'Profit margin cannot exceed 100%').optional(),

  // Service multipliers (1.0 = no change, 1.5 = 50% increase)
  expediteMultiplier: z.number().min(1, 'Expedite multiplier must be at least 1.0').max(5, 'Expedite multiplier seems too high').optional(),
  expedite_multiplier: z.number().min(1, 'Expedite multiplier must be at least 1.0').max(5, 'Expedite multiplier seems too high').optional(),
  teamMultiplier: z.number().min(1, 'Team multiplier must be at least 1.0').max(5, 'Team multiplier seems too high').optional(),
  team_multiplier: z.number().min(1, 'Team multiplier must be at least 1.0').max(5, 'Team multiplier seems too high').optional(),
  rushMultiplier: z.number().min(1, 'Rush multiplier must be at least 1.0').max(5, 'Rush multiplier seems too high').optional(),
  rush_multiplier: z.number().min(1, 'Rush multiplier must be at least 1.0').max(5, 'Rush multiplier seems too high').optional(),
  sameDayMultiplier: z.number().min(1, 'Same-day multiplier must be at least 1.0').max(5, 'Same-day multiplier seems too high').optional(),
  same_day_multiplier: z.number().min(1, 'Same-day multiplier must be at least 1.0').max(5, 'Same-day multiplier seems too high').optional(),

  // Service fees
  detentionRatePerHour: z.number().min(0, 'Detention rate cannot be negative').optional(),
  detention_rate_per_hour: z.number().min(0, 'Detention rate cannot be negative').optional(),
  driverAssistFee: z.number().min(0, 'Driver assist fee cannot be negative').optional(),
  driver_assist_fee: z.number().min(0, 'Driver assist fee cannot be negative').optional(),
  whiteGloveFee: z.number().min(0, 'White glove fee cannot be negative').optional(),
  white_glove_fee: z.number().min(0, 'White glove fee cannot be negative').optional(),
  trackingFee: z.number().min(0, 'Tracking fee cannot be negative').optional(),
  tracking_fee: z.number().min(0, 'Tracking fee cannot be negative').optional(),
  specialEquipmentFee: z.number().min(0, 'Special equipment fee cannot be negative').optional(),
  special_equipment_fee: z.number().min(0, 'Special equipment fee cannot be negative').optional(),
  liftgateFee: z.number().min(0, 'Liftgate fee cannot be negative').optional(),
  liftgate_fee: z.number().min(0, 'Liftgate fee cannot be negative').optional(),
  palletJackFee: z.number().min(0, 'Pallet jack fee cannot be negative').optional(),
  pallet_jack_fee: z.number().min(0, 'Pallet jack fee cannot be negative').optional(),

  // Reefer costs
  defPricePerGallon: z.number().min(0, 'DEF price cannot be negative').optional(),
  def_price_per_gallon: z.number().min(0, 'DEF price cannot be negative').optional(),
  reeferMaintenancePerHour: z.number().min(0, 'Reefer maintenance cost cannot be negative').optional(),
  reefer_maintenance_per_hour: z.number().min(0, 'Reefer maintenance cost cannot be negative').optional(),
  reeferFuelPerHour: z.number().min(0, 'Reefer fuel cost cannot be negative').optional(),
  reefer_fuel_per_hour: z.number().min(0, 'Reefer fuel cost cannot be negative').optional(),

  // Preferences
  defaultDeadheadMiles: z.number().int().min(0, 'Default deadhead miles cannot be negative').optional(),
  default_deadhead_miles: z.number().int().min(0, 'Default deadhead miles cannot be negative').optional(),
  useIndustryDefaults: z.boolean().optional(),
  use_industry_defaults: z.boolean().optional(),
}).transform((data) => ({
  // Transform snake_case to camelCase, preferring camelCase if both provided
  annualInsurance: data.annualInsurance ?? data.annual_insurance,
  monthlyVehiclePayment: data.monthlyVehiclePayment ?? data.monthly_vehicle_payment,
  annualMiles: data.annualMiles ?? data.annual_miles,
  annualLicensing: data.annualLicensing ?? data.annual_licensing,
  monthlyOverhead: data.monthlyOverhead ?? data.monthly_overhead,
  maintenanceCpm: data.maintenanceCpm ?? data.maintenance_cpm,
  tireCpm: data.tireCpm ?? data.tire_cpm,
  factoringRate: data.factoringRate ?? data.factoring_rate,
  profitMargin: data.profitMargin ?? data.profit_margin,
  expediteMultiplier: data.expediteMultiplier ?? data.expedite_multiplier,
  teamMultiplier: data.teamMultiplier ?? data.team_multiplier,
  rushMultiplier: data.rushMultiplier ?? data.rush_multiplier,
  sameDayMultiplier: data.sameDayMultiplier ?? data.same_day_multiplier,
  detentionRatePerHour: data.detentionRatePerHour ?? data.detention_rate_per_hour,
  driverAssistFee: data.driverAssistFee ?? data.driver_assist_fee,
  whiteGloveFee: data.whiteGloveFee ?? data.white_glove_fee,
  trackingFee: data.trackingFee ?? data.tracking_fee,
  specialEquipmentFee: data.specialEquipmentFee ?? data.special_equipment_fee,
  liftgateFee: data.liftgateFee ?? data.liftgate_fee,
  palletJackFee: data.palletJackFee ?? data.pallet_jack_fee,
  defPricePerGallon: data.defPricePerGallon ?? data.def_price_per_gallon,
  reeferMaintenancePerHour: data.reeferMaintenancePerHour ?? data.reefer_maintenance_per_hour,
  reeferFuelPerHour: data.reeferFuelPerHour ?? data.reefer_fuel_per_hour,
  defaultDeadheadMiles: data.defaultDeadheadMiles ?? data.default_deadhead_miles,
  useIndustryDefaults: data.useIndustryDefaults ?? data.use_industry_defaults,
}));

// Validation schema for reset defaults
export const resetDefaultsSchema = z.object({
  vehicleType: z.enum(['semi', 'box_truck', 'cargo_van', 'sprinter', 'reefer']).optional(),
  vehicle_type: z.enum(['semi', 'box_truck', 'cargo_van', 'sprinter', 'reefer']).optional(),
}).transform((data) => ({
  vehicleType: data.vehicleType ?? data.vehicle_type,
}));

/**
 * Get current user settings
 * @route GET /api/settings
 */
export async function getSettings(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const settings = await settingsService.getSettings(req.user.userId);
    sendSuccess(res, settings);
  } catch (error) {
    next(error);
  }
}

/**
 * Update user settings
 * @route PUT /api/settings
 */
export async function updateSettings(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const validatedData = updateSettingsSchema.parse(req.body);

    // Filter out undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(validatedData).filter(([, value]) => value !== undefined)
    ) as settingsService.SettingsInput;

    const settings = await settingsService.updateSettings(req.user.userId, cleanedData);
    sendSuccess(res, settings, 'Settings updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Reset settings to industry defaults
 * @route POST /api/settings/reset-defaults
 */
export async function resetDefaults(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const { vehicleType } = resetDefaultsSchema.parse(req.body);
    const settings = await settingsService.resetToDefaults(req.user.userId, vehicleType);
    sendSuccess(res, settings, 'Settings reset to industry defaults');
  } catch (error) {
    next(error);
  }
}

/**
 * Get industry defaults (optionally for a specific vehicle type)
 * @route GET /api/settings/defaults
 */
export async function getDefaults(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const vehicleType = req.query.vehicleType as string | undefined;

    // Validate vehicle type if provided
    if (vehicleType && !['semi', 'box_truck', 'cargo_van', 'sprinter', 'reefer'].includes(vehicleType)) {
      throw ApiError.badRequest('Invalid vehicle type');
    }

    const defaults = settingsService.getIndustryDefaults(
      vehicleType as 'semi' | 'box_truck' | 'cargo_van' | 'sprinter' | 'reefer' | undefined
    );
    sendSuccess(res, defaults);
  } catch (error) {
    next(error);
  }
}
