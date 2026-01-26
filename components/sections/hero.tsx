"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const handleScrollToUpload = () => {
    const uploadSection = document.getElementById("upload");
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-5">
      <div className="max-w-4xl mx-auto text-center">
        {/* Label */}
        <p className="text-xs font-semibold uppercase tracking-widest text-[#86868b] mb-4">
          PERSONAL FINANCE INSIGHTS
        </p>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-[#1d1d1f] mb-6">
          See where your money{" "}
          <span className="bg-gradient-to-r from-[#93c5fd] via-[#c4b5fd] to-[#fbcfe8] bg-clip-text text-transparent">
            really
          </span>{" "}
          goes
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-[#6e6e73] max-w-2xl mx-auto mb-10">
          Upload your bank statement and get AI-powered spending insights in 60
          seconds. No account linking. No subscriptions. Just clarity.
        </p>

        {/* CTA Button */}
        <Button size="lg" onClick={handleScrollToUpload}>
          Upload Your Statement →
        </Button>

        {/* Trust Indicators */}
        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          <p className="text-sm text-[#86868b]">🔒 Your data stays private</p>
          <p className="text-sm text-[#86868b]">⚡ Results in 60 seconds</p>
          <p className="text-sm text-[#86868b]">💳 No account linking</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-subtle">
        <span className="text-sm font-medium text-[#6e6e73]">See how it works</span>
        <svg 
          className="w-6 h-6 text-[#6e6e73]" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </div>
    </section>
  );
}

