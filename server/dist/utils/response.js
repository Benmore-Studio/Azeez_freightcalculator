export function sendSuccess(res, data, message, statusCode = 200) {
    const response = {
        success: true,
        data,
        message,
    };
    return res.status(statusCode).json(response);
}
export function sendCreated(res, data, message = 'Resource created successfully') {
    return sendSuccess(res, data, message, 201);
}
export function sendNoContent(res) {
    return res.status(204).send();
}
export function sendPaginated(res, data, pagination) {
    const response = {
        success: true,
        data,
        pagination: {
            ...pagination,
            totalPages: Math.ceil(pagination.total / pagination.limit),
        },
    };
    return res.status(200).json(response);
}
export function sendError(res, statusCode, message, errors) {
    const response = {
        success: false,
        error: message,
        errors,
    };
    return res.status(statusCode).json(response);
}
//# sourceMappingURL=response.js.map