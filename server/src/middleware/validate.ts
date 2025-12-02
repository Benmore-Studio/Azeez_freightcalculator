import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError.js';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Middleware factory for validating request data against a Zod schema
 */
export function validate(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = req[target];
      const result = schema.safeParse(data);

      if (!result.success) {
        const errors = result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        throw ApiError.badRequest('Validation failed', errors);
      }

      // Replace request data with parsed/transformed data
      req[target] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}
