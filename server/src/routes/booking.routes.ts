import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /api/bookings/stats
 * @desc    Get booking statistics for current user
 * @access  Protected
 */
router.get('/stats', authenticate, bookingController.getStats);

/**
 * @route   GET /api/bookings/upcoming
 * @desc    Get upcoming bookings (next 7 days)
 * @access  Protected
 */
router.get('/upcoming', authenticate, bookingController.getUpcoming);

/**
 * @route   GET /api/bookings/quote/:quoteId
 * @desc    Get booking by quote ID
 * @access  Protected
 */
router.get('/quote/:quoteId', authenticate, bookingController.getBookingByQuote);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings for the current user
 * @access  Protected
 */
router.get('/', authenticate, bookingController.getBookings);

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking from a quote
 * @access  Protected
 */
router.post('/', authenticate, bookingController.createBooking);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get a single booking by ID
 * @access  Protected
 */
router.get('/:id', authenticate, bookingController.getBooking);

/**
 * @route   PATCH /api/bookings/:id/status
 * @desc    Update booking status
 * @access  Protected
 */
router.patch('/:id/status', authenticate, bookingController.updateStatus);

/**
 * @route   POST /api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Protected
 */
router.post('/:id/cancel', authenticate, bookingController.cancelBooking);

export default router;
