"use client";
import React from "react";
import { Container } from "@/components/ui";

export default function DashboardPage() {
  return (
    <Container>
      <div className="mt-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-neutral-600 mt-2">Your central hub - saved quotes, vehicles, and rewards</p>
      </div>
    </Container>
  );
}
