import { prisma } from './prisma.js';
import { ApiError } from '../utils/ApiError.js';

export interface CreateBookingInput {
  quoteId: string;

  // Pickup info
  pickupDate: Date;
  pickupTime?: string;
  pickupContactName?: string;
  pickupContactPhone?: string;

  // Delivery info
  deliveryDate: Date;
  deliveryTime?: string;
  deliveryContactName?: string;
  deliveryContactPhone?: string;

  // Special instructions
  specialInstructions?: string;

  // Payment
  paymentMethod: 'quickpay' | 'standard' | 'factor';
  quickpayFeeRate?: number; // Percentage as decimal (e.g., 0.03 for 3%)

  // Confirmation
  sendConfirmation?: boolean;
  confirmationEmail?: string;
  confirmationSms?: string;
}

export interface BookingFilters {
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Create a new booking from a quote
 */
export async function createBooking(userId: string, input: CreateBookingInput) {
  // Verify the quote exists and belongs to the user
  const quote = await prisma.quote.findFirst({
    where: {
      id: input.quoteId,
      userId,
    },
  });

  if (!quote) {
    throw new ApiError(404, 'Quote not found');
  }

  // Check if quote is already booked
  if (quote.status === 'booked' || quote.status === 'completed') {
    throw new ApiError(400, 'This quote has already been booked');
  }

  // Check if a booking already exists for this quote
  const existingBooking = await prisma.bookingRecord.findUnique({
    where: { quoteId: input.quoteId },
  });

  if (existingBooking) {
    throw new ApiError(400, 'A booking already exists for this quote');
  }

  // Calculate payment amounts
  const originalRate = Number(quote.totalRate);
  const quickpayFeeRate = input.paymentMethod === 'quickpay' ? (input.quickpayFeeRate || 0.03) : 0;
  const feeAmount = originalRate * quickpayFeeRate;
  const finalAmount = originalRate - feeAmount;

  // Create booking record and update quote status in a transaction
  const [booking] = await prisma.$transaction([
    prisma.bookingRecord.create({
      data: {
        quoteId: input.quoteId,
        userId,

        // Pickup
        pickupDate: input.pickupDate,
        pickupTime: input.pickupTime,
        pickupContactName: input.pickupContactName,
        pickupContactPhone: input.pickupContactPhone,

        // Delivery
        deliveryDate: input.deliveryDate,
        deliveryTime: input.deliveryTime,
        deliveryContactName: input.deliveryContactName,
        deliveryContactPhone: input.deliveryContactPhone,

        // Special instructions
        specialInstructions: input.specialInstructions,

        // Payment
        paymentMethod: input.paymentMethod,
        quickpayFeeRate,
        originalRate,
        feeAmount,
        finalAmount,

        // Confirmation
        confirmationEmail: input.sendConfirmation ? input.confirmationEmail : null,
        confirmationSms: input.sendConfirmation ? input.confirmationSms : null,
        confirmationSentAt: input.sendConfirmation ? new Date() : null,

        // Status
        status: 'pending',
      },
      include: {
        quote: true,
      },
    }),

    // Update quote status to booked
    prisma.quote.update({
      where: { id: input.quoteId },
      data: {
        status: 'booked',
        bookedAt: new Date(),
        pickupDate: input.pickupDate,
        pickupTimeWindow: input.pickupTime,
        deliveryDate: input.deliveryDate,
        deliveryTimeWindow: input.deliveryTime,
      },
    }),
  ]);

  return booking;
}

/**
 * Get a booking by ID
 */
export async function getBookingById(userId: string, bookingId: string) {
  const booking = await prisma.bookingRecord.findFirst({
    where: {
      id: bookingId,
      userId,
    },
    include: {
      quote: {
        include: {
          vehicle: true,
        },
      },
    },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  return booking;
}

/**
 * Get booking by quote ID
 */
export async function getBookingByQuoteId(userId: string, quoteId: string) {
  const booking = await prisma.bookingRecord.findFirst({
    where: {
      quoteId,
      userId,
    },
    include: {
      quote: {
        include: {
          vehicle: true,
        },
      },
    },
  });

  return booking;
}

/**
 * Get all bookings for a user
 */
export async function getUserBookings(
  userId: string,
  filters: BookingFilters = {},
  page = 1,
  limit = 20
) {
  const where: any = { userId };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.startDate) {
    where.pickupDate = { ...where.pickupDate, gte: filters.startDate };
  }

  if (filters.endDate) {
    where.pickupDate = { ...where.pickupDate, lte: filters.endDate };
  }

  const [bookings, total] = await Promise.all([
    prisma.bookingRecord.findMany({
      where,
      include: {
        quote: {
          include: {
            vehicle: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.bookingRecord.count({ where }),
  ]);

  return {
    bookings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Update booking status
 */
export async function updateBookingStatus(userId: string, bookingId: string, status: string) {
  const booking = await prisma.bookingRecord.findFirst({
    where: { id: bookingId, userId },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const validStatuses = ['pending', 'confirmed', 'in_transit', 'delivered', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Update booking status
  const updatedBooking = await prisma.bookingRecord.update({
    where: { id: bookingId },
    data: { status },
    include: {
      quote: true,
    },
  });

  // Also update quote status if booking is completed or cancelled
  if (status === 'completed' || status === 'cancelled') {
    await prisma.quote.update({
      where: { id: booking.quoteId },
      data: {
        status: status === 'completed' ? 'completed' : 'cancelled',
        ...(status === 'completed' && { completedAt: new Date() }),
      },
    });
  }

  return updatedBooking;
}

/**
 * Cancel a booking
 */
export async function cancelBooking(userId: string, bookingId: string) {
  const booking = await prisma.bookingRecord.findFirst({
    where: { id: bookingId, userId },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.status === 'completed') {
    throw new ApiError(400, 'Cannot cancel a completed booking');
  }

  if (booking.status === 'cancelled') {
    throw new ApiError(400, 'Booking is already cancelled');
  }

  // Cancel booking and update quote status in a transaction
  const [updatedBooking] = await prisma.$transaction([
    prisma.bookingRecord.update({
      where: { id: bookingId },
      data: { status: 'cancelled' },
      include: {
        quote: true,
      },
    }),
    prisma.quote.update({
      where: { id: booking.quoteId },
      data: { status: 'cancelled' },
    }),
  ]);

  return updatedBooking;
}

/**
 * Get booking statistics for user
 */
export async function getBookingStats(userId: string) {
  const [total, pending, confirmed, completed, cancelled] = await Promise.all([
    prisma.bookingRecord.count({ where: { userId } }),
    prisma.bookingRecord.count({ where: { userId, status: 'pending' } }),
    prisma.bookingRecord.count({ where: { userId, status: 'confirmed' } }),
    prisma.bookingRecord.count({ where: { userId, status: 'completed' } }),
    prisma.bookingRecord.count({ where: { userId, status: 'cancelled' } }),
  ]);

  const totalRevenue = await prisma.bookingRecord.aggregate({
    where: { userId, status: { in: ['confirmed', 'completed'] } },
    _sum: { finalAmount: true },
  });

  return {
    total,
    pending,
    confirmed,
    completed,
    cancelled,
    totalRevenue: totalRevenue._sum.finalAmount ? Number(totalRevenue._sum.finalAmount) : 0,
  };
}

/**
 * Get upcoming bookings (pickups in the next 7 days)
 */
export async function getUpcomingBookings(userId: string, limit = 5) {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  return prisma.bookingRecord.findMany({
    where: {
      userId,
      status: { in: ['pending', 'confirmed'] },
      pickupDate: {
        gte: now,
        lte: nextWeek,
      },
    },
    include: {
      quote: true,
    },
    orderBy: { pickupDate: 'asc' },
    take: limit,
  });
}
