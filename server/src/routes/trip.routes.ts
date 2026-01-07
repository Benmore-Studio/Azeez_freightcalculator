import { Router } from 'express';
import * as tripController from '../controllers/trip.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /api/trips
 * @desc    Get all saved trips for the current user
 * @access  Protected
 */
router.get('/', authenticate, tripController.getTrips);

/**
 * @route   GET /api/trips/frequent
 * @desc    Get frequently used trips (top 5)
 * @access  Protected
 */
router.get('/frequent', authenticate, tripController.getFrequentTrips);

/**
 * @route   GET /api/trips/:id
 * @desc    Get a single saved trip by ID
 * @access  Protected
 */
router.get('/:id', authenticate, tripController.getTrip);

/**
 * @route   POST /api/trips
 * @desc    Create a new saved trip
 * @access  Protected
 */
router.post('/', authenticate, tripController.createTrip);

/**
 * @route   PUT /api/trips/:id
 * @desc    Update a saved trip
 * @access  Protected
 */
router.put('/:id', authenticate, tripController.updateTrip);

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete a saved trip
 * @access  Protected
 */
router.delete('/:id', authenticate, tripController.deleteTrip);

/**
 * @route   PATCH /api/trips/:id/favorite
 * @desc    Toggle favorite status for a trip
 * @access  Protected
 */
router.patch('/:id/favorite', authenticate, tripController.toggleFavorite);

/**
 * @route   POST /api/trips/:id/use
 * @desc    Increment use count for a trip (when used in calculator)
 * @access  Protected
 */
router.post('/:id/use', authenticate, tripController.incrementUseCount);

export default router;
