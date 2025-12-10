import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import routes, { healthRoutes } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
const app = express();
// Security middleware
app.use(helmet());
// CORS configuration
app.use(cors({
    origin: env.cors.origin.split(',').map((origin) => origin.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Request logging
if (env.isDevelopment) {
    app.use(morgan('dev'));
}
else {
    app.use(morgan('combined'));
}
// Rate limiting
const limiter = rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many requests, please try again later.',
    },
});
app.use('/api', limiter);
// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// Health check routes (outside /api prefix)
app.use('/health', healthRoutes);
// API routes
app.use('/api', routes);
// 404 handler
app.use(notFoundHandler);
// Error handler
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map