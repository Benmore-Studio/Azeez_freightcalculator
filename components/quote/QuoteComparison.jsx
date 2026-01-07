"use client";

import React, { useMemo } from "react";
import { Scale, Check, X, TrendingUp, TrendingDown, MapPin, DollarSign, Percent, Clock } from "lucide-react";
import { Card, Button } from "@/components/ui";

/**
 * Quote Comparison Component
 * Displays side-by-side comparison of 2-4 quotes
 */
export default function QuoteComparison({ quotes, onClose }) {
  // Maximum 4 quotes for comparison
  const displayQuotes = quotes.slice(0, 4);

  // Calculate best values for highlighting
  const analysis = useMemo(() => {
    if (displayQuotes.length === 0) return null;

    return {
      highestRate: displayQuotes.reduce((max, q) =>
        (q.rate || 0) > (max.rate || 0) ? q : max
      ).id,
      highestProfit: displayQuotes.reduce((max, q) =>
        (q.profit || 0) > (max.profit || 0) ? q : max
      ).id,
      highestMargin: displayQuotes.reduce((max, q) =>
        (q.profitMargin || 0) > (max.profitMargin || 0) ? q : max
      ).id,
      lowestCost: displayQuotes.reduce((min, q) => {
        const minCost = (min.rate || 0) - (min.profit || 0);
        const qCost = (q.rate || 0) - (q.profit || 0);
        return qCost < minCost ? q : min;
      }).id,
      shortestDistance: displayQuotes.reduce((min, q) =>
        (q.miles || Infinity) < (min.miles || Infinity) ? q : min
      ).id,
      bestRatePerMile: displayQuotes.reduce((max, q) =>
        (q.ratePerMile || 0) > (max.ratePerMile || 0) ? q : max
      ).id,
    };
  }, [displayQuotes]);

  // Comparison metrics configuration
  const metrics = [
    {
      key: "origin",
      label: "Origin",
      format: (v) => v || "N/A",
      icon: MapPin,
    },
    {
      key: "destination",
      label: "Destination",
      format: (v) => v || "N/A",
      icon: MapPin,
    },
    {
      key: "miles",
      label: "Distance",
      format: (v) => `${(v || 0).toLocaleString()} mi`,
      highlight: "shortestDistance",
      highlightType: "low",
      icon: Clock,
    },
    {
      key: "rate",
      label: "Total Rate",
      format: (v) => `$${(v || 0).toLocaleString()}`,
      highlight: "highestRate",
      icon: DollarSign,
    },
    {
      key: "ratePerMile",
      label: "Rate/Mile",
      format: (v) => `$${(v || 0).toFixed(2)}`,
      highlight: "bestRatePerMile",
      icon: TrendingUp,
    },
    {
      key: "cost",
      label: "Total Costs",
      format: (v, q) => `$${((q.rate || 0) - (q.profit || 0)).toLocaleString()}`,
      getValue: (q) => (q.rate || 0) - (q.profit || 0),
      highlight: "lowestCost",
      highlightType: "low",
      icon: TrendingDown,
    },
    {
      key: "profit",
      label: "Est. Profit",
      format: (v) => `$${(v || 0).toLocaleString()}`,
      highlight: "highestProfit",
      icon: DollarSign,
    },
    {
      key: "profitMargin",
      label: "Profit Margin",
      format: (v) => `${(v || 0)}%`,
      highlight: "highestMargin",
      icon: Percent,
    },
  ];

  // Find which quote wins each category
  const winners = useMemo(() => {
    if (!analysis) return {};

    return {
      "Best Rate": displayQuotes.findIndex((q) => q.id === analysis.highestRate) + 1,
      "Best Profit": displayQuotes.findIndex((q) => q.id === analysis.highestProfit) + 1,
      "Best Margin": displayQuotes.findIndex((q) => q.id === analysis.highestMargin) + 1,
      "Lowest Cost": displayQuotes.findIndex((q) => q.id === analysis.lowestCost) + 1,
    };
  }, [analysis, displayQuotes]);

  if (displayQuotes.length < 2) {
    return (
      <Card className="p-6 bg-white border-2 border-gray-200">
        <div className="text-center py-8">
          <Scale className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Select at least 2 quotes to compare</p>
          <Button variant="secondary" className="mt-4" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Scale className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Quote Comparison</h3>
            <p className="text-sm text-gray-500">Comparing {displayQuotes.length} quotes</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={onClose}>
          <X size={16} className="mr-1" />
          Close
        </Button>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left p-3 font-semibold text-gray-700 bg-gray-50 sticky left-0 min-w-[140px]">
                Metric
              </th>
              {displayQuotes.map((quote, idx) => (
                <th
                  key={quote.id}
                  className="text-center p-3 font-semibold text-gray-900 min-w-[150px]"
                >
                  <div className="flex flex-col items-center">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full mb-1">
                      Quote {idx + 1}
                    </span>
                    <span className="text-xs font-normal text-gray-500">
                      {new Date(quote.date).toLocaleDateString()}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr
                key={metric.key}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 font-medium text-gray-700 bg-gray-50 sticky left-0">
                  <div className="flex items-center gap-2">
                    {metric.icon && <metric.icon size={14} className="text-gray-400" />}
                    {metric.label}
                  </div>
                </td>
                {displayQuotes.map((quote) => {
                  const value = metric.getValue ? metric.getValue(quote) : quote[metric.key];
                  const isBest = metric.highlight && analysis[metric.highlight] === quote.id;
                  const cellClass = isBest
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-gray-900";

                  return (
                    <td key={quote.id} className={`p-3 text-center ${cellClass}`}>
                      <span className="flex items-center justify-center gap-1">
                        {metric.format(value, quote)}
                        {isBest && <Check size={14} className="text-blue-600" />}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-bold text-blue-900 mb-3">Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(winners).map(([category, quoteNum]) => (
            <div key={category} className="text-sm">
              <span className="text-blue-700">{category}:</span>
              <span className="font-bold text-blue-900 ml-2">
                Quote {quoteNum}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      {analysis && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-900 mb-2">Recommendation</h4>
          <p className="text-sm text-green-800">
            Based on profit margin and rate per mile,{" "}
            <span className="font-bold">
              Quote {displayQuotes.findIndex((q) => q.id === analysis.highestMargin) + 1}
            </span>{" "}
            offers the best overall value with a{" "}
            {displayQuotes.find((q) => q.id === analysis.highestMargin)?.profitMargin || 0}% profit margin.
          </p>
        </div>
      )}
    </Card>
  );
}
