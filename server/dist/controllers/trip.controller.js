import { z } from 'zod';
import * as tripService from '../services/trip.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { ApiError } from '../utils/ApiError.js';
// Validation schemas
const createTripSchema = z.object({
    name: z.string().min(1, 'Trip name is required').max(100),
    origin: z.string().min(1, 'Origin is required'),
    originCity: z.string().optional(),
    originState: z.string().max(2).optional(),
    destination: z.string().min(1, 'Destination is required'),
    destinationCity: z.string().optional(),
    destinationState: z.string().max(2).optional(),
    distance: z.number().int().positive().optional(),
    isFavorite: z.boolean().optional(),
});
const updateTripSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    origin: z.string().min(1).optional(),
    originCity: z.string().optional(),
    originState: z.string().max(2).optional(),
    destination: z.string().min(1).optional(),
    destinationCity: z.string().optional(),
    destinationState: z.string().max(2).optional(),
    distance: z.number().int().positive().optional(),
    isFavorite: z.boolean().optional(),
});
/**
 * Get all saved trips for the current user
 * GET /api/trips
 */
export async function getTrips(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const trips = await tripService.getTrips(userId);
        return sendSuccess(res, trips);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get frequently used trips
 * GET /api/trips/frequent
 */
export async function getFrequentTrips(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const limit = parseInt(req.query.limit) || 5;
        const trips = await tripService.getFrequentTrips(userId, limit);
        return sendSuccess(res, trips);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get a single trip by ID
 * GET /api/trips/:id
 */
export async function getTrip(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const { id } = req.params;
        const trip = await tripService.getTrip(userId, id);
        return sendSuccess(res, trip);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Create a new saved trip
 * POST /api/trips
 */
export async function createTrip(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const validatedData = createTripSchema.parse(req.body);
        const trip = await tripService.createTrip(userId, validatedData);
        return sendCreated(res, trip, 'Trip saved successfully');
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')));
        }
        next(error);
    }
}
/**
 * Update a saved trip
 * PUT /api/trips/:id
 */
export async function updateTrip(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const { id } = req.params;
        const validatedData = updateTripSchema.parse(req.body);
        const trip = await tripService.updateTrip(userId, id, validatedData);
        return sendSuccess(res, trip, 'Trip updated successfully');
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')));
        }
        next(error);
    }
}
/**
 * Delete a saved trip
 * DELETE /api/trips/:id
 */
export async function deleteTrip(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const { id } = req.params;
        await tripService.deleteTrip(userId, id);
        return sendSuccess(res, null, 'Trip deleted successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Toggle favorite status for a trip
 * PATCH /api/trips/:id/favorite
 */
export async function toggleFavorite(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const { id } = req.params;
        const trip = await tripService.toggleFavorite(userId, id);
        return sendSuccess(res, trip, trip.isFavorite ? 'Trip added to favorites' : 'Trip removed from favorites');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Increment use count for a trip (called when used in calculator)
 * POST /api/trips/:id/use
 */
export async function incrementUseCount(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const { id } = req.params;
        const trip = await tripService.incrementUseCount(userId, id);
        return sendSuccess(res, trip);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=trip.controller.js.map