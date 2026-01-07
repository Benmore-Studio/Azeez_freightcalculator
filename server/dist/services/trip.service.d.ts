export interface CreateTripInput {
    name: string;
    origin: string;
    originCity?: string;
    originState?: string;
    destination: string;
    destinationCity?: string;
    destinationState?: string;
    distance?: number;
    isFavorite?: boolean;
}
export interface UpdateTripInput {
    name?: string;
    origin?: string;
    originCity?: string;
    originState?: string;
    destination?: string;
    destinationCity?: string;
    destinationState?: string;
    distance?: number;
    isFavorite?: boolean;
}
/**
 * Get all saved trips for a user
 */
export declare function getTrips(userId: string): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    originCity: string | null;
    originState: string | null;
    destinationCity: string | null;
    destinationState: string | null;
    origin: string;
    destination: string;
    distance: number | null;
    isFavorite: boolean;
    useCount: number;
    lastUsedAt: Date | null;
}[]>;
/**
 * Get a single trip by ID
 */
export declare function getTrip(userId: string, tripId: string): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    originCity: string | null;
    originState: string | null;
    destinationCity: string | null;
    destinationState: string | null;
    origin: string;
    destination: string;
    distance: number | null;
    isFavorite: boolean;
    useCount: number;
    lastUsedAt: Date | null;
}>;
/**
 * Create a new saved trip
 */
export declare function createTrip(userId: string, input: CreateTripInput): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    originCity: string | null;
    originState: string | null;
    destinationCity: string | null;
    destinationState: string | null;
    origin: string;
    destination: string;
    distance: number | null;
    isFavorite: boolean;
    useCount: number;
    lastUsedAt: Date | null;
}>;
/**
 * Update a saved trip
 */
export declare function updateTrip(userId: string, tripId: string, input: UpdateTripInput): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    originCity: string | null;
    originState: string | null;
    destinationCity: string | null;
    destinationState: string | null;
    origin: string;
    destination: string;
    distance: number | null;
    isFavorite: boolean;
    useCount: number;
    lastUsedAt: Date | null;
}>;
/**
 * Delete a saved trip
 */
export declare function deleteTrip(userId: string, tripId: string): Promise<{
    success: boolean;
}>;
/**
 * Toggle favorite status for a trip
 */
export declare function toggleFavorite(userId: string, tripId: string): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    originCity: string | null;
    originState: string | null;
    destinationCity: string | null;
    destinationState: string | null;
    origin: string;
    destination: string;
    distance: number | null;
    isFavorite: boolean;
    useCount: number;
    lastUsedAt: Date | null;
}>;
/**
 * Increment use count for a trip (called when trip is used in calculator)
 */
export declare function incrementUseCount(userId: string, tripId: string): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    originCity: string | null;
    originState: string | null;
    destinationCity: string | null;
    destinationState: string | null;
    origin: string;
    destination: string;
    distance: number | null;
    isFavorite: boolean;
    useCount: number;
    lastUsedAt: Date | null;
}>;
/**
 * Get frequently used trips (top 5)
 */
export declare function getFrequentTrips(userId: string, limit?: number): Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    originCity: string | null;
    originState: string | null;
    destinationCity: string | null;
    destinationState: string | null;
    origin: string;
    destination: string;
    distance: number | null;
    isFavorite: boolean;
    useCount: number;
    lastUsedAt: Date | null;
}[]>;
//# sourceMappingURL=trip.service.d.ts.map