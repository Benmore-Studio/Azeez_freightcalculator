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
  isTruckRoute?: boolean;
  routingProvider?: 'pcmiler' | 'google' | 'fallback';
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
  location: string;
}

export interface VehicleSpecs {
  vehicleType?: 'semi_truck' | 'straight_truck' | 'sprinter_van' | 'cargo_van' | 'box_truck';
  heightInches?: number;    // Vehicle height in inches (default: 162" for semi)
  weightLbs?: number;       // Gross vehicle weight in pounds
  lengthFeet?: number;      // Vehicle length in feet
  widthInches?: number;     // Vehicle width in inches (default: 96")
  axles?: number;           // Number of axles (default: 5 for semi)
  hazmat?: boolean;         // Carrying hazardous materials
  hazmatType?: 'none' | 'general' | 'explosive' | 'flammable' | 'corrosive' | 'radioactive';
}

// Default vehicle specs by type
const VEHICLE_DEFAULTS: Record<string, VehicleSpecs> = {
  semi_truck: {
    heightInches: 162,      // 13.5 feet
    weightLbs: 80000,       // 80,000 lbs max for US highways
    lengthFeet: 75,         // Tractor + trailer
    widthInches: 102,       // 8.5 feet
    axles: 5,
  },
  straight_truck: {
    heightInches: 156,      // 13 feet
    weightLbs: 26000,
    lengthFeet: 35,
    widthInches: 96,
    axles: 2,
  },
  box_truck: {
    heightInches: 132,      // 11 feet
    weightLbs: 16000,
    lengthFeet: 26,
    widthInches: 96,
    axles: 2,
  },
  sprinter_van: {
    heightInches: 110,      // ~9 feet
    weightLbs: 9500,
    lengthFeet: 24,
    widthInches: 80,
    axles: 2,
  },
  cargo_van: {
    heightInches: 84,       // 7 feet
    weightLbs: 6000,
    lengthFeet: 18,
    widthInches: 72,
    axles: 2,
  },
};

/**
 * Calculate distance and duration using PC*MILER (truck-legal routing)
 * Falls back to Google Maps or estimation if PC*MILER not available
 */
export async function calculateDistance(
  origin: string,
  destination: string,
  vehicleSpecs?: VehicleSpecs
): Promise<DistanceResult | null> {
  // Try PC*MILER first (truck-legal routing)
  const pcmilerResult = await calculateDistancePCMiler(origin, destination, vehicleSpecs);
  if (pcmilerResult) {
    return pcmilerResult;
  }

  // Fall back to Google Maps (not truck-specific)
  const googleResult = await calculateDistanceGoogle(origin, destination);
  if (googleResult) {
    console.warn('Using Google Maps fallback - route may not be truck-legal');
    return googleResult;
  }

  // Final fallback - straight-line estimation
  console.warn('No routing API available, using estimation');
  return null;
}

/**
 * PC*MILER API - Truck-legal routing
 * API Docs: https://developer.trimblemaps.com/restful-apis/developer-guide/introduction/
 */
