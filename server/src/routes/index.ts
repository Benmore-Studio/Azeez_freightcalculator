import { Router } from 'express';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';
import settingsRoutes from './settings.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import quoteRoutes from './quote.routes.js';
import tripRoutes from './trip.routes.js';
import rewardRoutes from './reward.routes.js';
import bookingRoutes from './booking.routes.js';
import fmcsaRoutes from './fmcsa.routes.js';
import vinRoutes from './vin.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/quotes', quoteRoutes);
router.use('/trips', tripRoutes);
router.use('/rewards', rewardRoutes);
router.use('/bookings', bookingRoutes);
router.use('/fmcsa', fmcsaRoutes);
router.use('/vin', vinRoutes);

export { healthRoutes };
export default router;
