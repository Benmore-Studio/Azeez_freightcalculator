import { prisma } from './prisma.js';
import { ApiError } from '../utils/ApiError.js';

// Define VehicleType locally to match Prisma schema
type VehicleType = 'semi' | 'box_truck' | 'cargo_van' | 'sprinter' | 'reefer';

// Industry defaults by vehicle type
const INDUSTRY_DEFAULTS: Record<VehicleType, { maintenanceCpm: number; annualMiles: number }> = {
  semi: {
    maintenanceCpm: 0.35,
    annualMiles: 120000,
  },
  box_truck: {
    maintenanceCpm: 0.20,
    annualMiles: 50000,
  },
  cargo_van: {
    maintenanceCpm: 0.15,
    annualMiles: 75000,
  },
  sprinter: {
    maintenanceCpm: 0.18,
    annualMiles: 60000,
  },
  reefer: {
    maintenanceCpm: 0.40,
    annualMiles: 110000,
  },
} as const;

// Base defaults (used when no vehicle type specified)
const BASE_DEFAULTS = {
  annualInsurance: 12000.00,
  monthlyVehiclePayment: 1500.00,
  annualMiles: 100000,
  maintenanceCpm: 0.15,
  annualLicensing: 2500.00,
  monthlyOverhead: 500.00,
  factoringRate: 0.03,
  profitMargin: 0.15,
  expediteMultiplier: 1.30,
  teamMultiplier: 1.50,
  rushMultiplier: 1.50,
  sameDayMultiplier: 2.00,
  detentionRatePerHour: 75.00,
  driverAssistFee: 100.00,
  whiteGloveFee: 250.00,
  trackingFee: 25.00,
  specialEquipmentFee: 150.00,
  liftgateFee: 75.00,
  palletJackFee: 50.00,
  defPricePerGallon: 3.50,
  reeferMaintenancePerHour: 25.00,
  reeferFuelPerHour: 1.50,
  tireCpm: 0.05,
  defaultDeadheadMiles: 50,
};

export interface SettingsInput {
  annualInsurance?: number;
  monthlyVehiclePayment?: number;
  annualMiles?: number;
  maintenanceCpm?: number;
  annualLicensing?: number;
  monthlyOverhead?: number;
  factoringRate?: number;
  profitMargin?: number;
  expediteMultiplier?: number;
  teamMultiplier?: number;
  rushMultiplier?: number;
  sameDayMultiplier?: number;
  detentionRatePerHour?: number;
  driverAssistFee?: number;
  whiteGloveFee?: number;
  trackingFee?: number;
  specialEquipmentFee?: number;
  liftgateFee?: number;
  palletJackFee?: number;
  defPricePerGallon?: number;
  reeferMaintenancePerHour?: number;
  reeferFuelPerHour?: number;
  tireCpm?: number;
  defaultDeadheadMiles?: number;
  useIndustryDefaults?: boolean;
}

