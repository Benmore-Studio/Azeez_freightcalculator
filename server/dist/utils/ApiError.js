export class ApiError extends Error {
    statusCode;
    isOperational;
    errors;
    constructor(statusCode, message, isOperational = true, errors) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errors = errors;
        Object.setPrototypeOf(this, ApiError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message, errors) {
        return new ApiError(400, message, true, errors);
    }
    static unauthorized(message = 'Unauthorized') {
        return new ApiError(401, message);
    }
    static forbidden(message = 'Forbidden') {
        return new ApiError(403, message);
    }
    static notFound(message = 'Resource not found') {
        return new ApiError(404, message);
    }
    static conflict(message) {
        return new ApiError(409, message);
    }
    static tooManyRequests(message = 'Too many requests') {
        return new ApiError(429, message);
    }
    static internal(message = 'Internal server error') {
        return new ApiError(500, message, false);
    }
}
//# sourceMappingURL=ApiError.js.map