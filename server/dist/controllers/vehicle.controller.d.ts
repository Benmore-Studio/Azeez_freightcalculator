import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';
/**
 * Create a new vehicle
 * POST /api/vehicles
 */
export declare function createVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
/**
 * Get all vehicles for the current user
 * GET /api/vehicles
 */
export declare function getVehicles(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get a single vehicle by ID
 * GET /api/vehicles/:id
 */
export declare function getVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Update a vehicle
 * PUT /api/vehicles/:id
 */
export declare function updateVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
/**
 * Delete a vehicle (soft delete)
 * DELETE /api/vehicles/:id
 */
export declare function deleteVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get vehicle type defaults
 * GET /api/vehicles/defaults
 */
export declare function getDefaults(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Set a vehicle as primary
 * POST /api/vehicles/:id/primary
 */
export declare function setPrimary(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=vehicle.controller.d.ts.map