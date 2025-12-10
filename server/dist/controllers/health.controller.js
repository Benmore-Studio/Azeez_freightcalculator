import { prisma } from '../services/prisma.js';
import { sendSuccess } from '../utils/response.js';
export async function healthCheck(_req, res) {
    sendSuccess(res, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
}
export async function readinessCheck(_req, res) {
    try {
        // Check database connectivity
        await prisma.$queryRaw `SELECT 1`;
        sendSuccess(res, {
            status: 'ready',
            timestamp: new Date().toISOString(),
            database: 'connected',
        });
    }
    catch {
        res.status(503).json({
            success: false,
            error: 'Service not ready',
            database: 'disconnected',
        });
    }
}
//# sourceMappingURL=health.controller.js.map