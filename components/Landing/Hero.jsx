"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { FaCalculator, FaUserPlus } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
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
                className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 py-4 text-lg min-w-[200px]"
                icon={<FaCalculator />}
                iconPosition="left"
              >
                Try Calculator
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="lg"
                variant="secondary"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg min-w-[200px]"
                icon={<FaUserPlus />}
                iconPosition="left"
              >
                Create Free Account
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <p className="mt-8 text-sm text-blue-200">
            ⚡ No signup required  •  💯 Industry-standard rates  •  🚀 Instant results
          </p>
        </div>
      </div>

      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 sm:h-16">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
