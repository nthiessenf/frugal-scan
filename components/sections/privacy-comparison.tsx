'use client';

import { Check, AlertCircle, Lock } from 'lucide-react';
import { useInView } from '@/lib/hooks/useInView';

const ROWS: { feature: string; frugalScan: string; traditional: string; frugalPositive?: boolean }[] = [
  {
    feature: 'Bank login required',
    frugalScan: 'No',
    traditional: 'Yes',
    frugalPositive: true,
  },
  {
    feature: 'Data stored on servers',
    frugalScan: 'Never',
    traditional: 'Always',
    frugalPositive: true,
  },
  {
    feature: 'Works offline after upload',
    frugalScan: 'Yes',
    traditional: 'No',
    frugalPositive: true,
  },
  {
    feature: 'Third-party data sharing',
    frugalScan: 'None',
    traditional: 'Common',
    frugalPositive: true,
  },
  {
    feature: 'Time to first insight',
    frugalScan: '60 seconds',
    traditional: 'Days (after linking)',
    frugalPositive: true,
  },
  {
    feature: 'Cancel anytime, data gone',
    frugalScan: 'Nothing to delete',
    traditional: 'Request deletion',
    frugalPositive: true,
  },
];

export function PrivacyComparison() {
  const { ref, isVisible } = useInView(0.15);

  return (
    <section id="privacy" className="w-full py-16 md:py-24 px-5">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto scroll-reveal ${isVisible ? 'scroll-reveal-visible' : ''}`}
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-center text-[#1d1d1f] mb-3">
          Your finances, your privacy
        </h2>
        <p className="text-center text-[#6e6e73] text-lg mb-12">
          Most budgeting apps need your bank login. We don&apos;t.
        </p>

        {/* Card-based comparison — desktop: table-like grid; mobile: stacked cards */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Header row — same grid as data for alignment */}
          <div className="grid grid-cols-2 sm:grid-cols-3 border-b border-black/[0.08]">
            <div className="col-span-2 sm:col-span-1 px-4 sm:px-5 py-3 sm:py-4 bg-black/[0.03]">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#6e6e73]">
                Feature
              </span>
            </div>
            <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-[#93c5fd] via-[#c4b5fd] to-[#fbcfe8] text-white shadow-md">
              <span className="text-xs sm:text-sm font-semibold">FrugalScan</span>
            </div>
            <div className="px-4 sm:px-5 py-3 sm:py-4 bg-[#e5e5e7]">
              <span className="text-xs sm:text-sm font-semibold text-[#1d1d1f]">Traditional Apps</span>
            </div>
          </div>

          {/* Data rows — wrapper so stagger-row nth-child targets rows only */}
          <div>
            {ROWS.map((row, index) => (
              <div
                key={row.feature}
                className={`stagger-row grid grid-cols-2 sm:grid-cols-3 border-b border-black/[0.06] last:border-b-0 ${
                  index % 2 === 0 ? 'bg-white/50' : 'bg-black/[0.02]'
                }`}
              >
                <div className="col-span-2 sm:col-span-1 px-4 sm:px-5 py-3 sm:py-4 flex items-center">
                  <span className="text-sm font-medium text-[#1d1d1f]">{row.feature}</span>
                </div>
                <div className="px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
                  {row.frugalPositive !== false && (
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" aria-hidden />
                  )}
                  <span className="text-sm text-[#1d1d1f] font-medium">{row.frugalScan}</span>
                </div>
                <div className="px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden />
                  <span className="text-sm text-[#6e6e73]">{row.traditional}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reassurance below table */}
      <div className="max-w-4xl mx-auto mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left">
        <Lock className="w-4 h-4 text-[#86868b] flex-shrink-0" aria-hidden />
        <p className="text-sm text-[#6e6e73]">
          FrugalScan processes your statement in your browser session. When you close the tab, your
          data is gone.
        </p>
      </div>
    </section>
  );
}
