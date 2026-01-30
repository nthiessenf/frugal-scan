import Anthropic from '@anthropic-ai/sdk';
import { RawTransaction, ParsedStatement } from '@/types';
import { splitPdfIntoChunks, getPdfPageCount } from './pdf-chunker';
import { parseChunksParallel } from './parse-parallel';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function parseStatementWithClaude(pdfBase64: string): Promise<ParsedStatement> {
  const startTime = Date.now();

  // Check page count to decide processing strategy
  const pageCount = await getPdfPageCount(pdfBase64);
  console.log(`PDF has ${pageCount} pages`);

  let transactions: RawTransaction[];
  
  if (pageCount > 5) {
    // Use parallel processing for large PDFs
    console.log('Using parallel processing for large PDF...');
    const chunks = await splitPdfIntoChunks(pdfBase64, 4);
    transactions = await parseChunksParallel(chunks);
  } else {
    // Use original single-request processing for small PDFs
    console.log('Using single-request processing for small PDF...');
    transactions = await parseSingleRequest(pdfBase64);
  }

  const processingTimeMs = Date.now() - startTime;
  const lowConfidenceCount = transactions.filter(t => t.confidence < 0.8).length;

  // Calculate totals for diagnostics
  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  console.log('=== PARSING COMPLETE ===');
  console.log(`Transactions: ${transactions.length}`);
  console.log(`Total debits: $${totalDebits.toFixed(2)}`);
  console.log(`Total credits: $${totalCredits.toFixed(2)}`);
  console.log(`Processing time: ${processingTimeMs}ms`);
  console.log('========================');

  return {
    transactions,
    bankName: null,  // Not available in parallel mode
    accountType: 'unknown',
    period: { start: null, end: null },
    statementTotals: {
      totalDebits: null,
      totalCredits: null,
      endingBalance: null,
    },
    pageCount,
    parsingMetadata: {
      totalTransactionsFound: transactions.length,
      lowConfidenceCount,
      processingTimeMs,
    },
  };
}

// Original single-request parsing (renamed from the existing function body)
async function parseSingleRequest(pdfBase64: string): Promise<RawTransaction[]> {
  const systemPrompt = `You are a precise financial document parser. Extract transaction data from bank statements with high accuracy. Always respond with valid JSON matching the exact schema provided. Never make up transactions - only extract what you can clearly see in the document.`;

  const userPrompt = `Analyze this bank statement PDF and extract ALL transactions from EVERY page.

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
  ]
}

RULES:
1. SCAN ALL PAGES of the PDF
2. Date format must be YYYY-MM-DD
3. Amount must be a positive number. Use type to indicate debit vs credit.
4. For credits: payments received, deposits, refunds
5. For debits: purchases, withdrawals, fees
6. Confidence: 1.0 = clear, 0.8 = some ambiguity, 0.5 = uncertain

Respond with ONLY the JSON object, no markdown.`;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 16000,
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
    if (jsonText.startsWith('```json')) jsonText = jsonText.slice(7);
    if (jsonText.startsWith('```')) jsonText = jsonText.slice(3);
    if (jsonText.endsWith('```')) jsonText = jsonText.slice(0, -3);
    parsed = JSON.parse(jsonText.trim());
  } catch (e) {
    console.error('Failed to parse Claude response:', textBlock.text);
    throw new Error('Invalid JSON response from Claude');
  }

  return parsed.transactions || [];
}

