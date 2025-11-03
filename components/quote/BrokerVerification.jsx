"use client";

import React, { useState } from "react";
import { FaShieldAlt, FaSearch, FaInfoCircle, FaTimes, FaExclamationTriangle, FaBuilding, FaDollarSign, FaPhone, FaChevronDown, FaChevronUp, FaCheckCircle, FaClock } from "react-icons/fa";
import { Input, Button } from "@/components/ui";

export default function BrokerVerification({ handleReportIssue }) {
  const [brokerSearchQuery, setBrokerSearchQuery] = useState("");
  const [brokerVerificationResult, setBrokerVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const handleBrokerVerify = () => {
    if (!brokerSearchQuery.trim()) return;

    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setBrokerVerificationResult({
        name: "Standard Freight Services",
        mcNumber: "45678",
        dotNumber: "87654",
        riskLevel: "Medium Risk",
        creditScore: "B",
        alerts: ["Payment terms recently changed from 30 to 45 days"],
        authority: {
          status: "Compliant",
          icon: "check"
        },
        paymentHistory: {
          avgDays: 38,
          status: "fair"
        },
        contactInfo: {
          phone: "(555) 123-4567",
          email: "dispatch@standardfreight.com",
          address: "123 Freight Way, Chicago, IL 60601"
        }
      });
      setIsVerifying(false);
      setShowContactInfo(false);
    }, 1500);
  };

  const handleClearBrokerSearch = () => {
    setBrokerSearchQuery("");
    setBrokerVerificationResult(null);
    setShowContactInfo(false);
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel.includes("Low")) return "bg-green-100 text-green-700";
    if (riskLevel.includes("Medium")) return "bg-yellow-100 text-yellow-700";
    if (riskLevel.includes("High")) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const getCreditColor = (score) => {
    if (score === "A" || score === "A+") return "bg-blue-100 text-blue-700";
    if (score === "B") return "bg-blue-100 text-blue-600";
    if (score === "C") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <FaShieldAlt className="text-blue-600 text-xl sm:text-2xl" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Broker Verification</h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-gray-500 text-sm">
          <FaInfoCircle />
          <span>Verify broker credentials before accepting loads</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={brokerSearchQuery}
            onChange={(e) => setBrokerSearchQuery(e.target.value)}
            placeholder="Enter broker name, MC or DOT number"
            icon={<FaSearch />}
            className="pr-10"
          />
          {brokerSearchQuery && (
            <button
              onClick={handleClearBrokerSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <Button
          onClick={handleBrokerVerify}
          disabled={isVerifying || !brokerSearchQuery.trim()}
          size="lg"
          className="w-full sm:w-auto"
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </div>

      {/* Verification Result */}
      {brokerVerificationResult ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Header with Company Name and Badges */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {brokerVerificationResult.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1 ${getRiskColor(brokerVerificationResult.riskLevel)}`}>
                  <FaExclamationTriangle className="text-xs" />
                  {brokerVerificationResult.riskLevel}
                </span>
                <span className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold ${getCreditColor(brokerVerificationResult.creditScore)}`}>
                  Credit: {brokerVerificationResult.creditScore}
                </span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              MC: {brokerVerificationResult.mcNumber} • DOT: {brokerVerificationResult.dotNumber}
            </p>
          </div>

          {/* Alerts Section */}
          {brokerVerificationResult.alerts && brokerVerificationResult.alerts.length > 0 && (
            <div className="bg-red-50 border-b border-red-200 p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <FaExclamationTriangle className="text-red-600 text-base sm:text-lg mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm sm:text-base font-semibold text-red-900 mb-2">Alerts:</h4>
                  <ul className="space-y-1">
                    {brokerVerificationResult.alerts.map((alert, index) => (
                      <li key={index} className="text-red-800 text-xs sm:text-sm">
                        • {alert}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Authority & Insurance Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <FaBuilding className="text-blue-600 text-base sm:text-lg md:text-xl" />
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Authority & Insurance</h4>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <FaCheckCircle className="text-sm sm:text-base" />
                <span className="text-sm sm:text-base font-semibold">{brokerVerificationResult.authority.status}</span>
              </div>
            </div>
          </div>

          {/* Payment History Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <FaDollarSign className="text-blue-600 text-base sm:text-lg md:text-xl" />
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Payment History</h4>
              </div>
              <div className="flex items-center gap-2 text-yellow-600">
                <FaClock className="text-sm sm:text-base" />
                <span className="text-sm sm:text-base font-semibold">Avg. {brokerVerificationResult.paymentHistory.avgDays} days</span>
              </div>
            </div>
          </div>

          {/* Contact Information Section - Expandable */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => setShowContactInfo(!showContactInfo)}
              className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <FaPhone className="text-blue-600 text-base sm:text-lg md:text-xl" />
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Contact Information</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-medium text-xs sm:text-sm">
                  {showContactInfo ? "Hide" : "Show"}
                </span>
                {showContactInfo ? (
                  <FaChevronUp className="text-blue-600 text-sm sm:text-base" />
                ) : (
                  <FaChevronDown className="text-blue-600 text-sm sm:text-base" />
                )}
              </div>
            </button>
            {showContactInfo && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900 break-all">
                      {brokerVerificationResult.contactInfo.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900 break-all">
                      {brokerVerificationResult.contactInfo.email}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 mb-1 text-xs sm:text-sm">Address</p>
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                    {brokerVerificationResult.contactInfo.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 sm:p-8 md:p-12 text-center">
          <div className="flex flex-col items-center gap-2 sm:gap-3 text-gray-400">
            <FaShieldAlt className="text-3xl sm:text-4xl md:text-5xl" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-600">Verify Before You Haul</h3>
            <p className="text-xs sm:text-sm max-w-md">
              Search for a broker to check their authority, insurance, and payment history
            </p>
          </div>
        </div>
      )}

      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <FaInfoCircle />
          <span>Data from FMCSA, credit agencies and carrier reports</span>
        </div>
        <button
          onClick={handleReportIssue}
          className="sm:ml-auto text-blue-600 hover:text-blue-700 font-medium text-left sm:text-right"
        >
          Report an issue
        </button>
      </div>
    </div>
  );
}
