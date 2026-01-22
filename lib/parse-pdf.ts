import { RawTransaction, ParsedStatement } from '@/types';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Dynamic import to avoid webpack issues with pdf-parse
  const pdfParseModule = await import('pdf-parse');
  const pdfParse = (pdfParseModule as any).default || pdfParseModule;
  const data = await pdfParse(buffer);
  return data.text;
}

export function parseTransactions(text: string): RawTransaction[] {
  const transactions: RawTransaction[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Pattern: MM/DD or MM/DD/YY or MM/DD/YYYY followed by text and amount
    const match = line.match(/(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\s+(.+?)\s+(-?\$?[\d,]+\.\d{2})\s*$/);
    
    if (match) {
      const [, date, description, amountStr] = match;
      const cleanAmount = amountStr.replace(/[$,]/g, '');
      const amount = parseFloat(cleanAmount);
      
      transactions.push({
        date: date.trim(),
        description: description.trim(),
        amount: Math.abs(amount),
        type: amount < 0 || amountStr.includes('-') ? 'debit' : 'credit',
      });
    }
  }
  
  return transactions;
}

export function detectBankName(text: string): string | null {
  const banks = ['Chase', 'Bank of America', 'Wells Fargo', 'Capital One', 'Citi', 'American Express', 'Discover'];
  const lowerText = text.toLowerCase();
  
  for (const bank of banks) {
    if (lowerText.includes(bank.toLowerCase())) {
      return bank;
    }
  }
  return null;
}

export function detectDateRange(text: string): { start: string | null; end: string | null } {
  const match = text.match(/statement\s+period[:\s]+(\d{1,2}\/\d{1,2}\/?\d{0,4})\s*[-–to]+\s*(\d{1,2}\/\d{1,2}\/?\d{0,4})/i);
  if (match) {
    return { start: match[1], end: match[2] };
  }
  return { start: null, end: null };
}

export async function parseStatement(buffer: Buffer): Promise<ParsedStatement> {
  const rawText = await extractTextFromPDF(buffer);
  const transactions = parseTransactions(rawText);
  const bankName = detectBankName(rawText);
  const period = detectDateRange(rawText);

  console.log('Parsed PDF:', { transactionCount: transactions.length, bankName, textLength: rawText.length });

  return {
    transactions,
    bankName,
    accountType: null,
    period,
    rawText,
  };
}
