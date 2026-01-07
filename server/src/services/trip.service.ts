import { prisma } from './prisma.js';
import { ApiError } from '../utils/ApiError.js';

export interface CreateTripInput {
  name: string;
  origin: string;
  originCity?: string;
  originState?: string;
  destination: string;
  destinationCity?: string;
  destinationState?: string;
  distance?: number;
  isFavorite?: boolean;
}

export interface UpdateTripInput {
  name?: string;
  origin?: string;
  originCity?: string;
  originState?: string;
  destination?: string;
  destinationCity?: string;
  destinationState?: string;
  distance?: number;
  isFavorite?: boolean;
}

/**
 * Get all saved trips for a user
 */
export async function getTrips(userId: string) {
  const trips = await prisma.savedTrip.findMany({
    where: { userId },
    orderBy: [
      { isFavorite: 'desc' },
      { useCount: 'desc' },
      { updatedAt: 'desc' },
    ],
  });

  return trips;
}

/**
 * Get a single trip by ID
 */
export async function getTrip(userId: string, tripId: string) {
  const trip = await prisma.savedTrip.findFirst({
    where: {
      id: tripId,
      userId,
    },
  });

  if (!trip) {
    throw ApiError.notFound('Trip not found');
  }

  return trip;
}

/**
 * Create a new saved trip
 */
export async function createTrip(userId: string, input: CreateTripInput) {
  const trip = await prisma.savedTrip.create({
    data: {
      userId,
      name: input.name,
      origin: input.origin,
      originCity: input.originCity,
      originState: input.originState,
      destination: input.destination,
      destinationCity: input.destinationCity,
      destinationState: input.destinationState,
      distance: input.distance,
      isFavorite: input.isFavorite || false,
    },
  });

  return trip;
}

/**
 * Update a saved trip
 */
export async function updateTrip(userId: string, tripId: string, input: UpdateTripInput) {
  // Verify ownership
  const existing = await prisma.savedTrip.findFirst({
    where: {
      id: tripId,
      userId,
    },
  });

  if (!existing) {
    throw ApiError.notFound('Trip not found');
  }

  const trip = await prisma.savedTrip.update({
    where: { id: tripId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.origin !== undefined && { origin: input.origin }),
      ...(input.originCity !== undefined && { originCity: input.originCity }),
      ...(input.originState !== undefined && { originState: input.originState }),
      ...(input.destination !== undefined && { destination: input.destination }),
      ...(input.destinationCity !== undefined && { destinationCity: input.destinationCity }),
      ...(input.destinationState !== undefined && { destinationState: input.destinationState }),
      ...(input.distance !== undefined && { distance: input.distance }),
      ...(input.isFavorite !== undefined && { isFavorite: input.isFavorite }),
    },
  });

  return trip;
}

/**
 * Delete a saved trip
 */
export async function deleteTrip(userId: string, tripId: string) {
  // Verify ownership
  const existing = await prisma.savedTrip.findFirst({
    where: {
      id: tripId,
      userId,
    },
  });

  if (!existing) {
    throw ApiError.notFound('Trip not found');
  }

  await prisma.savedTrip.delete({
    where: { id: tripId },
  });

  return { success: true };
}

/**
 * Toggle favorite status for a trip
 */
export async function toggleFavorite(userId: string, tripId: string) {
  // Verify ownership and get current state
  const existing = await prisma.savedTrip.findFirst({
    where: {
      id: tripId,
      userId,
    },
  });

  if (!existing) {
    throw ApiError.notFound('Trip not found');
  }

  const trip = await prisma.savedTrip.update({
    where: { id: tripId },
    data: {
      isFavorite: !existing.isFavorite,
    },
  });

  return trip;
}

/**
 * Increment use count for a trip (called when trip is used in calculator)
 */
export async function incrementUseCount(userId: string, tripId: string) {
  // Verify ownership
  const existing = await prisma.savedTrip.findFirst({
    where: {
      id: tripId,
      userId,
    },
  });

  if (!existing) {
    throw ApiError.notFound('Trip not found');
  }

  const trip = await prisma.savedTrip.update({
    where: { id: tripId },
    data: {
      useCount: { increment: 1 },
      lastUsedAt: new Date(),
    },
  });

  return trip;
}

/**
 * Get frequently used trips (top 5)
 */
export async function getFrequentTrips(userId: string, limit: number = 5) {
  const trips = await prisma.savedTrip.findMany({
    where: { userId },
    orderBy: { useCount: 'desc' },
    take: limit,
  });

  return trips;
}
