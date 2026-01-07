"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * CollapsibleSection - A reusable collapsible/accordion section
 *
 * @param {string} title - Section title
 * @param {string} description - Optional description shown below title
 * @param {React.ReactNode} icon - Optional icon to show before title
 * @param {React.ReactNode} children - Content to show when expanded
 * @param {boolean} defaultOpen - Whether to start expanded (default: false)
 * @param {string} badge - Optional badge text (e.g., "Optional", "3 selected")
 * @param {string} badgeColor - Badge color variant: "gray" | "blue" | "green" | "orange"
 */
export default function CollapsibleSection({
  title,
  description,
  icon,
  children,
  defaultOpen = false,
  badge,
  badgeColor = "gray",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const badgeColors = {
    gray: "bg-gray-100 text-gray-600",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
      {/* Header - Always visible, clickable */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="text-blue-600">
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{title}</span>
              {badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColors[badgeColor]}`}>
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <div className="text-gray-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Content - Shown when expanded */}
      {isOpen && (
        <div className="p-4 bg-white border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}
