// Mock market intelligence data for freight calculator
// This simulates DAT Load Board / FreightWaves SONAR API data
// Will be replaced with real APIs in Phase 2

// Major freight markets with typical characteristics
const marketData = {
  // Hot markets (< 0.5 truck-to-load ratio - MANY loads, FEW trucks)
  'los angeles, ca': {
    marketTemperature: 'hot',
    truckToLoadRatio: 0.7,
    loadsAvailable: 1247,
    avgRatePerMile: 2.15,
    rateTrend: 'rising'
  },
  'atlanta, ga': {
    marketTemperature: 'hot',
    truckToLoadRatio: 0.6,
    loadsAvailable: 945,
    avgRatePerMile: 1.95,
    rateTrend: 'stable'
  },
  'dallas, tx': {
    marketTemperature: 'hot',
    truckToLoadRatio: 0.8,
    loadsAvailable: 1124,
    avgRatePerMile: 2.05,
    rateTrend: 'rising'
  },

  // Warm markets (0.5-1.0 ratio - Good balance)
  'phoenix, az': {
    marketTemperature: 'warm',
    truckToLoadRatio: 0.9,
    loadsAvailable: 678,
    avgRatePerMile: 2.10,
    rateTrend: 'stable'
  },
  'memphis, tn': {
    marketTemperature: 'warm',
    truckToLoadRatio: 1.0,
    loadsAvailable: 556,
    avgRatePerMile: 1.85,
    rateTrend: 'stable'
  },

  // Balanced markets (1.0-2.0 ratio - Moderate)
  'chicago, il': {
    marketTemperature: 'balanced',
    truckToLoadRatio: 1.3,
    loadsAvailable: 487,
    avgRatePerMile: 1.95,
    rateTrend: 'stable'
  },
  'denver, co': {
    marketTemperature: 'balanced',
    truckToLoadRatio: 1.5,
    loadsAvailable: 423,
    avgRatePerMile: 2.05,
    rateTrend: 'falling'
  },

  // Cool markets (2.0-3.0 ratio - Fewer loads)
  'seattle, wa': {
    marketTemperature: 'cool',
    truckToLoadRatio: 2.3,
    loadsAvailable: 234,
    avgRatePerMile: 2.25,
    rateTrend: 'rising'
  },
  'portland, or': {
    marketTemperature: 'cool',
    truckToLoadRatio: 2.5,
    loadsAvailable: 198,
    avgRatePerMile: 2.20,
    rateTrend: 'stable'
  },

  // Cold markets (> 3.0 ratio - AVOID, very few loads)
  'miami, fl': {
    marketTemperature: 'cold',
    truckToLoadRatio: 3.5,
    loadsAvailable: 87,
    avgRatePerMile: 2.40,
    rateTrend: 'stable'
  },
  'las vegas, nv': {
    marketTemperature: 'cold',
    truckToLoadRatio: 3.2,
    loadsAvailable: 112,
    avgRatePerMile: 2.30,
    rateTrend: 'falling'
  },

  // More markets
  'new york, ny': {
    marketTemperature: 'balanced',
    truckToLoadRatio: 1.4,
    loadsAvailable: 534,
    avgRatePerMile: 2.10,
    rateTrend: 'stable'
  },
  'houston, tx': {
    marketTemperature: 'warm',
    truckToLoadRatio: 0.95,
    loadsAvailable: 789,
    avgRatePerMile: 2.00,
    rateTrend: 'rising'
  },
  'kansas city, mo': {
    marketTemperature: 'balanced',
    truckToLoadRatio: 1.6,
    loadsAvailable: 345,
    avgRatePerMile: 1.90,
    rateTrend: 'stable'
  },
  'omaha, ne': {
    marketTemperature: 'balanced',
    truckToLoadRatio: 1.8,
    loadsAvailable: 298,
    avgRatePerMile: 1.85,
    rateTrend: 'falling'
  },
};

// Top return lanes from major destinations
const returnLanes = {
  'los angeles, ca': [
    { destination: 'Phoenix, AZ', loads: 127, rate: 2.10, distance: 373 },
    { destination: 'Las Vegas, NV', loads: 98, rate: 1.95, distance: 270 },
    { destination: 'Denver, CO', loads: 67, rate: 2.25, distance: 1016 },
    { destination: 'Dallas, TX', loads: 89, rate: 2.15, distance: 1435 },
  ],
  'atlanta, ga': [
    { destination: 'Charlotte, NC', loads: 156, rate: 1.80, distance: 244 },
    { destination: 'Nashville, TN', loads: 124, rate: 1.75, distance: 250 },
    { destination: 'Miami, FL', loads: 98, rate: 2.00, distance: 661 },
    { destination: 'Chicago, IL', loads: 87, rate: 1.95, distance: 715 },
  ],
  'dallas, tx': [
    { destination: 'Houston, TX', loads: 234, rate: 1.70, distance: 239 },
    { destination: 'Atlanta, GA', loads: 145, rate: 2.05, distance: 782 },
    { destination: 'Memphis, TN', loads: 112, rate: 1.85, distance: 449 },
    { destination: 'Denver, CO', loads: 89, rate: 2.10, distance: 787 },
  ],
  'chicago, il': [
    { destination: 'Detroit, MI', loads: 178, rate: 1.75, distance: 283 },
    { destination: 'Indianapolis, IN', loads: 145, rate: 1.65, distance: 184 },
    { destination: 'Milwaukee, WI', loads: 134, rate: 1.70, distance: 92 },
    { destination: 'St. Louis, MO', loads: 98, rate: 1.80, distance: 297 },
  ],
  'phoenix, az': [
    { destination: 'Los Angeles, CA', loads: 189, rate: 2.05, distance: 373 },
    { destination: 'Las Vegas, NV', loads: 123, rate: 1.90, distance: 297 },
    { destination: 'Denver, CO', loads: 87, rate: 2.20, distance: 860 },
  ],
};

