"use client";
import React from "react";
import { FaRoute, FaTruckLoading, FaCalculator, FaCheckCircle } from "react-icons/fa";

const steps = [
  {
    icon: FaRoute,
    title: "Enter Your Route",
    description: "Tell us where you're picking up and delivering. We'll calculate the distance automatically.",
    step: "1"
  },
  {
    icon: FaTruckLoading,
    title: "Add Load Details",
    description: "Weight, dimensions, equipment type, and any special requirements for your freight.",
    step: "2"
  },
  {
    icon: FaCalculator,
    title: "Get Your Rate",
    description: "Instant calculation based on industry standards or your personalized operating costs.",
    step: "3"
  },
  {
    icon: FaCheckCircle,
    title: "Save & Share",
    description: "Save quotes to your dashboard, export to PDF, or email to clients. That's it!",
    step: "4"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Four simple steps to accurate freight rates
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Step Number Circle */}
              <div className="mb-6 relative inline-block">
                <div className="w-20 h-20 rounded-full bg-blue-900 text-white flex items-center justify-center text-2xl font-bold mx-auto">
                  {step.step}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <step.icon className="text-white" size={24} />
                </div>
              </div>

              {/* Connector Line (hidden on last item and mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-blue-200" />
              )}

              {/* Step Content */}
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                {step.title}
              </h3>
              <p className="text-neutral-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/calculator"
            className="inline-block bg-blue-900 text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-800 transition-colors text-lg"
          >
            Try It Now - No Signup Required
          </a>
        </div>
      </div>
    </section>
  );
}
