import React from "react";
import { Upload, Sparkles, PieChart } from "lucide-react";
import { GlassCard } from "@/components/ui/card";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Statement",
      description:
        "Drop your bank or credit card statement PDF. We support all major banks.",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "AI Analysis",
      description:
        "Our AI categorizes transactions, detects subscriptions, and finds spending patterns.",
    },
    {
      number: "03",
      icon: PieChart,
      title: "Get Insights",
      description:
        "See exactly where your money goes with clear charts and actionable recommendations.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-center text-[#1d1d1f] mb-16">
          How it works
        </h2>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <GlassCard key={step.number} padding="lg" hover={true}>
                {/* Step Number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-[#93c5fd]/20">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#93c5fd] to-[#c4b5fd] flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[#6e6e73]">{step.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

