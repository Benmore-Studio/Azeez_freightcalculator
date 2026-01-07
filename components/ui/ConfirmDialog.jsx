"use client";

import React from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // danger, primary, warning
  isLoading = false, // For async operations
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    // Don't auto-close - let the parent handle it after async operation completes
    onConfirm();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Icon */}
          <div className="flex items-start gap-4">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                variant === "danger"
                  ? "bg-red-100"
                  : variant === "warning"
                  ? "bg-orange-100"
                  : "bg-blue-100"
              }`}
            >
              <AlertTriangle
                className={
                  variant === "danger"
                    ? "text-red-600"
                    : variant === "warning"
                    ? "text-orange-600"
                    : "text-blue-600"
                }
                size={24}
              />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <h3
                id="dialog-title"
                className="text-lg font-bold text-gray-900 mb-2"
              >
                {title}
              </h3>
              <p className="text-sm text-gray-600 mb-6">{message}</p>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <Button size="sm" variant="secondary" onClick={onClose} disabled={isLoading}>
                  {cancelText}
                </Button>
                <Button
                  size="sm"
                  variant={variant}
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className={
                    variant === "danger"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : variant === "warning"
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : ""
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Deleting...
                    </>
                  ) : (
                    confirmText
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
