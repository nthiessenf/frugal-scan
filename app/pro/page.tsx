'use client';

import { useState } from 'react';
import { Check, ArrowLeft, Sparkles, Zap, TrendingUp, Target, Download } from 'lucide-react';
import Link from 'next/link';

export default function ProPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pro waitlist signup:', email);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] flex flex-col">
      {/* Back link */}
      <div className="w-full max-w-md mx-auto px-5 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-md">
          {/* Main card - more opaque */}
          <div className="bg-white rounded-3xl border border-black/[0.08] shadow-lg overflow-hidden">
            
            {/* Header - tighter spacing */}
            <div className="px-8 pt-8 pb-6 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold mb-4">
                <Sparkles className="w-3 h-3" />
                COMING SOON
              </div>
              
              <h1 className="text-3xl font-bold text-[#1d1d1f] mb-1">
                FrugalScan Pro
              </h1>
              
              <div className="mt-3 mb-5">
                <span className="text-4xl font-bold text-[#1d1d1f]">$4.99</span>
                <span className="text-[#6e6e73]">/mo</span>
                <span className="text-sm text-[#86868b] ml-2">or $39/yr</span>
              </div>

              {/* Features - more prominent */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="flex items-center gap-2 text-sm text-[#1d1d1f]">
                  <Zap className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Unlimited analyses</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#1d1d1f]">
                  <TrendingUp className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Spending trends</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#1d1d1f]">
                  <Target className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>Budget tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#1d1d1f]">
                  <Download className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>PDF export</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-black/[0.06]" />

            {/* Email form - tighter */}
            <div className="px-8 py-6">
              {submitted ? (
                <div className="text-center py-2">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="font-semibold text-[#1d1d1f]">You're on the list!</p>
                  <p className="text-sm text-[#6e6e73] mt-1">We'll email you when Pro launches.</p>
                </div>
              ) : (
                <>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-3 text-center">
                    Get notified at launch
                  </label>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-black/[0.08] bg-[#f5f5f7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 text-[#1d1d1f] text-center transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                      Notify Me
                    </button>
                  </form>
                  <p className="text-xs text-[#86868b] text-center mt-3">
                    No spam. Just one email when we launch.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



