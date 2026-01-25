'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-5 bg-[#f5f5f7]">
      <GlassCard className="max-w-md p-8 text-center" hover={false}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        
        <h1 className="text-xl font-semibold text-[#1d1d1f] mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-[#6e6e73] mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        
        <div className="flex flex-col gap-3">
          <Button variant="primary" onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = '/'} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </GlassCard>
    </main>
  );
}

