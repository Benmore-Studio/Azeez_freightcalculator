import { jest } from '@jest/globals';

// Set test environment
process.env.NODE_ENV = 'test';

// Silence console logs during tests (optional - comment out for debugging)
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

// Global test timeout
jest.setTimeout(30000);
