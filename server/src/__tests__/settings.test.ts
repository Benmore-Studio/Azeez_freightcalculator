import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Test constants
const JWT_SECRET = 'freight-calculator-jwt-secret-dev-key-2024';

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
    findUnique: jest.fn() as AnyFn,
    update: jest.fn() as AnyFn,
    upsert: jest.fn() as AnyFn,
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

// Helper functions
function generateToken(userId: string, email: string, userType: string): string {
  return jwt.sign({ userId, email, userType }, JWT_SECRET, { expiresIn: '1h' });
}

function authenticatedRequest(token: string) {
  return {
    get: (url: string) => request(app).get(url).set('Authorization', `Bearer ${token}`),
    put: (url: string) => request(app).put(url).set('Authorization', `Bearer ${token}`),
    post: (url: string) => request(app).post(url).set('Authorization', `Bearer ${token}`),
  };
}

// Mock settings data with Decimal values represented as they would be from Prisma
const mockDefaultSettings = {
  id: 'settings-123',
  userId: 'user-123',
  annualInsurance: 12000.00,
  monthlyVehiclePayment: 1500.00,
  annualMiles: 100000,
  maintenanceCpm: 0.15,
  annualLicensing: 2500.00,
  monthlyOverhead: 500.00,
  factoringRate: 0.03,
  profitMargin: 0.15,
  expediteMultiplier: 1.30,
  teamMultiplier: 1.50,
  rushMultiplier: 1.50,
  sameDayMultiplier: 2.00,
  detentionRatePerHour: 75.00,
  driverAssistFee: 100.00,
  whiteGloveFee: 250.00,
  trackingFee: 25.00,
  specialEquipmentFee: 150.00,
  liftgateFee: 75.00,
  palletJackFee: 50.00,
  defPricePerGallon: 3.50,
  reeferMaintenancePerHour: 25.00,
  reeferFuelPerHour: 1.50,
  tireCpm: 0.05,
  defaultDeadheadMiles: 50,
  useIndustryDefaults: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Settings Endpoints', () => {
  const testUser = {
    id: 'user-123',
    email: 'test@example.com',
    userType: 'owner_operator',
  };

  const token = generateToken(testUser.id, testUser.email, testUser.userType);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/settings', () => {
    it('should return existing user settings', async () => {
      mockPrisma.userSettings.findUnique.mockResolvedValueOnce(mockDefaultSettings);

      const response = await authenticatedRequest(token).get('/api/settings');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe('user-123');
      expect(response.body.data.annualInsurance).toBe(12000);
      expect(response.body.data.maintenanceCpm).toBe(0.15);
      expect(response.body.data.useIndustryDefaults).toBe(true);
    });

    it('should create default settings if none exist', async () => {
      mockPrisma.userSettings.findUnique.mockResolvedValueOnce(null);
      mockPrisma.userSettings.create.mockResolvedValueOnce(mockDefaultSettings);

      const response = await authenticatedRequest(token).get('/api/settings');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.useIndustryDefaults).toBe(true);
      expect(mockPrisma.userSettings.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          useIndustryDefaults: true,
        },
      });
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/settings');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/settings', () => {
    it('should update settings with valid data', async () => {
      const updatedSettings = {
        ...mockDefaultSettings,
        annualInsurance: 14400.00,
        maintenanceCpm: 0.35,
        useIndustryDefaults: false,
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });
      mockPrisma.userSettings.upsert.mockResolvedValueOnce(updatedSettings);

      const response = await authenticatedRequest(token)
        .put('/api/settings')
        .send({
          annualInsurance: 14400,
          maintenanceCpm: 0.35,
          useIndustryDefaults: false,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Settings updated successfully');
      expect(response.body.data.annualInsurance).toBe(14400);
      expect(response.body.data.maintenanceCpm).toBe(0.35);
      expect(response.body.data.useIndustryDefaults).toBe(false);
    });

    it('should accept snake_case field names', async () => {
      const updatedSettings = {
        ...mockDefaultSettings,
        annualInsurance: 15000.00,
        monthlyVehiclePayment: 2000.00,
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });
      mockPrisma.userSettings.upsert.mockResolvedValueOnce(updatedSettings);

      const response = await authenticatedRequest(token)
        .put('/api/settings')
        .send({
          annual_insurance: 15000,
          monthly_vehicle_payment: 2000,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 for negative annual insurance', async () => {
      const response = await authenticatedRequest(token)
        .put('/api/settings')
        .send({
          annualInsurance: -5000,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for factoring rate exceeding 20%', async () => {
      const response = await authenticatedRequest(token)
        .put('/api/settings')
        .send({
          factoringRate: 0.25,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for multiplier less than 1.0', async () => {
      const response = await authenticatedRequest(token)
        .put('/api/settings')
        .send({
          expediteMultiplier: 0.5,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for multiplier exceeding 5.0', async () => {
      const response = await authenticatedRequest(token)
        .put('/api/settings')
        .send({
          teamMultiplier: 6.0,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for negative maintenance CPM', async () => {
      const response = await authenticatedRequest(token)
        .put('/api/settings')
        .send({
          maintenanceCpm: -0.10,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for CPM exceeding maximum', async () => {
      const response = await authenticatedRequest(token)
        .put('/api/settings')
        .send({
          maintenanceCpm: 10.0,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put('/api/settings')
        .send({
          annualInsurance: 14400,
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 if user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const response = await authenticatedRequest(token)
        .put('/api/settings')
        .send({
          annualInsurance: 14400,
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('POST /api/settings/reset-defaults', () => {
    it('should reset settings to base defaults without vehicle type', async () => {
      const resetSettings = {
        ...mockDefaultSettings,
        useIndustryDefaults: true,
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });
      mockPrisma.userSettings.upsert.mockResolvedValueOnce(resetSettings);

      const response = await authenticatedRequest(token)
        .post('/api/settings/reset-defaults')
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Settings reset to industry defaults');
      expect(response.body.data.useIndustryDefaults).toBe(true);
    });

    it('should reset settings with semi vehicle type defaults', async () => {
      const resetSettings = {
        ...mockDefaultSettings,
        maintenanceCpm: 0.35,
        annualMiles: 120000,
        useIndustryDefaults: true,
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });
      mockPrisma.userSettings.upsert.mockResolvedValueOnce(resetSettings);

      const response = await authenticatedRequest(token)
        .post('/api/settings/reset-defaults')
        .send({ vehicleType: 'semi' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reset settings with box_truck vehicle type defaults', async () => {
      const resetSettings = {
        ...mockDefaultSettings,
        maintenanceCpm: 0.20,
        annualMiles: 50000,
        useIndustryDefaults: true,
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });
      mockPrisma.userSettings.upsert.mockResolvedValueOnce(resetSettings);

      const response = await authenticatedRequest(token)
        .post('/api/settings/reset-defaults')
        .send({ vehicle_type: 'box_truck' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should reset settings with cargo_van vehicle type defaults', async () => {
      const resetSettings = {
        ...mockDefaultSettings,
        maintenanceCpm: 0.15,
        annualMiles: 75000,
        useIndustryDefaults: true,
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user-123' });
      mockPrisma.userSettings.upsert.mockResolvedValueOnce(resetSettings);

      const response = await authenticatedRequest(token)
        .post('/api/settings/reset-defaults')
        .send({ vehicleType: 'cargo_van' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 for invalid vehicle type', async () => {
      const response = await authenticatedRequest(token)
        .post('/api/settings/reset-defaults')
        .send({ vehicleType: 'invalid_type' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/settings/reset-defaults')
        .send({});

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 if user does not exist', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const response = await authenticatedRequest(token)
        .post('/api/settings/reset-defaults')
        .send({});

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('GET /api/settings/defaults', () => {
    it('should return base industry defaults without vehicle type', async () => {
      const response = await authenticatedRequest(token).get('/api/settings/defaults');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.annualInsurance).toBe(12000);
      expect(response.body.data.maintenanceCpm).toBe(0.15);
      expect(response.body.data.annualMiles).toBe(100000);
    });

    it('should return semi-specific defaults', async () => {
      const response = await authenticatedRequest(token).get('/api/settings/defaults?vehicleType=semi');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.maintenanceCpm).toBe(0.35);
      expect(response.body.data.annualMiles).toBe(120000);
      expect(response.body.data.vehicleType).toBe('semi');
    });

    it('should return box_truck-specific defaults', async () => {
      const response = await authenticatedRequest(token).get('/api/settings/defaults?vehicleType=box_truck');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.maintenanceCpm).toBe(0.20);
      expect(response.body.data.annualMiles).toBe(50000);
      expect(response.body.data.vehicleType).toBe('box_truck');
    });

    it('should return cargo_van-specific defaults', async () => {
      const response = await authenticatedRequest(token).get('/api/settings/defaults?vehicleType=cargo_van');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.maintenanceCpm).toBe(0.15);
      expect(response.body.data.annualMiles).toBe(75000);
      expect(response.body.data.vehicleType).toBe('cargo_van');
    });

    it('should return 400 for invalid vehicle type', async () => {
      const response = await authenticatedRequest(token).get('/api/settings/defaults?vehicleType=invalid');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid vehicle type');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/settings/defaults');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
