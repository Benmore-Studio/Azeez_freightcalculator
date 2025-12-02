import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import type { AuthenticatedRequest, JwtPayload } from '../types/index.js';

/**
 * Middleware to authenticate requests using JWT
 * Extracts token from Authorization header (Bearer token)
 * Attaches decoded user payload to request object
 */
export function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw ApiError.unauthorized('No authorization header provided');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw ApiError.unauthorized('Invalid authorization header format. Use: Bearer <token>');
    }

    const token = parts[1];
    if (!token) {
      throw ApiError.unauthorized('No token provided');
    }

    const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      next(ApiError.unauthorized('Invalid token'));
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      next(ApiError.unauthorized('Token has expired'));
      return;
    }

    next(ApiError.unauthorized('Authentication failed'));
  }
}

/**
 * Optional authentication middleware
 * Attempts to authenticate but allows request to proceed if no token
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next();
      return;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      next();
      return;
    }

    const token = parts[1];
    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
    };

    next();
  } catch {
    // If token is invalid, continue without user
    next();
  }
}

/**
 * Middleware to check if user has specific user type
 */
export function requireUserType(...allowedTypes: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized('Authentication required'));
      return;
    }

    if (!allowedTypes.includes(req.user.userType)) {
      next(ApiError.forbidden('You do not have permission to access this resource'));
      return;
    }

    next();
  };
}
