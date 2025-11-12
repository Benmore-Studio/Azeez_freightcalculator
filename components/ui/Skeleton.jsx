"use client";

import React from "react";

export default function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
  count = 1,
  circle = false
}) {
  const variants = {
    text: "h-4",
    title: "h-8",
    button: "h-10",
    card: "h-32",
    image: "h-48",
  };

  const baseClass = "bg-gray-200 animate-pulse";
  const shapeClass = circle ? "rounded-full" : "rounded";
  const heightClass = variants[variant] || height;

  const skeletonElement = (
    <div
      className={`${baseClass} ${shapeClass} ${heightClass} ${className}`}
      style={{ width: width || "100%", height: height }}
      aria-hidden="true"
    />
  );

  if (count === 1) {
    return skeletonElement;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {skeletonElement}
        </div>
      ))}
    </div>
  );
}

// Preset skeleton layouts
export function SkeletonCard() {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
      <Skeleton variant="title" width="60%" className="mb-4" />
      <Skeleton variant="text" count={3} />
      <div className="flex gap-3 mt-4">
        <Skeleton variant="button" width="100px" />
        <Skeleton variant="button" width="100px" />
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="20px" />
          ))}
        </div>
      </div>
      {/* Rows */}
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height="16px" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <Skeleton variant="text" width="40%" className="mb-3" />
            <Skeleton variant="title" width="60%" />
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <Skeleton variant="title" width="30%" className="mb-6" />
        <Skeleton variant="text" count={5} />
      </div>
    </div>
  );
}
