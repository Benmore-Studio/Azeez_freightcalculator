/**
 * PDF Controller
 *
 * Handles PDF export endpoints for quotes.
 */
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';
/**
 * Export a quote as PDF
 * GET /api/quotes/:id/pdf
 */
export declare function exportQuotePDF(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=pdf.controller.d.ts.map