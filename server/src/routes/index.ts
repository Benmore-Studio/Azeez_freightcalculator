import { Router } from 'express';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';
import settingsRoutes from './settings.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import quoteRoutes from './quote.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/quotes', quoteRoutes);

export { healthRoutes };
export default router;
