"use client";
import React from "react";
import { Container } from "@/components/ui";

export default function SignInPage() {
  return (
    <Container>
      <div className="mt-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-neutral-600 mt-2">Sign in to access your dashboard</p>
      </div>
    </Container>
  );
}
