import { z } from 'zod';
import * as quoteService from '../services/quote.service.js';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.js';
import { ApiError } from '../utils/ApiError.js';
// Validation schemas
const vehicleTypeEnum = z.enum(['semi', 'box_truck', 'cargo_van', 'sprinter', 'reefer']);
const loadTypeEnum = z.enum(['full_truckload', 'partial', 'ltl']);
const freightClassEnum = z.enum(['dry_van', 'refrigerated', 'flatbed', 'oversized', 'hazmat', 'tanker']);
const weatherConditionEnum = z.enum(['normal', 'light_rain', 'heavy_rain', 'snow', 'ice', 'extreme_weather', 'fog']);
const quoteStatusEnum = z.enum(['draft', 'calculated', 'booked', 'completed', 'cancelled', 'expired']);
const calculateRateSchema = z.object({
    // Route - required
    originAddress: z.string().min(1, 'Origin address is required'),
    originCity: z.string().optional(),
    originState: z.string().max(2).optional(),
    destinationAddress: z.string().min(1, 'Destination address is required'),
    destinationCity: z.string().optional(),
    destinationState: z.string().max(2).optional(),
    totalMiles: z.number().int().positive('Total miles must be positive'),
    deadheadMiles: z.number().int().min(0).optional(),
    // Vehicle
    vehicleId: z.string().uuid().optional(),
    vehicleType: vehicleTypeEnum,
    // Load details
    loadWeight: z.number().int().positive().optional(),
    loadType: loadTypeEnum.optional(),
    freightClass: freightClassEnum.optional(),
    commodityType: z.string().max(100).optional(),
    statesCrossed: z.array(z.string()).optional(),
    // Service options
    isExpedite: z.boolean().optional(),
    isTeam: z.boolean().optional(),
    isReefer: z.boolean().optional(),
    isRush: z.boolean().optional(),
    isSameDay: z.boolean().optional(),
    requiresLiftgate: z.boolean().optional(),
    requiresPalletJack: z.boolean().optional(),
    requiresDriverAssist: z.boolean().optional(),
    requiresWhiteGlove: z.boolean().optional(),
    requiresTracking: z.boolean().optional(),
    // Reefer details
    reeferMode: z.string().optional(),
    reeferTempMin: z.number().optional(),
    reeferTempMax: z.number().optional(),
    hazmatClass: z.string().optional(),
    // Conditions
    weatherCondition: weatherConditionEnum.optional(),
    season: z.string().optional(),
    fuelPriceOverride: z.number().positive().optional(),
    // Schedule
    pickupDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
    pickupTimeWindow: z.string().optional(),
    deliveryDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
    deliveryTimeWindow: z.string().optional(),
});
/**
 * Calculate rate (preview without saving)
 * POST /api/quotes/calculate
 */
export async function calculateRate(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const validatedData = calculateRateSchema.parse(req.body);
        const result = await quoteService.previewRate(userId, validatedData);
        return sendSuccess(res, result, 'Rate calculated successfully');
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')));
        }
        next(error);
    }
}
/**
 * Create and save a quote
 * POST /api/quotes
 */
export async function createQuote(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const validatedData = calculateRateSchema.parse(req.body);
        const result = await quoteService.createQuote(userId, validatedData);
        return sendCreated(res, result, 'Quote created successfully');
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')));
        }
        next(error);
    }
}
/**
 * Get all quotes for current user
 * GET /api/quotes
 */
export async function getQuotes(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const filters = {};
        if (req.query.status) {
            const statusResult = quoteStatusEnum.safeParse(req.query.status);
            if (statusResult.success) {
                filters.status = statusResult.data;
            }
        }
        const result = await quoteService.getUserQuotes(userId, filters, page, limit);
        return sendPaginated(res, result.quotes, result.pagination);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get a single quote by ID
 * GET /api/quotes/:id
 */
export async function getQuote(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const quote = await quoteService.getQuoteById(userId, req.params.id);
        return sendSuccess(res, quote);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update quote status
 * PATCH /api/quotes/:id/status
 */
export async function updateQuoteStatus(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const statusResult = quoteStatusEnum.safeParse(req.body.status);
        if (!statusResult.success) {
            throw new ApiError(400, 'Invalid status');
        }
        const quote = await quoteService.updateQuoteStatus(userId, req.params.id, statusResult.data);
        return sendSuccess(res, quote, 'Quote status updated');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Delete a quote
 * DELETE /api/quotes/:id
 */
export async function deleteQuote(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const result = await quoteService.deleteQuote(userId, req.params.id);
        return sendSuccess(res, result);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get recent quotes for dashboard
 * GET /api/quotes/recent
 */
export async function getRecentQuotes(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const limit = Math.min(parseInt(req.query.limit) || 5, 20);
        const quotes = await quoteService.getRecentQuotes(userId, limit);
        return sendSuccess(res, quotes);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get quote statistics
 * GET /api/quotes/stats
 */
export async function getQuoteStats(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const stats = await quoteService.getQuoteStats(userId);
        return sendSuccess(res, stats);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=quote.controller.js.map