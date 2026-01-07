/**
 * Region Mappings
 *
 * Maps US states to freight regions and provides supply/demand indicators
 * for calculating lane imbalances and market conditions.
 */
/**
 * State to region mapping
 * All 50 US states mapped to 8 freight regions
 */
export const STATE_TO_REGION = {
    // NORTHEAST - Major port, dense population, high inbound demand
    'CT': 'northeast',
    'DE': 'northeast',
    'MA': 'northeast',
    'MD': 'northeast',
    'ME': 'northeast',
    'NH': 'northeast',
    'NJ': 'northeast',
    'NY': 'northeast',
    'PA': 'northeast',
    'RI': 'northeast',
    'VT': 'northeast',
    // SOUTHEAST - Manufacturing, ports, balanced flow
    'AL': 'southeast',
    'FL': 'southeast',
    'GA': 'southeast',
    'KY': 'southeast',
    'NC': 'southeast',
    'SC': 'southeast',
    'TN': 'southeast',
    'VA': 'southeast',
    'WV': 'southeast',
    // MIDWEST - Manufacturing hub, balanced flow
    'IL': 'midwest',
    'IN': 'midwest',
    'IA': 'midwest',
    'MI': 'midwest',
    'MN': 'midwest',
    'MO': 'midwest',
    'OH': 'midwest',
    'WI': 'midwest',
    // SOUTHWEST - Growing markets
    'AZ': 'southwest',
    'NV': 'southwest',
    'NM': 'southwest',
    // WEST - California dominates, major importer
    'CA': 'west',
    'HI': 'west',
    // PACIFIC NORTHWEST - Ports, agriculture
    'AK': 'pacific_northwest',
    'OR': 'pacific_northwest',
    'WA': 'pacific_northwest',
    // MOUNTAIN - Lower density, pass-through
    'CO': 'mountain',
    'ID': 'mountain',
    'MT': 'mountain',
    'ND': 'mountain',
    'NE': 'mountain',
    'SD': 'mountain',
    'UT': 'mountain',
    'WY': 'mountain',
    // SOUTH CENTRAL - Energy, agriculture, high truck population
    'AR': 'south_central',
    'KS': 'south_central',
    'LA': 'south_central',
    'MS': 'south_central',
    'OK': 'south_central',
    'TX': 'south_central',
};
export const REGION_CHARACTERISTICS = {
    northeast: {
        name: 'Northeast',
        outboundStrength: 5, // Moderate - some manufacturing
        inboundStrength: 9, // Very high - consumer goods, imports
        truckPopulation: 6,
        majorMarkets: ['New York', 'Philadelphia', 'Boston', 'Newark'],
        industries: ['Consumer Goods', 'Retail', 'Pharmaceuticals'],
    },
    southeast: {
        name: 'Southeast',
        outboundStrength: 7, // Good - manufacturing, agriculture
        inboundStrength: 7, // Good - growing population
        truckPopulation: 8, // High truck availability
        majorMarkets: ['Atlanta', 'Miami', 'Charlotte', 'Nashville'],
        industries: ['Automotive', 'Agriculture', 'Manufacturing'],
    },
    midwest: {
        name: 'Midwest',
        outboundStrength: 8, // Strong - manufacturing hub
        inboundStrength: 6, // Moderate
        truckPopulation: 8,
        majorMarkets: ['Chicago', 'Detroit', 'Indianapolis', 'Columbus'],
        industries: ['Automotive', 'Agriculture', 'Steel', 'Manufacturing'],
    },
    southwest: {
        name: 'Southwest',
        outboundStrength: 4, // Lower
        inboundStrength: 6, // Moderate - growing markets
        truckPopulation: 5,
        majorMarkets: ['Phoenix', 'Las Vegas', 'Albuquerque', 'Tucson'],
        industries: ['Retail', 'Construction', 'Electronics'],
    },
    west: {
        name: 'West (California)',
        outboundStrength: 4, // Low - mostly imports
        inboundStrength: 10, // Highest - ports, consumption
        truckPopulation: 7,
        majorMarkets: ['Los Angeles', 'San Francisco', 'San Diego', 'Fresno'],
        industries: ['Produce', 'Imports', 'Technology', 'Entertainment'],
    },
    pacific_northwest: {
        name: 'Pacific Northwest',
        outboundStrength: 6, // Good - lumber, agriculture
        inboundStrength: 5, // Moderate
        truckPopulation: 4, // Lower availability
        majorMarkets: ['Seattle', 'Portland', 'Tacoma'],
        industries: ['Lumber', 'Agriculture', 'Technology', 'Ports'],
    },
    mountain: {
        name: 'Mountain',
        outboundStrength: 4, // Lower
        inboundStrength: 4, // Lower
        truckPopulation: 3, // Low - sparse population
        majorMarkets: ['Denver', 'Salt Lake City', 'Boise'],
        industries: ['Mining', 'Agriculture', 'Energy'],
    },
    south_central: {
        name: 'South Central (Texas)',
        outboundStrength: 8, // Strong - energy, manufacturing
        inboundStrength: 7, // Good - large population
        truckPopulation: 9, // Very high - trucking hub
        majorMarkets: ['Dallas', 'Houston', 'San Antonio', 'Austin'],
        industries: ['Energy', 'Manufacturing', 'Agriculture', 'Imports'],
    },
};
/**
 * Calculate flow direction between two regions
 */
