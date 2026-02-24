"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onTryDemo?: () => void;
  isDemoLoading?: boolean;
}

export function Hero({ onTryDemo, isDemoLoading }: HeroProps) {
  const handleScrollToUpload = () => {
    const uploadSection = document.getElementById("upload");
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-0 flex items-center justify-center pt-24 md:pt-32 pb-12 md:pb-16 px-5">
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
        <p className="text-lg md:text-xl text-[#6e6e73] max-w-2xl mx-auto mb-8">
          Upload your bank statement and get AI-powered spending insights in 60
          seconds. No account linking. No subscriptions. Just clarity.
        </p>

        {/* Two CTAs: primary + secondary */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          <Button
            size="lg"
            onClick={handleScrollToUpload}
            className="w-full sm:w-auto"
          >
            Upload Your Statement →
          </Button>
          {onTryDemo && (
            <button
              type="button"
              onClick={onTryDemo}
              disabled={isDemoLoading}
              className="w-full sm:w-auto rounded-xl font-semibold text-base px-8 py-4 border border-[#d1d1d6] bg-transparent text-[#1d1d1f] hover:bg-black/[0.04] hover:border-[#a1a1a6] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            >
              See Sample Analysis →
            </button>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          <p className="text-sm text-[#86868b]">🔒 Your data stays private</p>
          <p className="text-sm text-[#86868b]">⚡ Results in 60 seconds</p>
          <p className="text-sm text-[#86868b]">💳 No account linking</p>
        </div>
      </div>
    </section>
  );
}

