"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { FaCalculator, FaCheckCircle } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Calculate Freight Rates
            <span className="block text-blue-300 mt-2">In Seconds, Not Hours</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            Get instant, accurate freight rate estimates for your loads.
            No signup required for quick quotes.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/calculator">
              <Button
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-8 py-4 text-lg min-w-[200px] shadow-lg hover:shadow-xl transition-all"
                icon={<FaCalculator />}
                iconPosition="left"
              >
                Try Calculator →
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg min-w-[200px] transition-all"
              >
                Create Free Account
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" />
              No signup required
            </span>
            <span className="hidden sm:inline text-blue-400">•</span>
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" />
              Industry-standard rates
            </span>
            <span className="hidden sm:inline text-blue-400">•</span>
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" />
              Instant results
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
