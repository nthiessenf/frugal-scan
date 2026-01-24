import Anthropic from '@anthropic-ai/sdk';
import { 
  SpendingSummary, 
  CategoryBreakdown, 
  TopMerchant, 
  Subscription,
  Insight,
  SavingsTip 
} from '@/types';
import { getCategoryLabel } from './analysis';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateInsights(
  summary: SpendingSummary,
  categoryBreakdown: CategoryBreakdown[],
  topMerchants: TopMerchant[],
  subscriptions: Subscription[]
): Promise<{ insights: Insight[]; tips: SavingsTip[] }> {
  
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

Based on this data, provide:
1. Exactly 5 insights about their spending patterns
2. Exactly 3 actionable savings tips

RESPOND WITH VALID JSON ONLY:
{
  "insights": [
    {
      "id": "insight-1",
      "title": "short catchy title (5-8 words)",
      "description": "2-3 sentences with specific numbers from the data",
      "severity": "info" | "warning" | "positive",
      "category": "category_name if applicable, otherwise null",
      "amount": number if applicable, otherwise null
    }
  ],
  "tips": [
    {
      "id": "tip-1",
      "title": "actionable title (5-8 words)",
      "description": "specific advice with numbers",
      "potentialSavings": estimated monthly savings as number,
      "difficulty": "easy" | "medium" | "hard",
      "timeframe": "immediate" | "monthly" | "yearly"
    }
  ]
}

INSIGHT GUIDELINES:
- At least one insight should be positive (celebrate something good)
- Flag if one category is unusually high (>40% of spending)
- Note subscription total if significant (>$100/month or >5% of spending)
- Compare ratios when interesting (e.g., dining out vs groceries)
- Be specific with numbers, not vague

TIP GUIDELINES:
- Make tips actionable and specific
- At least one easy tip
- Base potential savings on actual spending data
- Don't suggest extreme measures
- Be realistic about difficulty

Respond with ONLY the JSON, no markdown, no explanation.`;

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

