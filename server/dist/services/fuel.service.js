import { env } from '../config/env.js';
import { prisma } from './prisma.js';
// National average diesel price fallback
const DEFAULT_DIESEL_PRICE = 4.00;
// EIA API series IDs for diesel prices by PADD region
// PADD = Petroleum Administration for Defense Districts
const PADD_SERIES = {
    // PADD 1 - East Coast
    PADD1: 'PET.EMD_EPD2D_PTE_R10_DPG.W',
    // PADD 1A - New England (CT, ME, MA, NH, RI, VT)
    PADD1A: 'PET.EMD_EPD2D_PTE_R1X_DPG.W',
    // PADD 1B - Central Atlantic (DE, DC, MD, NJ, NY, PA)
    PADD1B: 'PET.EMD_EPD2D_PTE_R1Y_DPG.W',
    // PADD 1C - Lower Atlantic (FL, GA, NC, SC, VA, WV)
    PADD1C: 'PET.EMD_EPD2D_PTE_R1Z_DPG.W',
    // PADD 2 - Midwest
    PADD2: 'PET.EMD_EPD2D_PTE_R20_DPG.W',
    // PADD 3 - Gulf Coast
    PADD3: 'PET.EMD_EPD2D_PTE_R30_DPG.W',
    // PADD 4 - Rocky Mountain
    PADD4: 'PET.EMD_EPD2D_PTE_R40_DPG.W',
    // PADD 5 - West Coast
    PADD5: 'PET.EMD_EPD2D_PTE_R50_DPG.W',
    // US Average
    US: 'PET.EMD_EPD2D_PTE_NUS_DPG.W',
};
// Map states to PADD regions
const STATE_TO_PADD = {
    // PADD 1A - New England
    CT: 'PADD1A', ME: 'PADD1A', MA: 'PADD1A', NH: 'PADD1A', RI: 'PADD1A', VT: 'PADD1A',
    // PADD 1B - Central Atlantic
    DE: 'PADD1B', DC: 'PADD1B', MD: 'PADD1B', NJ: 'PADD1B', NY: 'PADD1B', PA: 'PADD1B',
    // PADD 1C - Lower Atlantic
    FL: 'PADD1C', GA: 'PADD1C', NC: 'PADD1C', SC: 'PADD1C', VA: 'PADD1C', WV: 'PADD1C',
    // PADD 2 - Midwest
    IL: 'PADD2', IN: 'PADD2', IA: 'PADD2', KS: 'PADD2', KY: 'PADD2', MI: 'PADD2',
    MN: 'PADD2', MO: 'PADD2', NE: 'PADD2', ND: 'PADD2', OH: 'PADD2', OK: 'PADD2',
    SD: 'PADD2', TN: 'PADD2', WI: 'PADD2',
    // PADD 3 - Gulf Coast
    AL: 'PADD3', AR: 'PADD3', LA: 'PADD3', MS: 'PADD3', NM: 'PADD3', TX: 'PADD3',
    // PADD 4 - Rocky Mountain
    CO: 'PADD4', ID: 'PADD4', MT: 'PADD4', UT: 'PADD4', WY: 'PADD4',
    // PADD 5 - West Coast
    AK: 'PADD5', AZ: 'PADD5', CA: 'PADD5', HI: 'PADD5', NV: 'PADD5', OR: 'PADD5', WA: 'PADD5',
};
/**
 * Get fuel price for a specific state
 */
export async function getFuelPriceForState(stateCode) {
    const upperState = stateCode.toUpperCase();
    // Check cache first
    const cached = await getCachedFuelPrice(upperState);
    if (cached) {
        return {
            pricePerGallon: cached.pricePerGallon,
            region: cached.region,
            lastUpdated: cached.fetchedAt,
            source: 'cache',
        };
    }
    // Try to fetch from EIA API
    const padd = STATE_TO_PADD[upperState] || 'US';
    const apiPrice = await fetchFuelPriceFromEIA(padd);
    if (apiPrice) {
        // Cache the result
        await cacheFuelPrice(upperState, apiPrice, padd);
        return {
            pricePerGallon: apiPrice,
            region: padd,
            lastUpdated: new Date(),
            source: 'api',
        };
    }
    // Fallback to national average
    return {
        pricePerGallon: DEFAULT_DIESEL_PRICE,
        region: 'US (fallback)',
        lastUpdated: new Date(),
        source: 'fallback',
    };
}
/**
 * Get weighted average fuel price for a route crossing multiple states
 */
