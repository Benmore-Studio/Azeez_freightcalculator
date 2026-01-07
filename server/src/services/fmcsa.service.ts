/**
 * FMCSA SAFER Web Services Integration
 *
 * Provides carrier and broker verification using the free FMCSA public API.
 * Data includes: authority status, insurance, safety ratings, crash history.
 *
 * API Documentation: https://mobile.fmcsa.dot.gov/qc/services
 * Register for free API key: https://mobile.fmcsa.dot.gov/QCDevsite/
 */

import { env } from '../config/env.js';

// FMCSA SAFER API base URL and key
const FMCSA_API_BASE = 'https://mobile.fmcsa.dot.gov/qc/services';
const FMCSA_WEB_KEY = env.apiKeys.fmcsa || '';

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
    score: number;  // 0-100, higher is better
    factors: string[];
    recommendation: string;
  };
  lastUpdated: string;
  dataSource: 'fmcsa';
}

/**
 * Search for a carrier/broker by DOT number
 */
export async function lookupByDOT(dotNumber: string): Promise<CarrierVerificationResult> {
  const cleanDot = dotNumber.replace(/\D/g, '');

  if (!cleanDot) {
    return createNotFoundResult(`Invalid DOT number: ${dotNumber}`);
  }

  console.log(`[FMCSA] Looking up DOT: ${cleanDot}`);

  try {
    // Fetch carrier information
    const carrierUrl = `${FMCSA_API_BASE}/carriers/${cleanDot}?webKey=${FMCSA_WEB_KEY}`;
    const response = await fetch(carrierUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return createNotFoundResult(`DOT ${cleanDot} not found in FMCSA database`);
      }
      console.error(`[FMCSA] API error: ${response.status}`);
      return createNotFoundResult(`FMCSA API error: ${response.status}`);
    }

    const data = await response.json() as any;
    const content = data?.content;

    if (!content?.carrier) {
      return createNotFoundResult(`No carrier data for DOT ${cleanDot}`);
    }

    const carrier = content.carrier;

    // Parse carrier info
    const carrierInfo: CarrierInfo = {
      dotNumber: carrier.dotNumber?.toString() || cleanDot,
      legalName: carrier.legalName || 'Unknown',
      dbaName: carrier.dbaName || undefined,
      entityType: parseEntityType(carrier.carrierOperation),
      operatingStatus: carrier.allowedToOperate === 'Y' ? 'AUTHORIZED' : 'NOT AUTHORIZED',
      outOfServiceDate: carrier.oosDate || undefined,
      mcNumber: carrier.mcNumber?.toString() || undefined,
      address: {
        street: carrier.phyStreet || '',
        city: carrier.phyCity || '',
        state: carrier.phyState || '',
        zip: carrier.phyZipcode || '',
        country: carrier.phyCountry || 'US',
      },
      phone: carrier.telephone || undefined,
      mailingAddress: carrier.mailingStreet ? {
        street: carrier.mailingStreet,
        city: carrier.mailingCity || '',
        state: carrier.mailingState || '',
        zip: carrier.mailingZipcode || '',
        country: carrier.mailingCountry || 'US',
      } : undefined,
    };

    // Parse authorities
    const authorities: AuthorityInfo[] = [];
    if (content.authorities) {
      for (const auth of content.authorities) {
        authorities.push({
          authorityType: auth.authorityType || 'Unknown',
          authorityStatus: auth.authorityStatus || 'Unknown',
          authorityStatusDesc: auth.authorityStatusDesc || '',
          grantDate: auth.grantDate || undefined,
          effectiveDate: auth.effectiveDate || undefined,
        });
      }
    }

    // Parse insurance
    let insurance: InsuranceInfo | undefined;
    if (content.cargo || carrier.bipdInsuranceOnFile || carrier.bondInsuranceOnFile) {
      insurance = {
        insuranceType: 'BIPD/Cargo/Bond',
        insuranceRequired: 'Yes',
        insuranceOnFile: carrier.bipdInsuranceOnFile > 0 ? 'Yes' : 'No',
        bipdInsuranceRequired: carrier.bipdInsuranceRequired || 0,
        bipdInsuranceOnFile: carrier.bipdInsuranceOnFile || 0,
        bondInsuranceRequired: carrier.bondInsuranceRequired || 0,
        bondInsuranceOnFile: carrier.bondInsuranceOnFile || 0,
        cargoInsuranceRequired: carrier.cargoInsuranceRequired || 0,
        cargoInsuranceOnFile: carrier.cargoInsuranceOnFile || 0,
      };
    }

    // Parse safety rating
    let safetyRating: SafetyRating | undefined;
    if (carrier.safetyRating) {
      safetyRating = {
        rating: parseSafetyRating(carrier.safetyRating),
        ratingDate: carrier.safetyRatingDate || undefined,
        reviewDate: carrier.safetyReviewDate || undefined,
        reviewType: carrier.safetyReviewType || undefined,
      };
    }

    // Parse safety data (inspections and crashes)
    const safetyData: SafetyData = {
      totalDriverInspections: carrier.driverInsp || 0,
      driverOutOfServiceInspections: carrier.driverOosInsp || 0,
      driverOutOfServicePercent: carrier.driverOosRate || 0,
      totalVehicleInspections: carrier.vehicleInsp || 0,
      vehicleOutOfServiceInspections: carrier.vehicleOosInsp || 0,
      vehicleOutOfServicePercent: carrier.vehicleOosRate || 0,
      totalHazmatInspections: carrier.hazmatInsp || 0,
      hazmatOutOfServiceInspections: carrier.hazmatOosInsp || 0,
      hazmatOutOfServicePercent: carrier.hazmatOosRate || 0,
      crashTotal: carrier.crashTotal || 0,
      fatalCrash: carrier.fatalCrash || 0,
      injuryCrash: carrier.injCrash || 0,
      towCrash: carrier.towawayCrash || 0,
    };

    // Calculate risk assessment
    const riskAssessment = calculateRiskAssessment(
      carrierInfo,
      authorities,
      insurance,
      safetyRating,
      safetyData
    );

    return {
      found: true,
      carrier: carrierInfo,
      authorities,
      insurance,
      safetyRating,
      safetyData,
      riskAssessment,
      lastUpdated: new Date().toISOString(),
      dataSource: 'fmcsa',
    };
  } catch (error) {
    console.error('[FMCSA] Error fetching carrier data:', error);
    return createNotFoundResult(`Error connecting to FMCSA: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Search for a carrier/broker by MC number
 */
export async function lookupByMC(mcNumber: string): Promise<CarrierVerificationResult> {
  const cleanMc = mcNumber.replace(/\D/g, '');

  if (!cleanMc) {
    return createNotFoundResult(`Invalid MC number: ${mcNumber}`);
  }

  console.log(`[FMCSA] Looking up MC: ${cleanMc}`);

  try {
    // FMCSA doesn't have direct MC lookup, need to search
    const searchUrl = `${FMCSA_API_BASE}/carriers/docket-number/${cleanMc}?webKey=${FMCSA_WEB_KEY}`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return createNotFoundResult(`MC ${cleanMc} not found in FMCSA database`);
      }
      console.error(`[FMCSA] MC lookup error: ${response.status}`);
      return createNotFoundResult(`FMCSA API error: ${response.status}`);
    }

    const data = await response.json() as any;
    const content = data?.content;

    if (!content?.carrier?.dotNumber) {
      return createNotFoundResult(`No carrier found for MC ${cleanMc}`);
    }

    // Now lookup by DOT number for full details
    return lookupByDOT(content.carrier.dotNumber.toString());
  } catch (error) {
    console.error('[FMCSA] Error looking up MC number:', error);
    return createNotFoundResult(`Error connecting to FMCSA: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Search by name (less reliable, returns first match)
 */
export async function searchByName(name: string): Promise<CarrierVerificationResult> {
  if (!name || name.trim().length < 3) {
    return createNotFoundResult('Search term must be at least 3 characters');
  }

  console.log(`[FMCSA] Searching for: ${name}`);

  try {
    const searchUrl = `${FMCSA_API_BASE}/carriers/name/${encodeURIComponent(name.trim())}?webKey=${FMCSA_WEB_KEY}`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return createNotFoundResult(`No carriers found matching "${name}"`);
      }
      console.error(`[FMCSA] Search error: ${response.status}`);
      return createNotFoundResult(`FMCSA API error: ${response.status}`);
    }

    const data = await response.json() as any;
    const content = data?.content;

    if (!content?.carriers || content.carriers.length === 0) {
      return createNotFoundResult(`No carriers found matching "${name}"`);
    }

    // Get first match and lookup full details
    const firstMatch = content.carriers[0];
    if (firstMatch.dotNumber) {
      return lookupByDOT(firstMatch.dotNumber.toString());
    }

    return createNotFoundResult(`No valid carriers found matching "${name}"`);
  } catch (error) {
    console.error('[FMCSA] Error searching by name:', error);
    return createNotFoundResult(`Error connecting to FMCSA: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Smart search - determines if input is DOT, MC, or name
 */
export async function verifyCarrier(query: string): Promise<CarrierVerificationResult> {
  const cleaned = query.trim();

  // Check if it's a DOT number (starts with DOT or is just numbers)
  if (/^DOT[\s#-]*\d+$/i.test(cleaned)) {
    const dot = cleaned.replace(/\D/g, '');
    return lookupByDOT(dot);
  }

  // Check if it's an MC number
  if (/^MC[\s#-]*\d+$/i.test(cleaned)) {
    const mc = cleaned.replace(/\D/g, '');
    return lookupByMC(mc);
  }

  // Check if it's just a number (assume DOT)
  if (/^\d+$/.test(cleaned)) {
    // If 6+ digits, likely DOT; if less, could be MC
    if (cleaned.length >= 6) {
      return lookupByDOT(cleaned);
    }
    // Try MC first, fall back to DOT
    const mcResult = await lookupByMC(cleaned);
    if (mcResult.found) return mcResult;
    return lookupByDOT(cleaned);
  }

  // Otherwise, search by name
  return searchByName(cleaned);
}

/**
 * Helper: Create a not-found result
 */
function createNotFoundResult(message: string): CarrierVerificationResult {
  return {
    found: false,
    riskAssessment: {
      level: 'critical',
      score: 0,
      factors: [message],
      recommendation: 'Cannot verify this carrier/broker. Do not proceed without verification.',
    },
    lastUpdated: new Date().toISOString(),
    dataSource: 'fmcsa',
  };
}

/**
 * Helper: Parse entity type
 */
function parseEntityType(operation: any): CarrierInfo['entityType'] {
  if (!operation) return 'CARRIER';

  const opStr = String(operation).toUpperCase();
  if (opStr.includes('BROKER') && opStr.includes('CARRIER')) return 'CARRIER/BROKER';
  if (opStr.includes('BROKER')) return 'BROKER';
  return 'CARRIER';
}

/**
 * Helper: Parse safety rating
 */
function parseSafetyRating(rating: any): SafetyRating['rating'] {
  if (!rating) return 'Not Rated';

  const ratingStr = String(rating).toUpperCase();
  if (ratingStr.includes('SATISFACTORY') && !ratingStr.includes('UN')) return 'Satisfactory';
  if (ratingStr.includes('CONDITIONAL')) return 'Conditional';
  if (ratingStr.includes('UNSATISFACTORY')) return 'Unsatisfactory';
  return 'Not Rated';
}

/**
 * Calculate risk assessment based on all data
 */
function calculateRiskAssessment(
  carrier: CarrierInfo,
  authorities: AuthorityInfo[],
  insurance?: InsuranceInfo,
  safetyRating?: SafetyRating,
  safetyData?: SafetyData
): CarrierVerificationResult['riskAssessment'] {
  let score = 100;
  const factors: string[] = [];

  // Check operating status
  if (carrier.operatingStatus !== 'AUTHORIZED') {
    score -= 50;
    factors.push('NOT authorized to operate');
  }

  // Check out of service
  if (carrier.outOfServiceDate) {
    score -= 40;
    factors.push(`Out of service since ${carrier.outOfServiceDate}`);
  }

  // Check authorities
  const hasActiveAuthority = authorities.some(
    a => a.authorityStatus?.toUpperCase() === 'ACTIVE' ||
         a.authorityStatusDesc?.toUpperCase().includes('ACTIVE')
  );
  if (authorities.length === 0 || !hasActiveAuthority) {
    score -= 30;
    factors.push('No active operating authority');
  }

  // Check insurance (brokers need $75k bond, carriers need $750k+ liability)
  if (insurance) {
    if (carrier.entityType === 'BROKER' && (insurance.bondInsuranceOnFile || 0) < 75000) {
      score -= 25;
      factors.push('Insufficient broker bond (requires $75,000)');
    }
    if (carrier.entityType !== 'BROKER' && (insurance.bipdInsuranceOnFile || 0) < 750000) {
      score -= 20;
      factors.push('Insufficient liability insurance');
    }
  } else {
    score -= 15;
    factors.push('Insurance information not available');
  }

  // Check safety rating
  if (safetyRating) {
    if (safetyRating.rating === 'Unsatisfactory') {
      score -= 35;
      factors.push('UNSATISFACTORY safety rating');
    } else if (safetyRating.rating === 'Conditional') {
      score -= 15;
      factors.push('Conditional safety rating');
    } else if (safetyRating.rating === 'Satisfactory') {
      factors.push('Satisfactory safety rating');
    }
  }

  // Check safety data
  if (safetyData) {
    // National average OOS rate is ~20% for drivers, ~20% for vehicles
    if (safetyData.driverOutOfServicePercent > 30) {
      score -= 15;
      factors.push(`High driver out-of-service rate: ${safetyData.driverOutOfServicePercent.toFixed(1)}%`);
    }
    if (safetyData.vehicleOutOfServicePercent > 30) {
      score -= 15;
      factors.push(`High vehicle out-of-service rate: ${safetyData.vehicleOutOfServicePercent.toFixed(1)}%`);
    }
    if (safetyData.fatalCrash > 0) {
      score -= 10;
      factors.push(`${safetyData.fatalCrash} fatal crash(es) on record`);
    }
    if (safetyData.crashTotal > 5) {
      score -= 5;
      factors.push(`${safetyData.crashTotal} total crashes on record`);
    }
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Determine risk level
  let level: 'low' | 'medium' | 'high' | 'critical';
  let recommendation: string;

  if (score >= 80) {
    level = 'low';
    recommendation = 'This carrier/broker appears to be in good standing. Proceed with normal due diligence.';
  } else if (score >= 60) {
    level = 'medium';
    recommendation = 'Some concerns noted. Review the flagged issues before proceeding.';
  } else if (score >= 40) {
    level = 'high';
    recommendation = 'Significant concerns identified. Exercise caution and consider alternatives.';
  } else {
    level = 'critical';
    recommendation = 'Critical issues found. Not recommended to work with this carrier/broker.';
  }

  // Add positive factors if score is good
  if (factors.length === 0 || (factors.length === 1 && factors[0].includes('Satisfactory'))) {
    factors.unshift('Operating authority verified and active');
    if (insurance && (insurance.bipdInsuranceOnFile || 0) > 0) {
      factors.push('Insurance on file with FMCSA');
    }
  }

  return { level, score, factors, recommendation };
}

console.log('[FMCSA] FMCSA verification service loaded');
