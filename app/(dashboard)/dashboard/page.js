"use client";
import React from "react";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  // Get first name from user's full name
  const userName = user?.name?.split(" ")[0] || "User";

  return <DashboardOverview userName={userName} />;
}
