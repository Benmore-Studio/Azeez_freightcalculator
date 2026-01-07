"use client";
import React from "react";
import {
  FaGasPump,
  FaRoute,
  FaClipboardCheck,
  FaTruck,
  FaChartPie,
  FaFileInvoiceDollar
} from "react-icons/fa";
import { Shield, Zap, Target } from "lucide-react";

const features = [
  {
    icon: FaGasPump,
    title: "Real-Time Fuel Prices",
    description: "We pull live EIA fuel data so your estimates reflect what you're actually paying at the pump — not last month's average.",
    color: "orange"
  },
  {
    icon: FaRoute,
    title: "Truck-Legal Routing",
    description: "PC*MILER integration ensures accurate mileage using routes trucks can actually drive — not car GPS shortcuts.",
    color: "slate"
  },
  {
    icon: FaChartPie,
    title: "Your Actual Costs",
    description: "Input your insurance, payments, maintenance, and per-mile costs. Get rates based on YOUR numbers, not industry guesses.",
    color: "emerald"
  },
  {
    icon: Shield,
    title: "Broker Verification",
    description: "Instantly verify any broker's FMCSA authority, insurance, and safety record before you commit to a load.",
    color: "orange"
  },
  {
    icon: FaTruck,
    title: "Fleet Management",
    description: "Save multiple vehicles with different specs. Calculate rates for any truck in your fleet with one click.",
    color: "slate"
  },
  {
    icon: FaFileInvoiceDollar,
    title: "Professional Quotes",
    description: "Generate branded PDF quotes you can send to shippers. Save estimates to track and compare later.",
    color: "emerald"
  }
];

const colorClasses = {
  orange: {
    bg: "bg-orange-100",
    icon: "text-orange-500",
    border: "hover:border-orange-200"
  },
  slate: {
    bg: "bg-slate-100",
    icon: "text-slate-600",
    border: "hover:border-slate-300"
  },
  emerald: {
    bg: "bg-emerald-100",
    icon: "text-emerald-600",
    border: "hover:border-emerald-200"
  }
};

export default function Features() {
  return (
    <section className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-full text-sm font-medium mb-4">
            <Target size={16} />
            <span>Precision Tools</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">
            Built for Accuracy.
            <span className="block text-orange-500">Designed for Truckers.</span>
          </h2>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Every feature exists to help you calculate rates that actually make you money. No fluff, no gimmicks — just the tools you need.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color];
            return (
              <div
                key={index}
                className={`group bg-white rounded-2xl p-8 border-2 border-slate-200 ${colors.border} hover:shadow-xl transition-all duration-300`}
              >
                <div className={`inline-flex p-4 rounded-xl ${colors.bg} mb-6`}>
                  <feature.icon size={28} className={colors.icon} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-20 bg-slate-900 rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-white">15+</p>
              <p className="text-slate-400 mt-2">Cost factors analyzed</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-orange-400">Real-time</p>
              <p className="text-slate-400 mt-2">Fuel price updates</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-white">FMCSA</p>
              <p className="text-slate-400 mt-2">Verified broker data</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-emerald-400">PDF</p>
              <p className="text-slate-400 mt-2">Export & share</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