export interface SettingsResponse {
  id: string;
  userId: string;
  annualInsurance: number;
  monthlyVehiclePayment: number;
  annualMiles: number;
  maintenanceCpm: number;
  annualLicensing: number;
  monthlyOverhead: number;
  factoringRate: number;
  profitMargin: number;
  expediteMultiplier: number;
  teamMultiplier: number;
  rushMultiplier: number;
  sameDayMultiplier: number;
  detentionRatePerHour: number;
  driverAssistFee: number;
  whiteGloveFee: number;
  trackingFee: number;
  specialEquipmentFee: number;
  liftgateFee: number;
  palletJackFee: number;
  defPricePerGallon: number;
  reeferMaintenancePerHour: number;
  reeferFuelPerHour: number;
  tireCpm: number;
  defaultDeadheadMiles: number;
  useIndustryDefaults: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function formatSettings(settings: {
  id: string;
  userId: string;
  annualInsurance: unknown;
  monthlyVehiclePayment: unknown;
  annualMiles: number;
  maintenanceCpm: unknown;
  annualLicensing: unknown;
  monthlyOverhead: unknown;
  factoringRate: unknown;
  profitMargin: unknown;
  expediteMultiplier: unknown;
  teamMultiplier: unknown;
  rushMultiplier: unknown;
  sameDayMultiplier: unknown;
  detentionRatePerHour: unknown;
  driverAssistFee: unknown;
  whiteGloveFee: unknown;
  trackingFee: unknown;
  specialEquipmentFee: unknown;
  liftgateFee: unknown;
  palletJackFee: unknown;
  defPricePerGallon: unknown;
  reeferMaintenancePerHour: unknown;
  reeferFuelPerHour: unknown;
  tireCpm: unknown;
  defaultDeadheadMiles: number;
  useIndustryDefaults: boolean;
  createdAt: Date;
  updatedAt: Date;
}): SettingsResponse {
  return {
    id: settings.id,
    userId: settings.userId,
    annualInsurance: Number(settings.annualInsurance),
    monthlyVehiclePayment: Number(settings.monthlyVehiclePayment),
    annualMiles: settings.annualMiles,
    maintenanceCpm: Number(settings.maintenanceCpm),
    annualLicensing: Number(settings.annualLicensing),
    monthlyOverhead: Number(settings.monthlyOverhead),
    factoringRate: Number(settings.factoringRate),
    profitMargin: Number(settings.profitMargin),
    expediteMultiplier: Number(settings.expediteMultiplier),
    teamMultiplier: Number(settings.teamMultiplier),
    rushMultiplier: Number(settings.rushMultiplier),
    sameDayMultiplier: Number(settings.sameDayMultiplier),
    detentionRatePerHour: Number(settings.detentionRatePerHour),
    driverAssistFee: Number(settings.driverAssistFee),
    whiteGloveFee: Number(settings.whiteGloveFee),
    trackingFee: Number(settings.trackingFee),
    specialEquipmentFee: Number(settings.specialEquipmentFee),
    liftgateFee: Number(settings.liftgateFee),
    palletJackFee: Number(settings.palletJackFee),
    defPricePerGallon: Number(settings.defPricePerGallon),
    reeferMaintenancePerHour: Number(settings.reeferMaintenancePerHour),
    reeferFuelPerHour: Number(settings.reeferFuelPerHour),
    tireCpm: Number(settings.tireCpm),
    defaultDeadheadMiles: settings.defaultDeadheadMiles,
    useIndustryDefaults: settings.useIndustryDefaults,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
  };
}

/**
 * Get user settings. If no settings exist, create with industry defaults.
 */
export async function getSettings(userId: string): Promise<SettingsResponse> {
  let settings = await prisma.userSettings.findUnique({
    where: { userId },
  });

  // If no settings exist, create defaults
  if (!settings) {
    settings = await prisma.userSettings.create({
      data: {
        userId,
        useIndustryDefaults: true,
      },
    });
  }

  return formatSettings(settings);
}

/**
 * Update user settings
 */
export async function updateSettings(
  userId: string,
  input: SettingsInput
): Promise<SettingsResponse> {
  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Upsert settings (create if doesn't exist, update if exists)
  const settings = await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      ...input,
      useIndustryDefaults: input.useIndustryDefaults ?? false,
    },
    update: {
      ...input,
      useIndustryDefaults: input.useIndustryDefaults ?? false,
    },
  });

  return formatSettings(settings);
}

/**
 * Reset settings to industry defaults
 */
export async function resetToDefaults(
  userId: string,
  vehicleType?: VehicleType
): Promise<SettingsResponse> {
  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Get vehicle-specific defaults if vehicle type provided
  const vehicleDefaults = vehicleType ? INDUSTRY_DEFAULTS[vehicleType] : {};

  const defaultValues = {
    ...BASE_DEFAULTS,
    ...vehicleDefaults,
    useIndustryDefaults: true,
  };

  // Upsert with defaults
  const settings = await prisma.userSettings.upsert({
    where: { userId },
    create: {
      userId,
      ...defaultValues,
    },
    update: defaultValues,
  });

  return formatSettings(settings);
}

/**
 * Get industry defaults for a vehicle type
 */
export function getIndustryDefaults(vehicleType?: VehicleType): typeof BASE_DEFAULTS & { vehicleType?: VehicleType } {
  const vehicleDefaults = vehicleType && vehicleType in INDUSTRY_DEFAULTS
    ? INDUSTRY_DEFAULTS[vehicleType]
    : {};
  return {
    ...BASE_DEFAULTS,
    ...vehicleDefaults,
    vehicleType,
  };
}

export type { VehicleType };
