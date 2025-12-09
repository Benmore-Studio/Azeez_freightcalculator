import { Router } from 'express';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';
import settingsRoutes from './settings.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);

export { healthRoutes };
export default router;
