type VehicleType = 'semi' | 'box_truck' | 'cargo_van' | 'sprinter' | 'reefer';
declare const BASE_DEFAULTS: {
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
/**
 * Get user settings. If no settings exist, create with industry defaults.
 */
export declare function getSettings(userId: string): Promise<SettingsResponse>;
/**
 * Update user settings
 */
export declare function updateSettings(userId: string, input: SettingsInput): Promise<SettingsResponse>;
/**
 * Reset settings to industry defaults
 */
export declare function resetToDefaults(userId: string, vehicleType?: VehicleType): Promise<SettingsResponse>;
/**
 * Get industry defaults for a vehicle type
 */
export declare function getIndustryDefaults(vehicleType?: VehicleType): typeof BASE_DEFAULTS & {
    vehicleType?: VehicleType;
};
export type { VehicleType };
//# sourceMappingURL=settings.service.d.ts.map