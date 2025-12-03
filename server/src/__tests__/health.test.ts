import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = jest.Mock<any>;

// Mock prisma before importing app
const mockPrisma = {
  user: {
    findUnique: jest.fn() as AnyFn,
    create: jest.fn() as AnyFn,
    update: jest.fn() as AnyFn,
    delete: jest.fn() as AnyFn,
    deleteMany: jest.fn() as AnyFn,
  },
  userSettings: {
    create: jest.fn() as AnyFn,
    deleteMany: jest.fn() as AnyFn,
  },
  $queryRaw: jest.fn() as AnyFn,
  $disconnect: jest.fn() as AnyFn,
};

jest.unstable_mockModule('../services/prisma.js', () => ({
  prisma: mockPrisma,
  default: mockPrisma,
}));

// Now import app after mocking
const { default: app } = await import('../app.js');
const { default: request } = await import('supertest');

describe('Health Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          status: 'healthy',
          timestamp: expect.any(String),
          uptime: expect.any(Number),
        }),
      });
    });

    it('should return valid timestamp format', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      const timestamp = new Date(response.body.data.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(isNaN(timestamp.getTime())).toBe(false);
    });

    it('should return positive uptime', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.data.uptime).toBeGreaterThan(0);
    });
  });

  describe('GET /health/ready', () => {
    it('should return ready status when database is connected', async () => {
      // Mock successful database query
      mockPrisma.$queryRaw.mockResolvedValueOnce([{ 1: 1 }]);

      const response = await request(app).get('/health/ready');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          status: 'ready',
          timestamp: expect.any(String),
          database: 'connected',
        }),
      });
    });

    it('should return 503 when database is disconnected', async () => {
      // Mock failed database query
      mockPrisma.$queryRaw.mockRejectedValueOnce(new Error('Connection refused'));

      const response = await request(app).get('/health/ready');

      expect(response.status).toBe(503);
      expect(response.body).toEqual({
        success: false,
        error: 'Service not ready',
        database: 'disconnected',
      });
    });

    it('should return valid timestamp format when ready', async () => {
      mockPrisma.$queryRaw.mockResolvedValueOnce([{ 1: 1 }]);

      const response = await request(app).get('/health/ready');

      expect(response.status).toBe(200);
      const timestamp = new Date(response.body.data.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(isNaN(timestamp.getTime())).toBe(false);
    });
  });
});
