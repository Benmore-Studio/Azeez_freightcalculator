import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
const router = Router();
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);
/**
 * @route   POST /api/auth/login
 * @desc    Login user and return tokens
 * @access  Public
 */
router.post('/login', authController.login);
/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh', authController.refresh);
/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Protected
 */
router.get('/me', authenticate, authController.me);
/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Protected
 */
router.post('/logout', authenticate, authController.logout);
export default router;
//# sourceMappingURL=auth.routes.js.map