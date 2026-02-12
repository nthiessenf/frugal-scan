'use client';

import { X, Zap, TrendingUp, PieChart, Download, Target } from 'lucide-react';
import { Button } from './button';
import Link from 'next/link';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRO_FEATURES = [
  { icon: Zap, text: 'Unlimited statement analyses' },
  { icon: PieChart, text: 'Deep merchant drill-downs' },
  { icon: TrendingUp, text: 'Month-over-month trends' },
  { icon: Target, text: 'Budget tracking & alerts' },
  { icon: Download, text: 'Export reports to PDF' },
];

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  const monthlyLink = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_LINK || '/pro';
  const annualLink = process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_LINK || '/pro';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors z-10"
        >
          <X className="w-5 h-5 text-[#86868b]" />
        </button>
        
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-8 pt-10 pb-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex items-center justify-center shadow-lg">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1d1d1f] mb-2">
            You've used your 3 free analyses
          </h2>
          <p className="text-[#6e6e73]">
            Upgrade to Pro for unlimited insights
          </p>
        </div>
        
        {/* Features */}
        <div className="px-8 py-6">
          <ul className="space-y-3">
            {PRO_FEATURES.map((feature) => (
              <li key={feature.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4 text-purple-500" />
                </div>
                <span className="text-sm text-[#1d1d1f]">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Pricing + CTA */}
        <div className="px-8 pb-8">
          <div className="text-center mb-4">
            <span className="text-3xl font-bold text-[#1d1d1f]">$4.99</span>
            <span className="text-[#6e6e73]">/month</span>
            <p className="text-xs text-[#86868b] mt-1">or $39/year (save 35%)</p>
          </div>

          {/* Primary Stripe Payment Links */}
          <div className="space-y-2">
            <Link
              href={monthlyLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button variant="primary" className="w-full justify-center">
                Pay Monthly with Stripe
              </Button>
            </Link>

            <Link
              href={annualLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="secondary"
                className="w-full justify-center text-xs sm:text-sm"
              >
                Pay Yearly (Save 35%)
              </Button>
            </Link>

            <p className="text-[11px] text-[#86868b] text-center mt-1">
              Payments handled securely by Stripe. We’ll manually enable Pro for early customers.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full mt-3 py-2 text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
