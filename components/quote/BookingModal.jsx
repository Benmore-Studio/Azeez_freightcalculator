"use client";

import React, { useState } from "react";
import { FaTruck, FaTimes, FaInfoCircle, FaMapMarkerAlt, FaCalendar, FaClock, FaChevronRight } from "react-icons/fa";
import { Input, Select, Button, Checkbox } from "@/components/ui";

export default function BookingModal({ isOpen, onClose, handleViewBookingPolicies }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupDate: "20/10/2025",
    pickupTime: "8:00 AM",
    pickupContactName: "",
    pickupContactPhone: "",
    deliveryDate: "25/10/2025",
    deliveryTime: "4:00 PM",
    deliveryContactName: "",
    deliveryContactPhone: "",
    specialInstructions: "",
    paymentMethod: "quickpay",
    quickPayFee: 3,
    sendConfirmation: true,
    confirmationEmail: "damolasalau23@gmail.com",
    confirmationSMS: "09026969416",
    acceptTerms: false
  });

  const totalRate = 0.0; // This would come from props in real implementation

  const calculatePayment = () => {
    const feeAmount = (totalRate * formData.quickPayFee) / 100;
    const youReceive = totalRate - feeAmount;
    return {
      originalRate: totalRate,
      feeAmount: feeAmount,
      youReceive: youReceive
    };
  };

  const payment = calculatePayment();

  // Mock data - would come from props in real implementation
  const loadDetails = {
    origin: "",
    destination: "",
    distance: "",
    loadType: "Dry"
  };

  const formatDateTime = (date, time) => {
    // Convert date format and time to readable format
    const dateObj = new Date(date);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);

    // Convert time to 24hr format for display
    const timeStr = time.replace(/\s/g, '');
    return `${formattedDate} at ${time.replace(' ', '')}`;
  };

  const getPaymentMethodLabel = () => {
    switch (formData.paymentMethod) {
      case "quickpay":
        return "Quick Pay";
      case "standard":
        return "Standard (30 days)";
      case "factor":
        return "Factor";
      default:
        return "";
    }
  };

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, label: "Schedule" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Review" }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <FaTruck className="text-blue-600 text-lg sm:text-xl md:text-2xl" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Book This Load</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            icon={<FaTimes />}
            iconPosition="left"
            className="text-gray-600"
          >
            <span className="hidden sm:inline">Close</span>
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 border-b border-gray-200">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg font-semibold ${
                      currentStep === step.number
                        ? "bg-blue-600 text-white"
                        : currentStep > step.number
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`text-xs sm:text-sm md:text-base lg:text-lg font-semibold ${
                      currentStep === step.number
                        ? "text-blue-600"
                        : currentStep > step.number
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-1 sm:mx-2 md:mx-4 ${
                      currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-3 sm:p-4 md:p-6">
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                <FaInfoCircle className="text-blue-600 text-base sm:text-lg md:text-xl mt-0.5 flex-shrink-0" />
                <p className="text-sm sm:text-base text-blue-900">
                  Schedule your pickup and delivery times for this load from to .
                </p>
              </div>

              {/* Pickup and Delivery Forms */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Pickup Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FaMapMarkerAlt className="text-green-600 text-xl" />
                    <h3 className="text-xl font-semibold text-gray-900">Pickup Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Pickup Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.pickupDate}
                        onChange={(e) => handleInputChange("pickupDate", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FaCalendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Pickup Time
                    </label>
                    <div className="relative">
                      <select
                        value={formData.pickupTime}
                        onChange={(e) => handleInputChange("pickupTime", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      >
                        <option>8:00 AM</option>
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                        <option>1:00 PM</option>
                        <option>2:00 PM</option>
                        <option>3:00 PM</option>
                        <option>4:00 PM</option>
                        <option>5:00 PM</option>
                      </select>
                      <FaClock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={formData.pickupContactName}
                      onChange={(e) => handleInputChange("pickupContactName", e.target.value)}
                      placeholder="Contact at pickup location"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.pickupContactPhone}
                      onChange={(e) => handleInputChange("pickupContactPhone", e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FaMapMarkerAlt className="text-red-600 text-xl" />
                    <h3 className="text-xl font-semibold text-gray-900">Delivery Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Delivery Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.deliveryDate}
                        onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FaCalendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Delivery Time
                    </label>
                    <div className="relative">
                      <select
                        value={formData.deliveryTime}
                        onChange={(e) => handleInputChange("deliveryTime", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      >
                        <option>8:00 AM</option>
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                        <option>1:00 PM</option>
                        <option>2:00 PM</option>
                        <option>3:00 PM</option>
                        <option>4:00 PM</option>
                        <option>5:00 PM</option>
                      </select>
                      <FaClock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryContactName}
                      onChange={(e) => handleInputChange("deliveryContactName", e.target.value)}
                      placeholder="Contact at delivery location"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.deliveryContactPhone}
                      onChange={(e) => handleInputChange("deliveryContactPhone", e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                  placeholder="Enter any special instructions for pickup or delivery"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
                <p className="text-blue-900">
                  Select how you would like to be paid for this load. The total rate is ${totalRate.toFixed(2)}.
                </p>
              </div>

              {/* Quick Pay Option */}
              <div
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  formData.paymentMethod === "quickpay"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => handleInputChange("paymentMethod", "quickpay")}
              >
                <div className="flex items-start gap-3 mb-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={formData.paymentMethod === "quickpay"}
                    onChange={() => handleInputChange("paymentMethod", "quickpay")}
                    className="mt-1 w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Pay</h3>
                    <p className="text-gray-600 mb-4">
                      Get paid within 24 hours of delivery with a 3% processing fee.
                    </p>

                    {formData.paymentMethod === "quickpay" && (
                      <div className="space-y-4">
                        {/* Fee Selector */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Quick Pay Fee (%)
                          </label>
                          <select
                            value={formData.quickPayFee}
                            onChange={(e) => handleInputChange("quickPayFee", Number(e.target.value))}
                            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value={3}>3% (Standard)</option>
                            <option value={2}>2% (Premium)</option>
                            <option value={1}>1% (VIP)</option>
                          </select>
                        </div>

                        {/* Payment Breakdown */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between text-gray-700">
                            <span>Original Rate:</span>
                            <span className="font-semibold">${payment.originalRate.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-red-600">
                            <span>Quick Pay Fee ({formData.quickPayFee}%):</span>
                            <span className="font-semibold">-${payment.feeAmount.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-gray-900">You'll Receive:</span>
                              <span className="text-2xl font-bold text-green-600">
                                ${payment.youReceive.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Standard Payment Option */}
              <div
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  formData.paymentMethod === "standard"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => handleInputChange("paymentMethod", "standard")}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={formData.paymentMethod === "standard"}
                    onChange={() => handleInputChange("paymentMethod", "standard")}
                    className="mt-1 w-5 h-5 text-blue-600"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Standard Payment (30 days)
                    </h3>
                    <p className="text-gray-600">
                      Receive full payment within 30 days of delivery with no processing fees.
                    </p>
                  </div>
                </div>
              </div>

              {/* Factor Company Option */}
              <div
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  formData.paymentMethod === "factor"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => handleInputChange("paymentMethod", "factor")}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={formData.paymentMethod === "factor"}
                    onChange={() => handleInputChange("paymentMethod", "factor")}
                    className="mt-1 w-5 h-5 text-blue-600"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Factor Company</h3>
                    <p className="text-gray-600">Send payment to your factoring company.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
                <p className="text-blue-900">
                  Please review your booking details before confirming. You'll receive a confirmation once the booking is complete.
                </p>
              </div>

              {/* Load Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Load Details</h3>

                {/* Origin and Destination */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Origin</p>
                    <p className="text-base font-semibold text-gray-900">{loadDetails.origin || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Destination</p>
                    <p className="text-base font-semibold text-gray-900">{loadDetails.destination || "-"}</p>
                  </div>
                </div>

                {/* Distance and Load Type */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Distance</p>
                    <p className="text-base font-bold text-gray-900">
                      {loadDetails.distance ? `${loadDetails.distance} miles` : "miles"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Load Type</p>
                    <p className="text-base font-bold text-gray-900">{loadDetails.loadType}</p>
                  </div>
                </div>

                {/* Pickup and Delivery Times */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pickup</p>
                    <p className="text-base font-bold text-gray-900">
                      {formatDateTime(formData.pickupDate, formData.pickupTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Delivery</p>
                    <p className="text-base font-bold text-gray-900">
                      {formatDateTime(formData.deliveryDate, formData.deliveryTime)}
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="text-base font-bold text-gray-900">{getPaymentMethodLabel()}</p>
                </div>

                {/* Total Rate */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">Total Rate</p>
                    <p className="text-2xl font-bold text-green-600">${totalRate.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Send Booking Confirmation */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="sendConfirmation"
                    checked={formData.sendConfirmation}
                    onChange={(e) => handleInputChange("sendConfirmation", e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded"
                  />
                  <label htmlFor="sendConfirmation" className="text-base font-medium text-gray-900 cursor-pointer">
                    Send booking confirmation
                  </label>
                </div>

                {formData.sendConfirmation && (
                  <div className="ml-8 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.confirmationEmail}
                        onChange={(e) => handleInputChange("confirmationEmail", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        SMS (optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.confirmationSMS}
                        onChange={(e) => handleInputChange("confirmationSMS", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange("acceptTerms", e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded"
                />
                <label htmlFor="acceptTerms" className="text-base text-gray-700 cursor-pointer">
                  I accept the{" "}
                  <button
                    onClick={handleViewBookingPolicies}
                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    terms and conditions
                  </button>{" "}
                  for this booking, including payment terms and cancellation policy.
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
              <FaInfoCircle className="flex-shrink-0" />
              <span className="hidden sm:inline">Bookings are confirmed within 1 business hour</span>
              <span className="sm:hidden">Confirmed within 1 hour</span>
              <button
                onClick={handleViewBookingPolicies}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View policies
              </button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {currentStep > 1 && (
                <Button
                  onClick={handleBack}
                  variant="secondary"
                  size="lg"
                  className="flex-1 sm:flex-none"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleContinue}
                disabled={currentStep === 3 && !formData.acceptTerms}
                size="lg"
                icon={<FaChevronRight />}
                iconPosition="right"
                className="flex-1 sm:flex-none"
              >
                {currentStep === 1
                  ? "Continue"
                  : currentStep === 2
                  ? "Review"
                  : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
