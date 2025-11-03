"use client";
import React from "react";
import Hero from "@/components/Landing/Hero";
import Features from "@/components/Landing/Features";
import HowItWorks from "@/components/Landing/HowItWorks";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
    </main>
  );
}
