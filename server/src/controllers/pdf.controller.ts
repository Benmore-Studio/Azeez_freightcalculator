/**
 * PDF Controller
 *
 * Handles PDF export endpoints for quotes.
 */

import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/index.js';
import { generateQuotePDF, type QuotePDFData, type PDFGenerationOptions } from '../services/pdf.service.js';
import { prisma } from '../services/prisma.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Export a quote as PDF
 * GET /api/quotes/:id/pdf
 */
export async function exportQuotePDF(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    const quoteId = req.params.id;

    if (!userId) {
      throw ApiError.unauthorized('Authentication required');
    }

    if (!quoteId) {
      throw ApiError.badRequest('Quote ID is required');
    }

    // Get quote from database
    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            companyName: true,
          },
        },
        vehicle: {
          select: {
            name: true,
            vehicleType: true,
          },
        },
      },
    });

    if (!quote) {
      throw ApiError.notFound('Quote not found');
    }

    // Parse JSON fields safely
    const costBreakdown = (quote.costBreakdown as Record<string, number>) || {};
    const tollData = (quote as any).tollData as { totalTolls?: number; tollsByState?: Record<string, number>; tollCount?: number } | null;
    const weatherData = (quote as any).weatherData as { origin?: { condition?: string }; destination?: { condition?: string }; riskLevel?: string } | null;
    const marketData = (quote as any).marketData as { marketLow?: number; marketMid?: number; marketHigh?: number; confidence?: number; supplyDemand?: { marketTemperature?: string } } | null;

    // Transform quote to PDF data structure
    const pdfData: QuotePDFData = {
      // Header
      quoteId: quote.id,
      createdAt: quote.createdAt,
      expiresAt: quote.expiresAt || undefined,
      userName: quote.user?.name || undefined,
      companyName: quote.user?.companyName || undefined,

      // Route
      origin: formatAddress(quote.originCity, quote.originState, quote.originAddress),
      destination: formatAddress(quote.destinationCity, quote.destinationState, quote.destinationAddress),
      totalMiles: quote.totalMiles,
      estimatedDuration: quote.estimatedDriveTimeHours ? Number(quote.estimatedDriveTimeHours) : quote.totalMiles / 50,
      statesCrossed: (quote.statesCrossed as string[]) || [],

      // Rates
      recommendedRate: Number(quote.totalRate) || 0,
      minRate: Math.round(Number(quote.totalRate) * 0.85),
      maxRate: Math.round(Number(quote.totalRate) * 1.20),
      ratePerMile: Number(quote.rpm) || 0,
      costPerMile: Number(quote.cpm) || 0,

      // Cost breakdown
      costBreakdown: {
        fuelCost: costBreakdown.fuelCost || 0,
        defCost: costBreakdown.defCost || 0,
        maintenanceCost: costBreakdown.maintenanceCost || 0,
        tireCost: costBreakdown.tireCost || 0,
        fixedCostAllocation: costBreakdown.fixedCostAllocation || 0,
        dcFees: costBreakdown.dcFees || 0,
        hotelCost: costBreakdown.hotelCost || 0,
        serviceFees: costBreakdown.serviceFees || 0,
        factoringFee: costBreakdown.factoringFee || 0,
        totalCost: costBreakdown.totalCost || 0,
      },

      // Tolls
      tollData: tollData ? {
        totalTolls: Number(quote.tolls) || tollData.totalTolls || 0,
        tollsByState: tollData.tollsByState || {},
        tollCount: tollData.tollCount || 0,
      } : undefined,

      // Profit
      estimatedProfit: Number(quote.profitTotal) || 0,
      profitMargin: Number(quote.profitTotal) && Number(quote.totalRate)
        ? Number(quote.profitTotal) / Number(quote.totalRate)
        : 0,
      profitPerMile: Number(quote.profitPerMile) || 0,

      // Load details
      loadWeight: quote.loadWeight || undefined,
      loadType: quote.loadType || undefined,
      freightClass: quote.freightClass || undefined,
      vehicleType: quote.vehicle?.vehicleType || undefined,

      // Service options
      serviceOptions: buildServiceOptions(quote),

      // Load acceptance score
      loadAcceptanceScore: quote.acceptanceScore ? {
        score: Number(quote.acceptanceScore),
        rating: quote.acceptanceRating || getScoreRating(Number(quote.acceptanceScore)),
      } : undefined,

      // Weather
      weatherData: weatherData ? {
        originCondition: weatherData.origin?.condition || 'Unknown',
        destinationCondition: weatherData.destination?.condition || 'Unknown',
        riskLevel: weatherData.riskLevel || 'Unknown',
      } : undefined,

      // Market data
      marketData: marketData ? {
        marketLow: marketData.marketLow || 0,
        marketMid: marketData.marketMid || 0,
        marketHigh: marketData.marketHigh || 0,
        confidence: marketData.confidence || 0,
        marketTemperature: marketData.supplyDemand?.marketTemperature || 'balanced',
      } : undefined,
    };

    // Parse options from query params
    const options: PDFGenerationOptions = {
      includeWeather: req.query.includeWeather === 'true',
      includeMarketIntel: req.query.includeMarketIntel === 'true',
      includeTollBreakdown: req.query.includeTolls === 'true',
      includeCostBreakdown: req.query.includeCosts !== 'false', // Default to true
    };

    // Generate PDF
    const pdfBuffer = await generateQuotePDF(pdfData, options);

    // Set response headers
    const filename = `quote-${quoteId.slice(0, 8)}-${formatDateForFilename(quote.createdAt)}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}

// Helper functions
function formatAddress(city?: string | null, state?: string | null, address?: string): string {
  if (city && state) {
    return `${city}, ${state}`;
  }
  return address || 'Unknown';
}

function formatDateForFilename(date: Date): string {
  return new Date(date).toISOString().slice(0, 10).replace(/-/g, '');
}

function getScoreRating(score: number): string {
  if (score >= 8) return 'Excellent Load';
  if (score >= 6) return 'Good Load';
  if (score >= 4) return 'Fair Load';
  return 'Below Average';
}

function buildServiceOptions(quote: any): string[] {
  const options: string[] = [];
  if (quote.isExpedite) options.push('Expedite');
  if (quote.isTeam) options.push('Team Driver');
  if (quote.isRush) options.push('Rush');
  if (quote.isSameDay) options.push('Same Day');
  if (quote.isReefer) options.push('Refrigerated');
  if (quote.requiresLiftgate) options.push('Liftgate');
  if (quote.requiresPalletJack) options.push('Pallet Jack');
  if (quote.requiresDriverAssist) options.push('Driver Assist');
  if (quote.requiresWhiteGlove) options.push('White Glove');
  if (quote.requiresTracking) options.push('Tracking');
  return options;
}
