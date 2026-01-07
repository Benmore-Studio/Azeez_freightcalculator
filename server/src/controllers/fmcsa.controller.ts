import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { verifyCarrier, lookupByDOT, lookupByMC } from '../services/fmcsa.service.js';

// Validation schemas
const verifySchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
});

const dotSchema = z.object({
  dotNumber: z.string().regex(/^\d+$/, 'DOT number must contain only digits'),
});

const mcSchema = z.object({
  mcNumber: z.string().regex(/^\d+$/, 'MC number must contain only digits'),
});

/**
 * Verify a carrier/broker by any identifier (DOT, MC, or name)
 * POST /api/fmcsa/verify
 */
export async function verify(req: Request, res: Response, next: NextFunction) {
  try {
    const { query } = verifySchema.parse(req.body);

    console.log(`[FMCSA Controller] Verifying: ${query}`);
    const result = await verifyCarrier(query);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Invalid request',
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
}

/**
 * Lookup by DOT number
 * GET /api/fmcsa/dot/:dotNumber
 */
export async function getByDOT(req: Request, res: Response, next: NextFunction) {
  try {
    const { dotNumber } = dotSchema.parse(req.params);

    console.log(`[FMCSA Controller] DOT lookup: ${dotNumber}`);
    const result = await lookupByDOT(dotNumber);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Invalid DOT number',
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
}

/**
 * Lookup by MC number
 * GET /api/fmcsa/mc/:mcNumber
 */
export async function getByMC(req: Request, res: Response, next: NextFunction) {
  try {
    const { mcNumber } = mcSchema.parse(req.params);

    console.log(`[FMCSA Controller] MC lookup: ${mcNumber}`);
    const result = await lookupByMC(mcNumber);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Invalid MC number',
        errors: error.errors,
      });
      return;
    }
    next(error);
  }
}