// Get market data for a city
export function getMarketDataForCity(cityState) {
  const key = cityState.toLowerCase().trim();

  // Return specific market data if available
  if (marketData[key]) {
    return {
      city: cityState,
      ...marketData[key]
    };
  }

  // Return default "balanced" market for unknown cities
  return {
    city: cityState,
    marketTemperature: 'balanced',
    truckToLoadRatio: 1.5,
    loadsAvailable: 350,
    avgRatePerMile: 1.90,
    rateTrend: 'stable'
  };
}

// Calculate return load potential score (0-10)
function calculateReturnPotential(marketTemp, loadsAvailable) {
  let score = 5; // Base score

  // Market temperature impact (most important)
  if (marketTemp === 'hot') score += 4;
  else if (marketTemp === 'warm') score += 2;
  else if (marketTemp === 'balanced') score += 0;
  else if (marketTemp === 'cool') score -= 2;
  else if (marketTemp === 'cold') score -= 4;

  // Loads available impact
  if (loadsAvailable > 1000) score += 1;
  else if (loadsAvailable > 500) score += 0.5;
  else if (loadsAvailable < 200) score -= 1;

  // Clamp between 0-10
  return Math.max(0, Math.min(10, score));
}

// Get rating from score
function getReturnPotentialRating(score) {
  if (score >= 9) return 'Excellent';
  if (score >= 7) return 'Good';
  if (score >= 5) return 'Fair';
  if (score >= 3) return 'Poor';
  return 'Very Low';
}

// Get message from score
function getReturnPotentialMessage(score) {
  if (score >= 9) return 'Excellent return load opportunities available';
  if (score >= 7) return 'Good return load availability';
  if (score >= 5) return 'Moderate return load options';
  if (score >= 3) return 'Limited return load availability';
  return 'WARNING: Very low return load availability - expect empty return';
}

// Get recommendation action
function getRecommendation(originMarket, destMarket, returnScore) {
  const destTemp = destMarket.marketTemperature;
  const destRatio = destMarket.truckToLoadRatio;

  // Hot destination = ACCEPT
  if (destTemp === 'hot' && returnScore >= 7) {
    return {
      action: 'accept',
      message: 'ACCEPT - Strong outbound market, easy to find return freight'
    };
  }

  // Cold destination = WARN
  if (destTemp === 'cold' || returnScore < 4) {
    return {
      action: 'caution',
      message: 'CAUTION - Limited return loads, factor in deadhead costs'
    };
  }

  // Balanced/warm
  return {
    action: 'consider',
    message: 'CONSIDER - Moderate market conditions'
  };
}

// Main function to get complete market intelligence for a route
export function getMarketIntelligence(origin, destination) {
  const originMarket = getMarketDataForCity(origin);
  const destMarket = getMarketDataForCity(destination);

  const returnScore = calculateReturnPotential(
    destMarket.marketTemperature,
    destMarket.loadsAvailable
  );

  const returnRating = getReturnPotentialRating(returnScore);
  const returnMessage = getReturnPotentialMessage(returnScore);
  const recommendation = getRecommendation(originMarket, destMarket, returnScore);

  // Get top return lanes from destination
  const destKey = destination.toLowerCase().trim();
  const topReturnLanes = returnLanes[destKey] || [
    { destination: 'Various locations', loads: 150, rate: 2.00, distance: 500 },
  ];

  return {
    origin: originMarket,
    destination: destMarket,
    returnLoadPotential: {
      score: parseFloat(returnScore.toFixed(1)),
      rating: returnRating,
      message: returnMessage
    },
    topReturnLanes,
    recommendation
  };
}

// Get market temperature emoji and description
export function getMarketTempDisplay(temperature) {
  const displays = {
    'hot': { emoji: '🔥', label: 'HOT', color: 'red', description: 'High demand - Many loads, few trucks' },
    'warm': { emoji: '🔆', label: 'WARM', color: 'orange', description: 'Good market - Above-average load availability' },
    'balanced': { emoji: '⚖️', label: 'BALANCED', color: 'blue', description: 'Moderate - Supply and demand balanced' },
    'cool': { emoji: '❄️', label: 'COOL', color: 'cyan', description: 'Slower market - More trucks than loads' },
    'cold': { emoji: '🧊', label: 'COLD', color: 'gray', description: 'Avoid - Very few loads available' }
  };

  return displays[temperature] || displays['balanced'];
}

// Example usage:
// const marketIntel = getMarketIntelligence("Chicago, IL", "Los Angeles, CA");
