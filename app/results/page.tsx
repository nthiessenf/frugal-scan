'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisContext } from '@/contexts/AnalysisContext';
import { SummaryHeader } from '@/components/sections/summary-header';
import { SpendingChart } from '@/components/charts/spending-chart';
import { MerchantChart } from '@/components/charts/merchant-chart';
import { InsightsGrid } from '@/components/sections/insights-grid';
import { SubscriptionsList } from '@/components/sections/subscriptions-list';
import { TipsSection } from '@/components/sections/tips-section';
import { FilterBanner } from '@/components/ui/filter-banner';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/constants';

export default function ResultsPage() {
  const router = useRouter();
  const { result, clearAll } = useAnalysisContext();

  // DEBUG: Log what's in result
  useEffect(() => {
    if (result) {
      console.log('=== RESULT DEBUG ===');
      console.log('result keys:', Object.keys(result));
      console.log('result.transactions:', (result as any).transactions);
      console.log('result.transactions length:', (result as any).transactions?.length);
      console.log('result.categoryBreakdown:', result.categoryBreakdown);
      console.log('====================');
    }
  }, [result]);

  // Category drill-down state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get merchants for a selected category
  const getMerchantsForCategory = (categoryName: string) => {
    if (!result) return [];
    
    // DEBUG: Log what we're looking for
    console.log('=== FILTER DEBUG ===');
    console.log('Looking for category label:', categoryName);
    
    // Find the category ID from the label
    const categoryInfo = CATEGORIES.find(c => c.label === categoryName);
    console.log('Found category info:', categoryInfo);
    
    const categoryId = categoryInfo?.id || categoryName;
    console.log('Using category ID:', categoryId);
    
    // DEBUG: Log what categories exist in transactions
    const uniqueCategories = [...new Set((result as any).transactions?.map((t: any) => t.category) || [])];
    console.log('Categories in transactions:', uniqueCategories);
    
    // Filter transactions by category ID
    const categoryTransactions = (result as any).transactions?.filter(
      (t: any) => t.category === categoryId
    ) || [];
    console.log('Matching transactions found:', categoryTransactions.length);
    console.log('===================');
    
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
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1d1d1f]">
            Your Spending Analysis
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#6e6e73]">
            Based on {result.summary.transactionCount} transactions
          </p>
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
