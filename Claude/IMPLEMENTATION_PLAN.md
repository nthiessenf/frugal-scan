# FrugalScan - Implementation Plan

**Purpose:** Step-by-step Cursor prompts for building FrugalScan
**How to use:** Complete sessions in order. Copy each prompt directly into Cursor.

**Updated:** February 12, 2026

---

## Progress Summary

### MVP (v1.0) - ✅ COMPLETE

| Session | Task | Status |
|---------|------|--------|
| 1 | Project Scaffolding | ✅ Complete |
| 2 | Core UI Components | ✅ Complete |
| 3 | Landing Page | ✅ Complete |
| 4 | PDF Parsing with Claude | ✅ Complete |
| 5 | Transaction Categorization | ✅ Complete |
| 6 | Claude Insights Generation | ✅ Complete |
| 7 | Results Dashboard | ✅ Complete |
| 8 | Connect Everything | ✅ Complete |
| 9 | Polish & Deploy | ✅ Complete |

**🚀 Live at [frugalscan.com](https://frugalscan.com)**

### Version 1.1 - Quick Wins + Monetization Foundation ✅ COMPLETE

| Session | Task | Status | Time Est. |
|---------|------|--------|-----------|
| 10 | Category Drill-Down + Mock Data + Haiku Migration | ✅ Complete | 4-5 hrs |
| 11 | Better AI Insights | ✅ Complete | 3-4 hrs |
| 12 | Usage Tracking + Free Tier Limits | ✅ Complete | 2-3 hrs |
| 13 | Upgrade Modal + Pro Teaser Page | ✅ Complete | 2-3 hrs |

### Version 1.2 - Payments + Pro Tier Launch (8-10 hours)
*Theme: Start making money*

| Session | Task | Status | Time Est. |
|---------|------|--------|-----------|
| 14 | Stripe Payment Links (Manual MVP) | 📋 Next | 2-3 hrs |
| 15 | Pro Tier State Management | 📋 Planned | 2-3 hrs |
| 16 | Stripe Checkout Integration | 📋 Planned | 4-5 hrs |

### Version 1.3 - Pro Features / Stickiness (14-18 hours)
*Theme: Features that make Pro worth keeping*

| Session | Task | Status | Time Est. |
|---------|------|--------|-----------|
| 17 | Budget Goals - Set & Track Spending Limits (Pro-only) | 📋 Planned | 4-6 hrs |
| 18 | Multi-Statement Trends - Month-over-Month (Pro-only) | 📋 Planned | 6-8 hrs |
| 19 | Transaction Editing - Let Users Correct Categorization | 📋 Planned | 3-4 hrs |
| 20 | PDF Export (Pro-only) | 📋 Planned | 2-3 hrs |

### Version 1.4 - Performance + Compatibility (8-12 hours)
*Theme: Faster, works with more banks*

| Session | Task | Status | Time Est. |
|---------|------|--------|-----------|
| 21 | Faster Processing - Optimize for <30s Analysis | 📋 Planned | 4-6 hrs |
| 22 | More Banks - Test & Optimize for More Formats | 📋 Planned | 4-6 hrs |

### Version 2.0 - Platform + Power Tier (20+ hours)
*Theme: Database-backed features, user accounts, scale*

| Session | Task | Status | Time Est. |
|---------|------|--------|-----------|
| 23 | Supabase Integration + User Accounts (Auth) | 📋 Planned | 8-10 hrs |
| 24 | History & Saved Analyses (Supabase-backed) | 📋 Planned | 4-6 hrs |
| 25 | Multi-Account Consolidation (Power-only) | 📋 Planned | 8-10 hrs |
| 26 | Power Tier Launch ($9.99/mo) | 📋 Planned | 4-6 hrs |

---

## Feature Roadmap Summary

All planned features mapped to their version:

| # | Feature | Version | Status |
|---|---------|---------|--------|
| 1 | **Payments** - Stripe for payment processing | v1.2 | 📋 Next |
| 2 | **Budget Goals** - Set and track spending limits | v1.3 | 📋 Planned |
| 3 | **Multi-Statement Trends** - Compare month over month | v1.3 | 📋 Planned |
| 4 | **Transaction Editing** - Let users correct categorization | v1.3 | 📋 Planned |
| 5 | **Faster Processing** - Optimize for <30 second analysis | v1.4 | 📋 Planned |
| 6 | **More Banks** - Test and optimize for more formats | v1.4 | 📋 Planned |
| 7 | **User Accounts** - Supabase Auth for saving history | v2.0 | 📋 Planned |

---

## Monetization Strategy

### Pricing Tiers

**Free Tier:**
- 3 statement analyses per month
- Basic category breakdown
- Top 10 merchants chart
- 3 AI insights

**Pro Tier ($4.99/month or $39/year):**
- Unlimited analyses
- 5 AI insights (instead of 3)
- Merchant drill-down by category
- Budget tracking & alerts
- Month-over-month trends
- PDF export

**Power Tier ($9.99/month) - Future:**
- Everything in Pro
- Multi-account consolidation
- Household sharing
- Priority support

### Revenue Math
- API cost per analysis: ~$0.07
- Free user (3 analyses): $0.21/month cost
- Pro user (10 analyses avg): $0.70/month cost
- Pro gross margin: ~86%

---

## Roadmap Rationale

**Why monetization in v1.1?**
Revenue infrastructure should come before more features. Every feature from now on should either drive upgrades or retain paying users.

**Why manual payments first (v1.2)?**
Validates willingness to pay with zero code. Manual process works for first 10-50 customers while automation is built.

**Why Pro features in v1.3 (not v1.2)?**
Ship payment capability first, then build features that justify the subscription. Proves people will pay before investing in retention features.

---

## Session 10: Merchants by Category Drill-Down ✅ COMPLETE

**Goal:** Click a category in the pie chart → see top merchants in that category

**Time estimate:** 2-3 hours  
**Actual time:** ~4-5 hours (expanded to include mock data system, Haiku migration, loading UX overhaul)

**Prerequisites:** Session 9 complete (MVP deployed)

**Note:** Session 10 expanded beyond the original scope to include:
- Mock data system for instant dev testing
- Claude Haiku migration (60% faster parsing)
- Multi-mode animated loading screen
- Production bug fixes

**New skills you'll learn:**
- React state for view switching
- Click handlers on Recharts
- Conditional rendering
- Filtering data arrays

### Prompt 1: Add Category Selection State

```
We're adding a drill-down feature: clicking a pie chart category shows merchants in that category.

First, add state management for the selected category in app/results/page.tsx:

1. Add state at the top of the component (after useAnalysis hook):

const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

2. Add a function to get merchants for the selected category:

const getMerchantsForCategory = (categoryName: string) => {
  // Filter transactions by category
  const categoryTransactions = result.transactions.filter(
    t => t.category === categoryName
  );
  
  // Group by merchant and sum amounts
  const merchantTotals = categoryTransactions.reduce((acc, t) => {
    const merchant = t.cleanedName || t.description;
    acc[merchant] = (acc[merchant] || 0) + Math.abs(t.amount);
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to array and sort by amount
  return Object.entries(merchantTotals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10); // Top 10
};

3. Add the import for useState at the top:

import { useState } from 'react';
```

### Prompt 2: Make Pie Chart Clickable

```
Update the spending chart to handle click events.

1. Modify components/charts/spending-chart.tsx to accept an onCategoryClick prop:

Add to the interface:
interface SpendingChartProps {
  data: CategoryBreakdown[];
  onCategoryClick?: (categoryName: string) => void;
}

2. Add click handler to the Pie component:

<Pie
  data={data}
  cx="50%"
  cy="50%"
  innerRadius={60}
  outerRadius={100}
  paddingAngle={2}
  dataKey="amount"
  onClick={(data) => onCategoryClick?.(data.name)}
  style={{ cursor: onCategoryClick ? 'pointer' : 'default' }}
>

3. Also make the legend items clickable. Update the legend section:

{data.map((category) => (
  <div 
    key={category.name} 
    className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
    onClick={() => onCategoryClick?.(category.name)}
  >
    <div 
      className="w-3 h-3 rounded-full" 
      style={{ backgroundColor: category.color }}
    />
    <span className="text-[#6e6e73] truncate">{category.name}</span>
  </div>
))}
```

### Prompt 3: Create Category Detail View

```
Create a new component to show merchants within a selected category.

Create components/sections/category-detail.tsx:

'use client';

import { ArrowLeft } from 'lucide-react';
import { GlassCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/constants';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface MerchantData {
  name: string;
  amount: number;
}

interface CategoryDetailProps {
  categoryName: string;
  merchants: MerchantData[];
  totalAmount: number;
  onBack: () => void;
}

export function CategoryDetail({ categoryName, merchants, totalAmount, onBack }: CategoryDetailProps) {
  // Get category color
  const category = CATEGORIES.find(c => c.name === categoryName);
  const categoryColor = category?.color || '#8b5cf6';
  
  return (
    <GlassCard className="p-6" hover={false}>
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="p-2 h-auto"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h3 className="text-xl font-semibold text-[#1d1d1f]">
            {categoryName}
          </h3>
          <p className="text-sm text-[#6e6e73]">
            ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} total • {merchants.length} merchants
          </p>
        </div>
      </div>
      
      {/* Bar chart of merchants in this category */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={merchants}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis 
              type="number" 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              tick={{ fill: '#6e6e73', fontSize: 12 }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: '#1d1d1f', fontSize: 12 }}
              width={95}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.95)', 
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
              {merchants.map((_, index) => (
                <Cell key={`cell-${index}`} fill={categoryColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* List view for additional detail */}
      <div className="mt-6 space-y-2">
        {merchants.map((merchant, index) => (
          <div 
            key={merchant.name}
            className="flex items-center justify-between py-2 border-b border-black/5 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#86868b] w-6">{index + 1}.</span>
              <span className="text-sm text-[#1d1d1f]">{merchant.name}</span>
            </div>
            <span className="text-sm font-medium text-[#1d1d1f]">
              ${merchant.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
```

### Prompt 4: Integrate Category Detail into Results Page

```
Connect the category detail view to the results page.

Update app/results/page.tsx:

1. Import the new component at the top:

import { CategoryDetail } from '@/components/sections/category-detail';

2. Find the section where SpendingChart is rendered and wrap it with conditional rendering:

Replace the SpendingChart GlassCard with:

{/* Spending by Category - with drill-down */}
{selectedCategory ? (
  <CategoryDetail
    categoryName={selectedCategory}
    merchants={getMerchantsForCategory(selectedCategory)}
    totalAmount={
      result.categoryBreakdown.find(c => c.name === selectedCategory)?.amount || 0
    }
    onBack={() => setSelectedCategory(null)}
  />
) : (
  <GlassCard className="p-6" hover={false}>
    <h3 className="text-lg font-semibold text-[#1d1d1f] mb-4">
      Spending by Category
    </h3>
    <p className="text-xs text-[#86868b] mb-4">
      Click a category to see top merchants
    </p>
    <SpendingChart 
      data={result.categoryBreakdown} 
      onCategoryClick={setSelectedCategory}
    />
  </GlassCard>
)}

3. Make sure the helper function getMerchantsForCategory is defined before the return statement.
```

### How to Test Session 10

1. Run `npm run dev`
2. Upload a bank statement
3. On results page, click a pie chart segment (e.g., "Dining Out")
4. Should see:
   - Back arrow button
   - Category name and total
   - Bar chart showing top merchants in that category (all same color)
   - List view below with merchant details
5. Click back arrow → returns to full pie chart view
6. Test clicking legend items (should also drill down)

---

## Session 11: Color-Coded Bar Chart by Category

**Goal:** Each bar in "Top Merchants" matches its category color from the pie chart

**Time estimate:** 1-2 hours

**Prerequisites:** Session 10 complete

**New skills you'll learn:**
- Data transformation (adding category info to merchant data)
- Dynamic color assignment

### Prompt 1: Update Merchant Chart Colors

```
Update the merchant bar chart to color each bar by its category.

1. First, update the TopMerchant type in types/index.ts to include category info:

export interface TopMerchant {
  name: string;
  amount: number;
  category?: string;
  color?: string;
}

2. Update lib/analysis.ts getTopMerchants function to include category:

export function getTopMerchants(
  transactions: CategorizedTransaction[],
  limit: number = 10
): TopMerchant[] {
  const merchantTotals: Record<string, { amount: number; category: string }> = {};

  transactions.forEach((t) => {
    const merchant = t.cleanedName || t.description;
    if (!merchantTotals[merchant]) {
      merchantTotals[merchant] = { amount: 0, category: t.category };
    }
    merchantTotals[merchant].amount += Math.abs(t.amount);
  });

  return Object.entries(merchantTotals)
    .map(([name, data]) => {
      const categoryInfo = CATEGORIES.find(c => c.name === data.category);
      return {
        name,
        amount: data.amount,
        category: data.category,
        color: categoryInfo?.color || '#8b5cf6',
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

3. Make sure to import CATEGORIES at the top of lib/analysis.ts:

import { CATEGORIES } from './constants';
```

### Prompt 2: Update Merchant Chart Component

```
Update components/charts/merchant-chart.tsx to use category colors:

'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { TopMerchant } from '@/types';

interface MerchantChartProps {
  data: TopMerchant[];
}

export function MerchantChart({ data }: MerchantChartProps) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <XAxis 
            type="number" 
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            tick={{ fill: '#6e6e73', fontSize: 12 }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fill: '#1d1d1f', fontSize: 12 }}
            width={95}
          />
          <Tooltip 
            formatter={(value: number, name: string, props: any) => [
              `$${value.toFixed(2)}`,
              props.payload.category || 'Spent'
            ]}
            contentStyle={{ 
              backgroundColor: 'rgba(255,255,255,0.95)', 
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
            {data.map((merchant, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={merchant.color || '#8b5cf6'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend showing category colors */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {Array.from(new Set(data.map(m => m.category))).map(category => {
          const merchant = data.find(m => m.category === category);
          return (
            <div key={category} className="flex items-center gap-1.5 text-xs">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: merchant?.color }}
              />
              <span className="text-[#6e6e73]">{category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

This will:
- Color each bar according to its category
- Show category name in tooltip on hover
- Add a legend below showing which colors correspond to which categories
```

### How to Test Session 11

1. Run `npm run dev`
2. Upload a bank statement
3. Look at "Top 10 Merchants" bar chart
4. Each bar should be colored by its category (matching pie chart colors)
5. Hover over a bar → tooltip shows category name
6. Legend below chart shows category-color mapping
7. Visual connection: Same colors appear in both pie chart and bar chart

---

## Session 12: Better AI Insights

**Goal:** Generate more specific, non-obvious insights that surface hidden patterns

**Time estimate:** 3-4 hours

**Prerequisites:** Session 11 complete

**New skills you'll learn:**
- Pre-calculating metrics for AI prompts
- Prompt engineering for better outputs
- Working with transaction patterns

### Prompt 1: Create Insight Calculations Helper

```
Create a new file lib/insight-calculations.ts that pre-calculates interesting metrics for Claude:

import { CategorizedTransaction } from '@/types';
import { CATEGORIES } from './constants';

export interface InsightMetrics {
  // Per-transaction insights
  avgTransactionSize: number;
  smallTransactionsUnder10: { count: number; total: number };
  
  // Frequency insights
  mostFrequentMerchant: { name: string; count: number; total: number };
  merchantsWithSingleTransaction: number;
  
  // Hidden spending patterns
  weekendVsWeekdaySpending: { weekend: number; weekday: number };
  
  // Long tail analysis
  longTailMerchants: { count: number; total: number; avgEach: number };
  
  // Specific merchant patterns
  coffeeSpending: { total: number; count: number; merchants: string[] };
  subscriptionTotal: number;
  
  // Category concentration
  topCategoryPercentage: number;
  categoriesUsed: number;
}

export function calculateInsightMetrics(
  transactions: CategorizedTransaction[]
): InsightMetrics {
  const debits = transactions.filter(t => t.amount < 0);
  
  // Average transaction size
  const avgTransactionSize = debits.length > 0
    ? Math.abs(debits.reduce((sum, t) => sum + t.amount, 0)) / debits.length
    : 0;
  
  // Small transactions (under $10)
  const smallTxns = debits.filter(t => Math.abs(t.amount) < 10);
  const smallTransactionsUnder10 = {
    count: smallTxns.length,
    total: Math.abs(smallTxns.reduce((sum, t) => sum + t.amount, 0))
  };
  
  // Most frequent merchant
  const merchantCounts: Record<string, { count: number; total: number }> = {};
  debits.forEach(t => {
    const name = t.cleanedName || t.description;
    if (!merchantCounts[name]) merchantCounts[name] = { count: 0, total: 0 };
    merchantCounts[name].count++;
    merchantCounts[name].total += Math.abs(t.amount);
  });
  
  const sortedByFrequency = Object.entries(merchantCounts)
    .sort((a, b) => b[1].count - a[1].count);
  
  const mostFrequentMerchant = sortedByFrequency[0]
    ? { name: sortedByFrequency[0][0], ...sortedByFrequency[0][1] }
    : { name: '', count: 0, total: 0 };
  
  // Single transaction merchants
  const merchantsWithSingleTransaction = sortedByFrequency
    .filter(([_, data]) => data.count === 1).length;
  
  // Weekend vs weekday (simplified - would need actual dates)
  // For now, estimate based on transaction patterns
  const weekendVsWeekdaySpending = { weekend: 0, weekday: 0 };
  
  // Long tail: merchants outside top 10
  const sortedByAmount = Object.entries(merchantCounts)
    .sort((a, b) => b[1].total - a[1].total);
  const longTailEntries = sortedByAmount.slice(10);
  const longTailMerchants = {
    count: longTailEntries.length,
    total: longTailEntries.reduce((sum, [_, data]) => sum + data.total, 0),
    avgEach: longTailEntries.length > 0
      ? longTailEntries.reduce((sum, [_, data]) => sum + data.total, 0) / longTailEntries.length
      : 0
  };
  
  // Coffee spending (look for coffee-related merchants)
  const coffeeKeywords = ['coffee', 'starbucks', 'dunkin', 'peets', 'philz', 'cafe', 'espresso'];
  const coffeeTxns = debits.filter(t => {
    const name = (t.cleanedName || t.description).toLowerCase();
    return coffeeKeywords.some(kw => name.includes(kw));
  });
  const coffeeSpending = {
    total: Math.abs(coffeeTxns.reduce((sum, t) => sum + t.amount, 0)),
    count: coffeeTxns.length,
    merchants: [...new Set(coffeeTxns.map(t => t.cleanedName || t.description))]
  };
  
  // Subscription total
  const subscriptionTotal = Math.abs(
    debits
      .filter(t => t.category === 'Subscriptions')
      .reduce((sum, t) => sum + t.amount, 0)
  );
  
  // Category concentration
  const categoryTotals: Record<string, number> = {};
  debits.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
  });
  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const topCategoryAmount = Math.max(...Object.values(categoryTotals));
  const topCategoryPercentage = totalSpent > 0 ? (topCategoryAmount / totalSpent) * 100 : 0;
  const categoriesUsed = Object.keys(categoryTotals).length;
  
  return {
    avgTransactionSize,
    smallTransactionsUnder10,
    mostFrequentMerchant,
    merchantsWithSingleTransaction,
    weekendVsWeekdaySpending,
    longTailMerchants,
    coffeeSpending,
    subscriptionTotal,
    topCategoryPercentage,
    categoriesUsed
  };
}
```

### Prompt 2: Update Claude Insights Prompt

```
Update lib/claude-insights.ts to use the pre-calculated metrics and generate better insights:

1. Import the new helper at the top:

import { calculateInsightMetrics } from './insight-calculations';

2. Update the generateInsights function to include metrics in the prompt:

export async function generateInsights(
  transactions: CategorizedTransaction[],
  summary: SpendingSummary,
  categoryBreakdown: CategoryBreakdown[]
): Promise<{ insights: Insight[]; tips: SavingsTip[] }> {
  // Pre-calculate interesting metrics
  const metrics = calculateInsightMetrics(transactions);
  
  const prompt = `You are a personal finance analyst reviewing someone's bank statement. Generate insights that are SPECIFIC, SURPRISING, and ACTIONABLE.

## Transaction Summary
- Total spent: $${summary.totalSpent.toFixed(2)}
- Transaction count: ${summary.transactionCount}
- Average transaction: $${metrics.avgTransactionSize.toFixed(2)}
- Date range: ${summary.dateRange.start} to ${summary.dateRange.end}

## Category Breakdown
${categoryBreakdown.map(c => `- ${c.name}: $${c.amount.toFixed(2)} (${c.percentage.toFixed(1)}%)`).join('\n')}

## Pre-Calculated Metrics (USE THESE FOR SPECIFIC INSIGHTS)
- Small transactions under $10: ${metrics.smallTransactionsUnder10.count} transactions totaling $${metrics.smallTransactionsUnder10.total.toFixed(2)}
- Most frequent merchant: "${metrics.mostFrequentMerchant.name}" visited ${metrics.mostFrequentMerchant.count} times, $${metrics.mostFrequentMerchant.total.toFixed(2)} total
- One-time merchants: ${metrics.merchantsWithSingleTransaction} merchants with just 1 transaction
- Long tail spending: ${metrics.longTailMerchants.count} merchants outside top 10, totaling $${metrics.longTailMerchants.total.toFixed(2)}
- Coffee spending: $${metrics.coffeeSpending.total.toFixed(2)} across ${metrics.coffeeSpending.count} transactions at ${metrics.coffeeSpending.merchants.length} locations
- Subscription total: $${metrics.subscriptionTotal.toFixed(2)}/month
- Top category is ${metrics.topCategoryPercentage.toFixed(0)}% of spending
- Using ${metrics.categoriesUsed} different spending categories

## Your Task
Generate exactly 5 insights and 3 savings tips.

INSIGHT RULES:
1. BE SPECIFIC - Use exact dollar amounts and merchant names from the metrics
2. SURFACE HIDDEN PATTERNS - Don't state the obvious (avoid "your biggest category was X")
3. MAKE IT SURPRISING - "Did you know..." style revelations
4. USE THE LONG TAIL - Small recurring amounts that add up
5. QUANTIFY IMPACT - "That's $X per year" or "equivalent to Y"

GOOD INSIGHT EXAMPLES:
- "Your ${metrics.coffeeSpending.count} coffee runs added up to $${metrics.coffeeSpending.total.toFixed(2)}—that's a nice dinner out every week"
- "You visited ${metrics.mostFrequentMerchant.name} ${metrics.mostFrequentMerchant.count} times. At $${(metrics.mostFrequentMerchant.total / metrics.mostFrequentMerchant.count).toFixed(2)} average per visit, small changes here compound"
- "Your ${metrics.smallTransactionsUnder10.count} purchases under $10 totaled $${metrics.smallTransactionsUnder10.total.toFixed(2)}—the 'it's just $5' effect is real"

BAD INSIGHT EXAMPLES (AVOID THESE):
- "Your biggest spending category was Dining Out" (obvious, not actionable)
- "Consider creating a budget" (generic, not specific to their data)
- "You spent money on subscriptions" (no specific insight)

SAVINGS TIP RULES:
1. Reference SPECIFIC merchants or amounts from their data
2. Suggest concrete alternatives with estimated savings
3. Prioritize high-impact, easy changes

Return as JSON:
{
  "insights": [
    { "title": "Short catchy title", "description": "2-3 sentence insight with specific numbers", "icon": "emoji" }
  ],
  "tips": [
    { "title": "Action-oriented title", "description": "Specific tip referencing their spending", "potentialSavings": number }
  ]
}`;

  // ... rest of the function stays the same
}
```

### How to Test Session 12

1. Run `npm run dev`
2. Upload a bank statement
3. Check the insights section on results page
4. Insights should now include:
   - Specific dollar amounts ("Your 23 coffee runs...")
   - Surprising patterns ("Did you know your small purchases...")
   - Merchant-specific observations
   - Long-tail analysis
5. Tips should reference specific merchants and amounts from the statement

---

## Session 13: Budget Targets

**Goal:** Users can set spending targets per category and see progress

**Time estimate:** 4-6 hours

**Prerequisites:** Session 12 complete

**New skills you'll learn:**
- localStorage for data persistence
- Form inputs and state management
- Progress indicators

*Detailed prompts will be added when you reach this session.*

---

## Session 14: Month-over-Month Trends

**Goal:** Upload multiple statements to see spending trends over time

**Time estimate:** 6-8 hours

**Prerequisites:** Session 13 complete

**New skills you'll learn:**
- Managing multiple data sets
- Line charts with Recharts
- Date-based data organization

*Detailed prompts will be added when you reach this session.*

---

## Quick Reference Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Test production locally
npm run start

# Clear cache
rm -rf .next && npm run dev

# Git
git add .
git commit -m "message"
git push
```

---

## MVP Complete! 🎉

You've built a complete, production-ready web application:

**What you built:**
- Landing page with glassmorphism design
- PDF upload with drag-and-drop
- AI-powered PDF parsing (Claude reads statements natively)
- Transaction categorization with 200+ merchant keywords
- Subscription detection (whitelist approach)
- AI-generated personalized insights
- Interactive results dashboard with Recharts
- Full responsive design
- Production deployment at frugalscan.com

**Technical achievements:**
- 99.7% transaction extraction accuracy
- Multi-page PDF support (tested with 13-page statement)
- Clean merchant name processing
- Conservative, trustworthy categorization

**Architecture decisions:**
- Accuracy over prettiness for merchant names
- Whitelist for subscriptions (not pattern detection)
- Recharts for full chart control
- Client-side categorization for speed/cost

---

*Implementation plan updated January 25, 2025. Happy building! 🚀*