async function calculateDistancePCMiler(
  origin: string,
  destination: string,
  vehicleSpecs?: VehicleSpecs
): Promise<DistanceResult | null> {
  const apiKey = env.apiKeys.pcmiler;

  if (!apiKey) {
    console.warn('[PC*MILER] API key not configured');
    return null;
  }

  console.log('[PC*MILER] Attempting route calculation:', origin, '->', destination);

  try {
    // Get vehicle defaults based on type
    const specs = vehicleSpecs?.vehicleType
      ? { ...VEHICLE_DEFAULTS[vehicleSpecs.vehicleType], ...vehicleSpecs }
      : { ...VEHICLE_DEFAULTS.semi_truck, ...vehicleSpecs };

    // Build PC*MILER route request
    // Using the REST API v1.0
    const baseUrl = 'https://pcmiler.alk.com/apis/rest/v1.0/service.svc/route/routeReports';

    const params = new URLSearchParams({
      authToken: apiKey,
      stops: `${origin};${destination}`,
      reports: 'CalcMiles',           // Get mileage calculation
      reportFormat: 'JSON',
      routeType: 'Practical',         // Use practical/common truck route
      vehicleType: 'Truck',           // Commercial truck routing
      routingType: 'ReduceToll',      // Optimize for lower tolls
      highwayOnly: 'false',
      bordersOpen: 'true',
      // Vehicle dimensions
      vehHeight: String(Math.ceil((specs.heightInches || 162) / 12)), // Convert to feet
      vehWeight: String(Math.round((specs.weightLbs || 80000) / 1000)), // Convert to 1000s lbs
      vehLength: String(specs.lengthFeet || 75),
      vehWidth: String(Math.ceil((specs.widthInches || 102) / 12)), // Convert to feet
      axles: String(specs.axles || 5),
    });

    // Add hazmat routing if specified
    if (specs.hazmat && specs.hazmatType && specs.hazmatType !== 'none') {
      params.set('hazMatType', mapHazmatType(specs.hazmatType));
    }

    const url = `${baseUrl}?${params.toString()}`;
    console.log('[PC*MILER] Request URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PC*MILER] API HTTP error:', response.status, response.statusText, errorText);
      return null;
    }

    const data = await response.json() as any;
    console.log('[PC*MILER] Response:', JSON.stringify(data).substring(0, 500));

    // Parse PC*MILER response
    if (!data || data.Errors?.length > 0) {
      console.error('[PC*MILER] Route error:', data?.Errors);
      return null;
    }

    // Extract mileage report
    const mileageReport = data?.[0]?.ReportLines;
    if (!mileageReport) {
      console.error('PC*MILER: No mileage report in response');
      return null;
    }

    // Parse the report (format varies, but typically contains total miles)
    const totalMilesLine = mileageReport.find((line: any) =>
      line.LMiles || line.TMiles || line.Miles
    );

    const distanceMiles = totalMilesLine?.TMiles || totalMilesLine?.LMiles || 0;

    // PC*MILER returns time in hours
    const routeLegs = data?.[0]?.RouteLegs || [];
    let totalMinutes = 0;
    for (const leg of routeLegs) {
      totalMinutes += leg.Minutes || 0;
    }

    const durationHours = Math.round((totalMinutes / 60) * 10) / 10;
    const durationMinutes = Math.round(totalMinutes);

    // Extract states crossed
    const statesCrossed: string[] = [];
    for (const line of mileageReport) {
      if (line.State && !statesCrossed.includes(line.State)) {
        statesCrossed.push(line.State);
      }
    }

    return {
      distanceMiles: Math.round(distanceMiles),
      durationHours,
      durationMinutes,
      originFormatted: origin,
      destinationFormatted: destination,
      statesCrossed,
      isTruckRoute: true,
      routingProvider: 'pcmiler',
    };
  } catch (error) {
    console.error('Error with PC*MILER API:', error);
    return null;
  }
}

/**
 * Map our hazmat types to PC*MILER hazmat codes (string)
 */
function mapHazmatType(type: string): string {
  const mapping: Record<string, string> = {
    general: 'General',
    explosive: 'Explosive',
    flammable: 'Flammable',
    corrosive: 'Corrosive',
    radioactive: 'Radioactive',
  };
  return mapping[type] || 'None';
}

/**
 * Map our hazmat types to PC*MILER numeric codes (for POST API)
 */
function mapHazmatTypeNumeric(type: string): number {
  const mapping: Record<string, number> = {
    none: 0,
    general: 1,
    explosive: 2,
    flammable: 3,
    corrosive: 4,
    radioactive: 5,
  };
  return mapping[type] || 0;
}

/**
 * Google Maps Distance Matrix API (fallback - not truck-specific)
 */
async function calculateDistanceGoogle(
  origin: string,
  destination: string
): Promise<DistanceResult | null> {
  const apiKey = env.apiKeys.googleMaps;

  if (!apiKey) {
    console.warn('GOOGLE_MAPS_API_KEY not configured, using fallback');
    return null;
  }

  try {
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

    const distanceMeters = element.distance.value;
    const distanceMiles = Math.round(distanceMeters / 1609.34);

    const durationSeconds = element.duration.value;
    const durationHours = Math.round((durationSeconds / 3600) * 10) / 10;
    const durationMinutes = Math.round(durationSeconds / 60);

    const originFormatted = data.origin_addresses?.[0] || origin;
    const destinationFormatted = data.destination_addresses?.[0] || destination;

    return {
      distanceMiles,
      durationHours,
      durationMinutes,
      originFormatted,
      destinationFormatted,
      isTruckRoute: false,
      routingProvider: 'google',
    };
  } catch (error) {
    console.error('Error calculating distance:', error);
    return null;
  }
}

/**
 * Get detailed route information including waypoints and states crossed
 * Uses PC*MILER for truck-legal routes, falls back to Google Maps
 */
