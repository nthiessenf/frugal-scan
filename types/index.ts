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

// AI-generated insight
export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'positive';
  category?: Category;
  amount?: number;
}

// Savings recommendation
export interface SavingsTip {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: 'immediate' | 'monthly' | 'yearly';
}

// Spending summary statistics
export interface SpendingSummary {
  totalSpent: number;
  totalIncome: number;
  netCashFlow: number;
  transactionCount: number;
  averageTransaction: number;
  topCategory: Category;
  topCategoryAmount: number;
  subscriptionTotal: number;
  periodDays: number;
}

// Category breakdown for charts
export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
  transactionCount: number;
}

// Top merchant info
export interface TopMerchant {
  name: string;
  amount: number;
  count: number;
  category: Category;
}

// Full analysis result (everything combined)
export interface AnalysisResult {
  summary: SpendingSummary;
  categoryBreakdown: CategoryBreakdown[];
  topMerchants: TopMerchant[];
  subscriptions: Subscription[];
  insights: Insight[];
  tips: SavingsTip[];
  generatedAt: string;
}
