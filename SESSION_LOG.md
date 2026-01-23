# SpendSense - Development Session Log

**Purpose:** Track progress, issues, and learnings across development sessions.

---

## Session 1: January 21, 2025

### ✅ What Was Completed

**Session 1: Project Scaffolding**
- Created Next.js 14 project with TypeScript and Tailwind CSS v3
- Set up design system colors and glassmorphism utilities
- Configured project structure
- Connected to GitHub repo: `https://github.com/nthiessenf/spend-sense.git`

**Session 2: Core UI Components**
- Created `components/ui/button.tsx` (primary, secondary, ghost variants)
- Created `components/ui/card.tsx` (GlassCard with hover effects)
- Created `components/ui/upload-zone.tsx` (drag & drop PDF upload)

**Session 3: Landing Page**
- Created `components/sections/hero.tsx` (headline, CTA, trust indicators)
- Created `components/sections/how-it-works.tsx` (3-step cards)
- Created `components/sections/upload-section.tsx` (upload zone wrapper)
- Landing page looks great with all styling intact

---

### 🔄 Architecture Decision: PDF Parsing Approach

**Decision Made: January 22, 2025**

After encountering persistent issues with `pdf-parse` webpack compatibility, we've made a strategic pivot to use **Claude API for PDF parsing** instead of regex-based text extraction.

#### Why We Changed

**Technical Reasons:**
- `pdf-parse` + regex approach proved brittle (estimated 70-85% accuracy across different bank formats)
- Next.js webpack bundling conflicts with pdf-parse library
- Regex patterns require constant maintenance for each bank format
- Poor handling of edge cases (refunds, pending transactions, unusual formats)

**Better Solution:**
- Claude can read PDFs natively and understand transaction context
- Expected 99%+ accuracy across all bank statement formats
- Simpler, more maintainable codebase (no complex regex patterns)
- We're already using Claude for insights, so this unifies our architecture

#### Risk Mitigation Strategy

While Claude is probabilistic (not deterministic like regex), we're implementing comprehensive safeguards:

1. **Strict JSON output validation** - Enforce exact schema, validate all fields
2. **Cross-validation with statement totals** - Check parsed amounts match statement summary
3. **Confidence scoring** - Flag low-confidence transactions for review
4. **User review step** - Users confirm/edit transactions before analysis
5. **Monitoring & logging** - Track parsing success rates and error patterns

**Expected Accuracy:** 99%+ (vs 70-85% with regex)  
**Cost per parse:** ~$0.10-0.15 per statement (acceptable for MVP)

#### Implementation Changes

**Files to delete:**
- `lib/parse-pdf.ts` (pdf-parse logic - no longer needed)
- Remove `pdf-parse` from package.json

**Files to create (Session 4):**
- `lib/parse-with-claude.ts` - Claude API PDF parsing
- `lib/validate-transactions.ts` - Transaction validation rules
- Update `app/api/parse-statement/route.ts` - Use Claude instead of pdf-parse

---

### 🛠️ Issues Encountered & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Styles disappearing | Cursor modifying component files strips Tailwind classes | Run `git checkout components/` to restore |
| Port 3000 in use | Closing terminal without stopping server leaves orphan process | Run `killall node` before `npm run dev` |
| "Missing required error components" | Corrupted .next cache | Run `rm -rf .next` then `npm run dev` |
| Multiple ports (3000, 3001, 3002...) | Multiple orphan server processes | Run `killall node` to kill all |
| 404 errors | Cache corruption after code changes | Run `rm -rf .next` and restart |
| pdf-parse import errors | Webpack bundling incompatibility | RESOLVED: Pivoting to Claude API |

---

### 📚 Key Learnings

**Technical Concepts Covered:**
1. **Components** - Reusable UI pieces (Button, Card, UploadZone)
2. **Props** - Settings passed to components (`<Button size="lg">`)
3. **State** - Data that changes (`useState` for loading, errors)
4. **API Routes** - Server-side code in `app/api/` folder
5. **Architecture decisions** - Sometimes "simple" (regex) is harder than "advanced" (AI)
6. **Probabilistic vs Deterministic** - Understanding trade-offs in ML-based tools