export async function getRouteFuelPrice(statesCrossed) {
    if (statesCrossed.length === 0) {
        return getFuelPriceForState('US');
    }
    // Get prices for all states
    const prices = await Promise.all(statesCrossed.map(state => getFuelPriceForState(state)));
    // Calculate simple average (could be weighted by distance in future)
    const avgPrice = prices.reduce((sum, p) => sum + p.pricePerGallon, 0) / prices.length;
    return {
        pricePerGallon: Math.round(avgPrice * 100) / 100,
        region: statesCrossed.join(', '),
        lastUpdated: new Date(),
        source: prices.every(p => p.source === 'api') ? 'api' : 'cache',
    };
}
/**
 * Fetch fuel price from EIA API
 */
async function fetchFuelPriceFromEIA(region) {
    const apiKey = env.apiKeys.eia;
    if (!apiKey) {
        console.warn('EIA_API_KEY not configured');
        return null;
    }
    try {
        const seriesId = PADD_SERIES[region] || PADD_SERIES.US;
        // EIA API v2
        const url = new URL('https://api.eia.gov/v2/petroleum/pri/gnd/data/');
        url.searchParams.set('api_key', apiKey);
        url.searchParams.set('facets[series][]', seriesId);
        url.searchParams.set('sort[0][column]', 'period');
        url.searchParams.set('sort[0][direction]', 'desc');
        url.searchParams.set('length', '1');
        url.searchParams.set('data[]', 'value');
        const response = await fetch(url.toString());
        if (!response.ok) {
            console.error('EIA API error:', response.status);
            return null;
        }
        const data = await response.json();
        const price = data.response?.data?.[0]?.value;
        if (price && typeof price === 'number') {
            return Math.round(price * 100) / 100;
        }
        return null;
    }
    catch (error) {
        console.error('Error fetching fuel price from EIA:', error);
        return null;
    }
}
/**
 * Get cached fuel price for a state
 */
async function getCachedFuelPrice(stateCode) {
    try {
        const cached = await prisma.fuelPriceCache.findFirst({
            where: {
                stateCode,
                fuelType: 'diesel',
                expiresAt: { gt: new Date() },
            },
            orderBy: { fetchedAt: 'desc' },
        });
        if (cached) {
            return {
                pricePerGallon: Number(cached.pricePerGallon),
                region: STATE_TO_PADD[stateCode] || stateCode,
                fetchedAt: cached.fetchedAt,
            };
        }
    }
    catch (error) {
        console.error('Error reading fuel price cache:', error);
    }
    return null;
}
/**
 * Cache fuel price for a state
 */
async function cacheFuelPrice(stateCode, price, _region // Not stored in DB, just for logging
) {
    try {
        // Cache for 24 hours (fuel prices update weekly from EIA)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        await prisma.fuelPriceCache.upsert({
            where: {
                stateCode_fuelType: {
                    stateCode,
                    fuelType: 'diesel',
                },
            },
            update: {
                pricePerGallon: price,
                fetchedAt: new Date(),
                expiresAt,
            },
            create: {
                stateCode,
                fuelType: 'diesel',
                pricePerGallon: price,
                source: 'eia',
                fetchedAt: new Date(),
                expiresAt,
            },
        });
    }
    catch (error) {
        console.error('Error caching fuel price:', error);
    }
}
/**
 * Update fuel prices for all PADD regions (for cron job)
 */
export async function updateAllFuelPrices() {
    const apiKey = env.apiKeys.eia;
    if (!apiKey) {
        console.warn('EIA_API_KEY not configured, skipping fuel price update');
        return { updated: 0, failed: 0 };
    }
    let updated = 0;
    let failed = 0;
    // Update each PADD region
    for (const [region, seriesId] of Object.entries(PADD_SERIES)) {
        try {
            const price = await fetchFuelPriceFromEIA(region);
            if (price) {
                // Cache for representative state in each region
                const representativeStates = {
                    PADD1: 'NY',
                    PADD1A: 'MA',
                    PADD1B: 'PA',
                    PADD1C: 'FL',
                    PADD2: 'IL',
                    PADD3: 'TX',
                    PADD4: 'CO',
                    PADD5: 'CA',
                    US: 'US',
                };
                const state = representativeStates[region] || region;
                await cacheFuelPrice(state, price, region);
                updated++;
            }
            else {
                failed++;
            }
        }
        catch (error) {
            console.error(`Error updating fuel price for ${region}:`, error);
            failed++;
        }
    }
    console.log(`Fuel prices updated: ${updated} success, ${failed} failed`);
    return { updated, failed };
}
/**
 * Get national average fuel price (for display/fallback)
 */
export async function getNationalAverageFuelPrice() {
    return getFuelPriceForState('US');
}
//# sourceMappingURL=fuel.service.js.map