export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly isOperational: boolean;
    readonly errors?: Array<{
        field: string;
        message: string;
    }>;
    constructor(statusCode: number, message: string, isOperational?: boolean, errors?: Array<{
        field: string;
        message: string;
    }>);
    static badRequest(message: string, errors?: Array<{
        field: string;
        message: string;
    }>): ApiError;
    static unauthorized(message?: string): ApiError;
    static forbidden(message?: string): ApiError;
    static notFound(message?: string): ApiError;
    static conflict(message: string): ApiError;
    static tooManyRequests(message?: string): ApiError;
    static internal(message?: string): ApiError;
}
//# sourceMappingURL=ApiError.d.ts.map