**Development Workflow:**
- Always stop server with `Ctrl+C` before closing terminal
- Use `killall node` if ports are stuck
- Use `rm -rf .next` to clear cache when styles break
- Commit working code before making big changes
- Use `git checkout <file>` to restore specific files
- Document architectural decisions for future reference

**Product Thinking:**
- Don't fall for "we can build it ourselves" trap
- Sometimes the "advanced" solution is actually simpler
- Validate MVP assumptions before over-engineering
- User review steps can catch ML errors effectively

**Cursor Tips:**
- Break big prompts into smaller steps
- Say "DO NOT modify any other files" to prevent unwanted changes
- Cursor sometimes strips Tailwind classes when modifying components

---

### 📁 Current File Structure
```
SpendSense/
├── app/
│   ├── globals.css ✅
│   ├── layout.tsx ✅
│   ├── page.tsx ✅
│   └── api/
│       └── parse-statement/
│           └── route.ts ⏳ (needs rewrite with Claude API)
├── components/
│   ├── ui/
│   │   ├── button.tsx ✅
│   │   ├── card.tsx ✅
│   │   └── upload-zone.tsx ✅
│   └── sections/
│       ├── hero.tsx ✅
│       ├── how-it-works.tsx ✅
│       └── upload-section.tsx ✅
├── lib/
│   ├── utils.ts ✅
│   ├── validate-transactions.ts 📝 (to be created in Session 4)
│   └── parse-with-claude.ts 📝 (to be created in Session 4)
├── types/
│   └── index.ts ✅ (needs updates for ParsedTransaction)
├── .cursorrules ✅
├── DESIGN_SYSTEM.md ✅
└── .env.local ✅

**Removed files:**
- ❌ lib/parse-pdf.ts (deleted - no longer using pdf-parse)
```

---

### 📝 Next Steps (Tomorrow)

**Session 4 (Revised): PDF Parsing with Claude API**
1. Remove pdf-parse dependency and old parsing logic (if any)
2. Create `lib/validate-transactions.ts` with validation rules
3. Create `lib/parse-with-claude.ts` with Claude PDF parsing
4. Update `app/api/parse-statement/route.ts` to use Claude
5. Implement structured prompts for consistent JSON output
6. Test with real bank statement PDFs

**After Session 4:**
- Session 5: Transaction Categorization (client-side)
- Session 6: Claude Insights Generation (simplified - only insights, not parsing)
- Session 7: Results Dashboard
- Session 8: Connect Everything (add user review step)
- Session 9: Polish & Deploy

---

### 🔧 Commands to Remember
```bash
# Start development
npm run dev

# Kill orphan servers
killall node

# Clear cache (fixes most issues)
rm -rf .next
npm run dev

# Restore UI files if styling breaks
git checkout components/
git checkout app/page.tsx

# Remove old pdf-parse files
rm -f lib/parse-pdf.ts
npm uninstall pdf-parse

# Full nuclear reset
rm -rf .next node_modules
npm install
npm run dev

# Check what's using a port
lsof -i :3000

# Kill specific process
kill -9 <PID>
```

---

### 💾 Git Status

**Current state:**
- Working landing page from Session 3
- Ready to implement Session 4 with new Claude API approach

**Safe commits to return to:**
- Session 3: Working landing page ✅
- Session 2: Working UI components ✅

---

## How to Resume Tomorrow

1. Open Cursor, open the SpendSense project
2. Run `killall node` (just in case)
3. Run `npm run dev`
4. Check `http://localhost:3000` looks good
5. Reference this document for where we left off
6. Start Session 4 with the new Claude API approach from IMPLEMENTATION_PLAN.md

---

*Last updated: January 22, 2025*