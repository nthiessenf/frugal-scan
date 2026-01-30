# SpendSense - Development Session Log

**Purpose:** Track progress, issues, and learnings across development sessions.

---

## Session 10: January 30, 2025

### ✅ What Was Completed

**Parallel PDF Parsing Implementation**
- Created `lib/pdf-chunker.ts` - Splits large PDFs into smaller chunks using pdf-lib
- Created `lib/parse-parallel.ts` - Processes chunks concurrently with rate limiting (p-limit)
- Updated `lib/parse-with-claude.ts` - Auto-selects parallel vs sequential based on page count

**Performance Optimization**
- PDFs >5 pages now use parallel processing
- 4-page chunks with 3 concurrent requests (optimal balance)
- Added foreign currency handling hint to speed up complex pages
- Added skip rules for non-transaction items (Pay Over Time, plan summaries)

**New Dependencies**
- `pdf-lib` - PDF manipulation and splitting
- `p-limit` - Concurrency control for API requests

### 📊 Performance Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Parse time (20-page PDF) | ~70s | ~56s | **20% faster** |
| Accuracy | 195 txns | 195 txns | ✅ Maintained |
| Total debits | $10,726.85 | $10,726.85 | ✅ Exact match |

### 🔑 Key Decisions Made

1. **Amounts stay POSITIVE** - Parallel parser outputs same format as original (positive amounts + type field). All downstream code unchanged.

2. **Haiku for parsing, Sonnet for insights** - Haiku is faster for structured extraction; Sonnet better for reasoning tasks.

3. **4-page chunks optimal** - Smaller chunks (2 pages) caused missing transactions at page boundaries. Larger chunks don't parallelize well.

4. **pLimit(3) concurrency** - Balances speed vs rate limits. Higher concurrency didn't help due to API latency variance.

5. **Foreign currency hint** - Explicit instruction to ignore foreign currency column reduced processing time on complex pages by ~50%.

### 📁 Files Changed
- `lib/parse-with-claude.ts` - Added parallel processing branch
- `lib/pdf-chunker.ts` - NEW: PDF splitting utility
- `lib/parse-parallel.ts` - NEW: Parallel chunk processor
- `package.json` - Added pdf-lib, p-limit dependencies

### ⚠️ Known Limitations
- API latency variance means times range from 50-90s depending on server load
- Parallel processing only kicks in for PDFs >5 pages
- Some complex statements may still have slow chunks

### 🔧 Commands to Remember
```bash
# If parsing seems slow, check chunk times in console
# Look for one chunk taking much longer than others

# To adjust concurrency (in lib/parse-parallel.ts):
const limit = pLimit(3);  # Current setting

# To adjust chunk size (in lib/parse-with-claude.ts):
const chunks = await splitPdfIntoChunks(pdfBase64, 4);  # Current setting
```

### 📝 Next Steps
- Consider adding progress callbacks to show per-chunk completion in UI
- Monitor API costs with increased parallel requests
- Session 11: Color-coded bar chart by category (from original roadmap)

---

## Session 10: January 26, 2025

### ✅ What Was Completed

**Category Drill-Down Filter**
- Click any pie chart category to filter the entire dashboard
- Filter banner shows active filter with "Showing: [Category] ✕" 
- Pie chart transforms to show merchants within selected category
- Bar chart filters to show only merchants from selected category
- Click ✕ or clear to return to full view

**Mock Data System**
- Created `lib/mock-data.ts` with 40+ realistic transactions
- "⚡ Load Mock Data (Dev Only)" button on homepage (dev only)
- Enables instant testing without 160-second API waits
- Realistic data across all categories for demos

**Performance: Claude Haiku Migration**
- Switched PDF parsing from Claude Sonnet to Claude Haiku
- Result: 192s → 77s (60% faster)
- Added timing diagnostics to API routes
- Insights generation remains on Sonnet for quality

**Loading UX Overhaul**
- Created multi-mode animated processing screen
- 4 animation modes rotating every 10 seconds:
  1. Document scanning (abstract lines being read)
  2. Category sorting (icons lighting up)
  3. Chart building (bars growing)
  4. Generating insights (cards highlighting)
