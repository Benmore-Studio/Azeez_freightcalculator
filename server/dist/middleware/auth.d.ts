import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';
/**
 * Middleware to authenticate requests using JWT
 * Extracts token from Authorization header (Bearer token)
 * Attaches decoded user payload to request object
 */
export declare function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void;
/**
 * Optional authentication middleware
 * Attempts to authenticate but allows request to proceed if no token
 */
export declare function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void;
/**
 * Middleware to check if user has specific user type
 */
export declare function requireUserType(...allowedTypes: string[]): (req: AuthenticatedRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map