# Architecture Decision Record

## Decision: Use Claude Haiku for PDF Parsing

**Date:** January 26, 2025  
**Status:** ✅ Accepted  
**Deciders:** Nikolas (Product), Claude (Technical Advisor)

---

### Context

PDF parsing with Claude Sonnet was taking 192 seconds for a 13-page statement. This created a poor user experience and made development iteration slow.

### Decision

Switch PDF parsing from Claude Sonnet to Claude Haiku while keeping insights generation on Sonnet.

### Rationale

- **Haiku is 3-5x faster** for structured extraction tasks
- **10x cheaper** ($0.25 vs $3 per million input tokens)
- **Accuracy maintained** - transaction extraction is structured, not creative
- **Insights stay on Sonnet** - reasoning benefits from larger model

### Results

| Metric | Sonnet | Haiku | Improvement |
|--------|--------|-------|-------------|
| Parse time | 192s | 77s | 60% faster |
| Parse cost | ~$0.10 | ~$0.02 | 80% cheaper |
| Accuracy | 99.7% | 99.7% | No change |

### Consequences

✅ Much faster user experience
✅ Lower API costs
✅ Same accuracy for structured extraction
⚠️ If accuracy issues appear, can revert to Sonnet

---

## Decision: Use Claude API for PDF Parsing

**Date:** January 22, 2025  
**Status:** ✅ Accepted  
**Deciders:** Nikolas (Product), Claude (Technical Advisor)

---

### Context

We need to extract transaction data from bank statement PDFs for SpendSense. Initially attempted `pdf-parse` + regex approach but encountered significant challenges:

**Problems with pdf-parse approach:**
- Next.js webpack bundling incompatibility (persistent "pdfParse is not a function" errors)
- Brittle regex patterns requiring constant maintenance for different bank formats
- Poor handling of edge cases (refunds, pending transactions, foreign currency, unusual formats)
- Estimated 70-85% accuracy across different bank statement formats
- Would require 50+ regex patterns to support major banks

**What triggered this decision:**
- Multiple failed attempts to resolve webpack bundling issues
- Recognition that regex approach would be maintenance nightmare
- Realization that we're already using Claude API for insights anyway

---

### Decision

Use **Claude API (Claude 3.5 Sonnet)** to parse PDF documents directly instead of text extraction + regex matching.

### Approach

1. Accept PDF upload via Next.js API route
2. Convert PDF to base64 encoding
3. Send to Claude API with structured prompt requesting JSON output
4. Claude reads PDF natively and extracts transactions with context understanding
5. Validate returned JSON against strict schema
6. Return parsed transactions with validation results to frontend

---

### Rationale

#### Technical Advantages

**Native PDF Reading:**
- Claude can parse PDFs directly without separate extraction library
- Understands document structure (headers, tables, columns)
- Handles multi-page statements automatically
- No webpack bundling issues

**Context Understanding:**
- Recognizes transactions even with varied formatting
- Understands "REFUND - STARBUCKS" is a credit, not debit
- Handles pending transactions, foreign currency, unusual descriptions
- Can infer missing information from context

**Accuracy:**
- Expected 99%+ accuracy vs 70-85% with regex
- Works across all bank formats without custom patterns
- Degrades gracefully on unclear data (confidence scores)

**Maintainability:**
- Single prompt template vs 50+ regex patterns
- No per-bank customization needed
- Easier to debug (readable prompt vs complex regex)

#### Product Advantages

**Faster MVP:**
- Eliminates regex pattern development time
- Works with test PDFs immediately
- Can launch with broad bank support

**Better UX:**
- More accurate parsing = fewer errors
- Confidence scores enable smart user review
- Clearer error messages

**Unified Architecture:**
- Same API for parsing and insights
- Simpler mental model
- Fewer dependencies

#### Business Considerations

**Cost Structure:**
- ~$0.10 per statement parse (Claude Sonnet)
- ~$0.05 for insights generation
- **Total: ~$0.15 per user analysis**

