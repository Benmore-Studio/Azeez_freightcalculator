/**
 * PDF Service
 *
 * Generates professional PDF quotes using pdf-lib.
 * Follows the application's design guidelines (blue-600 primary, no emojis).
 */
/**
 * Data structure for PDF generation
 */
export interface QuotePDFData {
    quoteId: string;
    createdAt: Date;
    expiresAt?: Date;
    userName?: string;
    companyName?: string;
    origin: string;
    destination: string;
    totalMiles: number;
    estimatedDuration: number;
    statesCrossed: string[];
    recommendedRate: number;
    minRate: number;
    maxRate: number;
    ratePerMile: number;
    costPerMile: number;
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
    tollData?: {
        totalTolls: number;
        tollsByState: Record<string, number>;
        tollCount: number;
    };
    estimatedProfit: number;
    profitMargin: number;
    profitPerMile: number;
    loadWeight?: number;
    loadType?: string;
    freightClass?: string;
    vehicleType?: string;
    serviceOptions?: string[];
    loadAcceptanceScore?: {
        score: number;
        rating: string;
    };
    weatherData?: {
        originCondition: string;
        destinationCondition: string;
        riskLevel: string;
    };
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
/**
 * Generate a professional PDF quote
 */
export declare function generateQuotePDF(data: QuotePDFData, options?: PDFGenerationOptions): Promise<Buffer>;
//# sourceMappingURL=pdf.service.d.ts.map