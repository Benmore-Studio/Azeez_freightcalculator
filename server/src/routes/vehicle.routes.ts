import { Router } from 'express';
import * as vehicleController from '../controllers/vehicle.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /api/vehicles/defaults
 * @desc    Get vehicle type default values
 * @access  Public (no auth required for defaults)
 */
router.get('/defaults', vehicleController.getDefaults);

/**
 * @route   GET /api/vehicles
 * @desc    Get all vehicles for the current user
 * @access  Protected
 */
router.get('/', authenticate, vehicleController.getVehicles);

/**
 * @route   POST /api/vehicles
 * @desc    Create a new vehicle
 * @access  Protected
 */
router.post('/', authenticate, vehicleController.createVehicle);

/**
 * @route   GET /api/vehicles/:id
 * @desc    Get a single vehicle by ID
 * @access  Protected
 */
router.get('/:id', authenticate, vehicleController.getVehicle);

/**
 * @route   PUT /api/vehicles/:id
 * @desc    Update a vehicle
 * @access  Protected
 */
router.put('/:id', authenticate, vehicleController.updateVehicle);

/**
 * @route   DELETE /api/vehicles/:id
 * @desc    Delete a vehicle (soft delete)
 * @access  Protected
 */
router.delete('/:id', authenticate, vehicleController.deleteVehicle);

/**
 * @route   POST /api/vehicles/:id/primary
 * @desc    Set a vehicle as the primary vehicle
 * @access  Protected
 */
router.post('/:id/primary', authenticate, vehicleController.setPrimary);

export default router;
