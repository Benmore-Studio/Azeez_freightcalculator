import { Router } from 'express';
import * as vinController from '../controllers/vin.controller.js';

const router = Router();

/**
 * VIN Decode Routes
 * Uses free NHTSA vPIC API - no API key required
 */

// POST /api/vin/decode - Decode a VIN to get vehicle info
router.post('/decode', vinController.decode);

export default router;