**Cost Scenarios:**
- 100 beta users: ~$15 total
- 1,000 early adopters: ~$150 total
- 10,000 monthly users: ~$1,500/month

**Cost is acceptable because:**
- Validates product-market fit before optimization
- Can add caching, rate limits later
- Users might pay $2-5 per analysis (covers costs)
- Can optimize to hybrid approach if needed at scale

---

### Consequences

#### Positive

✅ **Faster development:** No regex debugging, works immediately  
✅ **Better accuracy:** 99%+ vs 70-85%  
✅ **Broader compatibility:** All banks work out of the box  
✅ **Simpler codebase:** One prompt vs dozens of regex patterns  
✅ **Unified API:** Claude for both parsing and insights  
✅ **Better error handling:** Context-aware error messages

#### Negative

❌ **Operating cost:** ~$0.10 per parse (vs free with regex)  
❌ **Internet required:** Can't work offline  
❌ **Processing latency:** 5-10 seconds (vs 1 second with regex)  
❌ **Probabilistic nature:** Not 100% deterministic  

#### Risks & Mitigation

**Risk: Probabilistic nature could cause inconsistent results**
- **Mitigation:** Strict JSON validation, confidence scoring, user review step
- **Impact:** Low - user review catches ~1% errors

**Risk: Costs could grow unpredictably**
- **Mitigation:** Rate limiting, caching, cost monitoring, user limits
- **Impact:** Low - can control with product decisions

**Risk: API dependency (if Anthropic has outage)**
- **Mitigation:** Graceful error messages, retry logic, status page
- **Impact:** Medium - but same risk exists for insights anyway

**Risk: Slow processing affects UX**
- **Mitigation:** Clear loading states, progress indicators, expectations ("~10 seconds")
- **Impact:** Low - users expect some processing time

---

### Alternatives Considered

#### 1. pdf-parse + Regex (Original Plan)
**Pros:** Free, fast, deterministic  
**Cons:** 70-85% accuracy, brittle, webpack issues, high maintenance  
**Verdict:** Failed in practice due to webpack compatibility

#### 2. Amazon Textract
**Pros:** 99.8% accuracy, enterprise-grade, good table detection  
**Cons:** Complex AWS setup, similar costs, overkill for MVP  
**Verdict:** Too complex for MVP, can switch later if needed

#### 3. LlamaParse (LlamaIndex)
**Pros:** Built for this use case, good documentation  
**Cons:** Another API dependency, less mature than Claude  
**Verdict:** Good alternative but Claude is already integrated

#### 4. Hybrid Approach (Regex + Claude fallback)
**Pros:** Optimize costs for common formats  
**Cons:** Complexity doesn't justify savings at MVP scale  
**Verdict:** Premature optimization - reconsider at scale

---

### Implementation

See IMPLEMENTATION_PLAN.md Session 4 for detailed implementation.

**Key files:**
- `lib/parse-with-claude.ts` - Main parsing logic
- `lib/validate-transactions.ts` - Validation rules
- `app/api/parse-statement/route.ts` - API endpoint

**Prompt structure:**
- Strict JSON schema specification
- Explicit rules (date format, amount signs, types)
- Examples for common edge cases
- Confidence scoring requirement

**Validation strategy:**
- Field presence checks
- Type validation
- Format validation (dates, amounts)
- Range checks (reasonable values)
- Duplicate detection

---

### Success Metrics

**Accuracy:**
- Target: 99%+ correct transaction extraction
- Measure: Manual review of 100 test statements
- Threshold: <2% error rate acceptable for MVP

**Performance:**
- Target: <10 second parse time
- Measure: Average processing time
- Threshold: <15 seconds acceptable for MVP

**Cost:**
- Target: <$0.15 per analysis
- Measure: Anthropic API usage
- Threshold: <$0.20 acceptable for MVP

**User Satisfaction:**
- Target: <5% parsing complaints
- Measure: Support tickets, user feedback
- Threshold: <10% acceptable for MVP

---

### Review Schedule

