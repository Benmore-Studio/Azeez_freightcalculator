"use client";
import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { MapPin, Settings, Calculator, FileText } from "lucide-react";

const steps = [
  {
    icon: Settings,
    title: "Set Up Your Costs",
    description: "Enter your real operating costs once — fuel economy, insurance, payments, maintenance. We save it all.",
    color: "orange"
  },
  {
    icon: MapPin,
    title: "Enter Your Route",
    description: "Tell us pickup and delivery. We calculate exact truck-legal miles, tolls, and estimated drive time.",
    color: "slate"
  },
  {
    icon: Calculator,
    title: "Get Your Rate",
    description: "Instantly see your minimum rate, recommended rate, and true profit margin. No guesswork.",
    color: "emerald"
  },
  {
    icon: FileText,
    title: "Save & Export",
    description: "Save estimates to compare later. Export professional PDF quotes for shippers.",
    color: "orange"
  }
];

const colorClasses = {
  orange: {
    bg: "bg-orange-500",
    ring: "ring-orange-200",
    number: "bg-orange-100 text-orange-600"
  },
  slate: {
    bg: "bg-slate-700",
    ring: "ring-slate-200",
    number: "bg-slate-100 text-slate-600"
  },
  emerald: {
    bg: "bg-emerald-500",
    ring: "ring-emerald-200",
    number: "bg-emerald-100 text-emerald-600"
  }
};

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            Simple Process.
            <span className="block text-slate-500">Accurate Results.</span>
          </h2>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Set up once, calculate forever. Your costs stay saved so every new estimate takes seconds.
          </p>
        </div>

        {/* Steps - Horizontal on desktop, vertical on mobile */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-slate-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const colors = colorClasses[step.color];
              return (
                <div key={index} className="relative text-center lg:text-center">
                  {/* Step Number & Icon */}
                  <div className="relative inline-block mb-6">
                    <div className={`w-20 h-20 rounded-2xl ${colors.bg} flex items-center justify-center shadow-lg ring-4 ${colors.ring}`}>
                      <step.icon className="text-white" size={32} />
                    </div>
                    {/* Step Number */}
                    <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${colors.number} flex items-center justify-center text-sm font-bold shadow`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 sm:p-14 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to stop guessing on rates?
            </h3>
            <p className="text-slate-300 mb-8 max-w-md mx-auto">
              Join thousands of owner-operators who calculate rates based on their real costs.
            </p>
            <Link href="/auth/signup">
              <button className="group bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 text-lg rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center gap-3">
                Start Free Trial
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <p className="text-slate-400 text-sm mt-4">
              Start your free trial today. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
