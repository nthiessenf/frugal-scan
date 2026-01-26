# FrugalScan - Claude Project Context

**Last Updated:** January 25, 2025  
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
| PDF Parsing | Claude API (Anthropic) | Native PDF reading, 99%+ accuracy |
| AI Insights | Claude API (Anthropic) | Best at structured extraction and analysis |
| Charts | Recharts | Full control over styling (replaced Tremor) |
| Hosting | Vercel | Easy deployment |
| Storage | None (MVP) → localStorage (v1.2) → Supabase (v2) | Progressive complexity |

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
| Processing time | 2-3 minutes for large PDFs |

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

### Version 1.1 - Quick Wins (4-6 hours)
*Focus: Immediate value, low risk, pure frontend work*

| Feature | Status | Time Est. | Description |
|---------|--------|-----------|-------------|
| Merchants by category drill-down | 📋 Session 10 | 2-3 hrs | Click pie chart category → see top merchants in that category |
| Color-coded bar chart | 📋 Session 11 | 1-2 hrs | Each merchant bar colored by its category |
| Better AI insights | 📋 Session 12 | 3-4 hrs | Specific, surprising, actionable insights (not obvious observations) |

**Why v1.1 first:** All frontend/prompt work using existing architecture. High user value, low risk. Builds confidence before tackling new patterns.

### Version 1.2 - Personal Finance Features (6-8 hours)
*Focus: Transform from analysis tool to personal finance companion*

| Feature | Status | Time Est. | Description |
|---------|--------|-----------|-------------|
| Budget targets | 📋 Session 13 | 4-6 hrs | Set spending limits per category, see progress bars |
| Month-over-month trends | 📋 Session 14 | 6-8 hrs | Upload multiple statements, see line charts over time |

**Why v1.2 second:** Introduces localStorage (new skill). Both features use same storage pattern—learn once, apply twice. Dramatically increases stickiness.

### Version 2.0 - Platform Features (15-20+ hours)
*Focus: Full personal finance platform*

| Feature | Status | Time Est. | Description |
|---------|--------|-----------|-------------|
| Multi-account consolidation | 📋 Planned | 10-15 hrs | Upload checking + credit card → unified view |
| User accounts (Supabase) | 📋 Planned | 8-10 hrs | Persist data, enable history |
| Historical data persistence | 📋 Planned | 4-6 hrs | Save and retrieve past analyses |

**Why v2.0 last:** Requires database infrastructure. Complex edge cases (deduplication). Better to validate product-market fit first.

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
│   ├── error.tsx (error boundary)
│   ├── not-found.tsx (404 page)
│   ├── loading.tsx (loading state)
│   └── api/
│       ├── parse-statement/route.ts
│       └── analyze/route.ts
├── components/
│   ├── ui/ (button, card, upload-zone, error-message)
│   ├── charts/ (spending-chart, merchant-chart - Recharts)
│   └── sections/ (hero, how-it-works, upload-section, processing-screen, summary-header, insights-grid, subscriptions-list, tips-section)
├── contexts/
│   └── AnalysisContext.tsx
├── lib/
│   ├── utils.ts
│   ├── constants.ts (200+ merchant keywords)
│   ├── parse-with-claude.ts (multi-page parsing)
│   ├── validate-transactions.ts
│   ├── categorize.ts (improved cleaning)
│   ├── analysis.ts
│   ├── claude-insights.ts
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

### Immediate (Session 10)
1. **Merchants by category drill-down** - Click to see top merchants per category

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
