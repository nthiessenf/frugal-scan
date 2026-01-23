# SpendSense - Claude Project Context

**Last Updated:** January 22, 2025  
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

## 🗺️ Architecture Overview

### Tech Stack
| Layer | Technology | Reason |
|-------|------------|--------|
| Framework | Next.js 14 (App Router) | SSR, API routes, Nikolas's existing knowledge |
| Styling | Tailwind CSS v3 | Matches design system, NOT v4 |
| Language | TypeScript | Type safety, better AI code generation |
| PDF Parsing | Claude API (Anthropic) | Native PDF reading, 99%+ accuracy, context-aware |
| AI Insights | Claude API (Anthropic) | Best at structured extraction and analysis |
| Charts | Recharts | Simple, works with React |
| Hosting | Vercel | Easy deployment, Nikolas knows it |
| Database | None (MVP) → Supabase (v2) | Keep MVP simple |

### Data Flow
```
User uploads PDF
       ↓
[/api/parse-statement]
  - Convert PDF to base64
  - Send to Claude API with structured prompt
  - Claude returns validated JSON with transactions
  - Apply validation rules (dates, amounts, types)
  - Return RawTransaction[] or validation errors
       ↓
[Client-side]
  - Show user transaction list for review
  - Allow editing/removing incorrect transactions
  - User confirms data looks correct
       ↓
[Client-side categorization]
  - Categorize transactions by merchant keywords
  - Detect recurring subscriptions
       ↓
[/api/analyze]
  - Send categorized transactions to Claude
  - Generate insights and savings tips
  - Return full AnalysisResult
       ↓
[Results Dashboard]
  - Display charts (category breakdown, top merchants)
  - Show AI insights
  - Display detected subscriptions
  - Offer export/print
```

### Key Design Decisions

1. **No user accounts (MVP):** Validate core value before building auth

2. **Claude API for PDF parsing:** (Updated Jan 22, 2025)
   - Replaces pdf-parse + regex approach
   - Better accuracy (99%+ vs 70-85%)
   - Handles all bank formats automatically
   - Native PDF reading capability
   - Simpler codebase to maintain
   - Cost: ~$0.10 per parse (acceptable for MVP)

3. **User review step:** Users can edit transactions before analysis
   - Catches the ~1% parsing errors
   - Builds trust through transparency
   - Allows corrections without re-uploading

4. **Client-side categorization:** Reduce API costs, faster processing
   - Use keyword matching for common merchants
   - Only use AI for insights, not categorization

5. **PDF-only (no CSV):** Simpler UX, most users have statement PDFs

---

## 🛡️ Risk Mitigation Strategy

### Handling Claude's Probabilistic Nature

While Claude is probabilistic (not deterministic like regex), we mitigate accuracy risks through:

**1. Structured Output Validation**
- Strict JSON schema enforcement in prompt
- Post-parse validation of all fields
- Type checking (dates, amounts, enums)
- Range checking (amounts must be reasonable)

**2. Cross-Validation**
- Compare parsed transaction totals with statement totals (when available)
- Flag discrepancies for user review
- Validate date ranges match statement period

**3. Confidence Scoring**
- Claude provides 0-1 confidence score per transaction
- Flag low-confidence transactions (< 0.8) for user review
- Higher scrutiny on unusual transactions

**4. User Review Step**
- Always show users parsed transactions before analysis
- Allow editing/removing incorrect transactions
- Users confirm data looks correct before proceeding
- This catches the ~1% parsing errors

**5. Monitoring & Logging**
- Log all parsing attempts (success/failure)
- Track validation error patterns
- Monitor API costs vs. budget
- Build regression test suite over time

### Expected Accuracy

Based on similar implementations:
- **Target:** 99%+ accuracy on standard bank statements
- **Reality:** ~98-99.5% in practice (better than regex at 70-85%)
- **Errors:** Usually formatting issues, not wrong data
- **User catches:** Manual review catches remaining 0.5-1%

### Cost Management

Per-statement costs:
- Parsing: ~$0.10 (Claude 3.5 Sonnet with PDF)
- Insights: ~$0.05 (text-only analysis)
- **Total: ~$0.15 per analysis**

