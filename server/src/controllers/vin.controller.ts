import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { decodeVIN, mapToEquipmentType } from '../services/vin.service.js';

const decodeSchema = z.object({
  vin: z.string().min(17, 'VIN must be 17 characters').max(17, 'VIN must be 17 characters'),
});

/**
 * Decode a VIN using NHTSA API
 * POST /api/vin/decode
 */
export async function decode(req: Request, res: Response, next: NextFunction) {
  try {
    const { vin } = decodeSchema.parse(req.body);

    console.log(`[VIN Controller] Decoding VIN: ${vin}`);
    const vehicleInfo = await decodeVIN(vin);
    const equipmentType = mapToEquipmentType(vehicleInfo);

    res.json({
      success: true,
      data: {
        ...vehicleInfo,
        suggestedEquipmentType: equipmentType,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Invalid VIN format',
        errors: error.errors,
      });
      return;
    }
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
}
