import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @route   GET /api/settings
 * @desc    Get current user's operating cost settings
 * @access  Protected
 */
router.get('/', authenticate, settingsController.getSettings);

/**
 * @route   PUT /api/settings
 * @desc    Update user's operating cost settings
 * @access  Protected
 */
router.put('/', authenticate, settingsController.updateSettings);

/**
 * @route   POST /api/settings/reset-defaults
 * @desc    Reset all settings to industry defaults
 * @access  Protected
 */
router.post('/reset-defaults', authenticate, settingsController.resetDefaults);

/**
 * @route   GET /api/settings/defaults
 * @desc    Get industry default values (optionally by vehicle type)
 * @access  Protected
 */
router.get('/defaults', authenticate, settingsController.getDefaults);

export default router;
