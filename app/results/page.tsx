'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { SummaryHeader } from '@/components/sections/summary-header';
import { SpendingChart } from '@/components/charts/spending-chart';
import { MerchantChart } from '@/components/charts/merchant-chart';
import { InsightsGrid } from '@/components/sections/insights-grid';
import { SubscriptionsList } from '@/components/sections/subscriptions-list';
import { TipsSection } from '@/components/sections/tips-section';
import { Button } from '@/components/ui/button';

export default function ResultsPage() {
  const router = useRouter();
  const { result, clearAll } = useAnalysisContext();

  // Redirect to home if no results
  useEffect(() => {
    if (!result) {
      router.push('/');
    }
  }, [result, router]);

  if (!result) {
    return null; // Will redirect
  }

  const handleStartOver = () => {
    clearAll();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] py-10 px-5">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f] md:text-4xl">
            Your Spending Analysis
          </h1>
          <p className="mt-2 text-[#6e6e73]">
            Based on {result.summary.transactionCount} transactions
          </p>
        </div>

        {/* Summary Stats */}
        <SummaryHeader summary={result.summary} />

        {/* Charts Row */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SpendingChart 
            data={result.categoryBreakdown} 
            totalSpent={result.summary.totalSpent} 
          />
          <MerchantChart data={result.topMerchants} />
        </div>

        {/* Insights */}
        {result.insights.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold text-[#1d1d1f]">
              Key Insights
            </h2>
            <InsightsGrid insights={result.insights} />
          </div>
        )}

        {/* Bottom Row */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SubscriptionsList 
            subscriptions={result.subscriptions} 
            total={result.summary.subscriptionTotal} 
          />
          {result.tips.length > 0 && (
            <TipsSection tips={result.tips} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center no-print">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.print()}
            className="no-print"
          >
            Download Report
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={handleStartOver}
            className="no-print"
          >
            Analyze Another Statement
          </Button>
        </div>

        {/* Generated timestamp */}
        <p className="mt-8 text-center text-xs text-[#86868b]">
          Analysis generated on {new Date(result.generatedAt).toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}
