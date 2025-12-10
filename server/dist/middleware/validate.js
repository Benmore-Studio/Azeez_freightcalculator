import { ApiError } from '../utils/ApiError.js';
/**
 * Middleware factory for validating request data against a Zod schema
 */
export function validate(schema, target = 'body') {
    return (req, _res, next) => {
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
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map