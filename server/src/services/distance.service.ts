import { env } from '../config/env.js';

export interface DistanceResult {
  distanceMiles: number;
  durationHours: number;
  durationMinutes: number;
  originFormatted: string;
  destinationFormatted: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  statesCrossed?: string[];
  polyline?: string;
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
  location: string;
}

/**
 * Calculate distance and duration between two addresses using Google Maps Distance Matrix API
 */
export async function calculateDistance(
  origin: string,
  destination: string
): Promise<DistanceResult | null> {
  const apiKey = env.apiKeys.googleMaps;

  if (!apiKey) {
    console.warn('GOOGLE_MAPS_API_KEY not configured, using fallback');
    return null;
  }

  try {
    // Use Google Maps Distance Matrix API
    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
    url.searchParams.set('origins', origin);
    url.searchParams.set('destinations', destination);
    url.searchParams.set('units', 'imperial');
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json() as any;

    if (data.status !== 'OK') {
      console.error('Google Maps API error:', data.status, data.error_message);
      return null;
    }

    const element = data.rows?.[0]?.elements?.[0];
    if (!element || element.status !== 'OK') {
      console.error('Route not found:', element?.status);
      return null;
    }

    // Convert meters to miles (1 mile = 1609.34 meters)
    const distanceMeters = element.distance.value;
    const distanceMiles = Math.round(distanceMeters / 1609.34);

    // Convert seconds to hours
    const durationSeconds = element.duration.value;
    const durationHours = Math.round((durationSeconds / 3600) * 10) / 10;
    const durationMinutes = Math.round(durationSeconds / 60);

    // Get formatted addresses
    const originFormatted = data.origin_addresses?.[0] || origin;
    const destinationFormatted = data.destination_addresses?.[0] || destination;

    return {
      distanceMiles,
      durationHours,
      durationMinutes,
      originFormatted,
      destinationFormatted,
    };
  } catch (error) {
    console.error('Error calculating distance:', error);
    return null;
  }
}

/**
 * Get detailed route information including waypoints and states crossed
 * Uses Google Maps Directions API for more detailed routing
 */
export async function getRouteDetails(
  origin: string,
  destination: string
): Promise<{
  distance: DistanceResult;
  waypoints: RouteWaypoint[];
  statesCrossed: string[];
} | null> {
  const apiKey = env.apiKeys.googleMaps;

  if (!apiKey) {
    console.warn('GOOGLE_MAPS_API_KEY not configured');
    return null;
  }

  try {
    // Use Directions API for detailed route
    const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
    url.searchParams.set('origin', origin);
    url.searchParams.set('destination', destination);
    url.searchParams.set('units', 'imperial');
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json() as any;

    if (data.status !== 'OK') {
      console.error('Google Maps Directions API error:', data.status);
      return null;
    }

    const route = data.routes?.[0];
    if (!route) {
      return null;
    }

    const leg = route.legs?.[0];
    if (!leg) {
      return null;
    }

    // Calculate total distance in miles
    const distanceMeters = leg.distance.value;
    const distanceMiles = Math.round(distanceMeters / 1609.34);

    // Calculate duration
    const durationSeconds = leg.duration.value;
    const durationHours = Math.round((durationSeconds / 3600) * 10) / 10;
    const durationMinutes = Math.round(durationSeconds / 60);

    // Extract waypoints from route steps for toll calculation
    const waypoints: RouteWaypoint[] = [];
    const statesSet = new Set<string>();

    for (const step of leg.steps || []) {
      if (step.start_location) {
        waypoints.push({
          lat: step.start_location.lat,
          lng: step.start_location.lng,
          location: step.html_instructions?.replace(/<[^>]*>/g, '') || '',
        });
      }

      // Try to extract state from instructions
      const stateMatch = step.html_instructions?.match(/,\s*([A-Z]{2})\s*\d{5}/);
      if (stateMatch) {
        statesSet.add(stateMatch[1]);
      }
    }

    // Add origin and destination coordinates
    const distance: DistanceResult = {
      distanceMiles,
      durationHours,
      durationMinutes,
      originFormatted: leg.start_address,
      destinationFormatted: leg.end_address,
      originLat: leg.start_location?.lat,
      originLng: leg.start_location?.lng,
      destinationLat: leg.end_location?.lat,
      destinationLng: leg.end_location?.lng,
      statesCrossed: Array.from(statesSet),
      polyline: route.overview_polyline?.points,
    };

    return {
      distance,
      waypoints,
      statesCrossed: Array.from(statesSet),
    };
  } catch (error) {
    console.error('Error getting route details:', error);
    return null;
  }
}

/**
 * Geocode an address to get coordinates
 */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number; formatted: string; state?: string } | null> {
  const apiKey = env.apiKeys.googleMaps;

  if (!apiKey) {
    return null;
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('address', address);
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json() as any;

    if (data.status !== 'OK' || !data.results?.[0]) {
      return null;
    }

    const result = data.results[0];
    const location = result.geometry?.location;

    // Extract state from address components
    let state: string | undefined;
    for (const component of result.address_components || []) {
      if (component.types?.includes('administrative_area_level_1')) {
        state = component.short_name;
        break;
      }
    }

    return {
      lat: location.lat,
      lng: location.lng,
      formatted: result.formatted_address,
      state,
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

/**
 * Estimate miles based on rough calculation (fallback when API unavailable)
 * Uses a simple approximation based on straight-line distance + 30% for roads
 */
export function estimateMilesFallback(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): number {
  // Haversine formula for straight-line distance
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(destLat - originLat);
  const dLng = toRad(destLng - originLng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(originLat)) * Math.cos(toRad(destLat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineDistance = R * c;

  // Add 30% for road routing (roads aren't straight)
  return Math.round(straightLineDistance * 1.3);
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
