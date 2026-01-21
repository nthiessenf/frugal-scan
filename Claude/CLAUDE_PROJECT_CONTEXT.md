# SpendSense - Claude Project Context

**Last Updated:** January 2025
**Project Owner:** Nikolas
**Role:** Non-technical Product Manager building with AI assistance

---

## 🎯 What This Project Is

SpendSense is a privacy-first personal finance web app. Users upload bank statement PDFs and receive AI-powered spending insights within 60 seconds—no account linking required.

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

**What Kate wants:**
1. Quick answer to "where does my money go?"
2. Surprising insights she didn't know
3. Actionable tips (not just data dumps)
4. No ongoing commitment or account linking

---

## 🏗️ Architecture Overview

### Tech Stack
| Layer | Technology | Reason |
|-------|------------|--------|
| Framework | Next.js 14 (App Router) | SSR, API routes, Nikolas's existing knowledge |
| Styling | Tailwind CSS v3 | Matches design system, NOT v4 |
| Language | TypeScript | Type safety, better AI code generation |
| PDF Parsing | pdf-parse | Well-documented, handles bank statements |
| AI/LLM | Claude API (Anthropic) | Best at structured extraction |
| Charts | Recharts | Simple, works with React |
| Hosting | Vercel | Easy deployment, Nikolas knows it |
| Database | None (MVP) → Supabase (v2) | Keep MVP simple |

### Data Flow
```
User uploads PDF
       ↓
[/api/parse-statement]
  - Extract text from PDF
  - Regex match transactions
  - Return RawTransaction[]
       ↓
[Client-side]
  - Categorize transactions
  - Detect subscriptions
       ↓
[/api/analyze]
  - Send to Claude API
  - Generate insights
  - Return analysis
       ↓
[Results Dashboard]
  - Display charts
  - Show insights
  - Offer export
```

### Key Design Decisions

1. **No user accounts (MVP):** Validate core value before building auth
2. **Client-side categorization:** Reduce API costs, faster processing
3. **Claude for insights only:** Don't use AI for parsing (expensive, unreliable)
4. **PDF-only (no CSV):** Simpler UX, most users have statement PDFs

---

## 📋 Feature Scope

### MVP (Version 1.0) - Current Focus
| Feature | Status | Notes |
|---------|--------|-------|
| Landing page with upload | 🔲 Planned | Glass cards, hero section |
| PDF upload & parsing | 🔲 Planned | Support Chase, BofA, Wells Fargo first |
| Transaction categorization | 🔲 Planned | 9 categories + "Other" |
| Subscription detection | 🔲 Planned | Recurring charge pattern matching |
| Spending by category chart | 🔲 Planned | Recharts pie chart |
| Top merchants chart | 🔲 Planned | Recharts bar chart |
| AI-generated insights (5) | 🔲 Planned | Claude API integration |
| Savings tips | 🔲 Planned | Claude-generated recommendations |
| Export as PDF | 🔲 Planned | Browser print for MVP |
| Mobile responsive | 🔲 Planned | 375px → 768px → 1440px |

### Future (Version 2.0+) - NOT building now
- User accounts & history
- Multi-statement trends
- Custom category rules
- Bank account linking (Plaid)
- Budget creation tools
- Subscription cancellation links

---

## 🎨 Design System Summary

Nikolas has a comprehensive design system (see DESIGN_SYSTEM.md). Key points:

### Philosophy: "Radical Minimalism"
- Inspired by Apple, Linear, Swiss design
- Typography over decoration
- Whitespace is intentional
- Subtle micro-interactions

### Colors (EXACT values required)
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

### Standard Hover
```css
transform: translateY(-8px) scale(1.02);
transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 📁 File Structure

```
spendsense/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                 # Landing
│   ├── results/page.tsx         # Dashboard
│   └── api/
│       ├── parse-statement/route.ts
│       └── analyze/route.ts
├── components/
│   ├── ui/                      # button, card, upload-zone
│   ├── charts/                  # spending-pie, spending-bar
│   └── sections/                # hero, insights-grid, subscriptions
├── lib/
│   ├── utils.ts                 # cn() helper
│   ├── parse-pdf.ts
│   ├── categorize.ts
│   └── claude.ts
├── types/index.ts
├── .cursorrules
├── .env.local
└── DESIGN_SYSTEM.md
```

---

## 🔢 TypeScript Interfaces

```typescript
// Raw transaction from PDF parsing
interface RawTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
}

