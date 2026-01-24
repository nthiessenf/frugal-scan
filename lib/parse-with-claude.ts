import Anthropic from '@anthropic-ai/sdk';
import { RawTransaction, ParsedStatement } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function parseStatementWithClaude(pdfBase64: string): Promise<ParsedStatement> {
  const startTime = Date.now();

  const systemPrompt = `You are a precise financial document parser. Extract transaction data from bank statements with high accuracy. Always respond with valid JSON matching the exact schema provided. Never make up transactions - only extract what you can clearly see in the document.`;

  const userPrompt = `Analyze this bank statement PDF and extract all transactions.

RESPOND ONLY WITH VALID JSON matching this exact schema:
{
  "transactions": [
    {
      "date": "YYYY-MM-DD",
      "description": "exact description from statement",
      "amount": 123.45,
      "type": "debit" or "credit",
      "confidence": 0.0 to 1.0
    }
  ],
  "bankName": "detected bank name or null",
  "accountType": "checking" | "savings" | "credit" | "unknown",
  "period": {
    "start": "YYYY-MM-DD or null",
    "end": "YYYY-MM-DD or null"
  },
  "statementTotals": {
    "totalDebits": number or null,
    "totalCredits": number or null,
    "endingBalance": number or null
  }
}

RULES:
1. Date format must be YYYY-MM-DD. Convert any date format you see.
2. Amount must be a positive number. Use type to indicate debit vs credit.
3. For credits: payments received, deposits, refunds, returns
4. For debits: purchases, withdrawals, fees, transfers out
5. Confidence score: 1.0 = clearly visible, 0.8 = some ambiguity, 0.5 = uncertain
6. If you cannot clearly read a transaction, set confidence below 0.8
7. Extract statement totals from the summary section if present
8. Do NOT include pending transactions unless clearly labeled as posted
9. Do NOT make up any transactions - only extract what you can see

Respond with ONLY the JSON object, no markdown, no explanation.`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdfBase64,
            },
          },
          {
            type: 'text',
            text: userPrompt,
          },
        ],
      },
    ],
    system: systemPrompt,
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  let parsed;
  try {
    let jsonText = textBlock.text.trim();
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
    console.error('Failed to parse Claude response:', textBlock.text);
    throw new Error('Invalid JSON response from Claude');
  }

  const processingTimeMs = Date.now() - startTime;
  const lowConfidenceCount = parsed.transactions.filter(
    (t: RawTransaction) => t.confidence < 0.8
  ).length;

  return {
    transactions: parsed.transactions,
    bankName: parsed.bankName,
    accountType: parsed.accountType || 'unknown',
    period: parsed.period || { start: null, end: null },
    statementTotals: parsed.statementTotals || {
      totalDebits: null,
      totalCredits: null,
      endingBalance: null,
    },
    parsingMetadata: {
      totalTransactionsFound: parsed.transactions.length,
      lowConfidenceCount,
      processingTimeMs,
    },
  };
}

