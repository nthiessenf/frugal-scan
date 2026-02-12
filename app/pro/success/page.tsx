'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { isPro, setProStatus } from '@/lib/pro-status';

export default function ProSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      // Verify the session and activate Pro
      verifySession(sessionIdParam);
    } else {
      setError('No session ID found');
    }
  }, [searchParams]);

  const verifySession = async (sessionId: string) => {
    try {
      // In a real app, you'd verify the session with Stripe
      // For now, we'll activate Pro immediately (webhook will handle it properly)
      // But we can also verify here for immediate feedback
      
      // Check if user is already Pro (webhook might have activated it)
      if (isPro()) {
        setVerified(true);
        return;
      }

      // For now, activate Pro locally (webhook will handle it server-side)
      // In production, you'd verify the session with Stripe API first
      setProStatus('stripe');
      setVerified(true);
      
      // Refresh to show Pro status
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err: any) {
      console.error('[ProSuccess] Verification error:', err);
      setError('Failed to verify payment. Please contact support with your session ID.');
    }
  };

  if (error) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-red-200 shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1d1d1f] mb-2">Verification Error</h1>
            <p className="text-sm text-[#6e6e73] mb-6">{error}</p>
            {sessionId && (
              <p className="text-xs text-[#86868b] mb-6">
                Session ID: {sessionId}
              </p>
            )}
            <Link href="/pro">
              <button className="w-full py-3 rounded-xl bg-[#1d1d1f] text-white font-semibold text-sm">
                Back to Pro
              </button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!verified) {
    return (
      <main className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-black/[0.08] shadow-lg p-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-spin" />
            <p className="text-sm text-[#6e6e73]">Verifying your payment...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <div className="w-full max-w-md mx-auto px-5 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl border border-black/[0.08] shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 flex items-center justify-center">
              <Check className="w-8 h-8 text-white" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold mb-4">
              <Sparkles className="w-3 h-3" />
              PRO ACTIVATED
            </div>
            <h1 className="text-3xl font-bold text-[#1d1d1f] mb-2">
              Welcome to Pro!
            </h1>
            <p className="text-sm text-[#6e6e73] mb-6">
              Your subscription is active. You now have unlimited analyses and access to all Pro features.
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
