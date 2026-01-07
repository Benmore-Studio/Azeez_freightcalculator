import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';
/**
 * Get all saved trips for the current user
 * GET /api/trips
 */
export declare function getTrips(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get frequently used trips
 * GET /api/trips/frequent
 */
export declare function getFrequentTrips(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get a single trip by ID
 * GET /api/trips/:id
 */
export declare function getTrip(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Create a new saved trip
 * POST /api/trips
 */
export declare function createTrip(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
/**
 * Update a saved trip
 * PUT /api/trips/:id
 */
export declare function updateTrip(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
/**
 * Delete a saved trip
 * DELETE /api/trips/:id
 */
export declare function deleteTrip(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Toggle favorite status for a trip
 * PATCH /api/trips/:id/favorite
 */
export declare function toggleFavorite(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Increment use count for a trip (called when used in calculator)
 * POST /api/trips/:id/use
 */
export declare function incrementUseCount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=trip.controller.d.ts.map