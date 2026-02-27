import Anthropic from '@anthropic-ai/sdk';
import { 
  SpendingSummary, 
  CategoryBreakdown, 
  TopMerchant, 
  Subscription,
  Insight,
  SavingsTip,
  TieredTip,
  MoneyLeak,
  CategorizedTransaction
} from '@/types';
import { getCategoryLabel } from './analysis';
import { calculateInsightMetrics, InsightMetrics } from './insight-metrics';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateInsights(
  summary: SpendingSummary,
  categoryBreakdown: CategoryBreakdown[],
  topMerchants: TopMerchant[],
  subscriptions: Subscription[],
  transactions: CategorizedTransaction[]
): Promise<{ 
  insights: Insight[]; 
  tips: SavingsTip[]; 
  enhancedTips: {
    quickWins: TieredTip[];
    worthTheEffort: TieredTip[];
    bigMoves: TieredTip[];
    totalMonthlySavings: number;
    totalAnnualSavings: number;
  };
  moneyLeaks: MoneyLeak[];
}> {
  
  console.log('[claude-insights] Starting generateInsights...');
  console.log(`[claude-insights] Transactions: ${transactions.length}, Period: ${summary.periodDays} days`);
  
  // Calculate detailed metrics for better insights
  const metrics = calculateInsightMetrics(transactions, subscriptions, summary.periodDays);
  console.log('=== INSIGHT METRICS ===');
  console.log(JSON.stringify(metrics, null, 2));
  console.log('=== END METRICS ===');
  
  // Build the context for Claude
  const categoryList = categoryBreakdown
    .slice(0, 8)
    .map(c => `- ${getCategoryLabel(c.category)}: $${c.amount.toFixed(2)} (${c.percentage.toFixed(1)}%)`)
    .join('\n');
  
  const merchantList = topMerchants
    .slice(0, 8)
    .map(m => `- ${m.name}: $${m.amount.toFixed(2)} (${m.count} transactions)`)
    .join('\n');
  
  const subscriptionList = subscriptions.length > 0
    ? subscriptions.map(s => `- ${s.name}: $${s.amount.toFixed(2)}/${s.frequency}`).join('\n')
    : 'No recurring subscriptions detected';

  const systemPrompt = `You are a friendly, supportive personal finance advisor. Analyze spending data and provide helpful, non-judgmental insights. Be specific with numbers. Focus on actionable observations. Never shame or criticize - always be constructive and encouraging.`;

  // Format metrics for the prompt
  const metricsSection = `DATA POINTS TO CONSIDER:

Frequency Patterns:
- Most frequent merchant: ${metrics.mostFrequentMerchant.name} (${metrics.mostFrequentMerchant.visits} visits, $${metrics.mostFrequentMerchant.total.toFixed(2)} total, $${(metrics.mostFrequentMerchant.total / metrics.mostFrequentMerchant.visits).toFixed(2)} avg per visit)
- Top frequent merchants: ${metrics.merchantFrequency.slice(0, 5).map(m => `${m.name} (${m.visits}x)`).join(', ')}

Small Purchase Analysis ("It's just $5" effect):
- Under $5: ${metrics.smallPurchases.under5.count} purchases totaling $${metrics.smallPurchases.under5.total.toFixed(2)}
- Under $10: ${metrics.smallPurchases.under10.count} purchases totaling $${metrics.smallPurchases.under10.total.toFixed(2)}
- Under $20: ${metrics.smallPurchases.under20.count} purchases totaling $${metrics.smallPurchases.under20.total.toFixed(2)}

Long Tail Spending:
- ${metrics.longTail.merchantsOutsideTop10} merchants outside top 10 account for $${metrics.longTail.spendingOutsideTop10.toFixed(2)} (${metrics.longTail.percentageOutsideTop10.toFixed(1)}% of spending)

Category Relationships:
${metrics.categoryRatios.diningVsGroceries !== null 
  ? `- Dining out is ${metrics.categoryRatios.diningVsGroceries.toFixed(1)}x your grocery spending`
  : '- Dining vs groceries: Not enough data'}
- Discretionary spending: ${metrics.categoryRatios.discretionaryPercent.toFixed(1)}% of total

Transaction Patterns:
- Largest single transaction: $${metrics.largestTransaction.amount.toFixed(2)} at ${metrics.largestTransaction.merchant}
- Average transaction by category: ${metrics.averageTransactionByCategory.slice(0, 3).map(c => `${c.category}: $${c.average.toFixed(2)}`).join(', ')}

Annualized Projections:
- Projected annual spending: $${metrics.projectedAnnual.totalSpending.toFixed(2)}
- Annual subscriptions: $${metrics.projectedAnnual.subscriptions.toFixed(2)}
- Top category (${metrics.projectedAnnual.topCategory.name}) projected annual: $${metrics.projectedAnnual.topCategory.annual.toFixed(2)}

MONEY LEAKS DETECTED:
${metrics.moneyLeaks.items.length > 0
  ? metrics.moneyLeaks.items.map(i => `- ${i.merchant}: $${i.amount.toFixed(2)} (${i.label})`).join('\n') + `\n- Total: $${metrics.moneyLeaks.totalAmount.toFixed(2)} | Projected annual: $${metrics.moneyLeaks.projectedAnnual.toFixed(2)}`
  : 'No fee-type charges detected in this statement'}

DAY-OF-WEEK SPENDING PATTERNS:
${metrics.dayOfWeek.breakdown.map(d => `- ${d.day}: $${d.total.toFixed(2)} (${d.count} transactions)`).join('\n')}
- Highest spending day: ${metrics.dayOfWeek.highestDay.day} ($${metrics.dayOfWeek.highestDay.total.toFixed(2)})
- Lowest spending day: ${metrics.dayOfWeek.lowestDay.day} ($${metrics.dayOfWeek.lowestDay.total.toFixed(2)})
- Weekend total: $${metrics.dayOfWeek.weekendTotal.toFixed(2)} | Weekday total: $${metrics.dayOfWeek.weekdayTotal.toFixed(2)}${metrics.dayOfWeek.weekendVsWeekdayRatio !== null ? ` | Weekend vs weekday ratio: ${metrics.dayOfWeek.weekendVsWeekdayRatio.toFixed(2)}x` : ''}

TOP 10 LARGEST INDIVIDUAL PURCHASES:
${metrics.topLargestTransactions.map(t => `- ${t.merchant}: $${t.amount.toFixed(2)} (${t.date}, ${t.category})`).join('\n')}

SUBSCRIPTION ANNUAL COST AUDIT:
${subscriptions.length > 0
  ? subscriptions.map(s => {
      const monthly = s.frequency === 'yearly' ? s.amount / 12 : s.frequency === 'weekly' ? s.amount * 4 : s.amount;
      const annual = s.frequency === 'yearly' ? s.amount : s.frequency === 'weekly' ? s.amount * 52 : s.amount * 12;
      return `- ${s.name}: $${monthly.toFixed(2)}/mo = $${annual.toFixed(2)}/yr`;
    }).join('\n') + `\n- Total annual subscription cost: $${subscriptions.reduce((sum, s) => {
      const annual = s.frequency === 'yearly' ? s.amount : s.frequency === 'weekly' ? s.amount * 52 : s.amount * 12;
      return sum + annual;
    }, 0).toFixed(2)}`
  : 'No subscriptions detected'}
Note: Ask yourself - am I actively using all of these?`;

  const userPrompt = `Here is someone's spending data for the past ${summary.periodDays} days:

SUMMARY:
- Total spent: $${summary.totalSpent.toFixed(2)}
- Total income: $${summary.totalIncome.toFixed(2)}
- Net cash flow: $${summary.netCashFlow.toFixed(2)}
- Number of transactions: ${summary.transactionCount}
- Average transaction: $${summary.averageTransaction.toFixed(2)}

SPENDING BY CATEGORY:
${categoryList}

TOP MERCHANTS:
${merchantList}

DETECTED SUBSCRIPTIONS:
${subscriptionList}
Monthly subscription total: $${summary.subscriptionTotal.toFixed(2)}

${metricsSection}

---

YOUR TASK:
Review all the data points above. Surface the 5 most interesting, surprising, or actionable patterns you find. Each insight MUST cite specific numbers from the data. At least one should be positive (celebrate something good). Avoid obvious observations like "your biggest category was X" - the user can see that in the chart.

CRITICAL: Include annual projections to help users see long-term impact. When mentioning monthly or period spending, ALWAYS include the annual equivalent (e.g., "That's $1,044 per year" or "annually that's $X"). Use the annual projections from the "Annualized Projections" section above.

GOOD INSIGHT EXAMPLES:
- "You stopped at ${metrics.mostFrequentMerchant.name} ${metrics.mostFrequentMerchant.visits} times this month, averaging $${(metrics.mostFrequentMerchant.total / metrics.mostFrequentMerchant.visits).toFixed(2)} per visit. These quick stops add up to $${(metrics.mostFrequentMerchant.total * 12).toFixed(2)} annually."
- "Your ${metrics.smallPurchases.under10.count} purchases under $10 totaled $${metrics.smallPurchases.under10.total.toFixed(2)}—the 'it's just $5' effect is real. That's $${(metrics.smallPurchases.under10.total * (365 / summary.periodDays)).toFixed(2)} per year on small purchases."
- "While your top 10 merchants get the spotlight, ${metrics.longTail.merchantsOutsideTop10} other merchants account for ${metrics.longTail.percentageOutsideTop10.toFixed(1)}% of your spending—a reminder that small amounts add up."

BAD INSIGHT EXAMPLES (AVOID THESE):
- "Your biggest spending category was Dining Out" (obvious, user can see this)
- "Consider creating a budget" (generic, not specific to their data)
- "You spent money on subscriptions" (no specific insight or numbers)

RESPOND WITH VALID JSON ONLY:
{
  "insights": [
    {
      "id": "insight-1",
      "title": "short catchy title (5-8 words)",
      "description": "2-3 sentences with specific numbers from the data. Cite exact amounts, frequencies, or percentages. ALWAYS include annual projections when mentioning monthly/period spending (e.g., 'That's $1,044 per year').",
      "severity": "info" | "warning" | "positive",
      "category": "category_name if applicable, otherwise null",
      "amount": number if applicable, otherwise null
    }
  ],
  "quickWins": [
    {
      "id": "qw-1",
      "title": "action-oriented title (5-8 words)",
      "description": "specific advice with numbers. Reference actual merchants/amounts.",
      "potentialMonthlySavings": number,
      "potentialAnnualSavings": number
    }
  ],
  "worthTheEffort": [
    {
      "id": "we-1",
      "title": "action-oriented title (5-8 words)",
      "description": "specific advice with numbers. Reference actual merchants/amounts.",
      "potentialMonthlySavings": number,
      "potentialAnnualSavings": number
    }
  ],
  "bigMoves": [
    {
      "id": "bm-1",
      "title": "action-oriented title (5-8 words)",
      "description": "specific advice with numbers. Reference actual merchants/amounts.",
      "potentialMonthlySavings": number,
      "potentialAnnualSavings": number
    }
  ],
  "totalPotentialMonthlySavings": number,
  "totalPotentialAnnualSavings": number
}

TIERED SAVINGS ROADMAP:

"quickWins" (2-3 items): Painless cuts the user won't even notice. Examples: canceling a forgotten subscription, switching to a free checking account to avoid fees, making coffee at home one more day per week. Monthly savings should be realistic and modest ($5-$50 range per item).

"worthTheEffort" (2-3 items): Small behavior changes that require some adjustment but aren't drastic. Examples: meal prepping lunches twice a week instead of ordering delivery, switching from premium to standard subscriptions, batching errands to reduce impulse stops. Monthly savings in $20-$150 range per item.

"bigMoves" (1-2 items): Significant lifestyle changes with major impact. Examples: cooking at home instead of eating out most nights, cutting discretionary spending by 20%, downgrading a car or housing situation. Monthly savings in $100-$500+ range per item. Note that these require real commitment.

CRITICAL RULES FOR TIPS:
- Every tip MUST reference specific merchants, amounts, or categories from the user's actual data
- potentialAnnualSavings MUST equal potentialMonthlySavings * 12
- totalPotentialMonthlySavings MUST equal the sum of ALL tips across all three tiers
- totalPotentialAnnualSavings MUST equal totalPotentialMonthlySavings * 12
- Be realistic — don't suggest saving more than the user actually spends in that area
- Be encouraging, not shaming

Respond with ONLY the JSON, no markdown, no explanation.`;

  console.log('=== CLAUDE PROMPT (with metrics) ===');
  console.log(userPrompt);
  console.log('=== END PROMPT ===');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    system: systemPrompt,
  });

  // Extract the text content
  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  // Parse the JSON response
  let parsed;
  try {
    let jsonText = textBlock.text.trim();
    // Clean any markdown formatting
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    // Debug: log raw response before parsing
    console.log('[claude-insights] Raw Claude response text (first 500 chars):', textBlock.text.substring(0, 500));
    console.log('[claude-insights] Raw Claude response text (last 200 chars):', textBlock.text.substring(Math.max(0, textBlock.text.length - 200)));
    parsed = JSON.parse(jsonText.trim());
    // Debug: log parsed structure
    console.log('[claude-insights] Parsed response keys:', Object.keys(parsed));
    console.log('[claude-insights] Has quickWins:', !!parsed.quickWins);
    console.log('[claude-insights] Has tips:', !!parsed.tips);
    console.log('[claude-insights] Has insights:', !!parsed.insights);
  } catch (e) {
    console.error('[claude-insights] Failed to parse Claude insights response:', textBlock.text);
    console.error('[claude-insights] Parse error:', e);
    throw new Error('Invalid JSON response from Claude');
  }

  // Map tiered tips to legacy SavingsTip format for backward compatibility
  // Support BOTH new format (quickWins, worthTheEffort, bigMoves) and old format (tips)
  const quickWins = parsed.quickWins || [];
  const worthTheEffort = parsed.worthTheEffort || [];
  const bigMoves = parsed.bigMoves || [];
  const hasTieredFormat = quickWins.length > 0 || worthTheEffort.length > 0 || bigMoves.length > 0;
  const tips: SavingsTip[] = hasTieredFormat ? [
    ...quickWins.map((t: TieredTip) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      potentialSavings: t.potentialMonthlySavings,
      difficulty: 'easy' as const,
      timeframe: 'immediate' as const,
    })),
    ...worthTheEffort.map((t: TieredTip) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      potentialSavings: t.potentialMonthlySavings,
      difficulty: 'medium' as const,
      timeframe: 'monthly' as const,
    })),
    ...bigMoves.map((t: TieredTip) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      potentialSavings: t.potentialMonthlySavings,
      difficulty: 'hard' as const,
      timeframe: 'yearly' as const,
    })),
  ] : (parsed.tips || []).map((t: { id: string; title: string; description: string; potentialSavings: number; difficulty?: string; timeframe?: string }) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    potentialSavings: t.potentialSavings,
    difficulty: (t.difficulty === 'medium' || t.difficulty === 'hard' ? t.difficulty : 'easy') as 'easy' | 'medium' | 'hard',
    timeframe: (t.timeframe === 'monthly' || t.timeframe === 'yearly' ? t.timeframe : 'immediate') as 'immediate' | 'monthly' | 'yearly',
  }));

  // Transform metrics moneyLeaks to MoneyLeak format with id and annualProjection
  const periodMultiplier = 365 / summary.periodDays;
  const moneyLeaks: MoneyLeak[] = metrics.moneyLeaks.items.map((item, i) => ({
    id: `leak-${i + 1}`,
    merchant: item.merchant,
    amount: item.amount,
    type: item.type,
    label: item.label,
    date: item.date,
    annualProjection: item.amount * periodMultiplier,
  }));

  return {
    insights: parsed.insights || [],
    tips,
    enhancedTips: {
      quickWins,
      worthTheEffort,
      bigMoves,
      totalMonthlySavings: parsed.totalPotentialMonthlySavings || 0,
      totalAnnualSavings: parsed.totalPotentialAnnualSavings || 0,
    },
    moneyLeaks,
  };
}

