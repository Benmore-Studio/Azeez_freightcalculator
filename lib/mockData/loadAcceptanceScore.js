// Mock load acceptance score calculator
// Calculates 1-10 score based on 5 critical factors
// This simulates an intelligent decision engine

/**
 * Calculate load acceptance score
 * @param {Object} params
 * @param {number} params.rate - Total rate offered
 * @param {number} params.totalCosts - Total trip costs
 * @param {number} params.profitMargin - Profit margin percentage
 * @param {Object} params.marketData - Market intelligence data (from marketIntelligence.js)
 * @param {number} params.deadheadMiles - Empty miles to pickup
 * @param {number} params.totalMiles - Total trip miles
 * @param {Object} params.weatherData - Weather data (from weather.js)
 * @returns {Object} Score data with breakdown
 */
export function calculateLoadAcceptanceScore({
  rate,
  totalCosts,
  profitMargin,
  marketData,
  deadheadMiles = 0,
  totalMiles,
  weatherData
}) {
  let totalScore = 0;
  const factors = [];

  // FACTOR 1: Rate vs Cost (30% weight) - Most important
  let rateCostScore = 0;
  let rateCostStatus = 'poor';
  let rateCostMessage = '';

  if (profitMargin >= 25) {
    rateCostScore = 10;
    rateCostStatus = 'excellent';
    rateCostMessage = 'Excellent profit margin - well above industry standard';
  } else if (profitMargin >= 20) {
    rateCostScore = 8.5;
    rateCostStatus = 'good';
    rateCostMessage = 'Strong profit margin - meets industry standard';
  } else if (profitMargin >= 15) {
    rateCostScore = 7;
    rateCostStatus = 'fair';
    rateCostMessage = 'Acceptable margin - meets minimum standard';
  } else if (profitMargin >= 10) {
    rateCostScore = 5;
    rateCostStatus = 'caution';
    rateCostMessage = 'Low margin - below industry standard';
  } else {
    rateCostScore = 2;
    rateCostStatus = 'poor';
    rateCostMessage = 'Poor margin - rate too low for costs';
  }

  factors.push({
    name: 'Rate vs Cost',
    weight: 30,
    score: rateCostScore,
    status: rateCostStatus,
    message: rateCostMessage,
    detail: `${profitMargin.toFixed(1)}% profit margin`
  });

  totalScore += (rateCostScore * 0.30);

  // FACTOR 2: Market Conditions (20% weight)
  let marketScore = 0;
  let marketStatus = 'fair';
  let marketMessage = '';

  const destMarket = marketData?.destination;
  const returnLoadPotentialScore = marketData?.returnLoadPotential?.score || 5;

  if (destMarket) {
    const temp = destMarket.marketTemperature;

    if (temp === 'hot') {
      marketScore = 10;
      marketStatus = 'excellent';
      marketMessage = 'Hot destination market - high load demand';
    } else if (temp === 'warm') {
      marketScore = 8;
      marketStatus = 'good';
      marketMessage = 'Good destination market - above-average demand';
    } else if (temp === 'balanced') {
      marketScore = 6;
      marketStatus = 'fair';
      marketMessage = 'Balanced market - moderate conditions';
    } else if (temp === 'cool') {
      marketScore = 4;
      marketStatus = 'caution';
      marketMessage = 'Cool market - limited load availability';
    } else if (temp === 'cold') {
      marketScore = 2;
      marketStatus = 'poor';
      marketMessage = 'Cold market - very few loads available';
    }
  } else {
    marketScore = 5;
    marketStatus = 'fair';
    marketMessage = 'Market data unavailable';
  }

  factors.push({
    name: 'Market Conditions',
    weight: 20,
    score: marketScore,
    status: marketStatus,
    message: marketMessage,
    detail: destMarket ? `${destMarket.truckToLoadRatio} truck-to-load ratio` : 'N/A'
  });

  totalScore += (marketScore * 0.20);

  // FACTOR 3: Deadhead Miles (15% weight)
  let deadheadScore = 0;
  let deadheadStatus = 'fair';
  let deadheadMessage = '';
  const deadheadPercent = totalMiles > 0 ? (deadheadMiles / totalMiles) * 100 : 0;

  if (deadheadMiles === 0) {
    deadheadScore = 10;
    deadheadStatus = 'excellent';
    deadheadMessage = 'No deadhead miles - pickup at current location';
  } else if (deadheadPercent < 10) {
    deadheadScore = 9;
    deadheadStatus = 'excellent';
    deadheadMessage = 'Minimal deadhead - very close pickup';
  } else if (deadheadPercent < 20) {
    deadheadScore = 7;
    deadheadStatus = 'good';
    deadheadMessage = 'Acceptable deadhead distance';
  } else if (deadheadPercent < 30) {
    deadheadScore = 5;
    deadheadStatus = 'fair';
    deadheadMessage = 'Moderate deadhead - factor in fuel costs';
  } else if (deadheadPercent < 50) {
    deadheadScore = 3;
    deadheadStatus = 'caution';
    deadheadMessage = 'High deadhead - significant empty miles';
  } else {
    deadheadScore = 1;
    deadheadStatus = 'poor';
    deadheadMessage = 'Excessive deadhead - not recommended';
  }

  factors.push({
    name: 'Deadhead Distance',
    weight: 15,
    score: deadheadScore,
    status: deadheadStatus,
    message: deadheadMessage,
    detail: `${deadheadMiles} miles (${deadheadPercent.toFixed(1)}% of trip)`
  });

  totalScore += (deadheadScore * 0.15);

  // FACTOR 4: Weather Risk (15% weight)
  let weatherScore = 0;
  let weatherStatus = 'good';
  let weatherMessage = '';

  if (weatherData) {
    const hasAlerts = weatherData.routeAlerts && weatherData.routeAlerts.length > 0;
    const delayRisk = weatherData.delayRisk || 'Low Risk';

    if (!hasAlerts && delayRisk.includes('Low')) {
      weatherScore = 10;
      weatherStatus = 'excellent';
      weatherMessage = 'Clear conditions - no weather concerns';
    } else if (hasAlerts && weatherData.routeAlerts.some(a => a.severity === 'low')) {
      weatherScore = 7;
      weatherStatus = 'good';
      weatherMessage = 'Minor weather - low delay risk';
    } else if (delayRisk.includes('Medium')) {
      weatherScore = 5;
      weatherStatus = 'caution';
      weatherMessage = 'Moderate weather risk - plan extra time';
    } else if (hasAlerts && weatherData.routeAlerts.some(a => a.severity === 'high')) {
      weatherScore = 2;
      weatherStatus = 'poor';
      weatherMessage = 'Severe weather alerts - high delay risk';
    } else {
      weatherScore = 8;
      weatherStatus = 'good';
      weatherMessage = 'Normal weather conditions expected';
    }
  } else {
    weatherScore = 7;
    weatherStatus = 'good';
    weatherMessage = 'No weather data available';
  }

  factors.push({
    name: 'Weather Risk',
    weight: 15,
    score: weatherScore,
    status: weatherStatus,
    message: weatherMessage,
    detail: weatherData?.delayRisk || 'N/A'
  });

  totalScore += (weatherScore * 0.15);

  // FACTOR 5: Return Load Potential (20% weight)
  let returnScore = 0;
  let returnStatus = 'fair';
  let returnMessage = '';

  if (marketData?.returnLoadPotential) {
    const score = marketData.returnLoadPotential.score;

    if (score >= 9) {
      returnScore = 10;
      returnStatus = 'excellent';
      returnMessage = 'Excellent return load opportunities';
    } else if (score >= 7) {
      returnScore = 8;
      returnStatus = 'good';
      returnMessage = 'Good return load availability';
    } else if (score >= 5) {
      returnScore = 6;
      returnStatus = 'fair';
      returnMessage = 'Moderate return load options';
    } else if (score >= 3) {
      returnScore = 4;
      returnStatus = 'caution';
      returnMessage = 'Limited return loads - plan for deadhead';
    } else {
      returnScore = 2;
      returnStatus = 'poor';
      returnMessage = 'Very low return load potential';
    }
  } else {
    returnScore = 5;
    returnStatus = 'fair';
    returnMessage = 'Return load data unavailable';
  }

  factors.push({
    name: 'Return Load Potential',
    weight: 20,
    score: returnScore,
    status: returnStatus,
    message: returnMessage,
    detail: marketData?.returnLoadPotential ? `${marketData.returnLoadPotential.score}/10` : 'N/A'
  });

  totalScore += (returnScore * 0.20);

  // Calculate final score (0-10)
  const finalScore = Math.max(0, Math.min(10, totalScore));

  // Determine overall rating
  let rating = '';
  let ratingColor = '';
  let recommendation = '';

  if (finalScore >= 9) {
    rating = 'EXCELLENT LOAD';
    ratingColor = 'green';
    recommendation = 'ACCEPT THIS LOAD - All factors are favorable. This is a highly profitable opportunity.';
  } else if (finalScore >= 7) {
    rating = 'GOOD LOAD';
    ratingColor = 'blue';
    recommendation = 'ACCEPT THIS LOAD - Strong fundamentals with good profit potential. Recommended.';
  } else if (finalScore >= 5) {
    rating = 'FAIR LOAD';
    ratingColor = 'yellow';
    recommendation = 'CONSIDER CAREFULLY - Some positive factors but also concerns. Review details before accepting.';
  } else if (finalScore >= 3) {
    rating = 'POOR LOAD';
    ratingColor = 'orange';
    recommendation = 'NOT RECOMMENDED - Multiple risk factors present. Only accept if you have specific reasons.';
  } else {
    rating = 'AVOID THIS LOAD';
    ratingColor = 'red';
    recommendation = 'REJECT THIS LOAD - Critical issues identified. This load is not worth your time and resources.';
  }

  return {
    score: parseFloat(finalScore.toFixed(1)),
    rating,
    ratingColor,
    recommendation,
    factors
  };
}
