"use client";

import React from "react";
import Link from "next/link";
import { FaMapMarkerAlt, FaArrowRight, FaChartLine } from "react-icons/fa";
import { Card, Button } from "@/components/ui";

export default function RecentQuotes() {
  // Mock data - will be replaced with actual data from backend
  // Only showing 3 most recent
  const recentQuotes = [
    {
      id: 1,
      origin: "Chicago, IL",
      destination: "Los Angeles, CA",
      rate: 4250.00,
      profit: 1150.00,
      profitMargin: 27,
      date: "2024-11-01",
      miles: 2015,
    },
    {
      id: 2,
      origin: "Dallas, TX",
      destination: "Atlanta, GA",
      rate: 2890.00,
      profit: 680.00,
      profitMargin: 24,
      date: "2024-10-30",
      miles: 780,
    },
    {
      id: 3,
      origin: "Miami, FL",
      destination: "New York, NY",
      rate: 3420.00,
      profit: 920.00,
      profitMargin: 27,
      date: "2024-10-28",
      miles: 1280,
    },
  ];

  const getProfitColor = (margin) => {
    if (margin >= 30) return "text-green-600 bg-green-50";
    if (margin >= 20) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  return (
    <Card className="p-6 bg-white border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Recent Quotes</h2>
          <p className="text-sm text-gray-600 mt-1">Your latest rate calculations</p>
        </div>
        <Link href="/quotes">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {recentQuotes.map((quote) => (
          <div
            key={quote.id}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              {/* Route Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FaMapMarkerAlt className="text-blue-600 text-sm" />
                  <span className="font-semibold text-gray-900 text-sm">
                    {quote.origin}
                  </span>
                  <FaArrowRight className="text-gray-400 text-xs" />
                  <span className="font-semibold text-gray-900 text-sm">
                    {quote.destination}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Rate:</span>{" "}
                    <span className="font-bold text-gray-900">
                      ${quote.rate.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Profit:</span>{" "}
                    <span className="font-bold text-green-600">
                      +${quote.profit.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">
                      {new Date(quote.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profit Margin Badge */}
              <div
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${getProfitColor(
                  quote.profitMargin
                )}`}
              >
                <FaChartLine className="text-xs" />
                <span className="font-bold text-sm">
                  {quote.profitMargin}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-4 text-center">
        <Link
          href="/quotes"
          className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-2"
        >
          View All Quotes
          <FaArrowRight className="text-xs" />
        </Link>
      </div>
    </Card>
  );
}