export async function getRouteDetails(
  origin: string,
  destination: string,
  vehicleSpecs?: VehicleSpecs
): Promise<{
  distance: DistanceResult;
  waypoints: RouteWaypoint[];
  statesCrossed: string[];
} | null> {
  // Try PC*MILER first
  const pcmilerResult = await getRouteDetailsPCMiler(origin, destination, vehicleSpecs);
  if (pcmilerResult) {
    return pcmilerResult;
  }

  // Fall back to Google Maps Directions API
  const googleResult = await getRouteDetailsGoogle(origin, destination);
  if (googleResult) {
    console.warn('Using Google Maps for route details - may not be truck-legal');
    return googleResult;
  }

  return null;
}

/**
 * Get detailed truck route from PC*MILER
 */
/**
 * Geocode a location using PC*MILER locations API
 */
async function geocodeWithPCMiler(
  location: string,
  apiKey: string
): Promise<{ lat: number; lng: number; formatted: string; city: string; state: string } | null> {
  try {
    const trimmed = location.trim();
    let url: string;

    // If it's a zip code, use postcode parameter
    if (/^\d{5}(-\d{4})?$/.test(trimmed)) {
      const zip = trimmed.substring(0, 5);
      url = `https://pcmiler.alk.com/apis/rest/v1.0/service.svc/locations?authToken=${apiKey}&postcode=${zip}`;
    }
    // If it looks like "City, State" format
    else if (/^(.+?),\s*([A-Z]{2})$/i.test(trimmed)) {
      const match = trimmed.match(/^(.+?),\s*([A-Z]{2})$/i)!;
      url = `https://pcmiler.alk.com/apis/rest/v1.0/service.svc/locations?authToken=${apiKey}&city=${encodeURIComponent(match[1].trim())}&state=${match[2].toUpperCase()}`;
    }
    // Otherwise use as general search
    else {
      url = `https://pcmiler.alk.com/apis/rest/v1.0/service.svc/locations?authToken=${apiKey}&addr=${encodeURIComponent(trimmed)}`;
    }

    console.log('[PC*MILER] Geocoding:', trimmed);
    const response = await fetch(url);

    if (!response.ok) {
      console.error('[PC*MILER] Geocode HTTP error:', response.status);
      return null;
    }

    const data = await response.json() as any;

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('[PC*MILER] Geocode returned no results');
      return null;
    }

    const result = data[0];
    if (result.Errors && result.Errors.length > 0) {
      console.error('[PC*MILER] Geocode error:', result.Errors);
      return null;
    }

    return {
      lat: parseFloat(result.Coords.Lat),
      lng: parseFloat(result.Coords.Lon),
      formatted: `${result.Address.City}, ${result.Address.State} ${result.Address.Zip}`,
      city: result.Address.City,
      state: result.Address.State,
    };
  } catch (error) {
    console.error('[PC*MILER] Geocode error:', error);
    return null;
  }
}