- Removed fake progress bar in favor of honest time estimate
- "Usually takes 60-90 seconds" messaging

**Chart Sizing Polish**
- Fixed pie chart excess whitespace (h-96 → h-56)
- Removed duplicate "Total Spent" display
- Balanced bar chart height with pie chart
- Tightened margins throughout

**Bug Fixes**
- Fixed category filter not working in production
- Root cause: `result.transactions` was not included in AnalysisResult
- Fixed by adding transactions to analyze API response
- Fixed TypeScript build errors for production deployment

### 🔑 Key Decisions Made

1. **Filter mode over detail view** - Instead of replacing pie chart with a different component, we filter both charts in place. Better UX - same mental model, easy comparison.

2. **Abstract loading animation** - No fake transaction data shown (privacy anxiety). Abstract shapes represent document scanning without revealing sensitive-looking info.

3. **Haiku for parsing, Sonnet for insights** - Parsing is structured extraction (Haiku excels). Insights need reasoning (Sonnet better). Best of both worlds.

4. **Honest time estimate over fake progress** - Users prefer knowing "60-90 seconds" over watching a fake progress bar that lies.

### 📊 Performance Metrics

| Metric | Before | After |
|--------|--------|-------|
| PDF parsing time | 192s | 77s |
| Total analysis time | ~210s | ~95s |
| Dev testing time | 160s+ | <1s (mock) |

### 🐛 Bugs Encountered & Fixed

1. **ProcessingScreen props mismatch** - Component interface changed but page still passed old props. Fixed by updating page to use new `stage` prop.

2. **Category filter showing $0.00** - `result.transactions` was undefined in production. Root cause: transactions weren't included in AnalysisResult from API. Fixed by adding to response.

3. **Build passes locally, fails on Vercel** - Dev mode is lenient with TypeScript errors. `npm run build` is strict. Lesson: always run `npm run build` before pushing.

### 🧪 Testing Notes

- Created demo PDF matching mock data for consistent testing
- Debug logging pattern: add console.logs, deploy, check browser console, remove logs
- Filter works with both mock data and real PDF uploads

### 📁 Files Created/Modified

**Created:**
- `lib/mock-data.ts` - Mock transaction data and analysis result
- `components/ui/filter-banner.tsx` - Filter indicator component

**Modified:**
- `app/results/page.tsx` - Added filter state, helper functions, conditional rendering
- `components/charts/spending-chart.tsx` - Added onCategoryClick, title prop, custom colors
- `components/charts/merchant-chart.tsx` - Added title prop, fixed sizing
- `components/sections/processing-screen.tsx` - Complete rewrite with multi-mode animation
- `app/page.tsx` - Added mock data button, updated ProcessingScreen usage
- `lib/parse-with-claude.ts` - Switched to Claude Haiku model
- `app/api/analyze/route.ts` - Added transactions to response, timing logs
- `app/api/parse-statement/route.ts` - Added timing logs
- `app/globals.css` - Added animation keyframes

### 🔧 Commands to Remember
```bash
# Test production build locally (catches TypeScript errors)
npm run build

# Full deploy flow
npm run build && git add . && git commit -m "message" && git push
```

### 📋 Next Steps

Session 11: Better AI Insights
- Pre-calculate interesting metrics for Claude
- Prompt engineering for specific, surprising, actionable insights
- Move beyond obvious observations ("your biggest category was X")

---

## Session 8: January 24, 2025

### ✅ What Was Completed

**Core Flow Integration**
- Created `contexts/AnalysisContext.tsx` - React Context to share analysis results between pages
- Created `lib/hooks/useAnalysis.ts` - Custom hook managing full analysis flow (upload → parse → categorize → analyze)
- Created `components/sections/processing-screen.tsx` - Animated loading screen with progress bar
- Created `components/ui/error-message.tsx` - Reusable error display component
- Updated `app/layout.tsx` - Wrapped app with AnalysisProvider
- Updated `app/page.tsx` - Integrated upload flow with processing states
- Updated `app/results/page.tsx` - Connected to real data from context

