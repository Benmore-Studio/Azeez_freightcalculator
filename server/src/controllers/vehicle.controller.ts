import type { Response, NextFunction } from 'express';
import { z } from 'zod';
import * as vehicleService from '../services/vehicle.service.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { ApiError } from '../utils/ApiError.js';
import type { AuthenticatedRequest } from '../types/index.js';

// Validation schemas
const vehicleTypeEnum = z.enum(['semi', 'box_truck', 'cargo_van', 'sprinter', 'reefer']);
const equipmentTypeEnum = z.enum(['dry_van', 'refrigerated', 'flatbed', 'step_deck', 'lowboy', 'tanker', 'conestoga', 'specialized']);
const fuelTypeEnum = z.enum(['diesel', 'gasoline', 'cng', 'lng', 'electric', 'hybrid']);

const createVehicleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  vehicleType: vehicleTypeEnum,
  vin: z.string().max(17).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  make: z.string().max(50).optional(),
  model: z.string().max(50).optional(),
  equipmentType: equipmentTypeEnum.optional(),
  fuelType: fuelTypeEnum.optional(),
  mpg: z.number().positive().max(100).optional(),
  axleCount: z.number().int().min(2).max(10).optional(),
  hasSleeper: z.boolean().optional(),
  payloadCapacity: z.number().int().positive().optional(),
  grossVehicleWeight: z.number().int().positive().optional(),
  isPrimary: z.boolean().optional(),
});

const updateVehicleSchema = createVehicleSchema.partial().extend({
  isActive: z.boolean().optional(),
});

/**
 * Create a new vehicle
 * POST /api/vehicles
 */
export async function createVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const validatedData = createVehicleSchema.parse(req.body);
    const vehicle = await vehicleService.createVehicle(userId, validatedData as any);

    return sendCreated(res, vehicle, 'Vehicle created successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
}

/**
 * Get all vehicles for the current user
 * GET /api/vehicles
 */
export async function getVehicles(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const includeInactive = req.query.includeInactive === 'true';
    const vehicles = await vehicleService.getUserVehicles(userId, includeInactive);

    return sendSuccess(res, vehicles);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single vehicle by ID
 * GET /api/vehicles/:id
 */
export async function getVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const vehicle = await vehicleService.getVehicleById(userId, req.params.id);
    return sendSuccess(res, vehicle);
  } catch (error) {
    next(error);
  }
}

/**
 * Update a vehicle
 * PUT /api/vehicles/:id
 */
export async function updateVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const validatedData = updateVehicleSchema.parse(req.body);
    const vehicle = await vehicleService.updateVehicle(userId, req.params.id, validatedData as any);

    return sendSuccess(res, vehicle, 'Vehicle updated successfully');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new ApiError(400, 'Validation error: ' + error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
}

/**
 * Delete a vehicle (soft delete)
 * DELETE /api/vehicles/:id
 */
export async function deleteVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const result = await vehicleService.deleteVehicle(userId, req.params.id);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

/**
 * Get vehicle type defaults
 * GET /api/vehicles/defaults
 */
export async function getDefaults(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const vehicleType = req.query.vehicleType as string | undefined;

    if (vehicleType) {
      const result = vehicleTypeEnum.safeParse(vehicleType);
      if (!result.success) {
        throw new ApiError(400, 'Invalid vehicle type');
      }
      const defaults = vehicleService.getVehicleDefaults(result.data as any);
      return sendSuccess(res, { [vehicleType]: defaults });
    }

    const defaults = vehicleService.getVehicleDefaults();
    return sendSuccess(res, defaults);
  } catch (error) {
    next(error);
  }
}

/**
 * Set a vehicle as primary
 * POST /api/vehicles/:id/primary
 */
export async function setPrimary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const vehicle = await vehicleService.setVehicleAsPrimary(userId, req.params.id);
    return sendSuccess(res, vehicle, 'Vehicle set as primary');
  } catch (error) {
    next(error);
  }
}
