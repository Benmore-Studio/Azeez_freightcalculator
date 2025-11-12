"use client";

import React, { useState } from "react";
import { FaMapMarkerAlt, FaArrowRight, FaChartLine, FaSearch, FaFilter, FaDownload, FaTrash, FaArchive } from "react-icons/fa";
import { Card, Button, Input } from "@/components/ui";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { showToast } from "@/lib/toast";

export default function QuotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, archived
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, quoteId: null });

  // Mock data - will be replaced with actual data from backend
  const allQuotes = [
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

  // Filter quotes based on search and status
  const filteredQuotes = allQuotes.filter((quote) => {
    const matchesSearch =
      searchQuery === "" ||
      quote.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || quote.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getProfitColor = (margin) => {
    if (margin >= 30) return "text-green-600 bg-green-50";
    if (margin >= 20) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  const handleExport = (quoteId) => {
    showToast.info("PDF export coming in Phase 2");
  };

  const handleArchive = (quoteId) => {
    showToast.success("Quote archived successfully");
    // TODO: Update quote status to archived
  };

  const handleDelete = (quoteId) => {
    setDeleteConfirm({ isOpen: true, quoteId });
  };

  const confirmDelete = () => {
    showToast.success("Quote deleted successfully");
    // TODO: Delete quote from database
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Saved Quotes
          </h1>
          <p className="text-gray-600">
            Manage all your freight rate calculations
          </p>
        </div>

        {/* Search & Filters */}
        <Card className="p-6 mb-6 bg-white border-2 border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search by origin or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterStatus === "all" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("all")}
              >
                All ({allQuotes.length})
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "active" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("active")}
              >
                Active ({allQuotes.filter(q => q.status === "active").length})
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "archived" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("archived")}
              >
                Archived ({allQuotes.filter(q => q.status === "archived").length})
              </Button>
            </div>
          </div>
        </Card>

        {/* Quotes List */}
        {filteredQuotes.length === 0 ? (
          <Card className="p-12 text-center bg-white border-2 border-gray-200">
            <div className="text-gray-400 mb-3">
              <FaSearch className="mx-auto text-5xl" />
            </div>
            <p className="text-gray-600 font-medium mb-1">No quotes found</p>
            <p className="text-sm text-gray-500 mb-4">
              {searchQuery
                ? "Try adjusting your search"
                : "Calculate your first rate to see it here"}
            </p>
            <Button size="sm" href="/calculator">
              Calculate Rate
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <Card
                key={quote.id}
                className="p-6 bg-white border-2 border-gray-200 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  {/* Route Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <FaMapMarkerAlt className="text-blue-600" size={16} />
                      <span className="font-semibold text-gray-900 text-lg">
                        {quote.origin}
                      </span>
                      <FaArrowRight className="text-gray-400" />
                      <span className="font-semibold text-gray-900 text-lg">
                        {quote.destination}
                      </span>
                      {quote.status === "archived" && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          Archived
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-600">Rate:</span>{" "}
                        <span className="font-bold text-gray-900 text-base">
                          ${quote.rate.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Profit:</span>{" "}
                        <span className="font-bold text-green-600 text-base">
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

                  {/* Profit Margin & Actions */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`px-4 py-2 rounded-full flex items-center gap-2 ${getProfitColor(
                        quote.profitMargin
                      )}`}
                    >
                      <FaChartLine />
                      <span className="font-bold text-base">
                        {quote.profitMargin}%
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExport(quote.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Export to PDF"
                      >
                        <FaDownload size={16} />
                      </button>
                      <button
                        onClick={() => handleArchive(quote.id)}
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                        title="Archive"
                      >
                        <FaArchive size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(quote.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, quoteId: null })}
        onConfirm={confirmDelete}
        title="Delete Quote"
        message="Are you sure you want to delete this quote? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
