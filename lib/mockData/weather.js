// Mock weather data for freight rate calculator
// This will be replaced with OpenWeatherMap API in Phase 2

export const weatherConditions = {
  clear: { icon: 'sun', label: 'Clear', color: 'yellow' },
  sunny: { icon: 'sun', label: 'Sunny', color: 'yellow' },
  cloudy: { icon: 'cloud', label: 'Cloudy', color: 'gray' },
  rain: { icon: 'cloud-rain', label: 'Rain', color: 'blue' },
  snow: { icon: 'cloud-snow', label: 'Snow', color: 'blue' },
  storm: { icon: 'cloud-lightning', label: 'Storm', color: 'purple' },
  fog: { icon: 'cloud-fog', label: 'Fog', color: 'gray' },
};

// Simulate weather based on city and date
export function getWeatherForRoute(origin, destination, travelDate = new Date()) {
  // In real app, this would call OpenWeatherMap API
  // For now, return realistic mock data based on city

  const month = travelDate.getMonth(); // 0-11
  const isWinter = month >= 11 || month <= 2; // Dec, Jan, Feb
  const isSummer = month >= 5 && month <= 8; // Jun, Jul, Aug, Sep

  // Simulate weather patterns by region
  const getWeatherByCity = (cityState) => {
    const city = cityState.toLowerCase();

    // Winter patterns
    if (isWinter) {
      if (city.includes('chicago') || city.includes('omaha') || city.includes('minneapolis')) {
        return { temp_f: Math.floor(Math.random() * 20) + 20, condition: 'Snow' };
      }
      if (city.includes('seattle') || city.includes('portland')) {
        return { temp_f: Math.floor(Math.random() * 10) + 40, condition: 'Rain' };
      }
    }

    // Summer patterns
    if (isSummer) {
      if (city.includes('phoenix') || city.includes('las vegas') || city.includes('dallas')) {
        return { temp_f: Math.floor(Math.random() * 15) + 95, condition: 'Sunny' };
      }
      if (city.includes('miami') || city.includes('houston')) {
        return { temp_f: Math.floor(Math.random() * 10) + 85, condition: 'Storm' };
      }
    }

    // Default weather
    if (city.includes('los angeles') || city.includes('san diego')) {
      return { temp_f: Math.floor(Math.random() * 15) + 65, condition: 'Sunny' };
    }

    if (city.includes('seattle') || city.includes('portland')) {
      return { temp_f: Math.floor(Math.random() * 15) + 50, condition: 'Cloudy' };
    }

    // Default clear weather
    return { temp_f: Math.floor(Math.random() * 20) + 55, condition: 'Clear' };
  };

  const originWeather = getWeatherByCity(origin);
  const destWeather = getWeatherByCity(destination);

  // Generate route alerts based on conditions
  const routeAlerts = [];
  const hasSnow = originWeather.condition === 'Snow' || destWeather.condition === 'Snow';
  const hasStorm = originWeather.condition === 'Storm' || destWeather.condition === 'Storm';

  if (hasSnow) {
    routeAlerts.push({
      location: "I-80 near Des Moines, IA",
      alertType: "Winter Storm Warning",
      severity: "high",
      message: "Heavy snow expected 6-12 inches",
      validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      delayEstimate: "2-4 hours"
    });
  }

  if (hasStorm) {
    routeAlerts.push({
      location: "I-10 near Houston, TX",
      alertType: "Severe Thunderstorm Warning",
      severity: "medium",
      message: "Heavy rain and strong winds expected",
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      delayEstimate: "1-2 hours"
    });
  }

  // Generate 5-day forecast
  const forecast = [];
  const today = new Date(travelDate);
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const dayWeather = i === 0 ? originWeather.condition : (i === 4 ? destWeather.condition : 'Clear');
    const warning = dayWeather === 'Snow' || dayWeather === 'Storm';

    forecast.push({
      date: date.toISOString().split('T')[0],
      high: Math.floor(Math.random() * 20) + 55,
      low: Math.floor(Math.random() * 20) + 35,
      condition: dayWeather,
      icon: weatherConditions[dayWeather.toLowerCase()]?.icon || 'sun',
      warning
    });
  }

  // Calculate rate impact
  let surchargePercent = 0;
  let surchargeReason = null;

  if (hasSnow) {
    surchargePercent = 15;
    surchargeReason = "Severe winter storm along route";
  } else if (hasStorm) {
    surchargePercent = 10;
    surchargeReason = "Severe thunderstorms expected";
  } else if (originWeather.condition === 'Rain' || destWeather.condition === 'Rain') {
    surchargePercent = 5;
    surchargeReason = "Adverse weather conditions";
  }

  const delayRisk = routeAlerts.length > 0
    ? (routeAlerts[0].severity === 'high' ? 'High - 3-5 hour potential delay' : 'Medium - 1-3 hour potential delay')
    : 'Low - Clear weather expected';

  return {
    origin: {
      city: origin,
      temp_f: originWeather.temp_f,
      condition: originWeather.condition,
      icon: weatherConditions[originWeather.condition.toLowerCase()]?.icon || 'sun',
      feels_like: originWeather.temp_f - Math.floor(Math.random() * 5)
    },
    destination: {
      city: destination,
      temp_f: destWeather.temp_f,
      condition: destWeather.condition,
      icon: weatherConditions[destWeather.condition.toLowerCase()]?.icon || 'sun',
      feels_like: destWeather.temp_f - Math.floor(Math.random() * 5)
    },
    routeAlerts,
    forecast,
    rateImpact: surchargePercent > 0 ? {
      surchargePercent,
      surchargeAmount: 0, // Will be calculated based on base rate
      reason: surchargeReason
    } : null,
    delayRisk,
    hasAlerts: routeAlerts.length > 0
  };
}

// Example usage:
// const weather = getWeatherForRoute("Chicago, IL", "Los Angeles, CA");
