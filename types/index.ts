// Raw transaction extracted from PDF by Claude
export interface RawTransaction {
  date: string;           // Format: YYYY-MM-DD
  description: string;    // Full transaction description
  amount: number;         // Always positive number
  type: 'debit' | 'credit';
  confidence: number;     // 0-1, how confident Claude is about this transaction
}

// Result from PDF parsing
export interface ParsedStatement {
  transactions: RawTransaction[];
  bankName: string | null;
  accountType: 'checking' | 'savings' | 'credit' | 'unknown';
  period: {
    start: string | null;  // YYYY-MM-DD
    end: string | null;    // YYYY-MM-DD
  };
  statementTotals: {
    totalDebits: number | null;
    totalCredits: number | null;
    endingBalance: number | null;
  };
  parsingMetadata: {
    totalTransactionsFound: number;
    lowConfidenceCount: number;
    processingTimeMs: number;
  };
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  totalDebitsMatch: boolean | null;
  totalCreditsMatch: boolean | null;
  discrepancyAmount: number | null;
  warnings: string[];
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  validation?: ValidationResult;
  error?: string;
}
