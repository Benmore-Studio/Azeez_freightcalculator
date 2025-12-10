import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
type ValidationTarget = 'body' | 'query' | 'params';
/**
 * Middleware factory for validating request data against a Zod schema
 */
export declare function validate(schema: ZodSchema, target?: ValidationTarget): (req: Request, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validate.d.ts.map