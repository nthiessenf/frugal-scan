# FrugalScan - Code Architecture Reference

**Purpose:** Quick reference for understanding the codebase structure and data flow.
**Last Updated:** January 30, 2025

---

## 📁 File Structure
frugalscan/
├── app/
│   ├── globals.css              # Global styles, animations
│   ├── layout.tsx               # Root layout with AnalysisProvider
│   ├── page.tsx                 # Landing page with upload
│   ├── results/page.tsx         # Results dashboard
│   ├── pro/page.tsx             # Pro tier landing page
│   ├── error.tsx                # Error boundary
│   ├── not-found.tsx            # 404 page
│   └── api/
│       ├── parse-statement/route.ts  # PDF parsing endpoint
│       └── analyze/route.ts          # AI insights endpoint
│
├── components/
│   ├── ui/
│   │   ├── button.tsx           # Button variants (primary, secondary, ghost)
│   │   ├── card.tsx             # GlassCard with hover effects
│   │   ├── upload-zone.tsx      # Drag-and-drop file upload
│   │   ├── error-message.tsx    # Error display component
│   │   ├── usage-indicator.tsx  # Shows remaining free analyses
│   │   └── upgrade-modal.tsx    # Modal when limit reached
│   ├── charts/
│   │   ├── spending-chart.tsx   # Pie chart (Recharts)
│   │   └── merchant-chart.tsx   # Bar chart (Recharts)
│   └── sections/
│       ├── hero.tsx             # Landing page hero
│       ├── how-it-works.tsx     # 3-step explanation
│       ├── upload-section.tsx   # Upload CTA section
│       ├── processing-screen.tsx # Loading animation
│       ├── summary-header.tsx   # Results summary stats
│       ├── insights-grid.tsx    # AI insights display
│       ├── subscriptions-list.tsx # Detected subscriptions
│       └── tips-section.tsx     # Savings recommendations
│
├── contexts/
│   └── AnalysisContext.tsx      # Shares analysis state between pages
│
├── lib/
│   ├── utils.ts                 # cn() helper for classnames
│   ├── constants.ts             # Categories, merchant keywords (200+)
│   ├── pdf-chunker.ts           # Splits PDFs into chunks
│   ├── parse-parallel.ts        # Parallel chunk processing
│   ├── parse-with-claude.ts     # Main parsing orchestrator
│   ├── validate-transactions.ts # Schema validation
│   ├── categorize.ts            # Merchant cleaning & categorization
│   ├── analysis.ts              # Summary calculations
│   ├── insight-metrics.ts       # Pre-calculates metrics for AI insights
│   ├── claude-insights.ts       # AI insights generation
│   ├── usage-tracking.ts        # Tracks free tier usage in localStorage
│   └── hooks/
│       └── useAnalysis.ts       # Analysis flow hook
│
├── types/
│   └── index.ts                 # All TypeScript interfaces
│
└── public/
└── images/                  # Static assets

---

## 🔄 Data Flow

### 1. PDF Upload → Parsing
User uploads PDF
↓
app/api/parse-statement/route.ts
↓
lib/parse-with-claude.ts
├── getPdfPageCount()
├── If >5 pages: splitPdfIntoChunks() → parseChunksParallel()
└── If ≤5 pages: parseSingleRequest()
↓
RawTransaction[] returned
↓
validateTransactionSchema() filters invalid
↓
Response: { transactions, validation, metadata }

### 2. Categorization (Client-Side)
RawTransaction[]
↓
lib/categorize.ts
├── cleanMerchantName() - Remove junk, standardize
├── categorizeTransaction() - Match keywords → category
└── detectSubscriptions() - Whitelist known services
↓
CategorizedTransaction[] + Subscription[]

### 3. Analysis & Insights
CategorizedTransaction[]
↓
app/api/analyze/route.ts
↓
lib/analysis.ts
├── calculateSummary() - Totals, averages
├── getCategoryBreakdown() - For pie chart
└── getTopMerchants() - For bar chart
↓
lib/claude-insights.ts
└── generateInsights() - AI-powered tips
↓
AnalysisResult returned

---

## 📊 Key Data Types

### RawTransaction (from PDF parsing)
```typescript
{
  date: string;           // "YYYY-MM-DD"
  description: string;    // Original text from statement
  amount: number;         // ALWAYS POSITIVE
  type: 'debit' | 'credit';
  confidence: number;     // 0-1
}
```

### CategorizedTransaction (after processing)
```typescript
{
  ...RawTransaction,
  category: Category;     // 'food_dining', 'groceries', etc.
  merchant: string;       // Cleaned merchant name
  isRecurring: boolean;
  needsReview: boolean;
}
```

### Category (spending categories)
```typescript
type Category = 
  | 'food_dining' | 'groceries' | 'shopping'
  | 'transportation' | 'subscriptions' | 'bills_utilities'
  | 'entertainment' | 'health_fitness' | 'travel'
  | 'income' | 'transfer' | 'other';
```

---

## ⚠️ Critical Contracts

### 1. Amount Sign Convention
**Amounts are ALWAYS positive.** The `type` field indicates direction.
```typescript
// ✅ CORRECT
{ amount: 45.99, type: 'debit' }   // Purchase of $45.99
{ amount: 100.00, type: 'credit' } // Deposit of $100.00

// ❌ WRONG - Never do this
{ amount: -45.99, type: 'debit' }
```

**Why:** All validation, analysis, and chart code assumes positive amounts.

### 2. Date Format
Always `YYYY-MM-DD` string format.

### 3. Confidence Scores
- 1.0 = Clearly visible
- 0.8 = Some ambiguity
- 0.5 = Uncertain
- <0.8 = Flagged for review

---

## 🔧 Configuration Points

### Parallel Processing (lib/parse-parallel.ts)
```typescript
const limit = pLimit(3);  // Max concurrent requests
const MODEL_ID = 'claude-haiku-4-5-20251001';
```

### Chunk Size (lib/parse-with-claude.ts)
```typescript
const chunks = await splitPdfIntoChunks(pdfBase64, 4);  // 4 pages per chunk
```

### Parallel Threshold (lib/parse-with-claude.ts)
```typescript
if (pageCount > 5) {
  // Use parallel processing
}
```

---

## 🧪 Testing Checklist

When modifying parsing or categorization:

1. **Accuracy:** Transaction count matches expected
2. **Totals:** Debits/credits match statement summary
3. **Validation:** No transactions rejected (check console)
4. **Categories:** <15% in "Other" category
5. **Charts:** Pie shows categories, bar shows merchants (high→low)
6. **Subscriptions:** Known services detected
7. **Merchant names:** Cleaned properly (no junk codes)

---

## 📝 Common Issues & Fixes

### "Transactions rejected by validation"
Check that amounts are positive and type is 'debit'|'credit'.

### "Charts not showing data"
Likely negative amounts. Check `analysis.ts` calculations.

### "Slow parsing (>90s)"
Check console for which chunk is slow. API latency varies.

### "Missing transactions"
Check chunk size. Smaller chunks can miss page-boundary transactions.

### "Wrong categorization"
Add keywords to `MERCHANT_KEYWORDS` in `lib/constants.ts`.

---

*This document should be updated when making architectural changes.*

