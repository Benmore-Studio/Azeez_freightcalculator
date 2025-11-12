"use client";

import React, { useState } from "react";
import { FaMapMarkerAlt, FaArrowRight, FaDollarSign, FaChartLine, FaEllipsisV } from "react-icons/fa";
import { Card, Button } from "@/components/ui";

export default function SavedQuotes() {
  const [showAll, setShowAll] = useState(false);

  // Mock data - will be replaced with actual data from backend
  const quotes = [
    {
      id: 1,
      origin: "Chicago, IL",
      destination: "Los Angeles, CA",
      rate: 4250.00,
      profit: 1150.00,
      profitMargin: 27,
      date: "2024-11-01",
      miles: 2015,
      status: "active"
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
      status: "active"
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
      status: "archived"
    },
    {
      id: 4,
      origin: "Seattle, WA",
      destination: "Denver, CO",
      rate: 2150.00,
      profit: 540.00,
      profitMargin: 25,
      date: "2024-10-25",
      miles: 1315,
      status: "active"
    },
    {
      id: 5,
      origin: "Phoenix, AZ",
      destination: "Portland, OR",
      rate: 3100.00,
      profit: 810.00,
      profitMargin: 26,
      date: "2024-10-22",
      miles: 1425,
      status: "active"
    },
  ];

  const displayedQuotes = showAll ? quotes : quotes.slice(0, 3);

  const getProfitColor = (margin) => {
    if (margin >= 30) return "text-green-600 bg-green-50";
    if (margin >= 20) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Saved Quotes</h2>
          <p className="text-sm text-gray-600 mt-1">Recent rate calculations</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "View All"}
        </Button>
      </div>

      {displayedQuotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-3">
            <FaDollarSign className="mx-auto text-5xl" />
          </div>
          <p className="text-gray-600 font-medium mb-1">No saved quotes yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Calculate your first rate to see it here
          </p>
          <Button size="sm">Calculate Rate</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedQuotes.map((quote) => (
            <div
              key={quote.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
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
                      <span className="text-gray-600">Miles:</span>{" "}
                      <span className="font-medium text-gray-900">
                        {quote.miles.toLocaleString()}
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
                <div className="flex items-center gap-2">
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
                  <button className="text-gray-400 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaEllipsisV />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {quotes.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {showAll ? "Show Less ↑" : `View ${quotes.length - 3} More Quotes ↓`}
          </button>
        </div>
      )}
    </Card>
  );
}
