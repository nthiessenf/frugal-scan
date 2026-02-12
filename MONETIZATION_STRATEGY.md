# FrugalScan Monetization Strategy

**Last Updated:** February 2025

---

## Pricing Tiers

### Free Tier
- **Price:** $0
- **Limit:** 3 statement analyses per month
- **Features:**
  - Basic category breakdown
  - Top 10 merchants chart
  - 3 AI insights
  - Category drill-down

**Purpose:** Lead generation, product validation, build trust

---

### Pro Tier
- **Price:** $4.99/month or $39/year (35% savings)
- **Limit:** Unlimited analyses
- **Features:**
  - Everything in Free
  - 5 AI insights (vs 3)
  - Month-over-month spending trends
  - Budget tracking & alerts
  - PDF export

**Purpose:** Core revenue driver, target "Curious Kate" persona

---

### Power Tier (Future - v2.0)
- **Price:** $9.99/month
- **Limit:** Unlimited
- **Features:**
  - Everything in Pro
  - Multi-account consolidation
  - Household sharing (2 accounts)
  - Priority support

**Purpose:** Capture high-intent users, increase ARPU

---

## Unit Economics

| Metric | Value |
|--------|-------|
| API cost per analysis | ~$0.07 |
| Free user cost (3 analyses) | ~$0.21/month |
| Pro user cost (10 analyses avg) | ~$0.70/month |
| Pro gross margin | ~86% |

---

## Revenue Projections

| Scenario | Free Users | Pro Users | MRR | Monthly Profit |
|----------|-----------|-----------|-----|----------------|
| Early | 100 | 10 | $50 | ~$30 |
| Growth | 500 | 75 | $375 | ~$300 |
| Scale | 1,000 | 150 | $750 | ~$600 |

*Assumes 10-15% free-to-paid conversion rate*

---

## Implementation Phases

### Phase 1: Free Tier Gates ✅ Complete
- Usage tracking in localStorage
- "X of 3 free analyses" indicator
- Upgrade modal when limit reached
- /pro landing page with email capture

### Phase 2: Manual Payments (Next)
- Stripe Payment Links
- Manual verification (email confirmation)
- localStorage Pro flag
- Works for first 10-50 customers

### Phase 3: Automated Payments
- Stripe Checkout integration
- Webhook for subscription events
- Automatic Pro tier activation
- Subscription management

### Phase 4: Pro Features (v1.3)
- Budget goals - set & track spending limits (Pro-only)
- Multi-statement trends - month-over-month (Pro-only)
- Transaction editing - let users correct categorization
- PDF export (Pro-only)

### Phase 5: Performance + Compatibility (v1.4)
- Faster processing - optimize for <30 second analysis
- More banks - test and optimize for more statement formats

### Phase 6: Platform + Power Tier (v2.0)
- Supabase database + user accounts (Auth)
- History & saved analyses
- Multi-account consolidation
- Power tier launch ($9.99/mo)

---

## Conversion Strategy

### Free → Pro Triggers
1. **Hard limit:** 3 analyses/month creates natural upgrade pressure
2. **Feature teaser:** "Upgrade to see spending trends"
3. **Value demonstration:** Free tier shows enough value to want more

### Retention Levers
1. **Budget tracking:** Creates recurring engagement
2. **Historical trends:** More valuable over time (data lock-in)
3. **Annual discount:** 35% off encourages commitment

---

## Key Metrics to Track

| Metric | Target |
|--------|--------|
| Free-to-Pro conversion | >10% |
| Monthly churn | <5% |
| Annual vs monthly ratio | >30% annual |
| Analyses per Pro user | 5-15/month |

---

## Pricing Rationale

**Why $4.99/month:**
- Below psychological "$5" barrier
- Covers costs easily (86% margin)
- Competitive with YNAB ($14.99), Copilot ($10.99)
- Room to increase later if value proven

**Why 3 free analyses:**
- Enough to demonstrate value
- Not enough for power users
- Creates natural monthly touchpoint
- Easy to track/implement

**Why 35% annual discount:**
- Industry standard for SaaS
- Improves cash flow
- Reduces churn (commitment)
- $39/year feels like a "deal"

---

## Competitive Positioning

| App | Price | Requires Bank Link | Our Advantage |
|-----|-------|-------------------|---------------|
| Mint | Free | Yes | Privacy |
| YNAB | $14.99/mo | Yes | Price + Privacy |
| Copilot | $10.99/mo | Yes | Price + Privacy |
| FrugalScan | $4.99/mo | No | Privacy-first, simple |

**Core differentiator:** Privacy-first (no account linking) at a lower price point.

---

*This strategy will evolve based on user feedback and conversion data.*
