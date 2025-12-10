"use client";

import React from "react";
import Sidebar from "@/components/Navigation/Sidebar";
import AuthGuard from "@/components/Auth/AuthGuard";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="lg:pl-64">
          <div className="pt-16 lg:pt-0">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
