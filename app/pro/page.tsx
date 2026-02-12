'use client';

import { useState, useEffect } from 'react';
import { Check, ArrowLeft, Sparkles, Zap, TrendingUp, Target, Download } from 'lucide-react';
import Link from 'next/link';
import { isPro, activateProWithCode, setProStatus } from '@/lib/pro-status';
import { useRouter } from 'next/navigation';

export default function ProPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [proCode, setProCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [userIsPro, setUserIsPro] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUserIsPro(isPro());
  }, []);

  const monthlyLink = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_LINK || '#';
  const annualLink = process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_LINK || '#';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Pro waitlist signup:', email);
    setSubmitted(true);
  };

  const handleProCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError('');
    setCodeSuccess(false);

    if (activateProWithCode(proCode)) {
      setCodeSuccess(true);
      setUserIsPro(true);
      setProCode('');
      // Refresh page to show Pro status
      setTimeout(() => router.refresh(), 500);
    } else {
      setCodeError('Invalid code. Check your email for your Pro activation code.');
    }
  };

  // If user is already Pro, show success state
  if (userIsPro) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] flex flex-col">
        <div className="w-full max-w-md mx-auto px-5 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl border border-black/[0.08] shadow-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#1d1d1f] mb-2">You're Pro!</h1>
              <p className="text-sm text-[#6e6e73] mb-6">
                Enjoy unlimited analyses and all Pro features.
              </p>
              <Link href="/">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all">
                  Start Analyzing
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
                EARLY ACCESS
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

            {/* Email form + Stripe payment links */}
            <div className="px-8 py-6 space-y-5">
              {/* Stripe payment actions */}
              <div>
                <p className="text-sm font-medium text-[#1d1d1f] mb-3 text-center">
                  Ready to upgrade?
                </p>
                <div className="space-y-2">
                  <a
                    href={monthlyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-3 rounded-xl bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200 text-white font-semibold text-sm text-center shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                  >
                    Pay Monthly with Stripe
                  </a>
                  <a
                    href={annualLink}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full py-3 rounded-xl bg-white border border-black/[0.08] text-[#1d1d1f] font-semibold text-sm text-center hover:bg-[#f5f5f7] transition-colors"
                  >
                    Pay Yearly (Save 35%)
                  </a>
                  <p className="text-xs text-[#86868b] text-center mt-2">
                    Payments are processed securely by Stripe. We’ll manually enable Pro access for early customers.
                  </p>
                </div>
              </div>

              {/* Pro activation code (for manual activation after payment) */}
              <div className="border-t border-black/[0.06] pt-5">
                <label className="block text-sm font-medium text-[#1d1d1f] mb-3 text-center">
                  Already paid? Enter your Pro code
                </label>
                {codeSuccess ? (
                  <div className="text-center py-2">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="font-semibold text-[#1d1d1f]">Pro activated!</p>
                    <p className="text-sm text-[#6e6e73] mt-1">
                      You now have unlimited analyses.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleProCodeSubmit} className="space-y-3">
                    <input
                      type="text"
                      value={proCode}
                      onChange={(e) => {
                        setProCode(e.target.value);
                        setCodeError('');
                      }}
                      placeholder="Enter Pro code"
                      className="w-full px-4 py-3 rounded-xl border border-black/[0.08] bg-[#f5f5f7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 text-[#1d1d1f] text-center transition-colors uppercase"
                    />
                    {codeError && (
                      <p className="text-xs text-red-600 text-center">{codeError}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#1d1d1f] text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                      Activate Pro
                    </button>
                  </form>
                )}
                <p className="text-xs text-[#86868b] text-center mt-3">
                  Check your email after payment for your activation code.
                </p>
              </div>

              {/* Email capture for manual verification / updates */}
              <div className="border-t border-black/[0.06] pt-5">
                {submitted ? (
                  <div className="text-center py-2">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="font-semibold text-[#1d1d1f]">You're on the list!</p>
                    <p className="text-sm text-[#6e6e73] mt-1">
                      We'll email you when Pro launches.
                    </p>
                  </div>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-[#1d1d1f] mb-3 text-center">
                      Get notified about Pro updates
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
                        className="w-full py-3 rounded-xl bg-[#1d1d1f] text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                      >
                        Save Email
                      </button>
                    </form>
                    <p className="text-xs text-[#86868b] text-center mt-3">
                      No spam. We'll only contact you about Pro updates.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