**Chart Fixes**
- Replaced Tremor charts with Recharts for full control over styling
- Fixed pie chart to show colorful category segments (was rendering solid black)
- Fixed bar chart with proper merchant name display and purple gradient colors
- Expanded to Top 10 Merchants with increased chart height
- Fixed merchant name truncation to show full names

**Critical PDF Parsing Fix**
- Identified major accuracy issue: Claude was only extracting ~16% of transactions ($1.7k vs $10.7k actual)
- Root cause: max_tokens too low and no instruction to parse ALL pages
- Fix: Increased max_tokens to 16000, added explicit multi-page parsing instructions
- Result: Now extracts 196 transactions with only $29 discrepancy (0.27% error) ✅
- Added diagnostic logging to track parsing accuracy

**Categorization Improvements**
- Expanded MERCHANT_KEYWORDS from ~50 to 200+ entries
- Reduced "Other" category from ~50% to ~15% of transactions
- Added keywords for: restaurants, groceries, shopping, transportation, subscriptions, bills/utilities, entertainment, health/fitness, travel

**Subscription Detection Overhaul**
- Implemented whitelist approach for known subscription services
- Added blacklist for non-subscriptions (travel, hotels, one-time purchases)
- Removed non-discretionary items (daycare, phone bills, insurance) from subscriptions
- Subscriptions now sorted by amount (highest first)
- Added expand/collapse UI to show top 5 with "Show all" option

**Merchant Name Cleaning**
- Completely rewrote `cleanMerchantName()` function
- Removes: asterisk codes, phone numbers, toll-free numbers, URLs, zip codes, state abbreviations, city names, reference numbers
- Only maps truly unreadable abbreviations (BRGHTWHL → Brightwheel, AMZN → Amazon)
- Removes duplicate words (Austin Austin → Austin)
- Title cases results and limits to 30 characters
- Philosophy: Clean the junk but don't aggressively rename (accuracy over prettiness)

### 📂 Current File Structure
```
SpendSense/
├── app/
│   ├── globals.css ✅
│   ├── layout.tsx ✅ (with AnalysisProvider)
│   ├── page.tsx ✅ (integrated upload flow)
│   ├── results/
│   │   └── page.tsx ✅ (connected to real data)
│   └── api/
│       ├── parse-statement/
│       │   └── route.ts ✅ (with multi-page parsing)
│       └── analyze/
│           └── route.ts ✅
├── components/
│   ├── ui/
│   │   ├── button.tsx ✅
│   │   ├── card.tsx ✅
│   │   ├── upload-zone.tsx ✅
│   │   └── error-message.tsx ✅ (new)
│   ├── charts/
│   │   ├── spending-chart.tsx ✅ (Recharts)
│   │   └── merchant-chart.tsx ✅ (Recharts)
│   └── sections/
│       ├── hero.tsx ✅
│       ├── how-it-works.tsx ✅
│       ├── upload-section.tsx ✅
│       ├── processing-screen.tsx ✅ (new)
│       ├── summary-header.tsx ✅
│       ├── insights-grid.tsx ✅
│       ├── subscriptions-list.tsx ✅ (with expand/collapse)
│       └── tips-section.tsx ✅
├── contexts/
│   └── AnalysisContext.tsx ✅ (new)
├── lib/
│   ├── utils.ts ✅
│   ├── constants.ts ✅ (expanded keywords)
│   ├── parse-with-claude.ts ✅ (multi-page parsing)
│   ├── validate-transactions.ts ✅
│   ├── categorize.ts ✅ (improved cleaning & detection)
│   ├── analysis.ts ✅
│   └── claude-insights.ts ✅
│   └── hooks/
│       └── useAnalysis.ts ✅ (new)
├── types/
│   └── index.ts ✅
└── .env.local ✅ (contains ANTHROPIC_API_KEY)
```

### 🔑 Key Decisions Made

1. **Accuracy over prettiness for merchant names** - Don't aggressively rename merchants (e.g., don't map "Disneystore" → "Disney+") because it creates false confidence and edge case errors

2. **Subscriptions = discretionary only** - Phone bills, insurance, daycare are bills/utilities, NOT subscriptions. Subscriptions are things you can cancel anytime (Netflix, Spotify, etc.)

