import { prisma } from './prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { calculateRate } from './rate.service.js';
/**
 * Create and calculate a new quote
 */
export async function createQuote(userId, input) {
    // First calculate the rate
    const rateResult = await calculateRate(userId, input);
    // Create the quote record
    const quote = await prisma.quote.create({
        data: {
            userId,
            vehicleId: input.vehicleId,
            // Origin
            originAddress: input.originAddress,
            originCity: input.originCity,
            originState: input.originState,
            // Destination
            destinationAddress: input.destinationAddress,
            destinationCity: input.destinationCity,
            destinationState: input.destinationState,
            // Distance
            totalMiles: input.totalMiles,
            deadheadMiles: input.deadheadMiles || 0,
            statesCrossed: input.statesCrossed || [],
            estimatedDriveTimeHours: rateResult.estimatedDriveHours,
            // Load details
            loadWeight: input.loadWeight,
            loadType: input.loadType || 'full_truckload',
            freightClass: input.freightClass || 'dry_van',
            commodityType: input.commodityType,
            hazmatClass: input.hazmatClass,
            // Service options
            isExpedite: input.isExpedite || false,
            isTeam: input.isTeam || false,
            isReefer: input.isReefer || false,
            isRush: input.isRush || false,
            isSameDay: input.isSameDay || false,
            requiresLiftgate: input.requiresLiftgate || false,
            requiresPalletJack: input.requiresPalletJack || false,
            requiresDriverAssist: input.requiresDriverAssist || false,
            requiresWhiteGlove: input.requiresWhiteGlove || false,
            requiresTracking: input.requiresTracking || false,
            // Reefer details
            reeferMode: input.reeferMode,
            reeferTempMin: input.reeferTempMin,
            reeferTempMax: input.reeferTempMax,
            // Schedule
            pickupDate: input.pickupDate,
            pickupTimeWindow: input.pickupTimeWindow,
            deliveryDate: input.deliveryDate,
            deliveryTimeWindow: input.deliveryTimeWindow,
            // Conditions
            weatherCondition: input.weatherCondition || 'normal',
            season: input.season,
            // Service fees (JSON)
            serviceFees: rateResult.serviceFees,
            // Cost breakdown (JSON)
            costBreakdown: rateResult.costBreakdown,
            // Final calculations
            totalRate: rateResult.recommendedRate,
            rpm: rateResult.ratePerMile,
            cpm: rateResult.costPerMile,
            profitPerMile: rateResult.profitPerMile,
            profitTotal: rateResult.estimatedProfit,
            // Fuel
            fuelCost: rateResult.costBreakdown.fuelCost,
            fuelPriceUsed: rateResult.fuelPriceUsed,
            // Status
            status: 'calculated',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
        include: {
            vehicle: true,
        },
    });
    return {
        quote,
        calculation: rateResult,
    };
}
/**
 * Get a quote by ID
 */
export async function getQuoteById(userId, quoteId) {
    const quote = await prisma.quote.findFirst({
        where: {
            id: quoteId,
            userId,
        },
        include: {
            vehicle: true,
            bookingRecord: true,
        },
    });
    if (!quote) {
        throw new ApiError(404, 'Quote not found');
    }
    return quote;
}
/**
 * Get all quotes for a user with optional filters
 */
export async function getUserQuotes(userId, filters = {}, page = 1, limit = 20) {
    const where = { userId };
    if (filters.status) {
        where.status = filters.status;
    }
    if (filters.startDate) {
        where.createdAt = { ...where.createdAt, gte: filters.startDate };
    }
    if (filters.endDate) {
        where.createdAt = { ...where.createdAt, lte: filters.endDate };
    }
    if (filters.minRate) {
        where.totalRate = { ...where.totalRate, gte: filters.minRate };
    }
    if (filters.maxRate) {
        where.totalRate = { ...where.totalRate, lte: filters.maxRate };
    }
    const [quotes, total] = await Promise.all([
        prisma.quote.findMany({
            where,
            include: {
                vehicle: true,
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.quote.count({ where }),
    ]);
    return {
        quotes,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}
/**
 * Update quote status
 */
export async function updateQuoteStatus(userId, quoteId, status) {
    const quote = await prisma.quote.findFirst({
        where: { id: quoteId, userId },
    });
    if (!quote) {
        throw new ApiError(404, 'Quote not found');
    }
    const updateData = { status };
    if (status === 'booked') {
        updateData.bookedAt = new Date();
    }
    else if (status === 'completed') {
        updateData.completedAt = new Date();
    }
    return prisma.quote.update({
        where: { id: quoteId },
        data: updateData,
    });
}
/**
 * Delete a quote (or archive it)
 */
export async function deleteQuote(userId, quoteId) {
    const quote = await prisma.quote.findFirst({
        where: { id: quoteId, userId },
    });
    if (!quote) {
        throw new ApiError(404, 'Quote not found');
    }
    // Soft delete by setting status to cancelled
    await prisma.quote.update({
        where: { id: quoteId },
        data: { status: 'cancelled' },
    });
    return { message: 'Quote deleted successfully' };
}
/**
 * Calculate rate without saving (preview)
 */
export async function previewRate(userId, input) {
    return calculateRate(userId, input);
}
/**
 * Get recent quotes for dashboard
 */
export async function getRecentQuotes(userId, limit = 5) {
    return prisma.quote.findMany({
        where: {
            userId,
            status: { in: ['calculated', 'booked'] },
        },
        include: {
            vehicle: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
}
/**
 * Get quote statistics for user
 */
export async function getQuoteStats(userId) {
    const [totalQuotes, bookedQuotes, avgProfit, totalRevenue] = await Promise.all([
        prisma.quote.count({ where: { userId } }),
        prisma.quote.count({ where: { userId, status: 'booked' } }),
        prisma.quote.aggregate({
            where: { userId, status: { in: ['calculated', 'booked', 'completed'] } },
            _avg: { profitTotal: true },
        }),
        prisma.quote.aggregate({
            where: { userId, status: { in: ['booked', 'completed'] } },
            _sum: { totalRate: true },
        }),
    ]);
    return {
        totalQuotes,
        bookedQuotes,
        avgProfit: avgProfit._avg.profitTotal ? Number(avgProfit._avg.profitTotal) : 0,
        totalRevenue: totalRevenue._sum.totalRate ? Number(totalRevenue._sum.totalRate) : 0,
        conversionRate: totalQuotes > 0 ? (bookedQuotes / totalQuotes) * 100 : 0,
    };
}
//# sourceMappingURL=quote.service.js.map