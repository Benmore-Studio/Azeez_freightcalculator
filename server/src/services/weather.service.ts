import { env } from '../config/env.js';
import type { WeatherCondition } from '../../../lib/generated/prisma/index.js';

export interface WeatherForecast {
  condition: WeatherCondition;
  description: string;
  temperature: number;      // Fahrenheit
  humidity: number;         // Percentage
  windSpeed: number;        // MPH
  precipitation: number;    // Probability (0-100)
  visibility: number;       // Miles
  icon: string;
  date: Date;
}

export interface WeatherData {
  origin: WeatherForecast | null;
  destination: WeatherForecast | null;
  routeCondition: WeatherCondition;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  advisories: string[];
}

// OpenWeatherMap condition codes to our WeatherCondition enum
const CONDITION_MAP: Record<number, WeatherCondition> = {
  // Thunderstorm (200-299)
  200: 'heavy_rain',
  201: 'heavy_rain',
  202: 'extreme_weather',
  210: 'heavy_rain',
  211: 'heavy_rain',
  212: 'extreme_weather',
  221: 'heavy_rain',
  230: 'heavy_rain',
  231: 'heavy_rain',
  232: 'heavy_rain',

  // Drizzle (300-399)
  300: 'light_rain',
  301: 'light_rain',
  302: 'light_rain',
  310: 'light_rain',
  311: 'light_rain',
  312: 'light_rain',
  313: 'light_rain',
  314: 'light_rain',
  321: 'light_rain',

  // Rain (500-599)
  500: 'light_rain',
  501: 'light_rain',
  502: 'heavy_rain',
  503: 'heavy_rain',
  504: 'extreme_weather',
  511: 'ice',
  520: 'light_rain',
  521: 'heavy_rain',
  522: 'heavy_rain',
  531: 'heavy_rain',

  // Snow (600-699)
  600: 'snow',
  601: 'snow',
  602: 'snow',
  611: 'ice',
  612: 'ice',
  613: 'ice',
  615: 'snow',
  616: 'snow',
  620: 'snow',
  621: 'snow',
  622: 'snow',

  // Atmosphere (700-799)
  701: 'fog',
  711: 'fog',
  721: 'fog',
  731: 'fog',
  741: 'fog',
  751: 'fog',
  761: 'fog',
  762: 'extreme_weather',
  771: 'extreme_weather',
  781: 'extreme_weather',

  // Clear/Clouds (800-899)
  800: 'normal',
  801: 'normal',
  802: 'normal',
  803: 'normal',
  804: 'normal',
};

/**
 * Get weather forecast for a location and date
 */
