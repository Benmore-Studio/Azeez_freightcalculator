/**
 * Market Rate Service
 *
 * Calculates market-based freight rates using lane benchmarks,
 * equipment premiums, seasonal adjustments, and supply/demand factors.
 *
 * Provides ~70-85% accuracy compared to real-time load board data.
 */
import { LANE_BENCHMARKS, DEFAULT_BENCHMARK, getDistanceMultiplier, getEquipmentMultiplier, getSeasonalMultiplier, } from '../data/laneBenchmarks.js';
import { getRegionFromState, calculateFlowDirection, RETURN_LOAD_POTENTIAL, REGION_CHARACTERISTICS, getRegionDisplayName, } from '../data/regionMappings.js';
/**
 * Calculate market rate for a given lane
 */
export async function calculateMarketRate(input) {
    // 1. Get regions from states
    const originRegion = getRegionFromState(input.originState);
    const destRegion = getRegionFromState(input.destinationState);
    if (!originRegion || !destRegion) {
        console.warn(`[MarketService] Unknown region for states: ${input.originState} -> ${input.destinationState}`);
    }
    // 2. Get base lane benchmark
    const baseBenchmark = getLaneBenchmark(originRegion, destRegion);
    // 3. Get multipliers
    const distanceFactor = getDistanceMultiplier(input.totalMiles);
    const equipmentFactor = getEquipmentMultiplier(input.vehicleType || 'semi', input.freightClass);
    const pickupDate = input.pickupDate ? new Date(input.pickupDate) : undefined;
    const seasonalFactor = getSeasonalMultiplier(pickupDate);
    // 4. Calculate flow direction and supply/demand
    const flowAnalysis = originRegion && destRegion
        ? calculateFlowDirection(originRegion, destRegion)
        : getDefaultFlowAnalysis();
    // 5. Apply flow-based adjustment
    const flowMultiplier = getFlowMultiplier(flowAnalysis);
    // 6. Calculate total multiplier
    const totalMultiplier = distanceFactor.multiplier *
        equipmentFactor.multiplier *
        seasonalFactor.multiplier *
        flowMultiplier.multiplier;
    // 7. Calculate final rates
    const marketLow = Math.round(baseBenchmark.low * totalMultiplier * 100) / 100;
    const marketMid = Math.round(baseBenchmark.mid * totalMultiplier * 100) / 100;
    const marketHigh = Math.round(baseBenchmark.high * totalMultiplier * 100) / 100;
    const totalLow = Math.round(marketLow * input.totalMiles);
    const totalMid = Math.round(marketMid * input.totalMiles);
    const totalHigh = Math.round(marketHigh * input.totalMiles);
    // 8. Calculate confidence
    const confidence = calculateConfidence(originRegion, destRegion, input.totalMiles);
    // 9. Get return load potential
    const returnLoadPotential = getReturnLoadPotential(destRegion, marketMid);
    // 10. Build factors array
    const factors = [
        {
            name: 'Lane Base Rate',
            multiplier: 1.0,
            description: `${originRegion || 'Unknown'} → ${destRegion || 'Unknown'}`,
        },
        {
            name: 'Distance',
            multiplier: distanceFactor.multiplier,
            description: `${input.totalMiles} mi (${distanceFactor.label})`,
        },
        {
            name: 'Equipment',
            multiplier: equipmentFactor.multiplier,
            description: equipmentFactor.label,
        },
        {
            name: 'Season',
            multiplier: seasonalFactor.multiplier,
            description: seasonalFactor.label,
        },
        {
            name: 'Market Flow',
            multiplier: flowMultiplier.multiplier,
            description: flowMultiplier.description,
        },
    ];
    // 11. Build supply/demand analysis
    const supplyDemand = {
        originRegion: originRegion || 'midwest',
        destinationRegion: destRegion || 'midwest',
        originRegionName: originRegion ? getRegionDisplayName(originRegion) : 'Unknown',
        destinationRegionName: destRegion ? getRegionDisplayName(destRegion) : 'Unknown',
        flowDirection: flowAnalysis.direction,
        truckToLoadRatio: flowAnalysis.truckToLoadRatio,
        marketTemperature: flowAnalysis.marketTemperature,
        imbalanceScore: flowAnalysis.imbalanceScore,
    };
    return {
        marketLow,
        marketMid,
        marketHigh,
        totalLow,
        totalMid,
        totalHigh,
        confidence: confidence.score,
        confidenceLabel: confidence.label,
        confidenceReason: confidence.reason,
        factors,
        totalMultiplier: Math.round(totalMultiplier * 1000) / 1000,
        supplyDemand,
        returnLoadPotential,
        ratePosition: 'at_market',
        marketSpread: Math.round((marketHigh - marketLow) * 100) / 100,
    };
}
/**
 * Get lane benchmark, falling back to default if not found
 */