async function getRouteDetailsPCMiler(
  origin: string,
  destination: string,
  vehicleSpecs?: VehicleSpecs
): Promise<{
  distance: DistanceResult;
  waypoints: RouteWaypoint[];
  statesCrossed: string[];
} | null> {
  const apiKey = env.apiKeys.pcmiler;

  if (!apiKey) {
    console.warn('[PC*MILER] API key not configured for route details');
    return null;
  }

  console.log('[PC*MILER] Getting route details:', origin, '->', destination);

  try {
    // Step 1: Geocode both locations to get coordinates
    const [originGeo, destGeo] = await Promise.all([
      geocodeWithPCMiler(origin, apiKey),
      geocodeWithPCMiler(destination, apiKey),
    ]);

    if (!originGeo || !destGeo) {
      console.error('[PC*MILER] Failed to geocode one or both locations');
      return null;
    }

    console.log('[PC*MILER] Geocoded:', originGeo.formatted, '->', destGeo.formatted);

    // Step 2: Build route request using GET with coordinates
    // Format: longitude,latitude (NOT lat,lng!)
    const specs = vehicleSpecs?.vehicleType
      ? { ...VEHICLE_DEFAULTS[vehicleSpecs.vehicleType], ...vehicleSpecs }
      : { ...VEHICLE_DEFAULTS.semi_truck, ...vehicleSpecs };

    const params = new URLSearchParams({
      authToken: apiKey,
      stops: `${originGeo.lng},${originGeo.lat};${destGeo.lng},${destGeo.lat}`,
      reports: 'Mileage', // Only Mileage is guaranteed to work
      vehType: '1', // Truck
      routeType: 'Practical',
      tollRoads: '2', // Reduce tolls
      vehHeight: String(Math.ceil((specs.heightInches || 162) / 12)),
      vehWeight: String(Math.round((specs.weightLbs || 80000) / 1000)),
      vehLength: String(specs.lengthFeet || 75),
      vehWidth: String(Math.ceil((specs.widthInches || 102) / 12)),
      axles: String(specs.axles || 5),
    });

    if (specs.hazmat && specs.hazmatType && specs.hazmatType !== 'none') {
      params.set('hazMatType', mapHazmatType(specs.hazmatType));
    }

    const url = `https://pcmiler.alk.com/apis/rest/v1.0/service.svc/route/routeReports?${params.toString()}`;
    console.log('[PC*MILER] Route request URL:', url.replace(apiKey, 'API_KEY_HIDDEN'));

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PC*MILER] Route HTTP error:', response.status, response.statusText, errorText);
      return null;
    }

    const data = await response.json() as any;
    console.log('[PC*MILER] Route response:', JSON.stringify(data).substring(0, 1500));

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('[PC*MILER] No route data returned');
      return null;
    }

    // Log available report types for debugging
    console.log('[PC*MILER] Report types received:', data.map((r: any) => r.__type || 'unknown'));

    // Parse mileage report - last stop has totals
    const mileageReport = data.find((r: any) => r.__type?.includes('MileageReport'));
    const reportLines = mileageReport?.ReportLines;

    if (!reportLines || reportLines.length < 2) {
      console.error('[PC*MILER] Invalid report lines');
      return null;
    }

    // Get totals from last stop
    const lastStop = reportLines[reportLines.length - 1];
    const totalMiles = parseFloat(lastStop.TMiles) || 0;

    // Parse hours from "HH:MM" format
    const hoursStr = lastStop.THours || '0:00';
    const [hours, minutes] = hoursStr.split(':').map(Number);
    const totalHours = hours + (minutes / 60);

    // Use origin and destination states from geocoding (real data)
    // Note: Full state-by-state breakdown requires upgraded PC*MILER subscription
    const statesCrossed: string[] = [];
    if (originGeo.state) {
      statesCrossed.push(originGeo.state);
    }
    if (destGeo.state && destGeo.state !== originGeo.state) {
      statesCrossed.push(destGeo.state);
    }
    console.log('[PC*MILER] Origin/Destination states:', statesCrossed);

    const distance: DistanceResult = {
      distanceMiles: Math.round(totalMiles),
      durationHours: Math.round(totalHours * 10) / 10,
      durationMinutes: Math.round(totalHours * 60),
      originFormatted: originGeo.formatted,
      destinationFormatted: destGeo.formatted,
      originLat: originGeo.lat,
      originLng: originGeo.lng,
      destinationLat: destGeo.lat,
      destinationLng: destGeo.lng,
      statesCrossed,
      isTruckRoute: true,
      routingProvider: 'pcmiler',
    };

    console.log('[PC*MILER] Success:', distance.distanceMiles, 'miles,', distance.durationHours, 'hours');

    return {
      distance,
      waypoints: [], // Could extract from detailed route if needed
      statesCrossed,
    };
  } catch (error) {
    console.error('[PC*MILER] Error:', error);
    return null;
  }
}

/**
 * Get detailed route from Google Maps (fallback)
 */
async function getRouteDetailsGoogle(
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

    const distanceMeters = leg.distance.value;
    const distanceMiles = Math.round(distanceMeters / 1609.34);

    const durationSeconds = leg.duration.value;
    const durationHours = Math.round((durationSeconds / 3600) * 10) / 10;
    const durationMinutes = Math.round(durationSeconds / 60);

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

      const stateMatch = step.html_instructions?.match(/,\s*([A-Z]{2})\s*\d{5}/);
      if (stateMatch) {
        statesSet.add(stateMatch[1]);
      }
    }

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
      isTruckRoute: false,
      routingProvider: 'google',
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
 * Uses Google Maps Geocoding API
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

/**
 * Get vehicle defaults for a vehicle type
 */
export function getVehicleDefaults(vehicleType: string): VehicleSpecs {
  return VEHICLE_DEFAULTS[vehicleType] || VEHICLE_DEFAULTS.semi_truck;
}
