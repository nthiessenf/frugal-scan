# FrugalScan - Claude Project Context

**Last Updated:** January 26, 2025  
**Project Owner:** Nikolas  
**Role:** Non-technical Product Manager building with AI assistance  
**Live URL:** [frugalscan.com](https://frugalscan.com)

---

## 🎯 What This Project Is

FrugalScan is a privacy-first personal finance web app. Users upload bank statement PDFs and receive AI-powered spending insights within 60 seconds—no account linking required.

### Core Value Proposition
> "Upload your bank statement, get AI-powered spending insights in 60 seconds—no account linking required."

### Why This Matters
- Users are privacy-conscious and uncomfortable linking bank accounts
- Existing budgeting apps (Mint, YNAB) are overwhelming
- Simple, one-time analysis removes commitment friction

---

## 👤 Target User

**Primary Persona: "Curious Kate"**
- Age: 28-40
- Income: $50k-$150k
- Behavior: Wants to understand spending but finds budgeting apps overwhelming
- Pain point: Knows money is "leaking" somewhere but can't pinpoint where
- Technical comfort: Uses apps daily but isn't technical

---

## 🗺️ Architecture Overview

### Tech Stack
| Layer | Technology | Reason |
|-------|------------|--------|
| Framework | Next.js 14 (App Router) | SSR, API routes, Nikolas's existing knowledge |
| Styling | Tailwind CSS v3 | Matches design system, NOT v4 |
| Language | TypeScript | Type safety, better AI code generation |
| PDF Parsing | Claude Haiku API (Anthropic) | Native PDF reading, 99%+ accuracy, ~$0.02 per analysis |
| AI Insights | Claude Sonnet API (Anthropic) | Best at structured extraction and analysis, ~$0.05 per analysis |
| Charts | Recharts | Full control over styling (replaced Tremor) |
| Hosting | Vercel | Easy deployment |
| Storage | None (MVP) → localStorage (v1.2) → Supabase (v2) | Progressive complexity |

### PDF Processing Architecture

**Small PDFs (≤5 pages):** Single request to Claude Haiku
**Large PDFs (>5 pages):** Parallel processing with these settings:
- Chunk size: 4 pages
- Concurrency: 3 simultaneous requests (p-limit)
- Model: Claude Haiku (claude-haiku-4-5-20251001)

**Data Format Contract (CRITICAL):**
- Amounts are ALWAYS positive numbers
- `type: 'debit' | 'credit'` indicates direction
- All downstream code (validation, categorization, analysis, charts) depends on this format
- Never change amount signs without updating entire pipeline

**Processing Flow:**
```
PDF Upload
↓
getPdfPageCount() - Check page count
↓
If >5 pages: splitPdfIntoChunks() → parseChunksParallel()
If ≤5 pages: parseSingleRequest()
↓
RawTransaction[] (positive amounts + type)
↓
validateTransactionSchema() → categorizeAll() → analysis
```

### Data Flow
```
User uploads PDF
       ↓
[/api/parse-statement]
  - Convert PDF to base64
  - Send to Claude API with multi-page parsing instructions
  - Claude returns validated JSON with transactions
  - Validate: schema, totals cross-check
  - Return RawTransaction[] with confidence scores
       ↓
[Client-side categorization]
  - Clean merchant names (remove junk, codes, locations)
  - Categorize transactions by merchant keywords
  - Detect recurring subscriptions (whitelist approach)
       ↓
[/api/analyze]
  - Send categorized transactions to Claude
  - Generate insights and savings tips
  - Return full AnalysisResult
       ↓
[Results Dashboard]
  - Display charts (Recharts pie + bar)
  - Show AI insights
  - Display detected subscriptions (top 5 + expand)
  - Offer export/print
```

### Key Architecture Decisions

1. **Claude API for PDF parsing** - 99%+ accuracy vs 70-85% with regex. Must use max_tokens: 16000 and explicit multi-page instructions.

2. **Client-side categorization** - Reduces API costs, faster processing. Uses 200+ merchant keywords.

3. **Whitelist for subscriptions** - Only flag known subscription services. More conservative but more accurate.

4. **Accuracy over prettiness** - Don't aggressively rename merchants. "Disneystore" stays as-is, not mapped to "Disney+".

5. **Recharts over Tremor** - Tremor had color rendering issues. Recharts gives full control.

---

## 🛡️ Accuracy Metrics (Current)

| Metric | Value |
|--------|-------|
| Transactions extracted | 196 (from 13-page statement) |
| Total accuracy | 99.7% ($29 discrepancy on $10,703) |
| "Other" category | ~15% (target: <15%) |
| Processing time | 77 seconds for large PDFs (down from 192s with Haiku) |

**PDF Parsing Performance:**
- Small PDFs (≤5 pages): ~10-20 seconds
- Large PDFs (20 pages): ~50-70 seconds (parallel)
- Accuracy: 99.7% transaction extraction maintained

---

## 📋 Feature Scope & Roadmap

### MVP (Version 1.0) - ✅ COMPLETE
| Feature | Status | Notes |
|---------|--------|-------|
| Landing page with upload | ✅ Complete | Glass cards, hero section |
| PDF upload & parsing | ✅ Complete | Claude API, multi-page support |
| Transaction validation | ✅ Complete | Schema + totals cross-check |
| Transaction categorization | ✅ Complete | 200+ merchant keywords |
| Subscription detection | ✅ Complete | Whitelist approach, discretionary only |
| Spending by category chart | ✅ Complete | Recharts pie chart |
| Top 10 merchants chart | ✅ Complete | Recharts bar chart |
| AI-generated insights (5) | ✅ Complete | Claude API integration |
| Savings tips | ✅ Complete | Claude-generated recommendations |
| Processing screen | ✅ Complete | Animated progress bar |
| Error handling | ✅ Complete | Error messages, retry options |
| Export as PDF | ✅ Complete | Browser print |
| Mobile responsive | ✅ Complete | Tested at 375px |
| Deploy to Vercel | ✅ Complete | Live at frugalscan.com |

**Latest Updates (Session 11-12 - February 2025):**
- Better AI insights with pre-calculated metrics (frequency, small purchases, long tail, annual projections)
- Free tier usage tracking (3 analyses/month limit)
- Usage indicator integrated into upload zone
- Upgrade modal when limit is reached
- /pro landing page with email capture for waitlist

**Previous Updates (Session 10 - January 26, 2025):**
- Category drill-down filter implemented (click category → see merchants)
- Mock data system for instant dev testing
- PDF parsing switched to Claude Haiku (60% faster: 192s → 77s)
- Multi-mode animated loading screen
- Production bug fixed: transactions now included in AnalysisResult

### Version 1.1 - Quick Wins + Monetization Foundation (8-10 hours)
*Theme: Polish + free tier gates to enable conversion tracking*

| Session | Task | Status | Time Est. |
|---------|------|--------|-----------|
| 11 | Better AI Insights | 📋 Next | 3-4 hrs |
| 12 | Usage Tracking + Free Tier Limits | 📋 Planned | 2-3 hrs |
| 13 | Upgrade Modal + Pro Teaser Page | 📋 Planned | 2-3 hrs |

### Version 1.2 - Pro Tier Launch (8-10 hours)
*Theme: Start making money*

| Session | Task | Status | Time Est. |
|---------|------|--------|-----------|
| 14 | Stripe Payment Links (Manual MVP) | 📋 Planned | 2-3 hrs |
| 15 | Pro Tier State Management | 📋 Planned | 2-3 hrs |
| 16 | Stripe Checkout Integration | 📋 Planned | 4-5 hrs |

### Version 1.3 - Pro Features / Stickiness (10-12 hours)
*Theme: Features that make Pro worth keeping*

| Session | Task | Status | Time Est. |
|---------|------|--------|-----------|
| 17 | Budget Targets (Pro-only) | 📋 Planned | 4-6 hrs |
| 18 | Month-over-Month Trends (Pro-only) | 📋 Planned | 6-8 hrs |
| 19 | PDF Export (Pro-only) | 📋 Planned | 2-3 hrs |

### Version 2.0 - Platform + Power Tier (20+ hours)
*Theme: Database-backed features, scale*

| Session | Task | Status | Time Est. |
|---------|------|--------|-----------|
| 20+ | Supabase Integration | 📋 Planned | 6-8 hrs |
| 21+ | User Accounts | 📋 Planned | 4-6 hrs |
| 22+ | Multi-Account Consolidation (Power-only) | 📋 Planned | 8-10 hrs |
| 23+ | Power Tier Launch ($9.99/mo) | 📋 Planned | 4-6 hrs |

---

## 💰 Monetization Strategy

### Pricing
- **Free:** 3 analyses/month, 3 insights
- **Pro ($4.99/mo):** Unlimited analyses, 5 insights, budgets, trends, export
- **Power ($9.99/mo):** Multi-account, sharing (future)

### Implementation Approach
1. v1.1: Add usage tracking + upgrade modal (free tier gates)
2. v1.2: Stripe Payment Links (manual MVP) → Stripe Checkout (automated)
3. v1.3: Build Pro-only features (budgets, trends, export)
4. v2.0: Database + Power tier

### Key Files (when built)
- `lib/usage-tracking.ts` - Track free tier limits
- `lib/subscription.ts` - Pro tier state management
- `components/ui/upgrade-modal.tsx` - Upgrade prompt
- `app/pro/page.tsx` - Pro landing page

---

## 🎨 Design System Summary

### Philosophy: "Radical Minimalism"
- Inspired by Apple, Linear, Swiss design
- Typography over decoration
- Whitespace is intentional
- Subtle micro-interactions

### Colors (EXACT values)
```
Background: #f5f5f7
Primary Text: #1d1d1f
Secondary Text: #6e6e73
Tertiary Text: #86868b

Accent Blue: #93c5fd
Accent Purple: #c4b5fd
Accent Pink: #fbcfe8
```

### Glassmorphism Recipe
```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(20px) saturate(180%);
border-radius: 24px;
```

---

## 📂 Current File Structure
```
frugalscan/
├── app/
│   ├── globals.css
│   ├── layout.tsx (with AnalysisProvider)
│   ├── page.tsx (integrated upload flow)
│   ├── results/page.tsx (real data from context)
│   ├── pro/page.tsx (Pro tier landing page with email capture)
│   ├── error.tsx (error boundary)
│   ├── not-found.tsx (404 page)
│   ├── loading.tsx (loading state)
│   └── api/
│       ├── parse-statement/route.ts
│       └── analyze/route.ts
├── components/
│   ├── ui/ (button, card, upload-zone, error-message, usage-indicator, upgrade-modal)
│   ├── charts/ (spending-chart, merchant-chart - Recharts)
│   └── sections/ (hero, how-it-works, upload-section, processing-screen, summary-header, insights-grid, subscriptions-list, tips-section)
├── contexts/
│   └── AnalysisContext.tsx
├── lib/
│   ├── utils.ts
│   ├── constants.ts (200+ merchant keywords)
│   ├── pdf-chunker.ts          # Splits PDFs into chunks
│   ├── parse-parallel.ts       # Parallel chunk processing
│   ├── parse-with-claude.ts    # Routes to parallel/single
│   ├── validate-transactions.ts
│   ├── categorize.ts (improved cleaning)
│   ├── analysis.ts
│   ├── insight-metrics.ts      # Pre-calculates metrics for AI insights
│   ├── claude-insights.ts
│   ├── usage-tracking.ts       # Tracks free tier usage in localStorage
│   └── hooks/useAnalysis.ts
├── types/index.ts
└── .env.local
```

---

## 🔑 Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Jan 22 | Claude API for PDF parsing | 99%+ accuracy vs 70-85% with regex |
| Jan 24 | max_tokens: 16000 | Large statements need room for all transactions |
| Jan 24 | Recharts over Tremor | Tremor had color rendering bugs |
| Jan 24 | Whitelist for subscriptions | Pattern detection had too many false positives |
| Jan 24 | Accuracy over prettiness | Don't rename merchants aggressively (Disney Store ≠ Disney+) |
| Jan 24 | Subscriptions = discretionary | Phone bills, insurance, daycare are bills, not subscriptions |
| Jan 25 | v1.1 before v1.2 | Frontend-only changes build confidence before localStorage |
| Jan 25 | localStorage before Supabase | Progressive complexity; validate before adding infrastructure |
| Jan 25 | Renamed to FrugalScan | Better brand name, secured frugalscan.com domain |
| Jan 26 | Claude Haiku for PDF parsing | 60% faster (192s → 77s), 80% cheaper, same accuracy |
| Jan 30 | Parallel PDF parsing | 4-page chunks, pLimit(3), Haiku model |
| Jan 30 | Amounts always positive | Parallel parser matches original format exactly |
| Jan 30 | Foreign currency hint | Explicit skip instruction speeds up complex pages |
| Feb 2025 | Pre-calculate insight metrics | Claude generates better insights when given specific data points to cite |
| Feb 2025 | Minimal usage indicator | "Invisible until it matters" - subtle when quota available, prominent when low/exhausted |
| Feb 2025 | Single-card Pro page | Focused, premium feel with email capture above the fold |

---

## 💬 How to Help Nikolas

### His Context
- Non-technical Product Manager
- Uses Cursor AI as development environment
- Learning while building
- Has comprehensive design system files

### What He Needs
1. **Cursor-ready prompts:** Specific, step-by-step, reference exact file paths
2. **Plain language explanations:** Explain the "why" simply
3. **Proactive warnings:** Anticipate errors before they happen
4. **Simple first:** Propose minimal version, then offer enhancements
5. **Challenge assumptions:** Recommend better solutions when appropriate
6. **Learning moments:** After each session, explain what was built and why

### Response Pattern
```
1. Lead with the prompt (copy-paste ready for Cursor)
2. Explain why this approach works
3. How to test if it worked
4. What could go wrong and how to fix it
```

---

## 🔧 Environment Variables
```env
# Required
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

## 🚀 Next Steps

### Immediate (Session 11)
1. **Color-coded bar chart** - Visual category connection

### Then (v1.1 - Sessions 11-12)
2. **Color-coded bar chart** - Visual category connection
3. **Better AI insights** - Specific, surprising, actionable

### Later (v1.2 - Sessions 13-14)
4. **Budget targets** - Set limits, track progress
5. **Month-over-month trends** - Multi-statement comparison

---

## 📞 Quick Commands

```bash
# Start development
npm run dev

# Clear cache
rm -rf .next && npm run dev

# Commit progress
git add .
git commit -m "description"
git push
```

---

*This document is the single source of truth for FrugalScan development. Update it as the project evolves.*
