import { Request, Response, NextFunction } from 'express';
/**
 * Verify a carrier/broker by any identifier (DOT, MC, or name)
 * POST /api/fmcsa/verify
 */
export declare function verify(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Lookup by DOT number
 * GET /api/fmcsa/dot/:dotNumber
 */
export declare function getByDOT(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Lookup by MC number
 * GET /api/fmcsa/mc/:mcNumber
 */
export declare function getByMC(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=fmcsa.controller.d.ts.map