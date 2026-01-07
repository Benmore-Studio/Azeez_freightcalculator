/**
 * PDF Service
 *
 * Generates professional PDF quotes using pdf-lib.
 * Follows the application's design guidelines (blue-600 primary, no emojis).
 */

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';

/**
 * Data structure for PDF generation
 */
export interface QuotePDFData {
  // Header
  quoteId: string;
  createdAt: Date;
  expiresAt?: Date;
  userName?: string;
  companyName?: string;

  // Route
  origin: string;
  destination: string;
  totalMiles: number;
  estimatedDuration: number;
  statesCrossed: string[];

  // Rates
  recommendedRate: number;
  minRate: number;
  maxRate: number;
  ratePerMile: number;
  costPerMile: number;

  // Cost breakdown
  costBreakdown: {
    fuelCost: number;
    defCost: number;
    maintenanceCost: number;
    tireCost: number;
    fixedCostAllocation: number;
    dcFees: number;
    hotelCost: number;
    serviceFees: number;
    factoringFee: number;
    totalCost: number;
  };

  // Tolls
  tollData?: {
    totalTolls: number;
    tollsByState: Record<string, number>;
    tollCount: number;
  };

  // Profit
  estimatedProfit: number;
  profitMargin: number;
  profitPerMile: number;

  // Load details
  loadWeight?: number;
  loadType?: string;
  freightClass?: string;
  vehicleType?: string;

  // Service options
  serviceOptions?: string[];

  // Load acceptance score
  loadAcceptanceScore?: {
    score: number;
    rating: string;
  };

  // Weather
  weatherData?: {
    originCondition: string;
    destinationCondition: string;
    riskLevel: string;
  };

  // Market data
  marketData?: {
    marketLow: number;
    marketMid: number;
    marketHigh: number;
    confidence: number;
    marketTemperature: string;
  };
}

export interface PDFGenerationOptions {
  includeWeather?: boolean;
  includeMarketIntel?: boolean;
  includeTollBreakdown?: boolean;
  includeCostBreakdown?: boolean;
}

// Colors matching the app's design system
const COLORS = {
  primary: rgb(0.22, 0.47, 0.87),       // blue-600
  primaryLight: rgb(0.94, 0.96, 1.0),   // blue-50
  success: rgb(0.13, 0.53, 0.13),       // green-600
  successLight: rgb(0.94, 0.99, 0.94),  // green-50
  warning: rgb(0.92, 0.58, 0.15),       // orange-500
  gray900: rgb(0.11, 0.12, 0.14),       // gray-900
  gray700: rgb(0.27, 0.29, 0.32),       // gray-700
  gray600: rgb(0.42, 0.44, 0.47),       // gray-600
  gray400: rgb(0.62, 0.64, 0.67),       // gray-400
  gray200: rgb(0.89, 0.90, 0.91),       // gray-200
  gray100: rgb(0.95, 0.96, 0.97),       // gray-100
  white: rgb(1, 1, 1),
};

// Page dimensions (Letter size)
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

/**
 * Generate a professional PDF quote
 */
