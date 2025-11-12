"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({ href, icon: Icon, label, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  // If onClick provided, it's a button (like Sign Out)
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
      >
        <Icon size={20} className="text-gray-600" />
        <span className="font-medium text-sm">{label}</span>
      </button>
    );
  }

  // Otherwise, it's a link
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
        isActive
          ? "bg-blue-50 text-blue-700 font-bold"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {/* Active Indicator - Blue left border */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-lg" />
      )}
      <Icon
        size={20}
        className={isActive ? "text-blue-600" : "text-gray-600"}
      />
      <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>{label}</span>
    </Link>
  );
}