3. **Whitelist approach for subscriptions** - Only flag known subscription services rather than trying to detect patterns. More conservative but more accurate.

4. **Recharts over Tremor** - Tremor had color rendering issues that were difficult to debug. Recharts gives full control over styling.

5. **Multi-page PDF parsing** - Critical fix. Must explicitly tell Claude to scan ALL pages and increase max_tokens to 16000 for large statements.

### 📊 Accuracy Metrics (After Fixes)

| Metric | Before | After |
|--------|--------|-------|
| Transactions extracted | 30 | 196 |
| Total debits extracted | $1,701 | $10,732 |
| Statement actual | $10,703 | $10,703 |
| Discrepancy | $9,031 (84%!) | $29 (0.27%) |
| Pages scanned | 1 | 13 |
| "Other" category | ~50% | ~15% |

### 📝 Next Steps (Session 9: Polish & Deploy)

1. **SEO & Metadata** - Title, description, Open Graph
2. **Error pages** - Custom 404, error boundaries
3. **Loading states** - App-wide loading component
4. **Accessibility** - aria labels, keyboard navigation
5. **Mobile optimization** - Final check at 375px
6. **Performance** - Lazy loading, optimizations
7. **Deploy to Vercel** - Get it live!

### 🔧 Commands to Remember
```bash
# Start development
npm run dev

# Clear cache (fixes most issues)
rm -rf .next && npm run dev

# Commit progress
git add .
git commit -m "Session 8: Complete flow integration with accuracy fixes"
git push
```

### ⚠️ Known Issues / Future Improvements

1. **Processing time** - PDF parsing takes 2-3 minutes for large statements (166 seconds observed). Consider showing better progress feedback or optimizing.

2. **Merchant name edge cases** - Some names still have minor junk. Could continue refining cleanMerchantName() patterns.

3. **No data persistence** - Results are lost on page refresh. Future: Add user accounts with Supabase.

4. **No user review step** - Originally planned to let users edit transactions before analysis. Deferred to v2.

---

## Sessions 4-7: January 23, 2025

### ✅ What Was Completed

**Session 4: PDF Parsing with Claude API**
- Installed @anthropic-ai/sdk
- Created `types/index.ts` with RawTransaction, ParsedStatement, ValidationResult, ApiResponse interfaces
- Created `lib/parse-with-claude.ts` - sends PDF to Claude, returns structured transactions
- Created `lib/validate-transactions.ts` - validates schema and cross-checks totals
- Created `app/api/parse-statement/route.ts` - API endpoint for PDF upload

**Session 5: Transaction Categorization**
- Added Category, CategorizedTransaction, Subscription types
- Created `lib/constants.ts` - 12 categories with colors/icons, merchant keywords
- Created `lib/categorize.ts` - cleanMerchantName(), categorizeTransaction(), detectSubscriptions()

**Session 6: AI Insights Generation**
- Added Insight, SavingsTip, SpendingSummary, CategoryBreakdown, TopMerchant, AnalysisResult types
- Created `lib/analysis.ts` - calculateSummary(), getCategoryBreakdown(), getTopMerchants()
- Created `lib/claude-insights.ts` - generates 5 insights + 3 tips using Claude
- Created `app/api/analyze/route.ts` - API endpoint for analysis

**Session 7: Results Dashboard**
- Created summary header, charts, insights grid, subscriptions list, tips section
- Created `app/results/page.tsx` - full dashboard layout

---

## Sessions 1-3: January 21-22, 2025

### ✅ What Was Completed

**Session 1: Project Scaffolding**
- Created Next.js 14 project with TypeScript and Tailwind CSS
- Set up design system (colors, glassmorphism, animations)
- Created lib/utils.ts with cn() helper

**Session 2: Core UI Components**
- Created Button component (primary, secondary, ghost variants)
- Created GlassCard component with hover effects
- Created UploadZone component with drag-and-drop

**Session 3: Landing Page**
- Created Hero section with headline and CTA
- Created HowItWorks section with 3 step cards
- Created UploadSection with file picker

---

*Last updated: January 26, 2025*
