import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from './prisma.js';
import { ApiError } from '../utils/ApiError.js';
import type { TokenPair, JwtPayload, UserResponse } from '../types/index.js';

const SALT_ROUNDS = 12;

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
  companyName?: string;
  userType?: 'owner_operator' | 'fleet_manager' | 'dispatcher';
}

export interface LoginInput {
  email: string;
  password: string;
}

function generateTokens(user: { id: string; email: string; userType: string }): TokenPair {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    userId: user.id,
    email: user.email,
    userType: user.userType,
  };

  const accessToken = jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });

  return { accessToken, refreshToken };
}

function sanitizeUser(user: {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  companyName: string | null;
  userType: string;
  isVerified: boolean;
  onboardingCompleted: boolean;
  onboardingStep: number;
  createdAt: Date;
}): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    companyName: user.companyName,
    userType: user.userType,
    isVerified: user.isVerified,
    onboardingCompleted: user.onboardingCompleted,
    onboardingStep: user.onboardingStep,
    createdAt: user.createdAt,
  };
}

export async function register(input: RegisterInput): Promise<{
  user: UserResponse;
  token: string;
}> {
  const { email, password, name, phone, companyName, userType = 'owner_operator' } = input;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name,
      phone,
      companyName,
      userType,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      companyName: true,
      userType: true,
      isVerified: true,
      onboardingCompleted: true,
      onboardingStep: true,
      createdAt: true,
    },
  });

  // Create default user settings
  await prisma.userSettings.create({
    data: {
      userId: user.id,
    },
  });

  const tokens = generateTokens(user);

  return {
    user: sanitizeUser(user),
    token: tokens.accessToken,
  };
}

export async function login(input: LoginInput): Promise<{
  user: UserResponse;
  token: string;
}> {
  const { email, password } = input;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      companyName: true,
      userType: true,
      passwordHash: true,
      isActive: true,
      isVerified: true,
      onboardingCompleted: true,
      onboardingStep: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.isActive) {
    throw ApiError.forbidden('Your account has been deactivated');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const tokens = generateTokens(user);

  return {
    user: sanitizeUser(user),
    token: tokens.accessToken,
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  try {
    const decoded = jwt.verify(refreshToken, env.jwt.refreshSecret) as JwtPayload;

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        userType: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw ApiError.unauthorized('User not found or deactivated');
    }

    // Generate new tokens
    return generateTokens(user);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.unauthorized('Invalid refresh token');
  }
}

export async function getCurrentUser(userId: string): Promise<UserResponse> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      companyName: true,
      userType: true,
      isVerified: true,
      onboardingCompleted: true,
      onboardingStep: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return sanitizeUser(user);
}
