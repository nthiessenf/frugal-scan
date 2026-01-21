# SpendSense - Implementation Plan

**Purpose:** Step-by-step Cursor prompts for building SpendSense MVP
**How to use:** Complete sessions in order. Copy each prompt directly into Cursor.

---

## Pre-Flight Checklist

Before starting Session 1, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Cursor IDE installed and working
- [ ] Claude API key from console.anthropic.com
- [ ] GitHub account for deployment
- [ ] Vercel account linked to GitHub

---

## Session 1: Project Scaffolding

**Goal:** Create the Next.js project with proper configuration

**Time estimate:** 15-20 minutes

### Prompt for Cursor:

```
Create a new Next.js 14 project called "spendsense" with TypeScript and Tailwind CSS v3.

1. Initialize the project structure:
   - Use App Router (NOT Pages Router)
   - Enable TypeScript strict mode
   - Configure Tailwind CSS v3

2. Create these files:

app/globals.css - Include:
   - Tailwind directives (@tailwind base, components, utilities)
   - Base styles: body with bg-[#f5f5f7] text-[#1d1d1f] antialiased
   - Utility class .glass-card with glassmorphism styles
   - Utility class .gradient-text for text gradients
   - Animation keyframes: float, fadeIn, shimmer

app/layout.tsx - Include:
   - System font stack: -apple-system, BlinkMacSystemFont, SF Pro Display, etc.
   - Background with subtle ambient gradient (radial gradients at 8% opacity)
   - Proper metadata: title "SpendSense", description about spending insights

app/page.tsx - Simple placeholder:
   - Centered text "SpendSense - Coming Soon"
   - Use the glass-card utility class

lib/utils.ts - The cn() helper:
   - Import clsx and tailwind-merge
   - Export cn function that merges Tailwind classes

types/index.ts - Empty file with comment:
   - "// TypeScript interfaces will be added here"

3. Configure tailwind.config.ts with these exact colors:
   - background: "#f5f5f7"
   - primary: "#1d1d1f"
   - secondary: "#6e6e73"
   - tertiary: "#86868b"

4. Create .env.local with placeholder:
   - ANTHROPIC_API_KEY=your_key_here

5. Update package.json scripts if needed

After creating files, run: npm install framer-motion lucide-react clsx tailwind-merge
```

