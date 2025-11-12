"use client";
import React from "react";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";

export default function DashboardPage() {
  // TODO: Get actual user data from auth context in T7
  // For now, using mock data
  const userName = "John"; // Will be replaced with actual user name from auth

  return <DashboardOverview userName={userName} />;
}
