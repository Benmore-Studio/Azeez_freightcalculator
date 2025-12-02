import { Router } from 'express';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);

export { healthRoutes };
export default router;
