"use client";

import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaArrowRight, FaChartLine, FaSearch, FaDownload, FaTrash, FaArchive, FaBalanceScale } from "react-icons/fa";
import { Card, Button, Input, Spinner, Checkbox } from "@/components/ui";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import QuoteComparison from "@/components/quote/QuoteComparison";
import { showToast } from "@/lib/toast";
import { quotesApi } from "@/lib/api";

export default function QuotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, archived
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, quoteId: null });
  const [allQuotes, setAllQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  // Comparison mode state
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  useEffect(() => {
    loadQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const loadQuotes = async () => {
    setIsLoading(true);
    try {
      const status = filterStatus === "all" ? undefined : filterStatus;
      const response = await quotesApi.getQuotes(pagination.page, pagination.limit, status);

      // Transform quotes to display format
      const transformedQuotes = response.data.map((q) => ({
        id: q.id,
        origin: q.origin,
        destination: q.destination,
        rate: q.recommendedRate || 0,
        profit: (q.recommendedRate || 0) - (q.totalCosts || 0),
        profitMargin: q.recommendedRate ? Math.round(((q.recommendedRate - (q.totalCosts || 0)) / q.recommendedRate) * 100) : 0,
        date: q.createdAt,
        miles: q.totalMiles || 0,
        status: q.status || "draft",
        ratePerMile: q.ratePerMile || 0,
      }));

      setAllQuotes(transformedQuotes);
      setPagination((prev) => ({ ...prev, total: response.pagination?.total || transformedQuotes.length }));
    } catch (error) {
      console.error("Failed to load quotes:", error);
      showToast.error("Failed to load quotes");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter quotes based on search (status filter is handled by API)
  const filteredQuotes = allQuotes.filter((quote) => {
    const matchesSearch =
      searchQuery === "" ||
      quote.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.destination.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getProfitColor = (margin) => {
    if (margin >= 30) return "text-green-600 bg-green-50";
    if (margin >= 20) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: "Active",
      active: "Active",
      archived: "Archived",
      expired: "Archived",
    };
    return labels[status] || "Active";
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: "bg-blue-100 text-blue-600",
      active: "bg-blue-100 text-blue-600",
      archived: "bg-gray-100 text-gray-600",
      expired: "bg-gray-100 text-gray-600",
    };
    return colors[status] || "bg-blue-100 text-blue-600";
  };

  const handleExport = async (quoteId) => {
    try {
      showToast.info("Generating PDF...");
      await quotesApi.exportPDF(quoteId, {
        includeWeather: true,
        includeMarketIntel: true,
        includeTolls: true,
      });
      showToast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Failed to export PDF:", error);
      showToast.error("Failed to generate PDF");
    }
  };

  const handleArchive = async (quoteId) => {
    try {
      await quotesApi.updateQuoteStatus(quoteId, "expired");
      showToast.success("Quote archived successfully");
      loadQuotes();
    } catch (error) {
      console.error("Failed to archive quote:", error);
      showToast.error("Failed to archive quote");
    }
  };

  const handleDelete = (quoteId) => {
    setDeleteConfirm({ isOpen: true, quoteId });
  };

  const confirmDelete = async () => {
    try {
      await quotesApi.deleteQuote(deleteConfirm.quoteId);
      showToast.success("Quote deleted successfully");
      setDeleteConfirm({ isOpen: false, quoteId: null });
      loadQuotes();
    } catch (error) {
      console.error("Failed to delete quote:", error);
      showToast.error("Failed to delete quote");
    }
  };

  // Comparison handlers
  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (compareMode) {
      setSelectedForCompare([]); // Clear selections when exiting compare mode
    }
  };

  const handleSelectForCompare = (quoteId) => {
    if (selectedForCompare.includes(quoteId)) {
      setSelectedForCompare(selectedForCompare.filter((id) => id !== quoteId));
    } else if (selectedForCompare.length < 4) {
      setSelectedForCompare([...selectedForCompare, quoteId]);
    } else {
      showToast.warning("Maximum 4 quotes can be compared at once");
    }
  };

  const getSelectedQuotes = () => {
    return filteredQuotes.filter((q) => selectedForCompare.includes(q.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={filterStatus === "all" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "active" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("active")}
              >
                Active
              </Button>
              <Button
                size="sm"
                variant={filterStatus === "archived" ? "primary" : "secondary"}
                onClick={() => setFilterStatus("archived")}
              >
                Archived
              </Button>

              {/* Compare Button */}
              <Button
                size="sm"
                variant={compareMode ? "primary" : "outline"}
                onClick={toggleCompareMode}
                className="ml-2"
              >
                <FaBalanceScale className="mr-1" size={14} />
                {compareMode ? `Compare (${selectedForCompare.length})` : "Compare"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Quotes List */}
        {isLoading ? (
          <Card className="p-12 text-center bg-white border-2 border-gray-200">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Loading quotes...</p>
          </Card>
        ) : filteredQuotes.length === 0 ? (
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
            <Button size="sm" href="/rate-calculator">
              Calculate Rate
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <Card
                key={quote.id}
                className={`p-6 bg-white border-2 transition-all ${
                  compareMode && selectedForCompare.includes(quote.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-200 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between">
                  {/* Compare Checkbox */}
                  {compareMode && (
                    <div className="mr-4 pt-1">
                      <Checkbox
                        checked={selectedForCompare.includes(quote.id)}
                        onChange={() => handleSelectForCompare(quote.id)}
                        className="w-5 h-5"
                      />
                    </div>
                  )}

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
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(quote.status)}`}>
                        {getStatusLabel(quote.status)}
                      </span>
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

        {/* Comparison Panel */}
        {compareMode && selectedForCompare.length >= 2 && (
          <div className="mt-6">
            <QuoteComparison
              quotes={getSelectedQuotes()}
              onClose={() => {
                setCompareMode(false);
                setSelectedForCompare([]);
              }}
            />
          </div>
        )}

        {/* Compare mode hint */}
        {compareMode && selectedForCompare.length < 2 && (
          <Card className="mt-4 p-4 bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              Select at least 2 quotes to compare (maximum 4)
            </p>
          </Card>
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