**After 100 beta users (or 3 months):**

Evaluate:
1. Actual accuracy rate (user-reported errors)
2. Average cost per user
3. User feedback on parsing quality
4. Whether to optimize or change approach

**Optimization options if needed:**
- Add caching for identical PDFs
- Implement hybrid approach (regex + Claude fallback)
- Switch to Textract for heavy users
- Add tiered pricing to cover costs

---

### Related Decisions

- **User Review Step (Session 8):** Added to catch the ~1% parsing errors
- **Client-side Categorization (Session 5):** Keep categorization client-side to reduce API costs
- **No User Accounts (MVP):** Simplifies cost tracking and deployment

---

### References

- [Claude API Documentation](https://docs.anthropic.com/claude/reference/messages_post)
- [Anthropic Pricing](https://www.anthropic.com/pricing)
- Original Issue: Session Log Jan 21, 2025 - pdf-parse webpack conflicts

---

**Decision recorded by:** Nikolas  
**Technical design by:** Claude  
**Approved for implementation:** January 22, 2025

---

## Decision: Parallel PDF Processing for Large Statements

**Date:** January 30, 2025
**Status:** ✅ Accepted
**Deciders:** Nikolas (Product), Claude (Technical Advisor)

---

### Context

PDF parsing for large bank statements (13-20+ pages) was taking ~70 seconds, creating a poor user experience. Initial attempts at parallelization failed due to:
- Incorrect data format (negative amounts broke validation)
- Rate limiting (too many concurrent requests)
- Chunk boundary issues (transactions split across pages)

### Decision

Implement parallel PDF processing with these specifications:
- **Threshold:** PDFs >5 pages use parallel processing
- **Chunk size:** 4 pages per chunk
- **Concurrency:** Maximum 3 simultaneous API requests
- **Model:** Claude Haiku (fast, accurate for structured extraction)
- **Data format:** Matches existing contract (positive amounts + type field)

### Rationale

**Why 4-page chunks:**
- Smaller (2 pages): Missing transactions at page boundaries
- Larger (6+ pages): Diminishing parallelization benefits
- 4 pages: Optimal balance of parallelism and accuracy

**Why pLimit(3):**
- pLimit(2): Safe but slow
- pLimit(3): Good balance of speed and rate limit safety
- pLimit(4+): No additional benefit due to API latency variance

**Why Haiku over Sonnet:**
- Haiku: ~20s per chunk for extraction
- Sonnet: ~40-80s per chunk (2-4x slower)
- Same accuracy for structured table extraction
- Sonnet reserved for insights generation (reasoning tasks)

### Consequences

**Positive:**
- 20% faster parsing (70s → 56s average)
- 100% accuracy maintained
- No changes to downstream code (validation, categorization, charts)
- Graceful fallback for small PDFs

**Negative:**
- API latency variance causes inconsistent times (50-90s range)
- Additional dependencies (pdf-lib, p-limit)
- More complex codebase

**Risks & Mitigation:**
- Rate limits: pLimit(3) stays well under 30k tokens/minute
- Chunk boundary errors: 4-page chunks tested extensively
- API changes: Model ID hardcoded, easy to update

### Files Involved
- `lib/pdf-chunker.ts` - PDF splitting
- `lib/parse-parallel.ts` - Parallel processing with rate limiting
- `lib/parse-with-claude.ts` - Routing logic

---

## Lessons Learned

**Product:**
- Sometimes the "simple" solution (regex) is actually harder than the "advanced" solution (AI)
- Cost concerns shouldn't prevent using the right tool for MVP
- User review steps can effectively catch ML errors

**Technical:**
- Native integrations (Claude's PDF reading) beat library wrappers (pdf-parse)
- Context understanding beats pattern matching for varied data
- Validation is crucial when using probabilistic tools

**Process:**
- Pivot quickly when hitting persistent blockers
- Document architectural decisions for future reference
- Set clear success metrics before implementing

---

*This decision can be revisited after MVP validation with real users and data.*