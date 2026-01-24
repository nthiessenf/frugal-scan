'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '@/types';
import { SummaryHeader } from '@/components/sections/summary-header';
import { SpendingChart } from '@/components/charts/spending-chart';
import { MerchantChart } from '@/components/charts/merchant-chart';
import { InsightsGrid } from '@/components/sections/insights-grid';
import { SubscriptionsList } from '@/components/sections/subscriptions-list';
import { TipsSection } from '@/components/sections/tips-section';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';

// Mock data for testing - will be replaced with real data in Session 8
const MOCK_DATA: AnalysisResult = {
  summary: {
    totalSpent: 16955.32,
    totalIncome: 19176.84,
    netCashFlow: 2221.52,
    transactionCount: 75,
    averageTransaction: 226.07,
    topCategory: 'shopping',
    topCategoryAmount: 5420.50,
    subscriptionTotal: 234.26,
    periodDays: 31,
  },
  categoryBreakdown: [
    { category: 'shopping', amount: 5420.50, percentage: 31.97, transactionCount: 28 },
    { category: 'bills_utilities', amount: 3850.75, percentage: 22.71, transactionCount: 8 },
    { category: 'food_dining', amount: 2340.20, percentage: 13.80, transactionCount: 15 },
    { category: 'transportation', amount: 1890.45, percentage: 11.15, transactionCount: 12 },
    { category: 'subscriptions', amount: 1245.80, percentage: 7.35, transactionCount: 18 },
    { category: 'health_fitness', amount: 890.30, percentage: 5.25, transactionCount: 5 },
    { category: 'entertainment', amount: 650.00, percentage: 3.83, transactionCount: 4 },
    { category: 'other', amount: 667.32, percentage: 3.94, transactionCount: 5 },
  ],
  topMerchants: [
    { name: 'Amazon', amount: 2450.80, count: 18, category: 'shopping' },
    { name: 'American Express', amount: 1315.99, count: 1, category: 'bills_utilities' },
    { name: 'Costco', amount: 890.50, count: 4, category: 'groceries' },
    { name: 'Tesla', amount: 650.25, count: 3, category: 'transportation' },
    { name: 'Spectrum', amount: 187.34, count: 2, category: 'bills_utilities' },
    { name: 'Spotify', amount: 25.96, count: 2, category: 'subscriptions' },
    { name: 'OpenAI', amount: 42.56, count: 2, category: 'subscriptions' },
    { name: 'Apple', amount: 156.80, count: 5, category: 'subscriptions' },
  ],
  subscriptions: [
    { name: 'Spotify', amount: 12.98, frequency: 'monthly', lastCharge: '2025-12-22', category: 'streaming', confidence: 0.9 },
    { name: 'OpenAI', amount: 21.28, frequency: 'monthly', lastCharge: '2025-12-05', category: 'software', confidence: 0.9 },
    { name: 'Netflix', amount: 15.99, frequency: 'monthly', lastCharge: '2025-12-15', category: 'streaming', confidence: 0.9 },
    { name: 'iCloud', amount: 2.99, frequency: 'monthly', lastCharge: '2025-12-25', category: 'software', confidence: 0.9 },
    { name: 'Ridepanda', amount: 107.17, frequency: 'monthly', lastCharge: '2025-12-28', category: 'other', confidence: 0.85 },
  ],
  insights: [
    {
      id: 'insight-1',
      title: 'Strong Positive Cash Flow',
      description: 'You earned $2,221.52 more than you spent this month. This is a healthy 11.6% savings rate - keep it up!',
      severity: 'positive',
      amount: 2221.52,
    },
    {
      id: 'insight-2',
      title: 'Shopping is Your Top Category',
      description: 'At 32% of spending ($5,420.50), shopping is your largest expense. Amazon alone accounts for $2,450.80 across 18 transactions.',
      severity: 'info',
      category: 'shopping',
      amount: 5420.50,
    },
    {
      id: 'insight-3',
      title: 'Subscription Stack Growing',
      description: 'You have 5 active subscriptions totaling $234.26/month ($2,811/year). Consider reviewing which ones you actively use.',
      severity: 'warning',
      category: 'subscriptions',
      amount: 234.26,
    },
    {
      id: 'insight-4',
      title: 'Consistent Bill Payments',
      description: 'Your utilities and bills are paid consistently and on time. Spectrum and other recurring bills show no missed payments.',
      severity: 'positive',
      category: 'bills_utilities',
    },
    {
      id: 'insight-5',
      title: 'Transportation Costs Reasonable',
      description: 'At $1,890.45 (11% of spending), your transportation costs including Tesla charging are well-managed for the Austin area.',
      severity: 'info',
      category: 'transportation',
      amount: 1890.45,
    },
  ],
  tips: [
    {
      id: 'tip-1',
      title: 'Review Amazon Purchases Weekly',
      description: 'With 18 Amazon transactions this month, setting a weekly review reminder could help identify impulse purchases before they add up.',
      potentialSavings: 150,
      difficulty: 'easy',
      timeframe: 'immediate',
    },
    {
      id: 'tip-2',
      title: 'Audit Your 5 Subscriptions',
      description: 'At $234/month, review each subscription for active usage. Canceling just 2 unused services could save $50-100 monthly.',
      potentialSavings: 75,
      difficulty: 'easy',
      timeframe: 'monthly',
    },
    {
      id: 'tip-3',
      title: 'Maximize Costco Membership',
      description: 'You\'re spending $890 at Costco - great for bulk savings. Consider their gas stations and pharmacy for additional value.',
      potentialSavings: 40,
      difficulty: 'medium',
      timeframe: 'monthly',
    },
  ],
  generatedAt: new Date().toISOString(),
};

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, use mock data. In Session 8, we'll get real data from context.
    // Simulate loading
    const timer = setTimeout(() => {
      setData(MOCK_DATA);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-[#c4b5fd] animate-spin mx-auto" />
          <p className="mt-4 text-[#6e6e73]">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6e6e73]">No analysis data found.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-[#93c5fd] via-[#c4b5fd] to-[#fbcfe8] text-white font-semibold text-sm hover:scale-105 transition-transform"
          >
            Upload a Statement
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-black/[0.08] text-[#6e6e73] hover:bg-white/80 transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#93c5fd] via-[#c4b5fd] to-[#fbcfe8] text-white font-semibold text-sm hover:scale-105 transition-transform shadow-lg shadow-purple-300/20"
            >
              New Analysis
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] tracking-[-0.02em]">
            Your Spending Analysis
          </h1>
          <p className="text-[#6e6e73] mt-2">
            {data.summary.periodDays} days · {data.summary.transactionCount} transactions
          </p>
        </div>

        {/* Summary Stats */}
        <section className="mb-8">
          <SummaryHeader summary={data.summary} />
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SpendingChart 
            data={data.categoryBreakdown} 
            totalSpent={data.summary.totalSpent} 
          />
          <MerchantChart data={data.topMerchants} />
        </section>

        {/* Insights */}
        <section className="mb-8">
          <InsightsGrid insights={data.insights} />
        </section>

        {/* Subscriptions & Tips Row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SubscriptionsList 
            subscriptions={data.subscriptions} 
            total={data.summary.subscriptionTotal} 
          />
          <TipsSection tips={data.tips} />
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-black/[0.05]">
          <p className="text-xs text-[#86868b]">
            Analysis generated {new Date(data.generatedAt).toLocaleDateString()} · 
            Your data is processed securely and never stored
          </p>
        </footer>
      </div>
    </main>
  );
}