Budget protection:
- Set rate limits on API endpoint
- Cache results per PDF (don't re-parse same file)
- Monitor costs in Anthropic console
- Add user limits in v2 (max 10 analyses/month free)

---

## 📋 Feature Scope

### MVP (Version 1.0) - Current Focus
| Feature | Status | Notes |
|---------|--------|-------|
| Landing page with upload | ✅ Complete | Glass cards, hero section |
| PDF upload & parsing | 🔜 Session 4 | Claude API for parsing |
| Transaction validation | 🔜 Session 4 | Strict validation rules |
| User review step | 🔜 Session 8 | Edit transactions before analysis |
| Transaction categorization | 🔜 Session 5 | 11 categories + "Other" |
| Subscription detection | 🔜 Session 5 | Recurring charge pattern matching |
| Spending by category chart | 🔜 Session 7 | Recharts pie chart |
| Top merchants chart | 🔜 Session 7 | Recharts bar chart |
| AI-generated insights (5) | 🔜 Session 6 | Claude API integration |
| Savings tips | 🔜 Session 6 | Claude-generated recommendations |
| Export as PDF | 🔜 Session 9 | Browser print for MVP |
| Mobile responsive | 🔜 Session 9 | 375px → 768px → 1440px |

### Future (Version 2.0+) - NOT building now
- User accounts & history
- Multi-statement trends
- Custom category rules
- Bank account linking (Plaid)
- Budget creation tools
- Subscription cancellation links
- Spending alerts
- Comparative analytics

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

## 📂 File Structure
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
│   ├── parse-with-claude.ts     # Claude PDF parsing
│   ├── validate-transactions.ts # Validation rules
│   ├── categorize.ts            # Transaction categorization
│   └── claude.ts                # Insights generation
├── types/index.ts
├── .cursorrules
├── .env.local
└── DESIGN_SYSTEM.md
```

---

## 📐 TypeScript Interfaces
```typescript
// Raw transaction from PDF parsing
interface RawTransaction {
  date: string;           // ISO format: YYYY-MM-DD
  description: string;
  amount: number;         // Always positive
  type: 'debit' | 'credit';
}

// Enhanced with confidence score
interface ParsedTransaction extends RawTransaction {
  confidence?: number;    // 0-1 score from Claude
}

// Validation result
interface ValidationResult {
  valid: boolean;
  errors: string[];       // Blocking issues
  warnings: string[];     // Suspicious but not blocking
  transactionCount: number;
}

// After categorization
interface CategorizedTransaction extends RawTransaction {
  category: Category;
  merchant: string;       // Cleaned merchant name
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
  | 'income'
  | 'transfer'
  | 'other';

// Detected subscription
interface Subscription {
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'weekly';
  lastCharge: string;
  category: 'streaming' | 'software' | 'fitness' | 'news' | 'other';
}

// AI-generated insight
interface Insight {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'positive';
}

// Savings recommendation
interface SavingsTip {
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

// Spending summary
interface SpendingSummary {
  totalSpent: number;
  totalIncome: number;
  netCashFlow: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: Category;
  subscriptionTotal: number;
}

// Full analysis result
interface AnalysisResult {
  summary: SpendingSummary;
  categoryBreakdown: Array<{
    category: Category;
    amount: number;
    percentage: number;
    transactionCount: number;
  }>;
  topMerchants: Array<{
    name: string;
    amount: number;
    count: number;
    category: Category;
  }>;
  subscriptions: Subscription[];
  insights: Insight[];
  tips: SavingsTip[];
}
```

---

## 🚦 Build Progress Tracker

Update this section after each Cursor session:

| Session | Task | Status | Notes |
|---------|------|--------|-------|
| 1 | Project Scaffolding | ✅ Complete | Next.js setup, design system |
| 2 | Core UI Components | ✅ Complete | Button, Card, UploadZone |
| 3 | Landing Page | ✅ Complete | Hero, How it Works, Upload section |
| 4 | PDF Parsing with Claude | 🔜 Next | Rewritten for Claude API |
| 5 | Transaction Categorization | 🔲 Not Started | |
| 6 | Claude Insights Generation | 🔲 Not Started | Simplified (only insights) |
| 7 | Results Dashboard | 🔲 Not Started | |
| 8 | Connect Everything | 🔲 Not Started | Add user review step |
| 9 | Polish & Deploy | 🔲 Not Started | |

**Status Key:** 🔲 Not Started | 🟡 In Progress | ✅ Complete | ❌ Blocked

---

## 🛠️ Known Issues & Decisions Log

Track problems encountered and decisions made:

| Date | Issue/Decision | Resolution |
|------|----------------|------------|
| Jan 21, 2025 | Project initiated | Starting with MVP scope |
| Jan 21, 2025 | pdf-parse webpack conflicts | Tried multiple import approaches, all failed |
| Jan 22, 2025 | **Architecture pivot** | Switched to Claude API for PDF parsing |
| Jan 22, 2025 | Probabilistic nature concerns | Implemented 5-point risk mitigation strategy |

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
6. **Challenge assumptions:** Recommend better solutions when appropriate

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
6. **SESSION_LOG.md** - Progress tracker
7. **.cursorrules** - Cursor-specific rules

---

## 🚀 Quick Start for New Session

When Nikolas starts a new Claude conversation about SpendSense:

1. **Check build progress** (Session tracker above)
2. **Identify current session** to work on (Session 4 is next)
3. **Reference the specific prompt** from IMPLEMENTATION_PLAN.md
4. **Verify prerequisites** from previous sessions
5. **Provide the prompt** with any session-specific context

**Example opening:**
> "Last time we completed Session 3 (Landing Page). We've pivoted to Claude API for PDF parsing. Ready to start Session 4. Here's the prompt for Cursor..."

---

## 📞 Escalation Paths

If Cursor can't solve something:

1. **Styling issues:** Check DESIGN_SYSTEM.md, verify exact colors
2. **Build errors:** `rm -rf .next && npm run dev`
3. **TypeScript errors:** Check types/index.ts matches usage
4. **API failures:** Check .env.local has correct ANTHROPIC_API_KEY
5. **Claude API errors:** Check Anthropic console for quota/billing
6. **Parsing issues:** Log raw Claude response, adjust prompt structure

---

*This document is the single source of truth for SpendSense development. Update it as the project evolves.*