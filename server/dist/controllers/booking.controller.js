import { z } from 'zod';
import * as bookingService from '../services/booking.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { ApiError } from '../utils/ApiError.js';
// Validation schemas
const paymentMethodEnum = z.enum(['quickpay', 'standard', 'factor']);
const createBookingSchema = z.object({
    quoteId: z.string().uuid('Invalid quote ID'),
    // Pickup
    pickupDate: z.string().transform((val) => new Date(val)),
    pickupTime: z.string().optional(),
    pickupContactName: z.string().max(100).optional(),
    pickupContactPhone: z.string().max(20).optional(),
    // Delivery
    deliveryDate: z.string().transform((val) => new Date(val)),
    deliveryTime: z.string().optional(),
    deliveryContactName: z.string().max(100).optional(),
    deliveryContactPhone: z.string().max(20).optional(),
    // Special instructions
    specialInstructions: z.string().max(1000).optional(),
    // Payment
    paymentMethod: paymentMethodEnum,
    quickpayFeeRate: z.number().min(0).max(0.1).optional(), // 0-10%
    // Confirmation
    sendConfirmation: z.boolean().optional().default(true),
    confirmationEmail: z.string().email().optional(),
    confirmationSms: z.string().max(20).optional(),
});
const updateStatusSchema = z.object({
    status: z.enum(['pending', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled']),
});
/**
 * Create a new booking
 * POST /api/bookings
 */
export async function createBooking(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const validatedData = createBookingSchema.parse(req.body);
        const booking = await bookingService.createBooking(userId, validatedData);
        return sendCreated(res, booking, 'Booking created successfully');
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')));
        }
        next(error);
    }
}
/**
 * Get all bookings for the current user
 * GET /api/bookings
 */
export async function getBookings(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const status = req.query.status;
        const filters = {};
        if (status) {
            filters.status = status;
        }
        const result = await bookingService.getUserBookings(userId, filters, page, limit);
        return sendSuccess(res, result);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get a single booking by ID
 * GET /api/bookings/:id
 */
export async function getBooking(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const booking = await bookingService.getBookingById(userId, req.params.id);
        return sendSuccess(res, booking);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get booking by quote ID
 * GET /api/bookings/quote/:quoteId
 */
export async function getBookingByQuote(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const booking = await bookingService.getBookingByQuoteId(userId, req.params.quoteId);
        return sendSuccess(res, booking);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update booking status
 * PATCH /api/bookings/:id/status
 */
export async function updateStatus(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const validatedData = updateStatusSchema.parse(req.body);
        const booking = await bookingService.updateBookingStatus(userId, req.params.id, validatedData.status);
        return sendSuccess(res, booking, 'Booking status updated successfully');
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => e.message).join(', ')));
        }
        next(error);
    }
}
/**
 * Cancel a booking
 * POST /api/bookings/:id/cancel
 */
export async function cancelBooking(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const booking = await bookingService.cancelBooking(userId, req.params.id);
        return sendSuccess(res, booking, 'Booking cancelled successfully');
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get booking statistics
 * GET /api/bookings/stats
 */
export async function getStats(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const stats = await bookingService.getBookingStats(userId);
        return sendSuccess(res, stats);
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get upcoming bookings
 * GET /api/bookings/upcoming
 */
export async function getUpcoming(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new ApiError(401, 'Unauthorized');
        }
        const limit = parseInt(req.query.limit) || 5;
        const bookings = await bookingService.getUpcomingBookings(userId, limit);
        return sendSuccess(res, bookings);
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=booking.controller.js.map