import { Router } from 'express';
import * as quoteController from '../controllers/quote.controller.js';
import * as pdfController from '../controllers/pdf.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * @route   POST /api/quotes/calculate
 * @desc    Calculate rate without saving (preview)
 * @access  Protected
 */
router.post('/calculate', authenticate, quoteController.calculateRate);

/**
 * @route   POST /api/quotes/calculate-enriched
 * @desc    Calculate rate with auto-fetched distance, weather, and tolls
 * @access  Protected
 */
router.post('/calculate-enriched', authenticate, quoteController.calculateEnrichedRate);

/**
 * @route   GET /api/quotes/recent
 * @desc    Get recent quotes for dashboard
 * @access  Protected
 */
router.get('/recent', authenticate, quoteController.getRecentQuotes);

/**
 * @route   GET /api/quotes/stats
 * @desc    Get quote statistics
 * @access  Protected
 */
router.get('/stats', authenticate, quoteController.getQuoteStats);

/**
 * @route   GET /api/quotes
 * @desc    Get all quotes for current user
 * @access  Protected
 */
router.get('/', authenticate, quoteController.getQuotes);

/**
 * @route   POST /api/quotes
 * @desc    Create and save a new quote
 * @access  Protected
 */
router.post('/', authenticate, quoteController.createQuote);

/**
 * @route   GET /api/quotes/:id/pdf
 * @desc    Export quote as PDF
 * @access  Protected
 * @query   includeWeather, includeMarketIntel, includeTolls, includeCosts
 */
router.get('/:id/pdf', authenticate, pdfController.exportQuotePDF);

/**
 * @route   GET /api/quotes/:id
 * @desc    Get a single quote by ID
 * @access  Protected
 */
router.get('/:id', authenticate, quoteController.getQuote);

/**
 * @route   PATCH /api/quotes/:id/status
 * @desc    Update quote status
 * @access  Protected
 */
router.patch('/:id/status', authenticate, quoteController.updateQuoteStatus);

/**
 * @route   DELETE /api/quotes/:id
 * @desc    Delete a quote
 * @access  Protected
 */
router.delete('/:id', authenticate, quoteController.deleteQuote);

export default router;
