/**
 * FMCSA SAFER Web Services Integration
 *
 * Provides carrier and broker verification using the free FMCSA public API.
 * Data includes: authority status, insurance, safety ratings, crash history.
 *
 * API Documentation: https://mobile.fmcsa.dot.gov/qc/services
 * Register for free API key: https://mobile.fmcsa.dot.gov/QCDevsite/
 */
/**
 * Carrier/Broker basic information
 */
export interface CarrierInfo {
    dotNumber: string;
    legalName: string;
    dbaName?: string;
    entityType: 'CARRIER' | 'BROKER' | 'CARRIER/BROKER';
    operatingStatus: string;
    outOfServiceDate?: string;
    mcNumber?: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    phone?: string;
    fax?: string;
    email?: string;
    mailingAddress?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
}
/**
 * Authority information (operating authority, broker authority)
 */
export interface AuthorityInfo {
    authorityType: string;
    authorityStatus: string;
    authorityStatusDesc: string;
    applicationPendingDate?: string;
    grantDate?: string;
    effectiveDate?: string;
}
/**
 * Insurance information
 */
export interface InsuranceInfo {
    insuranceType: string;
    insuranceRequired: string;
    insuranceOnFile: string;
    bipdInsuranceRequired?: number;
    bipdInsuranceOnFile?: number;
    bondInsuranceRequired?: number;
    bondInsuranceOnFile?: number;
    cargoInsuranceRequired?: number;
    cargoInsuranceOnFile?: number;
}
/**
 * Safety rating information
 */
export interface SafetyRating {
    rating: 'Satisfactory' | 'Conditional' | 'Unsatisfactory' | 'Not Rated';
    ratingDate?: string;
    reviewDate?: string;
    reviewType?: string;
}
/**
 * Inspection and crash data
 */
export interface SafetyData {
    totalDriverInspections: number;
    driverOutOfServiceInspections: number;
    driverOutOfServicePercent: number;
    totalVehicleInspections: number;
    vehicleOutOfServiceInspections: number;
    vehicleOutOfServicePercent: number;
    totalHazmatInspections: number;
    hazmatOutOfServiceInspections: number;
    hazmatOutOfServicePercent: number;
    crashTotal: number;
    fatalCrash: number;
    injuryCrash: number;
    towCrash: number;
}
/**
 * Complete verification result
 */
export interface CarrierVerificationResult {
    found: boolean;
    carrier?: CarrierInfo;
    authorities?: AuthorityInfo[];
    insurance?: InsuranceInfo;
    safetyRating?: SafetyRating;
    safetyData?: SafetyData;
    riskAssessment: {
        level: 'low' | 'medium' | 'high' | 'critical';
        score: number;
        factors: string[];
        recommendation: string;
    };
    lastUpdated: string;
    dataSource: 'fmcsa';
}
/**
 * Search for a carrier/broker by DOT number
 */
export declare function lookupByDOT(dotNumber: string): Promise<CarrierVerificationResult>;
/**
 * Search for a carrier/broker by MC number
 */
export declare function lookupByMC(mcNumber: string): Promise<CarrierVerificationResult>;
/**
 * Search by name (less reliable, returns first match)
 */
export declare function searchByName(name: string): Promise<CarrierVerificationResult>;
/**
 * Smart search - determines if input is DOT, MC, or name
 */
export declare function verifyCarrier(query: string): Promise<CarrierVerificationResult>;
//# sourceMappingURL=fmcsa.service.d.ts.map