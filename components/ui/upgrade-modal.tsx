'use client';

import { X, Zap, TrendingUp, PieChart, Download, Target, Loader2 } from 'lucide-react';
import { Button } from './button';
import Link from 'next/link';
import { isPro } from '@/lib/pro-status';
import { useEffect, useState } from 'react';
import { redirectToCheckout } from '@/lib/stripe-checkout';

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
  const [userIsPro, setUserIsPro] = useState(false);
  const [loading, setLoading] = useState<'monthly' | 'annual' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setUserIsPro(isPro());
  }, [isOpen]);

  // Don't show modal if user is already Pro
  if (!isOpen || userIsPro) return null;

  const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || '';
  const annualPriceId = process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID || '';

  const handleCheckout = async (priceId: string, type: 'monthly' | 'annual') => {
    if (!priceId) {
      setError('Payment configuration error. Please visit /pro to upgrade.');
      return;
    }

    setLoading(type);
    setError('');

    try {
      await redirectToCheckout(priceId);
    } catch (err: any) {
      setLoading(null);
      setError(err.message || 'Failed to start checkout. Please try again.');
      console.error('[UpgradeModal] Checkout error:', err);
    }
  };

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

          {/* Stripe Checkout buttons */}
          <div className="space-y-2">
            {error && (
              <div className="mb-2 p-2 rounded-lg bg-red-50 border border-red-200">
                <p className="text-[11px] text-red-600 text-center">{error}</p>
              </div>
            )}
            
            <button
              onClick={() => handleCheckout(monthlyPriceId, 'monthly')}
              disabled={loading !== null || !monthlyPriceId}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 text-white font-semibold text-sm text-center shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading === 'monthly' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Subscribe Monthly - $4.99/mo'
              )}
            </button>

            <button
              onClick={() => handleCheckout(annualPriceId, 'annual')}
              disabled={loading !== null || !annualPriceId}
              className="w-full py-3 rounded-xl bg-white border border-black/[0.08] text-[#1d1d1f] font-semibold text-sm text-center hover:bg-[#f5f5f7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading === 'annual' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Subscribe Yearly - $39/yr (Save 35%)'
              )}
            </button>

            <p className="text-[11px] text-[#86868b] text-center mt-1">
              Payments handled securely by Stripe. Pro activates automatically after payment.
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