### How to Test:
1. Run `npm run dev`
2. Open http://localhost:3000
3. Verify:
   - Background is light gray (#f5f5f7)
   - "Coming Soon" text appears in a frosted glass card
   - No console errors

### If Something Goes Wrong:

**Error: "Module not found"**
→ Run `npm install` again, make sure you're in the project directory

**Error: "Tailwind classes not working"**
→ Check tailwind.config.ts has the content paths configured correctly

**Background is white instead of #f5f5f7**
→ Check globals.css has the body styles applied

---

## Session 2: Core UI Components

**Goal:** Build reusable Button, Card, and UploadZone components

**Time estimate:** 25-30 minutes

**Prerequisites:** Session 1 complete, `npm run dev` works

### Prompt for Cursor:

```
Create three reusable UI components following the design system. Reference DESIGN_SYSTEM.md for exact styles.

1. components/ui/button.tsx

Create a Button component with these variants:
- "primary": gradient background (from-[#93c5fd] via-[#c4b5fd] to-[#fbcfe8]), white text, shadow-lg
- "secondary": bg-white/50 backdrop-blur-md, border border-black/10, dark text
- "ghost": transparent background, subtle hover state

Props interface:
- variant: 'primary' | 'secondary' | 'ghost' (default: 'primary')
- size: 'sm' | 'md' | 'lg' (default: 'md')
- className?: string
- children: React.ReactNode
- onClick?: () => void
- disabled?: boolean
- type?: 'button' | 'submit'

Sizes:
- sm: px-4 py-2 text-sm
- md: px-6 py-3 text-sm
- lg: px-8 py-4 text-base

All buttons should have:
- rounded-xl
- font-semibold
- transition-all duration-300
- hover:scale-105 (except when disabled)
- disabled:opacity-50 disabled:cursor-not-allowed

2. components/ui/card.tsx

Create a GlassCard component with full glassmorphism effect:

Base styles:
- bg-white/70 backdrop-blur-xl backdrop-saturate-[180%]
- rounded-3xl
- shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.03)]
- border border-black/[0.08]

Hover effect (when hover prop is true):
- transition-all duration-400
- hover:bg-white/85
- hover:-translate-y-2 hover:scale-[1.02]
- hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_8px_16px_rgba(147,197,253,0.12)]

Include gradient border reveal on hover using ::before pseudo-element
Include spotlight effect on hover using ::after pseudo-element

Props interface:
- children: React.ReactNode
- className?: string
- hover?: boolean (default: true)
- padding?: 'none' | 'sm' | 'md' | 'lg' (default: 'lg')

Padding sizes:
- none: p-0
- sm: p-4
- md: p-6
- lg: p-10

3. components/ui/upload-zone.tsx

Create an UploadZone component for drag-and-drop PDF upload:

Features:
- Drag and drop support
- Click to open file picker
- Accept only .pdf files
- Max file size: 10MB
- Visual states: idle, drag-over, uploading, success, error

Props interface:
- onFileSelect: (file: File) => void
- isLoading?: boolean
- error?: string
- className?: string

Idle state:
- Glass card styling
- Upload cloud icon (from lucide-react)
- Text: "Drop your bank statement here"
- Subtext: "or click to browse (PDF only, max 10MB)"
- Dashed border

Drag-over state:
- Border color changes to accent blue (#93c5fd)
- Background slightly more opaque
- Scale up slightly

Uploading state:
- Show loading spinner
- Text: "Processing..."

Error state:
- Red border
- Error message displayed

Use React useState for managing drag state.
Use useCallback for event handlers.
Prevent default on drag events to enable drop.

After creating these files, update app/page.tsx to showcase all three components for testing.
```

### How to Test:
1. Check http://localhost:3000 shows component showcase
2. Test each button variant (click, hover)
3. Test card hover animation (lifts and scales)
4. Test upload zone:
   - Drag a PDF over it (should highlight)
   - Drop a PDF (should trigger onFileSelect)
   - Try dropping a non-PDF (should reject)

### If Something Goes Wrong:

**Hover effects not working on card**
→ Check that the card has `position: relative` and `overflow: hidden`

**Upload zone not accepting drops**
→ Make sure `e.preventDefault()` is called on both `onDragOver` and `onDrop`

**Gradient border not visible**
→ Check the ::before pseudo-element has proper mask properties

---

## Session 3: Landing Page

**Goal:** Build the complete landing page with hero and features

**Time estimate:** 30-35 minutes

**Prerequisites:** Session 2 complete, all UI components working

### Prompt for Cursor:

```
Build the SpendSense landing page with a hero section and "How It Works" section. Reference DESIGN_SYSTEM.md for all styling.

1. components/sections/hero.tsx

Create a Hero section component:

Structure:
- Full viewport height section (min-h-screen)
- Centered content with max-w-4xl
- Padding: py-20 px-5

Content:
- Small label at top: "PERSONAL FINANCE INSIGHTS" 
  - Style: text-xs font-semibold uppercase tracking-wider text-[#86868b]
  
- Main headline: "See where your money really goes"
  - Style: text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] text-[#1d1d1f]
  - Add subtle gradient text effect on "really"
  
- Subheadline: "Upload your bank statement and get AI-powered spending insights in 60 seconds. No account linking. No subscriptions. Just clarity."
  - Style: text-lg md:text-xl text-[#6e6e73] max-w-2xl mx-auto mt-6

- CTA Button: "Upload Your Statement →"
  - Use primary Button component
  - Large size
  - Add margin-top: mt-10
  - onClick should scroll to upload section or trigger file picker

- Trust indicators below button:
  - Row of three small items with icons
  - "🔒 Your data stays private" 
  - "⚡ Results in 60 seconds"
  - "💳 No account linking"
  - Style: text-sm text-[#86868b] flex gap-6 mt-6

Add subtle floating animation to a decorative gradient orb in the background.

2. components/sections/how-it-works.tsx

Create a "How It Works" section:

Structure:
- Section with padding py-20 px-5
- Max width container max-w-6xl mx-auto

Content:
- Section title: "How it works"
  - Style: text-3xl md:text-4xl font-bold tracking-[-0.03em] text-center mb-12

- Grid of 3 cards:
  - grid grid-cols-1 md:grid-cols-3 gap-5

Card 1 - Upload:
- Icon: Upload from lucide-react (in a small gradient circle)
- Title: "Upload Statement"
- Description: "Drop your bank or credit card statement PDF. We support all major banks."
- Number badge: "01" in corner

Card 2 - Analyze:
- Icon: Sparkles from lucide-react
- Title: "AI Analysis"
- Description: "Our AI categorizes transactions, detects subscriptions, and finds patterns."
- Number badge: "02"

Card 3 - Insights:
- Icon: PieChart from lucide-react
- Title: "Get Insights"
- Description: "See exactly where your money goes with actionable recommendations."
- Number badge: "03"

Each card should:
- Use the GlassCard component
- Have hover effects enabled
- Be centered on mobile, side-by-side on desktop

3. components/sections/upload-section.tsx

Create an upload section that includes the UploadZone:

Structure:
- Section with id="upload" for scroll targeting
- Padding py-20 px-5
- Centered with max-w-2xl

Content:
- Title: "Ready to see your spending?"
  - Style: text-2xl md:text-3xl font-bold text-center mb-8
  
- UploadZone component (full width)

- Privacy note below:
  - "🔒 Your statement is processed securely and never stored"
  - Style: text-sm text-[#86868b] text-center mt-4

4. Update app/page.tsx

Compose the landing page:
- Import and render Hero section
- Import and render HowItWorks section
- Import and render UploadSection
- Add smooth scroll behavior to html element

For now, the UploadZone onFileSelect can just console.log the file. We'll wire it up later.

5. Add to globals.css:

Smooth scrolling:
html { scroll-behavior: smooth; }

Any additional animations needed for the floating orb effect.
```

### How to Test:
1. Landing page loads with all sections visible
2. Scroll is smooth when clicking CTA
3. All three "How it works" cards have hover effects
4. Upload zone is functional (logs file to console)
5. Test at 375px width (mobile) - should stack properly
6. Test at 1440px width (desktop) - should be nicely spaced

### If Something Goes Wrong:

**Sections not scrolling smoothly**
→ Check that `scroll-behavior: smooth` is in globals.css on `html`

**Cards not aligning on desktop**
→ Check grid classes: `grid grid-cols-1 md:grid-cols-3`

**Hero text too big on mobile**
→ Check responsive text classes (text-5xl md:text-6xl lg:text-7xl)

---

## Session 4: PDF Parsing Backend

**Goal:** Create API endpoint that extracts transactions from PDF

**Time estimate:** 35-40 minutes

**Prerequisites:** Session 3 complete

### Prompt for Cursor:

```
Create the PDF parsing infrastructure for bank statements.

1. Install pdf-parse:
Run: npm install pdf-parse
Run: npm install --save-dev @types/node

2. Create types/index.ts with these interfaces:

// Raw transaction extracted from PDF
export interface RawTransaction {
  date: string;           // Original date string from PDF
  description: string;    // Full transaction description
  amount: number;         // Positive for credits, negative for debits
  type: 'debit' | 'credit';
}

// Result from PDF parsing
export interface ParsedStatement {
  transactions: RawTransaction[];
  bankName: string | null;
  accountType: string | null;
  period: {
    start: string | null;
    end: string | null;
  };
  rawText: string;        // For debugging
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

3. Create lib/parse-pdf.ts:

Function: extractTextFromPDF(buffer: Buffer): Promise<string>
- Use pdf-parse to extract text
- Return the full text content

Function: parseTransactions(text: string): RawTransaction[]
- Parse transactions using regex patterns for common bank formats
- Handle formats for:
  - Chase: "MM/DD DESCRIPTION AMOUNT" or "MM/DD/YYYY DESCRIPTION -$XX.XX"
  - Bank of America: "MM/DD/YY DESCRIPTION XX.XX"
  - Wells Fargo: "MM/DD DESCRIPTION XX.XX"
  - Generic: Look for date patterns followed by text and dollar amounts

Patterns to match:
- Dates: MM/DD, MM/DD/YY, MM/DD/YYYY
- Amounts: $X,XXX.XX or X,XXX.XX or -$X.XX
- Identify debits vs credits (negative amounts, or keywords like "Payment", "Credit", "Refund")

Function: detectBankName(text: string): string | null
- Look for bank names in the text
- Return "Chase", "Bank of America", "Wells Fargo", "Capital One", "Citi", or null

Function: detectDateRange(text: string): { start: string | null, end: string | null }
- Look for "Statement Period" or date ranges
- Extract start and end dates

Main export: parseStatement(buffer: Buffer): Promise<ParsedStatement>
- Combine all functions
- Return structured result
- Include error handling for malformed PDFs

4. Create app/api/parse-statement/route.ts:

POST endpoint that:
- Accepts FormData with a 'file' field
- Validates file is PDF (check MIME type)
- Validates file size < 10MB
- Calls parseStatement() 
- Returns ApiResponse<ParsedStatement>

Error handling:
- 400 for missing file
- 400 for non-PDF file
- 400 for file too large
- 500 for parsing errors

Include helpful error messages:
- "No file uploaded"
- "Invalid file type. Please upload a PDF."
- "File too large. Maximum size is 10MB."
- "Could not parse PDF. Please ensure it's a valid bank statement."

5. Add logging:
- Log file name and size on upload
- Log number of transactions found
- Log detected bank name
- Don't log actual transaction data (privacy)

Test the endpoint by creating a simple test in the browser console or using curl.
```

### How to Test:
1. No TypeScript errors in terminal
2. Test with curl:
```bash
curl -X POST http://localhost:3000/api/parse-statement \
  -F "file=@/path/to/statement.pdf"
```
3. Response should include transactions array
4. Try uploading a non-PDF - should get error message

### If Something Goes Wrong:

**Error: "Cannot find module 'pdf-parse'"**
→ Run `npm install pdf-parse` again

**PDF parses but no transactions found**
→ Check the regex patterns in parseTransactions - bank formats vary wildly

**Memory errors on large files**
→ Add the file size check before processing

---

## Session 5: Transaction Categorization

**Goal:** Categorize transactions and detect subscriptions

**Time estimate:** 25-30 minutes

**Prerequisites:** Session 4 complete

### Prompt for Cursor:

```
Create transaction categorization and subscription detection logic.

1. Update types/index.ts - Add these types:

// Spending categories
export type Category = 
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

// Category display info
export interface CategoryInfo {
  id: Category;
  label: string;
  color: string;
  icon: string;  // lucide-react icon name
}

// Categorized transaction
export interface CategorizedTransaction extends RawTransaction {
  category: Category;
  merchant: string;  // Cleaned merchant name
}

// Detected subscription
export interface Subscription {
  name: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'yearly';
  lastCharge: string;
  category: 'streaming' | 'software' | 'fitness' | 'news' | 'other';
}

2. Create lib/constants.ts:

Export CATEGORIES: CategoryInfo[] with:
- food_dining: "Food & Dining", color #f97316, icon "UtensilsCrossed"
- shopping: "Shopping", color #8b5cf6, icon "ShoppingBag"
- transportation: "Transportation", color #3b82f6, icon "Car"
- subscriptions: "Subscriptions", color #ec4899, icon "RefreshCw"
- bills_utilities: "Bills & Utilities", color #6366f1, icon "Zap"
- entertainment: "Entertainment", color #f43f5e, icon "Gamepad2"
- health_fitness: "Health & Fitness", color #10b981, icon "Heart"
- travel: "Travel", color #0ea5e9, icon "Plane"
- income: "Income", color #22c55e, icon "TrendingUp"
- transfer: "Transfer", color #94a3b8, icon "ArrowLeftRight"
- other: "Other", color #64748b, icon "MoreHorizontal"

Export MERCHANT_KEYWORDS: Record<string, Category> with common merchants:
- Food: "doordash", "uber eats", "grubhub", "mcdonalds", "starbucks", "chipotle", "subway", "dominos", "panera", "chick-fil-a", "wendys", "taco bell", "dunkin", "whole foods", "trader joe", "safeway", "kroger", "costco food"
- Shopping: "amazon", "target", "walmart", "costco", "best buy", "apple.com", "ebay", "etsy", "ikea", "home depot", "lowes"
- Transportation: "uber", "lyft", "shell", "chevron", "exxon", "bp", "parking", "metro", "transit"
- Subscriptions: "netflix", "spotify", "hulu", "disney+", "hbo", "apple music", "youtube premium", "amazon prime", "adobe", "microsoft 365", "dropbox", "icloud"
- Bills: "at&t", "verizon", "t-mobile", "comcast", "xfinity", "electric", "water", "gas bill", "insurance"
- Entertainment: "steam", "playstation", "xbox", "nintendo", "movie", "cinema", "concert", "ticketmaster"
- Health: "gym", "fitness", "cvs", "walgreens", "pharmacy"
- Travel: "airline", "hotel", "airbnb", "expedia", "booking.com", "united", "delta", "american air", "southwest"

3. Create lib/categorize.ts:

Function: cleanMerchantName(description: string): string
- Remove common prefixes (POS, DEBIT, PURCHASE, etc.)
- Remove dates and reference numbers
- Remove location suffixes
- Title case the result
- Examples: "POS DEBIT STARBUCKS #1234 NYC" → "Starbucks"

Function: categorizeTransaction(transaction: RawTransaction): CategorizedTransaction
- Clean the merchant name first
- Check against MERCHANT_KEYWORDS (case-insensitive)
- Check for income patterns (payroll, direct deposit, salary)
- Check for transfer patterns (transfer, zelle, venmo to self)
- Return with category and cleaned merchant name

Function: categorizeAll(transactions: RawTransaction[]): CategorizedTransaction[]
- Map all transactions through categorizeTransaction

Function: detectSubscriptions(transactions: CategorizedTransaction[]): Subscription[]
- Group by merchant name
- Find merchants with:
  - Recurring charges (same amount, monthly interval ~28-32 days)
  - 2+ occurrences
- Determine frequency based on interval
- Return sorted by amount descending

4. Create a test utility (optional):
- Export a testCategorization function that logs results for debugging
```

### How to Test:
1. Import categorizeAll in a test file or API route
2. Pass sample transactions:
```javascript
const sample = [
  { date: '01/15', description: 'UBER EATS ORDER', amount: -25.50, type: 'debit' },
  { date: '01/16', description: 'NETFLIX.COM', amount: -15.99, type: 'debit' },
];
console.log(categorizeAll(sample));
```
3. Verify categories are correct

### If Something Goes Wrong:

**All transactions categorized as "other"**
→ Check keyword matching is case-insensitive (toLowerCase())

**Merchant names still messy**
→ Add more cleanup patterns to cleanMerchantName

---

## Session 6: Claude AI Integration

**Goal:** Generate insights using Claude API

**Time estimate:** 30-35 minutes

**Prerequisites:** Session 5 complete, ANTHROPIC_API_KEY in .env.local

### Prompt for Cursor:

```
Integrate Claude API for generating spending insights.

1. Install Anthropic SDK:
Run: npm install @anthropic-ai/sdk

2. Update types/index.ts - Add:

export interface Insight {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'positive';
}

export interface SavingsTip {
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SpendingSummary {
  totalSpent: number;
  totalIncome: number;
  netCashFlow: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: Category;
  subscriptionTotal: number;
}

export interface AnalysisResult {
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

3. Create lib/analysis.ts:

Function: calculateSummary(transactions: CategorizedTransaction[]): SpendingSummary
- Sum all debits for totalSpent
- Sum all credits for totalIncome
- Calculate netCashFlow
- Find top spending category
- Calculate subscription total from subscriptions category

Function: getCategoryBreakdown(transactions: CategorizedTransaction[]): CategoryBreakdown[]
- Group transactions by category
- Calculate total and percentage for each
- Sort by amount descending
- Exclude income and transfer categories from spending breakdown

Function: getTopMerchants(transactions: CategorizedTransaction[], limit = 10): TopMerchant[]
- Group by merchant name
- Sum amounts and count transactions
- Sort by amount descending
- Return top N

4. Create lib/claude.ts:

Initialize Anthropic client with ANTHROPIC_API_KEY from process.env

Function: generateInsights(
  summary: SpendingSummary,
  categoryBreakdown: CategoryBreakdown[],
  topMerchants: TopMerchant[],
  subscriptions: Subscription[]
): Promise<{ insights: Insight[], tips: SavingsTip[] }>

Create a prompt that:
- Provides the spending data in a structured format
- Asks for exactly 5 insights
- Asks for exactly 3 actionable savings tips
- Requests JSON response format
- Specifies the exact structure expected

System prompt:
"You are a friendly personal finance advisor. Analyze spending data and provide helpful, non-judgmental insights. Be specific with numbers. Focus on actionable observations."

User prompt structure:
- Total spent this period: $X
- Category breakdown: (list)
- Top merchants: (list)
- Detected subscriptions: (list)

Request:
"Provide your analysis as JSON with this exact structure:
{
  "insights": [
    { "title": "short title", "description": "2-3 sentences", "severity": "info|warning|positive" }
  ],
  "tips": [
    { "title": "short title", "description": "how to save", "potentialSavings": number, "difficulty": "easy|medium|hard" }
  ]
}"

Guidelines for insights:
- Include at least one positive observation
- Flag if one category is unusually high
- Note subscription total if significant
- Compare ratios (e.g., dining out vs groceries)

Parse the JSON response and validate structure before returning.

5. Create app/api/analyze/route.ts:

POST endpoint that:
- Accepts JSON body with categorized transactions
- Calls calculateSummary
- Calls getCategoryBreakdown
- Calls getTopMerchants
- Calls detectSubscriptions
- Calls generateInsights
- Returns complete AnalysisResult

Error handling:
- 400 for missing/invalid data
- 500 for Claude API errors (with friendly message)
- Don't expose API key or detailed errors

Add timeout handling (Claude can be slow):
- Set reasonable timeout (30 seconds)
- Return partial results if AI fails
```

### How to Test:
1. Ensure ANTHROPIC_API_KEY is set in .env.local
2. Call the API with sample data:
```javascript
fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ transactions: [...] })
})
```
3. Check insights are relevant and well-formatted
4. Verify JSON structure matches types

### If Something Goes Wrong:

**Error: "Invalid API Key"**
→ Check .env.local has correct ANTHROPIC_API_KEY (no quotes needed)

**Claude returns malformed JSON**
→ Add try/catch around JSON.parse, log raw response for debugging

**Timeout errors**
→ Reduce the amount of data sent to Claude, increase timeout

---

## Session 7: Results Dashboard

**Goal:** Build the visual results page with charts

**Time estimate:** 40-45 minutes

**Prerequisites:** Session 6 complete

### Prompt for Cursor:

```
Build the results dashboard with charts and insights display.

1. Install Recharts:
Run: npm install recharts

2. Create components/charts/spending-pie.tsx:

A pie chart showing spending by category:
- Use Recharts PieChart, Pie, Cell, Tooltip, Legend
- Props: data: CategoryBreakdown[]
- Wrap in GlassCard component
- Title: "Spending by Category"
- Use colors from CATEGORIES constant
- Show percentage and amount in tooltip
- Responsive: smaller on mobile
- Add a "Total Spent" display in the center of the donut

3. Create components/charts/spending-bar.tsx:

A horizontal bar chart showing top merchants:
- Use Recharts BarChart, Bar, XAxis, YAxis, Tooltip
- Props: data: TopMerchant[]
- Wrap in GlassCard component
- Title: "Top Merchants"
- Horizontal layout (layout="vertical")
- Use gradient fill for bars
- Show amount on hover
- Limit to top 8 merchants
- Responsive sizing

4. Create components/sections/insights-grid.tsx:

Display AI-generated insights in a bento grid:
- Props: insights: Insight[]
- Grid: 1 col mobile, 2 col desktop
- Each insight in a GlassCard

Card content:
- Icon based on severity:
  - info: Info icon, blue accent
  - warning: AlertTriangle icon, orange accent
  - positive: CheckCircle icon, green accent
- Title in font-semibold
- Description in text-secondary

Add subtle left border color based on severity.

5. Create components/sections/subscriptions-list.tsx:

Display detected subscriptions:
- Props: subscriptions: Subscription[]
- Wrap in GlassCard
- Title: "Detected Subscriptions"

List items:
- Subscription name
- Amount per frequency (e.g., "$15.99/month")
- Small category badge

Footer:
- Total monthly subscription cost
- Styled prominently

Empty state:
- "No recurring subscriptions detected"

6. Create components/sections/summary-header.tsx:

Overview stats at top of dashboard:
- Props: summary: SpendingSummary

Display in a row of stat cards (flex, wrap on mobile):
- Total Spent (large number, primary color)
- Transaction Count
- Average Transaction
- Top Category (with icon)

Each stat:
- Small label above
- Large number/value
- Subtle glass card background

7. Create components/sections/tips-section.tsx:

Display savings tips:
- Props: tips: SavingsTip[]
- Title: "Ways to Save"

Each tip in a card:
- Title
- Description
- Potential savings badge: "Save up to $X/month"
- Difficulty badge with color coding

8. Create app/results/page.tsx:

Layout the full dashboard:
- Summary header at top
- Two-column grid below (1 col mobile):
  - Left: Spending pie chart
  - Right: Top merchants bar chart
- Full width: Insights grid
- Two-column below:
  - Left: Subscriptions list
  - Right: Tips section
- Bottom: Export/Share buttons + "Analyze Another" link

For now, use mock data to build the layout. We'll connect real data in Session 8.

Mock data structure should match AnalysisResult type.

Add a "Download Report" button that triggers window.print() for MVP.
Add a "Start Over" button that links back to home page.

9. Ensure all components follow DESIGN_SYSTEM.md:
- Glassmorphism cards
- Correct colors
- Hover effects where appropriate
- Responsive at all breakpoints
```

### How to Test:
1. Navigate to /results
2. See all chart and insight components with mock data
3. Test responsiveness at 375px, 768px, 1440px
4. Verify hover effects on cards
5. Test "Download Report" opens print dialog
6. Test "Start Over" returns to home

### If Something Goes Wrong:

**Recharts not rendering**
→ Check you're using "use client" directive at top of chart components

**Charts too small on mobile**
→ Add ResponsiveContainer wrapper from Recharts

**Colors don't match design system**
→ Use exact hex values from CATEGORIES constant

---

## Session 8: Connect Everything

**Goal:** Wire up the full flow from upload to results

**Time estimate:** 35-40 minutes

**Prerequisites:** Sessions 1-7 complete

### Prompt for Cursor:

```
Connect all components into a working end-to-end flow.

1. Create lib/hooks/useAnalysis.ts:

A custom hook to manage the analysis flow:

State:
- status: 'idle' | 'uploading' | 'parsing' | 'analyzing' | 'complete' | 'error'
- progress: number (0-100)
- result: AnalysisResult | null
- error: string | null

Function: analyzeStatement(file: File)
- Set status to 'uploading', progress to 10
- Create FormData, POST to /api/parse-statement
- Set status to 'parsing', progress to 40
- Categorize transactions client-side
- Detect subscriptions
- Set status to 'analyzing', progress to 70
- POST to /api/analyze
- Set status to 'complete', progress to 100
- Store result

Function: reset()
- Clear all state back to idle

Return: { status, progress, result, error, analyzeStatement, reset }

2. Create components/sections/processing-screen.tsx:

Full-screen loading state during analysis:
- Props: status, progress

Centered content:
- Animated gradient orb (pulsing)
- Progress bar with gradient fill
- Status message based on current status:
  - 'uploading': "Uploading your statement..."
  - 'parsing': "Reading transactions..."
  - 'analyzing': "AI is analyzing your spending..."
- Animated dots or shimmer effect
- "This usually takes about 30 seconds"

Use framer-motion for smooth animations.
Glass card wrapper for the content area.

3. Update app/page.tsx:

Import and use the useAnalysis hook.

Flow:
- When file is selected in UploadZone, call analyzeStatement(file)
- While status is uploading/parsing/analyzing, show ProcessingScreen
- When status is 'complete', redirect to /results with data
- When status is 'error', show error message with retry button

Pass data to results page:
- Option A: Use React Context (create AnalysisContext)
- Option B: Store in sessionStorage temporarily
- Recommend Option A for cleaner code

4. Create contexts/AnalysisContext.tsx:

Context provider for sharing analysis results:
- Store AnalysisResult
- Provide setter function
- Wrap app in provider in layout.tsx

5. Update app/results/page.tsx:

- Get data from AnalysisContext
- If no data, redirect to home page
- Replace mock data with real data from context
- Pass appropriate data to each component

6. Add error handling UI:

Create components/ui/error-message.tsx:
- Glass card with red accent
- Error icon
- Error message
- "Try Again" button
- "Upload Different File" link

Show this when:
- PDF parsing fails
- API calls fail
- Invalid file type

7. Add empty state handling:

If no transactions found:
- Show helpful message
- Suggest checking file is a valid statement
- Offer to try different file

8. Final polish:

- Add page transitions using framer-motion
- Ensure loading states are smooth
- Add success animation when analysis completes
- Test complete flow multiple times

9. Update the upload section on home page:

- Show selected file name after selection
- Allow canceling/changing file before processing starts
- Show file size
```

### How to Test:
1. Start from home page
2. Upload a real bank statement PDF
3. Watch processing screen with progress
4. Verify redirect to results with real data
5. Check all charts show actual data
6. Test error handling with invalid file
7. Test "Start Over" flow
8. Test page refresh on results (should redirect home)

### If Something Goes Wrong:

**Data not persisting to results page**
→ Check Context is wrapping the app in layout.tsx

**Processing screen stuck**
→ Add console.logs to trace where it's failing

**Results show but charts empty**
→ Check data shape matches what components expect

---

## Session 9: Polish & Deploy

**Goal:** Final polish and deploy to Vercel

**Time estimate:** 30-35 minutes

**Prerequisites:** Session 8 complete, full flow working

### Prompt for Cursor:

```
Final polish and prepare for deployment.

1. SEO and Metadata:

Update app/layout.tsx:
- Title: "SpendSense - AI-Powered Spending Insights"
- Description: "Upload your bank statement and get instant AI-powered insights into your spending habits. Free, private, no account linking required."
- Open Graph tags for social sharing
- Twitter card metadata
- Favicon (create simple icon or use emoji favicon)

Create app/opengraph-image.tsx or add static image:
- Social sharing preview image
- Show app name and tagline

2. Error boundaries:

Create app/error.tsx:
- Catch-all error page
- Friendly error message
- "Go Home" button
- Don't expose technical details

Create app/results/error.tsx:
- Specific error for results page

Create app/not-found.tsx:
- Custom 404 page
- Helpful message
- Link back to home

3. Loading states:

Create app/loading.tsx:
- Global loading state
- Subtle spinner or skeleton

Create app/results/loading.tsx:
- Results page loading state

4. Accessibility audit:

- Add aria-labels to all buttons
- Ensure color contrast meets WCAG AA (check with tool)
- Add alt text to any images
- Ensure focus states are visible
- Test keyboard navigation through entire flow

5. Performance optimization:

- Add loading="lazy" to below-fold images
- Check no unused imports
- Verify bundle size is reasonable
- Test Lighthouse score (aim for >90)

6. Mobile testing checklist:

Test at 375px width:
- [ ] Hero text readable
- [ ] Upload zone works with tap
- [ ] Charts are legible
- [ ] All buttons tappable (min 44px)
- [ ] No horizontal scroll

7. Environment variables documentation:

Create .env.example:
```
# Required
ANTHROPIC_API_KEY=your_api_key_here

# Optional (future)
# SUPABASE_URL=
# SUPABASE_ANON_KEY=
```

8. README.md:

Write comprehensive README:
- Project description
- Features list
- Tech stack
- Getting started (clone, install, env vars, run)
- Deployment instructions
- Future roadmap
- License

9. Prepare for Vercel:

- Ensure all environment variables documented
- Test build locally: npm run build
- Fix any build errors
- Create GitHub repository
- Push code to GitHub
- Connect repo to Vercel
- Add ANTHROPIC_API_KEY to Vercel environment variables
- Deploy

10. Post-deploy verification:

- [ ] Home page loads
- [ ] Upload works
- [ ] Analysis completes
- [ ] Results display correctly
- [ ] Mobile works
- [ ] SSL certificate active
- [ ] No console errors

11. Optional enhancements if time:

- Add confetti animation on successful analysis
- Add share results via link (would need temp storage)
- Add feedback button
- Add privacy policy page
```

### How to Test:
1. Run `npm run build` - should complete without errors
2. Run `npm run start` - test production build locally
3. Check Lighthouse scores
4. Deploy to Vercel and test production URL
5. Test on actual mobile device

### If Something Goes Wrong:

**Build fails**
→ Check for TypeScript errors, missing dependencies

**Vercel deploy fails**
→ Check build logs, ensure env vars are set

**Works locally but not in production**
→ Check environment variables are set in Vercel dashboard

---

## 🎉 Congratulations!

If you've completed all 9 sessions, you have a working MVP of SpendSense!

### What You've Built:
- Landing page with glassmorphism design
- PDF upload and parsing
- Transaction categorization
- AI-powered insights generation
- Interactive results dashboard
- Full responsive design

### Suggested Next Steps (V1.1):
1. Add more bank format support
2. User accounts with Supabase Auth
3. Save analysis history
4. Multi-statement comparison
5. Custom category rules

### Celebrate! 🚀
You built a real web app with AI integration. That's impressive!
