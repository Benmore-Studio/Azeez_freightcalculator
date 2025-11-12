"use client";
import React from "react";
import { Card } from "@/components/ui";
import { FaBolt, FaTruck, FaChartLine, FaDollarSign, FaMobile, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    icon: FaBolt,
    title: "Instant Calculations",
    description: "Get freight rate estimates in seconds, not hours. Make quick decisions on the road.",
    color: "text-blue-600"
  },
  {
    icon: FaTruck,
    title: "Vehicle Management",
    description: "Save your vehicle details and instantly calculate rates for each truck in your fleet.",
    color: "text-blue-600"
  },
  {
    icon: FaChartLine,
    title: "Profit Tracking",
    description: "See your actual profit margins on every load. Know which routes make you money.",
    color: "text-green-600"
  },
  {
    icon: FaDollarSign,
    title: "Accurate Costs",
    description: "Input your real operating costs for personalized rate calculations, not generic estimates.",
    color: "text-green-600"
  },
  {
    icon: FaMobile,
    title: "Mobile Friendly",
    description: "Calculate rates on your phone, tablet, or desktop. Works everywhere you do.",
    color: "text-blue-600"
  },
  {
    icon: FaShieldAlt,
    title: "Secure & Private",
    description: "Your data is encrypted and secure. We never share your information with brokers.",
    color: "text-blue-600"
  }
];

export default function Features() {
  return (
    <section className="py-16 sm:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            Everything You Need to Price Loads Right
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Built by truckers, for truckers. No fluff, just the tools you need to run a profitable operation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-200 border-2 border-transparent"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 ${feature.color}`}>
                  <feature.icon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
