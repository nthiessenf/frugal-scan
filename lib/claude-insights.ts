import Anthropic from '@anthropic-ai/sdk';
import { 
  SpendingSummary, 
  CategoryBreakdown, 
  TopMerchant, 
  Subscription,
  Insight,
  SavingsTip,
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
): Promise<{ insights: Insight[]; tips: SavingsTip[] }> {
  
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
- Top category (${metrics.projectedAnnual.topCategory.name}) projected annual: $${metrics.projectedAnnual.topCategory.annual.toFixed(2)}`;

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
  "tips": [
    {
      "id": "tip-1",
      "title": "actionable title (5-8 words)",
      "description": "specific advice referencing their actual spending data and numbers",
      "potentialSavings": estimated monthly savings as number,
      "difficulty": "easy" | "medium" | "hard",
      "timeframe": "immediate" | "monthly" | "yearly"
    }
  ]
}

TIP GUIDELINES:
- Make tips actionable and specific to their data
- At least one easy tip
- Base potential savings on actual spending patterns
- Reference specific merchants or amounts when relevant
- Don't suggest extreme measures

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
    parsed = JSON.parse(jsonText.trim());
  } catch (e) {
    console.error('Failed to parse Claude insights response:', textBlock.text);
    throw new Error('Invalid JSON response from Claude');
  }

  return {
    insights: parsed.insights || [],
    tips: parsed.tips || [],
  };
}