// After categorization
interface CategorizedTransaction extends RawTransaction {
  category: Category;
  merchant?: string;
}

// Spending categories
type Category = 
  | 'food_dining'
  | 'shopping'
  | 'transportation'
  | 'subscriptions'
  | 'bills_utilities'
  | 'entertainment'
  | 'health_fitness'
  | 'travel'
  | 'other';

// Detected subscription
interface Subscription {
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'weekly';
}

// AI-generated insight
interface Insight {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'positive';
  icon?: string;
}

// Savings recommendation
interface Tip {
  title: string;
  description: string;
  potentialSavings: number;
}

// Full analysis result
interface AnalysisResult {
  summary: {
    totalSpent: number;
    transactionCount: number;
    dateRange: { start: string; end: string };
    topCategory: Category;
    subscriptionTotal: number;
  };
  categoryBreakdown: { category: Category; amount: number; percentage: number }[];
  topMerchants: { name: string; amount: number; count: number }[];
  subscriptions: Subscription[];
  insights: Insight[];
  tips: Tip[];
}
```

---

## 🚦 Build Progress Tracker

Update this section after each Cursor session:

| Session | Task | Status | Notes |
|---------|------|--------|-------|
| 1 | Project Scaffolding | 🔲 Not Started | |
| 2 | Core UI Components | 🔲 Not Started | |
| 3 | Landing Page | 🔲 Not Started | |
| 4 | PDF Parsing Backend | 🔲 Not Started | |
| 5 | Transaction Categorization | 🔲 Not Started | |
| 6 | Claude AI Integration | 🔲 Not Started | |
| 7 | Results Dashboard | 🔲 Not Started | |
| 8 | Connect Everything | 🔲 Not Started | |
| 9 | Polish & Deploy | 🔲 Not Started | |

**Status Key:** 🔲 Not Started | 🟡 In Progress | ✅ Complete | ❌ Blocked

---

## 🐛 Known Issues & Decisions Log

Track problems encountered and decisions made:

| Date | Issue/Decision | Resolution |
|------|----------------|------------|
| Jan 2025 | Project initiated | Starting with MVP scope |
| | | |

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
5. **Celebrate wins:** He's learning—acknowledge progress

### What NOT to Do
- Don't write code directly (Cursor's job)
- Don't assume he knows file structures
- Don't leave steps ambiguous
- Don't suggest complex changes without explaining trade-offs

### Response Pattern
```
1. Lead with the prompt (copy-paste ready for Cursor)
2. Explain why this approach works
3. How to test if it worked
4. What could go wrong and how to fix it
```

---

## 🔑 Environment Variables

```env
# Required for MVP
ANTHROPIC_API_KEY=sk-ant-api03-...

# Future (not needed yet)
# SUPABASE_URL=
# SUPABASE_ANON_KEY=
```

---

## 📚 Reference Documents

These files should be uploaded to Claude Projects:

1. **DESIGN_SYSTEM.md** - Complete design reference
2. **QUICK_REFERENCE.md** - Copy-paste code snippets
3. **AI_INSTRUCTIONS.md** - How AI should work with Nikolas's style
4. **CLAUDE_PROJECT_CONTEXT.md** - This file
5. **IMPLEMENTATION_PLAN.md** - Detailed build steps
6. **.cursorrules** - Cursor-specific rules

---

## 🚀 Quick Start for New Session

When Nikolas starts a new Claude conversation about SpendSense:

1. **Check build progress** (Session tracker above)
2. **Identify current session** to work on
3. **Reference the specific prompt** from IMPLEMENTATION_PLAN.md
4. **Verify prerequisites** from previous sessions
5. **Provide the prompt** with any session-specific context

**Example opening:**
> "Last time we completed Session 3 (Landing Page). Ready to start Session 4: PDF Parsing Backend. Here's the prompt for Cursor..."

---

## 📞 Escalation Paths

If Cursor can't solve something:

1. **Styling issues:** Check DESIGN_SYSTEM.md, verify exact colors
2. **Build errors:** `rm -rf .next && npm run dev`
3. **TypeScript errors:** Check types/index.ts matches usage
4. **API failures:** Check .env.local has correct keys
5. **PDF parsing issues:** Start with just Chase format, expand later

---

*This document is the single source of truth for SpendSense development. Update it as the project evolves.*
