'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { useAnalysis } from '@/lib/hooks/useAnalysis';
import { canAnalyze } from '@/lib/usage-tracking';
import { isPro } from '@/lib/pro-status';
import { SummaryHeader } from '@/components/sections/summary-header';
import { SpendingChart } from '@/components/charts/spending-chart';
import { MerchantChart } from '@/components/charts/merchant-chart';
import { InsightsGrid } from '@/components/sections/insights-grid';
import { SavingsBanner } from '@/components/sections/savings-banner';
import { MoneyLeaksSection } from '@/components/sections/money-leaks';
import { SubscriptionsList } from '@/components/sections/subscriptions-list';
import { TipsSection } from '@/components/sections/tips-section';
import { FilterBanner } from '@/components/ui/filter-banner';
import { Button } from '@/components/ui/button';
import { ProcessingScreen } from '@/components/sections/processing-screen';
import { UpgradeModal } from '@/components/ui/upgrade-modal';
import { CATEGORIES } from '@/lib/constants';
import { X } from 'lucide-react';

// Wrapper to keep page inside Suspense when using useSearchParams
export default function ResultsPage() {
  return (
    <Suspense fallback={null}>
      <ResultsPageInner />
    </Suspense>
  );
}

function ResultsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { result, clearAll } = useAnalysisContext();
  const { status, error, analyzeStatement, reset, limitReached } = useAnalysis();

  const isDemo = searchParams.get('demo') === 'true';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Get merchants for a selected category
  const getMerchantsForCategory = (categoryName: string) => {
    if (!result) return [];
    
    // Find the category ID from the label
    // categoryName is the LABEL (e.g., "Food & Dining") 
    // but transactions use the ID (e.g., "food_dining")
    const categoryInfo = CATEGORIES.find(c => c.label === categoryName);
    const categoryId = categoryInfo?.id || categoryName;
    
    // Filter transactions by category ID
    const categoryTransactions = (result as any).transactions?.filter(
      (t: any) => t.category === categoryId
    ) || [];
    
    // Group by merchant and sum amounts
    const merchantTotals = categoryTransactions.reduce((acc: Record<string, number>, t: any) => {
      const merchant = t.cleanedName || t.description;
      acc[merchant] = (acc[merchant] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);
    
    // Convert to array and sort by amount
    return Object.entries(merchantTotals)
      .map(([name, amount]) => ({ name, amount: amount as number }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Top 10
  };

  // Transform merchants into pie chart format when filtering by category
  const getMerchantsPieData = (categoryName: string) => {
    const merchants = getMerchantsForCategory(categoryName);
    const total = merchants.reduce((sum, m) => sum + m.amount, 0);
    
    // Find the category to get its base color
    const category = CATEGORIES.find(c => c.label === categoryName);
    const baseColor = category?.color || '#8b5cf6';
    
    // Generate color variations (lighter shades of the category color)
    const generateShade = (hex: string, index: number, total: number): string => {
      // Convert hex to RGB, blend with white for lighter shades
      const blend = 0.15 + (index * 0.12); // Each subsequent slice slightly lighter
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const newR = Math.round(r + (255 - r) * blend);
      const newG = Math.round(g + (255 - g) * blend);
      const newB = Math.round(b + (255 - b) * blend);
      return `rgb(${newR}, ${newG}, ${newB})`;
    };
    
    return merchants.map((merchant, index) => ({
      category: merchant.name as any, // Use merchant name as the category key
      amount: merchant.amount,
      percentage: total > 0 ? (merchant.amount / total) * 100 : 0,
      transactionCount: 1,
      merchantName: merchant.name,
      color: generateShade(baseColor, index, merchants.length),
    }));
  };

  // Get filtered top merchants for the bar chart
  const getFilteredTopMerchants = (categoryName: string) => {
    const merchants = getMerchantsForCategory(categoryName);
    const category = CATEGORIES.find(c => c.label === categoryName);
    const categoryColor = category?.color || '#8b5cf6';
    
    return merchants.map(m => ({
      name: m.name,
      amount: m.amount,
      count: 1,
      category: category?.id || 'other',
      color: categoryColor,
    }));
  };

  // Redirect to home if no results
  useEffect(() => {
    if (!result) {
      router.push('/');
    }
  }, [result, router]);

  // When analysis completes from demo, drop ?demo=true from URL
  useEffect(() => {
    if (status === 'complete' && result && isDemo) {
      router.replace('/results');
    }
  }, [status, result, isDemo, router]);

  // Show upgrade modal when limit reached or limit-related error
  useEffect(() => {
    if (limitReached || (error && (error.toLowerCase().includes('limit') || error.toLowerCase().includes('upgrade')))) {
      setShowUpgradeModal(true);
    }
  }, [error, limitReached]);

  const getStage = (): 'uploading' | 'parsing' | 'analyzing' | 'complete' => {
    switch (status) {
      case 'uploading': return 'uploading';
      case 'parsing':
      case 'categorizing': return 'parsing';
      case 'analyzing': return 'analyzing';
      case 'complete': return 'complete';
      default: return 'parsing';
    }
  };

  const handleUploadClick = () => {
    if (status !== 'idle' && status !== 'complete') return;
    if (!canAnalyze(isPro)) {
      setShowUpgradeModal(true);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await analyzeStatement(file);
    e.target.value = '';
  };

  if (!result) {
    return null; // Will redirect
  }

  // While analyzing from results page, show processing screen
  if (status !== 'idle' && status !== 'error' && status !== 'complete') {
    return <ProcessingScreen stage={getStage()} />;
  }

  const handleStartOver = () => {
    clearAll();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-[#f5f5f7] py-10 px-5">
      <div className="mx-auto max-w-6xl">
        {/* Hidden file input — always in DOM so ref is valid when buttons call click() */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Demo mode banner */}
        {isDemo && showDemoBanner && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-black/[0.06] px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="text-lg sm:text-xl">📊</span>
              <div>
                <p className="text-sm sm:text-base font-medium text-[#1d1d1f]">
                  You&apos;re viewing a sample analysis
                </p>
                <p className="mt-0.5 text-xs sm:text-sm text-[#6e6e73]">
                  This is an example month for a typical 30-year-old professional. Upload your own statement to see your real numbers.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleUploadClick}
                className="whitespace-nowrap"
                disabled={status !== 'idle' && status !== 'complete'}
              >
                Analyze your own statement →
              </Button>
              <button
                type="button"
                onClick={() => setShowDemoBanner(false)}
                className="p-1 rounded-full hover:bg-black/5 transition-colors"
                aria-label="Dismiss sample analysis banner"
              >
                <X className="w-4 h-4 text-[#86868b]" />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1d1d1f]">
            Your Spending Analysis
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6e6e73]">
            Based on {result.summary.transactionCount} transactions
          </p>
          {isDemo && (
            <p className="mt-1 text-xs sm:text-sm text-[#6e6e73]">
              Sample: January 2025 statement
            </p>
          )}
        </div>

        {/* Summary Stats */}
        <SummaryHeader summary={result.summary} />

        {/* Filter Banner - shows when category is selected */}
        {selectedCategory && (
          <div className="mt-8 mb-2">
            <FilterBanner 
              categoryName={selectedCategory} 
              onClear={() => setSelectedCategory(null)} 
            />
          </div>
        )}

        {/* Charts Row */}
        <div className={`${selectedCategory ? 'mt-4' : 'mt-8'} grid grid-cols-1 gap-5 lg:grid-cols-2`}>
          {/* Spending/Merchant Pie Chart */}
          <SpendingChart 
            data={selectedCategory ? getMerchantsPieData(selectedCategory) as any : result.categoryBreakdown} 
            totalSpent={selectedCategory 
              ? getMerchantsForCategory(selectedCategory).reduce((sum, m) => sum + m.amount, 0)
              : result.summary.totalSpent
            }
            onCategoryClick={selectedCategory ? undefined : setSelectedCategory}
            title={selectedCategory ? `Merchants in ${selectedCategory}` : 'Spending by Category'}
          />

          {/* Top Merchants Bar Chart */}
          <MerchantChart 
            data={selectedCategory ? getFilteredTopMerchants(selectedCategory) : result.topMerchants}
            title={selectedCategory ? `Top Merchants in ${selectedCategory}` : 'Top 10 Merchants'}
          />
        </div>

        {/* Savings Potential Banner */}
        {result.enhancedTips &&
          result.enhancedTips.totalAnnualSavings > 0 && (
            <div className="mt-8">
              <SavingsBanner
                totalMonthlySavings={result.enhancedTips.totalMonthlySavings}
                totalAnnualSavings={result.enhancedTips.totalAnnualSavings}
                quickWinsCount={result.enhancedTips.quickWins?.length ?? 0}
                worthTheEffortCount={result.enhancedTips.worthTheEffort?.length ?? 0}
                bigMovesCount={result.enhancedTips.bigMoves?.length ?? 0}
              />
            </div>
          )}

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
        <div
          className={`mt-8 grid grid-cols-1 gap-5 ${
            result.moneyLeaks && result.moneyLeaks.length > 0
              ? 'lg:grid-cols-3'
              : 'lg:grid-cols-2'
          }`}
        >
          {result.moneyLeaks && result.moneyLeaks.length > 0 && (
            <MoneyLeaksSection
              leaks={result.moneyLeaks}
              projectedAnnual={result.moneyLeaks.reduce(
                (sum, l) => sum + l.annualProjection,
                0
              )}
            />
          )}
          <SubscriptionsList 
            subscriptions={result.subscriptions} 
            total={result.summary.subscriptionTotal}
            subscriptionAudit={result.subscriptionAudit}
          />
          {result.tips.length > 0 && (
            <TipsSection
              tips={result.tips}
              enhancedTips={result.enhancedTips}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center no-print">
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => window.print()}
            className="no-print"
          >
            Print
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

        {/* Demo CTA card at bottom */}
        {isDemo && (
          <div className="mt-10">
            <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-black/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_20px_rgba(0,0,0,0.03)] p-6 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] mb-2">
                Ready to see your real spending?
              </h2>
              <p className="text-sm text-[#6e6e73] mb-6">
                Upload your bank statement for a personalized analysis — it usually takes less than 60 seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleUploadClick}
                  className="w-full sm:w-auto"
                  disabled={status !== 'idle' && status !== 'complete'}
                >
                  Upload My Statement
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => router.push('/#privacy')}
                  className="w-full sm:w-auto text-sm text-[#4b5563]"
                >
                  Learn about privacy
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Generated timestamp */}
        <p className="mt-8 text-center text-xs text-[#86868b]">
          Analysis generated on {new Date(result.generatedAt).toLocaleDateString()}
        </p>

        {/* Inline error when upload/analysis failed — keep demo data visible */}
        {status === 'error' && error && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center">
            <p className="text-sm text-red-800">{error}</p>
            <Button variant="secondary" size="sm" className="mt-2" onClick={() => reset()}>
              Try again
            </Button>
          </div>
        )}

        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </div>
    </main>
  );
}
