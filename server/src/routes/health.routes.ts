import { Router } from 'express';
import * as healthController from '../controllers/health.controller.js';

const router = Router();

/**
 * @route   GET /health
 * @desc    Basic health check - returns OK if server is running
 * @access  Public
 */
router.get('/', healthController.healthCheck);

/**
 * @route   GET /health/ready
 * @desc    Readiness check - verifies database connectivity
 * @access  Public
 */
router.get('/ready', healthController.readinessCheck);

export default router;
