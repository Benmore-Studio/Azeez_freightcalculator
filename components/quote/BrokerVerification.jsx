"use client";

import React, { useState } from "react";
import {
  FaShieldAlt,
  FaSearch,
  FaInfoCircle,
  FaTimes,
  FaExclamationTriangle,
  FaBuilding,
  FaDollarSign,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaExclamationCircle,
  FaTimesCircle,
  FaCarCrash,
} from "react-icons/fa";
import { Input, Button } from "@/components/ui";
import { fmcsaApi } from "@/lib/api";

export default function BrokerVerification() {
  const [brokerSearchQuery, setBrokerSearchQuery] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showSafetyDetails, setShowSafetyDetails] = useState(false);
  const [error, setError] = useState(null);

  const handleBrokerVerify = async () => {
    if (!brokerSearchQuery.trim()) return;

    setIsVerifying(true);
    setError(null);

    try {
      const result = await fmcsaApi.verify(brokerSearchQuery.trim());
      setVerificationResult(result);
      setShowContactInfo(false);
      setShowSafetyDetails(false);
    } catch (err) {
      console.error("Verification error:", err);
      setError(err.message || "Failed to verify. Please try again.");
      setVerificationResult(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClearBrokerSearch = () => {
    setBrokerSearchQuery("");
    setVerificationResult(null);
    setShowContactInfo(false);
    setShowSafetyDetails(false);
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleBrokerVerify();
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "critical":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case "low":
        return <FaCheckCircle className="text-green-600" />;
      case "medium":
        return <FaExclamationCircle className="text-yellow-600" />;
      case "high":
        return <FaExclamationTriangle className="text-orange-600" />;
      case "critical":
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaInfoCircle className="text-gray-600" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAuthorityStatusColor = (status) => {
    const upperStatus = (status || "").toUpperCase();
    if (upperStatus.includes("ACTIVE")) return "text-green-600";
    if (upperStatus.includes("PENDING")) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <FaShieldAlt className="text-blue-600 text-xl sm:text-2xl" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Broker/Carrier Verification
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-gray-500 text-sm">
          <FaInfoCircle />
          <span>Real-time FMCSA data</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={brokerSearchQuery}
            onChange={(e) => setBrokerSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter DOT#, MC#, or company name"
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-red-700">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Verification Result */}
      {verificationResult && verificationResult.found ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Header with Company Name and Risk Score */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                  {verificationResult.carrier?.legalName || "Unknown"}
                </h3>
                {verificationResult.carrier?.dbaName && (
                  <p className="text-gray-600 text-sm">
                    DBA: {verificationResult.carrier.dbaName}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 ${getRiskColor(
                    verificationResult.riskAssessment?.level
                  )}`}
                >
                  {getRiskIcon(verificationResult.riskAssessment?.level)}
                  {verificationResult.riskAssessment?.level?.toUpperCase()} RISK
                </span>
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold ${getScoreColor(
                    verificationResult.riskAssessment?.score
                  )} bg-gray-100`}
                >
                  Score: {verificationResult.riskAssessment?.score}/100
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span>
                <strong>DOT:</strong> {verificationResult.carrier?.dotNumber}
              </span>
              {verificationResult.carrier?.mcNumber && (
                <span>
                  <strong>MC:</strong> {verificationResult.carrier.mcNumber}
                </span>
              )}
              <span
                className={`font-semibold ${
                  verificationResult.carrier?.operatingStatus === "AUTHORIZED"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {verificationResult.carrier?.operatingStatus}
              </span>
            </div>
          </div>

          {/* Risk Assessment Recommendation */}
          <div
            className={`p-4 border-b ${
              verificationResult.riskAssessment?.level === "critical"
                ? "bg-red-50 border-red-200"
                : verificationResult.riskAssessment?.level === "high"
                ? "bg-orange-50 border-orange-200"
                : verificationResult.riskAssessment?.level === "medium"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <p className="font-medium text-gray-800">
              {verificationResult.riskAssessment?.recommendation}
            </p>
            {verificationResult.riskAssessment?.factors?.length > 0 && (
              <ul className="mt-2 space-y-1">
                {verificationResult.riskAssessment.factors.map(
                  (factor, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="mt-1">
                        {factor.includes("NOT") ||
                        factor.includes("Insufficient") ||
                        factor.includes("UNSATISFACTORY") ||
                        factor.includes("fatal") ||
                        factor.includes("High") ? (
                          <FaTimesCircle className="text-red-500 text-xs" />
                        ) : factor.includes("Satisfactory") ||
                          factor.includes("verified") ||
                          factor.includes("Insurance on file") ? (
                          <FaCheckCircle className="text-green-500 text-xs" />
                        ) : (
                          <FaInfoCircle className="text-gray-400 text-xs" />
                        )}
                      </span>
                      {factor}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          {/* Authority Status Section */}
          {verificationResult.authorities?.length > 0 && (
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <FaBuilding className="text-blue-600 text-lg" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Operating Authority
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {verificationResult.authorities.map((auth, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 text-sm"
                  >
                    <div className="font-medium text-gray-900">
                      {auth.authorityType}
                    </div>
                    <div
                      className={`font-semibold ${getAuthorityStatusColor(
                        auth.authorityStatus
                      )}`}
                    >
                      {auth.authorityStatusDesc || auth.authorityStatus}
                    </div>
                    {auth.effectiveDate && (
                      <div className="text-gray-500 text-xs mt-1">
                        Effective: {auth.effectiveDate}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insurance Section */}
          {verificationResult.insurance && (
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <FaDollarSign className="text-blue-600 text-lg" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Insurance on File
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">BIPD Liability</div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(
                      verificationResult.insurance.bipdInsuranceOnFile
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Cargo</div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(
                      verificationResult.insurance.cargoInsuranceOnFile
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Bond/Trust</div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(
                      verificationResult.insurance.bondInsuranceOnFile
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Safety Rating Section */}
          {verificationResult.safetyRating && (
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaTruck className="text-blue-600 text-lg" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Safety Rating
                  </h4>
                </div>
                <div
                  className={`font-semibold ${
                    verificationResult.safetyRating.rating === "Satisfactory"
                      ? "text-green-600"
                      : verificationResult.safetyRating.rating === "Conditional"
                      ? "text-yellow-600"
                      : verificationResult.safetyRating.rating === "Unsatisfactory"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {verificationResult.safetyRating.rating}
                </div>
              </div>
              {verificationResult.safetyRating.ratingDate && (
                <div className="text-sm text-gray-500 mt-1">
                  Rating Date: {verificationResult.safetyRating.ratingDate}
                </div>
              )}
            </div>
          )}

          {/* Safety Data Section - Expandable */}
          {verificationResult.safetyData && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => setShowSafetyDetails(!showSafetyDetails)}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaCarCrash className="text-blue-600 text-lg" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Inspection & Crash Data
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-medium text-sm">
                    {showSafetyDetails ? "Hide" : "Show"}
                  </span>
                  {showSafetyDetails ? (
                    <FaChevronUp className="text-blue-600" />
                  ) : (
                    <FaChevronDown className="text-blue-600" />
                  )}
                </div>
              </button>
              {showSafetyDetails && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 bg-gray-50">
                  {/* Out of Service Rates */}
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      Out-of-Service Rates (National Avg: ~20%)
                    </h5>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Driver OOS</div>
                        <div
                          className={`font-semibold ${
                            verificationResult.safetyData.driverOutOfServicePercent > 30
                              ? "text-red-600"
                              : verificationResult.safetyData.driverOutOfServicePercent > 20
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {verificationResult.safetyData.driverOutOfServicePercent?.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">
                          {verificationResult.safetyData.driverOutOfServiceInspections}/
                          {verificationResult.safetyData.totalDriverInspections} insp
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Vehicle OOS</div>
                        <div
                          className={`font-semibold ${
                            verificationResult.safetyData.vehicleOutOfServicePercent > 30
                              ? "text-red-600"
                              : verificationResult.safetyData.vehicleOutOfServicePercent > 20
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {verificationResult.safetyData.vehicleOutOfServicePercent?.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">
                          {verificationResult.safetyData.vehicleOutOfServiceInspections}/
                          {verificationResult.safetyData.totalVehicleInspections} insp
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Hazmat OOS</div>
                        <div
                          className={`font-semibold ${
                            verificationResult.safetyData.hazmatOutOfServicePercent > 10
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {verificationResult.safetyData.hazmatOutOfServicePercent?.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">
                          {verificationResult.safetyData.hazmatOutOfServiceInspections}/
                          {verificationResult.safetyData.totalHazmatInspections} insp
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Crash History */}
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">
                      Crash History (Last 24 Months)
                    </h5>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Total</div>
                        <div className="font-semibold text-gray-900">
                          {verificationResult.safetyData.crashTotal}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Fatal</div>
                        <div
                          className={`font-semibold ${
                            verificationResult.safetyData.fatalCrash > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {verificationResult.safetyData.fatalCrash}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Injury</div>
                        <div className="font-semibold text-gray-900">
                          {verificationResult.safetyData.injuryCrash}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Tow-Away</div>
                        <div className="font-semibold text-gray-900">
                          {verificationResult.safetyData.towCrash}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact Information Section - Expandable */}
          {verificationResult.carrier?.address && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => setShowContactInfo(!showContactInfo)}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FaPhone className="text-blue-600 text-lg" />
                  <h4 className="text-lg font-semibold text-gray-900">
                    Contact Information
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-medium text-sm">
                    {showContactInfo ? "Hide" : "Show"}
                  </span>
                  {showContactInfo ? (
                    <FaChevronUp className="text-blue-600" />
                  ) : (
                    <FaChevronDown className="text-blue-600" />
                  )}
                </div>
              </button>
              {showContactInfo && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 bg-gray-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {verificationResult.carrier.phone && (
                      <div>
                        <p className="text-gray-500 mb-1">Phone</p>
                        <p className="font-semibold text-gray-900">
                          {verificationResult.carrier.phone}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500 mb-1">Entity Type</p>
                      <p className="font-semibold text-gray-900">
                        {verificationResult.carrier.entityType}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1 text-sm">Physical Address</p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {verificationResult.carrier.address.street}
                      <br />
                      {verificationResult.carrier.address.city},{" "}
                      {verificationResult.carrier.address.state}{" "}
                      {verificationResult.carrier.address.zip}
                    </p>
                  </div>
                  {verificationResult.carrier.mailingAddress && (
                    <div>
                      <p className="text-gray-500 mb-1 text-sm">Mailing Address</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {verificationResult.carrier.mailingAddress.street}
                        <br />
                        {verificationResult.carrier.mailingAddress.city},{" "}
                        {verificationResult.carrier.mailingAddress.state}{" "}
                        {verificationResult.carrier.mailingAddress.zip}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Last Updated */}
          <div className="p-3 bg-gray-50 text-center text-xs text-gray-500">
            Data from FMCSA SAFER | Last updated:{" "}
            {new Date(verificationResult.lastUpdated).toLocaleString()}
          </div>
        </div>
      ) : verificationResult && !verificationResult.found ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Carrier/Broker Not Found
          </h3>
          <p className="text-red-700 text-sm">
            {verificationResult.riskAssessment?.factors?.[0] ||
              "No record found in FMCSA database. Verify the DOT/MC number is correct."}
          </p>
          <p className="text-red-600 font-medium mt-3">
            {verificationResult.riskAssessment?.recommendation}
          </p>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 sm:p-8 md:p-12 text-center">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <FaShieldAlt className="text-4xl sm:text-5xl" />
            <h3 className="text-lg font-semibold text-gray-600">
              Verify Before You Haul
            </h3>
            <p className="text-sm max-w-md">
              Enter a DOT number, MC number, or company name to check their
              authority, insurance, and safety record
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs">
              <span className="bg-gray-100 px-2 py-1 rounded">
                Example: DOT 12345
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Example: MC 67890
              </span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                Example: Swift Transportation
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
        <FaInfoCircle />
        <span>Real-time data from FMCSA SAFER System</span>
      </div>
    </div>
  );
}
