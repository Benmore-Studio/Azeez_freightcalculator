import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './services/prisma.js';
const server = app.listen(env.port, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   Freight Calculator API Server                           ║
║                                                           ║
║   Environment: ${env.nodeEnv.padEnd(42)}║
║   Port:        ${env.port.toString().padEnd(42)}║
║   Health:      http://localhost:${env.port}/health${' '.repeat(23)}║
║   API Base:    http://localhost:${env.port}/api${' '.repeat(26)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    server.close(async () => {
        console.log('HTTP server closed.');
        try {
            await prisma.$disconnect();
            console.log('Database connection closed.');
            process.exit(0);
        }
        catch (error) {
            console.error('Error during shutdown:', error);
            process.exit(1);
        }
    });
    // Force close after 10 seconds
    setTimeout(() => {
        console.error('Forced shutdown after timeout.');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
export default server;
//# sourceMappingURL=index.js.map