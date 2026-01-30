import Anthropic from '@anthropic-ai/sdk';
import pLimit from 'p-limit';
import { PdfChunk } from './pdf-chunker';
import { RawTransaction } from '@/types';

const limit = pLimit(3);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Use the same model as your main parser for consistency
const MODEL_ID = 'claude-haiku-4-5-20251001';

async function parseChunk(chunk: PdfChunk): Promise<RawTransaction[]> {
  const startTime = Date.now();
  console.log(`[Chunk ${chunk.chunkIndex + 1}/${chunk.totalChunks}] Starting (pages ${chunk.pageRange.start}-${chunk.pageRange.end})`);

  const response = await anthropic.messages.create({
    model: MODEL_ID,
    max_tokens: 8000,
    system: 'You are a precise financial document parser. Extract transaction data from bank statements with high accuracy. Always respond with valid JSON. Never make up transactions.',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: chunk.base64,
            },
          },
          {
            type: 'text',
            text: `Extract ALL transactions from this bank statement section (pages ${chunk.pageRange.start}-${chunk.pageRange.end}).

Return a JSON array of transactions with this EXACT format:
[
  {
    "date": "YYYY-MM-DD",
    "description": "exact description from statement",
    "amount": 123.45,
    "type": "debit",
    "confidence": 0.95
  }
]

RULES:
1. Date format MUST be YYYY-MM-DD
2. Amount MUST be a POSITIVE number in USD (no negative signs)
3. Use "type": "debit" for purchases, withdrawals, fees
4. Use "type": "credit" for deposits, refunds, payments received
5. Confidence: 1.0 = clear, 0.8 = some ambiguity, 0.5 = uncertain
6. Do NOT include pending transactions
7. IMPORTANT: If there is a foreign currency column (e.g., "264.48 Mexican Pesos"), IGNORE it. Only use the USD Amount column.

Return ONLY the JSON array. No markdown, no explanation.
If no transactions on these pages, return: []`
          }
        ],
      }
    ],
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[Chunk ${chunk.chunkIndex + 1}/${chunk.totalChunks}] Completed in ${elapsed}s`);

  const content = response.content[0];
  if (content.type !== 'text') {
    console.warn(`[Chunk ${chunk.chunkIndex + 1}] Unexpected response type`);
    return [];
  }

  try {
    let jsonStr = content.text.trim();
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
    
    const transactions = JSON.parse(jsonStr.trim());
    console.log(`[Chunk ${chunk.chunkIndex + 1}] Found ${transactions.length} transactions`);
    
    // Validate each transaction matches expected format
    return transactions.filter((t: any) => {
      const isValid = 
        typeof t.date === 'string' &&
        typeof t.description === 'string' &&
        typeof t.amount === 'number' &&
        t.amount >= 0 &&  // Must be positive!
        (t.type === 'debit' || t.type === 'credit') &&
        typeof t.confidence === 'number';
      
      if (!isValid) {
        console.warn(`[Chunk ${chunk.chunkIndex + 1}] Skipping invalid transaction:`, t);
      }
      return isValid;
    });
  } catch (e) {
    console.error(`[Chunk ${chunk.chunkIndex + 1}] JSON parse error:`, e);
    return [];
  }
}

export async function parseChunksParallel(chunks: PdfChunk[]): Promise<RawTransaction[]> {
  const startTime = Date.now();
  console.log(`\n🚀 Starting parallel parsing of ${chunks.length} chunks (max 2 concurrent)...\n`);

  const results = await Promise.all(
    chunks.map(chunk => limit(() => parseChunk(chunk)))
  );

  // Flatten and deduplicate
  const allTransactions = results.flat();
  const seen = new Set<string>();
  const uniqueTransactions = allTransactions.filter(t => {
    const key = `${t.date}|${t.description}|${t.amount}|${t.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Parallel parsing complete in ${totalTime}s`);
  console.log(`   Total transactions: ${uniqueTransactions.length} (${allTransactions.length - uniqueTransactions.length} duplicates removed)\n`);

  return uniqueTransactions;
}

