import type { Response } from 'express';
export declare function sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: number): Response;
export declare function sendCreated<T>(res: Response, data: T, message?: string): Response;
export declare function sendNoContent(res: Response): Response;
export declare function sendPaginated<T>(res: Response, data: T[], pagination: {
    page: number;
    limit: number;
    total: number;
}): Response;
export declare function sendError(res: Response, statusCode: number, message: string, errors?: Array<{
    field: string;
    message: string;
}>): Response;
//# sourceMappingURL=response.d.ts.map