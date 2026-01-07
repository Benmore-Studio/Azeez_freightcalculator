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
    heightInches?: number;
    weightLbs?: number;
    lengthFeet?: number;
    widthInches?: number;
    axles?: number;
    hazmat?: boolean;
    hazmatType?: 'none' | 'general' | 'explosive' | 'flammable' | 'corrosive' | 'radioactive';
}
/**
 * Calculate distance and duration using PC*MILER (truck-legal routing)
 * Falls back to Google Maps or estimation if PC*MILER not available
 */
export declare function calculateDistance(origin: string, destination: string, vehicleSpecs?: VehicleSpecs): Promise<DistanceResult | null>;
/**
 * Get detailed route information including waypoints and states crossed
 * Uses PC*MILER for truck-legal routes, falls back to Google Maps
 */
export declare function getRouteDetails(origin: string, destination: string, vehicleSpecs?: VehicleSpecs): Promise<{
    distance: DistanceResult;
    waypoints: RouteWaypoint[];
    statesCrossed: string[];
} | null>;
/**
 * Geocode an address to get coordinates
 * Uses Google Maps Geocoding API
 */
export declare function geocodeAddress(address: string): Promise<{
    lat: number;
    lng: number;
    formatted: string;
    state?: string;
} | null>;
/**
 * Estimate miles based on rough calculation (fallback when API unavailable)
 * Uses a simple approximation based on straight-line distance + 30% for roads
 */
export declare function estimateMilesFallback(originLat: number, originLng: number, destLat: number, destLng: number): number;
/**
 * Get vehicle defaults for a vehicle type
 */
export declare function getVehicleDefaults(vehicleType: string): VehicleSpecs;
//# sourceMappingURL=distance.service.d.ts.map