function getLaneBenchmark(originRegion, destRegion) {
    if (!originRegion || !destRegion) {
        return DEFAULT_BENCHMARK;
    }
    const laneBenchmarks = LANE_BENCHMARKS[originRegion];
    if (!laneBenchmarks) {
        return DEFAULT_BENCHMARK;
    }
    const benchmark = laneBenchmarks[destRegion];
    return benchmark || DEFAULT_BENCHMARK;
}
/**
 * Get flow-based rate multiplier
 */
function getFlowMultiplier(flow) {
    switch (flow.direction) {
        case 'headhaul':
            // Strong demand, rates go up
            return {
                multiplier: 1.08 + (flow.imbalanceScore > 4 ? 0.07 : 0),
                description: `Headhaul (${flow.marketTemperature} market)`,
            };
        case 'backhaul':
            // Weak demand, rates go down
            return {
                multiplier: 0.88 - (flow.imbalanceScore < -4 ? 0.05 : 0),
                description: `Backhaul (${flow.marketTemperature} market)`,
            };
        default:
            return {
                multiplier: 1.0,
                description: `Balanced (${flow.marketTemperature} market)`,
            };
    }
}
/**
 * Calculate confidence score
 */
function calculateConfidence(originRegion, destRegion, miles) {
    let score = 70; // Base confidence
    const reasons = [];
    // Known regions increase confidence
    if (originRegion && destRegion) {
        score += 15;
        reasons.push('Known lane');
    }
    else {
        score -= 15;
        reasons.push('Unknown region');
    }
    // Major lanes have better data
    const majorOrigins = ['midwest', 'southeast', 'south_central', 'west'];
    const majorDests = ['midwest', 'southeast', 'south_central', 'northeast'];
    if (originRegion && majorOrigins.includes(originRegion)) {
        score += 5;
    }
    if (destRegion && majorDests.includes(destRegion)) {
        score += 5;
    }
    // Standard distances have better benchmarks
    if (miles >= 400 && miles <= 1500) {
        score += 5;
        reasons.push('Standard distance');
    }
    else if (miles < 200 || miles > 2500) {
        score -= 10;
        reasons.push('Unusual distance');
    }
    // Cap score
    score = Math.min(95, Math.max(40, score));
    let label;
    if (score >= 75) {
        label = 'high';
    }
    else if (score >= 55) {
        label = 'medium';
    }
    else {
        label = 'low';
    }
    return {
        score,
        label,
        reason: reasons.join(', ') || 'Standard estimate',
    };
}
/**
 * Get return load potential for destination region
 */
function getReturnLoadPotential(destRegion, marketMidRate) {
    if (!destRegion) {
        return {
            score: 5,
            rating: 'Unknown',
            loadsAvailable: 500,
            avgReturnRate: marketMidRate * 0.85,
        };
    }
    const potential = RETURN_LOAD_POTENTIAL[destRegion];
    const regionChars = REGION_CHARACTERISTICS[destRegion];
    // Estimate return rate based on outbound strength
    const outboundStrength = regionChars?.outboundStrength || 5;
    const returnRateMultiplier = 0.70 + (outboundStrength / 10) * 0.25;
    return {
        score: potential.score,
        rating: potential.rating,
        loadsAvailable: potential.avgLoadsPerDay,
        avgReturnRate: Math.round(marketMidRate * returnRateMultiplier * 100) / 100,
    };
}
/**
 * Default flow analysis for unknown regions
 */
function getDefaultFlowAnalysis() {
    return {
        direction: 'balanced',
        imbalanceScore: 0,
        truckToLoadRatio: 2.0,
        marketTemperature: 'balanced',
    };
}
/**
 * Compare a given rate against market benchmarks
 */
export function compareToMarket(rate, miles, marketResult) {
    const ratePerMile = rate / miles;
    if (ratePerMile < marketResult.marketLow) {
        const percentile = Math.round((ratePerMile / marketResult.marketLow) * 25);
        return {
            position: 'below_market',
            percentile: Math.max(1, percentile),
            recommendation: 'Rate is below market. Consider negotiating higher.',
        };
    }
    if (ratePerMile > marketResult.marketHigh) {
        const overage = (ratePerMile - marketResult.marketHigh) / (marketResult.marketHigh - marketResult.marketMid);
        const percentile = Math.min(99, 75 + Math.round(overage * 25));
        return {
            position: 'above_market',
            percentile,
            recommendation: 'Excellent rate! This is above typical market rates.',
        };
    }
    // At market - calculate percentile within range
    const range = marketResult.marketHigh - marketResult.marketLow;
    const position = ratePerMile - marketResult.marketLow;
    const percentile = 25 + Math.round((position / range) * 50);
    return {
        position: 'at_market',
        percentile,
        recommendation: 'Rate is within normal market range.',
    };
}
console.log('[MarketService] Market rate service loaded');
//# sourceMappingURL=market.service.js.map