import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';
/**
 * Calculate rate (preview without saving)
 * POST /api/quotes/calculate
 */
export declare function calculateRate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
/**
 * Calculate enriched rate with auto-fetched distance, weather, and tolls
 * POST /api/quotes/calculate-enriched
 */
export declare function calculateEnrichedRate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
/**
 * Create and save a quote
 * POST /api/quotes
 */
export declare function createQuote(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
/**
 * Get all quotes for current user
 * GET /api/quotes
 */
export declare function getQuotes(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get a single quote by ID
 * GET /api/quotes/:id
 */
export declare function getQuote(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Update quote status
 * PATCH /api/quotes/:id/status
 */
export declare function updateQuoteStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Delete a quote
 * DELETE /api/quotes/:id
 */
export declare function deleteQuote(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get recent quotes for dashboard
 * GET /api/quotes/recent
 */
export declare function getRecentQuotes(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get quote statistics
 * GET /api/quotes/stats
 */
export declare function getQuoteStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=quote.controller.d.ts.map