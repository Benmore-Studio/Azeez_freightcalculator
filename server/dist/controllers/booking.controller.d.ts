import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';
/**
 * Create a new booking
 * POST /api/bookings
 */
export declare function createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
/**
 * Get all bookings for the current user
 * GET /api/bookings
 */
export declare function getBookings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get a single booking by ID
 * GET /api/bookings/:id
 */
export declare function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get booking by quote ID
 * GET /api/bookings/quote/:quoteId
 */
export declare function getBookingByQuote(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Update booking status
 * PATCH /api/bookings/:id/status
 */
export declare function updateStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
/**
 * Cancel a booking
 * POST /api/bookings/:id/cancel
 */
export declare function cancelBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get booking statistics
 * GET /api/bookings/stats
 */
export declare function getStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get upcoming bookings
 * GET /api/bookings/upcoming
 */
export declare function getUpcoming(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=booking.controller.d.ts.map