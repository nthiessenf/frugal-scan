import Anthropic from '@anthropic-ai/sdk';
import { RawTransaction, ParsedStatement } from '@/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function parseStatementWithClaude(pdfBase64: string): Promise<ParsedStatement> {
  const startTime = Date.now();

  const systemPrompt = `You are a precise financial document parser. Extract transaction data from bank statements with high accuracy. Always respond with valid JSON matching the exact schema provided. Never make up transactions - only extract what you can clearly see in the document.`;

  const userPrompt = `Analyze this bank statement PDF and extract ALL transactions from EVERY page.

CRITICAL: This PDF has MULTIPLE PAGES. You MUST extract transactions from ALL pages, not just the first page. The statement summary shows total debits of approximately $10,000+ so there should be many transactions.

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
    "totalDebits": number or null (from statement summary section if shown),
    "totalCredits": number or null (from statement summary section if shown),
    "endingBalance": number or null
  },
  "pageCount": number (how many pages you found transactions on)
}

RULES:
1. SCAN ALL PAGES of the PDF - do not stop after the first page
2. Date format must be YYYY-MM-DD. Convert any date format you see to this format.
3. Amount must be a positive number. Use type to indicate debit vs credit.
4. For credits: payments received, deposits, refunds, returns
5. For debits: purchases, withdrawals, fees, transfers out
6. Confidence score: 1.0 = clearly visible, 0.8 = some ambiguity, 0.5 = uncertain
7. Extract statement totals from the summary section if present
8. Do NOT include pending transactions unless clearly labeled as posted
9. Do NOT make up any transactions - only extract what you can see
10. The sum of all debit transactions should approximately match the statement's total debits

Respond with ONLY the JSON object, no markdown, no explanation.`;

  console.log('Sending PDF to Claude, size:', pdfBase64.length, 'characters');

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 16000,  // INCREASED from 8000 - need room for all transactions
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

  // Detailed diagnostics logging
  console.log('=== CLAUDE PARSING DIAGNOSTICS ===');
  console.log('Raw response length:', JSON.stringify(response).length);
  console.log('Number of transactions parsed:', parsed.transactions?.length || 0);
  console.log('First transaction:', parsed.transactions?.[0]);
  console.log('Last transaction:', parsed.transactions?.[parsed.transactions?.length - 1]);
  console.log('Statement totals from Claude:', parsed.statementTotals);
  console.log('Bank name detected:', parsed.bankName);
  console.log('Period:', parsed.period);

  // Calculate totals from parsed transactions
  const totalDebits = parsed.transactions
    ?.filter((t: any) => t.type === 'debit')
    .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
  const totalCredits = parsed.transactions
    ?.filter((t: any) => t.type === 'credit')
    .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;

  console.log('Calculated total debits:', totalDebits);
  console.log('Calculated total credits:', totalCredits);
  console.log('Statement says total debits:', parsed.statementTotals?.totalDebits);
  console.log('DISCREPANCY:', (parsed.statementTotals?.totalDebits || 0) - totalDebits);
  console.log('Page count:', parsed.pageCount || 'not provided');
  console.log('=================================');

  // Check for significant discrepancy
  const discrepancy = Math.abs((parsed.statementTotals?.totalDebits || 0) - totalDebits);
  const discrepancyPercent = parsed.statementTotals?.totalDebits 
    ? (discrepancy / parsed.statementTotals.totalDebits) * 100 
    : 0;

  if (discrepancyPercent > 10) {
    console.warn(`⚠️ LARGE DISCREPANCY DETECTED: ${discrepancyPercent.toFixed(1)}% of transactions may be missing`);
    console.warn(`Expected ~$${parsed.statementTotals?.totalDebits}, got $${totalDebits.toFixed(2)}`);
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
    pageCount: parsed.pageCount,
    parsingMetadata: {
      totalTransactionsFound: parsed.transactions.length,
      lowConfidenceCount,
      processingTimeMs,
    },
  };
}

