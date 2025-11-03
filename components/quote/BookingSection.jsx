"use client";

import React, { useState } from "react";
import { FaTruck, FaPlus, FaClock } from "react-icons/fa";
import { Button } from "@/components/ui";
import BookingModal from "./BookingModal";

export default function BookingSection({ data, formatCurrency, handleViewBookingPolicies }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <FaTruck className="text-blue-600 text-xl sm:text-2xl" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Book This Load</h2>
          </div>
          <Button
            onClick={handleBookNow}
            size="lg"
            icon={<FaPlus />}
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Book Now
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-base text-gray-700">
            Click "Book Now" to schedule this load at the calculated rate of{" "}
            <span className="font-bold text-blue-600 text-lg sm:text-xl">
              {formatCurrency(data?.bookingInfo?.calculatedRate)}
            </span>
          </p>
        </div>

        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <FaClock />
            <span>Bookings are confirmed within {data?.bookingInfo?.confirmationTime}</span>
          </div>
          <button
            onClick={handleViewBookingPolicies}
            className="text-blue-600 hover:text-blue-700 font-medium text-left sm:text-right"
          >
            View booking policies
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        handleViewBookingPolicies={handleViewBookingPolicies}
      />
    </>
  );
}