export async function generateQuotePDF(
  data: QuotePDFData,
  options: PDFGenerationOptions = {}
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Create first page
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let yPosition = PAGE_HEIGHT - MARGIN;

  // Helper to add new page if needed
  const ensureSpace = (neededSpace: number): void => {
    if (yPosition - neededSpace < MARGIN + 50) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      yPosition = PAGE_HEIGHT - MARGIN;
    }
  };

  // Helper to draw text
  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number,
    font: PDFFont = helvetica,
    color = COLORS.gray900
  ): void => {
    page.drawText(text, { x, y, size, font, color });
  };

  // Helper to draw a horizontal line
  const drawLine = (y: number, color = COLORS.gray200): void => {
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 1,
      color,
    });
  };

  // ===== HEADER =====
  drawText('FREIGHT RATE QUOTE', MARGIN, yPosition, 22, helveticaBold, COLORS.primary);
  yPosition -= 30;

  // Quote ID and dates
  drawText(`Quote ID: ${data.quoteId}`, MARGIN, yPosition, 9, helvetica, COLORS.gray600);
  yPosition -= 14;
  drawText(`Generated: ${formatDate(data.createdAt)}`, MARGIN, yPosition, 9, helvetica, COLORS.gray600);
  if (data.expiresAt) {
    yPosition -= 14;
    drawText(`Valid Until: ${formatDate(data.expiresAt)}`, MARGIN, yPosition, 9, helvetica, COLORS.gray600);
  }
  yPosition -= 25;
  drawLine(yPosition);
  yPosition -= 25;

  // ===== ROUTE DETAILS =====
  drawText('ROUTE DETAILS', MARGIN, yPosition, 12, helveticaBold, COLORS.gray900);
  yPosition -= 20;

  // Origin/Destination box
  page.drawRectangle({
    x: MARGIN,
    y: yPosition - 55,
    width: CONTENT_WIDTH,
    height: 55,
    color: COLORS.gray100,
    borderColor: COLORS.gray200,
    borderWidth: 1,
  });

  drawText('FROM:', MARGIN + 10, yPosition - 15, 8, helveticaBold, COLORS.gray600);
  drawText(data.origin, MARGIN + 50, yPosition - 15, 10, helvetica, COLORS.gray900);

  drawText('TO:', MARGIN + 10, yPosition - 32, 8, helveticaBold, COLORS.gray600);
  drawText(data.destination, MARGIN + 50, yPosition - 32, 10, helvetica, COLORS.gray900);

  const routeInfo = `${data.totalMiles.toLocaleString()} miles | ${formatDuration(data.estimatedDuration)} | ${data.statesCrossed.length} states`;
  drawText(routeInfo, MARGIN + 10, yPosition - 48, 9, helvetica, COLORS.gray600);

  yPosition -= 70;

  // ===== RATE CARDS =====
  ensureSpace(120);
  drawText('RATE RECOMMENDATIONS', MARGIN, yPosition, 12, helveticaBold, COLORS.gray900);
  yPosition -= 25;

  const cardWidth = (CONTENT_WIDTH - 20) / 3;
  const cardHeight = 70;

  // Recommended Rate Card (highlighted)
  page.drawRectangle({
    x: MARGIN,
    y: yPosition - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: COLORS.primaryLight,
    borderColor: COLORS.primary,
    borderWidth: 2,
  });
  drawText('RECOMMENDED', MARGIN + 10, yPosition - 15, 8, helveticaBold, COLORS.primary);
  drawText(`$${data.recommendedRate.toLocaleString()}`, MARGIN + 10, yPosition - 38, 18, helveticaBold, COLORS.primary);
  drawText(`$${data.ratePerMile.toFixed(2)}/mile`, MARGIN + 10, yPosition - 55, 9, helvetica, COLORS.gray600);

  // Min Rate Card
  const minX = MARGIN + cardWidth + 10;
  page.drawRectangle({
    x: minX,
    y: yPosition - cardHeight,
    width: cardWidth,
    height: cardHeight,
    borderColor: COLORS.gray200,
    borderWidth: 1,
  });
  drawText('MINIMUM', minX + 10, yPosition - 15, 8, helveticaBold, COLORS.gray700);
  drawText(`$${data.minRate.toLocaleString()}`, minX + 10, yPosition - 38, 18, helveticaBold, COLORS.gray900);
  drawText(`$${(data.minRate / data.totalMiles).toFixed(2)}/mile`, minX + 10, yPosition - 55, 9, helvetica, COLORS.gray600);

  // Max Rate Card
  const maxX = MARGIN + 2 * cardWidth + 20;
  page.drawRectangle({
    x: maxX,
    y: yPosition - cardHeight,
    width: cardWidth,
    height: cardHeight,
    borderColor: COLORS.gray200,
    borderWidth: 1,
  });
  drawText('MAXIMUM', maxX + 10, yPosition - 15, 8, helveticaBold, COLORS.gray700);
  drawText(`$${data.maxRate.toLocaleString()}`, maxX + 10, yPosition - 38, 18, helveticaBold, COLORS.gray900);
  drawText(`$${(data.maxRate / data.totalMiles).toFixed(2)}/mile`, maxX + 10, yPosition - 55, 9, helvetica, COLORS.gray600);

  yPosition -= cardHeight + 25;

  // ===== PROFITABILITY =====
  ensureSpace(80);
  drawText('PROFITABILITY ANALYSIS', MARGIN, yPosition, 12, helveticaBold, COLORS.gray900);
  yPosition -= 20;

  const profitColor = data.profitMargin >= 0.20 ? COLORS.success : COLORS.gray900;
  const profitBgColor = data.profitMargin >= 0.20 ? COLORS.successLight : COLORS.gray100;

  page.drawRectangle({
    x: MARGIN,
    y: yPosition - 50,
    width: CONTENT_WIDTH,
    height: 50,
    color: profitBgColor,
    borderColor: profitColor,
    borderWidth: 1,
  });

  drawText('Estimated Profit:', MARGIN + 15, yPosition - 20, 10, helvetica, COLORS.gray700);
  drawText(`$${data.estimatedProfit.toFixed(2)}`, MARGIN + 120, yPosition - 20, 14, helveticaBold, profitColor);

  drawText('Profit Margin:', MARGIN + 230, yPosition - 20, 10, helvetica, COLORS.gray700);
  drawText(`${(data.profitMargin * 100).toFixed(1)}%`, MARGIN + 320, yPosition - 20, 14, helveticaBold, profitColor);

  drawText('Profit/Mile:', MARGIN + 400, yPosition - 20, 10, helvetica, COLORS.gray700);
  drawText(`$${data.profitPerMile.toFixed(2)}`, MARGIN + 470, yPosition - 20, 14, helveticaBold, profitColor);

  drawText(`Total Costs: $${data.costBreakdown.totalCost.toFixed(2)}`, MARGIN + 15, yPosition - 40, 9, helvetica, COLORS.gray600);
  drawText(`Cost/Mile: $${data.costPerMile.toFixed(2)}`, MARGIN + 200, yPosition - 40, 9, helvetica, COLORS.gray600);

  yPosition -= 70;

  // ===== COST BREAKDOWN =====
  if (options.includeCostBreakdown !== false) {
    ensureSpace(180);
    drawText('COST BREAKDOWN', MARGIN, yPosition, 12, helveticaBold, COLORS.gray900);
    yPosition -= 20;

    const costs = [
      ['Fuel Cost', data.costBreakdown.fuelCost],
      ['DEF (Diesel Exhaust Fluid)', data.costBreakdown.defCost],
      ['Maintenance', data.costBreakdown.maintenanceCost],
      ['Tires', data.costBreakdown.tireCost],
      ['Fixed Costs Allocation', data.costBreakdown.fixedCostAllocation],
      ['Distribution Center Fees', data.costBreakdown.dcFees],
      ['Hotel/Lodging', data.costBreakdown.hotelCost],
      ['Service Fees', data.costBreakdown.serviceFees],
      ['Factoring Fee', data.costBreakdown.factoringFee],
    ];

    for (const [label, amount] of costs) {
      if (typeof amount === 'number' && amount > 0) {
        drawText(String(label), MARGIN, yPosition, 9, helvetica, COLORS.gray700);
        drawText(`$${amount.toFixed(2)}`, PAGE_WIDTH - MARGIN - 60, yPosition, 9, helvetica, COLORS.gray900);
        yPosition -= 14;
      }
    }

    // Total line
    yPosition -= 5;
    drawLine(yPosition + 10, COLORS.gray400);
    yPosition -= 5;
    drawText('TOTAL OPERATING COSTS', MARGIN, yPosition, 10, helveticaBold, COLORS.gray900);
    drawText(`$${data.costBreakdown.totalCost.toFixed(2)}`, PAGE_WIDTH - MARGIN - 70, yPosition, 10, helveticaBold, COLORS.gray900);
    yPosition -= 25;
  }

  // ===== TOLLS =====
  if (options.includeTollBreakdown && data.tollData && data.tollData.totalTolls > 0) {
    ensureSpace(100);
    drawText('TOLL BREAKDOWN', MARGIN, yPosition, 12, helveticaBold, COLORS.gray900);
    yPosition -= 20;

    for (const [state, amount] of Object.entries(data.tollData.tollsByState)) {
      if (typeof amount === 'number' && amount > 0) {
        drawText(state, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
        drawText(`$${amount.toFixed(2)}`, PAGE_WIDTH - MARGIN - 60, yPosition, 9, helvetica, COLORS.gray900);
        yPosition -= 14;
      }
    }

    drawText(`Total Tolls (${data.tollData.tollCount} toll points)`, MARGIN, yPosition, 10, helveticaBold, COLORS.gray700);
    drawText(`$${data.tollData.totalTolls.toFixed(2)}`, PAGE_WIDTH - MARGIN - 70, yPosition, 10, helveticaBold, COLORS.gray900);
    yPosition -= 25;
  }

  // ===== LOAD DETAILS =====
  if (data.vehicleType || data.loadType || data.freightClass) {
    ensureSpace(80);
    drawText('LOAD DETAILS', MARGIN, yPosition, 12, helveticaBold, COLORS.gray900);
    yPosition -= 20;

    if (data.vehicleType) {
      drawText(`Vehicle Type: ${formatLabel(data.vehicleType)}`, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
      yPosition -= 14;
    }
    if (data.loadType) {
      drawText(`Load Type: ${formatLabel(data.loadType)}`, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
      yPosition -= 14;
    }
    if (data.freightClass) {
      drawText(`Freight Class: ${formatLabel(data.freightClass)}`, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
      yPosition -= 14;
    }
    if (data.loadWeight) {
      drawText(`Weight: ${data.loadWeight.toLocaleString()} lbs`, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
      yPosition -= 14;
    }
    yPosition -= 10;
  }

  // ===== LOAD ACCEPTANCE SCORE =====
  if (data.loadAcceptanceScore) {
    ensureSpace(60);
    drawText('LOAD ACCEPTANCE SCORE', MARGIN, yPosition, 12, helveticaBold, COLORS.gray900);
    yPosition -= 20;

    const scoreColor = data.loadAcceptanceScore.score >= 7 ? COLORS.success : COLORS.warning;
    drawText(`${data.loadAcceptanceScore.score.toFixed(1)}/10`, MARGIN, yPosition, 16, helveticaBold, scoreColor);
    drawText(` - ${data.loadAcceptanceScore.rating}`, MARGIN + 50, yPosition, 12, helvetica, COLORS.gray700);
    yPosition -= 30;
  }

  // ===== WEATHER =====
  if (options.includeWeather && data.weatherData) {
    ensureSpace(70);
    drawText('WEATHER CONDITIONS', MARGIN, yPosition, 12, helveticaBold, COLORS.gray900);
    yPosition -= 20;

    drawText(`Origin: ${data.weatherData.originCondition}`, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
    yPosition -= 14;
    drawText(`Destination: ${data.weatherData.destinationCondition}`, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
    yPosition -= 14;
    drawText(`Risk Level: ${data.weatherData.riskLevel}`, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
    yPosition -= 25;
  }

  // ===== MARKET INTELLIGENCE =====
  if (options.includeMarketIntel && data.marketData) {
    ensureSpace(90);
    drawText('MARKET INTELLIGENCE', MARGIN, yPosition, 12, helveticaBold, COLORS.gray900);
    yPosition -= 20;

    drawText(`Market Rate Range: $${data.marketData.marketLow.toFixed(2)} - $${data.marketData.marketHigh.toFixed(2)}/mile`, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
    yPosition -= 14;
    drawText(`Market Median: $${data.marketData.marketMid.toFixed(2)}/mile`, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
    yPosition -= 14;
    drawText(`Market Temperature: ${formatLabel(data.marketData.marketTemperature)}`, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
    yPosition -= 14;
    drawText(`Confidence: ${data.marketData.confidence}%`, MARGIN, yPosition, 9, helvetica, COLORS.gray700);
    yPosition -= 25;
  }

  // ===== FOOTER =====
  const footerY = MARGIN + 20;
  drawLine(footerY + 15, COLORS.gray200);
  drawText('Generated by Freight Calculator Pro', MARGIN, footerY, 8, helvetica, COLORS.gray400);
  drawText(`Page 1 of ${pdfDoc.getPageCount()}`, PAGE_WIDTH - MARGIN - 50, footerY, 8, helvetica, COLORS.gray400);

  // Save and return
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// Helper functions
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatLabel(value: string): string {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

console.log('[PDFService] PDF service loaded');