export function calculateFlowDirection(originRegion, destRegion) {
    const origin = REGION_CHARACTERISTICS[originRegion];
    const dest = REGION_CHARACTERISTICS[destRegion];
    if (!origin || !dest) {
        return {
            direction: 'balanced',
            imbalanceScore: 0,
            truckToLoadRatio: 2.0,
            marketTemperature: 'balanced',
        };
    }
    // Imbalance based on outbound strength vs destination inbound strength
    // Positive = goods want to move this direction (headhaul)
    // Negative = against primary flow (backhaul)
    const outboundPush = origin.outboundStrength;
    const inboundPull = dest.inboundStrength;
    const truckAvailability = origin.truckPopulation;
    // Calculate imbalance: demand vs supply
    const demandScore = (outboundPush + inboundPull) / 2;
    const supplyScore = truckAvailability;
    const imbalanceScore = demandScore - supplyScore;
    // Determine direction
    let direction;
    if (imbalanceScore > 2) {
        direction = 'headhaul';
    }
    else if (imbalanceScore < -2) {
        direction = 'backhaul';
    }
    else {
        direction = 'balanced';
    }
    // Estimate truck-to-load ratio
    // Lower ratio = tighter capacity = higher rates
    // Higher ratio = more trucks = lower rates
    let truckToLoadRatio;
    if (direction === 'headhaul') {
        truckToLoadRatio = 1.2 + Math.random() * 0.6; // 1.2-1.8 (tight)
    }
    else if (direction === 'backhaul') {
        truckToLoadRatio = 3.0 + Math.random() * 2.0; // 3.0-5.0 (loose)
    }
    else {
        truckToLoadRatio = 1.8 + Math.random() * 0.8; // 1.8-2.6 (balanced)
    }
    // Determine market temperature
    let marketTemperature;
    if (truckToLoadRatio < 1.5) {
        marketTemperature = 'hot';
    }
    else if (truckToLoadRatio < 2.0) {
        marketTemperature = 'warm';
    }
    else if (truckToLoadRatio < 3.0) {
        marketTemperature = 'balanced';
    }
    else if (truckToLoadRatio < 4.0) {
        marketTemperature = 'cool';
    }
    else {
        marketTemperature = 'cold';
    }
    return {
        direction,
        imbalanceScore: Math.round(imbalanceScore * 10) / 10,
        truckToLoadRatio: Math.round(truckToLoadRatio * 100) / 100,
        marketTemperature,
    };
}
/**
 * Return load potential by destination region
 * Score 1-10 indicating likelihood of finding a profitable return load
 */
export const RETURN_LOAD_POTENTIAL = {
    northeast: { score: 7, rating: 'Good', avgLoadsPerDay: 2500 },
    southeast: { score: 8, rating: 'Very Good', avgLoadsPerDay: 3200 },
    midwest: { score: 9, rating: 'Excellent', avgLoadsPerDay: 4100 },
    southwest: { score: 5, rating: 'Moderate', avgLoadsPerDay: 800 },
    west: { score: 4, rating: 'Below Average', avgLoadsPerDay: 1200 }, // Hard to get out of CA
    pacific_northwest: { score: 6, rating: 'Fair', avgLoadsPerDay: 650 },
    mountain: { score: 4, rating: 'Below Average', avgLoadsPerDay: 350 },
    south_central: { score: 9, rating: 'Excellent', avgLoadsPerDay: 3800 }, // TX is busy
};
/**
 * Get region from state code
 */
export function getRegionFromState(stateCode) {
    const code = stateCode?.toUpperCase()?.trim();
    return STATE_TO_REGION[code] || null;
}
/**
 * Get region display name
 */
export function getRegionDisplayName(region) {
    return REGION_CHARACTERISTICS[region]?.name || region;
}
//# sourceMappingURL=regionMappings.js.map