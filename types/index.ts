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

// Spending categories
export type Category = 
  | 'food_dining'
  | 'groceries'
  | 'shopping'
  | 'transportation'
  | 'subscriptions'
  | 'bills_utilities'
  | 'entertainment'
  | 'health_fitness'
  | 'travel'
  | 'income'
  | 'transfer'
  | 'other';

// Category display info
export interface CategoryInfo {
  id: Category;
  label: string;
  color: string;
  icon: string;
}

// Categorized transaction (extends RawTransaction)
export interface CategorizedTransaction extends RawTransaction {
  category: Category;
  merchant: string;
  isRecurring: boolean;
  needsReview: boolean;
}

// Detected subscription
export interface Subscription {
  name: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'yearly';
  lastCharge: string;
  category: 'streaming' | 'software' | 'fitness' | 'news' | 'gaming' | 'other';
  confidence: number;
}
