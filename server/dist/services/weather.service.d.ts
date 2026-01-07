import type { WeatherCondition } from '../../../lib/generated/prisma/index.js';
export interface WeatherForecast {
    condition: WeatherCondition;
    description: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    visibility: number;
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
/**
 * Get weather forecast for a location and date
 */
export declare function getWeatherForecast(lat: number, lng: number, targetDate?: Date): Promise<WeatherForecast | null>;
/**
 * Get weather data for both origin and destination, determine overall route condition
 */
export declare function getRouteWeather(originLat: number, originLng: number, destLat: number, destLng: number, deliveryDate?: Date): Promise<WeatherData>;
/**
 * Convert our WeatherCondition enum to display string
 */
export declare function getWeatherLabel(condition: WeatherCondition): string;
//# sourceMappingURL=weather.service.d.ts.map