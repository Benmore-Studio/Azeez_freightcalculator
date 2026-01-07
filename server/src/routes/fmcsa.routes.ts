import { Router } from 'express';
import * as fmcsaController from '../controllers/fmcsa.controller.js';

const router = Router();

/**
 * FMCSA Carrier/Broker Verification Routes
 *
 * These endpoints are public (no auth required) to allow
 * quick verification before accepting loads.
 */

// POST /api/fmcsa/verify - Smart search (DOT, MC, or name)
router.post('/verify', fmcsaController.verify);

// GET /api/fmcsa/dot/:dotNumber - Direct DOT lookup
router.get('/dot/:dotNumber', fmcsaController.getByDOT);

// GET /api/fmcsa/mc/:mcNumber - Direct MC lookup
router.get('/mc/:mcNumber', fmcsaController.getByMC);

export default router;