export async function getWeatherForecast(
  lat: number,
  lng: number,
  targetDate?: Date
): Promise<WeatherForecast | null> {
  const apiKey = env.apiKeys.weather;

  if (!apiKey) {
    console.warn('WEATHER_API_KEY not configured');
    return null;
  }

  try {
    // Use 5-day forecast API (free tier) if target date is in the future
    const now = new Date();
    const target = targetDate || now;
    const daysAhead = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    let url: URL;
    if (daysAhead <= 0) {
      // Current weather
      url = new URL('https://api.openweathermap.org/data/2.5/weather');
    } else {
      // 5-day forecast (3-hour intervals)
      url = new URL('https://api.openweathermap.org/data/2.5/forecast');
    }

    url.searchParams.set('lat', lat.toString());
    url.searchParams.set('lon', lng.toString());
    url.searchParams.set('appid', apiKey);
    url.searchParams.set('units', 'imperial');

    const response = await fetch(url.toString());
    const data = await response.json() as any;

    if (data.cod !== 200 && data.cod !== '200') {
      console.error('OpenWeatherMap API error:', data.message);
      return null;
    }

    // Parse response based on API type
    if (daysAhead <= 0) {
      // Current weather response
      return parseCurrentWeather(data, now);
    } else {
      // Forecast response - find closest forecast to target date
      return parseForecast(data, target);
    }
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

/**
 * Parse current weather API response
 */
function parseCurrentWeather(data: any, date: Date): WeatherForecast {
  const weatherId = data.weather?.[0]?.id || 800;
  const condition = CONDITION_MAP[weatherId] || 'normal';

  return {
    condition,
    description: data.weather?.[0]?.description || 'Clear',
    temperature: Math.round(data.main?.temp || 70),
    humidity: data.main?.humidity || 50,
    windSpeed: Math.round(data.wind?.speed || 0),
    precipitation: data.rain?.['1h'] ? 100 : (data.clouds?.all || 0),
    visibility: Math.round((data.visibility || 10000) / 1609.34), // Convert meters to miles
    icon: data.weather?.[0]?.icon || '01d',
    date,
  };
}

/**
 * Parse forecast API response and find closest match to target date
 */
function parseForecast(data: any, targetDate: Date): WeatherForecast | null {
  const forecasts = data.list || [];
  if (forecasts.length === 0) {
    return null;
  }

  // Find forecast closest to target date
  let closestForecast = forecasts[0];
  let closestDiff = Infinity;

  for (const forecast of forecasts) {
    const forecastDate = new Date(forecast.dt * 1000);
    const diff = Math.abs(forecastDate.getTime() - targetDate.getTime());
    if (diff < closestDiff) {
      closestDiff = diff;
      closestForecast = forecast;
    }
  }

  const weatherId = closestForecast.weather?.[0]?.id || 800;
  const condition = CONDITION_MAP[weatherId] || 'normal';

  return {
    condition,
    description: closestForecast.weather?.[0]?.description || 'Clear',
    temperature: Math.round(closestForecast.main?.temp || 70),
    humidity: closestForecast.main?.humidity || 50,
    windSpeed: Math.round(closestForecast.wind?.speed || 0),
    precipitation: Math.round((closestForecast.pop || 0) * 100),
    visibility: Math.round((closestForecast.visibility || 10000) / 1609.34),
    icon: closestForecast.weather?.[0]?.icon || '01d',
    date: new Date(closestForecast.dt * 1000),
  };
}

/**
 * Get weather data for both origin and destination, determine overall route condition
 */
export async function getRouteWeather(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  deliveryDate?: Date
): Promise<WeatherData> {
  // Fetch weather for both locations in parallel
  const [originWeather, destWeather] = await Promise.all([
    getWeatherForecast(originLat, originLng, deliveryDate),
    getWeatherForecast(destLat, destLng, deliveryDate),
  ]);

  // Determine worst-case route condition (use the more severe of origin/destination)
  const routeCondition = getWorstCondition(
    originWeather?.condition || 'normal',
    destWeather?.condition || 'normal'
  );

  // Determine risk level
  const riskLevel = calculateRiskLevel(routeCondition, originWeather, destWeather);

  // Generate advisories
  const advisories = generateAdvisories(routeCondition, originWeather, destWeather);

  return {
    origin: originWeather,
    destination: destWeather,
    routeCondition,
    riskLevel,
    advisories,
  };
}

/**
 * Get the more severe of two weather conditions
 */
function getWorstCondition(condition1: WeatherCondition, condition2: WeatherCondition): WeatherCondition {
  const severity: Record<WeatherCondition, number> = {
    normal: 0,
    fog: 1,
    light_rain: 2,
    heavy_rain: 3,
    snow: 4,
    ice: 5,
    extreme_weather: 6,
  };

  return severity[condition1] >= severity[condition2] ? condition1 : condition2;
}

/**
 * Calculate risk level based on weather conditions
 */
function calculateRiskLevel(
  condition: WeatherCondition,
  origin: WeatherForecast | null,
  dest: WeatherForecast | null
): 'low' | 'moderate' | 'high' | 'severe' {
  // Base risk on condition
  switch (condition) {
    case 'extreme_weather':
      return 'severe';
    case 'ice':
    case 'snow':
      return 'high';
    case 'heavy_rain':
      return 'moderate';
    case 'fog':
    case 'light_rain':
      // Check visibility
      const minVisibility = Math.min(
        origin?.visibility || 10,
        dest?.visibility || 10
      );
      if (minVisibility < 1) return 'high';
      if (minVisibility < 3) return 'moderate';
      return 'low';
    default:
      return 'low';
  }
}

/**
 * Generate weather-related advisories for drivers
 */
function generateAdvisories(
  condition: WeatherCondition,
  origin: WeatherForecast | null,
  dest: WeatherForecast | null
): string[] {
  const advisories: string[] = [];

  switch (condition) {
    case 'extreme_weather':
      advisories.push('Severe weather warning: Consider delaying shipment');
      advisories.push('Monitor weather updates frequently');
      break;
    case 'ice':
      advisories.push('Icy conditions expected: Reduce speed and increase following distance');
      advisories.push('Allow extra time for the route');
      advisories.push('Check tire chains if crossing mountain passes');
      break;
    case 'snow':
      advisories.push('Snow expected: Ensure winter driving equipment available');
      advisories.push('Check road conditions before departure');
      break;
    case 'heavy_rain':
      advisories.push('Heavy rain expected: Reduce speed and use headlights');
      advisories.push('Watch for hydroplaning conditions');
      break;
    case 'fog':
      advisories.push('Fog expected: Use low-beam headlights');
      advisories.push('Increase following distance significantly');
      break;
    case 'light_rain':
      advisories.push('Light rain expected: Roads may be slick');
      break;
  }

  // Temperature advisories
  const minTemp = Math.min(
    origin?.temperature || 70,
    dest?.temperature || 70
  );
  const maxTemp = Math.max(
    origin?.temperature || 70,
    dest?.temperature || 70
  );

  if (minTemp < 32) {
    advisories.push('Freezing temperatures expected: Watch for black ice');
  }
  if (maxTemp > 95) {
    advisories.push('Extreme heat: Monitor tire pressure and coolant levels');
  }

  // Wind advisories
  const maxWind = Math.max(
    origin?.windSpeed || 0,
    dest?.windSpeed || 0
  );
  if (maxWind > 40) {
    advisories.push('High wind warning: Use caution with high-profile loads');
  } else if (maxWind > 25) {
    advisories.push('Gusty winds expected: Maintain firm grip on steering');
  }

  return advisories;
}

/**
 * Convert our WeatherCondition enum to display string
 */
export function getWeatherLabel(condition: WeatherCondition): string {
  const labels: Record<WeatherCondition, string> = {
    normal: 'Normal',
    light_rain: 'Light Rain',
    heavy_rain: 'Heavy Rain',
    snow: 'Snow',
    ice: 'Ice/Freezing',
    extreme_weather: 'Extreme Weather',
    fog: 'Fog',
  };
  return labels[condition] || 'Normal';
}
