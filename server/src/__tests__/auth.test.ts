import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Test constants
const JWT_SECRET = 'freight-calculator-jwt-secret-dev-key-2024';
const JWT_REFRESH_SECRET = 'freight-calculator-refresh-secret-dev-key-2024';

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

function generateRefreshToken(userId: string, email: string, userType: string): string {
  return jwt.sign({ userId, email, userType }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

function generateExpiredToken(userId: string, email: string, userType: string): string {
  return jwt.sign({ userId, email, userType }, JWT_SECRET, { expiresIn: '-1h' });
}

function authenticatedRequest(token: string) {
  return {
    get: (url: string) => request(app).get(url).set('Authorization', `Bearer ${token}`),
    post: (url: string) => request(app).post(url).set('Authorization', `Bearer ${token}`),
  };
}

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with required fields', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'newuser@example.com',
        name: 'New User',
        phone: null,
        companyName: null,
        userType: 'owner_operator',
        isVerified: false,
        onboardingCompleted: false,
        onboardingStep: 1,
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce(mockUser);
      mockPrisma.userSettings.create.mockResolvedValueOnce({ id: 'settings-1', userId: mockUser.id });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Account created successfully');
      expect(response.body.data.user.email).toBe('newuser@example.com');
      expect(response.body.data.user.name).toBe('New User');
      expect(response.body.data.user.userType).toBe('owner_operator');
      expect(response.body.data.token).toBeDefined();
    });

    it('should register a new user with all fields', async () => {
      const mockUser = {
        id: 'user-456',
        email: 'fulluser@example.com',
        name: 'Full User',
        phone: '+1234567890',
        companyName: 'Test Company',
        userType: 'fleet_manager',
        isVerified: false,
        onboardingCompleted: false,
        onboardingStep: 1,
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce(mockUser);
      mockPrisma.userSettings.create.mockResolvedValueOnce({ id: 'settings-2', userId: mockUser.id });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'fulluser@example.com',
          password: 'password123',
          name: 'Full User',
          phone: '+1234567890',
          companyName: 'Test Company',
          userType: 'fleet_manager',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.user.phone).toBe('+1234567890');
      expect(response.body.data.user.companyName).toBe('Test Company');
      expect(response.body.data.user.userType).toBe('fleet_manager');
    });

    it('should normalize email to lowercase', async () => {
      const mockUser = {
        id: 'user-789',
        email: 'uppercase@example.com',
        name: 'Test User',
        phone: null,
        companyName: null,
        userType: 'owner_operator',
        isVerified: false,
        onboardingCompleted: false,
        onboardingStep: 1,
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce(mockUser);
      mockPrisma.userSettings.create.mockResolvedValueOnce({ id: 'settings-3', userId: mockUser.id });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'UPPERCASE@EXAMPLE.COM',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.user.email).toBe('uppercase@example.com');
    });

    it('should accept snake_case fields for compatibility', async () => {
      const mockUser = {
        id: 'user-snake',
        email: 'snakecase@example.com',
        name: 'Snake Case User',
        phone: null,
        companyName: 'Snake Company',
        userType: 'dispatcher',
        isVerified: false,
        onboardingCompleted: false,
        onboardingStep: 1,
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce(mockUser);
      mockPrisma.userSettings.create.mockResolvedValueOnce({ id: 'settings-4', userId: mockUser.id });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'snakecase@example.com',
          password: 'password123',
          name: 'Snake Case User',
          company_name: 'Snake Company',
          user_type: 'dispatcher',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.user.companyName).toBe('Snake Company');
      expect(response.body.data.user.userType).toBe('dispatcher');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for password shorter than 8 characters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'short',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for name shorter than 2 characters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'A',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid userType', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          userType: 'invalid_type',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 409 for duplicate email', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'existing-user',
        email: 'duplicate@example.com',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123',
          name: 'Another User',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const passwordHash = await bcrypt.hash('validpassword123', 12);
      const mockUser = {
        id: 'user-login',
        email: 'login@example.com',
        name: 'Login User',
        phone: null,
        companyName: null,
        userType: 'owner_operator',
        passwordHash,
        isActive: true,
        isVerified: false,
        onboardingCompleted: false,
        onboardingStep: 1,
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
      mockPrisma.user.update.mockResolvedValueOnce({ ...mockUser, lastLoginAt: new Date() });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'validpassword123',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user.id).toBe('user-login');
      expect(response.body.data.user.email).toBe('login@example.com');
      expect(response.body.data.token).toBeDefined();
    });

    it('should login with uppercase email', async () => {
      const passwordHash = await bcrypt.hash('password123', 12);
      const mockUser = {
        id: 'user-case',
        email: 'lowercase@example.com',
        name: 'Case User',
        phone: null,
        companyName: null,
        userType: 'owner_operator',
        passwordHash,
        isActive: true,
        isVerified: false,
        onboardingCompleted: false,
        onboardingStep: 1,
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
      mockPrisma.user.update.mockResolvedValueOnce({ ...mockUser, lastLoginAt: new Date() });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'LOWERCASE@EXAMPLE.COM',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.user.email).toBe('lowercase@example.com');
    });

    it('should return 401 for invalid email', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'anypassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should return 401 for invalid password', async () => {
      const passwordHash = await bcrypt.hash('correctpassword', 12);
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-wrongpass',
        email: 'wrongpass@example.com',
        passwordHash,
        isActive: true,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrongpass@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should return 403 for deactivated account', async () => {
      const passwordHash = await bcrypt.hash('password123', 12);
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-deactivated',
        email: 'deactivated@example.com',
        passwordHash,
        isActive: false,
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'deactivated@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Your account has been deactivated');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: 'password123',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const mockUser = {
        id: 'user-refresh',
        email: 'refresh@example.com',
        userType: 'owner_operator',
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const refreshToken = generateRefreshToken(mockUser.id, mockUser.email, mockUser.userType);

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Token refreshed successfully');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid refresh token');
    });

    it('should return 401 for deactivated user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 'user-deactivated',
        email: 'deactivated@example.com',
        userType: 'owner_operator',
        isActive: false,
      });

      const refreshToken = generateRefreshToken('user-deactivated', 'deactivated@example.com', 'owner_operator');

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('User not found or deactivated');
    });

    it('should return 401 for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const refreshToken = generateRefreshToken('non-existent', 'nonexistent@example.com', 'owner_operator');

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('User not found or deactivated');
    });

    it('should return 400 for missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const mockUser = {
        id: 'user-me',
        email: 'me@example.com',
        name: 'Me User',
        phone: '+1234567890',
        companyName: 'My Company',
        userType: 'fleet_manager',
        isVerified: true,
        onboardingCompleted: true,
        onboardingStep: 5,
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const token = generateToken(mockUser.id, mockUser.email, mockUser.userType);

      const response = await authenticatedRequest(token).get('/api/auth/me');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('user-me');
      expect(response.body.data.email).toBe('me@example.com');
      expect(response.body.data.name).toBe('Me User');
      expect(response.body.data.userType).toBe('fleet_manager');
    });

    it('should return 401 without authorization header', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('No authorization header provided');
    });

    it('should return 401 with invalid token format', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat token123');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Invalid authorization header format');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
    });

    it('should return 401 with expired token', async () => {
      const expiredToken = generateExpiredToken('user-expired', 'expired@example.com', 'owner_operator');

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      // The exact error message may vary based on JWT library implementation
      expect(['Token has expired', 'Invalid token']).toContain(response.body.error);
    });

    it('should return 404 for deleted user with valid token', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);

      const token = generateToken('deleted-user', 'deleted@example.com', 'owner_operator');

      const response = await authenticatedRequest(token).get('/api/auth/me');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      const token = generateToken('user-logout', 'logout@example.com', 'owner_operator');

      const response = await authenticatedRequest(token).post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logged out successfully');
      expect(response.body.data).toBeNull();
    });

    it('should return 401 without authorization', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/api/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });

    it('should return 404 for non-existent POST routes', async () => {
      const response = await request(app).post('/api/nonexistent');

      expect(response.status).toBe(404);
    });
  });
});
