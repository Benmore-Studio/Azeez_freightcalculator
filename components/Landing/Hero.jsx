"use client";
import React from "react";
import Link from "next/link";
import { FaArrowRight, FaShieldAlt, FaChartLine, FaTruck } from "react-icons/fa";
import { TrendingUp, DollarSign, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-orange-50/30" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-100 rounded-full blur-3xl opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-6">
              <TrendingUp size={16} />
              <span>The Most Accurate Rate Estimator</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
              Know Your
              <span className="block text-orange-500">True Costs.</span>
              <span className="block">Charge What You're Worth.</span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
              Stop leaving money on the table. Our in-depth calculator factors in <strong>your actual operating costs</strong> — fuel, maintenance, insurance, and more — to give you rates that guarantee profit.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/auth/signup">
                <button className="group bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200 inline-flex items-center justify-center gap-2 w-full sm:w-auto">
                  Start Free Trial
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/auth/signin">
                <button className="border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 font-semibold px-8 py-4 text-lg rounded-xl transition-all w-full sm:w-auto">
                  Sign In
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <FaShieldAlt className="text-emerald-500" />
                Start with free trial
              </span>
              <span className="flex items-center gap-2">
                <FaChartLine className="text-emerald-500" />
                Real-time fuel prices
              </span>
              <span className="flex items-center gap-2">
                <FaTruck className="text-emerald-500" />
                Built for owner-operators
              </span>
            </div>
          </div>

          {/* Right Side - Stats/Visual */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 relative z-10">
              <div className="text-center mb-6">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Sample Rate Calculation</p>
                <p className="text-xs text-slate-400 mt-1">Dallas, TX → Atlanta, GA</p>
              </div>

              {/* Route Visual */}
              <div className="flex items-center justify-between mb-8 px-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-2">
                    <MapPin className="text-orange-500" size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Dallas</p>
                  <p className="text-xs text-slate-400">Pickup</p>
                </div>
                <div className="flex-1 mx-4 border-t-2 border-dashed border-slate-200 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-400">
                    781 mi
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                    <MapPin className="text-emerald-500" size={20} />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Atlanta</p>
                  <p className="text-xs text-slate-400">Delivery</p>
                </div>
              </div>

              {/* Rate Display */}
              <div className="bg-slate-900 rounded-xl p-6 text-center">
                <p className="text-slate-400 text-sm mb-1">Recommended Rate</p>
                <p className="text-4xl font-bold text-white">$2,046</p>
                <p className="text-emerald-400 text-sm mt-1">$2.62/mile • 28% profit margin</p>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">$412</p>
                  <p className="text-xs text-slate-500">Fuel Cost</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">13.2h</p>
                  <p className="text-xs text-slate-500">Drive Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">$573</p>
                  <p className="text-xs text-slate-500">Net Profit</p>
                </div>
              </div>
            </div>

            {/* Floating accent cards */}
            <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-20">
              +28% Profit
            </div>
            <div className="absolute -bottom-4 -left-4 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-20 flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-400" />
              Real costs factored in
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
